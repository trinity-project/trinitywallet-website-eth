<template>
  <div class="paymentBox">
    <div class="headBox">
      <div class="header-button is-left">
        
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
        <i class="notificationIcon el-icon-ETH-saoyisao"></i>
      </div>
    </div>
    <div class="assetBox">
      <div class="amountBox">
        <h3>TNC</h3>
        <h1>{{ $store.state.vuexStore.balanceData.Channel.TNC }}</h1>
      </div>
      <div class="addressBox">
        <el-row :gutter="20">
          <el-col :span="8" style="border-right: 1px solid #FFFFFF;">
            通道资产
          </el-col>
          <el-col :span="16">
            <router-link to="/channel/createPayment">
              创建收款码
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="contentBox">
        <h2>{{ $t('index.title') }}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;margin:8px 0;" />
        <el-form class="indexForm" ref="form">
          <label style="line-height: 28px;font-size: 16px;">{{ $t('index.paymentCode') }}:</label>
          <el-form-item style="margin-top:10px">
            <el-input type="textarea" rows="3" v-model.trim="paymentCode"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button class="transferBtn" type="primary" @click="decryptPaymentCode()">{{ $t('index.transfer') }}</el-button>
          </el-form-item>
        </el-form>
    </div>
    <el-dialog class="txOnChannelBox" :title="$t('index.transferOnChannel')" :visible.sync="ShowTxOnChannelBox" width="30%" center :modal-append-to-body='false'>
      <span>{{ $t('index.transfer-1') }}{{ txOnChannelInfo.receiverUri.split("@")[0] }}</span>
      <span style="color:#F56C6C;font-size: 16px;">{{ $t('index.transfer-2') }} {{ txOnChannelInfo.value / 10e7 }} {{ txOnChannelInfo.assetType }}</span>
      <el-form :model="txOnChannelInfo" status-icon :rules="txOnChannelRules" ref="txOnChannelInfo" label-width="90px" class="demo-ruleForm">
        <el-form-item :label="$t('index.password')" prop="keyStorePass">
          <el-input v-model="txOnChannelInfo.keyStorePass" type="password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTx()">{{ $t('index.transfer') }}</el-button>
        <el-button @click="ShowTxOnChannelBox = false">{{ $t('index.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'paymentBox',
  data () {
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('index.callback-7')));
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
            return callback(new Error(this.$t('index.callback-8')));
            }
        }, 1000);
      }
    };
    return {
        paymentCode: '',        //PaymentCode
        txOnChannelInfo: {      //通道转账
          "sendUri": '',
          "receiverUri": '',
          "netMagic": '',
          "hr": '',
          "assetType": '',
          "value": 0,
          "fee": 0,
          "description": '',
          "ChannelName": '',
          "keyStorePass": ''
        },
        txOnChannelRules: {       //链上转账规则
          keyStorePass: [
            { validator: checkKeyStorePass, trigger: 'blur' }
          ]
        },
        ShowTxOnChannelBox: false,      //是否显示通道转账窗口
    }
  },
  computed: {
    balanceData() {
        return this.$store.state.vuexStore.balanceData;
    }
  },
  filters:{
    formatAddress:function(val){
        var address;
        address = val.replace(/(.{10}).*(.{10})/,"$1......$2");
        return address;
    }
  },
  mounted() {
    this.$nextTick(function(){
      // this.getEthBalance();
      // this.getTncBalance();
      if(this.$route.params.address){         //检测路由是否带参数，用于联系人页面直接转账
        this.paymentCode = this.$route.params.address;
      }
    })
  },
  watch: {

  },
  methods: {
    decryptPaymentCode() {    //解析Payment Code
      let _this = this;
      if (_this.paymentCode.length == "") {       //判断paymentCode是否为空
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: _this.$t('index.callback-9'),
            duration: 3000
          });
          return;
      } else{
        if(_this.paymentCode.substr(0,2) == "TN"){        //判断开头是否为"TN",如是进入交易码解析
          console.log("进入通道交易");
            let LinkData;
            try {
              LinkData = base58decode(_this.paymentCode.substring(2)).toString();
            } catch (e) {
              _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('index.callback-11') + '1',
                duration: 3000
              });
              return false;
            } finally {

            }
            console.log(LinkData);
            if(LinkData.indexOf("&") > -1){           //判断linkData中是否有&隔离符
            let LinkDataList = LinkData.split("&");     //去除隔离符取出数据

            _this.txOnChannelInfo.receiverUri = LinkDataList[0];                  //uri
            _this.txOnChannelInfo.netMagic = LinkDataList[1];                           //NetMagic
            _this.txOnChannelInfo.hr = LinkDataList[2];                                 //hashR
            _this.txOnChannelInfo.assetType = LinkDataList[3];        //资产类型
            _this.txOnChannelInfo.value = LinkDataList[4];                 //支付金额
            _this.txOnChannelInfo.description = LinkDataList[5];                  //备注
            console.log(_this.txOnChannelInfo);
            if(_this.txOnChannelInfo.netMagic == _this.$store.state.vuexStore.NetMagic){          //判断NetMagic是否符合
              if (!web3.utils.isAddress(_this.txOnChannelInfo.receiverUri.split("@")[0])) {       //当地址解析错误时
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-11') + '2',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.hr == "") {          //当hashR解析错误时
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-11') + '3',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.assetType == "") {         //当资产类型解析错误时
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-11') + '4',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.value == 0) {        //当金额解析错误时
                _this.$notify.error({ 
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-11') + '5',
                  duration: 3000
                });
                return;
              } else if (_this.$store.state.vuexStore.walletInfo.address === _this.txOnChannelInfo.receiverUri.split("@")[0]) {   //当转账和收款地址相同时
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-10'),
                  duration: 3000
                });
                return;
              }
              _this.ShowTxOnChannelBox = true;      ///关闭通道交易窗口
            } else {                //如NetMagic错误,给出提示并返回
              _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('index.callback-12'),
                duration: 3000
              });
              return;
            }
          } else {                  //如果没有&隔离符,给出提醒 终止
            _this.$notify.error({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('index.callback-11'),
              duration: 3000
            });
            return false;
          }
        } else {      //开头不是"TN",判断是否为地址给出提示并返回
            if (_this.paymentCode.length === 42) {           //判断paymentCode是否为ETH地址
              if (_this.paymentCode === _this.$store.state.vuexStore.walletInfo.address){   //判断是否为本端地址
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-10'),
                  duration: 3000
                });
                return;
              } else {
                console.log("进入链上转账");
                return;
              }
            } else {
              _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('index.callback-11'),
                duration: 3000
              });
              return;
            }
        }
      }
    },
    confirmTx() {
      let _this = this;
      _this.$refs['txOnChannelInfo'].validate((valid) => {
        if (valid) {
          if(_this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
            if(_this.txOnChannelInfo.assetType == "ETH"){
              _this.txEthOnChannel();
            } else if (_this.txOnChannelInfo.assetType == "TNC") {
              _this.txTncOnChannel();
            }
          } else if (_this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为NEO钱包时
            _this.txTncOnChannel();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    txEthOnChannel() {
      console.log("进入通道交易ETH");
    },
    txTncOnChannel() {                    //加入NEO通道转账
      let _this = this;
      console.log("进入通道交易");

      if(_this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
        let l = _this.$parent.getChannelSerial("OtherUri",_this.txOnChannelInfo.receiverUri,'open',false);
        if(l >= 0){
          if(_this.$store.state.vuexStore.channelList[l].SelfBalance >= _this.txOnChannelInfo.value){
            _this.txOnChannelInfo.sendUri = _this.$store.state.vuexStore.channelList[l].SelfUri;      //赋值sendUri
            _this.txOnChannelInfo.ChannelName = _this.$store.state.vuexStore.channelList[l].ChannelName;    //赋值ChannelName
            console.log(l);
            let Message = {                       //构造Rsmc消息体
              "MessageType":"Rsmc",
              "Sender": _this.txOnChannelInfo.sendUri,
              "Receiver": _this.txOnChannelInfo.receiverUri,
              "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
              "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "AssetType": _this.txOnChannelInfo.assetType,
              "MessageBody": {
                "PaymentCount": _this.txOnChannelInfo.value,
                "SenderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) - Number(_this.txOnChannelInfo.value),
                "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.txOnChannelInfo.value),
                //"HashR": 0x0,
                "Commitment": "",
                "RoleIndex": 0
              },
              "Comments": {}
            }
            _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo;           //保存通道转账信息
            console.log(_this.$store.state.vuexStore.txOnChannelInfo);
            _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
            _this.ShowTxOnChannelBox = false;
            _this.clearTxData();
          } else {
            _this.$notify.error({
              title: _this.$t('common.info'),
              dangerouslyUseHTMLString: true,
              message:  _this.$t('index.callback-14'),
              duration: 3000
            });
            _this.ShowTxOnChannelBox = false;
            _this.clearTxData();
          }
        } else if (l == -1){        //未与该Uri直连,查询路由情况
          let i = -1;
          _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历通道列表,获取开通的通道
              if(data.State == 3 && data.isConnect == true){
                i = index;
                return;
              }
          })

          let UriList = [];
          _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历通道列表,获取uriList
              if(data.State == 3 && data.isConnect == true){
                UriList.push(data.OtherUri);
              }
          })
          console.log(UriList);

          if(i < 0){        //当l小于0时,未遍历到通道,给出提醒
            _this.$notify.error({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000
            });
            _this.ShowTxOnChannelBox = false;           //关闭当前窗口
            _this.clearTxData();                        //清空当前数据 
            return false;
          } else {      //遍历到开通的通道,进入Htlc交易
            console.log(i);
            _this.txOnChannelInfo.sendUri = _this.$store.state.vuexStore.channelList[i].SelfUri;            //赋值sendUri
            _this.txOnChannelInfo.ChannelName = _this.$store.state.vuexStore.channelList[i].ChannelName;    //赋值ChannelName
            let Message = {         //构造消息,查询通道路由
                "MessageType":"GetRouterInfo",
                "Sender": _this.txOnChannelInfo.sendUri,
                "Receiver": _this.txOnChannelInfo.receiverUri,
                "NetMagic": _this.$store.state.vuexStore.NetMagic,
                "AssetType": _this.txOnChannelInfo.assetType,
                "MessageBody":{
                    "NodeList": UriList,
                }
            }
            _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo;           //保存通道转账信息
            console.log(_this.$store.state.vuexStore.txOnChannelInfo);
            _this.$store.state.vuexStore.channelList[i].websock.send(JSON.stringify(Message));        //发送websocket消息
            _this.ShowTxOnChannelBox = false;           //关闭当前窗口
            _this.clearTxData();                        //清空当前数据  
          }
        } else if (l == -2){
          _this.ShowTxOnChannelBox = false;
          _this.clearTxData();
          return;
        } else {
            // _this.$notify.error({
            //   title: _this.$t('common.warning'),
            //   dangerouslyUseHTMLString: true,
            //   message: '未知错误,l值为' + l,
            //   duration: 3000
            // });
            return;
        }
      } else if(_this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为NEO钱包时
      
      }
    },
    clearTxData() {       //清空转账信息
      this.txOnChannelInfo = {      //清空通道转账信息
        "sendUri": '',
        "receiverUri": '',
        "hr": '',
        "assetType": '',
        "value": 0,
        "fee": 0,
        "description": '',
        "ChannelName": '',
        "keyStorePass": ''
      };
      this.paymentCode = '';        //清空payment code    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paymentBox{
  float: left;
  height: calc(100% - 56px);
  width: 100%;
  overflow: hidden;
}
.assetBox{
  height: 200px;
  width: 100%;
  background-color: rgb(67, 74, 80);
  position: relative;
}
.amountBox{
  position: absolute;
  bottom: 16px;
  right: 30px;
  color: #FFFFFF;
}
.addressBox{
  color: #FFFFFF;
  height: 30px;
  padding: 5px 0;
  text-align: center;
  line-height: 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}
.addressBox a{
  color:#FFFFFF;
  font-size: 10px;
}
.assetBox h1{
  font-size: 50px;
  text-align: center;
  font-weight: 300;
  margin: 20px 0;
}
.assetBox h3{
  font-size: 39px;
  text-align: right;
  font-weight: 400;
  margin: -17px 0;
}
.contentBox{
  height: calc(100vh - 311px);
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  transition: 1s;
}
.assetIcon img{
  height: 28px;
  margin: 36px 0;
}
h2{
  margin: 0;
  font-size: 24px;
}
.indexForm{
  padding: 12px 0;
}
.transferBtn{
  width: 100%;
  max-width: 300px;
}
.txOnChannelBox .el-dialog__body span{
  display: block;
  margin: 10px 0;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
