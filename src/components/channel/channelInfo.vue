<template>
  <div class="channelInfoForm">
    <headBox/>
    <div class="contentBox">
        <h2>{{ Data.Alice }} - 通道信息</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <p>{{ $t('channelList.channelName') }}：{{ Data.ChannelName }}</p>
        <p>{{ $t('channelList.date') }}：{{ Data.date | formatDateTime }}</p>
        <p>{{ $t('channelList.selfUri') }}：{{ Data.SelfUri }}</p>
        <p>{{ $t('channelList.selfBalance') }}：{{ Data.SelfBalance | formatBalance }}</p>
        <p>{{ $t('channelList.otherUri') }}：{{ Data.OtherUri }}</p>
        <p>{{ $t('channelList.otherBalance') }}：{{ Data.OtherBalance | formatBalance }}</p>
        <p>{{ $t('channelList.channelState') }}：{{ Data.State | formatStatus }}</p>
        <p>{{ $t('channelList.isConnect') }}：{{ Data.isConnect | formatConnect }}<a @click="reconnectWebsocket()" v-if="!Data.isConnect" style="color:#F56C6C;margin-left:10px;cursor: pointer;">Reconnect</a></p>
        <!-- <p>{{ $t('channelList.isTestNet') }}：{{ Data.isTestNet }}</p> -->
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div class="closeBox"  v-if="!isConfirmCloseChannel">
            <div class="buttonBox">
                <div style="height:88px;;width:100%;"></div>
                <div @click="isConfirmCloseChannel = true" class="button-item">
                    <i class="el-icon-ETH-icon_wrong"></i>
                    <p>关闭通道</p>
                </div>
                <div @click="$router.go(-1)" class="button-item">
                    <i class="el-icon-ETH-fanhui1"></i>
                    <p>返回</p>
                </div>
            </div>
        </div>
        <div class="closeBox" v-else>
            <el-form :model="channelInfo" status-icon :rules="confirmCloseRules" ref="channelInfo" class="demo-ruleForm">
                <p style="text-align:left;color:#F56C6C;">是否确认关闭通道?</p>
                <!-- <span style="font-size:14px;text-align:left;">如果无法正常关闭通道,你可以选择<a @click="forcedCloseChannel()" style="color:#F56C6C;cursor: pointer;text-decoration: underline;">强制关闭 </a>,但是你将承担额外的费用和被制裁的风险</span> -->
                <el-form-item prop="keyStorePass">
                    <el-input v-model="channelInfo.keyStorePass" :placeholder="$t('channelList.inputPassword')" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;margin-left: -80px;">
                    <!-- <div>
                        <i @click="showConfirmCloseChannelData()" class="el-icon-ETH-icon_wrong"></i>
                        <i @click="closeChannel()" class="el-icon-ETH-zhengque1"></i>
                        <i @click="isChannelInfoBoxShow = false;isConfirmCloseChannel = false;" class="el-icon-ETH-fanhui1"></i>
                    </div> -->
                </el-form-item>
                <div class="buttonBox">
                    <div @click="closeChannel()" class="button-item">
                        <i class="el-icon-ETH-zhengque1"></i>
                        <p>确认</p>
                    </div>
                    <div @click="isConfirmCloseChannel = false;" class="button-item">
                        <i class="el-icon-ETH-fanhui1"></i>
                        <p>返回</p>
                    </div>
                </div>
            </el-form>            
        </div>
        
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'channelInfoForm',
  data () {
    var validatePass = (rule, value, callback) => {         //create 密码输入规则
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        let PrivateKey = this.$parent.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore,this.channelInfo.keyStorePass);
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error('钱包解锁失败 - 可能是密码错误'));
            }
        }, 500);
      }
    };
    return {
        isConfirmCloseChannel: false,
        channelInfo: {
          keyStorePass: ''
        },
        confirmCloseRules: {        //create 输入规则
          keyStorePass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
    }
  },
  components: {
    headBox
  },
  computed:{
      Data() {                       //获取vuex中的channelList赋值给channelList
          if(this.$route.params.Data){
              return this.$route.params.Data;
          } else {
            let Data1 = {
                Alice: "",
                ChannelName : "",
                date: "",
                SelfUri: "",
                SelfBalance: "",
                OtherUri: "",
                OtherBalance: "",
                State: "",
                isConnect: "",
                isTestNet: ""
            }
            return Data1;
          }
      }
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时连接至全节点
        console.log(this.$route.params.Data);
        if(!this.$route.params.Data){
            this.$router.push('/start');
        }
    })
  },
  watch: {

  },
  filters:{
    formatStatus:function(val){         //格式化Channel状态
      let x;
      switch (val)
      {
      case 1:
        x="Closing";
        break;
      case 2:
        x="Opening";
        break;
      case 3:
        x="Open";
        break;
      default:
        x="Error";
      }
      return x;
    },
    formatDateTime:function(val) {          //格式化时间戳
        let date = new Date();
        date.setTime(val);
        let yy = date.getFullYear();    
        let mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        let dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    },
    formatBalance:function(val) {          //格式化余额
        let result;
        if(val < 0 || isNaN(val)){
            result = "error"; 
        } else {
            result = val / 10e7;
        }
        return result;
    },
    formatConnect:function(val) {          //格式化连接状态
        let result;
        if(val){
            result = "True";
        } else {
            result = "False";
        }
        return result;
    },
    formatNet:function(val) {          //格式化网络
        let result;
        if(val){
            result = "TestNet";
        } else {
            result = "MainNet";
        }
        return result;
    }
  },
  methods: {
    reconnectWebsocket() {         //重连websocket
        this.$parent.$parent.reconnectWebsocket(this.Data.Ip + ":8866", this.Data.ChannelName);
        //this.isChannelInfoBoxShow = false;
    },
    closeChannel() {                //快速关闭通道
      let _this = this;
      _this.$refs['channelInfo'].validate((valid) => {
        if (valid) {
          let l = _this.$parent.$parent.getChannelSerial('ChannelName',_this.Data.ChannelName);
          console.log(l);
          if(l >= 0){                //检测到通道,开始关闭通道
            console.log(_this.$store.state.vuexStore.channelList[l].isConnect);
            if(_this.$store.state.vuexStore.channelList[l].transactionHash == undefined){     //删除无用通道
              _this.isChannelInfoBoxShow = false;                 //关闭当前窗口
              _this.isConfirmCloseChannel = false;                //关闭确认窗口
              _this.$store.state.vuexStore.channelList.splice(l,1);           //删除通道数据
              _this.channelInfo.keyStorePass = "";             //清楚数据
            } else {
                let txData = web3.utils.soliditySha3(         //生成代签名交易数据
                  {t: 'bytes32', v: _this.Data.ChannelName},                                             //通道名称
                  {t: 'uint256', v: 0},                                                                        //TXnonce
                  {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},                          //本端地址
                  {t: 'uint256', v: _this.Data.SelfBalance},                                             //本端押金
                  {t: 'address', v: _this.Data.OtherUri.split("@")[0]},                                  //对端地址
                  {t: 'uint256', v: _this.Data.OtherBalance}                                             //对端押金
                );
                console.log(txData);

                let decryptPK = _this.$parent.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.channelInfo.keyStorePass);        //解锁钱包用于签名          
                let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
                console.log(selfSignedData); 

                let Message = {
                  "MessageType":"Settle",
                  "Sender": _this.Data.SelfUri,
                  "Receiver": _this.Data.OtherUri,
                  "TxNonce": 0,              
                  "ChannelName": _this.Data.ChannelName,
                  "AssetType": _this.Data.assetType,
                  "NetMagic": _this.$store.state.vuexStore.NetMagic,
                  "MessageBody": {
                    "Commitment": selfSignedData,
                    "SenderBalance": _this.Data.SelfBalance,
                    "ReceiverBalance": _this.Data.OtherBalance
                    },
                    "Comments": {}
                  }
                  _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送消息
                  _this.$store.state.vuexStore.closeChannelInfo = _this.Data;
                  _this.$store.state.vuexStore.closeChannelInfo.txData = txData;
                  _this.$store.state.vuexStore.closeChannelInfo.keyStorePass = _this.channelInfo.keyStorePass;
                  console.log(_this.$store.state.vuexStore.closeChannelInfo.txData);
                  _this.$store.state.vuexStore.closeChannelInfo.selfSignedData = selfSignedData;
                  _this.$store.state.vuexStore.channelList[l].State = 1;              //通道状态改为closing
                  _this.$router.go(-1);                         //返回上个页面
                }
            }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    forcedCloseChannel() {              //强制关闭通道
        this.$refs['channelInfo'].validate((valid) => {
            if (valid) {
                let l = this.$parent.$parent.getChannelSerial('ChannelName',this.Data.ChannelName);
                console.log(l);
                if(l >= 0){             //检测到通道,开始关闭通道              
                    console.log('进入强制拆通道');
                    this.forcedCloseChannelFun();   //用于element表单认证里使用await报错
                }
            }
        })
    },
    async forcedCloseChannelFun() {             //用于element表单认证里使用await报错
        let _this = this;
        
        let selfSignedData,otherSignedData,HashR,R;
        _this.$store.state.vuexStore.txList.forEach(function(data,index){
            if(data.channelName == _this.Data.ChannelName && data.history[data.history.length - 1].founderSignedData && data.history[data.history.length - 1].peerSignedData){
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
                HashR = data.history[data.history.length - 1].HashR;
                R = data.history[data.history.length - 1].R;
            }
        })

        let dataTypeList = ['bytes32','uint256','address','uint256','address','uint256','bytes32','bytes32','bytes','bytes']; 
        let dataList = [
            _this.Data.ChannelName, 
            _this.Data.TxNonce, 
            _this.$store.state.vuexStore.walletInfo.address, 
            _this.Data.SelfBalance, 
            _this.Data.OtherUri.split("@")[0], 
            _this.Data.OtherBalance, 
            "0x" + HashR, 
            "0x" + R, 
            selfSignedData, 
            otherSignedData
        ];
        let signedData = await _this.$parent.$parent.signDataForERC20Contract(_this.$store.state.vuexStore.trinityContractAddress, "closeChannel", dataTypeList, dataList, _this.channelInfo.keyStorePass);               //签名
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
            let l = _this.$parent.$parent.getChannelSerial('ChannelName', _this.Data.ChannelName);
            let channelInfo = _this.$store.state.vuexStore.channelList[l];              //更改通道状态
            channelInfo.State = 1;
            Vue.set(_this.$store.state.vuexStore.channelList, l, channelInfo);
            console.log(_this.$store.state.vuexStore.channelList[l]);
            _this.$parent.$parent.StoreData("channelList");                   //储存通道信息

            _this.isChannelInfoBoxShow = false;
            _this.isConfirmCloseChannel = false;
            _this.$parent.$parent.cycleGetTransactionReceipt(hash);
            return;
        })
        .on('receipt', console.log)
        .on('error', function(error){
            console.log(error);
            return;
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelInfoForm{
    float: left;
    height: calc(100% - 55px);
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    z-index: 3;
}
.contentBox{
    height: calc(100% - 56px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h2{
    margin: 0;
    font-size: 24px;
}
h4{
    font-size: 16px;
}
p{
    font-size: 14px;
    line-height: 16px;
    word-break: break-all;
}
.channelInfoForm .el-form-item {            /*  减少form的margin */
    margin-bottom: 5px;
}
.closeBox{
    /* position: absolute;
    bottom: 10px;
    left: 0;
    right: 0; */
}
.buttonBox{
    text-align: center;
}
.button-item{
    margin: 0 10%;
    width: 60px;
    text-align: center;
    display: inline-block;
    
}
.button-item p {
    font-size: 12px;
    margin: 10px 0 0 0;
}
.buttonBox i{
    color:#FFFFFF;
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 36px;
    text-align: center; 
    border-radius: 50%; 
}
.el-icon-ETH-fanhui1{
    background: #409EFF;
}
.el-icon-ETH-icon_wrong{
    background: #909399;
}
.el-icon-ETH-zhengque1{
    background: #F56C6C;
}
</style>
