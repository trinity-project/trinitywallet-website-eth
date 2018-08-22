<template>
  <div class="indexBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="assetBox">
      <h1>{{ $store.state.vuexStore.balanceData.Chain.TNC }} TNC</h1>
      <el-collapse-transition>
        <div v-show="isShowMoreAsset">
          <table class="assetTable">
            <thead>
              <tr>
                <th>{{ $t('index.assetType') }}</th>
                <th>{{ $t('index.balanceOnChain') }}</th>
                <th>{{ $t('index.balanceOnChannel') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TNC</td>
                <td>{{ balanceData.Chain.TNC }}</td>
                <td>{{ balanceData.Channel.TNC }}</td>
              </tr>
              <tr>
                <td>ETH</td>
                <td>{{ balanceData.Chain.ETH }}</td>
                <td>{{ balanceData.Channel.ETH }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-collapse-transition>
      <el-button @click="showMoreAsset()" :class="{ showMoreAssetBtn_active :isShowMoreAsset}" class="showMoreAssetBtn" type="primary" icon="el-icon-arrow-down" circle></el-button>
    </div>
    <div class="contentBox">
        <h2>{{ $t('index.title') }}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;margin:8px 0;" />
        <el-form class="indexForm" ref="form">
          <label style="line-height: 28px;font-size: 16px;">{{ $t('index.paymentCode') }}</label>
            <el-select size="mini" v-model="contact" @change="contactChange" filterable clearable :placeholder="$t('index.transferByContact')" style="float: right;margin-bottom: 12px;">
              <el-option v-for="item in $store.state.vuexStore.contactList" :key="item.address" :label="item.name" :value="item.address">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;overflow: hidden;margin-left: 20px;width: 175px;text-overflow:ellipsis;white-space: nowrap;">{{ item.address }}</span>
              </el-option>
            </el-select>
          <el-form-item style="margin-top:10px">
            <el-input type="textarea" v-model.trim="paymentCode"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button class="transferBtn" type="primary" @click="decryptPaymentCode()">{{ $t('index.transfer') }}</el-button>
          </el-form-item>
        </el-form>
    </div>
    <el-dialog class="txOnChainBox" title="链上转账" :visible.sync="ShowTxOnChainBox" width="30%" center :modal-append-to-body='false'>
      <el-form :model="txOnChainInfo" status-icon :rules="txOnChainRules" ref="txOnChainInfo" label-width="70px" class="demo-ruleForm">
        <el-form-item label="地址" prop="address">
          <el-input v-model="txOnChainInfo.address" readonly="readonly" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产类型" prop="assetType">
          <el-select v-model="txOnChainInfo.assetType" placeholder="请选择资产类型" style="width:100%;">
            <el-option label="TNC" value="TNC"></el-option>
            <el-option label="ETH" value="ETH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model.number.trim="txOnChainInfo.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="keyStorePass">
          <el-input v-model="txOnChainInfo.keyStorePass" type="password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="txOnChain()">转 账</el-button>
        <el-button @click="ShowTxOnChainBox = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="txOnChannelBox" title="通道转账" :visible.sync="ShowTxOnChannelBox" width="30%" center :modal-append-to-body='false'>
      <span>向{{ txOnChannelInfo.receiverUri.split("@")[0] }}</span>
      <span style="color:#F56C6C">转账{{ txOnChannelInfo.value / 10e7 }} {{ txOnChannelInfo.assetType }}</span>
      <el-form :model="txOnChannelInfo" status-icon :rules="txOnChannelRules" ref="txOnChannelInfo" label-width="70px" class="demo-ruleForm">
        <el-form-item label="密码" prop="keyStorePass">
          <el-input v-model="txOnChannelInfo.keyStorePass" type="password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTx()">转 账</el-button>
        <el-button @click="ShowTxOnChannelBox = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'indexForm',
  data () {
    var checkTxOnChainAddress = (rule, value, callback) => {    //验证链上转账地址
      if (!value) {
        return callback(new Error('地址不能为空'));
      } else {
        if (value.length !== 42) {
            callback(new Error('请输入正确的地址'));
        } else {
            callback();
        }
      }
    };
    var checkTxOnChainAmount = (rule, value, callback) => {    //验证链上转账金额
        if (!value) {
          return callback(new Error('金额不能为空'));
        }
        if (isNaN(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('金额必须大于0'));
            } else {
              callback();
            }
        }
    };
    var checkTxOnChainAssets = (rule, value, callback) => {    //验证链上转账资产类型
      if (!value) {
        return callback(new Error('资产类型不能为空'));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        let PrivateKey = this.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore, value);
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
        isShowMoreAsset: false,     //是否显示更多资产
        paymentCode: '',        //PaymentCode
        txOnChainInfo: {        //链上转账信息
          "address": '',
          "assetType": '',
          "amount": '',
          "keyStorePass": ''
        },
        txOnChainRules: {       //链上转账规则
          address: [
            { validator: checkTxOnChainAddress, trigger: 'blur' }
          ],
          amount: [
            { validator: checkTxOnChainAmount, trigger: 'blur' }
          ],
          assetType: [
            { validator: checkTxOnChainAssets, trigger: 'change' }
          ],
          keyStorePass: [
            { validator: checkKeyStorePass, trigger: 'blur' }
          ]
        },
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
        ShowTxOnChainBox: false,    //是否显示链上转账窗口
        ShowTxOnChannelBox: false,      //是否显示通道转账窗口
        contact: ''     //当前选中联系人
    }
  },
  computed: {
    balanceData() {
        return this.$store.state.vuexStore.balanceData;
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
    showMoreAsset() {   //切换显示资产详情
      this.isShowMoreAsset = !this.isShowMoreAsset;
    },
    decryptPaymentCode() {    //解析Payment Code
      let _this = this;
      if (_this.paymentCode.length == "") {       //判断paymentCode是否为空
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '付款码/地址不能为空',
            duration: 3000
          });
          return;
      } else if (_this.paymentCode.length === 42) {       //判断paymentCode是否为地址
        if (_this.paymentCode === _this.$store.state.vuexStore.walletInfo.address){   //判断是否为本端地址
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '收付款地址不能相同',
            duration: 3000
          });
          return;
        } else {
          _this.txOnChainInfo.address = _this.paymentCode;
          _this.ShowTxOnChainBox = true;
          return;
        }
      } else {
        if(_this.paymentCode.substr(0,2) == "TN"){        //判断开头是否为"TN",如是进入交易码解析
          console.log("进入通道交易");
            let LinkData;
            try {
              LinkData = base58decode(_this.paymentCode.substring(2)).toString();
            } catch (e) {
              _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '付款码解析错误1',
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
            _this.txOnChannelInfo.value = LinkDataList[4] * 10e7;                 //支付金额
            _this.txOnChannelInfo.description = LinkDataList[5];                  //备注
            console.log(_this.txOnChannelInfo);
            if(_this.txOnChannelInfo.netMagic == _this.$store.state.vuexStore.NetMagic){          //判断NetMagic是否符合
              if (!web3.utils.isAddress(_this.txOnChannelInfo.receiverUri.split("@")[0])) {       //当地址解析错误时
                _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '付款码解析错误2',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.hr == "") {          //当hashR解析错误时
                _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '付款码解析错误3',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.assetType == "") {         //当资产类型解析错误时
                _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '付款码解析错误4',
                  duration: 3000
                });
                return;
              } else if (_this.txOnChannelInfo.value == 0) {        //当金额解析错误时
                _this.$notify.error({ 
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '付款码解析错误5',
                  duration: 3000
                });
                return;
              } else if (_this.$store.state.vuexStore.walletInfo.address === _this.txOnChannelInfo.receiverUri.split("@")[0]) {   //当转账和收款地址相同时
                _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '收付款地址不能相同',
                  duration: 3000
                });
                return;
              }
              _this.ShowTxOnChannelBox = true;      ///关闭通道交易窗口
            } else {                //如NetMagic错误,给出提示并返回
              _this.$notify.error({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '非本网络付款码,请确认',
                duration: 3000
              });
              return;
            }
          } else {                  //如果没有&隔离符,给出提醒 终止
            _this.$notify.error({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: '付款码解析错误，请确认',
              duration: 3000
            });
            return false;
          }
        } else {      //开头不是"TN",给出提示并返回
        this.$notify.error({
          title: '警告',
          dangerouslyUseHTMLString: true,
          message: '付款码错误，请确认',
          duration: 3000
        });
        return;
      }
      }
    },
    contactChange() {       //当选中联系人时将值赋给payment code
      this.paymentCode = this.contact;
    },
    txOnChain() {     //链上转账方法 总
      let _this = this;
      _this.$refs['txOnChainInfo'].validate((valid) => {
        if (valid) {
          if(_this.txOnChainInfo.assetType == "ETH"){
            _this.txEthOnChain();
          } else {
            _this.txTncOnChain();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    txEthOnChain() {    //链上ETH转账方法
      let _this = this;
      let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.txOnChainInfo.keyStorePass);
      web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
          console.log(nonce);

          web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
              console.log(gasPrice);

              var txData = {
                  // nonce每次++，以免覆盖之前pending中的交易
                  nonce: web3.utils.toHex(nonce++),
                  gasLimit: web3.utils.toHex(4500000),   
                  gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice),  
                  to: _this.txOnChainInfo.address,
                  from: _this.$store.state.vuexStore.walletInfo.address,
                  value: web3.utils.toHex(_this.txOnChainInfo.amount * 10e17),         
                  data: ''
              }
              console.log(txData);

              let signedData = signData(txData,decryptPK.privateKey);
              console.log(signedData);

              let date = new Date().getTime();        //获取当前时间戳
              web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {     //发送交易上链
                if (!err) {       //当不错误的时候
                  console.log(hash);
                  _this.$notify({
                      title: '成功',
                      dangerouslyUseHTMLString: true,
                      message: '上链成功，请交易确认',
                      duration: 3000,
                      type: 'success'
                  });
                  _this.ShowTxOnChainBox = false;

                  let recordMessage = {       //构造交易记录信息
                    date: date,
                    name: _this.txOnChainInfo.address,
                    Amount: _this.txOnChainInfo.amount * 10e7,
                    assetType: 'ETH',
                    isOnChannel: false,
                    isPay: true,
                    isSuccess: true,
                    isTestNet: _this.$store.state.vuexStore.isTestNet,
                    transactionHash : hash,
                    blockHash: ""
                  }
                  _this.$store.state.vuexStore.recordList.push(recordMessage);
                  _this.$parent.StoreRecordList(_this.$store.state.vuexStore.recordList);         //保存交易信息
                  _this.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
                  _this.clearTxData();                                      //清空交易数据
                } else {
                  console.log(err);
                }
              })
          })  
      })
    },
    txTncOnChain() {    //链上TNC转账方法
      let _this = this;
      let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.txOnChainInfo.keyStorePass);
      web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
        // 获取交易次数
          console.log(nonce);

          web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          console.log(gasPrice);

          var functionSig = web3.utils.sha3("transfer(address,uint256)").substr(2, 8);
          console.log(functionSig);

          var txData = {
              nonce: web3.utils.toHex(nonce++),
              gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
              gasLimit: web3.utils.toHex(4500000),
              to: _this.$store.state.vuexStore.tncContractAddress,
              from: _this.$store.state.vuexStore.walletInfo.address, 
              value: '0x00', 
              data: '0x' + functionSig + web3.utils.padLeft(_this.txOnChainInfo.address.slice(2), 64) + web3.utils.padLeft(web3.utils.toHex(_this.txOnChainInfo.amount * 10e7).substr(2), 64)
          };
          console.log(txData);

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
              _this.ShowTxOnChainBox = false;
              
              let recordMessage = {
                date: date,
                name: _this.txOnChainInfo.address,
                Amount: _this.txOnChainInfo.amount * 10e7,
                assetType: 'TNC',
                isOnChannel: false,
                isPay: true,
                state: 0,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : hash,
                blockHash: ""
              }
              console.log(_this.txOnChainInfo.address);
              console.log(recordMessage);
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              _this.$parent.StoreRecordList(_this.$store.state.vuexStore.recordList);         //保存交易记录
              _this.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
              _this.clearTxData();                                      //清空交易数据
            } else {
              console.log(err);
            }
          })
        })   
      })
    },
    confirmTx() {
      let _this = this;
      _this.$refs['txOnChannelInfo'].validate((valid) => {
        if (valid) {
          if(_this.txOnChannelInfo.assetType == "ETH"){
            _this.txEthOnChannel();
          } else if(_this.txOnChannelInfo.assetType == "TNC") {
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
    txTncOnChannel() {
      let _this = this;
      console.log("进入通道交易TNC");

      let l = _this.$parent.getChannelSerial("OtherUri",_this.txOnChannelInfo.receiverUri,'open');
      if(l >= 0){
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
              "PaymentCount": _this.txOnChannelInfo.value / 10e7,
              "SenderBalance": (_this.$store.state.vuexStore.channelList[l].SelfBalance - _this.txOnChannelInfo.value) / 10e7,
              "ReceiverBalance": (_this.$store.state.vuexStore.channelList[l].OtherBalance + _this.txOnChannelInfo.value) / 10e7,
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
      } else if (l == -1){        //未与该Uri直连,查询路由情况
          _this.$notify.info({
            title: '提醒',
            dangerouslyUseHTMLString: true,
            message: '未与该Uri建立通道,开始查询路由',
            duration: 3000
          });
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
              title: '提醒',
              dangerouslyUseHTMLString: true,
              message: '没有开通的通道,请先建立通道',
              duration: 3000
            });
            _this.clearTxData();                        //清空当前数据 
            return false;
          } else {      //遍历到开通的通道,进入Htlc交易
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
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '通道未打开',
            duration: 3000
          });
          _this.ShowTxOnChannelBox = false;
          _this.clearTxData();
          return;
      } else {
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '未知错误,l值为' + l,
            duration: 3000
          });
          return;
      }
    },
    clearTxData() {       //清空转账信息
      this.txOnChainInfo = {        //清空链上转账信息
        "address": '',
        "assetType": '',
        "amount": '',
        "keyStorePass": ''
      };
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
      this.contact = '';            //清空选中的联系人     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexBox{
  float: left;
  height: calc(100% - 106px);
  width: 100%;
  overflow: hidden;
}
.assetBox{
  /* height: 290px; */
  width: 100%;
  background-color: rgb(67, 74, 80);
  position: relative;
}
.assetBox h1{
  font-size: 32px;
  text-align: center;
  line-height: 240px;
  margin: 0;
  color: #FFFFFF;
}
.assetBox .showMoreAssetBtn{
  position: absolute;
  bottom: -20px;
  left: 50%;
  margin-left: -20px;
  z-index: 2;
  transition: 0.3s;
}
.assetBox .showMoreAssetBtn_active{
  transform: rotate(180deg);
}
.assetBox .assetTable{
  width: 100%;
  background-color:transparent;
  /* height: 192px; */
  color: #CCCCCC;
  padding-bottom: 20px;
}
.assetTable th {
  border-bottom: 1px solid #ebeef5;
  user-select: none;
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 14px;
}
.assetTable td {
  border-bottom: 1px solid #ebeef5;
  user-select: none;
  padding: 12px 0;
  min-width: 0;
  text-align: center;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 14px;
}
.assetTable tr:last-child td{
  border-bottom: 0px;
}
.contentBox{
  height: calc(100vh - 340px);
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  transition: 1s;
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
.fullPage{
    width: 100% !important;
}
.txOnChannelBox .el-dialog__body span{
  display: block;
  margin: 10px 0;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
