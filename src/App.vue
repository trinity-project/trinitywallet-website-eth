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
        <el-dialog class="receiptInfoBox" title="收款" :visible.sync="isReceiptRsmcInfoBox" width="30%" center :modal-append-to-body='false'>                    <!--  回复Rsmc消息框 -->
          <span>{{ activeInfo.redata.Sender }}向你转账</span>
          <span style="color:#F56C6C">{{ activeInfo.redata.PaymentCount }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item label="密码" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="RsmcSign()" type="danger"> 确定 </el-button>
                <el-button @click="isReceiptRsmcInfoBox = false;"> 取消 </el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="receiptInfoBox" title="收款" :visible.sync="isReceiptHtlcInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  回复Htlc消息框 -->
          <span>{{ activeInfo.redata.Sender }}向你转账</span>
          <span style="color:#F56C6C">{{ activeInfo.redata.PaymentCount }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item label="密码" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="HtlcSign()" type="danger"> 确定 </el-button>
                <el-button @click="isReceiptHtlcInfoBox = false;"> 取消 </el-button>
              </el-form-item>
            </el-form>            
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
        isReceiptRsmcInfoBox: false,     //是否显示接收消息框
        isReceiptHtlcInfoBox: false,     //是否显示接收消息框
        activeInfo: {
          "redata": [],
          "keyStorePass": ''
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
    showLoading:function (){
      loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          target: document.querySelector('.appBox')
      });
    },
    closeLoading:function (){
      loading.close();
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
        switch(assetContractAddress)
        {
        case "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218":
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
        case "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218":
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
        let i;
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
              return result;
            } else if(result.status == false){
              _this.$notify({
                  title: '失败',
                  dangerouslyUseHTMLString: true,
                  message: '交易确认失败',
                  duration: 3000,
                  type: 'error'
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
          console.log(redata.amount);
          console.log(_this.$store.state.vuexStore.channelList[l].SelfBalance + _this.$store.state.vuexStore.channelList[l].OtherBalance);
          if(redata.amount == _this.$store.state.vuexStore.channelList[l].SelfBalance + _this.$store.state.vuexStore.channelList[l].OtherBalance){
            _this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '通道已开通',
                duration: 3000,
                type: 'success'
            });
            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            console.log(channelInfo);
            channelInfo.State = 3;
            console.log(channelInfo);
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.StoreChannel();
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

            _this.StoreChannel();
            // _this.StoreRecordList(_this.RecordList);
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
      case "Founder":
        _this.OnMesFounder(redata);
        break;
      case "FounderSign":
        _this.OnMesFounderSign(redata);
        break;
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
      case "SettleSign":
        _this.OnMesSettleSign(redata);
        break;
      case "UpdateChannel":
        _this.OnMesUpdateChannel(redata);
        break;
      case "DeleteChannel":
        _this.OnMesDeleteChannel(redata);
        break;
      case "Settle":
        _this.OnMesSettle(redata);
        break;
      case "ChannelInfo":
        _this.OnMesChannelInfo(redata);
        break;
      case "SyncBlock":
        console.log(1);
        break;
      default:
      
      }
    },
    OnMesFounder:function(redata){
      var _this = this;
      let i = _this.getChannelSerial("ChannelName",redata.ChannelName);
      let MessageBody = redata.MessageBody;
      let decryptPrivateKey = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.addChannelForm.keyStorePass);
      _this.$store.state.vuexStore.FoundertxDataSign = signData(MessageBody.Founder.txData, decryptPrivateKey);
      let commitment_sig = signData( MessageBody.Commitment.txData, decryptPrivateKey);
      let rd_sig = signData( MessageBody.RevocableDelivery.txData, decryptPrivateKey);

      let Message = {
        "MessageType": "FounderSign",
        "Sender": redata.Receiver,
        "Receiver": redata.Sender,
        "ChannelName": redata.ChannelName,
        "TxNonce": redata.TxNonce,
        "MessageBody": {
          "Founder": {
            "txDataSign": _this.$store.state.vuexStore.FoundertxDataSign,
            "originalData": MessageBody.Founder
          },
          "Commitment": {
            "txDataSign": commitment_sig,
            "originalData": MessageBody.Commitment
          },
          "RevocableDelivery": {
            "txDataSign": rd_sig,
            "originalData": MessageBody.RevocableDelivery
          },
          "AssetType": redata.MessageBody.AssetType,
          "Deposit": redata.MessageBody.Deposit,
          "RoleIndex": redata.MessageBody.RoleIndex
        }
      }
        _this.websock[i].data.send(JSON.stringify(Message));

        let ip = _this.uri2Ip(redata.Sender,20556);
        axios({
          method: 'post',
          url: _this.RpcUrl,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "FunderTransaction",
            "params": [redata.Sender.split("@")[0],redata.Receiver.split("@")[0],MessageBody.Founder.addressFunding,MessageBody.Founder.scriptFunding,redata.MessageBody.Deposit,redata.MessageBody.Deposit,MessageBody.Founder.txId,redata.MessageBody.AssetType],
            "id": 1
          })
        }).then(function(res){
          console.log(res.data);
          var Message = {
              "MessageType":"Founder",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "TxNonce": redata.TxNonce,
              "ChannelName": redata.ChannelName,
              "MessageBody": {
                    "Founder": MessageBody.Founder,
                    "Commitment": res.data.result.C_TX,
                    "RevocableDelivery": res.data.result.R_TX,
                    "AssetType": redata.MessageBody.AssetType,
                    "Deposit": redata.MessageBody.Deposit,
                    "RoleIndex": redata.MessageBody.RoleIndex + 1
                  }
           }
           _this.$store.state.vuexStore.channelList.websock[i].data.send(JSON.stringify(Message));
        });
        MessageBody.ChannelName = redata.ChannelName;
        _this.TxList.push(MessageBody);
        _this.StoreFounder();
    },
    OnMesFounderSign:function(redata){
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
        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          console.log(gasPrice);
        var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.trinityContractAbi, _this.$store.state.vuexStore.trinityContractAddress, {
            from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
            gasPrice: gasPrice * 10        //Gas价格
        });
        let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.addChannelInfo.keyStorePass);
        web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数

          let functionSig = web3.eth.abi.encodeFunctionSignature('deposit(bytes32,uint256,address,uint256,address,uint256,bytes,bytes)');     //获取functionSig
          console.log(functionSig);
          console.log(_this.$store.state.vuexStore.addChannelInfo.channelName);
          console.log('0');
          console.log(_this.$store.state.vuexStore.walletInfo.address);
          console.log(_this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7);
          console.log(_this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0]);
          console.log(_this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7);
          console.log(_this.$store.state.vuexStore.addChannelInfo.selfSignedData);
          console.log(redata.MessageBody.Commitment);
          let data = web3.eth.abi.encodeParameters(['bytes32','uint256','address','uint256','address','uint256','bytes','bytes'], [_this.$store.state.vuexStore.addChannelInfo.channelName,'0', _this.$store.state.vuexStore.walletInfo.address, _this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7, _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],_this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7, _this.$store.state.vuexStore.addChannelInfo.selfSignedData, redata.MessageBody.Commitment]);        //abi加密参数
          console.log(data);

          var txData = {        //组成txData数据
              nonce: web3.utils.toHex(nonce++),
              gasPrice: web3.utils.toHex(gasPrice * 10), 
              gasLimit: web3.utils.toHex(4500000),
              to: _this.$store.state.vuexStore.trinityContractAddress,
              from: _this.$store.state.vuexStore.walletInfo.address, 
              value: '0x00', 
              data: functionSig + data.substr(2)
          };
          console.log(txData);

          let signedData = signData(txData,decryptPK.privateKey);
          console.log(signedData);

          web3.eth.sendSignedTransaction('0x' + signedData)
            .on('transactionHash', function(hash){
              console.log(hash);
              _this.$notify({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: '上链成功，请交易确认',
                  duration: 3000,
                  type: 'success'
              });
            })
            .on('receipt', function(receipt){
              console.log(receipt);
              _this.$notify({
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: '交易已确认',
                  duration: 3000,
                  type: 'success'
              });
            })
            .on('confirmation', function(confirmationNumber, receipt){
              if(receipt.status == "0x0"){
                return false;
              }
            })
            .on('error', function(error){
              _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '交易确认失败',
                duration: 0
              });
              let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.addChannelInfo.channelName);
              _this.$store.state.vuexStore.channelList.splice(l,1);
              _this.StoreChannel();         //储存通道信息
              return false;
            })
          });
          let Message = {
            'messageType': 'monitorDeposit',
            "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
            'chainType': redata.MessageBody.AssetType,
            'playload': redata.ChannelName,
            'comments': ''
          };
          _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));
        })
      } else {
        console.log("Status异常");
      }
    },
    OnMesRsmc:function(redata){
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
    showReceiptRsmcInfoBox() {       //显示接收信息框
      this.isReceiptRsmcInfoBox = true;
    },
    RsmcSign() {          //进入RsmcSign,开始对交易数据签名
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[0].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].OtherBalance - (_this.activeInfo.redata.PaymentCount * 10e7)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].SelfBalance + (_this.activeInfo.redata.PaymentCount * 10e7)}       //对端押金
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
              "MessageBody": {
                "AssetType": _this.$store.state.vuexStore.channelList[l].assetType,
                "PaymentCount": _this.activeInfo.redata.PaymentCount,
                "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
                "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
                "Commitment": commitment,
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
    OnMesRsmcSign:function(redata){
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
      //   },
      //   "Comments": {},
      //   "Status": RESPONSE_OK,
      // }
      let _this = this;
      if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，更新通道信息,并保存签名数据
        let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
        console.log(l);
        if(l === null){             //如果未检测到通道,给出提醒
            _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '未找到该通道更新状态',
                duration: 3000
            });
            return;
        } else {
          let channelInfo = _this.$store.state.vuexStore.channelList[l];
          channelInfo.SelfBalance -= redata.MessageBody.PaymentCount * 10e7;     //本端余额更新
          channelInfo.OtherBalance += redata.MessageBody.PaymentCount * 10e7;    //对端余额更新
          channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
          console.log(_this.$store.state.vuexStore.channelList[l]);
          _this.StoreChannel();
          _this.$notify({
              title: '成功',
              dangerouslyUseHTMLString: true,
              message: '转账确认',
              duration: 3000,
              type: 'success'
          });
        }
      } else {
        _this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: redata.Status,
          duration: 3000
        });
        return;
      }
    },
    OnMesAckRouterInfo:function(redata){
        // console.log("收到type为" + type + "的消息");
        // console.log(redata.RouterInfo);
        if(redata.RouterInfo === null){
          swal({
            title: "Info",
            text:"There is no channel available for transfer.",
            type: "error",
            showCancelButton: false
          });
          this.PaymentLink = "";
          return false;
        } else {
          let _this = this;
          let Router = redata.RouterInfo.FullPath;

          if(_this.TxOnChannelInfo.ReceiverUrl.split(":")[1] == 8766){
            Router.unshift([_this.TxOnChannelInfo.SendUrl,0]);
            Router.push([_this.TxOnChannelInfo.ReceiverUrl,0]);
          }

          let p = Router.length - 1;
          let url = Router[p][0];
          // console.log(url);

          let ip = _this.UriToIp(url,20556);
          let ip1 = _this.UriToIp(redata.RouterInfo.Next,8766);
          let assetId = _this.AssetTypeToAssetId(_this.TxOnChannelInfo.AssetType);
          let Balance;
          let Balance2;
          let ChannelName;
          _this.ChannelItems.forEach(function(val,index){
            if(val.Url === redata.RouterInfo.Next){
               Balance = val.Balance;
               Balance2 = val.Balance2;
               ChannelName = val.ChannelName;
            }
          });
          let l = [];
          _this.TxList.forEach(function(data,index){
            if(data.ChannelName === ChannelName){
               l.push(data.Founder);
            }
          });
          let i;
          _this.websock.forEach(function(data,index){   //遍历
            if(data.ChannelName === ChannelName){
                i = index;
                return false;
             }
          })
          let Fee = 0;
          for (var b = 0; b < p ; b++){
            Fee += redata.RouterInfo.FullPath[b][1];
          }
          Fee = parseFloat(Fee).toFixed(8) * 10000;     //防止浮点误差
          this.TxOnChannelInfo.Fee = Fee/10000;
          // console.log(i);
          // console.log(l);
          // console.log(Fee);

          let lLength = l.length - 1;
          //console.log(l[lLength]);
          let addressFunding = l[lLength].addressFunding;
          //console.log(addressFunding);
          let scriptFunding = l[lLength].scriptFunding;
          //console.log(scriptFunding);
          swal({
            title: "Attention!",
            text: "You will pay " + Fee/10000 + _this.TxOnChannelInfo.AssetType + " as route fee.",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: true,
          },
          function(){
            axios({
              method: 'post',
              url: _this.RpcUrl,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "HTLCTransaction",
                "params": [_this.WalletInfo.PublicKey,_this.TxOnChannelInfo.ReceiverUrl.split("@")[0],(_this.TxOnChannelInfo.Value + Fee)/10000,Balance,Balance2,_this.TxOnChannelInfo.Hr,addressFunding,scriptFunding,_this.TxOnChannelInfo.AssetType],
                "id": 1
              })
            }).then(function(res){
              // console.log(res);
              let TxNonce = 0;
              _this.TxNonceList.forEach(function(data,index){
                if(data.ChannelName === ChannelName){
                  TxNonce = data.TxNonce;
                } 
              })

              let Message = {
                "MessageType":"Htlc",
                "Sender": _this.WalletInfo.PublicKey + "@" + ip1,
                "Receiver":redata.RouterInfo.Next,
                "TxNonce": TxNonce + 1,
                "ChannelName":ChannelName,
                "Router":Router,
                "Next":redata.RouterInfo.Next,
                "MessageBody": {
                        "HCTX":res.data.result.HCTX,
                        "RDTX":res.data.result.RDTX,
                        "HEDTX":res.data.result.HEDTX,
                        "HTTX":res.data.result.HTTX,
                        "HTDTX":res.data.result.HTDTX,
                        "HTRDTX":res.data.result.HTRDTX,
                        "RoleIndex":0,
                        "Comments":"",
                        "Count":(_this.TxOnChannelInfo.Value + Fee)/10000,
                        "AssetType":_this.TxOnChannelInfo.AssetType,
                        "HashR":_this.TxOnChannelInfo.Hr
                    }
                }
                _this.websock[i].data.send(JSON.stringify(Message));
                // console.log(JSON.stringify(Message));
                _this.PaymentLink = "";
                setTimeout(function(){
                  if(_this.HtlcFlag === false){
                    swal({
                      title: "transaction failed.",
                      type: "error",
                      showCancelButton: false
                    });
                  }
                }, 3000);
            })
          })
        }
    },
    OnMesHtlc:function(redata){
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
      } else{
        _this.activeInfo.redata = redata;     
        _this.$notify.info({
            title: '消息',
            duration: 0,
            message: _this.$store.state.vuexStore.channelList[l].Alice + "通道有收款消息,需要你解锁钱包.<br/>点击进行解锁",
            onClick: _this.showReceiptInfoBox        //显示接收信息框
        });
      }
    },
    showReceiptHtlcInfoBox() {       //显示接收信息框
      this.isReceiptInfoBox = true;
    },
    HtlcSign() {          //进入HtlcSign,开始对交易数据签名
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[0].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].OtherBalance - (_this.activeInfo.redata.PaymentCount * 10e7)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].SelfBalance + (_this.activeInfo.redata.PaymentCount * 10e7)}       //对端押金
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
              "MessageBody": {
                "AssetType": _this.$store.state.vuexStore.channelList[l].assetType,
                "PaymentCount": _this.activeInfo.redata.PaymentCount,
                "SenderBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
                "ReceiverBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance,
                "Commitment": commitment,
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
    OnMesHtlcSign:function(redata){
      // console.log(redata);

      let _this = this;
      let MessageBody = redata.MessageBody;

      let i;
      _this.websock.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.ChannelName){
              i = index;
              return false;
          }
      })

      _this.TxNonceList.forEach(function(data,index){
        if(data.ChannelName === redata.ChannelName){
          data.TxNonce ++;
        } 
      })

      if(MessageBody.RoleIndex === 1){
        let R = "";
        console.log("HashR:" + redata.MessageBody.HashR);
        _this.RList.forEach(function(data,index){
            if(data.Hr === MessageBody.HashR){
               console.log(data.Hr);
               R = data.R
            }
          });
        // console.log(R);
        // console.log("此处回复RResponse");
        let Message1 = {
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
        _this.websock[i].data.send(JSON.stringify(Message1));
      }      
    }, 
    OnMesRResponse:function(redata){
      // console.log("收到type为" + type + "的消息");
      var _this = this;
      let hr = hex_sha1(redata.MessageBody.R);
      // console.log(hr);
      // console.log(redata.MessageBody.HR);
      if(hr === redata.MessageBody.HR){
        // console.log("进入R交易");

        let Balance,Balance2;
        _this.ChannelItems.forEach(function(val,index){
          if(val.ChannelName === redata.ChannelName){
              Balance = val.Balance;
              Balance2 = val.Balance2;
          }
        });
        let l = [];
        _this.TxList.forEach(function(data,index){
          if(data.ChannelName === redata.ChannelName){
              l.push(data.Founder);
          }
        });
        let i;
        _this.websock.forEach(function(data,index){   //遍历
          if(data.ChannelName === redata.ChannelName){
              i = index;
              return false;
            }
        })
        // console.log(i);
        // console.log(l);
        let lLength = l.length - 1;
        //console.log(l[lLength]);
        let txId = l[lLength].txId;
        let addressFunding = l[lLength].addressFunding;
        //console.log(addressFunding);
        let scriptFunding = l[lLength].scriptFunding;
        //console.log(scriptFunding);

        // console.log(p);
        let ip = _this.UriToIp(_this.TxOnChannelInfo.ReceiverUrl,20556);
        axios({
          method: 'post',
          url: _this.RpcUrl,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            "jsonrpc": "2.0",
            // "method": "GetRSMCMessage",
            // "params": [ChannelName , SendUrl + ":8766", _this.TxOnChannelInfo.ReceiverUrl , _this.TxOnChannelInfo.AssetType , _this.TxOnChannelInfo.Value/10000 , p + 1 , 0],
            "method": "FunderTransaction",    //实际为RSMCTransaction，与FunderTransaction公用一个接口方法
            "params": [ redata.Sender.split('@')[0] ,_this.WalletInfo.PublicKey ,addressFunding ,scriptFunding ,Balance2 ,Balance , txId , redata.MessageBody.AssetType],
            "id": 1
          })
        }).then(function(res){
            console.log(res);
            let Message = {
              "MessageType":"Rsmc",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "TxNonce": redata.TxNonce + 1,
              "ChannelName": redata.ChannelName,
              "MessageBody": {
                  "Commitment": res.data.result.C_TX,
                  "RevocableDelivery": res.data.result.R_TX,
                  "AssetType": _this.TxOnChannelInfo.AssetType,
                  "Value": redata.MessageBody.Count,
                  "RoleIndex": 0,
                  "Comments": _this.TxOnChannelInfo.Hr
              }
              }
              _this.websock[i].data.send(JSON.stringify(Message));
               console.log(JSON.stringify(Message));

              _this.BreachRemedy = res.data.result.BR_TX;
              
              let Address;
              _this.ChannelItems.forEach(function(val,index){   //遍历
                if(val.ChannelName === redata.ChannelName){
                      Address = val.Name;
                  }
              })
              // let ReceiverAddr = _this.PlckToAdrs(_this.TxOnChannelInfo.ReceiverUrl.split("@")[0]);
              let Message1 = {
                "Address":Address,
                "Amount":_this.TxOnChannelInfo.Value/10000,
                "AssetType":_this.TxOnChannelInfo.AssetType,
                "Fee":_this.TxOnChannelInfo.Fee,
                "Flag":false,
                "isTestNet":_this.isTestNet,
                "Date":new Date().getTime()
              }
              _this.RecordList.push(Message1);
              _this.StoreRecordList(_this.RecordList);
        });
      }
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
        web3.eth.getGasPrice().then(function(gasPrice){             // 获取GAS价格
          console.log(gasPrice);
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.trinityContractAbi, _this.$store.state.vuexStore.trinityContractAddress, {       //声明合约
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: gasPrice * 10        //Gas价格
          });
          web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
            console.log(nonce);

            let functionSig = web3.eth.abi.encodeFunctionSignature('quickCloseChannel(bytes32,uint256,address,uint256,address,uint256,bytes,bytes)');     //获取functionSig
            console.log(functionSig);

            let data = web3.eth.abi.encodeParameters(['bytes32','uint256','address','uint256','address','uint256','bytes','bytes'], [_this.$store.state.vuexStore.closeChannelInfo.ChannelName, 4294967295, _this.$store.state.vuexStore.walletInfo.address, _this.$store.state.vuexStore.closeChannelInfo.SelfBalance, _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0],_this.$store.state.vuexStore.closeChannelInfo.OtherBalance, _this.$store.state.vuexStore.closeChannelInfo.selfSignedData, redata.MessageBody.Commitment]);        //abi加密参数
            console.log(data);

            var txData = {        //组成txData数据
                nonce: web3.utils.toHex(nonce++),
                gasPrice: web3.utils.toHex(gasPrice * 10), 
                gasLimit: web3.utils.toHex(4500000),
                to: _this.$store.state.vuexStore.trinityContractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address, 
                value: '0x00', 
                data: functionSig + data.substr(2)
            };
            console.log(txData);

            let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.closeChannelInfo.keyStorePass);             //解锁KeyStore
            let signedData = signData(txData,decryptPK.privateKey);
            console.log(signedData);

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
                    _this.cycleGetTransactionReceipt(hash);
                } else {
                    _console.log(err)
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
        console.log("Status异常");
      }
    },
    OnMesUpdateChannel:function(redata){
        // console.log("收到type为" + type + "的消息");
        var _this = this;
        // console.log(redata);

        let UserUrl = "";
        let UserUrl2 = "";

        if(redata.MessageBody.Founder.split('@')[0] === _this.WalletInfo.PublicKey){
          UserUrl = redata.MessageBody.Founder;//本端余额
          UserUrl2 = redata.MessageBody.Receiver; //对端余额
        } else {
          UserUrl = redata.MessageBody.Receiver;//本端余额
          UserUrl2 = redata.MessageBody.Founder; //对端余额
        }
        // console.log(UserUrl);
        var newBalance = redata.MessageBody.Balance[UserUrl].TNC;
        newBalance = parseFloat(newBalance);
        // console.log(newBalance);

        //let UserUrl2 = redata.MessageBody.Receiver;       //对端余额
        // console.log(UserUrl2);
        var newBalance2 = redata.MessageBody.Balance[UserUrl2].TNC;
        newBalance2 = parseFloat(newBalance2);
        // console.log(newBalance2);

        _this.ChannelItems.forEach(function(val,index){
          // console.log(redata.MessageBody.ChannelName);
          if(val.ChannelName === redata.MessageBody.ChannelName){
             val.Balance = newBalance;    //自己余额
             val.Balance2 = newBalance2;      //对端余额
             val.BalanceInfo = redata.MessageBody.Balance;
             swal({
               title: "Info",
               text:"Channel balance updated.",
               type: "info",
               showCancelButton: false
             });
             Bus.$emit('ClosePaymentCodeBox');
             _this.GetAssetsBalance();
          }
        });
    },
    OnMesDeleteChannel:function(redata){
      //  console.log("收到type为" + type + "的消息");
       let _this = this;
       _this.ChannelItems.forEach(function(val,index){
         if(val.ChannelName === redata.MessageBody.ChannelName){
          //  console.log(index);
           let Message1 = {
              "Address":val.Name,
              "Amount":val.Balance,
              "AssetType":val.AssetType,
              "Fee":0,
              "Flag":false,
              "isTestNet":_this.isTestNet,
              "Date":new Date().getTime()
           }
           _this.ChannelItems.splice(index,1);
           _this.RecordList.push(Message1);
           _this.StoreRecordList(_this.RecordList);
         }
       })
       _this.websock.forEach(function(val,index){
         if(val.ChannelName === redata.MessageBody.ChannelName){
          //  console.log(index);
           _this.websock.splice(index,1);
           return;
         }
       })
    },
    OnMesSettle:function(redata){
      //  console.log("收到type为" + type + "的消息");
       let Settlement_sig = signatureData( MessageBody.Settlement.txData, this.WalletInfo.PrivateKey);
       let _this = this;
       let i;
       _this.websock.forEach(function(val,index){   //遍历
         if(val.ChannelName === redata.ChannelName){
              if(val.Flag === 4){
                i = index;
                return false;
              } else {
                swal({
                  title: "This channel is not open.",
                  type: "info",
                  showCancelButton: false
                });
              }
          }
       })
       if(i){
       } else {
        swal({
          title: "This channel is not open.",
          type: "info",
          showCancelButton: false
        });
        return false;
       }
       let Message = {
          "MessageType":"SettleSign",
          "Sender": redata.Receiver,
          "Receiver":redata.Sender,
          "TxNonce": redata.TxNonce,
          "ChannelName":redata.ChannelName,
          "MessageBody": {
              "Settlement":{
                "originalData":redata.MessageBody.Settlement,
                "txDataSign":Settlement_sig
              },
              "Balance": redata.MessageBody.Balance
          }
        }
        _this.websock[i].data.send(JSON.stringify(Message));
        // console.log(JSON.stringify(Message));
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
        _this.$store.state.vuexStore.channelList[l].isConnect = false;
        // let ip = Ip + ":8766"
        // setTimeout(function () {
        //   let t = _this.ConnectWebsocket(ip,ChannelName);
        // }, 2000);
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
        console.log(1);
        _this.$store.state.vuexStore.channelList[l].websock = new WebSocket(wsuri);
        _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.websocketOnmessage;
        _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.websocketClose;
        _this.$store.state.vuexStore.channelList[l].isConnect = true;
        console.log(_this.$store.state.vuexStore.channelList);
      }
    },
    StoreChannel() {              //储存ChannelList
      console.log(this.$store.state.vuexStore.channelList);
      this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList",this.$store.state.vuexStore.channelList);
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%; 
  /* position: fixed; */
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
@media screen and (min-width: 320px) and (max-width: 1024px) {
  .rightBox{
    right: 0px;
  }
  .fullPage{
    width: 100% !important;
    right: -300px !important;
  }
}
@media screen and (min-width: 1025px) {
  .rightBox{
    width: calc(100% - 300px);
  }
  .fullPage{
    width: 100% !important;
    right: 0 !important;
  }
}

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
.headBox .el-badge__content {
  border: 0;       /* 去除角标边框 */
}
.el-dialog{
  min-width: 400px;
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
