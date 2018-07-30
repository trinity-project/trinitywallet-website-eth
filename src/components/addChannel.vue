<template>
  <div class="addChannelBox">
    <div class="contentBox">
        <div>
          <p v-if="addChannelForm.assetType" style="float:right;margin: 5px 0;">资产余额：{{ $store.state.vuexStore.balanceData.Chain[addChannelForm.assetType] }}{{ addChannelForm.assetType }}</p>
          <h2>添加通道</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="addChannelForm" status-icon :rules="addChannelRules" ref="addChannelForm" label-width="100px" class="addChannelForm">
          <el-form-item label="对端URI" prop="uri">
            <el-input v-model="addChannelForm.uri" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetType">
            <el-select v-model="addChannelForm.assetType" placeholder="请选择资产类型" style="width:100%;">
              <el-option label="TNC" value="TNC"></el-option>
              <el-option label="ETH" value="ETH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="押金" prop="selfdeposit">
            <el-input v-model.number="addChannelForm.selfdeposit"></el-input>
          </el-form-item>
          <el-form-item label="对端押金" prop="otherDeposit">
            <el-slider v-model="addChannelForm.otherDeposit" :show-input-controls="false" :format-tooltip="formatTooltip" show-input ></el-slider>
          </el-form-item>
          <el-form-item label="通道名称" prop="alice">
            <el-input v-model="addChannelForm.alice"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="keyStorePass">
            <el-input v-model="addChannelForm.keyStorePass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addChannel()">添加通道</el-button>
            <el-button @click="removeAddChannelData()">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addChannelForm',
  data () {
    var checkUri = (rule, value, callback) => {  
      let _this = this;
      if (!value) {
        return callback(new Error('对端URI不能为空'));
      } else {
          if (value.indexOf('@') < -1) {
            callback(new Error('URI格式不正确'));
          } else if(value.split('@')[0].length !== 42){
            callback(new Error('URI格式不正确'));
          } else {
              _this.$store.state.vuexStore.channelList.forEach(function(val,index){    //判断是否已有通道
                if(val.otherUri === _this.addChannelForm.uri){
                  callback(new Error('你已经和这个TNAP有一个通道了'));
                }
              });
            callback();
          }
        }
    };
    var checkAssetType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择资产类型'));
      } else {
        callback();
      }
    };
    var checkDeposit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('押金数量不能为空'));
      } else {
        if (value <= 0) {
          callback(new Error('押金数量必须大于0'));
        } else {
          if(value > this.$store.state.vuexStore.balanceData.Chain[this.addChannelForm.assetType]){
            callback(new Error('押金数量不能大于钱包余额'));
          } else{
            callback();
          }
        }
      }
    };
    var checkAlice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('通道名称不能为空'));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        callback();
      }
    };
    return {
      addChannelForm: {
        uri: '',
        assetType: '',
        selfdeposit: '',
        otherDeposit:0,
        alice: '',
        keyStorePass: ''
      },
      addChannelRules: {
        uri: [
          { validator: checkUri, trigger: 'blur' }
        ],
        assetType: [
          { validator: checkAssetType, trigger: 'change' }
        ],
        selfdeposit: [
          { validator: checkDeposit, trigger: 'blur' }
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
    formatTooltip(val) {      //用于自定义滑块显示内容
        let multiple;
        if(this.addChannelForm.deposit === ''){
          multiple = 1;
        } else {
          multiple = this.addChannelForm.deposit;
        }
        return parseInt(val * multiple)/100;
    },
    addChannel() {
      let _this = this;
      _this.$refs['addChannelForm'].validate((valid) => {
        if (valid) {
          let Ip = uri2Ip(_this.addChannelForm.uri,8766);
          const wsuri = "ws://" + Ip + "/";               //建立websocket连接
          var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
          var channelInfo = { 
            "channelName": "4dd7696759de3efe32be1285f3b5ea9a",
            "websock":new WebSocket(wsuri)
          }
          _this.$store.state.vuexStore.channelList.push(channelInfo);
          _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.websocketOnmessage;
          _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.websocketClose;

          let SelfUri = _this.$store.state.vuexStore.walletInfo.address + Ip;
          let date = new Date().getTime();
          let ChannelName = md5encode(date + _this.addChannelForm.uri);
          var Message = {
            "MessageType": "RegisterChannel",
            "Sender": SelfUri,
            "Receiver": _this.addChannelForm.uri,
            "ChannelName": ChannelName,
            "Magic": _this.$store.state.vuexStore.Magic,
            "MessageBody": {
                "AssetType" : _this.addChannelForm.assetType,
                "Deposit": parseInt(deposit * 10e8) / 10e8,
            }
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送消息

          _this.$store.state.vuexStore.channelList[l].ChannelName = ChannelName;
          _this.$store.state.vuexStore.channelList[l].Alice = alice;
          _this.$store.state.vuexStore.channelList[l].State = 2;
          _this.$store.state.vuexStore.channelList[l].isConnect = true;
          _this.$store.state.vuexStore.channelList[l].SelfBalance = Message.MessageBody.Deposit;      //本端余额
          _this.$store.state.vuexStore.channelList[l].OtherBalance = Message.MessageBody.Deposit;     //对端余额
          _this.$store.state.vuexStore.channelList[l].BalanceInfo = {};
          _this.$store.state.vuexStore.channelList[l].BalanceInfo[SendUrl] = {};
          _this.$store.state.vuexStore.channelList[l].BalanceInfo[_this.addChannelForm.uri] = {};
          _this.$store.state.vuexStore.channelList[l].BalanceInfo[SendUrl][assets] = Message.MessageBody.Deposit;
          _this.$store.state.vuexStore.channelList[l].BalanceInfo[_this.addChannelForm.uri][assets] = Message.MessageBody.Deposit;
          _this.$store.state.vuexStore.channelList[l].isTestNet = true;
          _this.$store.state.vuexStore.channelList[l].SelfUri = SendUri;
          _this.$store.state.vuexStore.channelList[l].OtherUri = _this.addChannelForm.uri;
          _this.$store.state.vuexStore.channelList[l].date = date;
          _this.$store.state.vuexStore.channelList[l].Ip = uri2Ip(_this.addChannelForm.uri,null);

          _this.StoreChannel();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    websocketOnmessage(e){ 		//数据接收
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
       var _this = this;
       let i;
       _this.websock.forEach(function(val,index){   //遍历
         if(val.ChannelName === redata.ChannelName){
              i = index;
              return false;
          }
       })
       let MessageBody = redata.MessageBody;
       let witness1 = MessageBody.Founder.originalData.witness.split("{signOther}")[1];
       let witness = MessageBody.Founder.originalData.txData + MessageBody.Founder.originalData.witness.split("{signOther}")[0] +  MessageBody.Founder.txDataSign + witness1.split("{signSelf}")[0] +  this.FoundertxDataSign + witness1.split("{signSelf}")[1];
       let ip = _this.UriToIp(redata.Sender,20556);
      //  console.log(redata.Comments);
       if(redata.Comments !== "retry"){
         axios({
           method: 'post',
           url: this.SendrawUrl,
           headers: {
             'Content-Type': 'application/json;charset=UTF-8'
           },
           data: JSON.stringify({
             "jsonrpc": "2.0",
             "method": "sendrawtransaction",
             "params": [witness],
             "id": 1
           })
         }).then(function(res){
           if(res.data.result == true){
             swal({
                title: "Success!",
                text: "Channel has been created, please wait for it to open.",
                type: "success",
                showCancelButton: false
             });
             _this.ChannelItems.forEach(function(val,index){   //遍历
              if(val.ChannelName === redata.ChannelName){
                   _this.$set(val,'Flag',3);
               }
            })
          } else {
            let Message = {
                "MessageType": "FounderFail",
                "Sender": redata.Receiver,
                "Receiver": redata.Sender,
                "ChannelName": redata.ChannelName,
                "TxNonce": 0,
                "MessageBody": redata.MessageBody,
                "Error": "SendFounderRawTransactionFail",
                "Comments":"retry"
             }
            _this.$store.state.vuexStore.channelList.websock[i].data.send(JSON.stringify(Message));
          }
         });
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
      //  console.log("收到type为" + type + "的消息");
       var _this = this;
       let witness1 = _this.SettleInfo.witness.split("{signSelf}")[1];
       let witness = _this.SettleInfo.txData + _this.SettleInfo.witness.split("{signSelf}")[0] +  _this.SettleInfo.signSelf + witness1.split("{signOther}")[0] +  redata.MessageBody.Settlement.txDataSign + witness1.split("{signOther}")[1];
       axios({
         method: 'post',
         url: this.SendrawUrl,
         headers: {
           'Content-Type': 'application/json;charset=UTF-8'
         },
         data: JSON.stringify({
           "jsonrpc": "2.0",
           "method": "sendrawtransaction",
           "params": [witness],
           "id": 1
         })
       }).then(function(res){
        //  console.log(res);
         if(res.data.result === true){
            // console.log( _this.ChannelItems);
            _this.ChannelItems.forEach(function(val,index){
            //  console.log(val.ChannelName);
            //  console.log(redata.ChannelName);
             if(val.ChannelName === redata.ChannelName){
                  // console.log(redata.ChannelName);
                  _this.$set(val,'Flag',1);
              }
           })
           swal({
              title: "Success!",
              text: "Channel is closed, please wait for settlement",
              type: "success",
              showCancelButton: false
           });
         } else {
           swal({
              title: "Error",
              text: "Failed to close channel, please try again later",
              type: "error",
              showCancelButton: false
           });
         }
       })
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
    WebsocketClose(val){  		//websocket关闭
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
    },
    uri2Ip(uri,port) {      //URI转化Ip
      let ip = val.split("@")[1];
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
    removeAddChannelData() {      //清除AddChannelData
      this.$refs['addChannelForm'].resetFields();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addChannelBox{
    float: left;
    height: calc(100vh - 106px);
    width: calc(100% - 300px);
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100vh - 106px);
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
}
</style>
