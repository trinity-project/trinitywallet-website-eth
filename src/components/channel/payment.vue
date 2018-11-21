<template>
  <div class="paymentBox">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('index.title') }}</h2>
        <hr/>
        <div class="buttonBox clearfloat">
          <router-link to="/channel/createPayment" class="button-item">
            <i class="el-icon-ETH-shoukuan"></i>
            <p>收款</p>
          </router-link>
          <a class="button-item">
            <i class="el-icon-ETH-saoyisao"></i>
            <p>扫一扫</p>
          </a>
        </div>
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
    <el-dialog class="txOnChannelBox" :title="$t('index.transferOnChannel')" :visible.sync="ShowTxOnChannelBox" width="calc(100% - 20px)" center :modal-append-to-body='false'>
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
import Vue from 'Vue'
import headBox from './../common/headBoxForChild'
export default {
  name: 'paymentBox',
  data () {
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('index.callback-7')));
      } else {
        let PrivateKey;
        if(this.baseChain == "ETH"){                  //当前为ETH钱包时
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
  components: {
    headBox
  },
  computed: {
    baseChain() {                       //获取vuex中的baseChain赋值给baseChain
        return this.$store.state.vuexStore.baseChain;
    },
    txList() {                       //获取vuex中的txList赋值给txList
        return this.$store.state.vuexStore.txList;
    },
    walletInfo() {                       //获取vuex中的address赋值给address
      if(this.baseChain == "ETH"){
          return this.$store.state.vuexStore.walletInfo;
      } else if(this.baseChain == "NEO"){
          return this.$store.state.vuexStore.NEOwalletInfo;
      }
    },
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
      } else {
        if(_this.paymentCode.startsWith('TN')){                         //判断开头是否为"TN",如是进入交易码解析
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

            if(_this.baseChain == "ETH"){
              _this.txOnChannelInfo.receiverUri = LinkDataList[0];                  //uri
              _this.txOnChannelInfo.netMagic = LinkDataList[1];                           //NetMagic
              _this.txOnChannelInfo.hr = LinkDataList[2];                                 //hashR
              _this.txOnChannelInfo.assetType = LinkDataList[3];        //资产类型
              _this.txOnChannelInfo.value = LinkDataList[4];                 //支付金额
              _this.txOnChannelInfo.description = LinkDataList[5];                  //备注
              console.log(_this.txOnChannelInfo);
              if(_this.txOnChannelInfo.netMagic == _this.$store.state.vuexStore.NetMagic){       //判断NetMagic是否符合
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
                _this.ShowTxOnChannelBox = true;      ///显示通道交易窗口
              } else {                //如NetMagic错误,给出提示并返回
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-12'),
                  duration: 3000
                });
                return;
              }
            } else if (_this.baseChain == "NEO"){                                    //NEO和ETH付款码格式不统一,后期改进
              _this.txOnChannelInfo.receiverUri = LinkDataList[0];                                           //uri
              _this.txOnChannelInfo.hr = LinkDataList[1];                                                    //hashR
              _this.txOnChannelInfo.assetType = _this.$parent.$parent.AssetIdToAssetType(LinkDataList[2]);   //资产类型
              _this.txOnChannelInfo.value = Number(LinkDataList[3]).mul(10e7);                               //支付金额
              _this.txOnChannelInfo.description = LinkDataList[4];                                           //备注
              console.log(_this.txOnChannelInfo);
              if (_this.txOnChannelInfo.receiverUri.split("@")[0].length !== 66) {       //当地址解析错误时
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
              } else if (_this.$store.state.vuexStore.NEOwalletInfo.publicKey == _this.txOnChannelInfo.receiverUri.split("@")[0]) {   //当转账和收款地址相同时
                _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('index.callback-10'),
                  duration: 3000
                });
                return;
              }
              _this.ShowTxOnChannelBox = true;      ///关闭通道交易窗口
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
          if (_this.paymentCode.length == 42 && _this.baseChain == "ETH" || 
              _this.paymentCode.length == 34 && _this.baseChain == "NEO") {        //判断paymentCode是否为地址
            if (_this.paymentCode == _this.$store.state.vuexStore.walletInfo.address){   //判断是否为本端地址
              _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('index.callback-10'),
                duration: 3000
              });
              return;
            } else {
              console.log("进入链上转账");
              _this.$router.push({ name: 'transferOnChain', params: { address: _this.paymentCode }});
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
          if(_this.baseChain == "ETH"){                  //当前为ETH钱包时
            if(_this.txOnChannelInfo.assetType == "ETH"){
              _this.txEthOnChannel();
            } else if (_this.txOnChannelInfo.assetType == "TNC") {
              _this.txTncOnChannel();
            }
          } else if (_this.baseChain == "NEO"){                  //当前为NEO钱包时
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

      if(_this.baseChain == "ETH"){                  //当前为ETH钱包时
        let peerUri = _this.txOnChannelInfo.receiverUri;
        console.log(peerUri);
        let l = _this.$parent.$parent.getChannelSerial("OtherUri", peerUri, 'open', false);
        console.log(l);
        if(l >= 0){
          let channelName = _this.$store.state.vuexStore.channelList[l].ChannelName;
          let founderUri = _this.$store.state.vuexStore.channelList[l].SelfUri;
          let founderBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance);
          let peerBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
          let paymentCount = Number(_this.txOnChannelInfo.value);
          let hashR = _this.txOnChannelInfo.hr;
          let assetType = _this.txOnChannelInfo.assetType;
          let TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce + 1;
          let NetMagic = _this.$store.state.vuexStore.NetMagic;

          let checkResult = _this.$parent.$parent.checkHistory(channelName, TxNonce);
          let ResignBody;
          if(checkResult.type == "Resign"){
            console.log("上次交易未确认,请求回签");
            ResignBody = checkResult.ResignBody;
            console.log(checkResult);

            let typeList = ['paymentCount'];
            let result = _this.$parent.$parent.getTxListInfo(channelName, ResignBody.Nonce, typeList);              //查询当前nonce的状态
            founderBalance = founderBalance + result.paymentCount;
            peerBalance = peerBalance - result.paymentCount;
          } else if (checkResult.type == "Same"){
            console.log("检查正常");
          }

          if(founderBalance >= paymentCount){                                     //判断余额大于交易金额
            let Message = {                                                       //构造Rsmc消息体
              "MessageType":"Rsmc",
              "Sender": founderUri,
              "Receiver": peerUri,
              "TxNonce": TxNonce,
              "ChannelName": channelName,
              "NetMagic": NetMagic,
              "AssetType": assetType,
              "MessageBody": {
                PaymentCount: paymentCount,
                SenderBalance: founderBalance - paymentCount,
                ReceiverBalance: peerBalance + paymentCount,
                // "HashR": 0x0,
                Commitment: "",
                RoleIndex: 0,
                ResignBody: ResignBody
              },
              "Comments": hashR
            }
            _this.txOnChannelInfo.sendUri = peerUri;                              //赋值sendUri
            _this.txOnChannelInfo.ChannelName = channelName;                      //赋值ChannelName
            _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo; //保存通道转账信息
            console.log(_this.$store.state.vuexStore.txOnChannelInfo);
            
            _this.$parent.$parent.sendWebsocket(peerUri, Message);                //发送websocket消息

            let txListMessage = {                           //txData
              "state": "INIT",
              "nonce": TxNonce,
              "founder": founderUri.split("@")[0],
              "founderBalance": founderBalance - paymentCount,
              "peer": peerUri.split("@")[0],
              "peerBalance": peerBalance + paymentCount,
              "paymentCount": paymentCount,
              "isFounder": true,
              "founderSignedData": "",
              "peerSignedData": "",
              "HashR": "0x" + addPreZero(0,64),
              "R": "0x" + addPreZero(0,64),
              // "delayBlock":,
              // "payment": ,
              // "delayCommitment": ,
            }
            _this.$parent.$parent.newTxList(channelName, txListMessage);           //增加TxList信息
            console.log(_this.$store.state.vuexStore.txList);
            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            channelInfo.TxNonce = TxNonce;                                      //TxNoce增加1
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
            console.log(_this.$store.state.vuexStore.channelList[l].TxNonce);
            _this.$parent.$parent.StoreData("channelList");           //保存通道信息

            _this.ShowTxOnChannelBox = false;
            _this.clearTxData();                                                  //清除交易数据
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
              message: "没有开通的通道",
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
            _this.$parent.$parent.sendWebsocket(_this.txOnChannelInfo.sendUri, Message);        //发送websocket消息
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
      } else if (_this.baseChain == "NEO"){                  //当前为NEO钱包时
        console.log("NEO通道交易");
        let l = _this.$parent.$parent.getChannelSerial("OtherUri", _this.txOnChannelInfo.receiverUri, 'open', false);
        if(l >= 0){
          console.log(_this.txOnChannelInfo.value);
          if(_this.$store.state.vuexStore.channelList[l].SelfBalance >= _this.txOnChannelInfo.value){
            _this.txOnChannelInfo.sendUri = _this.$store.state.vuexStore.channelList[l].SelfUri;      //赋值sendUri
            _this.txOnChannelInfo.ChannelName = _this.$store.state.vuexStore.channelList[l].ChannelName;    //赋值ChannelName
            console.log(l);

            let addressFunding, scriptFunding, txId;
            _this.txList.forEach(function(value, index){
              if(value.channelName == _this.txOnChannelInfo.ChannelName){
                  addressFunding = value.history[1].addressFunding;
                  scriptFunding = value.history[1].scriptFunding;
                  txId = value.history[1].txId;
              }
            })
            console.log(addressFunding);
            console.log(scriptFunding);
            console.log(txId);
            let selfBalance = (Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - Number(_this.txOnChannelInfo.value)).div(10e7);
            let otherBalance = (Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.txOnChannelInfo.value)).div(10e7);
            axios({
              method: 'post',
              url: _this.$store.state.vuexStore.NodeRpcUri,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "FunderTransaction",        //实际为RSMCTransaction，与FunderTransaction共用一个接口方法
                "params": [_this.txOnChannelInfo.receiverUri.split('@')[0], _this.walletInfo.publicKey, addressFunding, scriptFunding, selfBalance, otherBalance, txId, _this.txOnChannelInfo.assetType],
                "id": 1
              })
            }).then(function(res){
              console.log(res);
              if(res.data.error){
                _this.$notify.error({
                  title: "构造交易出错",
                  dangerouslyUseHTMLString: true,
                  message:  _this.$t('index.callback-14'),
                  duration: 3000
                });
                _this.ShowTxOnChannelBox = false;
                _this.clearTxData();
              }
              let Message = {
                "MessageType":"Rsmc",
                "Sender": _this.txOnChannelInfo.sendUri,
                "Receiver": _this.txOnChannelInfo.receiverUri,
                "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
                "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
                "MessageBody": {
                    "Commitment": res.data.result.C_TX,
                    "RevocableDelivery": res.data.result.R_TX,
                    "AssetType": _this.txOnChannelInfo.assetType,
                    "Value": Number(_this.txOnChannelInfo.value).div(10e7),
                    "RoleIndex": 0,
                    "Comments": _this.txOnChannelInfo.hr
                }
              }
              console.log(JSON.stringify(Message));

              _this.txOnChannelInfo.BreachRemedy = res.data.result.BR_TX;

              // let ReceiverAddr = _this.PlckToAdrs(_this.TxOnChannelInfo.ReceiverUrl.split("@")[0]);
              // let Message1 = {
              //   "Address":Name,
              //   "Amount":_this.TxOnChannelInfo.Value/10000,
              //   "AssetType":_this.TxOnChannelInfo.AssetType,
              //   "Fee":0,
              //   "Flag":false,
              //   "isTestNet":_this.isTestNet,
              //   "Date":new Date().getTime()
              // }
              // _this.RecordList.push(Message1);
              // _this.StoreRecordList(_this.RecordList);
              // _this.PaymentLink = "";
              _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo;           //保存通道转账信息
              console.log(_this.$store.state.vuexStore.txOnChannelInfo);
              _this.$parent.$parent.sendWebsocket(_this.txOnChannelInfo.receiverUri, Message);        //发送websocket消息
              _this.ShowTxOnChannelBox = false;
              _this.clearTxData();
            });
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
          console.log("H交易");

          let i = -1;                           //声明通道序号
          _this.$store.state.vuexStore.channelList.forEach(function(data,index){            //遍历通道列表,获取开通的通道
            if(data.State == 3 && data.isConnect == true){
              i = index;
              return;
            }
          })

          let UriList = [];                     //声明当前open状态的通道uri
          _this.$store.state.vuexStore.channelList.forEach(function(data,index){            //遍历通道列表,获取通道uriList,用于获取路由信息
            if(data.State == 3 && data.isConnect == true){
              UriList.push(data.OtherUri);
            }
          })
          console.log(UriList);

          if(i < 0){                            //当l小于0时,未遍历到通道,给出提醒,停止交易
            _this.$notify.error({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000
            });
            _this.ShowTxOnChannelBox = false;           //关闭当前窗口
            _this.clearTxData();                        //清空当前数据 
            return false;
          } else {                              //遍历到开通的通道,进入Htlc交易
            console.log(i);
            _this.txOnChannelInfo.sendUri = _this.$store.state.vuexStore.channelList[i].SelfUri;            //赋值sendUri
            _this.txOnChannelInfo.ChannelName = _this.$store.state.vuexStore.channelList[i].ChannelName;    //赋值ChannelName
            let Message = {         //构造消息,查询通道路由
                "MessageType":"GetRouterInfo",
                "Sender": _this.txOnChannelInfo.sendUri,
                "Receiver": _this.txOnChannelInfo.receiverUri,
                "Magic": _this.$store.state.vuexStore.NetMagic,
                "MessageBody":{
                    "NodeList": UriList,
                    "AssetType": _this.txOnChannelInfo.assetType,
                }
            }
            _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo;           //保存通道转账信息
            console.log(_this.$store.state.vuexStore.txOnChannelInfo);
            _this.$store.state.vuexStore.channelList[i].websock.send(JSON.stringify(Message));        //发送websocket消息
            _this.ShowTxOnChannelBox = false;           //关闭当前窗口
            _this.clearTxData();                        //清空当前数据  
          }
        } else {
          console.log("l错误");
        }
      }
    },
    clearTxData() {                 //清空转账信息
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
.buttonBox{
  text-align: center; 
  padding: 12px 0 20px;
}
.button-item{
  width: 50%;
  float: left;
  color: #000000;
}
.el-icon-ETH-shoukuan{
    background: #FF7600;
}
.el-icon-ETH-saoyisao{
    background: #00B481;
}
p{
  font-size: 13px;
  margin-bottom: 0;
}
.contentBox{
  height: calc(100vh - 112px);
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  transition: 1s;
}
.assetIcon img{
  height: 28px;
  margin: 36px 0;
}
.indexForm{
  padding: 12px 0;
}
.transferBtn{
  width: 80%;
  /* max-width: 300px; */
}
.txOnChannelBox .el-dialog__body span{
  display: block;
  margin: 10px 0;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
