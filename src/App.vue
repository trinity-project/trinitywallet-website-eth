<template>
  <div id="app" class="clearfloat appBox">
    <div style="position: relative;margin: 0 auto;width: 100%;max-width: 1400px;height: 100%;">
      <div v-if="$store.state.vuexStore.isNavShow" @click="closeNav()" @touchstart.capture="touchStart" @touchend.capture="touchEnd" class="mask"></div>
      <div @touchstart.capture="touchStart" @touchend.capture="touchEnd" class="rightBox">
          <transition-group :name="transitionName" mode="in-out"> 
            <router-view key="router-box"/>
          </transition-group> 
          <footer-box/>
      </div>
      <channel/>
      <notify/>
      <head-nav/>
        <el-dialog :title="$t('common.attention')" :visible.sync="isFeeInfoBoxShow" width="30%" center>
          <span>{{ $t('common.fee-1') }}<b style="color:#F56C6C">{{ $store.state.vuexStore.txOnChannelInfo.fee / 10e7 }}{{ $store.state.vuexStore.txOnChannelInfo.assetType }}</b>{{ $t('common.fee-2') }}</span><br>
          <el-tooltip class="item" effect="dark" :content="$t('common.whyFeeTips')" placement="top">
            <span style="margin-top:20px;display: inline-block;text-decoration: underline;">{{ $t('common.whyFee') }}</span>
          </el-tooltip>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendHtlcMes()">{{ $t('common.continue') }}</el-button>
            <el-button @click="isFeeInfoBoxShow = false">{{ $t('common.cancel') }}</el-button>
          </span>
        </el-dialog>
        <el-dialog class="receiptRsmcInfoBox" :title="$t('common.receive')" :visible.sync="isReceiptRsmcInfoBox" width="30%" center :modal-append-to-body='false'>                    <!--  回复Rsmc消息框 -->
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
        <el-dialog class="receiptHtlcInfoBox" :title="$t('common.receive')" :visible.sync="isReceiptHtlcInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  回复Htlc消息框 -->
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
        <el-dialog class="settleInfoBox" :title="$t('common.closeChannel')" :visible.sync="isSettleInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  回复Settle消息框 -->
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
        <el-dialog class="settleInfoBox" :title="$t('common.forceCloseChannel')" :visible.sync="isSettleTransactionInfoBox" width="30%" center :modal-append-to-body='false'>                       <!--  Settle块高到达消息框 -->
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
        <el-dialog class="settleInfoBox" title="发送制裁交易" :visible.sync="isUpdateTransactionInfoBox" width="30%" center :modal-append-to-body='false'>                                <!--  制裁交易消息框 -->
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
        <el-dialog class="SendUnlockAmountInfoBox" title="申请解冻资产" :visible.sync="isSendUnlockAmountInfoBox" width="30%" center :modal-append-to-body='false'>                                <!--  申请解冻资产消息框 -->
          <span>HTLC到达指定块高仍未收到R,正在申请解冻资产</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="SendUnlockAmount()">{{ $t('common.continue') }}</el-button>
                <el-button @click="isSendUnlockAmountInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog class="unlockAmountInfoBox" title="解冻资产" :visible.sync="isUnlockAmountInfoBox" width="30%" center :modal-append-to-body='false'>                                <!--  申请解冻资产消息框 -->
          <span>您现在可以解冻锁定的资产</span>
          <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmReceiptRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="UnlockAmount()">{{ $t('common.continue') }}</el-button>
                <el-button @click="isUnlockAmountInfoBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
        <el-dialog title="退出" :visible.sync="isSignOutBoxShow" width="30%" center>
          <span>{{ $t('common.signOut') }} </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="SignOut()">{{ $t('common.continue') }}</el-button>
            <el-button @click="isSignOutBoxShow = false">{{ $t('common.cancel') }}</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'Vue'
import headNav from './components/common/headNav'
import channel from './components/common/channel'
import footerBox from './components/common/footer'
import notify from './components/common/notify'

export default {
  name: 'App',
  data () {
    var validatePass = (rule, value, callback) => {         //Receipt 密码输入规则
      if (!value) {
        return callback(new Error(this.$t('common.callback-1')));
      } else {
        let PrivateKey = this.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore,this.activeInfo.keyStorePass);
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
        startX : 0 ,
        endX : 0 ,
        isFeeInfoBoxShow: false,         //是否显示Fee提醒框
        isReceiptRsmcInfoBox: false,     //是否显示接收Rsmc消息框
        isReceiptHtlcInfoBox: false,     //是否显示接收Htlc消息框
        isSettleInfoBox: false,          //是否显示Settle消息框
        isSettleTransactionInfoBox: false,          //是否显示SettleTransaction消息框
        isUpdateTransactionInfoBox: false,          //是否显示制裁消息框
        isSendUnlockAmountInfoBox:false,            //是否显示申请取回冻结资产消息框
        isUnlockAmountInfoBox:false,                //是否申请取回冻结资产消息框
        isSignOutBoxShow: false,         //是否显示退出消息框
        activeInfo: {                     //当前显示的消息框
          "redata": {}, 
          "txData": '',
          "keyStorePass": ''
        },
        SettleTransaction: {
          "blockNumber": '',
          "keyStorePass": ''
        },
        paymentInfo: {
          "redata": {}, 
          "keyStorePass": '',
          "fee": 0
        },
        confirmReceiptRules: {        //Receipt 输入规则
          keyStorePass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        transitionName: ''    //当前动画名称
    }
  },
  components: {
    headNav,
    footerBox,
    channel,
    notify
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时连接至全节点
        //let _this = this;
        //_this.connectWebSocketForNodeUri();         //连接至全节点
    })
  },
  created() {           //加载完成去除加载动画  
    document.body.removeChild(document.getElementById('Loading'))
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
        _this.$notify.closeAll();
        if(_this.$store.state.vuexStore.baseChain == "ETH"){                   //当前为ETH钱包时
          let wsuri = _this.$store.state.vuexStore.NodeUriWebSocketIp;               //建立websocket连接
          _this.$store.state.vuexStore.NodeUriWebSocket = new WebSocket(wsuri);
          _this.$store.state.vuexStore.NodeUriWebSocket.onmessage = _this.nodeUriWebsocketOnMessage;
          _this.$store.state.vuexStore.NodeUriWebSocket.onclose = _this.nodeUriWebsocketClose;
          if(_this.$store.state.vuexStore.isLogin == true){
            let Message = {
                "messageType":"init", 
                "walletAddress":_this.$store.state.vuexStore.walletInfo.address
            }
            setTimeout(function(){
              _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
            },1000);
          }
        } else if(_this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为NEO钱包时,测试RPC服务
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
            //_this.connectWebSocketForNodeUriNotify.close();                //关闭连接至全节点notify
            if(_this.loseWebSocketForNodeUriNotify){
              _this.loseWebSocketForNodeUriNotify.close();                //关闭连接至全节点notify
            }
            _this.$notify({
                title: _this.$t('common.success'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-6'),
                duration: 3000,
                type: 'success'
            });
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
    keepDecimalPlaces(num,a) {      //将num保留a位小数,用于余额显示,参数1为原数据,参数2为位数
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
      this.$store.state.vuexStore.walletInfo = {         //钱包信息
        "keyStore": "",
        "publicKey": "",
        "address": ""
      }
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
          return false;
      }
      return decryptPrivateKey;
    },
    async signDataForERC20Contract(contractAddress, functionName, dataTypeList, dataList, password) {             //ETH 合约通用签名方法
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
                      gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
                      gasLimit: web3.utils.toHex(result + 50000),
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
    ecSignForTrinityContract(dataTypeList, dataList, password) {             //ETH 合约通用签名方法
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
    assetContractAddress2AssetType(assetContractAddress) {          //合约地址转资产类型
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
    AssetType2AssetContractAddress(assetType) {         //资产类型转合约地址
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
    AssetTypeToAssetId(AssetType) {                  //NEO.资产类型转AssetId
      let _this = this;
      let AssetId = "";
      console.log(_this.$store.state.vuexStore.isTestNet);
      if(_this.$store.state.vuexStore.isTestNet){
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
    getChannelSerial(type,value,open,isLog) {      //获取所需的channel在List的位置,参数为key,value,是否为open状态,是否显示提醒框
        let _this = this;
        let i = -1;
        _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
         if(data[type] == value && data.isTestNet == _this.$store.state.vuexStore.isTestNet){
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
        console.log(eventList);
        console.log(eventList[0]);
        // setTimeout(function (){
          let Message = {                                                                     //监控事件消息体
            'messageType': eventList[i],
            "walletAddress": _this.$store.state.vuexStore.walletInfo.address,
            "chainType": _this.$store.state.vuexStore.baseChain,
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
        _this.$notify({
            title: _this.$t('common.success'),
            dangerouslyUseHTMLString: true,
            message: _this.$t('common.callback-6'),
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
        case "monitorCloseChannel":
          _this.OnMesMonitorCloseChannel(redata);
          break;
        case "monitorUpdateTransaction":
          _this.OnMesMonitorUpdateTransaction(redata);
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
          if(redata.amountA == _this.$store.state.vuexStore.channelList[l].SelfBalance && redata.amountB ==_this.$store.state.vuexStore.channelList[l].OtherBalance){
            _this.$notify({
                title: _this.$t('common.success'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-9'),
                duration: 3000,
                type: 'success'
            });
            _this.$store.state.vuexStore.channelList.splice(l,1);

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
          _this.settleTransactionNotify = _this.$notify({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: redata.channelId + _this.$t('common.callback-11'),
              duration: 0,
              type: 'error',
              onClick: showDialog
          });
          function showDialog(){                          //显示接收信息框
              _this.activeInfo.redata = data;
              _this.isUpdateTransactionInfoBox = true;
          }
        }
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
    OnMesMonitorWithdraw(redata){                  //收到全节点监控对端上链HTLC事件
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
        if(redata.R){
          console.log(R);
          _this.$store.state.vuexStore.txList.forEach(function(data,index){
            if(data.channelName == redata.playload){
              data.forEach(function(data1,index){
                if(data1.R == redata.R && data1.delayBlock == undefined){             //找到匹配的R交易
                  _this.WithdrawNotify = _this.$notify({
                      title: _this.$t('common.warning'),
                      dangerouslyUseHTMLString: true,
                      message: redata.channelId + _this.$t('common.callback-11'),
                      duration: 0,
                      type: 'error',
                      onClick: showDialog
                  });
                  function showDialog(){                          //显示接收信息框
                      this.activeInfo.redata = data1;
                      this.isUpdateTransactionInfoBox = true;
                  }
                }
              })
            }
          })
        }
      }
    },
    OnMesMonitorWithdrawUpdate(redata) {                    //收到全节点监控对端上链WithdrawUpdate事件

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
    sendUpdateTransaction() {                   //发送制裁交易
      this.$refs['activeInfo'].validate((valid) => {
        this.sendUpdateTransactionFun();      //用于element表单认证里使用await报错
      })
    },
    async sendUpdateTransactionFun() {        //用于element表单认证里使用await报错
      let _this = this;
      let l = _this.getChannelSerial('ChannelName', _this.activeInfo.redata.channelName);

      let selfSignedData,otherSignedData,HashR,R;
      if(_this.activeInfo.redata.HashR == "0x0" && _this.activeInfo.redata.HashR == "0x0"){       //如果为R交易,取最新的交易
        _this.$store.state.vuexStore.txList.forEach(function(data,index){
            if(data.channelName == _this.activeInfo.ChannelName && data.history[data.history.length - 1].founderSignedData && data.history[data.history.length - 1].peerSignedData){
                console.log(data.history[data.history.length - 1].founder);
                console.log(_this.$store.state.vuexStore.walletInfo.address);
                if(data.history[data.history.length - 1].founder == _this.$store.state.vuexStore.walletInfo.address){
                    console.log("本端为founder");
                    selfSignedData = data.history[data.history.length - 1].founderSignedData;
                    otherSignedData = data.history[data.history.length - 1].peerSignedData;
                } else {
                    console.log("对端为founder");
                    otherSignedData = data.history[data.history.length - 1].founderSignedData;
                    selfSignedData = data.history[data.history.length - 1].peerSignedData;
                }
            }
        })
      } else {                                                                                   //如果为H交易,取对应HashR的R交易
        _this.$store.state.vuexStore.txList.forEach(function(data,index){
            if(data.channelName == _this.activeInfo.ChannelName){
              data.history.forEach(function(data1,index){
                if(data1.HashR == _this.activeInfo.redata.HashR && data1.delayBlock == undefined){
                  //if(data1.founder == _this.$store.state.vuexStore.walletInfo.address){
                    selfSignedData = data1.founderSignedData;
                    otherSignedData = data1.peerSignedData;
                  // } else {
                  //   otherSignedData = data1.founderSignedData;
                  //   selfSignedData = data1.peerSignedData;
                  // }
                }
              })
            }
        })
      }

      let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32','bytes','bytes']; 
      let dataList = [
        _this.$store.state.vuexStore.channelList[l].ChannelName, 
        _this.$store.state.vuexStore.channelList[l].TxNonce,
        _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0], 
        _this.$store.state.vuexStore.channelList[l].OtherBalance,
        _this.$store.state.vuexStore.walletInfo.address, 
        _this.$store.state.vuexStore.channelList[l].SelfBalance, 
        HashR,
        R,
        otherSignedData,
        selfSignedData
      ];
      let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "updateTransaction", dataTypeList, dataList, _this.activeInfo.keyStorePass);               //签名
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
          _this.settleTransactionNotify.close();
          _this.isUpdateTransactionInfoBox = false;         //关闭窗口
          _this.activeInfo = {                              //清空数据
            "channelName": "",
            "keyStorePass": "",
            "redata": "",
            "txData": ""
          }
          _this.$refs['activeInfo'].resetFields();          //重置验证消息
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
      this.loseWebSocketForNodeUriNotify = this.$notify({
          title: this.$t('common.warning'),
          dangerouslyUseHTMLString: true,
          message: this.$t('common.callback-15'),
          duration: 0,
          type: 'error',
          onClick: this.connectWebSocketForNodeUri
      });
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
      var blockHeightCycle = setInterval(this.getblockHeight, 60000);
      //clearInterval(blockHeightCycle);  //停止循环方法
    },
    OnMesMonitorSelfCloseChannel(data) {                //自身强制关闭通道的指定块高
      let _this = this;
      if(_this.selfCloseChannelNotify == undefined){
        _this.selfCloseChannelNotify = _this.$notify({
          title: _this.$t('common.info'),
          dangerouslyUseHTMLString: true,
          message: _this.$t('common.callback-13'),
          duration: 0,
          type: 'info',
          onClick: showDialog                         //显示接收信息框
        });
        function showDialog(){                          //显示接收信息框
            _this.activeInfo.redata = data;
            _this.isSettleTransactionInfoBox = true;
        }
      }
    },
    sendSettleTransaction() {                   //发送SettleTransaction,用于强制拆链已到指定块高
      this.$refs['activeInfo'].validate((valid) => {
        this.sendSettleTransactionFun();       //用于element表单认证里使用await报错
      })
    },
    async sendSettleTransactionFun() {              //用于element表单认证里使用await报错
      let _this = this;
      console.log(_this.activeInfo.redata);

      let l = _this.getChannelSerial('ChannelName', _this.activeInfo.redata.channelName);
      let dataTypeList = ['bytes32']; 
      let dataList = [
          _this.activeInfo.redata.channelName
      ];
      let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "settleTransaction", dataTypeList, dataList, _this.activeInfo.keyStorePass);               //签名
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
              isTestNet: _this.$store.state.vuexStore.isTestNet,
              transactionHash : hash,
              blockHash: ""
          }
          _this.$store.state.vuexStore.recordList.push(recordMessage);
          _this.StoreData("recordList");                                      //保存交易记录

          _this.isSettleTransactionInfoBox = false,          
          _this.SettleTransaction = {           //清除消息
            "blockNumber": '',
            "keyStorePass": ''
          };
          _this.$store.state.vuexStore.channelList[l].closeHash = hash;

          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == _this.$store.state.vuexStore.channelList[l].ChannelName){
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
    OnMesMonitorSendUnlockAmount(data) {                    //HTLC交易到达指定块高仍未获得  R,可以申请解冻资产
      let _this = this;
      console.log(_this.sendUnlockAmountNotify);
      if(_this.sendUnlockAmountNotify == undefined){
        _this.sendUnlockAmountNotify = _this.$notify({
            title: '消息',
            dangerouslyUseHTMLString: true,
            message: 'HTLC已到达指定块高,可以申请解冻资产',
            duration: 0,
            type: 'info',
            onClick: showDialog
        });
        function showDialog(){                          //显示接收信息框
            console.log(_this.activeInfo.redata);
            _this.activeInfo.redata = data;
            _this.isSendUnlockAmountInfoBox = true;
        }
      }
    },
    SendUnlockAmount() {      //申请解冻金额
      this.$refs['activeInfo'].validate((valid) => {
        this.SendUnlockAmountFun();             //用于element表单认证里使用await报错
      })
    },
    async SendUnlockAmountFun() {                     //用于element表单认证里使用await报错
      let _this = this;
      let redata = _this.activeInfo.redata;
      console.log(redata);

      let l = _this.getChannelSerial('ChannelName', redata.channelName);
      let dataTypeList = ['bytes32','address','address','uint256','uint256','bytes32','bytes','bytes','bytes32']; 
      let dataList = [
          redata.channelName, 
          _this.$store.state.vuexStore.walletInfo.address, 
          redata.data.peer, 
          redata.data.delayBlock,
          redata.data.payment,
          redata.data.HashR,
          redata.data.founderDelayCommitment,
          redata.data.peerDelayCommitment,
          redata.data.R ? redata.data.R : "0x" + addPreZero(0,64)
      ];
      let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "withdraw", dataTypeList, dataList, _this.activeInfo.keyStorePass);               //签名
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
          if(_this.sendUnlockAmountNotify){
            _this.sendUnlockAmountNotify.close();
            _this.sendUnlockAmountNotify = undefined;
          }
          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == redata.channelName && data.messageType == "monitorSendUnlockAmount"){
              console.log("withdraw成功,停止监听");
              _this.$store.state.vuexStore.eventList.splice(index,1);
              _this.StoreData("eventList");
            }
          })

          _this.isSendUnlockAmountInfoBox = false;         //关闭窗口
          _this.activeInfo = {                              //清空数据
            "channelName": "",
            "keyStorePass": "",
            "redata": "",
            "txData": ""
          }
          _this.$refs['activeInfo'].resetFields();          //重置验证消息
          return;
      })
      .on('receipt', console.log)
      .on('error', function(error){
          console.log(error);
          return;
      })
    },
    OnMesMonitorUnlockAmount(data) {            //申请解冻资产到达指定块高
      let _this = this;
      if(_this.unlockAmountNotify == undefined){
        _this.unlockAmountNotify = _this.$notify({
            title: '消息',
            dangerouslyUseHTMLString: true,
            message: '现在可以申请取回冻结的余额',
            duration: 0,
            type: 'info',
            onClick: showDialog
        });
        function showDialog(){                          //显示接收信息框
            _this.activeInfo.redata = data;
            console.log(_this.activeInfo.redata);
            _this.isUnlockAmountInfoBox = true;
        }
      }
    },
    UnlockAmount() {                //解冻资产方法
      this.$refs['activeInfo'].validate((valid) => {
        this.UnlockAmountFun();             //用于element表单认证里使用await报错
      })
    },
    async UnlockAmountFun() {                //用于element表单认证里使用await报错
      let _this = this;
      console.log(_this.activeInfo.redata);

      let dataTypeList = ['bytes32','bytes32']; 
      let dataList = [
          _this.activeInfo.redata.channelName,
          _this.activeInfo.redata.HashR
      ];
      let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "withdrawSettle", dataTypeList, dataList, _this.activeInfo.keyStorePass);               //签名
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
          if(_this.unlockAmountNotify){               //关闭通知窗
            _this.unlockAmountNotify.close();
            _this.unlockAmountNotify = undefined;
          }
          _this.$store.state.vuexStore.eventList.forEach(function(data, index){
            if(data.channelName == _this.activeInfo.redata.channelName && data.messageType == "monitorUnlockAmount"){
              console.log("withdrawSettle,停止监听");
              _this.$store.state.vuexStore.eventList.splice(index,1);
              _this.StoreData("eventList");
            }
          })

          _this.cycleGetTransactionReceipt(hash);
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
      // case "DeleteChannel":                       //用于全节点监控不到时
      //   _this.OnMesDeleteChannel(redata);
      //   break;
      case "Founder":                               //NEO
        _this.OnMesFounder(redata);
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
      if(_this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
        if(redata.Status == "RESPONSE_OK"){               //当Status为OK时，上链并提交给全节点监控
          console.log(_this.$store.state.vuexStore.addChannelInfo.txData);
          console.log(redata.MessageBody.Commitment);
          console.log(redata.Sender.split("@")[0].toLowerCase());
          if(ecRecover(_this.$store.state.vuexStore.addChannelInfo.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名成功时,查询对端余额和Approve情况
            _this.showLoading();
            
            let dataTypeList = ["address","uint256"]; 
            let dataList = [ _this.$store.state.vuexStore.trinityDataContractAddress, _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7)];
            let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.tncContractAddress, "approve", dataTypeList, dataList, _this.$store.state.vuexStore.addChannelInfo.keyStorePass);               //签名
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
      } else if (_this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
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
      setTimeout(function (){
        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: _this.$store.state.vuexStore.gasPrice        //Gas价格
          });
          myContract.methods.balanceOf(redata.Sender.split("@")[0]).call({from: redata.Sender.split("@")[0]}, function(error, balance){
              if(!error) {                  //查询对端地址余额
                  console.log(balance);
                  if(balance > _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7)){     //判断对端余额是否大于通道押金
                    myContract.methods.allowance(redata.Sender.split("@")[0] , _this.$store.state.vuexStore.trinityDataContractAddress ).call({from: _this.$store.state.vuexStore.walletInfo.address}, function(error, result){   //查询对端是否Approve
                        console.log(result);
                        if(result >= _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7)){    //当Approve成功后发送建立通道
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

      let dataTypeList = ["bytes32","uint256","address","uint256","address","uint256","bytes","bytes"]; 
      let dataList = [
        _this.$store.state.vuexStore.addChannelInfo.channelName,
        1, 
        _this.$store.state.vuexStore.walletInfo.address, 
        _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7), 
        _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0], 
        _this.$store.state.vuexStore.addChannelInfo.otherDeposit.mul(10e7), 
        _this.$store.state.vuexStore.addChannelInfo.selfSignedData, 
        redata.MessageBody.Commitment];
      let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "deposit", dataTypeList, dataList, _this.$store.state.vuexStore.addChannelInfo.keyStorePass);               //签名
      console.log(signedData);

      console.log(redata.MessageBody.Commitment);
      
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
            "HashR": 0x0,
            "R": 0x0
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
          let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.addChannelInfo.channelName);
          _this.$store.state.vuexStore.channelList[l].transactionHash = hash;     //将交易hash赋值给改通道信息
          _this.StoreData("channelList");                             //保存通道信息
          let recordMessage = {                             //构造上链record消息
            date: date,
            name: _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],
            Amount: _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7),
            assetType: 'TNC',
            isOnChannel: false,
            isPay: true,
            state: 0,
            isTestNet: _this.$store.state.vuexStore.isTestNet,
            transactionHash : hash,
            blockHash: ""
          }
          _this.$store.state.vuexStore.recordList.push(recordMessage);
          let recordMessage1 = {                            //构造通道record消息
            date: date,
            name: _this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0],
            Amount: _this.$store.state.vuexStore.addChannelInfo.selfDeposit.mul(10e7),
            assetType: 'TNC',
            isOnChannel: true,
            isPay: false,
            state: 0,
            isTestNet: _this.$store.state.vuexStore.isTestNet,
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
          let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.addChannelInfo.channelName);
          _this.$store.state.vuexStore.channelList.splice(l,1);
          _this.StoreData("channelList");         //储存通道信息
          return;
      })
      let eventList = [
        "monitorDeposit",                     //建立通道事件
        "monitorQuickCloseChannel",           //快速关闭通道事件
        "monitorCloseChannel",                //强制关闭通道事件
        "monitorUpdateTransaction",           //制裁事件
        "monitorWithdraw",                    //解锁金额事件
        "monitorWithdrawUpdate",              //制裁解锁金额事件
        "monitorWithdrawSettle"               //到达块高获取解锁金额事件
      ];
      _this.monitorEventByNodeUri(redata.ChannelName, eventList);       //向全节点提交监控通道事件

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
      if(_this.$store.state.vuexStore.baseChain == "ETH" && _this.$store.state.vuexStore.baseChain.NodeUriWebSocket == null){                 //当前为ETH钱包时
        let l = _this.getChannelSerial("ChannelName", redata.MessageBody.ChannelName);      //获取所需的channel在List的位置
        console.log(l);
        let channelInfo = _this.$store.state.vuexStore.channelList[l];
        console.log(channelInfo);
        channelInfo.State = 3;                            //通道状态更新
        Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(_this.$store.state.vuexStore.channelList[l]);
        _this.StoreData("channelList");                   //保存通道信息
        _this.getChannelBalance();              //更新通道余额
      } else if(_this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
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
          // let Message1 = {
          //     "Address":val.Name,
          //     "Amount":val.Balance,
          //     "AssetType":val.AssetType,
          //     "Fee":0,
          //     "Flag":true,
          //     "isTestNet":_this.isTestNet,
          //     "Date":new Date().getTime()
          // }
          // _this.RecordList.push(Message1);
          // _this.StoreRecordList(_this.RecordList);
        }
      }
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
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l >= 0){ 
        _this.activeInfo.redata = redata; 
        _this.activeInfo.redata.PaymentCount = redata.MessageBody.PaymentCount;    
        _this.receiptRsmcNotify = _this.$notify.info({
            title: _this.$t('common.info'),
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: _this.$store.state.vuexStore.channelList[l].Alice + _this.$t('common.callback-19'),
            onClick: showDialog
        });
        function showDialog(){                          //显示接收信息框
            _this.activeInfo.redata = redata;
            console.log(_this.activeInfo.redata);
            _this.isReceiptRsmcInfoBox = true;
        }
      }
    },
    RsmcSign() {                      //进入RsmcSign,开始对交易数据签名,收款
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置
          let OtherBalance,R;
          console.log(_this.activeInfo.redata.MessageBody);
          if(_this.activeInfo.redata.MessageBody.HashR == undefined){
            OtherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - Number(_this.activeInfo.redata.MessageBody.PaymentCount);
          } else {
            OtherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance);
            _this.$store.state.vuexStore.RList.forEach(function(data,index){
            if(data.Hr === _this.activeInfo.redata.MessageBody.HashR){
                console.log(data.Hr);
                R = data.R
              }
            });
            console.log("R:" + R);
          }
          // console.log(_this.$store.state.vuexStore.channelList[l].ChannelName);
          // console.log(_this.$store.state.vuexStore.channelList[l].TxNonce + 1);
          // console.log(_this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]);
          // console.log(OtherBalance);
          // console.log(_this.$store.state.vuexStore.walletInfo.address);
          // console.log(Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + Number(_this.activeInfo.redata.PaymentCount));
          // console.log(_this.activeInfo.redata.MessageBody.HashR ? _this.activeInfo.redata.MessageBody.HashR : addPreZero(0,64));
          // console.log(R ? R : addPreZero(0,64));
          // let txData = web3.utils.soliditySha3(         //生成代签名交易数据
          //     {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
          //     {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
          //     {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //对端地址
          //     {t: 'uint256', v: OtherBalance},                                 //对端余额
          //     {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //本端地址
          //     {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + Number(_this.activeInfo.redata.MessageBody.PaymentCount)},                                 //本端余额
          //     {t: 'bytes32', v: _this.activeInfo.redata.MessageBody.HashR ? _this.activeInfo.redata.MessageBody.HashR : addPreZero(0,64)},           //HashR
          //     {t: 'bytes32', v: R ? R : addPreZero(0,64)},               //R
          // );
          // console.log(txData);
          // _this.activeInfo.txData = txData; 

          // let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          // let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
          // console.log(selfSignedData); 

          let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
          let dataList = [
            _this.$store.state.vuexStore.channelList[l].ChannelName,
            _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
            _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
            OtherBalance,
            _this.$store.state.vuexStore.walletInfo.address,
            Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + Number(_this.activeInfo.redata.MessageBody.PaymentCount),
            _this.activeInfo.redata.MessageBody.HashR ? _this.activeInfo.redata.MessageBody.HashR : "0x" + addPreZero(0,64),
            R ? R : "0x" + addPreZero(0,64)
          ];
          let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, _this.activeInfo.keyStorePass);     //签名方法
          if(!signedDataResult){
            console.log('签名失败');
          }
          _this.activeInfo.txData = signedDataResult.txData; 

          console.log(_this.activeInfo);
          let Message = {
            "MessageType":"RsmcSign",
            "Sender": _this.activeInfo.redata.Receiver,
            "Receiver": _this.activeInfo.redata.Sender,
            "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
            "ChannelName": _this.activeInfo.redata.ChannelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "AssetType": _this.$store.state.vuexStore.channelList[l].assetType,
            "MessageBody": {
              "PaymentCount": _this.activeInfo.redata.PaymentCount,
              "SenderBalance": OtherBalance,
              "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + Number(_this.activeInfo.redata.MessageBody.PaymentCount),
              "HashR": _this.activeInfo.redata.MessageBody.HashR,
              "Commitment": signedDataResult.signedData,
              "RoleIndex": 0
            },
            "Comments": {},
            "Status": "RESPONSE_OK",
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
          _this.activeInfo.redata.selfSignedData = signedDataResult.signedData;                    //储存本端签名用于后续更新数据
          _this.isReceiptRsmcInfoBox = false;           //关闭窗口
           _this.receiptRsmcNotify.close();            //关闭Rsmc消息框
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
        let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
        console.log(l);
        if(l == -1){             //如果未检测到通道,给出提醒
            _this.$notify.error({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.callback-17'),
                duration: 3000
            });
            return;
        } else {          //检测到通道
          if(redata.MessageBody.RoleIndex == 0){         //如果不带RoleIndex,发送RsmcSign
            console.log(redata);
            let SelfBalance, R;
            if(redata.MessageBody.HashR == undefined){
              SelfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) - (Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee));
            } else {
              SelfBalance = Number(_this.$store.state.vuexStore.channelList[l].SelfBalance);
              _this.$store.state.vuexStore.RList.forEach(function(data,index){
              if(data.Hr === redata.MessageBody.HashR){
                  console.log(data.Hr);
                  R = data.R
                }
              });
              console.log("R:" + R);
            }

            let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32'];
            let dataList = [
              _this.$store.state.vuexStore.channelList[l].ChannelName,
              _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
              _this.$store.state.vuexStore.walletInfo.address,
              SelfBalance,
              _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
              Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
              redata.MessageBody.HashR ? redata.MessageBody.HashR : "0x" + addPreZero(0,64),
              redata.MessageBody.R ? redata.MessageBody.R : "0x" + addPreZero(0,64)
            ];
            let signedDataResult = _this.ecSignForTrinityContract(dataTypeList, dataList, _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);     //签名方法
            if(!signedDataResult){
              console.log('签名失败');
              return false;
            }
            console.log(signedDataResult.txData);
            console.log(redata.MessageBody.Commitment);
            console.log(redata.Sender.split("@")[0].toLowerCase());
            if(ecRecover(signedDataResult.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名
              // let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);      //解锁钱包用于签名          
              // let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
              // console.log(selfSignedData);

              let Message = {                     //构造RsmcSign消息体
                "MessageType":"RsmcSign",
                "Sender": redata.Receiver,
                "Receiver": redata.Sender,
                "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
                "ChannelName": redata.ChannelName,
                "NetMagic": _this.$store.state.vuexStore.NetMagic,
                "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
                "MessageBody": {
                  "PaymentCount": Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
                  "SenderBalance": SelfBalance,
                  "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
                  "HashR": redata.MessageBody.HashR,
                  "R": redata.MessageBody.R,
                  "Commitment": signedDataResult.signedData,
                  "RoleIndex": 1
                },
                "Comments": {},
                "Status": "RESPONSE_OK",
              }
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息

              let channelInfo = _this.$store.state.vuexStore.channelList[l];
              channelInfo.SelfBalance = redata.MessageBody.SenderBalance;     //本端余额更新
              channelInfo.OtherBalance = redata.MessageBody.ReceiverBalance;    //对端余额更新
              channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
              Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
              console.log(_this.$store.state.vuexStore.channelList[l]);
              _this.StoreData("channelList");           //保存通道信息

              let txListMessage = {                           //txData
                "nonce": _this.$store.state.vuexStore.channelList[l].TxNonce,
                "founder": _this.$store.state.vuexStore.walletInfo.address,
                "founderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
                "peer": _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
                "peerBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance),
                "founderSignedData": signedDataResult.selfSignedData,
                "peerSignedData": redata.MessageBody.Commitment,
                // "delayBlock":,
                // "payment": ,
                "HashR": redata.MessageBody.HashR ? redata.MessageBody.HashR : addPreZero(0,64),
                "R": redata.MessageBody.R ? redata.MessageBody.R : addPreZero(0,64)
                // "delayCommitment": ,
              }
              _this.newTxList(redata.ChannelName, txListMessage);                    //更新TxList
              _this.getChannelBalance();              //更新通道余额

              console.log(redata.MessageBody.HashR);
              if(redata.MessageBody.HashR != addPreZero(0,64)){         //当Htlc完全结束时,停止event监听
                _this.$store.state.vuexStore.eventList.forEach(function(data, index){
                  if(data.HashR == redata.MessageBody.HashR){
                    console.log("H交易已完成,停止监听");
                    _this.$store.state.vuexStore.eventList.splice(index,1);
                    _this.StoreData("eventList");
                  }
                })
              }

              let date = new Date().getTime();        //获取当前时间戳
              let recordMessage = {           //构造通道record消息
                date: date,
                name: redata.Sender.split("@")[0],
                Amount: Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
                assetType: _this.$store.state.vuexStore.txOnChannelInfo.assetType,
                isOnChannel: true,
                isPay: true,
                state: 1,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : "none",
                blockHash: "none"
              }
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              _this.StoreData("recordList");                //保存交易记录

              _this.isReceiptRsmcInfoBox = false;
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
              _this.$notify({
                title: _this.$t('common.warning'),
                dangerouslyUseHTMLString: true,
                message: _this.$t('common.verifyFail'),
                duration: 3000,
                type: 'error'
              });
            }
          } else if (redata.MessageBody.RoleIndex == 1){       //如果RoleIndex为1,更新通道余额
            if(ecRecover(_this.activeInfo.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名
              let channelInfo = _this.$store.state.vuexStore.channelList[l];
              
              channelInfo.SelfBalance = redata.MessageBody.ReceiverBalance;     //本端余额更新
              channelInfo.OtherBalance = redata.MessageBody.SenderBalance;    //对端余额更新
              channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
              Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
              console.log(_this.$store.state.vuexStore.channelList[l]);

              let txListMessage = {                           //txData
                "nonce": redata.TxNonce,
                "founder": redata.Sender.split("@")[0],
                "founderBalance": channelInfo.OtherBalance,
                "peer": _this.$store.state.vuexStore.walletInfo.address,
                "peerBalance": channelInfo.SelfBalance,
                "founderSignedData": redata.MessageBody.Commitment,
                "peerSignedData": _this.activeInfo.redata.selfSignedData,
                // "delayBlock":,
                // "payment": ,
                "HashR": redata.MessageBody.HashR ? redata.MessageBody.HashR : 0x0,
                "R": redata.MessageBody.R ? redata.MessageBody.R : 0x0
                // "delayCommitment": ,
              }
              _this.newTxList(redata.ChannelName, txListMessage);                             //更新TxList

              _this.StoreData("channelList");                   //保存通道信息
              _this.getChannelBalance();              //更新通道余额
              

              let date = new Date().getTime();        //获取当前时间戳
              console.log(Number(redata.MessageBody.PaymentCount));
              let recordMessage = {           //构造通道record消息
                date: date,
                name: redata.Sender.split("@")[0],
                Amount: Number(redata.MessageBody.PaymentCount),
                assetType: redata.MessageBody.AssetType,
                isOnChannel: true,
                isPay: false,
                state: 1,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : "none",
                blockHash: "none"
              }
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              _this.StoreData("recordList");                //保存交易记录

              _this.receiptRsmcNotify.close();        //关闭接收Rsmc消息框   
              _this.$notify({                 //消息提醒
                  title: _this.$t('common.success'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-21'),
                  duration: 3000,
                  type: 'success'
              });

              _this.activeInfo = {           //清空交易数据
                "redata": [], 
                "txData": '',
                "keyStorePass": ''
              }
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
          }
        }
      } else {             //当得到非确认后,进行输出状态
        console.log(redata.Status)
      }
    },
    OnMesAckRouterInfo:function(redata){            //收到路由消息
      // console.log(redata.RouterInfo);
      let _this = this;
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
        if(_this.$store.state.vuexStore.txOnChannelInfo.receiverUri.split(":")[1] == 8866){        //如果对端为SPV,路由首尾加上两个SPV
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
        console.log(1);
        _this.isFeeInfoBoxShow = true;                       //显示Fee提醒框
      }
    },
    sendHtlcMes() {         //发起Htlc交易
      let _this = this;
      let l = _this.getChannelSerial("OtherUri",_this.$store.state.vuexStore.txOnChannelInfo.Next,"open");       //遍历当前通道位置
      console.log(l);
      if(l >= 0){          //当l为-1时,未遍历到通道
        web3.eth.getBlockNumber().then(function(blockNumber){           //获取当前块高
          console.log(blockNumber);
          let DelayBlock = blockNumber + (_this.$store.state.vuexStore.txOnChannelInfo.Router.length - 1) * 15;
          //let DelayBlock = blockNumber + (_this.$store.state.vuexStore.txOnChannelInfo.Router.length - 1) * 4 * 60 * 24;         //1分钟4个块,一天
          console.log(DelayBlock);
          let Ip = _this.uri2Ip(_this.$store.state.vuexStore.txOnChannelInfo.Next,8866);
          let sender = _this.$store.state.vuexStore.walletInfo.address + "@" + Ip;
          let amount = Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee);
          console.log(amount);

          let delayTxData = web3.utils.soliditySha3(         //生成代签名Htlc交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},                            //通道名称
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //本端地址
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //对端地址
              {t: 'uint256', v: DelayBlock},                                                                         //锁定块高
              {t: 'uint256', v: amount},                                                                             //锁定金额
              {t: 'bytes32', v: _this.$store.state.vuexStore.txOnChannelInfo.hr}                                     //HashR
          );
          console.log(delayTxData);

          console.log(_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);
          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);        //解锁钱包用于签名          
          let delayCommitment = ecSign(delayTxData,decryptPK.privateKey);         //签名
          console.log(delayCommitment); 

          let txData = web3.utils.soliditySha3(         //生成代签名Rsmc交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                        //本端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) - Number(amount)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                     //对端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].OtherBalance)},                       //对端押金
              {t: 'bytes32', v: addPreZero(0,64)},                                                                       //HashR
              {t: 'bytes32', v: addPreZero(0,64)},                                                                       //R
          );
          console.log(txData);
          _this.$store.state.vuexStore.txOnChannelInfo.txData = txData;     //保存txData用于后续验证签名
 
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
                  "SenderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) - Number(amount), 
                  "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance), 
                  "Commitment": commitment,
                  "Payment": Number(amount),
                  "DelayBlock": DelayBlock, 
                  "DelayCommitment": delayCommitment, 
                  "HashR": _this.$store.state.vuexStore.txOnChannelInfo.hr
              }
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
          _this.$store.state.vuexStore.txOnChannelInfo.selfSignedData = commitment;             //保存本端签名,用于保存TXlist
          _this.$store.state.vuexStore.txOnChannelInfo.selfDelaySignedData = delayCommitment;
          
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
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l == -1){          //当l为-1时,未遍历到通道
        return false;
      } else {
        _this.activeInfo.redata = redata;
        _this.activeInfo.redata.PaymentCount = redata.MessageBody.Payment;        
        _this.receiptHtlcNotify = _this.$notify.info({
            title: _this.$t('common.info'),
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: _this.$store.state.vuexStore.channelList[l].Alice + _this.$t('common.callback-19'),
            onClick: showDialog
        });
        function showDialog(){                          //显示接收信息框
            _this.activeInfo.redata = redata;
            console.log(_this.activeInfo.redata);
            _this.isReceiptHtlcInfoBox = true;
        }
      }
    },
    HtlcSign() {          //进入HtlcSign,开始对交易数据签名
    // {
    //   AssetType:"TNC"
    //   ChannelName:"0xde9708995c48f9957072588d021b63194246e913b953c4a2c21c2bd471ac0177"
    //   MessageBody:{
    //     Commitment:"0x6cfa98c23d9c8b999093ea76fa62ae192f33a515ebf80f5e809928ded1e733b94237adb20446f4c84570bca8757278716e5d044ba8b6ec3d3d1beb12daf3878700"
    //     DelayBlock:3943242
    //     DelayCommitment:"0xcc56d871c0026618d2e7979c12b3f753a74767cbc3c6ed32c2337f7becac61972e318c0651a6d834a0bc7c7fbb06e841e883c4e67ced2257f5dd10aa5479337600"
    //     HashR:"0x31d5d4233adb3bd464edce0cb8e9b6b0a4f17e254941534f376bff8db755d30b"
    //     Payment:1
    //     ReceiverBalance:20
    //     SenderBalance:19
    //   }
    //     MessageType:"Htlc"
    //     NetMagic:"527465737419990331"
    //     Next:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
    //     Receiver:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
    //     Router:[["0xADCe15cDEc589f93D25BE13DFa9370F659e78D45@106.15.91.150:8866", 0],…]
    //     Sender:"0x4E801062608188F5d5805ddC3e98B766088784CE@106.15.91.150:8089"
    //     TxNonce:"2"
    // }
      let _this = this;
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - (Number(_this.activeInfo.redata.PaymentCount))},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) + (Number(_this.activeInfo.redata.PaymentCount))}       //对端押金
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          let commitment = ecSign(txData,decryptPK.privateKey);         //签名
          console.log(commitment); 

          console.log(_this.activeInfo.redata.MessageBody.SenderBalance);
          console.log(Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - Number(_this.activeInfo.redata.PaymentCount));
          console.log(_this.activeInfo.redata.MessageBody.ReceiverBalance);
          console.log(Number(_this.$store.state.vuexStore.channelList[l].SelfBalance));

          if(_this.activeInfo.redata.MessageBody.SenderBalance == (_this.$store.state.vuexStore.channelList[l].OtherBalance - (Number(_this.activeInfo.redata.PaymentCount))) && _this.activeInfo.redata.MessageBody.ReceiverBalance == (_this.$store.state.vuexStore.channelList[l].SelfBalance)){      //判断通道余额是否正确
            web3.eth.getBlockNumber().then(function(blockNumber){           //获取当前块高
              console.log(blockNumber);
              let DelayBlock = blockNumber + (_this.activeInfo.redata.Router.length - 1) * 4 * 60 * 24;         //1分钟4个块,一天
              console.log(DelayBlock);
              let delayTxData = web3.utils.soliditySha3(         //生成代签名Htlc交易数据
                  {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
                  {t: 'uint256', v: _this.$store.state.vuexStore.channelList[l].TxNonce + 1},                                //TXnonce
                  {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
                  {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
                  {t: 'uint256', v: DelayBlock},                                                                         //锁定块高
                  {t: 'uint256', v: Number(_this.activeInfo.redata.PaymentCount)},                                   //锁定块高
                  {t: 'bytes32', v: _this.activeInfo.redata.MessageBody.HashR}       //对端押金
              );
              console.log(delayTxData);
              console.log(_this.$store.state.vuexStore.txOnChannelInfo.keyStorePass);       
              let delayCommitment = ecSign(delayTxData,decryptPK.privateKey);         //签名

              console.log(delayCommitment); 
              let Message = {                     
                "MessageType": "HtlcSign", 
                "Sender": _this.activeInfo.redata.Receiver,
                "Receiver": _this.activeInfo.redata.Sender,
                "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1, 
                "ChannelName": _this.activeInfo.redata.ChannelName,
                "AssetType": _this.activeInfo.redata.AssetType,  
                "NetMagic": _this.$store.state.vuexStore.NetMagic,
                "Router": _this.activeInfo.redata.Router,
                "Next": _this.activeInfo.redata.Sender,
                "MessageBody": { 
                    "SenderBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - (Number(_this.activeInfo.redata.PaymentCount)), 
                    "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
                    "Commitment": commitment,
                    "Payment": Number(_this.activeInfo.redata.PaymentCount),
                    "DelayBlock": DelayBlock, 
                    "DelayCommitment": delayCommitment, 
                    "HashR": _this.activeInfo.redata.MessageBody.HashR
                },
                "Comments": {},
                "Status": "RESPONSE_OK",
              }
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息

              let R = "";           //获取HashR所对应的R
              console.log("HashR:" + _this.activeInfo.redata.MessageBody.HashR);
              _this.$store.state.vuexStore.RList.forEach(function(data,index){
                  if(data.Hr === _this.activeInfo.redata.MessageBody.HashR){
                    console.log(data.Hr);
                    R = data.R
                  }
                });
              console.log("R:" + R);

              let txListMessage = {                           //txData
                "nonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
                "founder": _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
                "founderBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - (Number(_this.activeInfo.redata.PaymentCount)),
                "peer": _this.$store.state.vuexStore.walletInfo.address,
                "peerBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
                "founderSignedData": _this.activeInfo.redata.MessageBody.Commitment,
                "peerSignedData": commitment,
                "delayBlock": DelayBlock,
                "payment": Number(_this.activeInfo.redata.PaymentCount),
                "HashR": _this.activeInfo.redata.MessageBody.HashR,
                "R": R,
                "founderDelayCommitment": _this.activeInfo.redata.MessageBody.DelayCommitment,
                "peerDelayCommitment": delayCommitment,
              }
              _this.newTxList(_this.activeInfo.redata.ChannelName, txListMessage);                       //更新TxList

              console.log("此处回复RResponse");
              let Message1 = {
                "MessageType":"RResponse",
                "Sender": _this.activeInfo.redata.Receiver,
                "Receiver":_this.activeInfo.redata.Sender,
                "TxNonce": _this.activeInfo.redata.TxNonce,
                "ChannelName":_this.activeInfo.redata.ChannelName,
                "AssetType": _this.activeInfo.redata.AssetType,
                "NetMagic": _this.$store.state.vuexStore.NetMagic,
                "Router":_this.activeInfo.redata.Router,
                "Next":_this.activeInfo.redata.Next,
                "MessageBody": {
                        "RoleIndex":0,
                        "Comments":"",
                        "PaymentCount": _this.activeInfo.redata.PaymentCount,
                        "AssetType": _this.$store.state.vuexStore.AssetType,
                        "R": R,
                        "HashR": _this.activeInfo.redata.MessageBody.HashR
                    }
                }
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message1));        //发送websocket消息

              let channelInfo = _this.$store.state.vuexStore.channelList[l];
              channelInfo.OtherBalance = Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) - (Number(_this.activeInfo.redata.PaymentCount));                        //更新对端余额
              channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
              Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
              console.log(_this.$store.state.vuexStore.channelList[l]);
              _this.StoreData("channelList");           //保存通道信息

              _this.activeInfo.keyStorePass = "";     //清空当前密码
              _this.isReceiptHtlcInfoBox = false;         //关闭当前窗口
              _this.receiptHtlcNotify.close();            //关闭Htlc消息框
            })
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
        console.log(_this.$store.state.vuexStore.txOnChannelInfo.txData);
        if(ecRecover(_this.$store.state.vuexStore.txOnChannelInfo.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名成功时,查询对端余额和Approve情况
          let l = _this.getChannelSerial("ChannelName",_this.$store.state.vuexStore.txOnChannelInfo.ChannelName);
          let channelInfo = _this.$store.state.vuexStore.channelList[l];
          channelInfo.SelfBalance -= redata.MessageBody.Payment;     //本端余额更新
          //channelInfo.OtherBalance += redata.MessageBody.Payment;    //对端余额更新
          channelInfo.TxNonce += 1 ;                                      //TxNoce增加1
          Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
          console.log(_this.$store.state.vuexStore.channelList[l]);
          _this.StoreData("channelList");           //保存通道信息
          _this.getChannelBalance();              //更新通道余额

          let txListMessage = {                           //txData
            "nonce": _this.$store.state.vuexStore.channelList[l].TxNonce,
            "founder": _this.$store.state.vuexStore.walletInfo.address,
            "founderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
            "peer": _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0],
            "peerBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance),
            "founderSignedData": _this.$store.state.vuexStore.txOnChannelInfo.selfSignedData,
            "peerSignedData": redata.MessageBody.Commitment,
            "delayBlock": redata.MessageBody.DelayBlock,
            "payment": Number(redata.MessageBody.Payment),
            "HashR": redata.MessageBody.HashR,
            "R": "",
            "founderDelayCommitment": _this.$store.state.vuexStore.txOnChannelInfo.selfDelaySignedData,
            "peerDelayCommitment": redata.MessageBody.DelayCommitment,
          }
          _this.newTxList(redata.ChannelName, txListMessage);                      //更新TxList

          let eventMessage = {
            "messageType": "monitorSendUnlockAmount", 
            "baseChain": "ETH", 
            "channelName": redata.ChannelName,
            "blockNumber": redata.MessageBody.DelayBlock,
            "HashR": redata.MessageBody.HashR,
            "data": txListMessage, 
          }
          _this.$store.state.vuexStore.eventList.push(eventMessage);
          _this.StoreData("eventList");
        } else {                  //当Status不为OK时,删除通道
          console.log(redata.Status);
          _this.$notify.error({
            title: _this.$t('common.warning'),
            dangerouslyUseHTMLString: true,
            message: redata.Status,
            duration: 3000
          });
        }
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
      if(hr == _this.$store.state.vuexStore.txOnChannelInfo.hr){           //比较R是否正确,开始R交易
        console.log("进入R交易");
        let MessageBody = redata.MessageBody;

        let txListMessage = {                           //txData
          "R": redata.MessageBody.R,
        }
        _this.updateTxList(redata.ChannelName, txListMessage, redata.MessageBody.HashR);                        //更新TxList
        
        let l = _this.getChannelSerial("ChannelName",redata.ChannelName);
        if(l >= 0){              //当l为正确值时
          console.log(l);
          console.log(_this.$store.state.vuexStore.txOnChannelInfo);
          let Message = {                           //回复RResponseAck
            "MessageType":"RResponseAck",
            "Sender": _this.$store.state.vuexStore.txOnChannelInfo.sendUri,
            "Receiver": redata.Sender,
            "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
            "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
            "MessageBody": {
              "HashR": redata.MessageBody.HashR,
              "R": redata.MessageBody.R,
              "PaymentCount": Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee)
            },
            "Comments": {}
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息

          let Message1 = {    
            "MessageType":"Rsmc",
            "Sender": _this.$store.state.vuexStore.txOnChannelInfo.sendUri,
            "Receiver": redata.Sender,
            "TxNonce": _this.$store.state.vuexStore.channelList[l].TxNonce + 1,
            "ChannelName": _this.$store.state.vuexStore.channelList[l].ChannelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "AssetType": _this.$store.state.vuexStore.txOnChannelInfo.assetType,
            "MessageBody": {
              "PaymentCount": Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
              "SenderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance),
              "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.$store.state.vuexStore.txOnChannelInfo.value) + Number(_this.$store.state.vuexStore.txOnChannelInfo.fee),
              "HashR": redata.MessageBody.HashR,
              "Commitment": ""
            },
            "Comments": {}
          }
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message1));        //发送websocket消息

          _this.StoreData("channelList");           //保存通道信息                                
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
      // Receiver:"0xBF9905c03Ce89fc1666d3701B88a87b647b074af@106.15.91.150:8866"
      // Sender:"0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089"
      // TxNonce:4294967295
      // }
      var _this = this;
      let l = _this.getChannelSerial("ChannelName", redata.ChannelName,'open');      //获取所需的channel在List的位置
      if(l == -1){          //当l为-1时,未遍历到通道
        _this.$notify.error({
          title: _this.$t('common.warning'),
          dangerouslyUseHTMLString: true,
          message: _this.$t('common.callback-17'),
          duration: 3000
        });
        return false;
      } else if (l == -2){    //当l为-2时,通道未打开或者未连接websocket
        _this.$notify.error({
          title: _this.$t('common.warning'),
          dangerouslyUseHTMLString: true,
          message: _this.$t('common.callback-18'),
          duration: 3000
        });
        return false;
      } else{
        _this.activeInfo.redata = redata;   //保存redata消息
        _this.activeInfo.redata.ReceiverBalance = redata.MessageBody.ReceiverBalance;         //将消息保存在redata层,防止模态框报错
        _this.activeInfo.redata.SenderBalance = redata.MessageBody.SenderBalance;         //将消息保存在redata层,防止模态框报错
        
        _this.$notify.info({
            title: _this.$t('common.info'),
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: _this.$store.state.vuexStore.channelList[l].Alice + _this.$t('common.callback-19'),
            onClick: showDialog
        });
        function showDialog(){                          //显示接收信息框
            _this.activeInfo.redata = data;
            console.log(_this.activeInfo.redata);
            _this.isSettleInfoBox = true;
        }
      }
    },
    SettleSign() {          //进入SettleSign,开始对交易数据签名
      let _this = this;
      console.log(_this.activeInfo.redata);
      _this.$refs['activeInfo'].validate((valid) => {
        if (valid) {
          let l = _this.getChannelSerial("ChannelName", _this.activeInfo.redata.ChannelName,'open'); //获取所需的channel在List的位置

          let txData = web3.utils.soliditySha3(         //生成代签名交易数据
              {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[l].ChannelName},    //通道名称
              {t: 'uint256', v: 0},                                //TXnonce
              {t: 'address', v: _this.$store.state.vuexStore.channelList[l].OtherUri.split("@")[0]},                 //本端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].OtherBalance)},       //本端押金
              {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                                    //对端地址
              {t: 'uint256', v: Number(_this.$store.state.vuexStore.channelList[l].SelfBalance)}       //对端押金
          );
          console.log(txData);

          let decryptPK = _this.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, _this.activeInfo.keyStorePass);        //解锁钱包用于签名          
          let selfSignedData = ecSign(txData,decryptPK.privateKey);         //对交易数据进行签名
          console.log(selfSignedData); 

          if(_this.activeInfo.redata.SenderBalance == _this.$store.state.vuexStore.channelList[l].OtherBalance && _this.activeInfo.redata.ReceiverBalance == _this.$store.state.vuexStore.channelList[l].SelfBalance){      //判断通道余额是否正确

            let Message = {                           //构造SettleSign消息
                MessageType: "SettleSign",
                NetMagic: _this.activeInfo.redata.NetMagic,
                Receiver: _this.activeInfo.redata.Sender,
                Sender: _this.activeInfo.redata.Receiver,
                ChannelName: _this.activeInfo.redata.ChannelName,
                AssetType: _this.activeInfo.redata.MessageBody.AssetType,
                MessageBody:{
                  Commitment: selfSignedData
                },
                Status:"RESPONSE_OK",
                TxNonce: 0,
            }
            _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
            _this.isSettleInfoBox = false;          //清楚数据
            _this.activeInfo = {
              "redata": [], 
              "txData": '',
              "keyStorePass": ''
            };
          } else {
              console.log('error submit!!');
              return false;
          }
        }
      })
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
      if(redata.Status == "RESPONSE_OK"){     //当Status为OK时，上链并提交给全节点监控
        console.log(_this.$store.state.vuexStore.closeChannelInfo.txData);
        if(ecRecover(_this.$store.state.vuexStore.closeChannelInfo.txData, redata.MessageBody.Commitment, redata.Sender.split("@")[0].toLowerCase())){       //验证签名成功时,查询对端余额和Approve情况
              
          let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes','bytes']; 
          let dataList = [
            _this.$store.state.vuexStore.closeChannelInfo.ChannelName, 
            0, 
            _this.$store.state.vuexStore.walletInfo.address, 
            Number(_this.$store.state.vuexStore.closeChannelInfo.SelfBalance),
            _this.$store.state.vuexStore.closeChannelInfo.OtherUri.split("@")[0], 
            Number(_this.$store.state.vuexStore.closeChannelInfo.OtherBalance), _this.$store.state.vuexStore.closeChannelInfo.selfSignedData, 
            redata.MessageBody.Commitment
          ];
          let signedData = await _this.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "quickCloseChannel", dataTypeList, dataList, _this.$store.state.vuexStore.closeChannelInfo.keyStorePass);               //签名
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
        _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
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
          _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message1));        //发送websocket消息
        });
        _this.$store.state.vuexStore.channelList[l].transactionHash = MessageBody.Founder.txId;
        // _this.TxList.push(MessageBody);
        // _this.StoreFounder();
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
    reconnectWebsocket (Ip,ChannelName){
      let _this = this;
      const wsuri = "ws://" + Ip + "/";
      var l = _this.getChannelSerial('ChannelName',ChannelName);
      console.log(l);
      if(l >= 0){             //如果未检测到通道,给出提醒
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
    StoreData(dataType) {              //储存数据通用方法
      console.log(this.$store.state.vuexStore[dataType]);
      if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
        this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@" + dataType,this.$store.state.vuexStore[dataType]);
      } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
        this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@" + dataType,this.$store.state.vuexStore[dataType]);
      }
    },
    // StoreChannel() {              //储存ChannelList
    //   console.log(this.$store.state.vuexStore.channelList);
    //   if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList",this.$store.state.vuexStore.channelList);
    //   } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@channelList",this.$store.state.vuexStore.channelList);
    //   }
    // },
    // StoreTxList() {              //储存交易数据
    //   console.log(this.$store.state.vuexStore.txList);
    //   if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@txList",this.$store.state.vuexStore.txList);
    //   } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@txList",this.$store.state.vuexStore.txList);
    //   }
    // },
    // StoreRecordList() {           //localstorage储存Record信息
    //   console.log(this.$store.state.vuexStore.recordList);
    //   if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@recordList",this.$store.state.vuexStore.recordList);
    //   } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@recordList",this.$store.state.vuexStore.recordList);
    //   }
    // },
    // StoreRList() {                //localstorage储存R与对应hashR信息
    //   console.log(this.$store.state.vuexStore.RList);
    //   if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@RList",this.$store.state.vuexStore.RList);
    //   } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@RList",this.$store.state.vuexStore.RList);
    //   }
    // },
    // StoreEventList() {             //localstorage储存监控的event信息
    //   console.log(this.$store.state.vuexStore.eventList);
    //   if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@eventList",this.$store.state.vuexStore.eventList);
    //   } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
    //     this.saveAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@eventList",this.$store.state.vuexStore.eventList);
    //   }
    // },
    newTxList(channelName, data) {  //更新TxList,参数1为通道名称,参数2为更新的json数据, 参数3选填,用于更新H交易数据
      let _this = this;
      _this.$store.state.vuexStore.txList.forEach(function(value, index){
        if(value.channelName == channelName){
            console.log("增加交易数据");
            value.history.push(data);
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
/* 通用标题栏样式开始 */
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    padding: 15px 20px;
    box-sizing: border-box;
    display: flex;
    color: #FFFFFF;
    padding: 0 20px;
}
.header-button{
    flex: .5;
    width: 100%;
    max-width: 70px;
    font-size: 26px;
    height: 56px;
    line-height: 56px;
}
.headBox h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 56px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.is-left{
  float: left;
}
.is-right{
  float: left;
}
/* 通用标题栏样式结束 */
.el-badge__content.is-fixed {             /* footer栏消息标记位置调整 */
  top: 5px;
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
  /* .rightBox{
    right: -300px;
  } */
  /* .fullPage{
    width: 100% !important;
    right: 0 !important;
  } */
  .mask{                  /* 蒙板 */
    width: calc(100% - 300px);
    height: 100vh;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }
  .tabbar{
    right: -300px;
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
  max-width: 440px;
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
.footer .el-menu--horizontal>.el-menu-item {
  /* height: 48px; */
  line-height: 23px;
}
/* .footer .el-menu--horizontal {
  border-top: solid 2px RGBA(248, 248, 248, 1.00);
  border-bottom: solid 2px #e6e6e6;
} */
.footer .el-menu{
  background-color: transparent;
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
.cell:hover{
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
/* 通用右侧进入动画 */
/* .rightIn-enter-active,.rightIn-leave-active {
  transition: all .7s ease;
}
.rightIn-enter, .rightIn-leave-to{
  transform: translateX(100%);
  opacity: 0;
} */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.6s ease;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
}
.slide-right-enter-to {
  opacity: 1;
}
.slide-right-leave-active {
  transform: translate3d(0, 0, 0);
}
.slide-right-leave-to{
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  transform: translate3d(0, 0, 0);
}
</style>
