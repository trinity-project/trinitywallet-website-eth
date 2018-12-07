<template>
  <div class="addChannelBox">
    <headBox/>
    <div class="contentBox">
        <div>
          <p v-if="addChannelForm.assetType" style="float:right;margin: 5px 30px 5px 0;font-size: 16px;">{{ $t('addChannel.assetBalance') }}：{{ $store.state.vuexStore.balanceData.Chain[addChannelForm.assetType] }}{{ addChannelForm.assetType }}</p>
          <h2 class="title_h2" style="margin:0 30px;">{{ $t('addChannel.title') }}</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;margin: 6px 30px;" />
        <div class="formBox">
          <el-form :model="addChannelForm" status-icon :rules="addChannelRules" ref="addChannelForm" label-position="top" class="addChannelForm">
            <el-form-item :label="$t('addChannel.otherUri')" prop="uri">
              <el-input v-model="addChannelForm.uri" auto-complete="off" :placeholder="$t('addChannel.otherUriPlaceHolder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addChannel.assetType')" prop="assetType">
              <el-select v-model="addChannelForm.assetType" :placeholder="$t('addChannel.chooseAssetType')" style="width:100%;">
                <template v-if="$store.state.vuexStore.baseChain == 'ETH'">
                  <el-option label="TNC" value="TNC"></el-option>
                  <el-option label="ETH" value="ETH" disabled></el-option>
                </template>
                <template v-if="$store.state.vuexStore.baseChain == 'NEO'">
                  <el-option label="TNC" value="TNC"></el-option>
                  <el-option label="NEO" value="NEO"></el-option>
                  <el-option label="GAS" value="GAS"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('addChannel.selfDeposit')" prop="selfDeposit">
              <el-input v-model.number="addChannelForm.selfDeposit"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="$store.state.vuexStore.baseChain == 'ETH'" :label="$t('addChannel.otherDeposit')" prop="otherDeposit">
              <el-slider v-model="addChannelForm.otherDeposit" :show-input-controls="false" :max="addChannelForm.selfDeposit" :step="0.00001" show-input ></el-slider>
            </el-form-item>
            <el-form-item :label="$t('addChannel.alice')" prop="alice">
              <el-input v-model="addChannelForm.alice" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addChannel.password')" prop="keyStorePass">
              <el-input v-model="addChannelForm.keyStorePass" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;margin-bottom:10%;">
              <el-button type="primary" @click="addChannel()">{{ $t('addChannel.addChannel') }}</el-button>
              <el-button @click="removeAddChannelData()">{{ $t('addChannel.cancel') }}</el-button>
            </div>
          </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'addChannelForm',
  data () {
    var checkUri = (rule, value, callback) => {         //add Channel Uri输入规则
      let _this = this;
      if (!value) {
        return callback(new Error(_this.$t('addChannel.callback-1')));
      } else {
        if (value.indexOf('@') <= -1 || value.indexOf(':') <= -1) {
            callback(new Error(_this.$t('addChannel.callback-2')));
          } else {
            if(_this.baseChain == "ETH"){                  //当前为ETH钱包时
              if(value.split('@')[0].length !== 42){
                callback(new Error(_this.$t('addChannel.callback-2')));
              }
            } else if(_this.baseChain == "NEO"){                  //当前为NEO钱包时
              if(value.split('@')[0].length !== 66){
                callback(new Error(_this.$t('addChannel.callback-2')));
              }
            }
            _this.$store.state.vuexStore.channelList.forEach(function(val,index){    //判断是否已有通道
              if(val.OtherUri === _this.addChannelForm.uri){
                callback(new Error(_this.$t('addChannel.callback-3')));
              }
            });
            callback();
        }
      }
    };
    var checkAssetType = (rule, value, callback) => {     //add Channel assetType输入规则
      if (value === '') {
        callback(new Error(this.$t('index.inputAssetType')));
      } else {
        callback();
      }
    };
    var checkSelfDeposit = (rule, value, callback) => {         //add Channel 本端Deposit输入规则
      if (value === '') {
        callback(new Error(this.$t('addChannel.callback-4')));
      } else {
        if (value <= 0) {
          callback(new Error(this.$t('addChannel.callback-5')));
        } else {
          if(value > this.$store.state.vuexStore.balanceData.Chain[this.addChannelForm.assetType]){
            callback(new Error(this.$t('addChannel.callback-6')));
          } else {
            if(String(value).indexOf(".") > -1){              //判断是否为小数,若为小数,则限制小数长度为8位
              let length = String(value).indexOf(".") + 1;//获取小数点的位置
              var num = String(value).length - length;//获取小数点后的个数
              if(num > 8){
                  callback(new Error(this.$t('addChannel.callback-7')));
              } else {
                  callback();
              }
            } else {      //若不为小数则通过
              callback();
            }
          }
        }
      }
    };
    var checkOtherDeposit = (rule, value, callback) => {          //add Channel 对端Deposit输入规则
      if (value === '') {
        callback(new Error(this.$t('addChannel.callback-8')));
      } else {
        if (value <= 0) {
          callback(new Error(this.$t('addChannel.callback-9')));
        } else {
            callback();
          }
      }
    };
    var checkAlice = (rule, value, callback) => {         //add Channel Alice输入规则
      if (value === '') {
        callback(new Error(this.$t('addChannel.callback-10')));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('common.callback-1')));
      } else {
        let PrivateKey;
        if(this.baseChain == "ETH"){                  //当前为ETH钱包时
          console.log(this.$store.state.vuexStore.walletInfo);
          console.log(value);
          PrivateKey = this.$parent.$parent.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
        } else if (this.baseChain == "NEO"){                  //当前为ETH钱包时
          PrivateKey = scrypt_module_factory(DecryptWalletByPassword, {}, {
              'WalletScript': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
              'password': value,
              'address': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
          });
        }
        setTimeout(() => {
          if(PrivateKey){
            callback();
          } else {
            return callback(new Error(this.$t('common.callback-2')));
          }
        }, 300);
      }
    };
    return {
      addChannelForm: {
        uri: '',
        assetType: '',
        selfDeposit: 0,
        otherDeposit: 0,
        alice: '',
        channelName: '',
        selfSignedData: '',
        txData: '',
        keyStorePass: ''
      },
      addChannelRules: {        //add Channnel输入规则
        uri: [
          { validator: checkUri, trigger: 'blur' }
        ],
        assetType: [
          { validator: checkAssetType, trigger: 'change' }
        ],
        selfDeposit: [
          { validator: checkSelfDeposit, trigger: 'blur' }
        ],
        otherDeposit: [
          { validator: checkOtherDeposit, trigger: 'change' }
        ],
        alice: [
          { validator: checkAlice, trigger: 'blur' }
        ],
        keyStorePass: [
          { validator: checkKeyStorePass, trigger: 'blur' }
        ],
      }
    }
  },
  components: {
    headBox
  },
  computed: {
    baseChain(){                                    //底层链
      return this.$store.state.vuexStore.baseChain;
    },
    keyStore() {                                    //keyStore
      return this.$store.state.vuexStore.walletInfo.keyStore;
    },
    spvPort() {                                     //spv端口号
      return this.$store.state.vuexStore.spvPort;
    },
    NetMagic() {                                    //NetMagic
      return this.$store.state.vuexStore.NetMagic;
    },
    isTestNet() {                                   //isTestNet
      return this.$store.state.vuexStore.isTestNet;
    }
  },
  mounted() {
    this.$nextTick(function(){
      if(this.$route.params.Uri){         //检测路由是否带参数，用于联系人页面直接转账
        this.addChannelForm.uri = this.$route.params.Uri;
      }
    })
  },
  methods: {
    addChannel() {
      let _this = this;
      _this.$refs['addChannelForm'].validate((valid) => {
        if (valid) {
         if (_this.baseChain == "ETH"){                 //当前为ETH钱包时
          var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
          console.log(l);
          let date = new Date().getTime();        //获取当前时间戳
          let founderDeposit = _this.addChannelForm.selfDeposit.mul(10e7);
          let peerUri = _this.addChannelForm.uri;
          let peerDeposit = _this.addChannelForm.otherDeposit.mul(10e7);
          let TxNonce = 1;                                                                 //创建通道TxNonce为1
          let assetType = _this.addChannelForm.assetType;
          let Ip = _this.$parent.$parent.uri2Ip(peerUri, _this.spvPort);                   //截取对端Uri的Ip
          let founderUri = _this.$store.state.vuexStore.walletInfo.address + "@" + Ip;     //得到本端URI
          let ChannelNamePart1 = md5encode(peerUri, date);
          let ChannelNamePart2 = md5encode(founderUri, date); 
          let channelName = "0x" + ChannelNamePart1 + ChannelNamePart2;                    //生成ChannelName
          let keyStorePass = _this.addChannelForm.keyStorePass;
          console.log(channelName);

          const wsuri = "ws://" + Ip + "/";               //建立websocket连接
          var webSocketInfo = {
            "Ip": _this.$parent.$parent.uri2Ip(peerUri, null),
            "websock": new WebSocket(wsuri)
          }
          webSocketInfo.websock.onmessage = _this.$parent.$parent.websocketOnmessage;
          webSocketInfo.websock.onclose = _this.$parent.$parent.websocketClose;
          console.log(webSocketInfo);
          _this.$store.state.vuexStore.webSocketList.push(webSocketInfo);

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
            {t: 'bytes32', v: channelName},                               //通道名称
            {t: 'uint256', v: TxNonce},                                   //TXnonce
            {t: 'address', v: founderUri.split('@')[0]},                  //本端地址
            {t: 'uint256', v: founderDeposit},                            //本端押金
            {t: 'address', v: peerUri.split('@')[0]},                     //对端地址
            {t: 'uint256', v: peerDeposit}                                //对端押金
          );
          console.log(txData);
          
          let decryptPK = _this.$parent.$parent.decryptPrivateKey(_this.keyStore, keyStorePass);        //解锁钱包用于签名          
          let selfSignedData = ecSign(txData, decryptPK.privateKey);         //签名
          console.log(selfSignedData); 

          var Message = {         //创建通道消息体
            "MessageType": "Founder",
            "Sender": founderUri,
            "Receiver": peerUri,
            "TxNonce": TxNonce,
            "ChannelName": channelName,
            "NetMagic": _this.NetMagic,
            "AssetType" : assetType,
            "MessageBody": {
                "FounderDeposit": founderDeposit,
                "PartnerDeposit": peerDeposit,
                "Commitment": selfSignedData
            }
          }
          setTimeout(function (){
            _this.$parent.$parent.sendWebsocket(peerUri, Message);        //发送websocket消息
          }, 2000);
          
          _this.addChannelForm.channelName = channelName;
          _this.addChannelForm.txData = txData;         //将txData保存,用于验证返回的签名
          _this.addChannelForm.selfSignedData = selfSignedData;         //保存本端签名信息,用于后续上链
          _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //保存信息,用于后续信息来回传输
          console.log(_this.$store.state.vuexStore.addChannelInfo);
          _this.$store.state.vuexStore.walletInfo.keyStorePass = keyStorePass;

          let channelInfo = {
            ChannelName: channelName,                                       //通道名字
            Alice: _this.addChannelForm.alice,                              //通道昵称
            State: 2,                                                       //通道初始状态
            isConnect: true,                                                //是否连接上websocket
            SelfBalance: founderDeposit,                                    //本端余额
            OtherBalance: peerDeposit,                                      //对端余额
            assetType : assetType,                                          //资产类型
            isTestNet: _this.isTestNet,                                     //是否为测试网
            SelfUri: founderUri,                                            //本端Uri
            OtherUri: peerUri,                                           //对端Uri
            TxNonce: TxNonce,                                               //交易次数
            date: date,                                                     //时间戳
            Ip: _this.$parent.$parent.uri2Ip(peerUri, null),                //IP
          }
          _this.$store.state.vuexStore.channelList[l] = channelInfo;

          _this.$parent.$parent.StoreData("channelList");         //储存通道信息
          _this.$router.push('/channel/channelList');       //跳转到channelList页面
         } else if (_this.baseChain == "NEO"){                 //当前为NEO钱包时
            let Ip = _this.$parent.$parent.uri2Ip(_this.addChannelForm.uri, _this.$store.state.vuexStore.spvPort);    //截取对端Uri的Ip
            const wsuri = "ws://" + Ip + "/";               //建立websocket连接
            var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
            console.log(l);
            let SelfUri = _this.$store.state.vuexStore.NEOwalletInfo.publicKey + "@" + Ip;     //得到本端URI
            let OtherPublicKey = _this.addChannelForm.uri.split('@')[0];                       //截取对端URI得到对端公钥
            let date = new Date().getTime();        //获取当前时间戳
            _this.addChannelForm.channelName = md5encode(_this.addChannelForm.uri, date);                  //NEO ChannelName加密方式
            console.log(_this.addChannelForm.channelName);

            // var channelInfo = {
            //   "websock":new WebSocket(wsuri)
            // }
            // console.log(channelInfo);
            // _this.$store.state.vuexStore.channelList.push(channelInfo);
            // _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.$parent.$parent.websocketOnmessage;
            // _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.$parent.$parent.websocketClose;

            var webSocketInfo = {
              "Ip": _this.$parent.$parent.uri2Ip(_this.addChannelForm.uri,null),
              "websock": new WebSocket(wsuri)
            }
            webSocketInfo.websock.onmessage = _this.$parent.$parent.websocketOnmessage;
            webSocketInfo.websock.onclose = _this.$parent.$parent.websocketClose;
            console.log(webSocketInfo);
            _this.$store.state.vuexStore.webSocketList.push(webSocketInfo);

            var Message = {
              "MessageType":"RegisterChannel",
              "Sender": SelfUri,
              "Receiver": _this.addChannelForm.uri,
              "ChannelName": _this.addChannelForm.channelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "MessageBody": {
                  "AssetType" : _this.addChannelForm.assetType,
                  "Deposit": parseFloat(_this.addChannelForm.selfDeposit)
              }
            }
            setTimeout(function (){
              _this.$parent.$parent.sendWebsocket(_this.addChannelForm.uri, Message);        //发送websocket消息
            }, 2000);
            
            _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //保存信息,用于后续信息来回传输
            console.log(_this.$store.state.vuexStore.addChannelInfo);

            let channelInfo = {
              ChannelName: _this.addChannelForm.channelName,                  //通道名字
              Alice: _this.addChannelForm.alice,                              //通道昵称
              State: 2,                                                       //通道初始状态
              isConnect: true,                                                //是否连接上websocket
              SelfBalance: _this.addChannelForm.selfDeposit.mul(10e7),        //本端余额
              OtherBalance: _this.addChannelForm.otherDeposit.mul(10e7),      //对端余额
              assetType : _this.addChannelForm.assetType,                     //资产类型
              isTestNet: _this.$store.state.vuexStore.isTestNet,              //是否为测试网
              SelfUri: SelfUri,                                               //本端Uri
              OtherUri: _this.addChannelForm.uri,                             //对端Uri
              TxNonce: 1,                                                     //交易次数
              date: date,                                                     //时间戳
              Ip: _this.$parent.$parent.uri2Ip(_this.addChannelForm.uri,null),//IP
            }
            _this.$store.state.vuexStore.channelList[l] = channelInfo;

            _this.$parent.$parent.StoreData("channelList");         //储存通道信息
            _this.$router.push('/channel/channelList');       //跳转到channelList页面
         }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeAddChannelData() {      //清除AddChannelData
      this.$refs['addChannelForm'].resetFields();
      this.$router.push('/channel/channelList');
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addChannelBox{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.contentBox{
    height: calc(100% - 44px);
    width: 100%;
    padding: 30px 0;
}
.formBox{
    height: calc(100% - 73px);
    width: 100%;
    padding: 0px 30px 56px;
    box-sizing: border-box;
    overflow-x: hidden;
}
.contentBox .addChannelForm{
    width:100%;
    max-width: 420px;
}
button{
    width: 40%;
}
</style>
