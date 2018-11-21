<template>
  <div id="app" class="appBox">
      <div style="position: relative;margin: 0 auto;width: 100%;max-width: 1400px;height: 100%;">
      <!-- <div @touchstart.capture="touchStart" @touchend.capture="touchEnd"> -->
          <transition-group :name="transitionName" mode="in-out"> 
            <router-view key="router-box"/>
          </transition-group> 
          <footer-box/>
      </div>
      <channel/>
      <config/>
      <notify/>
      <dialogBox/>
        <el-dialog :title="$t('common.attention')" :visible.sync="isFeeInfoBoxShow" width="calc(100% - 20px)" center>
          <span>{{ $t('common.fee-1') }}<b style="color:#F56C6C">{{ $store.state.vuexStore.txOnChannelInfo.fee / 10e7 }}{{ $store.state.vuexStore.txOnChannelInfo.assetType }}</b>{{ $t('common.fee-2') }}</span><br>
          <el-tooltip class="item" effect="dark" :content="$t('common.whyFeeTips')" placement="top">
            <span style="margin-top:20px;display: inline-block;text-decoration: underline;">{{ $t('common.whyFee') }}</span>
          </el-tooltip>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendHtlcMes()">{{ $t('common.continue') }}</el-button>
            <el-button @click="isFeeInfoBoxShow = false">{{ $t('common.cancel') }}</el-button>
          </span>
        </el-dialog>
        <!-- <el-dialog class="receiptRsmcInfoBox" :title="$t('common.receive')" :visible.sync="isReceiptRsmcInfoBox" width="30%" center :modal-append-to-body='false'>                   回复Rsmc消息框
          <span>{{ activeInfo.redata.Sender }}</span><br/>
          <span style="color:#F56C6C;font-size: 16px;">{{ $t('common.send-1') }} {{ activeInfo.redata.PaymentCount / 10e7 }} {{ activeInfo.redata.AssetType }}{{ $t('common.send-2') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="RsmcSign()" type="primary">{{ $t('common.continue') }}</el-button>
                <el-button @click="isReceiptRsmcInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="receiptHtlcInfoBox" :title="$t('common.receive')" :visible.sync="isReceiptHtlcInfoBox" width="30%" center :modal-append-to-body='false'>                       回复Htlc消息框
          <span>{{ activeInfo.redata.Sender }}</span><br/>
          <span style="color:#F56C6C;font-size: 16px;">{{ $t('common.send-1') }}  {{ activeInfo.redata.PaymentCount / 10e7 }} {{ activeInfo.redata.AssetType }}{{ $t('common.send-2') }} </span>
          <br><br>
          <b style="color:#F56C6C;font-size: 13px;">{{ $t('common.twoPassword') }} </b>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="HtlcSign()" type="primary">{{ $t('common.continue') }}</el-button>
                <el-button @click="isReceiptHtlcInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="settleInfoBox" :title="$t('common.closeChannel')" :visible.sync="isSettleInfoBox" width="30%" center :modal-append-to-body='false'>                        回复Settle消息框 
          <span>{{ activeInfo.redata.Sender }}{{ $t('common.closeChannel-1') }} </span>
          <span style="color:#F56C6C;font-size: 16px;">{{ $t('common.selfBalance') }} : {{ activeInfo.redata.ReceiverBalance / 10e7 }} {{ activeInfo.redata.AssetType }}</span>
          <span style="color:#F56C6C;font-size: 16px;">{{ $t('common.otherBalance') }} : {{ activeInfo.redata.SenderBalance / 10e7 }} {{ activeInfo.redata.AssetType }}</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="SettleSign()" type="danger">{{ $t('common.continue') }}</el-button>
                <el-button @click="isSettleInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="settleInfoBox" :title="$t('common.forceCloseChannel')" :visible.sync="isSettleTransactionInfoBox" width="30%" center :modal-append-to-body='false'>                        Settle块高到达消息框 
          <span>强制关闭通道已到达指定块高</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="sendSettleTransaction()" type="danger">{{ $t('common.continue') }}</el-button>
                <el-button @click="isSettleTransactionInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="settleInfoBox" title="发送制裁交易" :visible.sync="isUpdateTransactionInfoBox" width="30%" center :modal-append-to-body='false'>                                  制裁交易消息框 
          <span>对端强制关闭通道数据不正确,发送制裁交易</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="sendUpdateTransaction()" type="danger">{{ $t('common.continue') }}</el-button>
                <el-button @click="isUpdateTransactionInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="SendUnlockAmountInfoBox" title="申请解冻资产" :visible.sync="isSendUnlockAmountInfoBox" width="30%" center :modal-append-to-body='false'>                                  申请解冻资产消息框 
          <span>HTLC到达指定块高仍未收到R,正在申请解冻资产</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="SendUnlockAmount()" type="primary">{{ $t('common.continue') }}</el-button>
                <el-button @click="isSendUnlockAmountInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="unlockAmountInfoBox" title="解冻资产" :visible.sync="isUnlockAmountInfoBox" width="30%" center :modal-append-to-body='false'>                                  申请解冻资产消息框 
          <span>您现在可以解冻锁定的资产</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="UnlockAmount()" type="primary">{{ $t('common.continue') }}</el-button>
                <el-button @click="isUnlockAmountInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog> -->
        <el-dialog title="退出" :visible.sync="isSignOutBoxShow" width="calc(100% - 20px)" center>
          <span>{{ $t('common.signOut') }} </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="SignOut()">{{ $t('common.continue') }}</el-button>
            <el-button @click="isSignOutBoxShow = false">{{ $t('common.cancel') }}</el-button>
          </span>
        </el-dialog>
    <!-- </div> -->
  </div>
</template>

<script>
import Vue from 'Vue'
import channel from './components/tabbar/channel'
import footerBox from './components/common/footer'
import config from './components/common/config'
import notify from './components/common/notify'
import dialogBox from './components/common/dialog'

export default {
  name: 'App',
  data () {
    // var validatePass = (rule, value, callback) => {         //Receipt 密码输入规则
    //   if (!value) {
    //     return callback(new Error(this.$t('common.callback-1')));
    //   } else {
    //     let PrivateKey;
    //     if(this.baseChain == "ETH"){                  //当前为ETH钱包时
    //       PrivateKey = this.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
    //     } else if (this.baseChain == "NEO"){                  //当前为ETH钱包时
    //       PrivateKey = scrypt_module_factory(DecryptWalletByPassword, {}, {
    //           'WalletScript': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
    //           'password': value,
    //           'address': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
    //       });
    //     }
    //     setTimeout(() => {
    //         if(PrivateKey){
    //           callback();
    //         } else {
    //           return callback(new Error(this.$t('index.callback-8')));
    //         }
    //     }, 1000);
    //   }
    // };
    return {
        startX : 0 ,
        endX : 0 ,
        isFeeInfoBoxShow: false,         //是否显示Fee提醒框
        // isReceiptRsmcInfoBox: false,     //是否显示接收Rsmc消息框
        //isReceiptHtlcInfoBox: false,     //是否显示接收Htlc消息框
        //isSettleInfoBox: false,          //是否显示Settle消息框
        //isSettleTransactionInfoBox: false,          //是否显示SettleTransaction消息框
        //isUpdateTransactionInfoBox: false,          //是否显示制裁消息框
        //isSendUnlockAmountInfoBox:false,            //是否显示申请取回冻结资产消息框
        //isUnlockAmountInfoBox:false,                //是否申请取回冻结资产消息框
        isSignOutBoxShow: false,         //是否显示退出消息框
        // activeInfo: {                     //当前显示的消息框
        //   "redata": {}, 
        //   "txData": '',
        //   "keyStorePass": ''
        // },
        // SettleTransaction: {
        //   "blockNumber": '',
        //   "keyStorePass": ''
        // },
        // confirmReceiptRules: {        //Receipt 输入规则
        //   keyStorePass: [
        //     { validator: validatePass, trigger: 'blur' }
        //   ]
        // },
        transitionName: ''    //当前动画名称
    }
  },
  components: {
    footerBox,
    channel,
    config,
    notify,
    dialogBox
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时连接至全节点
        this.browserRedirect();
    })
  },
  created() {           //加载完成去除加载动画  
    document.body.removeChild(document.getElementById('Loading'))
  },
  computed: {
    baseChain(){                                    //底层链
      return this.$store.state.vuexStore.baseChain;
    },
    trinityContractAddress() {                      //Trinity状态通道逻辑合约合约地址
      return this.$store.state.vuexStore.trinityContractAddress;
    },
    trinityDataContractAddress() {                  //Trinity状态通道数据合约合约地址
      return this.$store.state.vuexStore.trinityDataContractAddress;
    },
    tncContractAddress() {                          //TNC ERC-20代币合约地址
      return this.$store.state.vuexStore.tncContractAddress
    },
    isTestNet(){                                    //是否为测试网
      return this.$store.state.vuexStore.isTestNet;
    },
    isOneStepPayment() {                            //获取vuex中的isOneStepPayment赋值给isOneStepPayment
      return this.$store.state.vuexStore.isOneStepPayment;
    },
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.transitionName = 'slide-left';
      } else if(to.meta.index < from.meta.index){
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = '';
      }
    }
  },
  methods: {
    connectWebSocketForNodeUri() {          //连接至全节点
      let _this = this;
      if(_this.baseChain == "ETH"){                   //当前为ETH钱包时
        let wsuri = _this.$store.state.vuexStore.NodeUriWebSocketIp;               //建立websocket连接
        _this.$store.state.vuexStore.NodeUriWebSocket = new WebSocket(wsuri);
        _this.$store.state.vuexStore.NodeUriWebSocket.onmessage = _this.nodeUriWebsocketOnMessage;
        _this.$store.state.vuexStore.NodeUriWebSocket.onclose = _this.nodeUriWebsocketClose;
        // if(_this.$store.state.vuexStore.isLogin == true){
        //   let Message = {
        //       "messageType":"init", 
        //       "walletAddress":_this.$store.state.vuexStore.walletInfo.address
        //   }
        //   setTimeout(function(){
        //     _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
        //   },1000);
        // }
      } else if(_this.baseChain == "NEO"){                  //当前为NEO钱包时,测试RPC服务
        axios({
          method: 'post',
          url: _this.$store.state.vuexStore.NodeRpcUri,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "getBalance",
            "params": ["AW25dxZZRJYjgXApEacYAEQDNPGDuFGCWF"],
            "id": 1
          })
        }).then(function(res){
          if(_this.loseWebSocketForNodeUriNotify){
            _this.loseWebSocketForNodeUriNotify.close();                //关闭连接至全节点notify
            _this.loseWebSocketForNodeUriNotify = undefined;
          }
          console.log("连接全节点成功");
          // _this.$notify({
          //     title: _this.$t('common.success'),
          //     dangerouslyUseHTMLString: true,
          //     message: _this.$t('common.callback-6'),
          //     duration: 3000,
          //     type: 'success'
          // });
        })
      }
    },
    backToStart() {           //通用的返回开始界面方法
      this.$router.push('/start');
    },
    closeNav() {              //在移动模式Nav显示时,点击关闭
      if(window.screen.width < 1024 && this.$store.state.vuexStore.isNavShow){
        this.$store.state.vuexStore.isNavShow = false;
      }
    },
    touchStart(e) {            //监听滑动开始事件
      this.startX = e.touches[0].clientX;
      console.log("开始X:" + this.startX);
    },
    touchEnd(e) {              //监听滑动结束事件
      // 记录结束位置
      if(window.screen.width < 1024){
        this.endX = e.changedTouches[0].clientX;
        console.log("结束X:" + this.endX);

        if(this.startX > 300 && this.startX - this.endX > 0 && this.$store.state.vuexStore.isNavShow){                 //左滑
          this.$store.state.vuexStore.isNavShow = false;
        }
        if(this.startX < 50 && this.startX - this.endX < -50 && !this.$store.state.vuexStore.isNavShow){               // 右滑
          this.$store.state.vuexStore.isNavShow = true;
        }
        this.startX = 0;
        this.endX = 0;
      }
    },
    fetchAsArray:function(key){     //获取localStorage的数组，boolean等数据
      let KEY1 = key.toString();
      if(KEY1 == "walletInfo"){
        return JSON.parse(window.localStorage.getItem(KEY1) || '{}')
      } else {
        return JSON.parse(window.localStorage.getItem(KEY1) || '[]')
      }
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
    keepDecimalPlaces(num,a) {      //将num保留a位小数,用于余额显示,参数1为原数据,参数2为位数
      let result;
      if(isNaN(num)){
        result = NaN;
      } else {
        result = parseInt(num * (Math.pow(10,a))) / (Math.pow(10,a));
      }
      return result;
    },
    sendWebsocket(uri, message) {           //与gateway通用发送消息方法
      let ip = this.uri2Ip(uri);
      this.$store.state.vuexStore.webSocketList.every(function(data,index){   //遍历
        if(data.Ip == ip && data.websock != ""){
            data.websock.send(JSON.stringify(message));
            return false;
        }
      })
    },
    getChannelBalance() {       //index页面获取通道总余额
      let _this = this;
      let tncBalance = 0;
      let ethBalance = 0;
      _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
          if(data.isTestNet == _this.isTestNet && data.State == 3 && data.assetType == "TNC"){ 
              tncBalance += data.SelfBalance;
          } else if(data.isTestNet == _this.isTestNet && data.State == 3 && data.assetType == "ETH"){  
              ethBalance += data.SelfBalance;
          }
      })
      Vue.set(_this.$store.state.vuexStore.balanceData.Channel, "TNC", _this.keepDecimalPlaces(tncBalance / 10e7,3));
      Vue.set(_this.$store.state.vuexStore.balanceData.Channel, "ETH", _this.keepDecimalPlaces(ethBalance / 10e7,3));
    },
    showLoading:function (){            //显示加载页面
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
    showSignOutBox() {                //显示退出登录框
      this.isSignOutBoxShow = true;
    },
    SignOut() {                       //清空数据重载
      this.$store.state.vuexStore.walletInfo = {         //删除钱包信息
        keyStore: "",
        publicKey: "",
        address: "",
        keyStorePass: ""
      }
      this.$store.state.vuexStore.isLogin = false;
      this.saveAsString("isLogin", this.$store.state.vuexStore.isLogin);                      // 存储wallet信息
      this.saveAsArray("walletInfo", this.$store.state.vuexStore.walletInfo);                 // 存储wallet信息
      location.reload();
    },
    decryptPrivateKey (keyStore,password) {              //解锁钱包
      let _this = this;
      let decryptPrivateKey;
      try {
          decryptPrivateKey = web3.eth.accounts.decrypt(keyStore, password);
      } catch (e) {
          if(e.message == 'Key derivation failed - possibly wrong password'){
              _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-2'),
                  duration: 3000
              });
              return false;
          } else {
              _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: e.message,
                  duration: 3000
              });
              return false;
          }
      }
      return decryptPrivateKey;
    },
    verifyPassword (keyStore,password) {       //用于表单验证解锁钱包,无弹窗提醒
      let _this = this;
      let decryptPrivateKey;
      try {
          decryptPrivateKey = web3.eth.accounts.decrypt(keyStore, password);
      } catch (e) {
          console.log(e);
          return false;
      }
      return decryptPrivateKey;
    },
    async signDataForERC20Contract(contractAddress, functionName, dataTypeList, dataList, password, gasPrice) {//ETH 合约通用签名方法,上链
        let _this = this;
        let dataTypeString = dataTypeList.join(",");
        let signedData;
        if(dataTypeList.length == dataList.length){
          console.log(contractAddress);
          console.log(functionName);
          console.log(`${functionName}(${dataTypeString})`);
          console.log(dataTypeList);
          console.log(dataList);
          console.log(password);
          console.log(gasPrice);
          console.log("________________________");
          // var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
          //     from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
          //     gasPrice: _this.$store.state.vuexStore.gasPrice        //Gas价格
          // });
          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, password);
          await web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(async function(nonce){
            // 获取交易次数
            console.log(nonce);

            // approve押金金额
            let functionSig = web3.eth.abi.encodeFunctionSignature(`${functionName}(${dataTypeString})`);     //获取functionSig
            console.log(functionSig);

            let data = web3.eth.abi.encodeParameters(dataTypeList, dataList);                       //abi加密参数
            console.log(data);

            typeof gasPrice != "number" ? gasPrice = _this.$store.state.vuexStore.gasPrice : gasPrice;

            try {
              await web3.eth.estimateGas({
                to: contractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address,
                data: functionSig + data.substr(2)
              }).then(function(result){
                if(typeof result == "number"){
                  console.log(result);
                  var txData = {        //组成txData数据
                      nonce: web3.utils.toHex(nonce++),
                      gasPrice: web3.utils.toHex(gasPrice), 
                      gasLimit: web3.utils.toHex(result + 5000),
                      to: contractAddress,
                      from: _this.$store.state.vuexStore.walletInfo.address, 
                      value: '0x00', 
                      data: functionSig + data.substr(2)
                  };
                  console.log(txData);

                  signedData = signData(txData,decryptPK.privateKey);     //签名
                  console.log(signedData);
                } else {
                  console.log("模拟上链失败");
                  console.log(result);
                }
              });
            } catch (error) {
              console.log(error);
            }
            

          })
        }
        return signedData;
    },
    ecSignForTrinityContract(dataTypeList, dataList, password) {             //Trinity合约中交互通用签名方法
        let _this = this;
        let result;
        if(dataTypeList.length == dataList.length){
          console.log(dataTypeList);
          console.log(dataList);
          console.log(password);
          console.log("________________________");
          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, password);

          let soliditySha3Data = 'web3.utils.soliditySha3(';
          for(let i = 0; i < dataTypeList.length; i++){
            let obj = "{'t' : dataTypeList[" + i + "],'v' : dataList[" + i + "]},";
            soliditySha3Data = soliditySha3Data + obj;
          }
          soliditySha3Data = soliditySha3Data + ")";
          console.log(soliditySha3Data);
          
          //web3.utils.soliditySha3({t: 'string', v: 'Hello!%'}, {t: 'int8', v:-23});       拼凑类似消息体
          let txData = eval(soliditySha3Data);
          console.log(txData);

          //arguments生成数据错误弃用
          // for(let i = 0; i < dataTypeList.length; i++){
          //   let aa = {'t' : dataTypeList[" + i + "],'v' : dataList[" + i + "]};
          //   arguments[i] = aa
          // }
          // console.log(arguments);
          // let txData = web3.utils.soliditySha3(arguments);
          // console.log(txData);         
          let signedData = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(signedData);
          result = {
            txData : txData,
            signedData : signedData
          }
        } else {
          console.log("参数长度不一致");
          result = false;
        }
        console.log(result);
        return result;
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
    assetContractAddress2AssetType(assetContractAddress) {          //合约地址转资产类型,
      let assetType = "";
      console.log(this.isTestNet);
      if(this.isTestNet){
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
    AssetType2AssetContractAddress(assetType) {         //资产类型转合约地址
      let assetContractAddress = "";
      if(this.isTestNet){
        switch(assetType)
        {
        case "TNC":
          assetContractAddress = this.tncContractAddress;
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
    AssetTypeToAssetId(AssetType) {                  //NEO.资产类型转AssetId
      let _this = this;
      let AssetId = "";
      console.log(_this.isTestNet);
      if(_this.isTestNet){
        switch(AssetType)
        {
        case "TNC":
          AssetId = "0x849d095d07950b9e56d0c895ec48ec5100cfdff1";
          break;
        case "GAS":
          AssetId = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        case "NEO":
          AssetId = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
          break;
        default:
          AssetId = Error;
        }
      } else {
        switch(AssetType)
        {
        case "TNC":
          AssetId = "0x08e8c4400f1af2c20c28e0018f29535eb85d15b6";
          break;
        case "GAS":
          AssetId = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        case "NEO":
          AssetId = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
          break;
        default:
          AssetId = Error;
        }
      }
      return AssetId;
    },
    AssetTypeToAssetId1(AssetType){                 //NEO.资产类型转AssetId,构造交易的0x问题
      let AssetId = "";
      if(this.isTestNet){
        switch(AssetType)
        {
        case "TNC":
          AssetId = "849d095d07950b9e56d0c895ec48ec5100cfdff1";
          break;
        case "GAS":
          AssetId = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        case "NEO":
          AssetId = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
          break;
        default:
          AssetId = Error;
        }
      } else {
        switch(AssetType)
        {
        case "TNC":
          AssetId = "08e8c4400f1af2c20c28e0018f29535eb85d15b6";
          break;
        case "GAS":
          AssetId = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
          break;
        case "NEO":
          AssetId = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
          break;
        default:
          AssetId = Error;
        }
      }
      return AssetId;
    },
    AssetIdToAssetType(a) {
      let AssetType = "";
      if(this.isTestNet){
        switch(a)
        {
        case "849d095d07950b9e56d0c895ec48ec5100cfdff1":
          AssetType = "TNC";
          break;
        case "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7":
          AssetType = "GAS";
          break;
        case "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b":
          AssetType = "NEO";
          break;
        default:
          AssetType = Error;
        }
      } else {
        switch(a)
        {
        case "08e8c4400f1af2c20c28e0018f29535eb85d15b6":
          AssetType = "TNC";
          break;
        case "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7":
          AssetType = "GAS";
          break;
        case "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b":
          AssetType = "NEO";
          break;
        default:
          AssetType = Error;
        }
      }
      //console.log(AssetType);
      return AssetType;
    },
    getChannelSerial(type,value,open,isLog) {      //获取所需的channel在List的位置,参数为key,value,是否为open状态,是否显示提醒框
        let _this = this;
        let i = -1;
        _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
         if(data[type] == value && data.isTestNet == _this.isTestNet){
              if(open == null){
                i = index;
                return;
              } else if (open == 'open'){
                if(data.State == 3 && data.isConnect == true){
                  i = index;
                  return;
                } else {
                  i = -2;
                  if(isLog !== false){
                    _this.$notify.error({    //当l为-2时,通道未打开或者未连接websocket
                      title: _this.$t('common.warning'),
                      dangerouslyUseHTMLString: true,
                      message: _this.$t('common.callback-18'),
                      duration: 3000
                    });
                  }
                }
              }
          } else {
            i = -1;
            if(isLog !== false){
              _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-17'),
                duration: 3000
              });
            }
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
                  title: _this.$t('common.success'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-4'),
                  duration: 3000,
                  type: 'success'
              });
              _this.$store.state.vuexStore.recordList.forEach(function(data,index){   //遍历交易记录,修改交易记录状态
                if(data.transactionHash == result.transactionHash){
                  data.blockHash = result.blockHash;
                  data.state = 1;
                  console.log("修改状态成功");
                  _this.StoreData("recordList");
                }
              });
              _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历通道列表,修改通道状态,用于删除通道时
                if(data.closeHash == result.transactionHash){
                  _this.$store.state.vuexStore.channelList.splice(index,1);
                  _this.StoreData("channelList");
                  console.log("存储通道信息");
                }
              });
              return result;
            } else if(result.status == false){
              _this.$notify({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-5'),
                  duration: 3000,
                  type: 'error'
              });
              _this.$store.state.vuexStore.recordList.forEach(function(data,index){   //遍历交易记录,修改交易记录状态
                if(data.transactionHash == result.transactionHash){
                  data.blockHash = result.blockHash;
                  data.state = -1;
                  console.log("修改状态成功");
                  _this.StoreData("recordList");
                }
              });
              return result;
            }
          }
        })
     }, 4000);
    },
    monitorEventByNodeUri(channelName, eventList) {          //向全节点申请监控事件
      let _this = this; 
      for(var i = 0 ; i < eventList.length ; i++){
        // setTimeout(function (){
          let Message = {                                                                     //监控事件消息体
            'messageType': eventList[i],
            "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
            "chainType": _this.baseChain,
            'playload': channelName,
            'comments': ''
          };
          _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //发送监控消息
        // }, 2000);
      }
    },
    nodeUriWebsocketOnMessage(e) {        //全节点websocket接收消息
      let _this = this;
      if(e.data === 'connected to server'){
        //_this.connectWebSocketForNodeUriNotify.close();                //关闭连接至全节点notify
        if(_this.loseWebSocketForNodeUriNotify){
          _this.loseWebSocketForNodeUriNotify.close();                //关闭连接至全节点notify
        }
        console.log("连接全节点成功");
        // _this.$notify({
        //     title: _this.$t('common.success'),
        //     dangerouslyUseHTMLString: true,
        //     message: _this.$t('common.callback-6'),
        //     duration: 3000,
        //     type: 'success'
        // });
      } else {
        let redata = JSON.parse(e.data);
        let type = redata.messageType;
        console.log(redata);

        switch(type)
        {
        case "monitorAddress":                                      //全节点监控到链上收款
          _this.OnMesMonitorAddress(redata);
          break;
        case "monitorDeposit":
          _this.OnMesMonitorDeposit(redata);
          break;
        case "monitorQuickCloseChannel":
          _this.OnMesMonitorQuickCloseChannel(redata);
          break;
        case "monitorCloseChannel":
          _this.OnMesMonitorCloseChannel(redata);
          break;
        case "monitorUpdateTransaction":
          _this.OnMesMonitorUpdateTransaction(redata);
          break;
        case "monitorSettle":
          _this.OnMesMonitorSettle(redata);
          break;
        case "monitorWithdraw":
          _this.OnMesMonitorWithdraw(redata);
          break;
        case "monitorWithdrawUpdate":
          _this.OnMesMonitorWithdrawUpdate(redata);
          break;
        case "monitorWithdrawSettle":
          _this.OnMesMonitorWithdrawSettle(redata);
          break;
        default:
        
        }
      }
    },
    OnMesMonitorAddress(redata) {           //全节点监控到链上收款
      // 收到的消息体
      // {
      // addressFrom: "0xca9f427df31a1f5862968fad1fe98c0a9ee068c4"
      // addressTo: "0x3d1295c2bb4a32155386cc652419c34ec5674731"
      // assetId: "0x"
      // assetType: "ETH"
      // blockNumber: 4283751
      // chainType: "ETH"
      // messageType: "monitorAddress"
      // playload: "0x3d1295c2bb4a32155386cc652419c34ec5674731"
      // timestamp: 1540279704
      // txId: "0xea3905cc3a9e8e87e0a4a1cac98c66827b83b6891b69fc72986561c44e1602d2"
      // value: "0.1"
      // }
      let _this = this;
      _this.$notify({
          title: "收款",
          dangerouslyUseHTMLString: true,
          message: "收款" + redata.value + redata.assetType + ", 发送者: " + redata.addressFrom,
          duration: 3000,
          type: 'info'
      });
      let date = new Date().getTime();        //获取当前时间戳
      let recordMessage = {       //构造交易记录信息
        date: date,
        name: redata.addressFrom,
        Amount: Number(redata.value).mul(10e7),
        assetType: redata.chainType,
        isOnChannel: false,
        isPay: false,
        state: 1,
        isTestNet: _this.isTestNet,
        transactionHash : redata.txId,
        blockHash: ""
      }
      _this.$store.state.vuexStore.recordList.push(recordMessage);
      _this.StoreData("recordList");         //保存交易信息
    },
    OnMesMonitorDeposit(redata) {           //收到全节点监控创建通道事件
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
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-7'),
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
                title: _this.$t('common.success'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-8'),
                duration: 3000,
                type: 'success'
            });
            let channelInfo = _this.$store.state.vuexStore.channelList[l];
            channelInfo.State = 3;
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.StoreData("channelList");                   //储存通道信息
            _this.getChannelBalance();              //更新通道余额
          }
      }
    },
    OnMesMonitorQuickCloseChannel(redata) {           //收到全节点监控快速关闭通道事件
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
      if(l >= 0){
          console.log(redata.amountA);
          console.log(redata.amountB);
          let SelfBalance = _this.$store.state.vuexStore.channelList[l].SelfBalance;
          let OtherBalance = _this.$store.state.vuexStore.channelList[l].OtherBalance;
          console.log(SelfBalance);
          console.log(OtherBalance);
          if(redata.amountA == SelfBalance && redata.amountB == OtherBalance){
            _this.$notify({
                title: _this.$t('common.success'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-9'),
                duration: 3000,
                type: 'success'
            });
            _this.$store.state.vuexStore.channelList.splice(l,1);

            // _this.$store.state.vuexStore.webSocketList.forEach(function(data,index){   //遍历
            //   if(data.Ip == ip && data.websock != ""){
            //       data.websock.send(JSON.stringify(message));
            //       return;
            //   }
            // })

            _this.StoreData("channelList");                   //储存通道信息
            _this.getChannelBalance();              //更新通道余额
          }
      }
    },
    OnMesMonitorCloseChannel(redata) {           //收到全节点监控强制关闭通道事件
      let _this = this;
      let l = _this.getChannelSerial('ChannelName', redata.playload);
      if(redata.invoker == _this.$store.state.vuexStore.walletInfo.address.toLowerCase()){      //当发起者为自己时,发送监听块高事件
        let Message = {
            "messageType": "monitorSelfCloseChannel", 
            "baseChain": "ETH", 
            "channelName": redata.playload,
            "blockNumber": redata.blockNumber,
            "selfBalance": _this.$store.state.vuexStore.channelList[l].SelfBalance,
            "otherBalance": _this.$store.state.vuexStore.channelList[l].OtherBalance, 
        }
        _this.$store.state.vuexStore.eventList.push(Message);
        _this.StoreData("eventList");
        console.log(_this.$store.state.vuexStore.eventList);
      } else {
        console.log("对端nonce:" + redata.nonce);
        console.log("本端nonce:" + _this.$store.state.vuexStore.channelList[l].TxNonce);
        if(_this.$store.state.vuexStore.channelList[l].TxNonce <= redata.nonce){
          _this.$notify.info({
              title: _this.$t('common.info'),
              dangerouslyUseHTMLString: true,
              message: redata.channelId + _this.$t('common.callback-10'),
              duration: 3000
          });
        } else {
          redata.type = ""
          _this.sendUpdateTransaction(redata);
          // _this.settleTransactionNotify = _this.$notify({
          //     title: _this.$t('common.warning'),
          //     dangerouslyUseHTMLString: true,
          //     message: redata.channelId + _this.$t('common.callback-11'),
          //     duration: 0,
          //     type: 'error',
          //     onClick: showDialog
          // });
          // function showDialog(){                          //显示接收信息框
          //     _this.activeInfo.redata = redata;
          //     _this.isUpdateTransactionInfoBox = true;
          // }
        }
        let eventList = ["monitorSettle"];                                //监控对端关闭通道事件
        _this.monitorEventByNodeUri(redata.playload, eventList);       //向全节点提交监控通道事件
      }
    },
    OnMesMonitorUpdateTransaction(redata) {           //收到全节点监控对端更新通道数据事件
      let l = this.getChannelSerial('ChannelName', redata.playload);
      this.$store.state.vuexStore.channelList.splice(l,1);
      this.StoreData("channelList");
      this.$notify({
          title: this.$t('common.success'),
          dangerouslyUseHTMLString: true,
          message: this.$t('common.callback-12'),
          duration: 3000,
          type: 'success'
      });
    },
    OnMesMonitorSettle(redata) {                         //强制拆通道结算信息
      let l = this.getChannelSerial('ChannelName', redata.playload);
      this.$store.state.vuexStore.channelList.splice(l,1);
      this.StoreData("channelList");
      this.$notify({
          title: this.$t('common.success'),
          dangerouslyUseHTMLString: true,
          message: this.$t('common.callback-12'),
          duration: 3000,
          type: 'success'
      });
    },
    OnMesMonitorWithdraw(redata){                  //收到全节点监控对端上链HTLC事件
      // blockNumber: 4277632
      // channelId: "0x2f1cb2e6b676c5cf73627468c99338d37574576fd0140f5476db84691d21dbce"
      // invoker: "0xdc1ff8ee46f97f6089aa17553f1531f81c33fe7f"
      // lockHash: "0x742a7dbc2cc793c62bba6cc1d5005ac578f56f65e8c4548fa6dc26fc1e62f518"
      // messageType: "monitorWithdraw"
      // playload: "0x2f1cb2e6b676c5cf73627468c99338d37574576fd0140f5476db84691d21dbce"
      // secret: "0x2bdb830a8a7c7c941f087a4dfa208ebf8c9f53eb5430e4d97ed7b978b36706f1"
      // txId: "0x08198ed96aadfddc7558cfed06a8b354d89d2767b59a9ec222c492f6def0f8ea"
      let _this = this;
      if(redata.invoker == _this.$store.state.vuexStore.walletInfo.address.toLowerCase()){      //当发起者为自己时,发送监听块高事件
        let eventMessage = {
          "messageType": "monitorUnlockAmount", 
          "baseChain": "ETH", 
          "channelName": redata.playload,
          "blockNumber": redata.blockNumber,
          "HashR": redata.lockHash
        }
        _this.$store.state.vuexStore.eventList.push(eventMessage);
        _this.StoreData("eventList");
      } else {
        console.log("收到对端HTLC作弊");
        if(redata.secret){
          console.log(redata.secret);
          _this.$store.state.vuexStore.txList.forEach(function(val,index){
            if(val.channelName == redata.playload && val.history.length){
              val.history.forEach(function(val1,index1){
                if(val1.HashR == redata.lockHash && val1.delayBlock == undefined){             //找到匹配的R交易
                  console.log("找到对应R交易");
                  let data = val1;
                  data.channelName = redata.channelName;
                  data.R = redata.secret;
                  _this.sendUpdateTransaction(data);
                }
              })
            }
          });
        }
      }
    },
    OnMesMonitorWithdrawUpdate(redata) {                    //收到全节点监控对端上链WithdrawUpdate事件
      console.log(redata);
    },
    OnMesMonitorWithdrawSettle(redata) {                    //对端HTLC上链成功
      // channelId: "0x9cb06a05d7ad6dfa5fd8fcd9e045a5b1d63ccab6431a0ee10042f3f37519dadc"
      // invoker: "0xcc338fc6ed34bab8e6b1088d1074bd075010cbb5"
      // lockAmount: 101000000
      // lockHash: "0x2af93eb25e2b55eb318b0bd6e56a06f53a6a73d41595fc446f0dbf3cf4828284"
      // messageType: "monitorWithdrawSettle"
      // playload: "0x9cb06a05d7ad6dfa5fd8fcd9e045a5b1d63ccab6431a0ee10042f3f37519dadc"
      // txId: "0xf01be03baf91a1b4cd2af82adfbb48ef81b2e9fc2bbe42fc7a9a45df8832b536"
      let _this = this;
      if(redata.hashLock){
        console.log(redata.hashLock);
        _this.$store.state.vuexStore.txList.forEach(function(data,index){
          if(data.channelName == redata.playload){
            data.forEach(function(data1,index){
              if(data1.HashR == redata.hashLock && data1.delayBlock != undefined){             //找到匹配的R交易
                console.log("对端HTLC上链成功,更新余额");
              }
            })
          }
        })
      }
    },
    // sendUpdateTransaction() {                   //发送制裁交易
    //   this.$refs['activeInfo'].validate((valid) => {
    //     this.sendUpdateTransactionFun();      //用于element表单认证里使用await报错
    //   })
    // },
    async sendUpdateTransaction(redata) {        //发送制裁交易
      let _this = this;

      console.log(redata);
      let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;

      if(redata.messageType == "monitorCloseChannel"){         //如果为R交易制裁,取最新的交易
        let channelName = redata.playload;
        _this.$store.state.vuexStore.txList.forEach(function(data,index){
          if(data.channelName == channelName && data.history[data.history.length - 1].founderSignedData && data.history[data.history.length - 1].peerSignedData){
            console.log(data.history[data.history.length - 1].founder);
            console.log(_this.$store.state.vuexStore.walletInfo.address);
            let nonce = data.history[data.history.length - 1].nonce;
            let founder = data.history[data.history.length - 1].founder;
            let founderBalance = data.history[data.history.length - 1].founderBalance;
            let founderSignedData = data.history[data.history.length - 1].founderSignedData;
            let peer = data.history[data.history.length - 1].peer;
            let peerBalance = data.history[data.history.length - 1].peerBalance;
            let peerSignedData = data.history[data.history.length - 1].peerSignedData;
            let HashR = "0x" + addPreZero(0,64);
            let R = "0x" + addPreZero(0,64);
          }
        })
      } else {                                                                                   //如果为H交易,取对应HashR的R交易
        console.log("H交易制裁");
        let { channelName, nonce, founder, founderBalance, founderSignedData, peer, peerBalance, peerSignedData, HashR, R } = redata;
      }
      let l = _this.getChannelSerial('ChannelName', channelName, "open", false);
      console.log(l);

      let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32','bytes','bytes']; 
      let dataList = [channelName, nonce, founder, founderBalance, peer, peerBalance, R, secret, founderSignedData, peerSignedData];
      let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "updateTransaction", dataTypeList, dataList, keyStorePass);               //签名
      console.log(signedData);
      
      let date = new Date().getTime();        //获取当前时间戳
      web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
      .on('transactionHash', function(hash){              //收到交易hash时
          console.log(hash);
          _this.$notify({
              title: _this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000,
              type: 'success'
          });
          _this.cycleGetTransactionReceipt(hash);
          // if(_this.settleTransactionNotify){
          //   _this.settleTransactionNotify.close();                     //关闭制裁通知框
          //   _this.settleTransactionNotify = undefined;
          // }
          // if(_this.WithdrawNotify){
          //   _this.WithdrawNotify.close();                     //关闭制裁通知框
          //   _this.WithdrawNotify = undefined;
          // }
          //_this.isUpdateTransactionInfoBox = false;         //关闭窗口
          // _this.activeInfo = {                              //清空数据
          //   "channelName": "",
          //   "keyStorePass": "",
          //   "redata": "",
          //   "txData": ""
          // }
          // _this.$refs['activeInfo'].resetFields();          //重置验证消息

          _this.$store.state.vuexStore.channelList.splice(l,1);             //删除通道
          _this.StoreData("channelList");
          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          return;
      })
    },
    nodeUriWebsocketClose(val) {         //全节点websocket断开
      console.log("已断开websocket");
      console.log(val);
      // this.loseWebSocketForNodeUriNotify = this.$notify({
      //     title: this.$t('common.warning'),
      //     dangerouslyUseHTMLString: true,
      //     message: this.$t('common.callback-15'),
      //     duration: 0,
      //     type: 'error',
      //     onClick: this.connectWebSocketForNodeUri
      // });
    },
    getblockHeight() {
      let _this = this;
      web3.eth.getBlockNumber().then(function(blockNumber){           //获取当前块高
          console.log('当前块高:' + blockNumber);
          _this.$store.state.vuexStore.eventList.forEach(function(data,index){
            if(data.blockNumber < blockNumber && blockNumber - data.blockNumber < 5760){
              console.log("监控到事件" + data.messageType);
              switch(data.messageType)
              {
              case "monitorSelfCloseChannel":
                _this.OnMesMonitorSelfCloseChannel(data);
                break;
              case "monitorSendUnlockAmount":
                _this.OnMesMonitorSendUnlockAmount(data);
                break;
              case "monitorUnlockAmount":
                _this.OnMesMonitorUnlockAmount(data);
                break;
              default:
              
              }
            }
          });
      })
    },
    blockHeightCycle() {                //循环获取块高
      var blockHeightCycle = setInterval(this.getblockHeight, 120000);
      //clearInterval(blockHeightCycle);  //停止循环方法
    },
    async OnMesMonitorSelfCloseChannel(redata) {                //自身强制关闭通道的指定块高
      let _this = this;
      let channelName = redata.channelName;
      let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
      let l = _this.getChannelSerial('ChannelName', channelName);
      let dataTypeList = ['bytes32']; 
      let dataList = [channelName];
      let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "settleTransaction", dataTypeList, dataList, keyStorePass);               //签名
      console.log(signedData);
      
      let date = new Date().getTime();        //获取当前时间戳
      web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
      .on('transactionHash', function(hash){              //收到交易hash时
          console.log(hash);
          _this.$notify({
            title: _this.$t('common.success'),
            dangerouslyUseHTMLString: true,
            message: _this.$t('common.callback-14'),
            duration: 3000,
            type: 'success'
          });
          let recordMessage = {           //构造上链record消息
            date: date,
            name: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
            Amount: _this.$store.state.vuexStore.channelList[l].SelfBalance,
            assetType: 'TNC',
            isOnChannel: true,
            isPay: true,
            state: 0,
            isTestNet: _this.isTestNet,
            transactionHash : hash,
            blockHash: ""
          }
          _this.$store.state.vuexStore.recordList.push(recordMessage);
          _this.StoreData("recordList");                                      //保存交易记录

          //_this.isSettleTransactionInfoBox = false,          
          //_this.SettleTransaction = {           //清除消息
          //  "blockNumber": '',
          //  "keyStorePass": ''
         // };
          _this.$store.state.vuexStore.channelList[l].closeHash = hash;

          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == channelName){
              console.log("通道关闭,停止监听");
              _this.$store.state.vuexStore.eventList.splice(index,1);
              _this.StoreData("eventList");
            }
          })
          _this.selfCloseChannelNotify.close();

          _this.cycleGetTransactionReceipt(hash);
          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          return;
      })
    },
    async OnMesMonitorSendUnlockAmount(redata) {                    //HTLC交易到达指定块高仍未获得  R,可以申请解冻资产
      let _this = this;

      console.log(redata);
      let l = _this.getChannelSerial('ChannelName', redata.channelName);
      let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
      let dataTypeList = ['bytes32','address','address','uint256','uint256','bytes32','bytes','bytes','bytes32']; 
      let dataList = [
          redata.channelName, 
          _this.$store.state.vuexStore.walletInfo.address, 
          redata.data.peer, 
          redata.data.delayBlock,
          redata.data.paymentCount,
          redata.data.HashR,
          redata.data.founderDelayCommitment,
          redata.data.peerDelayCommitment,
          redata.data.R ? redata.data.R : "0x" + addPreZero(0,64)
      ];
      let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "withdraw", dataTypeList, dataList, keyStorePass);               //签名
      console.log(signedData);
            
      let date = new Date().getTime();        //获取当前时间戳
      web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
      .on('transactionHash', function(hash){              //收到交易hash时
          console.log(hash);
          _this.$notify({
              title: _this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000,
              type: 'success'
          });
          _this.cycleGetTransactionReceipt(hash);
          // if(_this.sendUnlockAmountNotify){
          //   _this.sendUnlockAmountNotify.close();
          //   _this.sendUnlockAmountNotify = undefined;
          // }
          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == redata.channelName && data.messageType == "monitorSendUnlockAmount"){
              console.log("withdraw成功,停止监听");
              _this.$store.state.vuexStore.eventList.splice(index,1);
              _this.StoreData("eventList");
            }
          })

         // _this.isSendUnlockAmountInfoBox = false;         //关闭窗口

          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          return;
      })
    },
    async OnMesMonitorUnlockAmount(redata) {            //申请解冻资产到达指定块高
      let _this = this;
      let channelName = redata.channelName;
      let HashR = redata.HashR;
      let dataTypeList = ['bytes32','bytes32']; 
      let dataList = [channelName, HashR];
      let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
      let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "withdrawSettle", dataTypeList, dataList, keyStorePass);               //签名
      console.log(signedData);
      
      let date = new Date().getTime();        //获取当前时间戳
      web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
      .on('transactionHash', function(hash){              //收到交易hash时
          console.log(hash);
          _this.$notify({
              title: _this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000,
              type: 'success'
          });

          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == channelName && data.messageType == "monitorUnlockAmount"){
              console.log("withdrawSettle,停止监听");
              _this.$store.state.vuexStore.eventList.splice(index,1);
              _this.StoreData("eventList");
            }
          })

          //_this.isUnlockAmountInfoBox = false;                    //关闭解锁HTLC消息窗
          //_this.cycleGetTransactionReceipt(hash);
          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          return;
      })
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
      case "ChannelInfo":
        _this.OnMesChannelInfo(redata);
        break;
      case "AddChannel":                            //用于全节点监控不到时,以及NEO
        _this.OnMesAddChannel(redata);
        break;
      case "DeleteChannel":                       //用于全节点监控不到时
        _this.OnMesDeleteChannel(redata);
        break;
      case "Founder":                               //NEO
        _this.OnMesFounder(redata);
        break;
      case "UpdateChannel":                   //NEO           
        _this.OnMesUpdateChannel(redata);
        break;
      case "RegisterChannelFail":                   //NEO           
        _this.OnMesRegisterChannelFail(redata);
        break;
      default:
      
      }
    },
    async OnMesFounderSign(redata) {        //收到FounderSign消息
      // 收到的消息体
      // {
      //   ChannelName:"0xf21a712999ee0e477065df49433b0ea1a6f55c77a28b4a621dae0431d67b35e6"
      //   MessageBody:{
      //   AssetType: "TNC"
      //   Commitment: "0x4b2eb00ceba91f3b413fede38d79da4a207c731780248421aa8e5d36131b9fec6cda84872bcd8a93dccb7ce2bb58b995f276ca5243c56982b6ff21c5d005732901"
      //   MessageType: "FounderSign"
      //   NetMagic: "191919191919"
      //   Receiver: "0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      //   Sender: "0xD65Af7686F87e04C1e1578A1076b60f2B6D8a66D@106.15.91.150:8089"
      //   Status:"RESPONSE_OK"
      //   TxNonce:0
      // }
      let _this = this;
      if(_this.baseChain == "ETH"){                 //当前为ETH钱包时
        if(redata.Status == "RESPONSE_OK"){               //当Status为OK时，上链并提交给全节点监控
          let txData = _this.$store.state.vuexStore.addChannelInfo.txData;
          let Commitment = redata.MessageBody.Commitment;
          let peerAddress = redata.Sender.split("@")[0];
          let founderAddress = redata.Sender.split("@")[0];
          let selfDeposit = _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7);
          let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
          console.log(txData);
          console.log(Commitment);
          console.log(redata.Sender.split("@")[0].toLowerCase());
          if(ecRecover(txData, Commitment, peerAddress.toLowerCase())){       //验证签名成功时,查询对端余额和Approve情况
            _this.showLoading();
            
            let dataTypeList = ["address","uint256"]; 
            let dataList = [ _this.trinityDataContractAddress, selfDeposit];
            let signedData = await _this.signDataForERC20Contract(_this.tncContractAddress, "approve", dataTypeList, dataList, keyStorePass);               //签名
            console.log(signedData);

            web3.eth.sendSignedTransaction('0x' + signedData)         //上链
            .on('transactionHash', function(hash){      //收到hash时
                console.log(hash);
            })
            .on('receipt', function(receipt){           //approve块确认后,发送Founder
              console.log(receipt);
              _this.confirmOtherApprove(redata);
            })
            .on('error', function(error){
              console.log(error);
              _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: error,
                  duration: 3000
              });
              _this.closeLoading();
              return;
            });
            
          } else {                //当签名验证失败时
            console.log("对端签名验证未通过,停止交易");
            _this.$notify({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.verifyFail'),
              duration: 3000,
              type: 'error'
            });
          }
        } else {                  //当Status不为OK时,删除通道
          console.log(redata.Status);
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: redata.Status,
            duration: 3000
          });
          let l = _this.getChannelSerial("ChannelName", redata.ChannelName);
          _this.$store.state.vuexStore.channelList.splice(l,1);
          _this.StoreData("channelList");         //储存通道信息
        }
      } else if (_this.baseChain == "NEO"){                 //当前为NEO钱包时
          let l = _this.getChannelSerial("ChannelName", redata.ChannelName);      //获取所需的channel在List的位置
          if(l >= 0){
          let MessageBody = redata.MessageBody;
          let witness1 = MessageBody.Founder.originalData.witness.replace('{signOther}', MessageBody.Founder.txDataSign);
          let witness2 = witness1.replace('{signSelf}', _this.$store.state.vuexStore.addChannelInfo.selfSignedData);
          let witness = MessageBody.Founder.originalData.txData + witness2;
          axios({
            method: 'post',
            url: _this.$store.state.vuexStore.NodeRpcUri,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "sendRawTx",
              "params": [witness],
              "id": 1
            })
          }).then(function(res){
            if(res.data.result == true){
              _this.$notify({
                  title: _this.$t('common.success'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-14'),
                  duration: 3000,
                  type: 'success'
              });
            } else {
              _this.$notify.error({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: error,
                  duration: 3000
              });
            }
          });
        }
      }
    },
    confirmOtherApprove(redata){          //查询对端的approve情况直至大于押金余额
      let _this = this;
      let founderAddress = _this.$store.state.vuexStore.walletInfo.address;
      let peerAddress = redata.Sender.split("@")[0];
      let otherDeposit = _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7);
      setTimeout(function (){
        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.tncContractAddress, {
              from: founderAddress,          //发起地址
              gasPrice: gasPrice        //Gas价格
          });
          myContract.methods.balanceOf(peerAddress).call({from: peerAddress}, function(error, balance){
            if(!error) {                  //查询对端地址余额
                console.log(balance);
                if(balance > otherDeposit){     //判断对端余额是否大于通道押金
                  myContract.methods.allowance(peerAddress, _this.trinityDataContractAddress ).call({from: founderAddress}, function(error, result){   //查询对端是否Approve
                      console.log(result);
                      if(result >= otherDeposit){    //当Approve成功后发送建立通道
                          _this.sendDeposit(redata);
                          _this.closeLoading();
                      } else {                          //当没有Approve时,反复查询
                          _this.confirmOtherApprove(redata);
                      }
                  });
                } else {                  //当对端地址余额不足时给出提醒,并返回
                  _this.$notify.error({
                    title: _this.$t('common.warning'),
                    dangerouslyUseHTMLString: true,
                    message: _this.$t('common.callback-16'),
                    duration: 0
                  });
                  return false;
                }
            } else {              //当查询方法失败时
              console.log(error);
            }
          });
        })
      },3000);
    },
    async sendDeposit(redata) {                     //发送创建通道的deposit消息
      console.log(redata);
      let _this = this;
      let channelName = _this.$store.state.vuexStore.addChannelInfo.channelName;
      let TxNonce = 1;
      let founderAddress = _this.$store.state.vuexStore.walletInfo.address;
      let founderDeposit = _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7);
      let peerAddress = _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0];
      let peerDeposit = _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7);
      let founderSignedData = _this.$store.state.vuexStore.addChannelInfo.selfSignedData;
      let peerSignedData = redata.MessageBody.Commitment;
      let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;

      let dataTypeList = ["bytes32","uint256","address","uint256","address","uint256","bytes","bytes"]; 
      let dataList = [channelName, TxNonce, founderAddress, founderDeposit, peerAddress, peerDeposit, founderSignedData, peerSignedData];
      let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "deposit", dataTypeList, dataList, keyStorePass);               //签名
      console.log(signedData);

      console.log(peerSignedData);
      
      let txListMessage = {                                   //txData
        "channelName": channelName,
        "history": [
          {},
          {
            "state": "confirmed",
            "nonce": 1,
            "founder": founderAddress,
            "founderBalance": founderDeposit,
            "peer": peerAddress,
            "peerBalance": peerDeposit,
            "founderSignedData": founderSignedData,
            "peerSignedData": peerSignedData,
            // "delayBlock":,
            // "payment": ,
            "HashR": 0,
            "R": 0
            // "delayCommitment": ,
          }
        ]
      };
      _this.$store.state.vuexStore.txList.push(txListMessage);        
      _this.StoreData("txList");                                        //更新TxList

      let date = new Date().getTime();                            //获取当前时间戳
      web3.eth.sendSignedTransaction('0x' + signedData)           //交易上链
      .on('transactionHash', function(hash){                      //收到交易hash时
          console.log(hash);
          _this.$notify({
              title: _this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-14'),
              duration: 3000,
              type: 'success'
          });
          let l = _this.getChannelSerial("ChannelName", channelName);
          _this.$store.state.vuexStore.channelList[l].transactionHash = hash;     //将交易hash赋值给改通道信息
          _this.StoreData("channelList");                             //保存通道信息

          let eventList = [
            "monitorDeposit",                     //建立通道事件
            "monitorQuickCloseChannel",           //快速关闭通道事件
            "monitorCloseChannel",                //强制关闭通道事件
            "monitorUpdateTransaction",           //制裁事件
            "monitorSettle",                      //强制关闭通道结算事件
            "monitorWithdraw",                    //解锁金额事件
            "monitorWithdrawUpdate",              //制裁解锁金额事件
            "monitorWithdrawSettle"               //到达块高获取解锁金额事件
          ];
          _this.monitorEventByNodeUri(channelName, eventList);       //向全节点提交监控通道事件

          let recordMessage = {                             //构造上链record消息
            date: date,
            name: peerAddress,
            Amount: founderDeposit,
            assetType: 'TNC',
            isOnChannel: false,
            isPay: true,
            state: 0,
            isTestNet: _this.isTestNet,
            transactionHash : hash,
            blockHash: ""
          }
          _this.$store.state.vuexStore.recordList.push(recordMessage);
          let recordMessage1 = {                            //构造通道record消息
            date: date,
            channelName: channelName,
            name: peerAddress,
            Amount: founderDeposit,
            assetType: 'TNC',
            isOnChannel: true,
            isPay: false,
            state: 0,
            isTestNet: _this.isTestNet,
            transactionHash : hash,
            blockHash: ""
          }
          _this.$store.state.vuexStore.recordList.push(recordMessage1);
          _this.StoreData("recordList");                                      //保存交易记录
          _this.cycleGetTransactionReceipt(hash);                       //循环查询hash上链信息
          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          let l = _this.getChannelSerial("ChannelName", channelName);
          _this.$store.state.vuexStore.channelList.splice(l,1);
          _this.StoreData("channelList");         //储存通道信息
          return;
      })

      _this.$store.state.vuexStore.txOnChannelInfo = [];             //清空数据
    },
    OnMesAddChannel(redata) {                 //收到 添加通道成功消息,用于全节点监控失败时
      //收到的消息体
      // {
      // AssetType:"TNC"
      // MessageBody:{
      //   Balance:{
      //     0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866
      //     0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089
      //   }
      // ChannelName:"0x2d29affaf3282a93a5a7230cc31038f7296a464585016570a8f01ff0060459aa"
      // Founder:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      // Receiver:"0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089"
      // MessageType:"AddChannel"
      // NetMagic:"527465737419990331"
      // }
      var _this = this;
      if(_this.baseChain == "ETH" && _this.baseChain.NodeUriWebSocket == null){                 //当前为ETH钱包时
        // let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName);      //获取所需的channel在List的位置
        // console.log(l);
        // let channelInfo = _this.$store.state.vuexStore.channelList[l];
        // console.log(channelInfo);
        // channelInfo.State = 3;                            //通道状态更新
        // Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        // console.log(_this.$store.state.vuexStore.channelList[l]);
        // _this.StoreData("channelList");                   //保存通道信息
        // _this.getChannelBalance();              //更新通道余额
      } else if(_this.baseChain == "NEO"){                 //当前为NEO钱包时
        let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName);      //获取所需的channel在List的位置
        if(l >= 0){
          let channelInfo = _this.$store.state.vuexStore.channelList[l];
          console.log(channelInfo);
          channelInfo.State = 3;                                                        //通道状态更新为open
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
          console.log(_this.$store.state.vuexStore.channelList[l]);
          _this.StoreData("channelList");                   //保存通道信息
          _this.getChannelBalance();              //更新通道余额
          _this.$notify({
              title: _this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-8'),
              duration: 3000,
              type: 'success'
          });

          let txListMessage = {                                   //txData
            "channelName": _this.$store.state.vuexStore.addChannelInfo.channelName,
            "history": [
              {},
              {
                "nonce": 1,
                "founder": _this.$store.state.vuexStore.walletInfo.address,
                "founderBalance": _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7),
                "peer": _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],
                "peerBalance": _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7),
                "founderSignedData": _this.$store.state.vuexStore.addChannelInfo.selfSignedData,
                "peerSignedData": redata.MessageBody.Commitment,
                // "delayBlock":,
                // "payment": ,
                "HashR": 0,
                "R": 0,
                // "delayCommitment": ,
                "addressFunding": _this.$store.state.vuexStore.addChannelInfo.addressFunding,
                "scriptFunding": _this.$store.state.vuexStore.addChannelInfo.scriptFunding,
                "txId": _this.$store.state.vuexStore.addChannelInfo.txId
              }
            ]
          };
          _this.$store.state.vuexStore.txList.push(txListMessage);        
          _this.StoreData("txList");                                        //更新TxList
        }
      }
    },
    OnMesRsmc(redata) {             //收到Rsmc消息,ETH收款,NEO RMSC交互
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
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName, 'open');      //获取所需的channel在List的位置
      if(_this.baseChain == "ETH"){
        if(l >= 0){ 
          let Message, R, nonce;                                             //申明消息体,用于发送websocket, nonce用于该笔交易真正的nonce
          let channelName = redata.ChannelName;
          let TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce + 1;
          let paymentCount = Number(redata.MessageBody.PaymentCount);
          let founderAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0];
          let founderBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
          let peerAddress = _this.$store.state.vuexStore.walletInfo.address;
          let peerBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + paymentCount;
          let HashR = redata.MessageBody.HashR;
          let NetMagic = _this.$store.state.vuexStore.NetMagic;
          let assetType = _this.$store.state.vuexStore.channelList[l].assetType;
          let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
          if(HashR == undefined){                                                      //如果Rsmc交易,对端更新balance
            founderBalance = Number(founderBalance) - paymentCount;
          } else {                                                                     //如果HTLC-R交易,对端不更新balance,因为已经锁定
            R = _this.getRByHashR(HashR);                                             //由HashR获取对应的R值
          }

          let checkResult = _this.checkHistory(channelName, redata.TxNonce);          //检查历史记录
          let ResignBody;                                                             //申明变量,用于赋值回签数据
          if(redata.MessageBody.ResignBody){                                          //如果收到的redata含ResignBody字段
            let ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
            checkResult = _this.checkHistory(channelName, ResignTxNonce);             //检查请求回签的Nonce历史记录
            if (checkResult.type == "approveNonce" || redata.TxNonce - ResignTxNonce == 1){
              //当Rmsc带有ResignBody字段,
              //且Resign的交易状态为"INIT",
              //且TxNonce比ResignTxNonce只大1,
              //则同时回签1,2的签名,2-②
              console.log("同时回签1,2的签名");
              nonce = TxNonce;                    //将TxNonce赋值给nonce,用于回签2的签名
              let ResignCommitment = redata.MessageBody.ResignBody.Commitment;                      //对端回签的签名,用于后续认证
              let typeList = ['founder', 'founderBalance', 'peer', 'peerBalance', 'isFounder','nonce', 'HashR', 'R'];
              let result = _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
              let ResignFounderAddress = result.founder;
              let ResignFounderBalance = result.founderBalance;
              let ResignPeerAddress = result.peer;
              let ResignPeerBalance = result.peerBalance;
              let ResignOtherAddress = result.isFounder ? ResignPeerAddress : ResignFounderAddress;
              let ResignHashR = result.HashR;
              let ResignR = result.R;

              let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
              let dataList = [channelName, ResignTxNonce, ResignFounderAddress, ResignFounderBalance, ResignPeerAddress, ResignPeerBalance, ResignHashR, ResignR];
              let ResignedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);   //签名1的数据
              console.log(ResignOtherAddress.toLowerCase());
              if(ecRecover(ResignedDataResult.txData, ResignCommitment, ResignOtherAddress.toLowerCase())){    //验证对端ReSign的签名
                let txListMessage = {                           //申明需要更新的txData
                  "state": "confirmed",
                  "founderSignedData": ResignCommitment
                }
                _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxData
                
                ResignBody = {                                                      //将签名与Nonce赋值给ResignBody,用于发送回签消息
                  Commitment: ResignedDataResult.signedData,
                  Nonce: ResignTxNonce,
                }

                //回签部分的交易已完成,更新通道信息
                let channelInfo = _this.$store.state.vuexStore.channelList[l];
                channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);                  //更改通道信息
                console.log(_this.$store.state.vuexStore.channelList[l]);
                _this.StoreData("channelList");                                                     //保存通道信息
                _this.getChannelBalance();                                                          //更新通道余额
                
                founderBalance = ResignFounderBalance + paymentCount;                               //更新交易数据中的Balance
                peerBalance = ResignPeerBalance - paymentCount;
              } else {
                console.log("签名验证失败");
              }
            } else {
              console.log(checkResult.type);
            }
          } else {                                              //收到的redata不含ResignBody字段
            if(checkResult.type == "ResetTxNonce"){                    //请求重设TxNonce,1-①
              console.log("nonce错误,请求重设nonce");
              nonce = checkResult.ResetTxNonce;                        //将nonce设为请求重设的nonce,用于后续签名
            } else if(checkResult.type == "Resign"){                   //请求回签,2-①
              console.log("上次交易未确认,请求回签");
              ResignBody = checkResult.ResignBody;                     
              nonce = TxNonce;                                         //将nonce设为TxNoce,用于同时回签1,2签名

              console.log(ResignBody.Nonce);
              let typeList = ['paymentCount'];
              let result = _this.getTxListInfo(channelName, ResignBody.Nonce, typeList);              //查询当前nonce的状态
              founderBalance = founderBalance - result.paymentCount;   //更新当前MessageBody中的余额(在回签的基础上)
              peerBalance = peerBalance + result.paymentCount;
            } else if (checkResult.type == "approveNonce"){            //将对端发送的TxNonce作为nonce,1-②
              console.log("对端发送的TxNonce作为nonce");
              nonce = Number(redata.TxNonce);                          //将对端发送的TxNonce作为nonce
              console.log(nonce);
              _this.updateTxListLength(channelName, nonce);         //删除多余的nonce
              console.log(_this.$store.state.vuexStore.txList);
            }
            else if (checkResult.type == "Same"){                     //状态正常,将当前TxNonce赋值给nonce
              console.log("检查正常");
              nonce = TxNonce;
            }
          }
          let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
          let dataList = [
            channelName,
            nonce,
            founderAddress,
            founderBalance,
            peerAddress,
            peerBalance,
            HashR ? HashR : "0x" + addPreZero(0,64),
            R ? R : "0x" + addPreZero(0,64)
          ];
          let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);   //签名方法
          console.log(signedDataResult.txData);
          if(signedDataResult){
            Message = {
              "MessageType": "RsmcSign",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "TxNonce": checkResult.type == "ResetTxNonce" ? redata.TxNonce :  nonce, //当type为ResetTxNonce时.TxNonce为对端发起的TxNonce
              "ChannelName": channelName,
              "NetMagic": NetMagic,
              "AssetType": assetType,
              "ResetTxNonce": checkResult.type == "ResetTxNonce" ? nonce : undefined,  //当type不为ResetTxNonce时.不带该参数
              "MessageBody": {
                PaymentCount: paymentCount,
                SenderBalance: founderBalance,
                ReceiverBalance: peerBalance,
                HashR: HashR,
                Commitment: checkResult.type == "Resign" ? undefined : signedDataResult.signedData,   //当回签时,不带普通的签名
                RoleIndex: 0,
                ResignBody: ResignBody
              },
              "Comments": redata.Comments,
              "Status": "RESPONSE_OK",
            }
            console.log(Message);
            _this.sendWebsocket(redata.Sender, Message);                       //发送websocket消息
          } else {
            console.log('签名失败');
          }

          let txListMessage = {                                                               //txData
            "state": "confirming",
            "nonce": nonce,
            "founder": founderAddress,
            "founderBalance": founderBalance,
            "peer": peerAddress,
            "peerBalance": peerBalance,
            "paymentCount": paymentCount,
            "isFounder": false,
            "founderSignedData": "",
            "peerSignedData": signedDataResult.signedData,
            "HashR": HashR ? HashR : "0x" + addPreZero(0,64),
            "R": R ? R : "0x" + addPreZero(0,64),
            "txData": signedDataResult.txData,
            //"delayBlock": DelayBlock,
            "founderDelayCommitment": "",
            "peerDelayCommitment": "",
          }
          console.log(_this.$store.state.vuexStore.txList);
          _this.newTxList(channelName, txListMessage);                                        //增加TxList信息

          let channelInfo = _this.$store.state.vuexStore.channelList[l];   
          channelInfo.TxNonce = nonce;                                      //TxNoce增加1
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
          console.log(_this.$store.state.vuexStore.channelList[l]);
          _this.StoreData("channelList");                   //保存通道信息
          _this.getChannelBalance();              //更新通道余额

          //_this.isReceiptRsmcInfoBox = false;                                                 //关闭窗口
          //_this.receiptRsmcNotify.close();                                                    //关闭Rsmc消息框
          //_this.receiptRsmcNotify = undefined;
        }
      } else if (_this.baseChain == "NEO"){
        console.log("NEO  RSMC");
        let MessageBody = redata.MessageBody;
        if(MessageBody.RoleIndex == 0){
          if(l >= 0){ 
            
            let commitment_sig,rd_sig;
            console.log(redata);
            let decryptPK;                                    //解锁钱包获得私钥
            try {
              decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
                  'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
                  'password': keyStorePass,
                  'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
              });
            } catch (e) {
              _this.$notify.error({
                  title: _this.$t('loginByKeyStore.callback-9'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('loginByKeyStore.callback-8'),
                  duration: 3000
              });
              return false;
            }
            console.log(decryptPK);

            if(redata.MessageBody.Commitment){
              commitment_sig = signatureData(redata.MessageBody.Commitment.txData, decryptPK);
            }
            if(redata.MessageBody.RevocableDelivery){
              rd_sig = signatureData(redata.MessageBody.RevocableDelivery.txData, decryptPK);
            }
            let Message = {
              "MessageType":"RsmcSign",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "ChannelName": redata.ChannelName,
              "TxNonce": redata.TxNonce,
              "MessageBody": {
                "Commitment": {
                  "txDataSign": commitment_sig,
                  "originalData": redata.MessageBody.Commitment
                },
                "RevocableDelivery": {
                  "txDataSign": rd_sig,
                  "originalData": redata.MessageBody.RevocableDelivery
                },
                "AssetType": redata.MessageBody.AssetType,
                "Value": redata.MessageBody.Value,
                "RoleIndex": redata.MessageBody.RoleIndex,
                "Comments": redata.MessageBody.Comments
                },
              }
            if(commitment_sig || rd_sig){
              _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
              console.log(Message);
            }
            
            //当RoleIndex为0时回复Rsmc同时构造Rsmc交易
            let txId, addressFunding, scriptFunding;
            console.log(_this.$store.state.vuexStore.channelList[l]);
            let selfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance).div(10e7);
            let otherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance).div(10e7);
            
            console.log(_this.$store.state.vuexStore.txList);
            _this.$store.state.vuexStore.txList.forEach(function(val,index){
              if(val.channelName == redata.ChannelName && val.history.length){
                console.log(val.history[val.history.length - 1]);
                txId = val.history[val.history.length - 1].txId;
                console.log(txId);
                addressFunding = val.history[val.history.length - 1].addressFunding;
                console.log(addressFunding);
                scriptFunding = val.history[val.history.length - 1].scriptFunding; 
                console.log(scriptFunding);
              }
            });

            axios({
              method: 'post',
              url: _this.$store.state.vuexStore.NodeRpcUri,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "FunderTransaction",    //实际为RSMCTransaction，与FunderTransaction公用一个接口方法
                "params": [ redata.Sender.split('@')[0], redata.Receiver.split('@')[0], addressFunding, scriptFunding, otherBalance, selfBalance, txId, redata.MessageBody.AssetType],
                "id": 1
              })
            }).then(function(res){
              console.log(res);
              let Message1 = {
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
              _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息
              console.log(JSON.stringify(Message1));

                //_this.BreachRemedy = res.data.result.BR_TX;
              //_this.isReceiptRsmcInfoBox = false;           //关闭窗口
              //_this.receiptRsmcNotify.close();            //关闭Rsmc消息框
            });
          }
          return false;
        }
        if (MessageBody.RoleIndex == 3 || MessageBody.RoleIndex == 2){                
          //当本端为RSMC交易发起者时，且RoleIndex为3时保存BreachRemed交易
          //当对端为RSMC交易发起者时，且RoleIndex为2时保存BreachRemed交易
          if(MessageBody.BreachRemedy){
            _this.$store.state.vuexStore.txList.forEach(function(value, index){
              if(value.channelName == redata.ChannelName){
                value.BreachRemedy = MessageBody.BreachRemedy;
                return false;
              }
            })
          }
        }
        let commitment_sig,rd_sig;
        console.log(_this.$store.state.vuexStore.txOnChannelInfo);
        let decryptPK;                                    //解锁钱包获得私钥
        try {
          decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
              'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
              'password': _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass,
              'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
          });
        } catch (e) {
          _this.$notify.error({
              title: _this.$t('loginByKeyStore.callback-9'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('loginByKeyStore.callback-8'),
              duration: 3000
          });
          return false;
        }
        console.log(decryptPK);
        if(MessageBody.Commitment){
          commitment_sig = signatureData( MessageBody.Commitment.txData, decryptPK);
        }
        if(MessageBody.RevocableDelivery){
          rd_sig = signatureData( MessageBody.RevocableDelivery.txData, decryptPK);
        }
        let Message = {
          "MessageType":"RsmcSign",
          "Sender": redata.Receiver,
          "Receiver": redata.Sender,
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
          _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
          console.log(Message);
        }
        if(MessageBody.RoleIndex == 1 || MessageBody.RoleIndex == 2){
          let BreachRemedy_sig;
          if(MessageBody.RevocableDelivery){
            BreachRemedy_sig = signatureData(_this.$store.state.vuexStore.txOnChannelInfo.BreachRemedy.txData, decryptPK);
          }
          let Message1 = {
            "MessageType": "Rsmc",
            "Sender": redata.Receiver,
            "Receiver": redata.Sender,
            "ChannelName": redata.ChannelName,
            "TxNonce": redata.TxNonce,
            "MessageBody": {
              "BreachRemedy": {
                "txDataSign": BreachRemedy_sig,
                "originalData": _this.$store.state.vuexStore.txOnChannelInfo.BreachRemedy
              },
              "AssetType": redata.MessageBody.AssetType,
              "Value": redata.MessageBody.Value,
              "RoleIndex": redata.MessageBody.RoleIndex + 1,
              "Comments": redata.MessageBody.Comments
            },
          }
          _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息
          console.log(Message1);
        }
      }
    },
    OnMesRsmcSign(redata) {           //收到RsmcSign消息
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
      if(_this.baseChain == "ETH"){
        if(redata.Status == 'RESPONSE_OK'){           //当得到RESPONSE_OK确认后,进行Rsmc
          let l = _this.getChannelSerial("ChannelName", redata.ChannelName);
          console.log(l);
          if(l >= 0){          //检测到通道
            let Message, ResignRoleIndex,
                RoleIndex = redata.MessageBody.RoleIndex,
                channelName = _this.$store.state.vuexStore.channelList[l].ChannelName,
                TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce,
                paymentCount = Number(redata.MessageBody.PaymentCount),
                founderAddress = _this.$store.state.vuexStore.walletInfo.address,
                founderBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
                peerAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
                peerBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + paymentCount,
                HashR = redata.MessageBody.HashR || "0x" + addPreZero(0,64),
                NetMagic = _this.$store.state.vuexStore.NetMagic,
                assetType = _this.$store.state.vuexStore.channelList[l].assetType,
                Commitment = redata.MessageBody.Commitment,
                keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass,
                isNonceChange = false;                                                    //用于标记TxNonce是否改变
                console.log(keyStorePass);

            if(RoleIndex == 0){         //如果不带RoleIndex,发送RsmcSign
              console.log(redata);
              if(redata.ResetTxNonce){                
                //如果消息体中带有ResetTxNonce,对端申请更改nonce
                let typeList = ['state'];
                let result =  _this.getTxListInfo(channelName, redata.ResetTxNonce, typeList);          //查询当前nonce的状态
                if(result.state == "INIT"){
                  console.log("修改nonce为" + redata.ResetTxNonce);
                  TxNonce = redata.ResetTxNonce;
                  isNonceChange = true;
                } else {
                  console.log("当前nonce禁止更改");
                }
              }
              
              let ResignedDataResult, 
                  ResignTxNonce, 
                  ResignCommitment, 
                  ResignBody, 
                  ResignFounderAddress,
                  ResignFounderBalance,
                  ResignPeerAddress, 
                  ResignPeerBalance,
                  ResignPaymentCount;
              if(redata.MessageBody.ResignBody){                    
                //如果消息体中带有ResignBody,对端请求回签,如果是,修改参数,回签上次交易
                console.log("收到对端请求回签");
                ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
                ResignCommitment = redata.MessageBody.ResignBody.Commitment;

                let typeList = ['founder', 'founderBalance', 'peer', 'peerBalance', 'paymentCount', 'isFounder','nonce', 'HashR', 'R'];
                let result =  _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
                ResignFounderAddress = result.founder;
                ResignFounderBalance = result.founderBalance;
                ResignPeerAddress = result.peer;
                ResignPeerBalance = result.peerBalance;
                ResignPaymentCount = result.paymentCount;
                let ResignOtherAddress = result.isFounder ? ResignPeerAddress : ResignFounderAddress;         //对端地址
                let ResignHashR = result.HashR;
                let ResignR = result.R;
                let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                let dataList = [channelName, ResignTxNonce, ResignFounderAddress, ResignFounderBalance, ResignPeerAddress, ResignPeerBalance, ResignHashR, ResignR];
                ResignedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法

                console.log(ResignPeerAddress.toLowerCase());
                if(ecRecover(ResignedDataResult.txData, ResignCommitment, ResignOtherAddress.toLowerCase())){       //验证签名
                  ResignBody = {
                    Commitment: ResignedDataResult.signedData,
                    Nonce: ResignTxNonce
                  }

                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": ResignCommitment
                  }
                  _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                  channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  if(result.isFounder){
                    founderBalance = founderBalance - ResignPaymentCount;
                    peerBalance = peerBalance + ResignPaymentCount;
                  } else {
                    founderBalance = founderBalance + ResignPaymentCount;
                    peerBalance = peerBalance - ResignPaymentCount;
                  }
                } else {
                  console.log("对端签名验证未通过,停止交易");
                }
              }

              let R = "0x" + addPreZero(0,64);
              if(HashR == "0x" + addPreZero(0,64)){
                //判断是否为HTLC - R交易,如果是则获取R
                //如果是普通的RSMC交易,则founder需要扣除金额,因为HTLC已经锁定那部分,所以不用扣除
                founderBalance = founderBalance - paymentCount;
              } else {
                let typeList = ['R'];
                let result =  _this.getTxListInfo(channelName, TxNonce - 1, typeList);              //取上一笔HTLC内存的R
                R = result.R;
                console.log("R:" + R);
              }

              if(Commitment){
                console.log("进入正常签名");
                // 用于回签机制时有些情况延迟签名
                // 如果MessageBody中含有对端签名,则回签
                let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                let dataList = [channelName, TxNonce, founderAddress, founderBalance, peerAddress, peerBalance, HashR, R];
                console.log(keyStorePass);
                let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法
                if(!signedDataResult){console.log('签名失败'); return false;}
                
                console.log(TxNonce);
                console.log(signedDataResult.txData);
                console.log(Commitment);
                console.log(redata.Sender.split("@")[0].toLowerCase());
              
                if(ecRecover(signedDataResult.txData, Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名
                  Message = {                     //构造RsmcSign消息体
                    "MessageType":"RsmcSign",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": TxNonce,
                    "ChannelName": channelName,
                    "NetMagic": NetMagic,
                    "AssetType": assetType,
                    "MessageBody": {
                      PaymentCount: paymentCount,
                      SenderBalance: founderBalance,
                      ReceiverBalance: peerBalance,
                      HashR: HashR,
                      R: R,
                      Commitment: signedDataResult.signedData,
                      RoleIndex: 1,
                      ResignBody: ResignBody ? ResignBody : "",
                    },
                    "Comments": redata.Comments,
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息

                  if(isNonceChange){                                                        //当对端申请修改nonce同意时,删除多余的TxList数据
                    _this.updateTxListLength(channelName, TxNonce);
                    let txListMessage1 = {                                                               //txData
                      "state": "confirming",
                      "nonce": TxNonce,
                      "founder": founderAddress,
                      "peer": peerAddress,
                      "paymentCount": paymentCount,
                      "isFounder": true,
                      "founderSignedData": "",
                      "peerSignedData": "",
                      "HashR": HashR ? HashR : "0x" + addPreZero(0,64),
                      "R": R ? R : "0x" + addPreZero(0,64),
                      "txData": signedDataResult.txData,
                      // "delayBlock":,
                      // "payment": ,
                      // "delayCommitment": ,
                    }
                    _this.newTxList(channelName, txListMessage1);                                        //增加TxList信息
                    console.log(_this.$store.state.vuexStore.txList);
                  }
                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": signedDataResult.signedData,
                    "peerSignedData": Commitment,
                    "founderBalance": founderBalance,
                    "peerBalance": peerBalance
                  }
                  console.log(txListMessage);
                  _this.updateTxList1(channelName, TxNonce, txListMessage);                  //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = founderBalance;                           //本端余额更新
                  channelInfo.OtherBalance = peerBalance;                             //对端余额更新
                  // channelInfo.TxNonce = TxNonce;                                      //TxNoce增加1
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  console.log(HashR);
                  if(HashR != addPreZero(0,64)){         //当Htlc完全结束时,停止event监听
                    _this.$store.state.vuexStore.eventList.forEach(function(data, index){
                      if(data.HashR == HashR){
                        console.log("H交易已完成,停止监听");
                        _this.$store.state.vuexStore.eventList.splice(index,1);
                        _this.StoreData("eventList");
                      }
                    })
                  }

                  if(HashR){                                                            //用于交易统计,如果带HashR,为HTLC - R交易
                    _this.$store.state.vuexStore.HTLCRNum += 1;
                  } else {                                                              //如果不带HashR,为RSMC交易
                    _this.$store.state.vuexStore.RSMCNum += 1;
                  }

                  let date = new Date().getTime();        //获取当前时间戳
                  let recordMessage = {           //构造通道record消息
                    date: date,
                    channelName: channelName,
                    name: redata.Sender.split("@")[0],
                    Amount: paymentCount,
                    assetType: assetType,
                    isOnChannel: true,
                    isPay: true,
                    state: 1,
                    isTestNet: _this.isTestNet,
                    transactionHash : "none",
                    blockHash: "none"
                  }
                  _this.$store.state.vuexStore.recordList.push(recordMessage);
                  _this.StoreData("recordList");                //保存交易记录

                  //_this.isReceiptRsmcInfoBox = false;
                  _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
                  // _this.$notify.closeAll(); 
                  _this.$notify({                 //消息提醒
                      title: _this.$t('common.success'),
                      dangerouslyUseHTMLString: true,
                      message: _this.$t('common.callback-20'),
                      duration: 3000,
                      type: 'success'
                  });
                } else {
                  console.log("对端签名验证未通过,停止交易");
                }
              } else {
                // 当对端不带签名,则为补签交易
                if(ResignBody){
                  Message = {                     //构造RsmcSign消息体
                    "MessageType":"RsmcSign",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": TxNonce,
                    "ChannelName": channelName,
                    "NetMagic": NetMagic,
                    "AssetType": assetType,
                    "MessageBody": {
                      PaymentCount: paymentCount,
                      SenderBalance: ResignFounderBalance - paymentCount,
                      ReceiverBalance: ResignPeerBalance + paymentCount,
                      HashR: HashR,
                      R: redata.MessageBody.R,
                      Commitment: "",
                      RoleIndex: 1,
                      ResignBody: ResignBody,
                    },
                    "Comments": {},
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
                }
              }
            } else if (RoleIndex == 1){       //如果RoleIndex为1,更新通道余额
              if(redata.MessageBody.ResignBody){                    
                //如果消息体中带有ResignBody,对端请求回签,如果是,修改参数,回签上次交易
                console.log("收到对端回签的消息");
                let ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
                let ResignCommitment = redata.MessageBody.ResignBody.Commitment;
                let typeList = ['txData', 'founder', 'founderBalance', 'peerBalance', 'isFounder'];
                let result =  _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
                let ResignFounderBalance = result.founderBalance;
                let ResignPeerBalance = result.peerBalance;
                let ResignPaymentCount = result.paymentCount;
                console.log(result.founder.toLowerCase());
                if(ecRecover(result.txData, ResignCommitment, result.founder.toLowerCase())){       //验证签名
                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": ResignCommitment
                  }
                  _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                  channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  founderBalance = Number(ResignFounderBalance);
                  peerBalance = Number(ResignPeerBalance);
                }
              }

              if(Commitment){
                console.log("进入正常签名");
                console.log(TxNonce);
                let typeList = ['txData'];
                let result =  _this.getTxListInfo(channelName, TxNonce, typeList);              //查询当前nonce的状态
                
                if(ecRecover(result.txData, Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名
                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  
                  channelInfo.SelfBalance = redata.MessageBody.ReceiverBalance;     //本端余额更新
                  channelInfo.OtherBalance = redata.MessageBody.SenderBalance;    //对端余额更新
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");                   //保存通道信息
                  _this.getChannelBalance();                        //更新通道余额

                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": Commitment,
                  }
                  _this.updateTxList1(channelName, TxNonce, txListMessage);                    //更新TxList

                  let date = new Date().getTime();        //获取当前时间戳
                  console.log(paymentCount);
                  let recordMessage = {           //构造通道record消息
                    date: date,
                    channelName: channelName,
                    name: redata.Sender.split("@")[0],
                    Amount: paymentCount,
                    assetType: assetType,
                    isOnChannel: true,
                    isPay: false,
                    state: 1,
                    isTestNet: _this.isTestNet,
                    transactionHash : "none",
                    blockHash: "none"
                  }
                  _this.$store.state.vuexStore.recordList.push(recordMessage);
                  _this.StoreData("recordList");                //保存交易记录

                  _this.$notify({                 //消息提醒
                    title: _this.$t('common.success'),
                    dangerouslyUseHTMLString: true,
                    message: _this.$t('common.callback-21'),
                    duration: 3000,
                    type: 'success'
                  });
                } else {
                  console.log("对端签名验证未通过,停止交易");
                  // _this.$notify({
                  //   title: _this.$t('common.warning'),
                  //   dangerouslyUseHTMLString: true,
                  //   message: _this.$t('common.verifyFail'),
                  //   duration: 3000,
                  //   type: 'error'
                  // });
                }
              } else {
                if(redata.MessageBody.ResignBody){
                  let R = "0x" + addPreZero(0,64);
                  // if(HashR == "0x" + addPreZero(0,64)){
                  //   //判断是否为HTLC - R交易,如果是则获取R
                  //   //如果是普通的RSMC交易,则founder需要扣除金额,因为HTLC已经锁定那部分,所以不用扣除
                  //   founderBalance = founderBalance - paymentCount;
                  // } else {
                  //   R = _this.getRByHashR(HashR);
                  // }
                  founderAddress = redata.Sender.split("@")[0];
                  peerAddress = redata.Receiver.split("@")[0];
                  founderBalance = founderBalance - paymentCount;
                  peerBalance = peerBalance + paymentCount;
                  let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                  let dataList = [channelName, TxNonce, founderAddress, founderBalance, peerAddress, peerBalance, HashR, R];
                  console.log(keyStorePass);
                  let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法
                  if(!signedDataResult){console.log('签名失败'); return false;}

                  Message = {                     //构造RsmcSign消息体
                    "MessageType":"RsmcSign",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": TxNonce,
                    "ChannelName": channelName,
                    "NetMagic": NetMagic,
                    "AssetType": assetType,
                    "MessageBody": {
                      PaymentCount: paymentCount,
                      SenderBalance: founderBalance,
                      ReceiverBalance: peerBalance,
                      HashR: HashR,
                      R: redata.MessageBody.R,
                      Commitment: signedDataResult.signedData,
                      RoleIndex: 0,
                    },
                    "Comments": {},
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
                }
              }
            }
          }
        } else {             //当得到非确认后,进行输出状态
          console.log(redata.Status);
        }
      } else if (_this.baseChain == "NEO"){
        console.log("NEO");
      }
    },
    OnMesAckRouterInfo(redata) {            //收到路由消息
      // console.log(redata.RouterInfo);
      let _this = this;
      if (_this.baseChain == "ETH"){
        if(redata.RouterInfo === null){               //当路由为空,返回
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: _this.$t('common.callback-22'),
            duration: 3000
          });
          _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
          return false;
        } else {                                       //当路由不为空,开始Htlc交易
          let _this = this;
          let Router = redata.RouterInfo.FullPath;

          console.log(_this.$store.state.vuexStore.txOnChannelInfo);
          if(_this.$store.state.vuexStore.txOnChannelInfo.receiverUri.split(":")[1] == _this.$store.state.vuexStore.spvPort){        //如果对端为SPV,路由首尾加上两个SPV
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
          console.log(_this.isOneStepPayment);
          console.log(_this.$store.state.vuexStore.walletInfo.keyStorePass);
          if(_this.isOneStepPayment && _this.$store.state.vuexStore.walletInfo.keyStorePass){       // 判断免密支付
            _this.sendHtlcMes();                                 //发送Htlc交易
          } else {
            _this.isFeeInfoBoxShow = true;                       //显示Fee提醒框
          }
        } 
      } else if (_this.baseChain == "NEO"){
        if(redata.RouterInfo === null){               //当路由为空,返回
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: _this.$t('common.callback-22'),
            duration: 3000
          });
          _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
          return false;
        } else {                                       //当路由不为空,开始Htlc交易
          let _this = this;
          let Router = redata.RouterInfo.FullPath;

          console.log(_this.$store.state.vuexStore.txOnChannelInfo);
          if(_this.$store.state.vuexStore.txOnChannelInfo.receiverUri.split(":")[1] == _this.$store.state.vuexStore.spvPort){        //如果对端为SPV,路由首尾加上两个SPV
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
      }
    },
    sendHtlcMes() {         //发起Htlc交易
      let _this = this;
      if (_this.baseChain == "ETH"){
      let Next = _this.$store.state.vuexStore.txOnChannelInfo.Next;
      let l = _this.getChannelSerial("OtherUri", Next, "open");       //遍历当前通道位置
      console.log(l);
      if(l >= 0){          //当l为-1时,未遍历到通道
        web3.eth.getBlockNumber().then(function(blockNumber){           //获取当前块高
          console.log(blockNumber);
          let router = _this.$store.state.vuexStore.txOnChannelInfo.Router,
              delayBlock = _this.$store.state.vuexStore.delayBlock,                   //HTLC延迟块高数(每一跳)
              DelayBlock = blockNumber + (router.length - 1) * delayBlock,            //HTLC取回块高
              channelName = _this.$store.state.vuexStore.channelList[l].ChannelName,
              TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
              founderUri = _this.$store.state.vuexStore.channelList[l].SelfUri,
              founderAddress = _this.$store.state.vuexStore.walletInfo.address,
              founderBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
              peerAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
              peerBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance),
              paymentCount = Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
              assetType = _this.$store.state.vuexStore.channelList[l].assetType,
              NetMagic = _this.$store.state.vuexStore.NetMagic,
              HashR = _this.$store.state.vuexStore.txOnChannelInfo.hr,
              keyStorePass = _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass;
              console.log(DelayBlock);
              console.log(paymentCount);

          // if(_this.isOneStepPayment && _this.$store.state.vuexStore.walletInfo.keyStorePass){
          //   keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
          // }

          // let dataTypeList_1 = ['bytes32','address','address','uint256','uint256','bytes32'];
          // let dataList_1 = [channelName, founderAddress, peerAddress, DelayBlock, paymentCount, HashR];
          // let signedDelayDataResult = _this.ecSignForTrinityContract(dataTypeList_1, dataList_1, keyStorePass);
          // _this.$store.state.vuexStore.txOnChannelInfo.delayTxData = signedDelayDataResult.txData;       //用于后续签名认证

          // let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
          // let dataList = [channelName, nonce + 1, founderAddress, founderBalance - paymentCount, peerAddress, peerBalance, "0x" + addPreZero(0,64), "0x" + addPreZero(0,64)];
          // let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法
          // _this.$store.state.vuexStore.txOnChannelInfo.txData = signedDataResult.txData;       //用于后续签名认证

          let checkResult = _this.checkHistory(channelName, TxNonce),
              ResignBody;                                                                           //用于保存回签数据
          if(checkResult.type == "Resign"){
            console.log("上次交易未确认,请求回签");
            ResignBody = checkResult.ResignBody;
            console.log(checkResult);

            let typeList = ['paymentCount'];
            let result = _this.getTxListInfo(channelName, ResignBody.Nonce, typeList);              //查询当前nonce的状态
            console.log(result.paymentCount);
            founderBalance = founderBalance + result.paymentCount;
            peerBalance = peerBalance - result.paymentCount;
            console.log(founderBalance);
            console.log(peerBalance);
          }

          let Message = {                     //构造Htlc消息体
            "MessageType": "Htlc", 
            "Sender": founderUri,
            "Receiver": Next, 
            "TxNonce": TxNonce, 
            "ChannelName": channelName,
            "AssetType": assetType, 
            "NetMagic": NetMagic,
            "Router": router,
            "Next": Next,
            "MessageBody": { 
              SenderBalance: founderBalance - paymentCount, 
              ReceiverBalance: peerBalance, 
              Commitment: "",
              Payment: paymentCount,
              DelayBlock: DelayBlock,
              DelayCommitment: "",
              HashR: HashR,
              RoleIndex: 0,
              ResignBody: ResignBody
            }
          }
          _this.sendWebsocket(Next, Message);        //发送websocket消息

          let txListMessage = {                           //txData
            "state": "INIT",
            "nonce": TxNonce,
            "founder": founderAddress,
            "founderBalance": founderBalance - paymentCount,
            "peer": peerAddress,
            "peerBalance": peerBalance,
            "paymentCount": paymentCount,
            "isFounder": true,
            "txData": "",
            "founderSignedData": "",
            "peerSignedData": "",
            "HashR": HashR,
            "R": "",
            "delayBlock": DelayBlock,
            "delayTxData": "",
            "founderDelayCommitment": "",
            "peerDelayCommitment": "",
          }
          _this.newTxList(channelName, txListMessage);           //增加TxList信息
          console.log(_this.$store.state.vuexStore.txList);
          let channelInfo = _this.$store.state.vuexStore.channelList[l];
          channelInfo.TxNonce = TxNonce;                                      //TxNoce增加1
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
          console.log(_this.$store.state.vuexStore.channelList[l].TxNonce);

          _this.isFeeInfoBoxShow = false;                   //关闭fee提醒窗口
        })
      }
      } else if (_this.baseChain == "NEO"){
        let l = _this.getChannelSerial("OtherUri", _this.$store.state.vuexStore.txOnChannelInfo.Next, "open");       //遍历当前通道位置
        console.log(l);
        if(l >= 0){          //当l>0时,遍历到通道,开始Htlc交易
          let txId, addressFunding, scriptFunding;
          console.log(_this.$store.state.vuexStore.channelList[l]);
          let selfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance).div(10e7);
          let otherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance).div(10e7);
          
          console.log(_this.$store.state.vuexStore.txList);
          _this.$store.state.vuexStore.txList.forEach(function(val,index){
            console.log(val.channelName);
            console.log(_this.$store.state.vuexStore.channelList[l].ChannelName);
            console.log(val.history.length);
            if(val.channelName == _this.$store.state.vuexStore.channelList[l].ChannelName && val.history.length){
              console.log(val.history[val.history.length - 1]);
              txId = val.history[val.history.length - 1].txId;
              console.log(txId);
              addressFunding = val.history[val.history.length - 1].addressFunding;
              console.log(addressFunding);
              scriptFunding = val.history[val.history.length - 1].scriptFunding; 
              console.log(scriptFunding);
            }
          });
          console.log(_this.$store.state.vuexStore.txOnChannelInfo);
          axios({
            method: 'post',
            url: _this.$store.state.vuexStore.NodeRpcUri,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "HTLCTransaction",
              "params": [_this.$store.state.vuexStore.NEOwalletInfo.publicKey, _this.$store.state.vuexStore.txOnChannelInfo.Next.split("@")[0], Number(_this.$store.state.vuexStore.txOnChannelInfo.value + _this.$store.state.vuexStore.txOnChannelInfo.fee).div(10e7), selfBalance, otherBalance, _this.$store.state.vuexStore.txOnChannelInfo.hr, addressFunding, scriptFunding, _this.$store.state.vuexStore.txOnChannelInfo.assetType],
              "id": 1
            })
          }).then(function(res){
            console.log(res);
            if(res){
              let Message = {
                "MessageType":"Htlc",
                "Sender": _this.$store.state.vuexStore.channelList[l].SelfUri,
                "Receiver": _this.$store.state.vuexStore.txOnChannelInfo.Next,
                "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
                "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
                "Router": _this.$store.state.vuexStore.txOnChannelInfo.Router,
                "Next": _this.$store.state.vuexStore.txOnChannelInfo.Next,
                "MessageBody": {
                  "HCTX": res.data.result.HCTX,
                  "RDTX": res.data.result.RDTX,
                  "HEDTX": res.data.result.HEDTX,
                  "HTTX": res.data.result.HTTX,
                  "HTDTX": res.data.result.HTDTX,
                  "HTRDTX": res.data.result.HTRDTX,
                  "RoleIndex": 0,
                  "Comments": "",
                  "Count": Number(_this.$store.state.vuexStore.txOnChannelInfo.value + _this.$store.state.vuexStore.txOnChannelInfo.fee).div(10e7),
                  "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
                  "HashR": _this.$store.state.vuexStore.txOnChannelInfo.hr
                }
              }
              _this.sendWebsocket(_this.$store.state.vuexStore.txOnChannelInfo.Next, Message);        //发送websocket消息
              console.log(JSON.stringify(Message));

              _this.isFeeInfoBoxShow = false;                   //关闭fee提醒窗口
            }
          })
        }
      }
    },
    OnMesHtlc(redata) {         //收到Htlc消息
      // 收到的消息体
      // { 
      //   "MessageType": "Htlc", 
      //   "Sender": _this.$store.state.vuexStore.channelList[l].SelfUri, 
      //   "Receiver": Next, 
      //   "TxNonce": nonce + 1, 
      //   "ChannelName": channelName,
      //   "AssetType": assetType, 
      //   "NetMagic": NetMagic,
      //   "Router": router,
      //   "Next": Next,
      //   "MessageBody": { 
      //     SenderBalance: founderBalance - paymentCount, 
      //     ReceiverBalance: peerBalance, 
      //     Commitment: "",
      //     Payment: paymentCount,
      //     DelayBlock: DelayBlock,
      //     DelayCommitment: "",
      //     HashR: HashR,
      //     RoleIndex: 0
      //   }
      // }
      var _this = this;
      if (_this.baseChain == "ETH"){
        let l = _this.getChannelSerial("ChannelName", redata.ChannelName, 'open');      //获取所需的channel在List的位置
        if(l >= 0){             //找到通道,进行交易
          let channelName = redata.ChannelName,
              TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
              founderAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
              founderBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance),
              peerAddress = _this.$store.state.vuexStore.walletInfo.address,
              peerBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
              paymentCount = Number(redata.MessageBody.Payment),
              HashR = redata.MessageBody.HashR,
              R = "0x" + addPreZero(0,64),
              DelayBlock = redata.MessageBody.DelayBlock,
              keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass,
              nonce;
          console.log(paymentCount);

          let checkResult = _this.checkHistory(channelName, redata.TxNonce);          //检查历史记录
          let ResignBody;                                                             //申明变量,用于赋值回签数据
          if(redata.MessageBody.ResignBody){                                          //如果收到的redata含ResignBody字段
            let ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
            checkResult = _this.checkHistory(channelName, ResignTxNonce);             //检查请求回签的Nonce历史记录
            if (checkResult.type == "approveNonce" || redata.TxNonce - ResignTxNonce == 1){
              //当Rmsc带有ResignBody字段,
              //且Resign的交易状态为"INIT",
              //且TxNonce比ResignTxNonce只大1,
              //则同时回签1,2的签名,2-②
              console.log("同时回签1,2的签名");
              nonce = TxNonce;                    //将TxNonce赋值给nonce,用于回签2的签名
              let ResignCommitment = redata.MessageBody.ResignBody.Commitment;                      //对端回签的签名,用于后续认证
              let typeList = ['founder', 'founderBalance', 'peer', 'peerBalance', 'isFounder','nonce', 'HashR', 'R'];
              let result = _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
              let ResignFounderAddress = result.founder;
              let ResignFounderBalance = result.founderBalance;
              let ResignPeerAddress = result.peer;
              let ResignPeerBalance = result.peerBalance;
              let ResignOtherAddress = result.isFounder ? ResignPeerAddress : ResignFounderAddress;
              let ResignHashR = result.HashR;
              let ResignR = result.R;

              let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
              let dataList = [channelName, ResignTxNonce, ResignFounderAddress, ResignFounderBalance, ResignPeerAddress, ResignPeerBalance, ResignHashR, ResignR];
              let ResignedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);   //签名1的数据
              console.log(ResignOtherAddress.toLowerCase());
              if(ecRecover(ResignedDataResult.txData, ResignCommitment, ResignOtherAddress.toLowerCase())){    //验证对端ReSign的签名
                let txListMessage = {                           //申明需要更新的txData
                  "state": "confirmed",
                  "founderSignedData": ResignCommitment
                }
                _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxData
                
                ResignBody = {                                                      //将签名与Nonce赋值给ResignBody,用于发送回签消息
                  Commitment: ResignedDataResult.signedData,
                  Nonce: ResignTxNonce,
                }

                //回签部分的交易已完成,更新通道信息
                let channelInfo = _this.$store.state.vuexStore.channelList[l];
                channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);                  //更改通道信息
                console.log(_this.$store.state.vuexStore.channelList[l]);
                _this.StoreData("channelList");                                                     //保存通道信息
                _this.getChannelBalance();                                                          //更新通道余额
                
                founderBalance = ResignFounderBalance + paymentCount;                               //更新交易数据中的Balance
                peerBalance = ResignPeerBalance - paymentCount;
              } else {
                console.log("签名验证失败");
              }
            } else {
              console.log(checkResult.type);
            }
          } else {                                              //收到的redata不含ResignBody字段
            if(checkResult.type == "ResetTxNonce"){                    //请求重设TxNonce,1-①
              console.log("nonce错误,请求重设nonce");
              nonce = checkResult.ResetTxNonce;                        //将nonce设为请求重设的nonce,用于后续签名
            } else if (checkResult.type == "Resign"){                   //请求回签,2-①
              console.log("上次交易未确认,请求回签");
              ResignBody = checkResult.ResignBody;                     
              nonce = TxNonce;                                         //将nonce设为TxNoce,用于同时回签1,2签名

              console.log(ResignBody.Nonce);
              let typeList = ['paymentCount'];
              let result = _this.getTxListInfo(channelName, ResignBody.Nonce, typeList);              //查询当前nonce的状态
              founderBalance = founderBalance - result.paymentCount;   //更新当前MessageBody中的余额(在回签的基础上)
              peerBalance = peerBalance + result.paymentCount;
            } else if (checkResult.type == "approveNonce"){            //将对端发送的TxNonce作为nonce,1-②
              console.log("对端发送的TxNonce作为nonce");
              nonce = Number(redata.TxNonce);                          //将对端发送的TxNonce作为nonce
              console.log(nonce);
              _this.updateTxListLength(channelName, nonce);         //删除多余的nonce
              console.log(_this.$store.state.vuexStore.txList);
            } else if (checkResult.type == "Same"){                     //状态正常,将当前TxNonce赋值给nonce
              console.log("检查正常");
              nonce = TxNonce;
            }
          }

          let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
          let dataList = [channelName, nonce, founderAddress, founderBalance - paymentCount, peerAddress, peerBalance, "0x" + addPreZero(0,64), R];
          let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法

          let dataTypeList_1 = ['bytes32','address','address','uint256','uint256','bytes32'];
          let dataList_1 = [channelName, founderAddress, peerAddress, DelayBlock, paymentCount, HashR];
          let signedDelayDataResult = _this.ecSignForTrinityContract(dataTypeList_1, dataList_1, keyStorePass);

          let Message = {                     
            "MessageType": "HtlcSign", 
            "Sender": redata.Receiver,
            "Receiver": redata.Sender,
            "TxNonce": checkResult.type == "ResetTxNonce" ? redata.TxNonce : nonce, //当type为ResetTxNonce时.TxNonce为对端发起的TxNonce
            "ChannelName": channelName,
            "AssetType": redata.AssetType,
            "ResetTxNonce": checkResult.type == "ResetTxNonce" ? nonce : undefined,  //当type不为ResetTxNonce时.不带该参数
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "Router": redata.Router,
            "Next": redata.Sender,
            "MessageBody": { 
              SenderBalance: founderBalance - paymentCount, 
              ReceiverBalance: peerBalance,
              Commitment: checkResult.type == "Resign" ? undefined : signedDataResult.signedData,   //当回签时,不带普通的签名
              Payment: paymentCount,
              DelayBlock: DelayBlock,
              DelayCommitment: checkResult.type == "Resign" ? undefined : signedDelayDataResult.signedData,   //当回签时,不带普通的签名
              HashR: HashR,
              ResignBody: ResignBody,
              RoleIndex: 0
            },
            "Comments": {},
            "Status": "RESPONSE_OK",
          }
          _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息

          let txListMessage = {                           //txData
            "state": "INIT",
            "nonce": nonce,
            "founder": founderAddress,
            "founderBalance": founderBalance - paymentCount,
            "peer": peerAddress,
            "peerBalance": peerBalance,
            "paymentCount": paymentCount,
            "isFounder": false,
            "txData": signedDataResult.txData,
            "founderSignedData": "",
            "peerSignedData": signedDataResult.signedData,
            "delayBlock": DelayBlock,
            "payment": paymentCount,
            "HashR": HashR,
            "R": R,
            "delayTxData": signedDelayDataResult.txData,
            "founderDelayCommitment": "",
            "peerDelayCommitment": signedDelayDataResult.signedData, 
          }
          _this.newTxList(channelName, txListMessage);                       //更新TxList

          let channelInfo = _this.$store.state.vuexStore.channelList[l];   
          channelInfo.TxNonce = nonce;                                      //TxNoce增加1
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
          console.log(_this.$store.state.vuexStore.channelList[l]);
          _this.StoreData("channelList");                   //保存通道信息
          _this.getChannelBalance();              //更新通道余额
        }
      } else if (_this.baseChain == "NEO"){
        let MessageBody = redata.MessageBody;
        let RoleIndex = MessageBody.RoleIndex;
        let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
        if(RoleIndex == 0 && l >= 0){
          let MessageBody = redata.MessageBody;
          let RoleIndex = MessageBody.RoleIndex;

          let decryptPK;                                    //解锁钱包获得私钥
          try {
            decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
                'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
                'password': keyStorePass,
                'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
            });
          } catch (e) {
            _this.$notify.error({
                title: _this.$t('loginByKeyStore.callback-9'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('loginByKeyStore.callback-8'),
                duration: 3000
            });
            return false;
          }
          console.log(decryptPK);

          let HCTX_sig,HTTX_sig,HTDTX_sig,HTRDTX_sig,RDTX_sig;
          if(MessageBody.HCTX){
            HCTX_sig = signatureData( MessageBody.HCTX.txData, decryptPK);
            console.log("HCTX_sig:" + HCTX_sig);
          }
          if(MessageBody.HTTX){
            HTTX_sig = signatureData( MessageBody.HTTX.txData, decryptPK);
            console.log("HTTX_sig:" + HTTX_sig);
          }
          if(MessageBody.HTDTX){
            HTDTX_sig = signatureData( MessageBody.HTDTX.txData, decryptPK);
            console.log("HTDTX_sig:" + HTDTX_sig);
          }
          if(MessageBody.HTRDTX){
            HTRDTX_sig = signatureData( MessageBody.HTRDTX.txData, decryptPK);
            console.log("HTRDTX_sig:" + HTRDTX_sig);
          }
          if(MessageBody.RDTX){
            RDTX_sig = signatureData( MessageBody.RDTX.txData, decryptPK);
            console.log("RDTX_sig:" + RDTX_sig);
          }
            let Message = {
              "MessageType": "HtlcSign",
              "Sender": redata.Receiver,
              "Receiver": redata.Sender,
              "TxNonce": redata.TxNonce,
              "ChannelName": redata.ChannelName,
              "Router": redata.Router,
              "Next":redata.Next,
              "MessageBody": {
                "HCTX": {
                  "txDataSign": HCTX_sig,
                  "originalData": MessageBody.HCTX,
                },
                "RDTX": {
                  "txDataSign": RDTX_sig,
                  "originalData": MessageBody.RDTX,
                },
                "HTTX": {
                  "txDataSign": HTTX_sig,
                  "originalData": MessageBody.HTTX,
                },
                "HTRDTX": {
                  "txDataSign": HTRDTX_sig,
                  "originalData": MessageBody.HTRDTX,
                },
                "HEDTX": MessageBody.HEDTX,
                "RoleIndex": MessageBody.RoleIndex,
                "Comments": "",
                "Count": MessageBody.Count,
                "AssetType": MessageBody.AssetType,
                "HashR": MessageBody.HashR
              }
            }
            _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
            console.log(Message);
            // 增加htlc回馈,当RoleIndex为0时，构造Htlc交易
            let txId, addressFunding, scriptFunding;
            console.log(_this.$store.state.vuexStore.channelList[l]);
            let selfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance).div(10e7);
            let otherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance).div(10e7);
            
            console.log(_this.$store.state.vuexStore.txList);
            _this.$store.state.vuexStore.txList.forEach(function(val,index){
              if(val.channelName == redata.ChannelName && val.history.length){
                console.log(val.history[val.history.length - 1]);
                txId = val.history[val.history.length - 1].txId;
                console.log(txId);
                addressFunding = val.history[val.history.length - 1].addressFunding;
                console.log(addressFunding);
                scriptFunding = val.history[val.history.length - 1].scriptFunding; 
                console.log(scriptFunding);
              }
            });

            axios({
              method: 'post',
              url: _this.$store.state.vuexStore.NodeRpcUri,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "HTLCTransaction",
                "params": [_this.$store.state.vuexStore.NEOwalletInfo.publicKey, redata.Sender.split("@")[0], MessageBody.Count, selfBalance, otherBalance, MessageBody.HashR, addressFunding, scriptFunding, MessageBody.AssetType],
                "id": 1
              })
            }).then(function(res){
              console.log(res);
              let HETX_sig = signatureData(res.data.result.HETX.txData, decryptPK);
              let HERDTX_sig = signatureData(res.data.result.HERDTX.txData, decryptPK);
              let Message1 = {
                "MessageType":"Htlc",
                "Sender": redata.Receiver,
                "Receiver": redata.Sender,
                "TxNonce": redata.TxNonce,
                "ChannelName": redata.ChannelName,
                "Router": redata.Router,
                "Next": redata.Next,
                "MessageBody": {
                  "HCTX": res.data.result.HCTX,
                  "RDTX": res.data.result.RDTX,
                  "HTDTX": res.data.result.HTDTX,
                  "HETX":{
                    "txDataSign": HETX_sig,
                    "originalData": res.data.result.HETX,
                  },
                  "HERDTX":{
                    "txDataSign": HERDTX_sig,
                    "originalData": res.data.result.HERDTX,
                  },
                  "RoleIndex": MessageBody.RoleIndex + 1,
                  "Comments": "",
                  "Count": MessageBody.Count,
                  "AssetType": MessageBody.AssetType,
                  "HashR": MessageBody.HashR
                }
              }
              _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息
              console.log(Message1);
            })
        } else if(RoleIndex == 1  && l >= 0){
          console.log("收到roleindex为1的HTLC,回签");
          // ChannelName: "330ff0171b2caac72cf366e9db2bd019"
          // MessageBody: {
          //   AssetType: "TNC"
          //   Comments: ""
          //   Count: 1.01
          //   HCTX: …
          //   HERDTX: …
          //   HETX: …
          //   HTDTX: …
          //   RDTX: …
          //   HashR: "6d03524851ff7b7e1c25c9a7907e11fa26cc5aa26e82ec4ab5581b6a1bb90789"
          //   RoleIndex: 1
          // }
          // MessageType: "Htlc"
          // Next: "02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089"
          // Receiver: "0205a56b5d84614808280bf29f42d4cb17fbf410dac322530eeeeb50dbd75a3b03@10.211.55.3:8766"
          // Router: [["0205a56b5d84614808280bf29f42d4cb17fbf410dac322530eeeeb50dbd75a3b03@10.211.55.3:8766", 0],…]
          // Sender: "02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089"
          // TxNonce: 0
          console.log(_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);
          
          let decryptPK;                                    //解锁钱包获得私钥
          try {
            decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
                'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
                'password': _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass,
                'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
            });
          } catch (e) {
            _this.$notify.error({
                title: _this.$t('loginByKeyStore.callback-9'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('loginByKeyStore.callback-8'),
                duration: 3000
            });
            return false;
          }
          console.log(decryptPK);

          let HCTX_sig,HTTX_sig,HTDTX_sig,HTRDTX_sig,RDTX_sig;
          if(MessageBody.HCTX){
            HCTX_sig = signatureData( MessageBody.HCTX.txData, decryptPK);
            console.log("HCTX_sig:" + HCTX_sig);
          }
          if(MessageBody.HTTX){
            HTTX_sig = signatureData( MessageBody.HTTX.txData, decryptPK);
            console.log("HTTX_sig:" + HTTX_sig);
          }
          if(MessageBody.HTDTX){
            HTDTX_sig = signatureData( MessageBody.HTDTX.txData, decryptPK);
            console.log("HTDTX_sig:" + HTDTX_sig);
          }
          if(MessageBody.HTRDTX){
            HTRDTX_sig = signatureData( MessageBody.HTRDTX.txData, decryptPK);
            console.log("HTRDTX_sig:" + HTRDTX_sig);
          }
          if(MessageBody.RDTX){
            RDTX_sig = signatureData( MessageBody.RDTX.txData, decryptPK);
            console.log("RDTX_sig:" + RDTX_sig);
          }
          let Message = {
            "MessageType": "HtlcSign",
            "Sender": redata.Receiver,
            "Receiver": redata.Sender,
            "TxNonce": redata.TxNonce,
            "ChannelName": redata.ChannelName,
            "Router": redata.Router,
            "Next": redata.Next,
            "MessageBody": {
              "HCTX": {
                "txDataSign": HCTX_sig,
                "originalData": MessageBody.HCTX,
              },
              "RDTX": {
                "txDataSign": RDTX_sig,
                "originalData": MessageBody.RDTX,
              },
              "HTDTX": {
                "txDataSign": HTDTX_sig,
                "originalData": MessageBody.HTDTX,
              },
              "HETX": MessageBody.HETX,
              "HERDTX": MessageBody.HERDTX,
              "RoleIndex": MessageBody.RoleIndex,
              "Comments": "",
              "Count": MessageBody.Count,
              "AssetType": MessageBody.AssetType,
              "HashR": MessageBody.HashR
            }
          }
          _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
          console.log(Message);
        }
      }
    },
    OnMesHtlcSign(redata) {                     //收到HtlcSign消息
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
      if(_this.baseChain == "ETH"){
        if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
          console.log(redata);
          let l = _this.getChannelSerial("ChannelName", redata.ChannelName);
          console.log(l);
          if(l >= 0){          //检测到通道
            let Message,
                RoleIndex = redata.MessageBody.RoleIndex,
                channelName = _this.$store.state.vuexStore.channelList[l].ChannelName,
                TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce,
                paymentCount = redata.MessageBody.Payment,
                NetMagic = _this.$store.state.vuexStore.NetMagic,
                assetType = _this.$store.state.vuexStore.channelList[l].assetType,
                DelayBlock = redata.MessageBody.DelayBlock,
                Commitment = redata.MessageBody.Commitment,
                DelayCommitment = redata.MessageBody.DelayCommitment,
                keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass,
                Router = redata.Router,
                HashR = redata.MessageBody.HashR,
                R = "0x" + addPreZero(0,64),
                isNonceChange = false;                                                    //用于标记TxNonce是否改变

            if(RoleIndex == 0){         //如果RoleIndex为0,本端为founder,回复HtlcSign
              if(redata.ResetTxNonce){                
                //如果消息体中带有ResetTxNonce,对端申请更改nonce
                let typeList = ['state'];
                let result =  _this.getTxListInfo(channelName, redata.ResetTxNonce, typeList);          //查询当前nonce的状态
                if(result.state == "INIT"){
                  console.log("修改nonce为" + redata.ResetTxNonce);
                  TxNonce = redata.ResetTxNonce;
                  isNonceChange = true;
                } else {
                  console.log("当前nonce禁止更改");
                }
              }

              let ResignedDataResult, 
                  ResignTxNonce, 
                  ResignCommitment, 
                  ResignBody, 
                  ResignFounderAddress,
                  ResignFounderBalance,
                  ResignPeerAddress, 
                  ResignPeerBalance,
                  ResignPaymentCount;
              if(redata.MessageBody.ResignBody){                    
                //如果消息体中带有ResignBody,对端请求回签,如果是,修改参数,回签上次交易
                console.log("收到对端请求回签");
                ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
                ResignCommitment = redata.MessageBody.ResignBody.Commitment;

                let typeList = ['founder', 'founderBalance', 'peer', 'peerBalance', 'paymentCount', 'isFounder','nonce', 'HashR', 'R'];
                let result =  _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
                ResignFounderAddress = result.founder;
                ResignFounderBalance = result.founderBalance;
                ResignPeerAddress = result.peer;
                ResignPeerBalance = result.peerBalance;
                ResignPaymentCount = result.paymentCount;
                let ResignOtherAddress = result.isFounder ? ResignPeerAddress : ResignFounderAddress;         //对端地址
                let ResignHashR = result.HashR;
                let ResignR = result.R;
                let dataTypeList_resign = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                let dataList_resign = [channelName, ResignTxNonce, ResignFounderAddress, ResignFounderBalance, ResignPeerAddress, ResignPeerBalance, ResignHashR, ResignR];
                ResignedDataResult = _this.ecSignForTrinityContract(dataTypeList_resign, dataList_resign, keyStorePass);     //签名方法

                console.log(ResignPeerAddress.toLowerCase());
                if(ecRecover(ResignedDataResult.txData, ResignCommitment, ResignOtherAddress.toLowerCase())){       //验证签名
                  ResignBody = {
                    Commitment: ResignedDataResult.signedData,
                    Nonce: ResignTxNonce
                  }

                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": ResignCommitment
                  }
                  _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                  channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  if(result.isFounder){
                    founderBalance = founderBalance - ResignPaymentCount;
                    peerBalance = peerBalance + ResignPaymentCount;
                  } else {
                    founderBalance = founderBalance + ResignPaymentCount;
                    peerBalance = peerBalance - ResignPaymentCount;
                  }
                } else {
                  console.log("对端签名验证未通过,停止交易");
                }
              }

              if(Commitment){
                console.log("进入正常签名");
                // 用于回签机制时有些情况延迟签名
                // 如果MessageBody中含有对端签名,则回签
                let founderAddress = _this.$store.state.vuexStore.walletInfo.address;
                let founderBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance);
                let peerAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0];
                let peerBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
                
                let dataTypeList_delay = ['bytes32','address','address','uint256','uint256','bytes32'];
                let dataList_delay = [channelName, founderAddress, peerAddress, DelayBlock, paymentCount, HashR];
                let signedDelayDataResult = _this.ecSignForTrinityContract(dataTypeList_delay, dataList_delay, keyStorePass);
                _this.$store.state.vuexStore.txOnChannelInfo.delayTxData = signedDelayDataResult.txData;       //用于后续签名认证

                let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                let dataList = [channelName, TxNonce, founderAddress, founderBalance - paymentCount, peerAddress, peerBalance, "0x" + addPreZero(0,64), R];
                let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法
                _this.$store.state.vuexStore.txOnChannelInfo.txData = signedDataResult.txData;       //用于后续签名认证

                if(!signedDataResult || !signedDelayDataResult){console.log('签名失败');return false;}

                console.log(signedDataResult.txData);
                console.log(Commitment);
                console.log(redata.Sender.split("@")[0].toLowerCase());
                console.log(signedDelayDataResult.txData);
                console.log(DelayCommitment);
                console.log(ecRecover(signedDataResult.txData, Commitment, peerAddress.toLowerCase()));
                console.log(ecRecover(signedDelayDataResult.txData, DelayCommitment, peerAddress.toLowerCase()));
                if(ecRecover(signedDataResult.txData, Commitment, peerAddress.toLowerCase()) && ecRecover(signedDelayDataResult.txData, DelayCommitment, peerAddress.toLowerCase())){          //验证签名
                  let Message = {                     //构造Htlc消息体
                    "MessageType": "HtlcSign", 
                    "Sender": redata.Receiver, 
                    "Receiver": redata.Sender, 
                    "TxNonce": TxNonce, 
                    "ChannelName": channelName,
                    "AssetType": assetType, 
                    "NetMagic": NetMagic,
                    "Router": Router,
                    "Next": redata.Sender,
                    "MessageBody": { 
                      SenderBalance: founderBalance - paymentCount, 
                      ReceiverBalance: peerBalance, 
                      Commitment: signedDataResult.signedData,
                      Payment: paymentCount,
                      DelayBlock: DelayBlock,
                      DelayCommitment: signedDelayDataResult.signedData,
                      HashR: HashR,
                      RoleIndex: 1,
                      ResignBody: ResignBody ? ResignBody : undefined,
                    },
                    "Comments": {},
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息

                  if(isNonceChange){                                                        //当对端申请修改nonce同意时,删除多余的TxList数据
                    _this.updateTxListLength(channelName, TxNonce);
                    let txListMessage1 = {                                                               //txData
                      state: "confirming",
                      nonce: TxNonce,
                      founder: founderAddress,
                      peer: peerAddress,
                      paymentCount: paymentCount,                      
                      isFounder: true,
                      txData: signedDataResult.txData,
                      founderSignedData: "",
                      peerSignedData: "",
                      HashR: HashR ? HashR : "0x" + addPreZero(0,64),
                      R: R ? R : "0x" + addPreZero(0,64),
                      delayBlock: DelayBlock,
                      founderDelayCommitment: "",
                      peerDelayCommitment: "",
                    }
                    _this.newTxList(channelName, txListMessage1);                                        //增加TxList信息
                    console.log(_this.$store.state.vuexStore.txList);
                  }
                  let txListMessage = {                           //txData
                    state: "confirmed",
                    founderSignedData: signedDataResult.signedData,
                    peerSignedData: Commitment,
                    founderBalance: founderBalance - paymentCount,
                    peerBalance: peerBalance,
                    founderDelayCommitment: signedDelayDataResult.signedData,
                    peerDelayCommitment: DelayCommitment
                  }
                  _this.updateTxList1(channelName, TxNonce, txListMessage);                     //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = founderBalance - paymentCount;     //本端余额更新
                  channelInfo.OtherBalance = peerBalance;    //对端余额更新
                  channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();                //更新通道余额

                  let date = new Date().getTime();        //获取当前时间戳
                  let recordMessage = {                   //构造通道record消息
                    date: date,
                    channelName: channelName,
                    name: redata.Sender.split("@")[0],
                    Amount: paymentCount,
                    assetType: assetType,
                    isOnChannel: true,
                    isPay: true,
                    state: 1,
                    isTestNet: _this.isTestNet,
                    transactionHash : "none",
                    blockHash: "none"
                  }
                  _this.$store.state.vuexStore.recordList.push(recordMessage);
                  _this.StoreData("recordList");                //保存交易记录

                  let typeList = ['founder', 'founderBalance', 'peer', 'peerBalance', 'paymentCount', 'founderDelayCommitment', 
                    'peerDelayCommitment', 'delayBlock', 'HashR', 'R'];
                  let result =  _this.getTxListInfo(channelName, TxNonce, typeList);              //查询当前nonce的状态
                  let eventMessage = {                                            //构造event消息
                    "messageType": "monitorSendUnlockAmount", 
                    "baseChain": "ETH", 
                    "channelName": channelName,
                    "blockNumber": DelayBlock,
                    "HashR": HashR,
                    "data": result, 
                  }
                  _this.$store.state.vuexStore.eventList.push(eventMessage);      //加入event监控
                  _this.StoreData("eventList");

                  _this.$store.state.vuexStore.txOnChannelInfo = [];      //清空交易信息
                  // _this.$notify({                 //消息提醒
                  //     title: _this.$t('common.success'),
                  //     dangerouslyUseHTMLString: true,
                  //     message: _this.$t('common.callback-20'),
                  //     duration: 3000,
                  //     type: 'success'
                  // });
                } else {
                  console.log("对端签名验证未通过,停止交易");
                  _this.$notify({
                    title: _this.$t('common.warning'),
                    dangerouslyUseHTMLString: true,
                    message: _this.$t('common.verifyFail'),
                    duration: 3000,
                    type: 'error'
                  });
                }
              } else {
                // 当对端不带签名,则为补签交易
                if(ResignBody){
                  Message = {                     //构造Htlc消息体
                    "MessageType": "HtlcSign", 
                    "Sender": redata.Receiver, 
                    "Receiver": redata.Sender, 
                    "TxNonce": TxNonce, 
                    "ChannelName": channelName,
                    "AssetType": assetType, 
                    "NetMagic": NetMagic,
                    "Router": Router,
                    "Next": redata.Sender,
                    "MessageBody": { 
                      SenderBalance: founderBalance - paymentCount, 
                      ReceiverBalance: peerBalance, 
                      Commitment: "",
                      Payment: paymentCount,
                      DelayBlock: DelayBlock,
                      DelayCommitment: "",
                      HashR: HashR,
                      RoleIndex: 1,
                      ResignBody: ResignBody,
                    },
                    "Comments": {},
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
                }
              }
            } else if (RoleIndex == 1){              //如果RoleIndex为1,对端为founder,结束Htlc交易
              if(redata.MessageBody.ResignBody){                    
                //如果消息体中带有ResignBody,对端请求回签,如果是,修改参数,回签上次交易
                console.log("收到对端回签的消息");
                let ResignTxNonce = redata.MessageBody.ResignBody.Nonce;
                let ResignCommitment = redata.MessageBody.ResignBody.Commitment;
                let ResignDelayCommitment = redata.MessageBody.ResignBody.DelayCommitment;
                let typeList = ['txData', 'delayTxData', 'founder', 'founderBalance', 'peerBalance', 'isFounder'];
                let result =  _this.getTxListInfo(channelName, ResignTxNonce, typeList);              //查询当前nonce的状态
                let ResignFounderBalance = result.founderBalance;
                let ResignPeerBalance = result.peerBalance;
                let ResignPaymentCount = result.paymentCount;

                console.log(result.founder.toLowerCase());
                console.log(ecRecover(result.txData, ResignCommitment, result.founder.toLowerCase()));
                console.log(ecRecover(result.delayTxData, ResignDelayCommitment, result.founder.toLowerCase()));
                if(ecRecover(result.txData, ResignCommitment, result.founder.toLowerCase()) && ecRecover(result.delayTxData, ResignDelayCommitment, result.founder.toLowerCase())){       //验证签名
                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": ResignCommitment,
                    "founderDelaySignedData": ResignDelayCommitment
                  }
                  _this.updateTxList1(channelName, ResignTxNonce, txListMessage);                  //更新TxList

                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.SelfBalance = ResignFounderBalance;                                     //本端余额更新
                  channelInfo.OtherBalance = ResignPeerBalance;                                       //对端余额更新
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  founderBalance = Number(ResignFounderBalance);
                  peerBalance = Number(ResignPeerBalance);
                }
              }

              if(Commitment){
                //let founderAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0];
                // let founderBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
                // let peerAddress = _this.$store.state.vuexStore.walletInfo.address;
                // let peerBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance);
                let typeList = ['founder', 'founderBalance', 'peerBalance', 'isFounder', 'txData', 'delayTxData'];
                let result = _this.getTxListInfo(channelName, TxNonce, typeList);
                console.log(TxNonce);
                console.log(result);

                console.log(ecRecover(result.txData, Commitment, result.founder.toLowerCase()));
                console.log(ecRecover(result.delayTxData, DelayCommitment, result.founder.toLowerCase()))
                if(ecRecover(result.txData, Commitment, result.founder.toLowerCase()) && ecRecover(result.delayTxData, DelayCommitment, result.founder.toLowerCase())){                                            //验证签名成功时,更新交易数据
                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  console.log(result.isFounder);
                  if(result.isFounder){
                    channelInfo.SelfBalance = founderBalance;                          //本端余额更新
                    channelInfo.OtherBalance = peerBalance;
                  } else {
                    console.log(result.founderBalance);
                    console.log(result.peerBalance);
                    channelInfo.SelfBalance = result.peerBalance;                          //本端余额更新
                    channelInfo.OtherBalance = result.founderBalance;
                  }
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l]);
                  _this.StoreData("channelList");           //保存通道信息
                  _this.getChannelBalance();              //更新通道余额

                  let txListMessage = {                           //txData
                    "state": "confirmed",
                    "founderSignedData": Commitment,
                    "founderDelayCommitment": DelayCommitment,
                  }
                  console.log(txListMessage);
                  _this.updateTxList1(channelName, TxNonce, txListMessage);                    //更新TxList

                  let R = "";           //获取HashR所对应的R
                  R = _this.getRByHashR(HashR);

                  console.log("此处回复RResponse");
                  let RRMessage = {
                    "MessageType":"RResponse",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": redata.TxNonce,
                    "ChannelName": channelName,
                    "AssetType": assetType,
                    "NetMagic": NetMagic,
                    "Router": redata.Router,
                    "Next": redata.Next,
                    "MessageBody": {
                      "RoleIndex": 0,
                      "Comments": "",
                      "PaymentCount": paymentCount,
                      "AssetType": assetType,
                      "R": R,
                      "HashR": HashR
                    }
                  }
                  _this.sendWebsocket(redata.Sender, RRMessage);        //发送websocket消息
                } else {
                  console.log("对端签名验证未通过,停止交易");
                }
              } else {
                if(redata.MessageBody.ResignBody){
                  let R = "0x" + addPreZero(0,64);
                  // if(HashR == "0x" + addPreZero(0,64)){
                  //   //判断是否为HTLC - R交易,如果是则获取R
                  //   //如果是普通的RSMC交易,则founder需要扣除金额,因为HTLC已经锁定那部分,所以不用扣除
                  //   founderBalance = founderBalance - paymentCount;
                  // } else {
                  //   R = _this.getRByHashR(HashR);
                  // }
                  founderAddress = redata.Sender.split("@")[0];
                  peerAddress = redata.Receiver.split("@")[0];
                  founderBalance = founderBalance - paymentCount;
                  peerBalance = peerBalance;
                  console.log(keyStorePass);
                  let dataTypeList_delay = ['bytes32','address','address','uint256','uint256','bytes32'];
                  let dataList_delay = [channelName, founderAddress, peerAddress, DelayBlock, paymentCount, HashR];
                  let signedDelayDataResult = _this.ecSignForTrinityContract(dataTypeList_delay, dataList_delay, keyStorePass);
                  _this.$store.state.vuexStore.txOnChannelInfo.delayTxData = signedDelayDataResult.txData;       //用于后续签名认证

                  let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
                  let dataList = [channelName, TxNonce, founderAddress, founderBalance - paymentCount, peerAddress, peerBalance, "0x" + addPreZero(0,64), R];
                  let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, keyStorePass);     //签名方法
                  _this.$store.state.vuexStore.txOnChannelInfo.txData = signedDataResult.txData;       //用于后续签名认证

                  if(!signedDataResult || !signedDelayDataResult){console.log('签名失败');return false;}

                  Message = {                     //构造Htlc消息体
                    "MessageType": "HtlcSign", 
                    "Sender": redata.Receiver, 
                    "Receiver": redata.Sender, 
                    "TxNonce": TxNonce, 
                    "ChannelName": channelName,
                    "AssetType": assetType, 
                    "NetMagic": NetMagic,
                    "Router": Router,
                    "Next": redata.Sender,
                    "MessageBody": { 
                      SenderBalance: founderBalance - paymentCount, 
                      ReceiverBalance: peerBalance, 
                      Commitment: signedDataResult.signedData,
                      Payment: paymentCount,
                      DelayBlock: DelayBlock,
                      DelayCommitment: "",
                      HashR: HashR,
                      RoleIndex: 0
                    },
                    "Comments": {},
                    "Status": "RESPONSE_OK",
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
                }
              }
            }
          }
        } else {                  //当Status不为OK时,删除通道
          console.log(redata.Status);
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: redata.Status,
            duration: 3000
          });
         }
      } else if (_this.baseChain == "NEO"){
        let l = _this.getChannelSerial("ChannelName", redata.ChannelName, 'open', false);
        let MessageBody = redata.MessageBody;
        let channelInfo = _this.$store.state.vuexStore.channelList[l];
        //channelInfo.OtherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - (Number(_this.activeInfo.redata.PaymentCount));                        //更新对端余额
        channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息

        if(MessageBody.RoleIndex == 1){
          let R = "";           //获取HashR所对应的R
          console.log("HashR:" + redata.MessageBody.HashR);
          R = _this.getRByHashR(HashR);
          console.log("此处回复RResponse");
          if(R){} else {
            return;
          }
          let Message1 = {
            "MessageType": "RResponse",
            "Sender": redata.Receiver,
            "Receiver": redata.Sender,
            "TxNonce": redata.TxNonce,
            "ChannelName": redata.ChannelName,
            "Router": redata.RouterInfo,
            "Next": redata.Next,
            "MessageBody": {
              "RoleIndex": 0,
              "Comments": "",
              "Count": redata.MessageBody.Count,
              "AssetType": redata.MessageBody.AssetType,
              "R": R,
              "HR": redata.MessageBody.HashR
            }
          }
          _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息
        }  
      }
    }, 
    OnMesRResponse(redata) {                  //收到RResponse消息
      var _this = this;
      if(_this.baseChain == "ETH"){
        let ReceiveR = redata.MessageBody.R;
        let hr = web3.utils.keccak256(ReceiveR);          //sha3 Hash处理
        let channelName = redata.ChannelName;
        console.log(hr);
        console.log(redata.MessageBody.HashR);

        _this.$store.state.vuexStore.txList.forEach(function(data, index){
          if(data.channelName == channelName){
            data.history.forEach(function(data1, index1){
              if(data1.HashR == hr){
                console.log("进入R交易");
                let MessageBody = redata.MessageBody;

                let txListMessage = {                           //txData
                  "R": redata.MessageBody.R,
                }
                _this.updateTxList(channelName, txListMessage, redata.MessageBody.HashR);                        //更新TxList
                
                let l = _this.getChannelSerial("ChannelName", channelName, "open");
                if(l >= 0){              //当l为正确值时
                  console.log(l);
                  let TxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce;
                  let founderBalance = Number(data1.founderBalance);
                  let peerBalance = Number(data1.peerBalance);
                  let paymentCount = Number(data1.paymentCount);
                  let NetMagic = _this.$store.state.vuexStore.NetMagic;

                  console.log(_this.$store.state.vuexStore.txOnChannelInfo);
                  let Message = {                           //回复RResponseAck
                    "MessageType":"RResponseAck",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": TxNonce,
                    "ChannelName": channelName,
                    "NetMagic": NetMagic,
                    "AssetType": redata.AssetType,
                    "MessageBody": {
                      "HashR": redata.MessageBody.HashR,
                      "R": redata.MessageBody.R,
                      "PaymentCount": paymentCount
                    },
                    "Comments": {}
                  }
                  _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息

                  let Message1 = {    
                    "MessageType":"Rsmc",
                    "Sender": redata.Receiver,
                    "Receiver": redata.Sender,
                    "TxNonce": TxNonce,
                    "ChannelName": channelName,
                    "NetMagic": NetMagic,
                    "AssetType": redata.AssetType,
                    "MessageBody": {
                      "PaymentCount": paymentCount,
                      "SenderBalance": founderBalance,
                      "ReceiverBalance": peerBalance + paymentCount,
                      "HashR": redata.MessageBody.HashR,
                      "R": redata.MessageBody.R,
                      "Commitment": ""
                    },
                    "Comments": {}
                  }
                  _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息

                  let txListMessage = {                           //txData
                    "state": "INIT",
                    "nonce": TxNonce,
                    "founder": redata.Receiver.split("@")[0],
                    "founderBalance": founderBalance,
                    "peer": redata.Sender.split("@")[0],
                    "peerBalance": peerBalance + paymentCount,
                    "paymentCount": paymentCount,
                    "isFounder": true,
                    "founderSignedData": "",
                    "peerSignedData": "",
                    "HashR": redata.MessageBody.HashR,
                    "R": redata.MessageBody.R,
                  }
                  _this.newTxList(channelName, txListMessage);           //增加TxList信息
                  console.log(_this.$store.state.vuexStore.txList);
                  let channelInfo = _this.$store.state.vuexStore.channelList[l];
                  channelInfo.TxNonce = TxNonce;                                      //TxNoce增加1
                  Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
                  console.log(_this.$store.state.vuexStore.channelList[l].TxNonce);
                  _this.StoreData("channelList");           //保存通道信息                                
                }
              }
            })
          }
        })
      } else if (_this.baseChain == "NEO"){
        let hr = createHr(redata.MessageBody.R);
        console.log(hr);
        console.log(redata.MessageBody.HR);
        if(hr == redata.MessageBody.HR){
          console.log("进入R交易");
          let l = _this.getChannelSerial("ChannelName",redata.ChannelName);

          let txId, addressFunding, scriptFunding;
          console.log(_this.$store.state.vuexStore.channelList[l]);
          let selfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance).div(10e7);
          let otherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance).div(10e7);
          
          console.log(_this.$store.state.vuexStore.txList);
          _this.$store.state.vuexStore.txList.forEach(function(val,index){
            if(val.channelName == redata.ChannelName && val.history.length){
              console.log(val.history[val.history.length - 1]);
              txId = val.history[val.history.length - 1].txId;
              console.log(txId);
              addressFunding = val.history[val.history.length - 1].addressFunding;
              console.log(addressFunding);
              scriptFunding = val.history[val.history.length - 1].scriptFunding; 
              console.log(scriptFunding);
            }
          });

          axios({
            method: 'post',
            url: _this.$store.state.vuexStore.NodeRpcUri,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "FunderTransaction",    //实际为RSMCTransaction，与FunderTransaction公用一个接口方法
              "params": [redata.Sender.split('@')[0], _this.$store.state.vuexStore.NEOwalletInfo.publicKey, addressFunding, scriptFunding, otherBalance, selfBalance, txId, redata.MessageBody.AssetType],
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
                  "AssetType": redata.MessageBody.AssetType,
                  "Value": redata.MessageBody.Count,
                  "RoleIndex": 0,
                  "Comments": redata.MessageBody.HR
              }
            }
            _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
            console.log(Message);

            _this.$store.state.vuexStore.txOnChannelInfo.BreachRemedy = res.data.result.BR_TX;
              
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
      }
    },
    OnMesSettle(redata) {           //收到Settle消息
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
      // Receiver:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      // Sender:"0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089"
      // TxNonce:4294967295
      // }
      var _this = this;
      console.log(redata);
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l >= 0){
        let channelName = redata.ChannelName;
        let keyStore = _this.$store.state.vuexStore.walletInfo.keyStore;
        let keyStorePass = _this.$store.state.vuexStore.walletInfo.keyStorePass;
        let founderAddress = _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0];
        let founderBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
        let peerAddress = _this.$store.state.vuexStore.walletInfo.address;
        let peerBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance);

        if(redata.SenderBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance && redata.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance){      //判断通道余额是否正确
          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: channelName},                                                                //通道名称
              {t: 'uint256', v: 0},                                                                          //快速关通道,TXnonce为0
              {t: 'address', v: founderAddress},                                                             //founder地址
              {t: 'uint256', v: founderBalance},                                                             //founder余额
              {t: 'address', v: peerAddress},                                                                //peer地址
              {t: 'uint256', v: peerBalance}                                                                 //peer余额
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(keyStore, keyStorePass);                                   //解锁钱包用于签名          
          let selfSignedData = ecSign(txData, decryptPK.privateKey);                                          //对交易数据进行签名
          console.log(selfSignedData); 

          let Message = {                           //构造SettleSign消息
              MessageType: "SettleSign",
              NetMagic: redata.NetMagic,
              Receiver: redata.Sender,
              Sender: redata.Receiver,
              ChannelName: redata.ChannelName,
              AssetType: redata.AssetType,
              MessageBody:{
                Commitment: selfSignedData
              },
              Status:"RESPONSE_OK",
              TxNonce: 0,
          }
          _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息

        } else {
            console.log('error submit!!');
            return false;
        }
      }
    },
    async OnMesSettleSign(redata) {
      // 收到的消息体
      // {
      //   ChannelName:"0xf21a712999ee0e477065df49433b0ea1a6f55c77a28b4a621dae0431d67b35e6"
      //   MessageBody:{
      //   AssetType: "TNC"
      //   Commitment: "0x4b2eb00ceba91f3b413fede38d79da4a207c731780248421aa8e5d36131b9fec6cda84872bcd8a93dccb7ce2bb58b995f276ca5243c56982b6ff21c5d005732901"
      //   MessageType: "FounderSign"
      //   NetMagic: "191919191919"
      //   Receiver: "0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      //   Sender: "0xD65Af7686F87e04C1e1578A1076b60f2B6D8a66D@106.15.91.150:8089"
      //   Status:"RESPONSE_OK"
      //   TxNonce:0
      // }
      var _this = this;
      if(_this.baseChain == "ETH"){
        if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
          console.log(_this.$store.state.vuexStore.closeChannelInfo.txData);
          let channelName = _this.$store.state.vuexStore.closeChannelInfo.ChannelName;
          if(ecRecover(_this.$store.state.vuexStore.closeChannelInfo.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名成功时,查询对端余额和Approve情况
                
            let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes','bytes']; 
            let dataList = [
              channelName, 
              0, 
              _this.$store.state.vuexStore.walletInfo.address, 
              Number(_this.$store.state.vuexStore.closeChannelInfo.SelfBalance),
              _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0], 
              Number(_this.$store.state.vuexStore.closeChannelInfo.OtherBalance), _this.$store.state.vuexStore.closeChannelInfo.selfSignedData, 
              redata.MessageBody.Commitment
            ];
            let signedData = await _this.signDataForERC20Contract(_this.trinityContractAddress, "quickCloseChannel", dataTypeList, dataList, _this.$store.state.vuexStore.closeChannelInfo.keyStorePass);               //签名
            console.log(signedData);

            let date = new Date().getTime();        //获取当前时间戳
            web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
              if (!err) {
                console.log(hash);
                _this.$notify({
                    title: _this.$t('common.success'),
                    dangerouslyUseHTMLString: true,
                    message: _this.$t('common.callback-14'),
                    duration: 3000,
                    type: 'success'
                });
                let recordMessage = {           //构造链上record消息
                  date: date,
                  channelName: channelName,
                  name: _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0],
                  Amount: _this.$store.state.vuexStore.closeChannelInfo.SelfBalance,
                  assetType: 'TNC',
                  isOnChannel: true,
                  isPay: true,
                  state: 0,
                  isTestNet: _this.isTestNet,
                  transactionHash : hash,
                  blockHash: ""
                }
                _this.$store.state.vuexStore.recordList.push(recordMessage);
                let recordMessage1 = {           //构造通道record消息
                  date: date,
                  name: _this.trinityContractAddress,
                  Amount: _this.$store.state.vuexStore.closeChannelInfo.SelfBalance,
                  assetType: 'TNC',
                  isOnChannel: false,
                  isPay: false,
                  state: 0,
                  isTestNet: _this.isTestNet,
                  transactionHash : hash,
                  blockHash: ""
                }
                _this.$store.state.vuexStore.recordList.push(recordMessage1);
                _this.StoreData("recordList");
                _this.cycleGetTransactionReceipt(hash);
              } else {
                console.log(err)
              }
            });
          } else {
            console.log("对端签名验证未通过,停止交易");
            _this.$notify({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.verifyFail'),
              duration: 3000,
              type: 'error'
            });
          }
        } else {
          console.log(redata.Status);
        }
      } else if (_this.baseChain == "NEO"){
        console.log(_this.$store.state.vuexStore.closeChannelInfo.witness);
        let witness1 = _this.$store.state.vuexStore.closeChannelInfo.witness.replace('{signSelf}', _this.$store.state.vuexStore.closeChannelInfo.selfSignedData);
        let witness2 = witness1.replace('{signOther}', redata.MessageBody.Settlement.txDataSign);
        let witness = _this.$store.state.vuexStore.closeChannelInfo.txData + witness2;

        axios({
          method: 'post',
          url: _this.$store.state.vuexStore.NodeRpcUri,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "sendRawTx",
            "params": [witness],
            "id": 1
          })
        }).then(function(res){
          console.log(res);
          if(res.data.result == "true"){
              // console.log( _this.ChannelItems);
            //   _this.ChannelItems.forEach(function(val,index){
            //   //  console.log(val.ChannelName);
            //   //  console.log(redata.ChannelName);
            //   if(val.ChannelName === redata.ChannelName){
            //         // console.log(redata.ChannelName);
            //         _this.$set(val,'Flag',1);
            //     }
            // })
            _this.$notify({
                title: _this.$t('common.success'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-14'),
                duration: 3000,
                type: 'success'
            });
          } else {
            console.log(res.data);
          }
        })
      }
    },
    OnMesDeleteChannel(redata) {
      //收到的消息体
      // {
      // AssetType:"TNC"
      // MessageBody:{
      //   Balance:{
      //     0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866: {…}, 0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089: {…}
      //   },
      //   ChannelName:"0xb1d29d209662ce95a6af188110332c1de2bfe180ab9e6d2156856b0b46042dc7",
      //   Founder:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866",
      //   Receiver:"0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089"
      // },
      // MessageType:"DeleteChannel"
      // NetMagic:"527465737419990331"
      // }
      let _this = this;
      if(_this.baseChain == "ETH"){
        //以全节点为准

        // let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName); //获取所需的channel在List的位置
        // _this.$notify({
        //     title: _this.$t('common.success'),
        //     dangerouslyUseHTMLString: true,
        //     message: _this.$t('common.callback-23'),
        //     duration: 3000,
        //     type: 'success'
        // });
        // _this.$store.state.vuexStore.channelList.splice(l,1);

        // _this.StoreData("channelList");                   //储存通道信息
        // _this.getChannelBalance();              //更新通道余额
      } else if (_this.baseChain == "NEO"){
        console.log("NEO删除通道");
        // {
        // Magic: "195378745719990331"
        // MessageBody: {
        // Balance: {0327bc2ad3908093d389c015b761c363549dc0e3b93525079966fab2308cba4c85@10.211.55.3:8766: {TNC: 10},…}
        // 02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089: {TNC: 10}
        // TNC: 10
        // 0327bc2ad3908093d389c015b761c363549dc0e3b93525079966fab2308cba4c85@10.211.55.3:8766: {TNC: 10}
        // TNC: 10
        // ChannelName: "c3cadd404e0e952cd657acac25ef071b"
        // }
        // Founder: "0327bc2ad3908093d389c015b761c363549dc0e3b93525079966fab2308cba4c85@10.211.55.3:8766"
        // Receiver: "02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089"
        // MessageType: "DeleteChannel"
        // }
        let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName); //获取所需的channel在List的位置
        _this.$notify({
          title: _this.$t('common.success'),
          dangerouslyUseHTMLString: true,
          message: _this.$t('common.callback-23'),
          duration: 3000,
          type: 'success'
        });
        _this.$store.state.vuexStore.channelList.splice(l,1);

        _this.StoreData("channelList");                   //储存通道信息
        _this.getChannelBalance();              //更新通道余额
      }
    },
    OnMesChannelInfo(redata) {
      // let _this = this;
      // for(var i = 0; i < redata.Peers.length; i ++){  
      //    _this.ChannelItems.forEach(function(data,index){
      //     if(data.Url.split("@")[0] === redata.Peers[i]){
      //       data.Flag = 4;
      //       data.oldFlag = 5;
      //     }
      //   })
      // }
    },
    OnMesFounder (redata){                          //NEO
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
      // Receiver:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      // Sender:"0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089"
      // TxNonce:4294967295
      // }
      var _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName);      //获取所需的channel在List的位置
      console.log(_this.$store.state.vuexStore.addChannelInfo);
      if(l >= 0){
        let decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
          'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
          'password': _this.$store.state.vuexStore.addChannelInfo.keyStorePass,
          'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
        });
        let MessageBody = redata.MessageBody;
        _this.$store.state.vuexStore.addChannelInfo.selfSignedData = signatureData( MessageBody.Founder.txData, decryptPK);    //保存本端签名信息,用于后续上链
        let commitment_sig = signatureData( MessageBody.Commitment.txData, decryptPK);
        let rd_sig = signatureData( MessageBody.RevocableDelivery.txData, decryptPK);
        let Message = {
          "MessageType":"FounderSign",
          "Sender": redata.Receiver,
          "Receiver": redata.Sender,
          "ChannelName": redata.ChannelName,
          "TxNonce": redata.TxNonce,
          "MessageBody": {
            "Founder": {
              "txDataSign": _this.$store.state.vuexStore.addChannelInfo.selfSignedData,
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
        _this.sendWebsocket(redata.Sender, Message);        //发送websocket消息
        axios({
          method: 'post',
          url: _this.$store.state.vuexStore.NodeRpcUri,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "FunderTransaction",
            "params": [redata.Sender.split("@")[0], redata.Receiver.split("@")[0], MessageBody.Founder.addressFunding, MessageBody.Founder.scriptFunding, redata.MessageBody.Deposit, redata.MessageBody.Deposit, MessageBody.Founder.txId,redata.MessageBody.AssetType],
            "id": 1
          })
        }).then(function(res){
          let Message1 = {
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
          _this.sendWebsocket(redata.Sender, Message1);        //发送websocket消息
          _this.$store.state.vuexStore.addChannelInfo.txId = MessageBody.Founder.txId;
          _this.$store.state.vuexStore.addChannelInfo.addressFunding = MessageBody.Founder.addressFunding;
          _this.$store.state.vuexStore.addChannelInfo.scriptFunding = MessageBody.Founder.scriptFunding;
        });
        _this.$store.state.vuexStore.channelList[l].transactionHash = MessageBody.Founder.txId;
        // _this.TxList.push(MessageBody);
        // _this.StoreFounder();
      }
    },
    OnMesUpdateChannel(redata) {
      // {
      //   Magic: "195378745719990331"
      //   MessageBody: {
      //   Balance:{
      //       "02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089":{
      //         TNC: 10
      //       },
      //       "034832f5149a18cf9b24c12b2117b42cd0d677fdd3c5a959c99d587f5b9ac6b078@10.211.55.3:8766":{
      //         TNC: 10
      //       }
      //   },
      //   ChannelName: "24cfd8920b486884c1ac9f9e65513c4b",
      //   Founder: "034832f5149a18cf9b24c12b2117b42cd0d677fdd3c5a959c99d587f5b9ac6b078@10.211.55.3:8766",
      //   Receiver: "02f6b9c6fa0bb4bf6c7f7cf8e3c49c867c76ac7990616dbcfa71b6866b2e6b8200@10.211.55.3:8089",
      //   MessageType: "UpdateChannel"
      // }
      var _this = this;
      if (_this.baseChain == "NEO"){
        let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName, 'open', false);      //获取所需的channel在List的位置
        let channelInfo = _this.$store.state.vuexStore.channelList[l]; 
        let SelfUri = channelInfo.SelfUri;
        let OtherUri = channelInfo.OtherUri;
              
        channelInfo.SelfBalance = Number(redata.MessageBody.Balance[SelfUri].TNC).mul(10e7);     //本端余额更新
        channelInfo.OtherBalance = Number(redata.MessageBody.Balance[OtherUri].TNC).mul(10e7);    //对端余额更新
        channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(_this.$store.state.vuexStore.channelList[l]);

        _this.$notify({                 //消息提醒
          title: _this.$t('common.success'),
          dangerouslyUseHTMLString: true,
          message: "余额更新",
          duration: 3000,
          type: 'success'
        });
      }
    },
    OnMesRegisterChannelFail(redata) {
      let _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName);      //获取所需的channel在List的位置
      if(l >= 0){
        _this.$store.state.vuexStore.channelList.splice(l,1);
        _this.StoreData("channelList");                   //储存通道信息
        _this.getChannelBalance();              //更新通道余额
        _this.$notify.error({
            title: _this.$t('common.warning'),
            message: redata.Error,
            duration: 3000
        });
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
          // _this.$notify.error({
          //     title: _this.$t('common.warning'),
          //     dangerouslyUseHTMLString: true,
          //     message: '未找到该通道,请重试一次',
          //     duration: 3000
          // });
          return;
      } else {
        _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: Ip + _this.$t('common.callback-24'),
            duration: 3000
        });
        let channelInfo = _this.$store.state.vuexStore.channelList[l];
        channelInfo.isConnect = false;
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
        // setTimeout(function () {
        //   _this.reconnectWebsocket(Ip + ":8866",_this.$store.state.vuexStore.channelList[l].ChannelName);
        // }, 3000);
      }
    },
    reconnectWebsocket (Ip, channelName){                       //重连websocket方法
      let _this = this;

      const wsuri = "ws://" + Ip + ":" + _this.$store.state.vuexStore.spvPort + "/";
      var l = _this.getChannelSerial('ChannelName', channelName);
      console.log(l);
      if(l >= 0){             //如果未检测到通道,给出提醒
        var webSocketInfo = {
          "Ip": Ip,
          "websock": new WebSocket(wsuri)
        }
        webSocketInfo.websock.onmessage = _this.websocketOnmessage;
        webSocketInfo.websock.onclose = _this.websocketClose;
        console.log(webSocketInfo);

        if(_this.$store.state.vuexStore.webSocketList.length){
          _this.$store.state.vuexStore.webSocketList.forEach(function(data, index){           //遍历websocket列表
            if(data.Ip == Ip && data.websock != ""){
              console.log("websocket已存在,不重复连接");
              return false;
            } else {
              _this.$store.state.vuexStore.webSocketList.push(webSocketInfo);
            }
          })
        } else {
          _this.$store.state.vuexStore.webSocketList.push(webSocketInfo);
        }
        _this.$store.state.vuexStore.channelList[l].isConnect = true;                         //修改channel连接状态

        let Message = {
          MessageType: "GetChannelInfo", 
          Sender: _this.$store.state.vuexStore.channelList[l].SelfUri,
          Magic: _this.$store.state.vuexStore.NetMagic,
          MessageBody:{
            "AssetType": "TNC"
          }
        }
        setTimeout(function (){
          _this.sendWebsocket(_this.$store.state.vuexStore.channelList[l].SelfUri, Message);        //发送websocket消息
        },2000);
      }
      
      console.log(_this.$store.state.vuexStore.webSocketList);
    },
    StoreData(dataType) {              //储存数据通用方法
      let walletAddress = this.$store.state.vuexStore.walletInfo.address;
      if(this.baseChain == "NEO"){
        walletAddress = this.$store.state.vuexStore.NEOwalletInfo.address;
      }
      console.log(this.$store.state.vuexStore[dataType]);
      this.saveAsArray(walletAddress + "@" + dataType,this.$store.state.vuexStore[dataType]);
    },
    newTxList(channelName, data) {  //更新TxList,参数1为通道名称,参数2为更新的json数据, 参数3选填,用于更新H交易数据
      let _this = this;
      _this.$store.state.vuexStore.txList.forEach(function(value, index){
        if(value.channelName == channelName){
            console.log("增加交易数据");
            value.history.push(data);
            console.log(value.history);
        }
        _this.StoreData("txList");
      })
    },
    updateTxList(channelName, data, HashR) {          
      let _this = this;
      _this.$store.state.vuexStore.txList.forEach(function(value, index){
        if(value.channelName == channelName){
          console.log("更新H交易数据");
          value.history.forEach(function(value1, index){
            if(value1.HashR == HashR){
              for (var key in data) {
                value1[key] = data[key];
              }
            }
          })
        }
      })
      _this.StoreData("txList");
    },
    updateTxList1(channelName, nonce, data){                                    //更新TxList数据,后期和上面方法合并
      let _this = this;
      _this.$store.state.vuexStore.txList.forEach(function(value, index){
        if(value.channelName == channelName){
          for (var key in data) {
            value.history[nonce][key] = data[key];
          }
          console.log(value.history[nonce]);
        }
      })
      _this.StoreData("txList");
    },
    updateTxListLength(channelName, length) {                                   //删除多余的TxList,用于对端申请修改nonce
      let _this = this;
      _this.$store.state.vuexStore.txList.forEach(function(value, index){
        if(value.channelName == channelName){
          value.history.length = length * 1;
          console.log(value.history);
          return false;
        }
      })
      _this.StoreData("txList");
    },
    getTxListInfo(channelName, nonce, typeList) {
      let _this = this;
      let result = {};
      _this.$store.state.vuexStore.txList.forEach(function(data, index){
        if(data.channelName == channelName){
          console.log("找到数据");
          console.log(data.history);
          console.log(nonce);
          console.log(data.history[nonce]);
          for (var key in typeList) {
            result[typeList[key]] = data.history[nonce][typeList[key]];
          }
          return;
        }
      })
      return result;
    },
    checkHistory(channelName, nonce) {                                    //交易时检查历史记录
      let _this = this;
      let l = _this.getChannelSerial('ChannelName', channelName);
      let localTxNonce = _this.$store.state.vuexStore.channelList[l].TxNonce * 1;
      let result = {};
      console.log(nonce);
      _this.$store.state.vuexStore.txList.forEach(function(data, index){
        if(data.channelName == channelName){
          console.log(data.history);
          if(localTxNonce + 1 == nonce){                        //当nonce相同时,判断上一笔交易是否已经完成
            console.log("nonce相同");
            if(data.history[localTxNonce].state == "INIT"){           //判断交易是否完成,如果未完成,发送交易请求回签
              console.log("上笔交易为INIT状态,直接替换数据");
              result = {
                type: "approveNonce",
                nonce: nonce
              }
            } else if (data.history[localTxNonce].state == "confirming"){
              console.log("上笔交易为comfirming状态,请求回签");
              let data1 = data.history[localTxNonce];
              let signedData = data1.isFounder ? data1.founderSignedData : data1.peerSignedData;
              let delayCommitment = data.isFounder ? data1.founderDelayCommitment : data1.peerDelayCommitment;
              result = {
                type: "Resign",
                ResignBody: {
                  Nonce: localTxNonce,
                  Commitment: signedData, 
                  DelayCommitment: delayCommitment 
                }
              }
            } else if (data.history[localTxNonce].state == "confirmed"){
              console.log("数据正确");
              result.type = "Same";
            }
          } else {
            console.log("nonce不相同,请求更新nonce");
            if(localTxNonce + 1 > nonce){
              result = {
                type: "approveNonce",
                nonce: nonce
              }
            } else {
              result.type = "ResetTxNonce";
              result.ResetTxNonce = localTxNonce + 1;
            }
          }
        }
      })
      console.log(result);
      return result;
    },
    getRByHashR(HashR) {                                                  //在HashR和R列表中找到HashR对应的R
      let R;
      this.$store.state.vuexStore.RList.forEach(function(data,index){
      if(data.Hr === HashR){
          console.log(data.Hr);
          R = data.R
        }
      });
      console.log("R:" + R);
      return R;
    },
    browserRedirect() {                                                   //判断当前运行的系统
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      //跳转移动端页面
        console.log("手机端");
        this.$store.state.vuexStore.isMobile = true;
      } else {
      //跳转pc端页面
        console.log("PC端");
        this.$store.state.vuexStore.isMobile = false;
      }
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%; 
  overflow: hidden;
  /* font-size: 62.5%; */
  -webkit-tap-highlight-color:transparent;
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
  /* background:url(./../static/img/bg.jpg);    
  background-image: url(/static/img/bg.100bd93.jpg);
  background-repeat: repeat;
  background-size: 40%; */
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
.align-center{
  text-align: center;
}
.btncopy{
  width: 80%;
}
/* 通用标题栏样式开始 */
.headBox{
    height: 44px;
    /* width: 100%; */
    background-color: RGBA(56, 56, 59, 0.97);
    /* padding: 15px 20px; */
    /* box-sizing: border-box; */
    display: flex;
    color: #FFFFFF;
    padding: 0 20px;
    padding-top: 20px !important;
}
.header-button{
    flex: .5;
    width: 100%;
    max-width: 70px;
    font-size: 26px;
    height: 44px;
    line-height: 44px;
}
.headBox h1{
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.header-button p{
    font-size: 13px;
    line-height: 44px;
    margin: 0;
}
/* 通用列表显示被tabbar阻挡问题 */
.listUl li:last-child{
  margin-bottom: 56px !important;
}
/* 通用标题样式 */
.title_h2{
    margin: 0;
    font-size: 18px;
}
/* 通用buttonBox i样式 */
.buttonBox{
  text-align: center; 
  padding: 12px 0 20px;
}
.buttonBox i{
  color:#FFFFFF;
  width: 50px;
  height: 50px;
  line-height: 52px;
  font-size: 25px;
  text-align: center; 
  border-radius: 50%; 
}
.el-icon-ETH-shoukuan, .el-icon-ETH-daima{
    background: #FF7600;
}
.el-icon-ETH-fukuan, .el-icon-ETH-mima{
    background: #00B3EA;
}
.is-left{
  float: left;
}
.is-right{
  float: left;
}
/* 通用标题栏样式结束 */
.el-badge__content.is-fixed {             /* footer栏消息标记位置调整 */
  top: 8px;
}
/* .rightBox{
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  transition:ease 0.7s;
  position: absolute;
  right: 0;
  z-index: 2;
} */
/* 手机端默认隐藏Nav */
/* @media screen and (min-width: 320px) and (max-width: 1024px) {
  .tabbar{
    right: -300px;
  }
} */
/* PC端默认显示Nav */
/* @media screen and (min-width: 1025px) {
  .rightBox{
    width: calc(100% - 300px);
  }
  .fullPage{
    width: 100% !important;
    right: 0 !important;
  }
} */

/* 返回开始界面样式 */
.backToStartBtn{        
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  text-decoration: underline;
}
/* 通用表单label样式 */
.el-form-item__label {
    font-size: 13px;
    line-height: 24px;
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
.el-notification {              /* 消息弹窗居中 */  
  width: calc(100% - 32px);
}
.el-dialog--center .el-dialog__body {
  word-wrap: break-word;
  word-break: break-all;
  padding: 10px 25px 0px;
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
/* 通用加载页面icon大小 */
.el-loading-spinner .el-icon-loading {
  font-size: 22px;
}
/* 添加通道页面滑动条更改z-index,用于修复channel页面层级错误问题 */
.el-slider__button-wrapper {
    z-index: 97;
}
/* 链上转账滑动条样式 */
.transferOnChainForm .el-slider__runway, .transferOnChainForm .el-slider__bar {
    height: 2px;
}
.transferOnChainForm .el-slider__button-wrapper {
    top: -17px;
}
/* 设置页面cell */
.cell{
  background-color: #FFFFFF;
  box-sizing: border-box;
  color: inherit;
  min-height: 48px;
  display: block;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  border-top: 1px solid #EEEEEE;
}
.cell:last-child{
  border-bottom: 1px solid #EEEEEE;
}
.cell.cell-hover:hover{
  background-color: #E5E5E5;
}
.cell-wrapper {
  background-size: 120% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-origin: content-box;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  line-height: 1;
  min-height: inherit;
  overflow: hidden;
  padding: 0 20px;
  width: 100%;
}
.cell-title {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.cell-text{
    vertical-align: middle;
    font-size: 14px;
}
.cell-right {
  color: #888;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.cell-right i{
  font-size: 14px;
}
/* 通用右侧进出动画开始 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.3s linear;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
}
.slide-right-enter-to {
  opacity: 1;
}
.slide-right-leave-active {
  transform: translateX(0);
}
.slide-right-leave-to{
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(0);
}
/* .slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: transform 0.3s linear;
  position: absolute;
}
*/
/*.slide-right-enter-active {
  opacity: 1;
}
.slide-right-enter-to{
  opacity: 1;
} 
.slide-right-leave-active {
  transform: translate3d(0, 0, 0);
}
.slide-right-leave-to{
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter-active {
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter-to{
  transform: translate3d(0, 0, 0);
}
.slide-left-leave-active {
  opacity: 1;
}
.slide-left-leave-to {
  opacity: 1;
} */
/* 通用右侧进出动画结束 */
/* 通用Hr样式 */
hr{
   height:2px;
   border:none;
   border-top:2px dotted #EBEEF5;
}

</style>
