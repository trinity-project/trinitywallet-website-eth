<template>
  <div class="addChannelBox">
    <div class="contentBox">
        <div>
          <p v-if="addChannelForm.assetType" style="float:right;margin: 5px 0;font-size: 16px;">{{ $t('addChannel.assetBalance') }}：{{ $store.state.vuexStore.balanceData.Chain[addChannelForm.assetType] }}{{ addChannelForm.assetType }}</p>
          <h2>{{ $t('addChannel.title') }}</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="addChannelForm" status-icon :rules="addChannelRules" ref="addChannelForm" label-width="100px" class="addChannelForm">
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
            <el-slider v-model="addChannelForm.otherDeposit" :show-input-controls="false" :max="addChannelForm.selfDeposit" :step="0.00000001" show-input ></el-slider>
          </el-form-item>
          <el-form-item :label="$t('addChannel.alice')" prop="alice">
            <el-input v-model="addChannelForm.alice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('addChannel.password')" prop="keyStorePass">
            <el-input v-model="addChannelForm.keyStorePass" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addChannel()" style="margin-left:-100px;">{{ $t('addChannel.addChannel') }}</el-button>
            <el-button @click="removeAddChannelData()">{{ $t('addChannel.cancel') }}</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
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
            if(_this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
              if(value.split('@')[0].length !== 42){
                callback(new Error(_this.$t('addChannel.callback-2')));
              }
            } else if(_this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为NEO钱包时
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
        callback(new Error(_this.$t('addChannel.callback-10')));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('common.callback-1')));
      } else {
        let PrivateKey;
        if(this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
          PrivateKey = this.$parent.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
        } else if (this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为ETH钱包时
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
        }, 1000);
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
  methods: {
    addChannel() {
      let _this = this;
      _this.$refs['addChannelForm'].validate((valid) => {
        if (valid) {
         if (_this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
          let Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri,8866);       //截取对端Uri的Ip
          const wsuri = "ws://" + Ip + "/";               //建立websocket连接
          var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
          console.log(l);
          let SelfUri = _this.$store.state.vuexStore.walletInfo.address + "@" + Ip;     //得到本端URI
          let OtherAddress = _this.addChannelForm.uri.split('@')[0];      //截取对端URI得到对端地址
          let date = new Date().getTime();        //获取当前时间戳
          let ChannelNamePart1 = md5encode(_this.addChannelForm.uri, date);
          let ChannelNamePart2 = md5encode(SelfUri, date);
          _this.addChannelForm.channelName = "0x" + ChannelNamePart1 + ChannelNamePart2;       //生成ChannelName
          console.log(_this.addChannelForm.channelName);

          var channelInfo = {
            "websock":new WebSocket(wsuri)
          }
          console.log(channelInfo);
          _this.$store.state.vuexStore.channelList.push(channelInfo);
          _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.$parent.websocketOnmessage;
          _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.$parent.websocketClose;

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
            {t: 'bytes32', v: _this.addChannelForm.channelName},    //通道名称
            {t: 'uint256', v: 1},                                   //TXnonce
            {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},       //本端地址
            {t: 'uint256', v: _this.addChannelForm.selfDeposit.mul(10e7)},       //本端押金
            {t: 'address', v: OtherAddress},                                  //对端地址
            {t: 'uint256', v: _this.addChannelForm.otherDeposit.mul(10e7)}       //对端押金
          );
          console.log(txData);
          _this.addChannelForm.txData = txData;         //将txData保存,用于验证返回的签名

          let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.addChannelForm.keyStorePass);        //解锁钱包用于签名          
          let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(selfSignedData); 
          _this.addChannelForm.selfSignedData = selfSignedData;         //保存本端签名信息,用于后续上链

          var Message = {         //创建通道消息体
            "MessageType": "Founder",
            "Sender": SelfUri,
            "Receiver": _this.addChannelForm.uri,
            "TxNonce": 1,
            "ChannelName": _this.addChannelForm.channelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "AssetType" : _this.addChannelForm.assetType,
            "MessageBody": {
                "FounderDeposit": _this.addChannelForm.selfDeposit.mul(10e7),
                "PartnerDeposit": _this.addChannelForm.otherDeposit.mul(10e7),
                "Commitment": _this.addChannelForm.selfSignedData
            }
          }
          setTimeout(function (){
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
          }, 2000);
          
          _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //保存信息,用于后续信息来回传输
          console.log(_this.$store.state.vuexStore.addChannelInfo);

          _this.$store.state.vuexStore.channelList[l].ChannelName = _this.addChannelForm.channelName;     //通道名字
          _this.$store.state.vuexStore.channelList[l].Alice = _this.addChannelForm.alice;       //通道昵称
          _this.$store.state.vuexStore.channelList[l].State = 2;            //通道初始状态
          _this.$store.state.vuexStore.channelList[l].isConnect = true;         //是否连接上websocket
          _this.$store.state.vuexStore.channelList[l].SelfBalance = _this.addChannelForm.selfDeposit.mul(10e7);      //本端余额
          _this.$store.state.vuexStore.channelList[l].OtherBalance = _this.addChannelForm.otherDeposit.mul(10e7);     //对端余额
          _this.$store.state.vuexStore.channelList[l].assetType = _this.addChannelForm.assetType;     //资产类型
          _this.$store.state.vuexStore.channelList[l].isTestNet = _this.$store.state.vuexStore.isTestNet;             //是否为测试网
          _this.$store.state.vuexStore.channelList[l].SelfUri = SelfUri;            //本端Uri
          _this.$store.state.vuexStore.channelList[l].OtherUri = _this.addChannelForm.uri;        //对端Uri
          _this.$store.state.vuexStore.channelList[l].TxNonce = 1;                  //交易次数
          _this.$store.state.vuexStore.channelList[l].date = date;                  //时间戳
          _this.$store.state.vuexStore.channelList[l].Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri,null);       //IP
          //_this.$store.state.vuexStore.channelList[l].blockNumber = 0;                        //settle块高
          // _this.$store.state.vuexStore.channelList[l].unconfirmed = {};                       //未确认的交易信息
          // _this.$store.state.vuexStore.channelList[l].unconfirmed.selfSignedData = "";
          // _this.$store.state.vuexStore.channelList[l].unconfirmed.otherSignedData = "";
          // _this.$store.state.vuexStore.channelList[l].confirmed = {};                         //已确认的交易信息
          // _this.$store.state.vuexStore.channelList[l].confirmed.isFounder = true;
          // _this.$store.state.vuexStore.channelList[l].confirmed.selfSignedData = "";
          // _this.$store.state.vuexStore.channelList[l].confirmed.otherSignedData = "";

          _this.$parent.StoreData("channelList");         //储存通道信息
          _this.$router.push('/channelList');       //跳转到channelList页面

          return;
         } else if (_this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
            let Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri, _this.$store.state.vuexStore.spvPortNEO);       //截取对端Uri的Ip
            const wsuri = "ws://" + Ip + "/";               //建立websocket连接
            var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
            console.log(l);
            let SelfUri = _this.$store.state.vuexStore.NEOwalletInfo.publicKey + "@" + Ip;     //得到本端URI
            let OtherPublicKey = _this.addChannelForm.uri.split('@')[0];                       //截取对端URI得到对端公钥
            let date = new Date().getTime();        //获取当前时间戳
            _this.addChannelForm.channelName = md5encode(_this.addChannelForm.uri, date);                  //NEO ChannelName加密方式
            console.log(_this.addChannelForm.channelName);

            var channelInfo = {
              "websock":new WebSocket(wsuri)
            }
            console.log(channelInfo);
            _this.$store.state.vuexStore.channelList.push(channelInfo);
            _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.$parent.websocketOnmessage;
            _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.$parent.websocketClose;

            var Message = {         //创建通道消息体
              "MessageType": "Founder",
              "Sender": SelfUri,
              "Receiver": _this.addChannelForm.uri,
              "TxNonce": 1,
              "ChannelName": _this.addChannelForm.channelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "AssetType" : _this.addChannelForm.assetType,
              "MessageBody": {
                  "FounderDeposit": _this.addChannelForm.selfDeposit.mul(10e7),
                  "PartnerDeposit": _this.addChannelForm.otherDeposit.mul(10e7),
                  "Commitment": _this.addChannelForm.selfSignedData
              }
            }
            var Message = {
              "MessageType":"RegisterChannel",
              "Sender": SelfUri,
              "Receiver": _this.addChannelForm.uri,
              "ChannelName": _this.addChannelForm.channelName,
              "Magic": _this.$store.state.vuexStore.NetMagic,
              "MessageBody": {
                  "AssetType" : _this.addChannelForm.assetType,
                  "Deposit": parseFloat(_this.addChannelForm.selfDeposit)
              }
            }
            setTimeout(function (){
                _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
            }, 2000);
            
            _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //保存信息,用于后续信息来回传输
            console.log(_this.$store.state.vuexStore.addChannelInfo);

            _this.$store.state.vuexStore.channelList[l].ChannelName = _this.addChannelForm.channelName;     //通道名字
            _this.$store.state.vuexStore.channelList[l].Alice = _this.addChannelForm.alice;       //通道昵称
            _this.$store.state.vuexStore.channelList[l].State = 2;                                //通道初始状态
            _this.$store.state.vuexStore.channelList[l].isConnect = true;                         //是否连接上websocket
            _this.$store.state.vuexStore.channelList[l].SelfBalance = _this.addChannelForm.selfDeposit.mul(10e7);      //本端余额
            _this.$store.state.vuexStore.channelList[l].OtherBalance = _this.addChannelForm.otherDeposit.mul(10e7);     //对端余额
            _this.$store.state.vuexStore.channelList[l].assetType = _this.addChannelForm.assetType;     //资产类型
            _this.$store.state.vuexStore.channelList[l].isTestNet = _this.$store.state.vuexStore.isTestNet;             //是否为测试网
            _this.$store.state.vuexStore.channelList[l].SelfUri = SelfUri;            //本端Uri
            _this.$store.state.vuexStore.channelList[l].OtherUri = _this.addChannelForm.uri;        //对端Uri
            _this.$store.state.vuexStore.channelList[l].TxNonce = 1;                  //交易次数
            _this.$store.state.vuexStore.channelList[l].date = date;                  //时间戳
            _this.$store.state.vuexStore.channelList[l].Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri,null);       //IP
            _this.$store.state.vuexStore.channelList[l].blockNumber = 0;                        //settle块高
            _this.$store.state.vuexStore.channelList[l].baseChain = _this.$store.state.vuexStore.baseChain;             //底层链

            _this.$parent.StoreData("channelList");         //储存通道信息
            _this.$router.push('/channelList');       //跳转到channelList页面

         }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    CreateFounder() {

    },
    removeAddChannelData() {      //清除AddChannelData
      this.$refs['addChannelForm'].resetFields();
      this.$router.push('/channelList');
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addChannelBox{
    float: left;
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
.contentBox .addChannelForm{
    width:100%;
    max-width: 420px;
}
h2{
    margin: 0;
    font-size: 24px;
}
.fullPage{
    width: 100% !important;
}
</style>
