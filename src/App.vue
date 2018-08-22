<template>
  <div id="app" class="clearfloat appBox" mode="in-out">
    <div style="position: relative;margin: 0 auto;width: 100%;max-width: 1400px;height: 100%;">
      <div class="rightBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
          <head-box/>
          <router-view/>
          <message-box/>
          <footer-box/>
      </div>
      <head-nav/>
        <el-dialog title="注意" :visible.sync="isFeeInfoBoxShow" width="30%" center>
          <span>你将支付<b style="color:#F56C6C">{{ $store.state.vuexStore.txOnChannelInfo.fee / 10e7 }}{{ $store.state.vuexStore.txOnChannelInfo.assetType }}</b>作为本次交易的路由费用</span><br>
          <el-tooltip class="item" effect="dark" content="交易的路由费用由于通过多个路由节点而产生" placement="top">
            <span style="margin-top:20px;display: inline-block;text-decoration: underline;">什么是路由费用</span>
          </el-tooltip>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendHtlcMes()"> 确定 </el-button>
            <el-button @click="isFeeInfoBoxShow = false"> 取消 </el-button>
          </span>
        </el-dialog>
        <el-dialog class="receiptRsmcInfoBox" title="收款" :visible.sync="isReceiptRsmcInfoBox" width="30%" center :modal-append-to-body='false'>                    <!--  回复Rsmc消息框 -->
          <span>{{ activeInfo.redata.Sender }}向你转账</span>
          <span style="color:#F56C6C">{{ activeInfo.redata.PaymentCount }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item label="密码" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="RsmcSign()" type="primary"> 确定 </el-button>
                <el-button @click="isReceiptRsmcInfoBox = false;"> 取消 </el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="receiptHtlcInfoBox" title="收款" :visible.sync="isReceiptHtlcInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  回复Htlc消息框 -->
          <span>{{ activeInfo.redata.Sender }}向你转账</span>
          <span style="color:#F56C6C">{{ activeInfo.redata.PaymentCount }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item label="密码" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="HtlcSign()" type="primary"> 确定 </el-button>
                <el-button @click="isReceiptHtlcInfoBox = false;"> 取消 </el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="settleInfoBox" title="关闭通道" :visible.sync="isSettleInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  回复Settle消息框 -->
          <span>{{ activeInfo.redata.Sender }}申请关闭通道</span>
          <span style="color:#F56C6C">本端余额:{{ activeInfo.redata.ReceiverBalance }} {{ activeInfo.redata.AssetType }}</span>
          <span style="color:#F56C6C">对端余额:{{ activeInfo.redata.SenderBalance }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item label="密码" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="SettleSign()" type="danger"> 确定 </el-button>
                <el-button @click="isSettleInfoBox = false;"> 取消 </el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog title="退出" :visible.sync="isSignOutBoxShow" width="30%" center>
          <span>即将退出钱包</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="SignOut()"> 确定 </el-button>
            <el-button @click="isSignOutBoxShow = false"> 取消 </el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'Vue'
import headNav from './components/common/headNav'
import headBox from './components/common/headBox'
import messageBox from './components/common/messageBox'
import footerBox from './components/common/footer'

export default {
  name: 'App',
  data () {
      var validatePass = (rule, value, callback) => {         //Receipt 密码输入规则
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        let PrivateKey = this.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore,this.activeInfo.keyStorePass);
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error('钱包解锁失败 - 可能是密码错误'));
            }
        }, 2000);
      }
    };
    return {
        isFeeInfoBoxShow: false,         //是否显示Fee提醒框
        isReceiptRsmcInfoBox: false,     //是否显示接收Rsmc消息框
        isReceiptHtlcInfoBox: false,     //是否显示接收Htlc消息框
        isSettleInfoBox: false,          //是否显示Settle消息框
        isSignOutBoxShow: false,         //是否显示退出消息框
        activeInfo: {                     //当前显示的消息框
          "redata": [], 
          "keyStorePass": ''
        },
        paymentInfo: {
          "redata": [], 
          "keyStorePass": '',
          "fee": 0
        },
        confirmReceiptRules: {        //Receipt 输入规则
          keyStorePass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
    }
  },
  components: {
    headNav,
    headBox,
    footerBox,
    messageBox
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时连接至全节点
        let _this = this;
        _this.connectWebSocketForNodeUri();         //连接至全节点
    })
  },
  methods: {
    connectWebSocketForNodeUri() {          //连接至全节点
        let _this = this;
        _this.$notify.closeAll();
        const wsuri = "ws://47.104.81.20:9000/";               //建立websocket连接
        _this.$store.state.vuexStore.NodeUriWebSocket = new WebSocket(wsuri);
        _this.$store.state.vuexStore.NodeUriWebSocket.onmessage = _this.nodeUriWebsocketOnMessage;
        _this.$store.state.vuexStore.NodeUriWebSocket.onclose = _this.nodeUriWebsocketClose;
        _this.$notify.info({
          title: '消息',
          duration: 2000,
          message: '正在连接至Trinity网络'
        });
        if(_this.$store.state.vuexStore.isLogin == true){
          let Message = {
              "messageType":"init", 
              "walletAddress":_this.$store.state.vuexStore.walletInfo.address
          }
          _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
        }
    },
    backToStart() {
      this.$router.push('/start');
    },
    fetchAsArray:function(key){     //获取localStorage的数组，json，boolean等数据
      let KEY1 = key.toString();
      return JSON.parse(window.localStorage.getItem(KEY1) || '[]')
    },
    fetchAsString:function(key){           //获取localStorage的String数据
      let KEY1 = key.toString();
      return window.localStorage.getItem(KEY1) || ''
    },
    saveAsArray:function(key,items){    //以数组，json，boolean等数据格式储存localStorage
      let KEY1 = key.toString();
      window.localStorage.setItem(KEY1,JSON.stringify(items))
    },
    saveAsString:function(key,items){    //以String格式储存localStorage
      let KEY1 = key.toString();
      window.localStorage.setItem(KEY1,items);
    },
    keepDecimalPlaces(num,a) {    //将num保留a位小数
      let result;
      if(isNaN(num)){
        result = NaN;
      } else {
        result = parseInt(num * (Math.pow(10,a))) / (Math.pow(10,a));
      }
      return result;
    },
    getChannelBalance() {       //index页面获取通道总余额
      let _this = this;
      let tncBalance = 0;
      let ethBalance = 0;
      _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
          if(data.isTestNet == _this.$store.state.vuexStore.isTestNet && data.State == 3 && data.assetType == "TNC"){ 
              tncBalance += data.SelfBalance;
          } else if(data.isTestNet == _this.$store.state.vuexStore.isTestNet && data.State == 3 && data.assetType == "ETH"){  
              ethBalance += data.SelfBalance;
          }
      })
      Vue.set(_this.$store.state.vuexStore.balanceData.Channel, "TNC", _this.keepDecimalPlaces(tncBalance / 10e7,3));
      Vue.set(_this.$store.state.vuexStore.balanceData.Channel, "ETH", _this.keepDecimalPlaces(ethBalance / 10e7,3));
    },
    showLoading:function (){
      loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          target: document.querySelector('.appBox')
      });
    },
    closeLoading() {                   //关闭全局加载框
      loading.close();
    },
    showSignOutBox() {                //显示退出框
      this.isSignOutBoxShow = true;
    },
    SignOut() {
      this.$store.state.vuexStore.walletInfo = {         //钱包信息
        "keyStore": "",
        "publicKey": "",
        "address": ""
      }
      location.reload();
    },
    decryptPrivateKey (keyStore,password) {       //解锁钱包
      let _this = this;
      let decryptPrivateKey;
      try {
          decryptPrivateKey = web3.eth.accounts.decrypt(keyStore, password);
      } catch (e) {
          if(e.message == 'Key derivation failed - possibly wrong password'){
              _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '钱包解锁失败 - 可能是密码错误',
                  duration: 3000
              });
              return false;
          } else {
              _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: e.message,
                  duration: 3000
              });
              return false;
          }
      }
      return decryptPrivateKey;
    },
    uri2Ip(uri,port) {      //URI转化Ip
      let ip = uri.split("@")[1];
      if(port == null){
        ip = ip.split(":")[0];
      } else {
        ip = ip.split(":")[0]+":" + port;
      }
      return ip;
    },
    assetContractAddress2AssetType(assetContractAddress) {
      let assetType = "";
      console.log(this.$store.state.vuexStore.isTestNet);
      if(this.$store.state.vuexStore.isTestNet){
        console.log(1);
        console.log(assetContractAddress);
        switch(assetContractAddress)
        {
        case "65096f2B7A8dc1592479F1911cd2B98dae4d2218":
          assetType = "TNC";
          break;
        case "ETH":
          assetType = "ETH";
          break;
        default:
          assetType = Error;
        }
      } else {
        switch(assetContractAddress)
        {
        case "65096f2B7A8dc1592479F1911cd2B98dae4d2218":
          assetType = "TNC";
          break;
        case "ETH":
          assetType = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        default:
          assetType = Error;
        }
      }
      console.log(assetType);
      return assetType;
    },
    AssetType2AssetContractAddress(assetType) {
      let assetContractAddress = "";
      if(this.$store.state.vuexStore.isTestNet){
        switch(assetType)
        {
        case "TNC":
          assetContractAddress = this.$store.state.vuexStore.tncContractAddress;
          break;
        case "ETH":
          assetContractAddress = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        default:
          assetContractAddress = Error;
        }
      } else {
        switch(assetType)
        {
        case "TNC":
          assetContractAddress = "08e8c4400f1af2c20c28e0018f29535eb85d15b6";
          break;
        case "ETH":
          assetContractAddress = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        default:
          assetContractAddress = Error;
        }
      }
      return assetContractAddress;
    },
    getChannelSerial(type,value,open) {      //获取所需的channel在List的位置,参数为key,value,是否为open状态
        let _this = this;
        let i = -1;
        _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
         if(data[type] === value){
              if(open == null){
                i = index;
                return;
              } else if (open == 'open'){
                if(data.State == 3 && data.isConnect == true){
                  i = index;
                  return;
                } else {
                  i = -2;
                }
              }
          } else {
            i = -1;
          }
       })
       return i;      //返回-1为未建通道,返回-2为通道未Open或者未连接上websocket
    },
    cycleGetTransactionReceipt(hash) {      //循环查询交易直至确认
      let _this = this;
      setTimeout(function (){
        web3.eth.getTransactionReceipt(hash).then(function(result){
          // 获取交易次数
          if( result == null){
            return _this.cycleGetTransactionReceipt(hash);
          } else {
            console.log(result);
            if(result.status == true){
              _this.$notify({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: '交易已确认',
                  duration: 3000,
                  type: 'success'
              });
              _this.$store.state.vuexStore.recordList.forEach(function(data,index){   //遍历
                if(data.transactionHash == result.transactionHash){
                  data.blockHash = result.blockHash;
                  data.state = 1;
                  console.log("修改状态成功");
                  _this.StoreRecordList();
                }
              });
              return result;
            } else if(result.status == false){
              _this.$notify({
                  title: '失败',
                  dangerouslyUseHTMLString: true,
                  message: '交易确认失败',
                  duration: 3000,
                  type: 'error'
              });
              _this.$store.state.vuexStore.recordList.forEach(function(data,index){   //遍历
                if(data.transactionHash == result.transactionHash){
                  data.blockHash = result.blockHash;
                  data.state = -1;
                  console.log("修改状态成功");
                  _this.StoreRecordList();
                }
              });
              return result;
            }
          }
        })
     }, 4000);
    },
    nodeUriWebsocketOnMessage(e) {        //全节点websocket接收消息
      let _this = this;
      if(e.data === 'connected to server'){
        _this.$notify.closeAll();
        _this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: '已连接到Trinity网络',
            duration: 3000,
            type: 'success'
        });
      } else {
        let redata = JSON.parse(e.data);
        let type = redata.messageType;
        console.log(redata);

        switch(type)
        {
        case "monitorDeposit":
          _this.OnMesMonitorDeposit(redata);
          break;
        case "monitorQuickCloseChannel":
          _this.OnMesMonitorQuickCloseChannel(redata);
          break;
        default:
        
        }
      }
    },
    OnMesMonitorDeposit(redata) {
      // 收到的消息体
      // {
      //   "amount": 9400000000,
      //   "channelId": "0xa2e7c253258f3a85694a27907e17acf4b96a0673bf5b8108c89eb571f77e0db9",
      //   "messageType": "monitorDeposit",
      //   "partnerA": "0xbf9905c03ce89fc1666d3701b88a87b647b074af",
      //   "partnerB": "0xdd1c2c608047bd98962abf15f9f074620f9d44bf"
      // }
      console.log(redata);
      let _this = this;
      let l = _this.getChannelSerial('ChannelName', redata.channelId);
      console.log(l);
      if(l === null){             //如果未检测到通道,给出提醒
          _this.$notify.error({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: '未找到该通道,请重试一次',
              duration: 3000
          });
          return;
      } else {
          console.log(redata.amountA);
          console.log(redata.amountB);
          console.log(_this.$store.state.vuexStore.channelList[l].SelfBalance);
          console.log(_this.$store.state.vuexStore.channelList[l].OtherBalance);
          if(redata.amountA == _this.$store.state.vuexStore.channelList[l].SelfBalance && redata.amountB == _this.$store.state.vuexStore.channelList[l].OtherBalance){
            _this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '通道已开通',
                duration: 3000,
                type: 'success'
            });
            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            channelInfo.State = 3;
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.StoreChannel();                   //储存通道信息
            _this.getChannelBalance();              //更新通道余额
          }
      }
    },
    OnMesMonitorQuickCloseChannel(redata) {
      // 收到的消息体
      // {
      //   "amountA":1000000000
      //   "amountB":700000000
      //   "channelId":"0x3abdbf65f582e38ca78b64a155c585e5d6b72b88134e91958c8758d26bc6eafd"
      //   "messageType":"monitorQuickCloseChannel"
      //   "partnerA":"0xbf9905c03ce89fc1666d3701b88a87b647b074af"
      //   "partnerB":"0xdd1c2c608047bd98962abf15f9f074620f9d44bf"
      // }
      let _this = this;
      let l = _this.getChannelSerial('ChannelName', redata.channelId);
      console.log(l);
      if(l === null){             //如果未检测到通道,给出提醒
          _this.$notify.error({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: '未找到该通道,请重试一次',
              duration: 3000
          });
          return;
      } else {
          console.log(redata.amountA);
          console.log(redata.amountB);
          console.log(_this.$store.state.vuexStore.channelList[l].SelfBalance);
          console.log(_this.$store.state.vuexStore.channelList[l].OtherBalance);
          if(redata.amountA == _this.$store.state.vuexStore.channelList[l].SelfBalance && redata.amountB ==_this.$store.state.vuexStore.channelList[l].OtherBalance){
            _this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '通道已关闭',
                duration: 3000,
                type: 'success'
            });
            _this.$store.state.vuexStore.channelList.splice(l,1);

            _this.StoreChannel();                   //储存通道信息
            _this.getChannelBalance();              //更新通道余额
          }
      }
    },
    nodeUriWebsocketClose(val) {         //全节点websocket断开
      console.log("已断开websocket");
      console.log(val);
      this.$notify({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '与Trinity网络断开连接,点击进行重连',
          duration: 0,
          type: 'error',
          onClick: this.connectWebSocketForNodeUri
      });
    },
    websocketOnmessage(e){ 		//gateway websocket接收消息
      let _this = this;
      let redata = JSON.parse(e.data);
      let type = redata.MessageType;
      console.log(redata);

      switch(type)
      {
      case "FounderSign":
        _this.OnMesFounderSign(redata);
        break;
      // case "AddChannel":                            //用于全节点监控不到时
      //   _this.OnMesAddChannel(redata);
      //   break;
      case "Rsmc":
        _this.OnMesRsmc(redata);
        break;
      case "RsmcSign":
        _this.OnMesRsmcSign(redata);
        break;
      case "AckRouterInfo":
        _this.OnMesAckRouterInfo(redata);
        break;
      case "Htlc":
        _this.OnMesHtlc(redata);
        break;
      case "HtlcSign":
        _this.OnMesHtlcSign(redata);
        break;
      case "RResponse":
        _this.OnMesRResponse(redata);
        break;
      case "Settle":
        _this.OnMesSettle(redata);
        break;
      case "SettleSign":
        _this.OnMesSettleSign(redata);
        break;
      // case "DeleteChannel":                       //用于全节点监控不到时
      //   _this.OnMesDeleteChannel(redata);
      //   break;
      case "ChannelInfo":
        _this.OnMesChannelInfo(redata);
        break;
      default:
      
      }
    },
    OnMesFounderSign:function(redata){        //收到FounderSign消息
      // 收到的消息体
      // {
      //   ChannelName:"0xf21a712999ee0e477065df49433b0ea1a6f55c77a28b4a621dae0431d67b35e6"
      //   MessageBody:{
      //   AssetType: "TNC"
      //   Commitment: "0x4b2eb00ceba91f3b413fede38d79da4a207c731780248421aa8e5d36131b9fec6cda84872bcd8a93dccb7ce2bb58b995f276ca5243c56982b6ff21c5d005732901"
      //   MessageType: "FounderSign"
      //   NetMagic: "191919191919"
      //   Receiver: "0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766"
      //   Sender: "0xD65Af7686F87e04C1e1578A1076b60f2B6D8a66D@106.15.91.150:8089"
      //   Status:"RESPONSE_OK"
      //   TxNonce:0
      // }
      if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
        this.confirmOtherApprove(redata);
      } else {
        console.log(redata.Status);
      }
    },
    confirmOtherApprove(redata){          //查询对端的approve情况直至大于押金余额
      let _this = this;
      setTimeout(function (){
        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: _this.$store.state.vuexStore.gasPrice        //Gas价格
          });
          myContract.methods.balanceOf(redata.Sender.split("@")[0]).call({from: redata.Sender.split("@")[0]}, function(error, balance){
              if(!error) {
                  console.log(balance);
                  if(balance > _this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7){       //判断对端余额
                    myContract.methods.allowance(redata.Sender.split("@")[0] , _this.$store.state.vuexStore.trinityContractAddress ).call({from: _this.$store.state.vuexStore.walletInfo.address}, function(error, result){
                        console.log(result);
                        if(result >= _this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7){
                            _this.sendDeposit(redata);
                        } else {
                            _this.confirmOtherApprove(redata);
                        }
                    });
                  } else {
                    _this.$notify.error({
                      title: '警告',
                      dangerouslyUseHTMLString: true,
                      message: '添加通道失败,对端余额不足',
                      duration: 0
                    });
                    return false;
                  }
              } else {
                  console.log(error);
              }
          });
        })
      },3000);
    },
    sendDeposit(redata) {         //发送创建通道的deposit 消息
      let _this = this;
      web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
        console.log(gasPrice);
        var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.trinityContractAbi, _this.$store.state.vuexStore.trinityContractAddress, {
            from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
            gasPrice: _this.$store.state.vuexStore.gasPrice      //Gas价格
        });
        let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.addChannelInfo.keyStorePass);
        web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数

          let functionSig = web3.eth.abi.encodeFunctionSignature('deposit(bytes32,uint256,address,uint256,address,uint256,bytes,bytes)');     //获取functionSig
          console.log(functionSig);
          console.log(_this.$store.state.vuexStore.addChannelInfo.channelName);
          console.log(1);
          console.log(_this.$store.state.vuexStore.walletInfo.address);
          console.log(_this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7);
          console.log(_this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0]);
          console.log(_this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7);
          console.log(_this.$store.state.vuexStore.addChannelInfo.selfSignedData);
          console.log(redata.MessageBody.Commitment);
          let data = web3.eth.abi.encodeParameters(['bytes32','uint256','address','uint256','address','uint256','bytes','bytes'], [_this.$store.state.vuexStore.addChannelInfo.channelName,1, _this.$store.state.vuexStore.walletInfo.address, _this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7, _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],_this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7, _this.$store.state.vuexStore.addChannelInfo.selfSignedData, redata.MessageBody.Commitment]);        //abi加密参数
          console.log(data);

          var txData = {        //组成txData数据
              nonce: web3.utils.toHex(nonce++),
              gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
              gasLimit: web3.utils.toHex(4500000),
              to: _this.$store.state.vuexStore.trinityContractAddress,
              from: _this.$store.state.vuexStore.walletInfo.address, 
              value: '0x00', 
              data: functionSig + data.substr(2)
          };
          console.log(txData);

          web3.eth.estimateGas({
              to: _this.$store.state.vuexStore.trinityContractAddress,
              data: functionSig + data.substr(2)
          })
          .then(console.log);

          let signedData = signData(txData,decryptPK.privateKey);         //签名
          console.log(signedData);

          let date = new Date().getTime();        //获取当前时间戳
          web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
          .on('transactionHash', function(hash){              //收到交易hash时
              console.log(hash);
              _this.$notify({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: '上链成功，请交易确认',
                  duration: 3000,
                  type: 'success'
              });
              let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.addChannelInfo.channelName);
              _this.$store.state.vuexStore.channelList[l].transactionHash = hash;     //将交易hash赋值给改通道信息
              _this.StoreChannel();             //保存通道信息
              let recordMessage = {           //构造上链record消息
                date: date,
                name: _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],
                Amount: _this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7,
                assetType: 'TNC',
                isOnChannel: false,
                isPay: true,
                state: 0,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : hash,
                blockHash: ""
              }
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              let recordMessage1 = {           //构造通道record消息
                date: date,
                name: _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],
                Amount: _this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7,
                assetType: 'TNC',
                isOnChannel: true,
                isPay: false,
                state: 0,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : hash,
                blockHash: ""
              }
              _this.$store.state.vuexStore.recordList.push(recordMessage1);
              _this.StoreRecordList();                                      //保存交易记录
              _this.cycleGetTransactionReceipt(hash);
              return;
          })
          .on('receipt', console.log)
          .on('error', function(error){
              console.log(error);
              let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.addChannelInfo.channelName);
              _this.$store.state.vuexStore.channelList.splice(l,1);
              _this.StoreChannel();         //储存通道信息
              return;
          })
          let Message = {
            'messageType': 'monitorDeposit',
            "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
            'chainType': redata.MessageBody.AssetType,
            'playload': redata.ChannelName,
            'comments': ''
          };
          _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //发送监控消息
           _this.$store.state.vuexStore.txOnChannelInfo = [];             //清空数据
        })
      })
    },
    OnMesAddChannel(redata) {                 //收到 添加通道成功消息,用于全节点监控失败时
      //收到的消息体
      // {
      // AssetType:"TNC"
      // MessageBody:{
      //   Balance:{
      //     0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766
      //     0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089
      //   }
      // ChannelName:"0x2d29affaf3282a93a5a7230cc31038f7296a464585016570a8f01ff0060459aa"
      // Founder:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766"
      // Receiver:"0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089"
      // MessageType:"AddChannel"
      // NetMagic:"527465737419990331"
      // }
      var _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName);      //获取所需的channel在List的位置
      console.log(l);
      let channelInfo = _this.$store.state.vuexStore.channelList[l];
      console.log(channelInfo);
      channelInfo.State = 3;                            //通道状态更新
      Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
      console.log(_this.$store.state.vuexStore.channelList[l]);
      _this.StoreChannel();           //保存通道信息
      _this.getChannelBalance();              //更新通道余额
    },
    OnMesRsmc:function(redata){             //收到Rsmc消息,收款
      // 收到的消息体
      // {
      //   "MessageType":"Rsmc",
      //   "Sender": sendUri,
      //   "Receiver": receiverUri,
      //   "TxNonce": TxNonce,
      //   "ChannelName": ChannelName,
      //   "NetMagic": _this.$store.state.vuexStore.NetMagic,
      //   "MessageBody": {
      //     "AssetType": _this.txOnChannelInfo.assetType,
      //     "PaymentCount": _this.txOnChannelInfo.value,
      //     "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
      //     "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
      //     "Commitment": commitment
      //   },
      //   "Comments": {}
      // }
      var _this = this;
      let l = _this.$parent.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l == -1){          //当l为-1时,未遍历到通道
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '未与该Uri建立通道',
          duration: 0
        });
        return false;
      } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '该通道未Open或者未连接上websocket',
          duration: 0
        });
        return false;
      } else{
        _this.activeInfo.redata = redata;     
        _this.$notify.info({
            title: '消息',
            duration: 0,
            message: _this.$store.state.vuexStore.channelList[l].Alice + "通道有收款消息,需要你解锁钱包.<br/>点击进行解锁",
            onClick: _this.showReceiptRsmcInfoBox        //显示接收信息框
        });
      }
    },
    showReceiptRsmcInfoBox() {            //显示接收Rsmc信息框
      this.isReceiptRsmcInfoBox = true;
    },
    RsmcSign() {                      //进入RsmcSign,开始对交易数据签名,收款
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].OtherBalance - (_this.activeInfo.redata.PaymentCount * 10e7)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].SelfBalance + (_this.activeInfo.redata.PaymentCount * 10e7)}       //对端押金
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(selfSignedData); 
          let commitment;
          if(_this.activeInfo.redata.SenderBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance && _this.activeInfo.redata.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance){      //判断通道余额是否正确
            let Message = {
              "MessageType":"RsmcSign",
              "Sender": _this.activeInfo.redata.Receiver,
              "Receiver": _this.activeInfo.redata.Sender,
              "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce,
              "ChannelName": _this.activeInfo.redata.ChannelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "AssetType": _this.$store.state.vuexStore.channelList[l].assetType,
              "MessageBody": {
                "PaymentCount": _this.activeInfo.redata.PaymentCount,
                "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
                "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
                "Commitment": commitment,
                "RoleIndex": 0
              },
              "Comments": {},
              "Status": "RESPONSE_OK",
            }
          }
        } else {
            console.log('error submit!!');
            return false;
        }
      })
    },
    OnMesRsmcSign:function(redata){           //收到RsmcSign消息
      //收到的消息体
      // {
      //   "MessageType":"RsmcSign",
      //   "Sender": receiver,
      //   "Receiver": sender,
      //   "TxNonce": nonce,
      //   "ChannelName":channel_name,
      //   "NetMagic": RsmcMessage.get_magic(),
      //   "MessageBody": {
      //     "AssetType":asset_type.upper(),
      //     "PaymentCount": payment,
      //     "SenderBalance": this_receiver_balance,
      //     "ReceiverBalance": this_sender_balance,
      //     "Commitment": commitment,
      //     "RoleIndex": 0
      //   },
      //   "Comments": {},
      //   "Status": RESPONSE_OK,
      // }
      let _this = this;
      if(redata.Status == 'RESPONSE_OK'){           //当得到RESPONSE_OK确认后,进行Rsmc
        let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.txOnChannelInfo.ChannelName);
        console.log(l);
        if(l == -1){             //如果未检测到通道,给出提醒
            _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '未找到该通道',
                duration: 3000
            });
            return;
        } else {          //检测到通道
          if(redata.MessageBody.RoleIndex == 0){         //如果不带RoleIndex,发送RsmcSign
            // if(redata.TxNonce == _this.$store.state.vuexStore.channelList[l].TxNonce + 1){
            //   console.log("TxNonce正确");
            // } else {
            //   console.log("TxNonce不一致,进入协商");
            //   if(redata.MessageBody.SenderBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance - (0.2 * 10e7) && redata.MessageBody.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance + (0.2 * 10e7)){
            //     console.log("余额一致");
            //     if(_this.$store.state.vuexStore.channelList[l].TxNonce + 1 < redata.TxNonce){
            //       _this.$store.state.vuexStore.channelList[l].TxNonce = redata.TxNonce - 1;
            //       console.log("协商TxNonce到" + _this.$store.state.vuexStore.channelList[l].TxNonce);
            //     }
            //   }
            // }

            let txData = web3.utils.soliditySha3(         //生成代签名交易数据
                {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},                      //通道名称
                {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                      //TXnonce
                {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                              //本端地址
                {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].SelfBalance - (0.2 * 10e7)},       //本端押金
                {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},           //对端地址
                {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].OtherBalance + (0.2 * 10e7)}       //对端押金
            );
            console.log(txData);

            let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);      //解锁钱包用于签名          
            let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
            console.log(selfSignedData);

            let Message = {                     //构造RsmcSign消息体
              "MessageType":"RsmcSign",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
              "ChannelName": redata.ChannelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
              "MessageBody": {
                "PaymentCount": _this.$store.state.vuexStore.txOnChannelInfo.value / 10e7,
                "SenderBalance": (_this.$store.state.vuexStore.channelList[l].SelfBalance - _this.$store.state.vuexStore.txOnChannelInfo.value) / 10e7,
                "ReceiverBalance": (_this.$store.state.vuexStore.channelList[l].OtherBalance + _this.$store.state.vuexStore.txOnChannelInfo.value) / 10e7,
                "Commitment": selfSignedData,
                "RoleIndex": 1
              },
              "Comments": {},
              "Status": "RESPONSE_OK",
            }
            _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息

            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            channelInfo.SelfBalance -= _this.$store.state.vuexStore.txOnChannelInfo.value;     //本端余额更新
            channelInfo.OtherBalance += _this.$store.state.vuexStore.txOnChannelInfo.value;    //对端余额更新
            channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.StoreChannel();           //保存通道信息
            _this.getChannelBalance();              //更新通道余额

            let date = new Date().getTime();        //获取当前时间戳
            let recordMessage = {           //构造通道record消息
              date: date,
              name: redata.Sender.split("@")[0],
              Amount: _this.$store.state.vuexStore.txOnChannelInfo.value,
              assetType: _this.$store.state.vuexStore.txOnChannelInfo.assetType,
              isOnChannel: true,
              isPay: true,
              state: 1,
              isTestNet: _this.$store.state.vuexStore.isTestNet,
              transactionHash : "none",
              blockHash: "none"
            }
            _this.$store.state.vuexStore.recordList.push(recordMessage);
            _this.StoreRecordList();                //保存交易记录

            _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
            _this.$notify({                 //消息提醒
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '转账确认',
                duration: 3000,
                type: 'success'
            });
          } else if (redata.MessageBody.RoleIndex == 1){       //如果RoleIndex为1,更新通道余额
            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            channelInfo.SelfBalance -= redata.MessageBody.PaymentCount;     //本端余额更新
            channelInfo.OtherBalance += redata.MessageBody.PaymentCount;    //对端余额更新
            channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.StoreChannel();           //保存通道信息
            _this.getChannelBalance();              //更新通道余额

            let date = new Date().getTime();        //获取当前时间戳
            let recordMessage = {           //构造通道record消息
              date: date,
              name: redata.Sender.split("@")[0],
              Amount: redata.MessageBody.PaymentCount,
              assetType: redata.MessageBody.AssetType,
              isOnChannel: true,
              isPay: false,
              state: 1,
              isTestNet: _this.$store.state.vuexStore.isTestNet,
              transactionHash : "none",
              blockHash: "none"
            }
            _this.$store.state.vuexStore.recordList.push(recordMessage);
            _this.StoreRecordList();                //保存交易记录

            _this.$notify({                 //消息提醒
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '收款确认',
                duration: 3000,
                type: 'success'
            });
          }
        }
      } else {             //当得到非确认后,进行输出状态
        console.log(redata.Status)
      }
    },
    OnMesAckRouterInfo:function(redata){            //收到路由消息
      // console.log(redata.RouterInfo);
      let _this = this;
      if(redata.RouterInfo === null){
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: "路由为空,没有可用的通道",
          duration: 3000
        });
        _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
        return false;
      } else {
        let _this = this;
        let Router = redata.RouterInfo.FullPath;

        console.log(_this.$store.state.vuexStore.txOnChannelInfo);
        if(_this.$store.state.vuexStore.txOnChannelInfo.receiverUri.split(":")[1] == 8766){        //如果对端为SPV,路由首尾加上两个SPV
          Router.unshift([_this.$store.state.vuexStore.txOnChannelInfo.sendUri,0]);
          Router.push([_this.$store.state.vuexStore.txOnChannelInfo.receiverUri,0]);
        } else {                              //如果对端为node,路由首加上自己
          Router.unshift([_this.$store.state.vuexStore.txOnChannelInfo.sendUri,0]);
        }
        let Fee = 0;                  //申明Fee
        for (var b = 0; b < Router.length - 1; b++) {
          Fee += redata.RouterInfo.FullPath[b][1];
        }
        Fee = parseFloat(Fee).toFixed(8) * 100000000;     //防止浮点误差
        _this.$store.state.vuexStore.txOnChannelInfo.Router = Router;                 //router赋值
        _this.$store.state.vuexStore.txOnChannelInfo.Next = redata.RouterInfo.Next;     //Next赋值
        _this.$store.state.vuexStore.txOnChannelInfo.fee = Fee;            //fee赋值
        console.log(_this.$store.state.vuexStore.txOnChannelInfo);
        _this.isFeeInfoBoxShow = true;                       //显示Fee提醒框
      }
    },
    sendHtlcMes() {         //发起Htlc交易
      let _this = this;
      let l = _this.getChannelSerial("OtherUri",_this.$store.state.vuexStore.txOnChannelInfo.Next,"open");       //遍历当前通道位置
      if(l == -1){          //当l为-1时,未遍历到通道
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '未与该Uri建立通道',
          duration: 0
        });
        return false;
      } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '该通道未Open或者未连接上websocket',
          duration: 0
        });
        return false;
      } else {
        web3.eth.getBlockNumber().then(function(blockNumber){           //获取当前块高
          console.log(blockNumber);
          let DelayBlock = blockNumber + (_this.$store.state.vuexStore.txOnChannelInfo.Router.length - 1) * 4 * 5;         //1分钟4个块,一天
          console.log(DelayBlock);
          let Ip = _this.uri2Ip(_this.$store.state.vuexStore.txOnChannelInfo.Next,8766);
          let sender = _this.$store.state.vuexStore.walletInfo.address + "@" + Ip;
          let amount = _this.$store.state.vuexStore.txOnChannelInfo.value + _this.$store.state.vuexStore.txOnChannelInfo.fee;
          console.log(amount);

          let delayTxData = web3.utils.soliditySha3(         //生成代签名Htlc交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: DelayBlock},                                                                         //锁定块高
              {t: 'uint256', v: amount / 10e7},                                                                         //锁定块高
              {t: 'bytes32', v: _this.$store.state.vuexStore.txOnChannelInfo.hr}       //对端押金
          );
          console.log(delayTxData);

          console.log(_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);
          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);        //解锁钱包用于签名          
          let delayCommitment = ecSign(delayTxData,decryptPK.privateKey);         //签名
          console.log(delayCommitment); 

          let txData = web3.utils.soliditySha3(         //生成代签名Rsmc交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //本端地址
              {t: 'uint256', v: (_this.$store.state.vuexStore.channelList[l].SelfBalance - amount) / 10e7},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].OtherBalance / 10e7}       //对端押金
              
          );
          console.log(txData);
 
          let commitment = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(commitment); 

          let Message = {                     //构造Htlc消息体
              "MessageType": "Htlc", 
              "Sender": sender, 
              "Receiver": _this.$store.state.vuexStore.txOnChannelInfo.Next, 
              "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1, 
              "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
              "AssetType": _this.$store.state.vuexStore.channelList[l].assetType, 
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "Router": _this.$store.state.vuexStore.txOnChannelInfo.Router,
              "Next": _this.$store.state.vuexStore.txOnChannelInfo.Next,
              "MessageBody": { 
                  "SenderBalance": (_this.$store.state.vuexStore.channelList[l].SelfBalance - amount) / 10e7, 
                  "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance / 10e7, 
                  "Commitment": commitment,
                  "Payment": amount / 10e7,
                  "DelayBlock": DelayBlock, 
                  "DelayCommitment": delayCommitment, 
                  "HashR": "0x" + _this.$store.state.vuexStore.txOnChannelInfo.hr
              }
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
          _this.isFeeInfoBoxShow = false;
        })
      }
    },
    OnMesHtlc:function(redata){         //收到Htlc消息
      // 收到的消息体
      // {
      //   "MessageType":"Htlc",
      //   "Sender": sendUri,
      //   "Receiver": receiverUri,
      //   "TxNonce": TxNonce,
      //   "ChannelName": ChannelName,
      //   "NetMagic": _this.$store.state.vuexStore.NetMagic,
      //   "MessageBody": {
      //     "AssetType": _this.txOnChannelInfo.assetType,
      //     "PaymentCount": _this.txOnChannelInfo.value,
      //     "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
      //     "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
      //     "Commitment": commitment
      //   },
      //   "Comments": {}
      // }
      var _this = this;
      let l = _this.$parent.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l == -1){          //当l为-1时,未遍历到通道
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '未与该Uri建立通道',
          duration: 0
        });
        return false;
      } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '该通道未Open或者未连接上websocket',
          duration: 0
        });
        return false;
      } else {
        _this.activeInfo.redata = redata;     
        _this.$notify.info({
            title: '消息',
            duration: 0,
            message: _this.$store.state.vuexStore.channelList[l].Alice + "通道有收款消息,需要你解锁钱包.<br/>点击进行解锁",
            onClick: _this.showReceiptInfoBox        //显示接收信息框
        });
      }
    },
    showReceiptHtlcInfoBox() {       //显示接收Htlc信息框
      this.isReceiptHtlcInfoBox = true;
    },
    HtlcSign() {          //进入HtlcSign,开始对交易数据签名
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].OtherBalance - (_this.activeInfo.redata.PaymentCount * 10e7)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].SelfBalance + (_this.activeInfo.redata.PaymentCount * 10e7)}       //对端押金
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          let commitment = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(commitment); 

          if(_this.activeInfo.redata.SenderBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance && _this.activeInfo.redata.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance){      //判断通道余额是否正确
            let Message = {
              "MessageType":"HtlcSign",
              "Sender": _this.activeInfo.redata.Receiver,
              "Receiver": _this.activeInfo.redata.Sender,
              "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce,
              "ChannelName": _this.activeInfo.redata.ChannelName,
              "NetMagic": _this.$store.state.vuexStore.NetMagic,
              "MessageBody": {
                "AssetType": _this.$store.state.vuexStore.channelList[l].assetType,
                "PaymentCount": _this.activeInfo.redata.PaymentCount,
                "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
                "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
                "Commitment": commitment,
                "RoleIndex": 0,
              },
              "Comments": {},
              "Status": "RESPONSE_OK",
            }
            _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
            
            let MessageBody = redata.MessageBody;
            let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
            if(l == -1){          //当l为-1时,未遍历到通道
              _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '未与该Uri建立通道',
                duration: 0
              });
              return false;
            } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
              _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '该通道未Open或者未连接上websocket',
                duration: 0
              });
              return false;
            } else {                //当l为正确值时,保存签名,回复RResponse
              console.log(l);
              let R = "";           //获取HashR所对应的R
              console.log("HashR:" + redata.MessageBody.HashR);
              _this.RList.forEach(function(data,index){
                  if(data.Hr === MessageBody.HashR){
                    console.log(data.Hr);
                    R = data.R
                  }
                });
              console.log(R);
              console.log("此处回复RResponse");
              let Message = {
                "MessageType":"RResponse",
                "Sender": redata.Receiver,
                "Receiver":redata.Sender,
                "TxNonce": redata.TxNonce,
                "ChannelName":redata.ChannelName,
                "Router":redata.RouterInfo,
                "Next":redata.Next,
                "MessageBody": {
                        "RoleIndex":0,
                        "Comments":"",
                        "Count":redata.MessageBody.Count,
                        "AssetType":redata.MessageBody.AssetType,
                        "R":R,
                        "HR":redata.MessageBody.HashR
                    }
                }
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
            }
          }
        } else {
            console.log('error submit!!');
            return false;
        }
      })
    },
    OnMesHtlcSign:function(redata){                     //收到HtlcSign消息
      // 收到的消息体
      // {                     
      //   "MessageType": "HtlcSign", 
      //   "Sender": sender, 
      //   "Receiver": redata.RouterInfo.Next, 
      //   "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce, 
      //   "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
      //   "AssetType": _this.$store.state.vuexStore.channelList[l].AssetType, 
      //   "NetMagic": _this.$store.state.vuexStore.channelList[l].NetMagic,
      //   "Router": Router,
      //   "Next":redata.RouterInfo.Next,
      //   "MessageBody": { 
      //       "SenderBalance": _this.$store.state.vuexStore.channelList[l].AssetType, 
      //       "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].AssetType, 
      //       "Commitment": "",
      //       "Payment": _this.$store.state.vuexStore.channelList[l].AssetType, 
      //       "DelayBlock": DelayBlock, 
      //       "DelayCommitment": "", 
      //       "HashR": _this.$store.state.vuexStore.txOnChannelInfo.HashR
      //   }
      // }

      let _this = this;
      if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
        let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.txOnChannelInfo.ChannelName);
        let channelInfo = _this.$store.state.vuexStore.channelList[l];
        channelInfo.SelfBalance -= redata.MessageBody.Payment * 10e7;     //本端余额更新
        channelInfo.OtherBalance += redata.MessageBody.Payment * 10e7;    //对端余额更新
        channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(_this.$store.state.vuexStore.channelList[l]);
        _this.StoreChannel();           //保存通道信息
        _this.getChannelBalance();              //更新通道余额

        _this.$notify({                 //消息提醒
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: 'HTLC已完成',
            duration: 3000,
            type: 'success'
        });
      } else {
        console.log(redata.Status);
      }
    }, 
    OnMesRResponse:function(redata){                  //收到RResponse消息
      var _this = this;
      let hr = web3.utils.keccak256(redata.MessageBody.R);          //sha3
      console.log(hr);
      console.log(redata.MessageBody.HashR);
      console.log(_this.$store.state.vuexStore.txOnChannelInfo.hr);
      if(hr == "0x" + _this.$store.state.vuexStore.txOnChannelInfo.hr){           //比较R是否正确,开始R交易
        console.log("进入R交易");
        let MessageBody = redata.MessageBody;

        let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
        if(l == -1){          //当l为-1时,未遍历到通道
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '未与该Uri建立通道',
            duration: 3000
          });
          return false;
        } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '该通道未Open或者未连接上websocket',
            duration: 3000
          });
          return false;
        } else {                //当l为正确值时
          console.log(l);
          console.log(_this.$store.state.vuexStore.txOnChannelInfo);
          let Message = {    
            "MessageType":"Rsmc",
            "Sender": _this.$store.state.vuexStore.txOnChannelInfo.sendUri,
            "Receiver": _this.$store.state.vuexStore.txOnChannelInfo.receiverUri,
            "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
            "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
            "MessageBody": {
              "PaymentCount": _this.$store.state.vuexStore.txOnChannelInfo.value / 10e7,
              "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance / 10e7,
              "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance / 10e7,
              "Commitment": ""
            },
            "Comments": {}
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
        }
      }
    },
    OnMesSettle:function(redata){           //收到Settle消息
      // 收到的消息体
      // {
      //   AssetType:"TNC",
      //   ChannelName:"0xc1043bd0ea31e0cf998fcc59ea9d917e2e63d23be2805aa3e802f1241e9bebfd",
      //   MessageBody:  {
      //     Commitment:"0x31411fcc903e8aea83a91634e395214d81d561e7613338d38a605f3564da75ac12780a5634cf4f6ddd2b471dd65ec8955e739dc27167da8e04b13e511f3a59bb01",
      //     ReceiverBalance:9.8,
      //     SenderBalance:10.2,
      //     MessageType:"Settle"
      //   },
      // Receiver:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766"
      // Sender:"0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089"
      // TxNonce:4294967295
      // }
      var _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l == -1){          //当l为-1时,未遍历到通道
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '未与该Uri建立通道',
          duration: 0
        });
        return false;
      } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '该通道未Open或者未连接上websocket',
          duration: 0
        });
        return false;
      } else{
        _this.activeInfo.redata = redata;   //保存redata消息
        _this.activeInfo.redata.ReceiverBalance = redata.MessageBody.ReceiverBalance;         //将消息保存在redata层,防止模态框报错
        _this.activeInfo.redata.SenderBalance = redata.MessageBody.SenderBalance;         //将消息保存在redata层,防止模态框报错
        
        _this.$notify.info({
            title: '消息',
            duration: 0,
            message: _this.$store.state.vuexStore.channelList[l].Alice + "通道申请关闭通道,需要你解锁钱包.<br/>点击查看详情",
            onClick: _this.showSettleInfoBox        //显示接收信息框
        });
      }
    },
    showSettleInfoBox() {       //显示接收信息框
      this.isSettleInfoBox = true;
    },
    SettleSign() {          //进入SettleSign,开始对交易数据签名
      let _this = this;
      console.log(_this.activeInfo.redata);
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].OtherBalance - (_this.activeInfo.redata.PaymentCount * 10e7)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].SelfBalance + (_this.activeInfo.redata.PaymentCount * 10e7)}       //对端押金
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          let selfSignedData = ecSign(txData,decryptPK.privateKey);         //对交易数据进行签名
          console.log(selfSignedData); 
          let commitment;
          if(_this.activeInfo.redata.SenderBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance && _this.activeInfo.redata.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance){      //判断通道余额是否正确
            let Message = {                           //构造SettleSign消息
                MessageType: "SettleSign",
                NetMagic: _this.activeInfo.redata.NetMagic,
                Receiver: _this.activeInfo.redata.Sender,
                Sender: _this.activeInfo.redata.Receiver,
                ChannelName: _this.activeInfo.redata.ChannelName,
                MessageBody:{
                  AssetType: _this.activeInfo.redata.MessageBody.AssetType,
                  Commitment: commitment,
                },
                Status:"RESPONSE_OK",
                TxNonce: _this.activeInfo.redata.TxNonce,
            }
            _this.$store.state.vuexStore.channelList.websock[i].data.send(JSON.stringify(Message));     //发送消息
          } else {
              console.log('error submit!!');
              return false;
          }
        }
      })
    },
    OnMesSettleSign:function(redata){
      // 收到的消息体
      // {
      //   ChannelName:"0xf21a712999ee0e477065df49433b0ea1a6f55c77a28b4a621dae0431d67b35e6"
      //   MessageBody:{
      //   AssetType: "TNC"
      //   Commitment: "0x4b2eb00ceba91f3b413fede38d79da4a207c731780248421aa8e5d36131b9fec6cda84872bcd8a93dccb7ce2bb58b995f276ca5243c56982b6ff21c5d005732901"
      //   MessageType: "FounderSign"
      //   NetMagic: "191919191919"
      //   Receiver: "0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766"
      //   Sender: "0xD65Af7686F87e04C1e1578A1076b60f2B6D8a66D@106.15.91.150:8089"
      //   Status:"RESPONSE_OK"
      //   TxNonce:0
      // }
      var _this = this;
      if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
        // console.log(_this.$store.state.vuexStore.closeChannelInfo);
        // let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
        // let channelInfo = _this.$store.state.vuexStore.channelList[l];
        // channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
        // Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        // console.log(_this.$store.state.vuexStore.closeChannelInfo);

        web3.eth.getGasPrice().then(function(gasPrice){             // 获取GAS价格
          console.log(gasPrice);
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.trinityContractAbi, _this.$store.state.vuexStore.trinityContractAddress, {       //声明合约
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: _this.$store.state.vuexStore.gasPrice       //Gas价格
          });
          web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
            console.log(nonce);

            let functionSig = web3.eth.abi.encodeFunctionSignature('quickCloseChannel(bytes32,uint256,address,uint256,address,uint256,bytes,bytes)');     //获取functionSig
            console.log(functionSig);

            console.log(_this.$store.state.vuexStore.closeChannelInfo.ChannelName);
            console.log(0);
            console.log(_this.$store.state.vuexStore.walletInfo.address);
            console.log(_this.$store.state.vuexStore.closeChannelInfo.SelfBalance);
            console.log(_this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0]);
            console.log(_this.$store.state.vuexStore.closeChannelInfo.OtherBalance);
            console.log(_this.$store.state.vuexStore.closeChannelInfo.selfSignedData);
            console.log(redata.MessageBody.Commitment);
            let data = web3.eth.abi.encodeParameters(['bytes32','uint256','address','uint256','address','uint256','bytes','bytes'], [_this.$store.state.vuexStore.closeChannelInfo.ChannelName, 0, _this.$store.state.vuexStore.walletInfo.address, _this.$store.state.vuexStore.closeChannelInfo.SelfBalance, _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0],_this.$store.state.vuexStore.closeChannelInfo.OtherBalance, _this.$store.state.vuexStore.closeChannelInfo.selfSignedData, redata.MessageBody.Commitment]);        //abi加密参数
            console.log(data);

            var txData = {        //组成txData数据
                nonce: web3.utils.toHex(nonce++),
                gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
                gasLimit: web3.utils.toHex(4500000),
                to: _this.$store.state.vuexStore.trinityContractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address, 
                value: '0x00', 
                data: functionSig + data.substr(2)
            };
            console.log(txData);

            web3.eth.estimateGas({
                to: _this.$store.state.vuexStore.trinityContractAddress,
                data: functionSig + data.substr(2)
            })
            .then(console.log);

            let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.closeChannelInfo.keyStorePass);             //解锁KeyStore
            let signedData = signData(txData,decryptPK.privateKey);
            console.log(signedData);

            let date = new Date().getTime();        //获取当前时间戳
            web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
                if (!err) {
                    console.log(hash);
                    _this.$notify({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '上链成功，请交易确认',
                        duration: 3000,
                        type: 'success'
                    });
                    let recordMessage = {           //构造链上record消息
                      date: date,
                      name: _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0],
                      Amount: _this.$store.state.vuexStore.closeChannelInfo.SelfBalance,
                      assetType: 'TNC',
                      isOnChannel: true,
                      isPay: true,
                      state: 0,
                      isTestNet: _this.$store.state.vuexStore.isTestNet,
                      transactionHash : hash,
                      blockHash: ""
                    }
                    _this.$store.state.vuexStore.recordList.push(recordMessage);
                    let recordMessage1 = {           //构造通道record消息
                      date: date,
                      name: _this.$store.state.vuexStore.trinityContractAddress,
                      Amount: _this.$store.state.vuexStore.closeChannelInfo.SelfBalance,
                      assetType: 'TNC',
                      isOnChannel: false,
                      isPay: false,
                      state: 0,
                      isTestNet: _this.$store.state.vuexStore.isTestNet,
                      transactionHash : hash,
                      blockHash: ""
                    }
                    _this.$store.state.vuexStore.recordList.push(recordMessage1);
                    _this.StoreRecordList();
                    _this.cycleGetTransactionReceipt(hash);
                } else {
                    console.log(err)
                }
            });
            let Message = {
              'messageType': 'monitorQuickCloseChannel',
              "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
              'chainType': redata.MessageBody.AssetType,
              'playload': redata.ChannelName,
              'comments': ''
            };
            _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));
          })
        })
      } else {
        console.log(redata.Status);
      }
    },
    OnMesDeleteChannel :function(redata){
      //收到的消息体
      // {
      // AssetType:"TNC"
      // MessageBody:{
      //   Balance:{
      //     0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766: {…}, 0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089: {…}
      //   },
      //   ChannelName:"0xb1d29d209662ce95a6af188110332c1de2bfe180ab9e6d2156856b0b46042dc7",
      //   Founder:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8766",
      //   Receiver:"0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089"
      // },
      // MessageType:"DeleteChannel"
      // NetMagic:"527465737419990331"
      // }
      let _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName); //获取所需的channel在List的位置
      _this.$notify({
          title: '成功',
          dangerouslyUseHTMLString: true,
          message: '通道已关闭',
          duration: 3000,
          type: 'success'
      });
      _this.$store.state.vuexStore.channelList.splice(l,1);

      _this.StoreChannel();                   //储存通道信息
      _this.getChannelBalance();              //更新通道余额
    },
    OnMesChannelInfo:function(redata){
      let _this = this;
      for(var i = 0; i < redata.Peers.length; i ++){  
         _this.ChannelItems.forEach(function(data,index){
          if(data.Url.split("@")[0] === redata.Peers[i]){
            data.Flag = 4;
            data.oldFlag = 5;
          }
        })
      }
    },
    websocketClose(val) {        //断开websocket
      console.log("已断开websocket");
      // console.log(val);
      let _this = this;
      let Ip = val.currentTarget.url.split('/')[2].split(':')[0];
      console.log(Ip);
      let l = _this.getChannelSerial("Ip",Ip);
      console.log(l);
      if(l === null){             //如果未检测到通道,给出提醒
          _this.$notify.error({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: '未找到该通道,请重试一次',
              duration: 3000
          });
          return;
      } else {
        _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '与' + Ip + '断开连接',
            duration: 3000
        });
        let channelInfo = _this.$store.state.vuexStore.channelList[l];
        channelInfo.isConnect = false;
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
        // setTimeout(function () {
        //   _this.reconnectWebsocket(Ip + ":8766",_this.$store.state.vuexStore.channelList[l].ChannelName);
        // }, 3000);
      }
    },
    reconnectWebsocket (Ip,ChannelName){
      let _this = this;
      const wsuri = "ws://" + Ip + "/";
      var l = _this.getChannelSerial('ChannelName',ChannelName);
      console.log(l);
      if(l === null){             //如果未检测到通道,给出提醒
          _this.$notify.error({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: '未找到该通道,请重试一次',
              duration: 3000
          });
          return;
      } else {
        _this.$store.state.vuexStore.channelList[l].websock = new WebSocket(wsuri);
        _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.websocketOnmessage;
        _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.websocketClose;
        _this.$store.state.vuexStore.channelList[l].isConnect = true;
        console.log(_this.$store.state.vuexStore.channelList);

        let Message = {
          MessageType: "GetChannelInfo", 
          Sender: _this.$store.state.vuexStore.channelList[l].SelfUri,
          Magic: _this.activeInfo.redata.NetMagic,
          MessageBody:{
            "AssetType": "TNC"
          }
        }
        setTimeout(function (){
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));
        },2000);
      }
    },
    StoreChannel() {              //储存ChannelList
      console.log(this.$store.state.vuexStore.channelList);
      this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList",this.$store.state.vuexStore.channelList);
    },
    StoreRecordList() {     //localstorage储存Record信息
      console.log(this.$store.state.vuexStore.recordList);
      this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@recordList",this.$store.state.vuexStore.recordList);
    },
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%; 
  overflow: hidden;
  /* font-size: 62.5%; */
}
html{
  font-size: calc(100vw/37.5);
}

#app {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  background:url(./../static/img/bg.jpg);    
  background-image: url(/static/img/bg.100bd93.jpg);
  background-repeat: repeat;
  background-size: 40%;
}
/* 清除浮动 */
.clearfloat:after{      
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat{
  zoom: 1;
}
a{
  text-decoration: none;
}
ul,li{ 
  padding:0;
  margin:0;
  list-style:none
}
.rightBox{
  /* width: calc(100% - 300px); */
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  transition:ease 0.7s;
  position: absolute;
  right: 0;
  z-index: 2;
}
/* 手机端默认隐藏Nav */
@media screen and (min-width: 320px) and (max-width: 1024px) {
  .rightBox{
    right: 0px;
  }
  .fullPage{
    width: 100% !important;
    right: -300px !important;
  }
}
/* PC端默认显示Nav */
@media screen and (min-width: 1025px) {
  .rightBox{
    width: calc(100% - 300px);
  }
  .fullPage{
    width: 100% !important;
    right: 0 !important;
  }
}

/* 返回开始界面样式 */
.backToStartBtn{        
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  text-decoration: underline;
}
/* 通知消息p标签换行 */
.el-notification__content p {       
    word-wrap: break-word;
    word-break: break-all;
}
nav .el-menu-item-group__title {
  padding: 0;
}
nav .el-menu {
  border-right: 0;
}
nav .el-slider__button {       /* 设置nav中滑块颜色 */
    border: 2px solid rgb(255, 208, 75);
}
nav .el-slider__bar {         /* 设置nav中滑块颜色 */
    background-color: rgb(255, 208, 75);
}
nav .el-slider__runway {        
    margin: 22px 0;   /* 设置nav中滑块上下居中 */
    width: 74%;       /* 设置nav中滑块长度 */
}
.headBox .el-badge__content {
  border: 0;       /* 去除角标边框 */
}
.el-form-item__content {    /* 表单按钮居中 */
  text-align: center;
}
.el-dialog{
  min-width: 360px;
}
.settleInfoBox .el-dialog__body span{
  display: block;
  margin: 10px 0;
  word-wrap: break-word;
  word-break: break-all;
}
.indexBox .assetBox .assetTable tr,.indexBox .assetBox .assetTable th,.indexBox .assetBox .assetTable td{
  background-color:transparent;
}
.contactBox .el-dialog__body,.txOnChainBox .el-dialog__body{
  padding: 18px 25px 0;
}
.footer .el-menu--horizontal>.el-menu-item {
  height: 48px;
  line-height: 23px;
}
.footer .el-menu--horizontal {
  border-top: solid 2px RGBA(248, 248, 248, 1.00);
  border-bottom: solid 2px #e6e6e6;
}
.footer .el-menu{
  background-color: transparent;
}
</style>
