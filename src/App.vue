<template>
  <div id="app" class="clearfloat appBox" mode="in-out">
      <div class="rightBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
          <head-box/>
          <router-view/>
          <message-box/>
          <footer-box/>
      </div>
      <head-nav/>
  </div>
</template>

<script>
import headNav from './components/common/headNav'
import headBox from './components/common/headBox'
import messageBox from './components/common/messageBox'
import footerBox from './components/common/footer'

export default {
  name: 'App',
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
        _this.$store.state.vuexStore.NodeUriWebSocket.onmessage = _this.$parent.nodeUriWebsocketOnMessage;
        _this.$store.state.vuexStore.NodeUriWebSocket.onclose = _this.$parent.nodeUriWebsocketClose;
        _this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: '已连接到Trinity网络',
            duration: 3000,
            type: 'success'
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
    getChannelSerial(type,value) {      //获取所需的channel在List的位置
        let _this = this;
        let i;
        _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
         if(data[type] === value){
              i = index;
              return;
          }
       })
       return i;
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

      } else {
        let redata = JSON.parse(e.data);
        let type = redata.MessageType;
        console.log(redata);

        switch(type)
        {
        case "Founder":
          _this.OnMesFounder(redata);
          break;
        case "SyncBlock":
          console.log(1);
          break;
        default:
        
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
          duration: 4000,
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
      case "RegisterChannel":
        _this.OnMesRegisterChannel(redata);
        break;
      case "AddChannel":
        _this.OnMesAddChannel(redata);
        break;
      case "FounderFail":
        _this.OnMesFounderFail(redata);
        break;
      case "Rsmc":
        _this.OnMesRsmc(redata);
        break;
      case "RsmcSign":
        _this.OnMesRsmcSign(redata);
        break;
      case "RsmcFail":
        _this.OnMesRsmcFail(redata);
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
      case "HtlcFail":
        _this.OnMesHtlcFail(redata);
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
      case "RegisterChannelFail":
        _this.OnMesRegisterChannelFail(redata);
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
      let i = getChannelSerial(ChannelName,redata.ChannelName);
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
        let contractAddress = "0x47EFb4f6F40837973fD41657c44F04903f5E8De9";
        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          console.log(gasPrice);
        var myContract = new web3.eth.Contract(TrinityContractAbi, contractAddress, {
            from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
            gasPrice: gasPrice        //Gas价格
        });
        let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.addChannelInfo.keyStorePass);
        web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
            console.log(nonce);

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
                gasPrice: web3.utils.toHex(gasPrice), 
                gasLimit: web3.utils.toHex(4500000),
                to: contractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address, 
                value: '0x00', 
                data: functionSig + data.substr(2)
            };
            console.log(txData);

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
          // let Message = {
          //   'messageType': 'monitorDeposit',
          //   "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
          //   'chainType': redata.MessageBody.AssetType,
          //   'playload': redata.ChannelName,
          //   'comments': ''
          // };
          // _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));
          })
        })
      } else {
        console.log("Status异常");
      }
    },
    OnMesRegisterChannel:function(redata){
       var _this = this;
       var k = _this.FounderFailI;
      //  console.log(k);
        let ip = _this.UriToIp(redata.Sender,20556);
        // console.log(ip);
        axios({
         method: 'post',
         url: _this.RpcUrl,
         headers: {
           'Content-Type': 'application/json;charset=UTF-8'
         },
         data: JSON.stringify({
           "jsonrpc": "2.0",
           "method": "FunderCreate",
           "params": [redata.Sender.split("@")[0],redata.Receiver.split("@")[0],redata.MessageBody.Deposit,redata.MessageBody.AssetType],
           "id": 1
         })
        }).then(function(res){
          // console.log(res);
          let Message = {
              "MessageType":"Founder",
              "Sender": redata.Receiver,
              "Receiver":redata.Sender,
              "TxNonce": 0,
              "ChannelName":redata.ChannelName,
              "MessageBody": {
                  "Founder": res.data.result.Founder,
                  "Commitment":res.data.result.C_TX,
                  "RevocableDelivery":res.data.result.R_TX,
                  "AssetType":redata.MessageBody.AssetType,
                  "Deposit": redata.MessageBody.Deposit,
                  "RoleIndex":0
              },
              "Comments":"retry"
           }
          //  console.log(Message);
           // var _this = this;
           // var i = this.FounderFail.index;
          //  console.log(k);
           let oldChannelName = "";
           _this.websock.forEach(function(val,index){   //遍历
           if(index === k){
                oldChannelName = val.ChannelName;
                val.ChannelName = redata.ChannelName;
             }
           });
           _this.ChannelItems.forEach(function(val,index){   //遍历
            if(val.ChannelName === oldChannelName){
                 val.ChannelName = redata.ChannelName;
             }
           });
           _this.websock[k].data.send(JSON.stringify(Message));
           _this.ChannelItems.forEach(function(val,index){   //遍历
           if(val.ChannelName === redata.MessageBody.ChannelName){
                _this.Founder = redata.Sender;
                _this.Receiver = redata.Receiver;
                _this.$set(val,'Flag',3);
            }
           });
        });
    },
    OnMesAddChannel:function(redata){
       let _this = this;
       _this.ChannelItems.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.MessageBody.ChannelName){
             _this.$set(val,'Flag',4);
             let TxNonceMessage = {
               "ChannelName":redata.MessageBody.ChannelName,
               "TxNonce":0
             }
             _this.TxNonceList.push(TxNonceMessage);
             _this.StoreTxNonce();
             swal({
                title: "Success!",
                text: "Channel has been opened.",
                type: "success",
                showCancelButton: false
             });
             let Message1 = {
                "Address":val.Name,
                "Amount":val.Balance,
                "AssetType":val.AssetType,
                "Fee":0,
                "Flag":true,
                "isTestNet":_this.isTestNet,
                "Date":new Date().getTime()
             }
             _this.RecordList.push(Message1);
             _this.StoreRecordList(_this.RecordList);
            //  _this.GetAssetsBalance();
         }
      })
    },
    OnMesRegisterChannelFail:function(redata){
      // console.log("收到type为" + type + "的消息");
      let _this = this;
      _this.ChannelItems.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.ChannelName){
          _this.ChannelItems.splice(index,1);
        }
      })
      swal({
        title: "Fail",
        text: redata.Error,
        type: "error",
        showCancelButton: false
      });
    },
    OnMesFounderFail:function(redata){
            // console.log("收到type为" + type + "的消息");
      let _this = this;
      _this.ChannelItems.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.ChannelName){
          _this.ChannelItems.splice(index,1);
        }
      })
      swal({
        title: "Fail",
        text: redata.Error,
        type: "error",
        showCancelButton: false
      });
    },
    OnMesRsmc:function(redata){
       var _this = this;
       let i;
       _this.websock.forEach(function(val,index){   //遍历
         if(val.ChannelName === redata.ChannelName){
              i = index;
              return false;
          }
       })
       let MessageBody = redata.MessageBody;
      //  console.log(MessageBody);
       //this.FoundertxDataSign = signatureData( MessageBody.Founder.txData, this.WalletInfo.PrivateKey);
      //  console.log(MessageBody.Commitment);
      //  if(MessageBody.Commitment === undefined){
      //     swal({
      //       title: "Fail",
      //       text: "something error",
      //       type: "error",
      //       showCancelButton: false
      //     });
      //     return
      //  }
       if (MessageBody.RoleIndex === 3 && redata.Receiver.split('@')[0] === _this.WalletInfo.PublicKey){
         //当本端为RSMC交易发起者时，且RoleIndex为3时保存BreachRemed交易
          if(MessageBody.BreachRemedy){
            _this.TxList.forEach(function(val,index){   //遍历
              if(val.ChannelName === redata.ChannelName){
                  val.BreachRemedy = MessageBody.BreachRemedy;
                  return false;
              }
            })
          }
       } else if(MessageBody.RoleIndex === 2 && redata.Receiver.split('@')[0] === _this.WalletInfo.PublicKey){
         //当对端为RSMC交易发起者时，且RoleIndex为2时保存BreachRemed交易
          if(MessageBody.BreachRemedy){
            _this.TxList.forEach(function(val,index){   //遍历
              if(val.ChannelName === redata.ChannelName){
                  val.BreachRemedy = MessageBody.BreachRemedy;
                  return false;
              }
            })
          }
       }
       let commitment_sig,rd_sig;
       if(MessageBody.Commitment){
         commitment_sig = signatureData( MessageBody.Commitment.txData, this.WalletInfo.PrivateKey);
       }
       if(MessageBody.RevocableDelivery){
         rd_sig = signatureData( MessageBody.RevocableDelivery.txData, this.WalletInfo.PrivateKey);
       }
       let Message = {
          "MessageType":"RsmcSign",
          "Sender": redata.Receiver,
          "Receiver":redata.Sender,
          "ChannelName":redata.ChannelName,
          "TxNonce": redata.TxNonce,
          "MessageBody": {
              "Commitment": {
                "txDataSign":commitment_sig,
                "originalData":MessageBody.Commitment
              },
              "RevocableDelivery": {
                "txDataSign":rd_sig,
                "originalData":MessageBody.RevocableDelivery
              },
              "AssetType": redata.MessageBody.AssetType,
              "Value": redata.MessageBody.Value,
              "RoleIndex": redata.MessageBody.RoleIndex,
              "Comments": redata.MessageBody.Comments
              },
          }
        if(commitment_sig || rd_sig){
          _this.websock[i].data.send(JSON.stringify(Message));
          // console.log(JSON.stringify(Message));
        }
        
        if(MessageBody.RoleIndex === 0){
          //当RoleIndex为0时回复Rsmc同时构造Rsmc交易
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
            // console.log(l);
            let lLength = l.length - 1;
            //console.log(l[lLength]);
            let txId = l[lLength].txId;
            let addressFunding = l[lLength].addressFunding;
            //console.log(addressFunding);
            let scriptFunding = l[lLength].scriptFunding;
            //console.log(scriptFunding);

            // console.log(p);
            let ip = _this.UriToIp(redata.Receiver,20556);
            axios({
              method: 'post',
              url: _this.RpcUrl,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
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
                  "TxNonce": redata.TxNonce,
                  "ChannelName": redata.ChannelName,
                  "MessageBody": {
                      "Commitment": res.data.result.C_TX,
                      "RevocableDelivery": res.data.result.R_TX,
                      "AssetType": redata.MessageBody.AssetType,
                      "Value": redata.MessageBody.Value,
                      "RoleIndex": redata.MessageBody.RoleIndex + 1,
                      "Comments": redata.MessageBody.Comments
                  }
                  }
                  _this.websock[i].data.send(JSON.stringify(Message));
                  console.log(JSON.stringify(Message));

                  _this.BreachRemedy = res.data.result.BR_TX;

                  // let Address;
                  // _this.ChannelItems.forEach(function(val,index){   //遍历
                  //   if(val.ChannelName === redata.ChannelName){
                  //         Address = val.Name;
                  //     }
                  // })
                  // // let ReceiverAddr = _this.PlckToAdrs(_this.TxOnChannelInfo.ReceiverUrl.split("@")[0]);
                  // let Message1 = {
                  //   "Address":Address,
                  //   "Amount":_this.TxOnChannelInfo.Value/10000,
                  //   "AssetType":_this.TxOnChannelInfo.AssetType,
                  //   "Fee":_this.TxOnChannelInfo.Fee,
                  //   "Flag":false,
                  //   "isTestNet":_this.isTestNet,
                  //   "Date":new Date().getTime()
                  // }
                  // _this.RecordList.push(Message1);
                  // _this.StoreRecordList(_this.RecordList);
            });
        }
        if(MessageBody.RoleIndex === 1 || MessageBody.RoleIndex === 2){
          //_this.FounderFail = redata.MessageBody;
          // _this.FounderFailI = i;
          // let ip = _this.UriToIp(this.ReceiverUrl,20556);
          // console.log(ip);
          // console.log(redata.Comments);
          let Founder;
          _this.TxList.forEach(function(val,index){   //遍历
            if(val.ChannelName === redata.ChannelName){
                  Founder = val.Founder;
              }
          })
          let BreachRemedy_sig = signatureData( _this.BreachRemedy.txData, _this.WalletInfo.PrivateKey);
          let Message1 = {
            "MessageType":"Rsmc",
            "Sender": redata.Receiver,
            "Receiver":redata.Sender,
            "ChannelName":redata.ChannelName,
            "TxNonce": redata.TxNonce,
            "MessageBody": {
                "BreachRemedy": {
                  "txDataSign":BreachRemedy_sig,
                  "originalData":_this.BreachRemedy
                },
                "AssetType": redata.MessageBody.AssetType,
                "Value": redata.MessageBody.Value,
                "RoleIndex": redata.MessageBody.RoleIndex + 1,
                "Comments":redata.MessageBody.Comments
                },
            }
          _this.websock[i].data.send(JSON.stringify(Message1));
          //  console.log(JSON.stringify(Message1));
        }
        if(MessageBody.RoleIndex === 2){
          let Name;
          _this.ChannelItems.forEach(function(data,index){
            if(data.ChannelName === redata.ChannelName){
              Name = data.Name;
            }
          })
          // let ReceiverAddr = _this.PlckToAdrs(redata.Sender.split("@")[0]);
          let Message1 = {
            "Address": Name,
            "Amount": redata.MessageBody.Value,
            "AssetType": redata.MessageBody.AssetType,
            "Fee": 0,
            "Flag":true,
            "isTestNet":_this.isTestNet,
            "Date":new Date().getTime()
          }
          _this.RecordList.push(Message1);
        }
    },
    OnMesRsmcSign:function(redata){
      let _this = this;
      _this.TxNonceList.forEach(function(data,index){
        if(data.ChannelName === redata.ChannelName){
          data.TxNonce ++;
        } 
      })
    },
    OnMesRsmcFail:function(redata){
        swal({
          title: "Info.",
          text: redata.Error,
          type: "info",
          showCancelButton: false
        });
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
      let _this = this;
      _this.HtlcFlag = true;    //消息接收标记

      let MessageBody = redata.MessageBody;
      let RoleIndex = MessageBody.RoleIndex;
      let i;
      _this.websock.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.ChannelName){
              i = index;
              return false;
          }
      })
      // console.log("收到type为" + type + "的消息");
      let HCTX_sig,HTTX_sig,HTDTX_sig,HTRDTX_sig,RDTX_sig;
      if(MessageBody.HCTX){
        HCTX_sig = signatureData( MessageBody.HCTX.txData, this.WalletInfo.PrivateKey);
        console.log("HCTX_sig:" + HCTX_sig);
      }
      // if(MessageBody.HERDTX){
      //   let HERDTX_sig = signatureData( MessageBody.HERDTX.txData, this.WalletInfo.PrivateKey);
      //   console.log("HERDTX_sig:" + HERDTX_sig);
      // }
      // if(MessageBody.HEDTX){
      //   let HEDTX_sig = signatureData( MessageBody.HEDTX.txData, this.WalletInfo.PrivateKey);
      //   console.log("HEDTX_sig:" + HEDTX_sig);
      // }
      if(MessageBody.HTTX){
        HTTX_sig = signatureData( MessageBody.HTTX.txData, this.WalletInfo.PrivateKey);
        console.log("HTTX_sig:" + HTTX_sig);
      }
      if(MessageBody.HTDTX){
        HTDTX_sig = signatureData( MessageBody.HTDTX.txData, this.WalletInfo.PrivateKey);
        console.log("HTDTX_sig:" + HTDTX_sig);
      }
      if(MessageBody.HTRDTX){
        HTRDTX_sig = signatureData( MessageBody.HTRDTX.txData, this.WalletInfo.PrivateKey);
        console.log("HTRDTX_sig:" + HTRDTX_sig);
      }
      // if(MessageBody.HETX){
      //   let HETX_sig = signatureData( MessageBody.HETX.txData, this.WalletInfo.PrivateKey);
      //   console.log("HETX_sig:" + HETX_sig);
      // }
      if(MessageBody.RDTX){
        RDTX_sig = signatureData( MessageBody.RDTX.txData, this.WalletInfo.PrivateKey);
        console.log("RDTX_sig:" + RDTX_sig);
      }
      let Message;
      if(RoleIndex === 0){
        Message = {
        "MessageType":"HtlcSign",
        "Sender": redata.Receiver,
        "Receiver":redata.Sender,
        "TxNonce": redata.TxNonce,
        "ChannelName":redata.ChannelName,
        "Router":redata.Router,
        "Next":redata.Next,
        "MessageBody": {
                "HCTX": {
                  "txDataSign":HCTX_sig,
                  "originalData":MessageBody.HCTX,
                },
                "RDTX": {
                  "txDataSign":RDTX_sig,
                  "originalData":MessageBody.RDTX,
                },
                "HTTX": {
                  "txDataSign":HTTX_sig,
                  "originalData":MessageBody.HTTX,
                },
                "HTRDTX": {
                  "txDataSign":HTRDTX_sig,
                  "originalData":MessageBody.HTRDTX,
                },
                "HEDTX":MessageBody.HEDTX,
                "RoleIndex":MessageBody.RoleIndex,
                "Comments":"",
                "Count":MessageBody.Count,
                "AssetType":MessageBody.AssetType,
                "HashR":MessageBody.HashR
            }
        }
      } else if(RoleIndex === 1){
        Message = {
        "MessageType":"HtlcSign",
        "Sender": redata.Receiver,
        "Receiver":redata.Sender,
        "TxNonce": redata.TxNonce,
        "ChannelName":redata.ChannelName,
        "Router":redata.Router,
        "Next":redata.Next,
        "MessageBody": {
                "HCTX": {
                  "txDataSign":HCTX_sig,
                  "originalData":MessageBody.HCTX,
                },
                "RDTX": {
                  "txDataSign":RDTX_sig,
                  "originalData":MessageBody.RDTX,
                },
                "HTDTX": {
                  "txDataSign":HTDTX_sig,
                  "originalData":MessageBody.HTDTX,
                },
                "HETX": MessageBody.HETX,
                "HERDTX": MessageBody.HERDTX,
                "RoleIndex":MessageBody.RoleIndex,
                "Comments":"",
                "Count":MessageBody.Count,
                "AssetType":MessageBody.AssetType,
                "HashR":MessageBody.HashR
            }
        }
      }
        _this.websock[i].data.send(JSON.stringify(Message));
        // console.log(JSON.stringify(Message));
        if(RoleIndex === 0){
          // 增加htlc回馈,当RoleIndex为0时，构造Htlc交易
          let Balance;
          let Balance2;
          let ChannelName;
          _this.ChannelItems.forEach(function(val,index){
            if(val.Url === redata.Sender){
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
          console.log(i);
          console.log(l);
          let lLength = l.length - 1;
          console.log(l[lLength]);
          let addressFunding = l[lLength].addressFunding;
          console.log(addressFunding);
          let scriptFunding = l[lLength].scriptFunding;

          axios({
              method: 'post',
              url: _this.RpcUrl,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "HTLCTransaction",
                "params": [_this.WalletInfo.PublicKey, redata.Sender.split("@")[0], MessageBody.Count, Balance,Balance2,MessageBody.HashR,addressFunding,scriptFunding,MessageBody.AssetType],
                "id": 1
              })
            }).then(function(res){
               console.log(res);
              let HETX_sig = signatureData( res.data.result.HETX.txData, _this.WalletInfo.PrivateKey);
              let HERDTX_sig = signatureData( res.data.result.HERDTX.txData, _this.WalletInfo.PrivateKey);
              let Message1 = {
                "MessageType":"Htlc",
                "Sender": redata.Receiver,
                "Receiver":redata.Sender,
                "TxNonce": redata.TxNonce,
                "ChannelName":ChannelName,
                "Router":redata.Router,
                "Next":redata.Next,
                "MessageBody": {
                        "HCTX":res.data.result.HCTX,
                        "RDTX":res.data.result.RDTX,
                        "HTDTX":res.data.result.HTDTX,
                        "HETX":{
                          "txDataSign":HETX_sig,
                          "originalData":res.data.result.HETX,
                        },
                        "HERDTX":{
                          "txDataSign":HERDTX_sig,
                          "originalData":res.data.result.HERDTX,
                        },
                        "RoleIndex":MessageBody.RoleIndex + 1,
                        "Comments":"",
                        "Count":MessageBody.Count,
                        "AssetType":MessageBody.AssetType,
                        "HashR":MessageBody.HashR
                    }
                }
              _this.websock[i].data.send(JSON.stringify(Message1));
            })
        }     
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
    OnMesHtlcFail:function(redata){
        swal({
          title: "Info",
          text: redata.Error,
          type: "info",
          showCancelButton: false
        });  
    },
    OnMesFounderFail:function(redata){
            // console.log("收到type为" + type + "的消息");
      let _this = this;
      _this.ChannelItems.forEach(function(val,index){   //遍历
        if(val.ChannelName === redata.ChannelName){
          _this.ChannelItems.splice(index,1);
        }
      })
      swal({
        title: "Fail",
        text: redata.Error,
        type: "error",
        showCancelButton: false
      });
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
        let contractAddress = "0x47EFb4f6F40837973fD41657c44F04903f5E8De9";         //Trinity状态通道合约地址
        web3.eth.getGasPrice().then(function(gasPrice){             // 获取GAS价格
          console.log(gasPrice);
          var myContract = new web3.eth.Contract(TrinityContractAbi, contractAddress, {       //声明合约
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: gasPrice        //Gas价格
          });
          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.closeChannelInfo.keyStorePass);             //解锁KeyStore
          web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
            console.log(nonce);

            let functionSig = web3.eth.abi.encodeFunctionSignature('quickCloseChannel(bytes32,uint256,address,uint256,address,uint256,bytes,bytes)');     //获取functionSig
            console.log(functionSig);

            let data = web3.eth.abi.encodeParameters(['bytes32','uint256','address','uint256','address','uint256','bytes','bytes'], [_this.$store.state.vuexStore.closeChannelInfo.channelName,'0', _this.$store.state.vuexStore.walletInfo.address, _this.$store.state.vuexStore.closeChannelInfo.selfDeposit * 10e7, _this.$store.state.vuexStore.closeChannelInfo.uri.split("@")[0],_this.$store.state.vuexStore.closeChannelInfo.otherDeposit * 10e7, _this.$store.state.vuexStore.closeChannelInfo.selfSignedData, redata.MessageBody.Commitment]);        //abi加密参数
            console.log(data);

            var txData = {        //组成txData数据
                nonce: web3.utils.toHex(nonce++),
                gasPrice: web3.utils.toHex(gasPrice), 
                gasLimit: web3.utils.toHex(4500000),
                to: contractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address, 
                value: '0x00', 
                data: functionSig + data.substr(2)
            };
            console.log(txData);

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
          // let Message = {
          //   'messageType': 'monitorDeposit',
          //   "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
          //   'chainType': redata.MessageBody.AssetType,
          //   'playload': redata.ChannelName,
          //   'comments': ''
          // };
          // _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));
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
    websocketClose() {        //断开websocket
      console.log("已断开websocket");
      // console.log(val);
      let Ip = val.currentTarget.url.split('/')[2].split(':')[0];
      console.log(Ip);
      let ChannelName;
      //2console.log("------------");
      //console.log(this.ChannelItems);
      var _this = this;
      _this.ChannelItems.forEach(function(data,index){
        console.log(data.Ip);
        if(data.Ip === Ip){
          ChannelName = data.ChannelName;
          console.log("断开时oldFlag:" + data.oldFlag);
          let c = data.Flag
          // data.oldFlag = ;
          _this.$set(data,'oldFlag',c);
          console.log("断开时oldFlag:" + data.oldFlag);
          _this.$set(data,'Flag',5);
        }
        return;
      });
      _this.websock.forEach(function(data,index){
         if(data.ChannelName === ChannelName){
          //  console.log(index);
           _this.websock.splice(index,1);
           return;
         }
       })
       let ip = Ip + ":8766"
       setTimeout(function () {
          let t = _this.ConnectWebsocket(ip,ChannelName);
       }, 2000);
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100% ; 
  position: fixed;
}
#app {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
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
  height: 100vh;
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
