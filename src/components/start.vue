<template>
  <div class="startForm">
    <div class="contentBox">
        <div>
            <div class="chainIconBox" style="">
                <p>切换主链:</p>
                <i @click="switchNet('ETH')" :class="{ active: $store.state.vuexStore.baseChain == 'ETH' }" class="el-icon-ETH-ETH"></i>
                <i @click="switchNet('NEO')" :class="{ active: $store.state.vuexStore.baseChain == 'NEO' }" class="el-icon-ETH-NEO"></i>
            </div>
            <h2>{{ $t('start.title') }}</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div @click="toOtherForm('./create')" class="clooseLoginBox clooseLoginBox-blue">
            <h3>{{ $t('start.createWallet') }}</h3>
            <p>{{ $t('start.createWalletTxt') }}</p>
        </div>
        <div @click="toOtherForm('./loginByPrivateKey')" class="clooseLoginBox clooseLoginBox-green">
            <h3>{{ $t('start.loginByPrivateKey') }}</h3>
            <p>{{ $t('start.loginByPrivateKeyTxt') }}</p>
        </div>
        <div @click="toOtherForm('./loginByKeyStore')" class="clooseLoginBox clooseLoginBox-gray">
            <h3>{{ $t('start.loginByKeystore') }}</h3>
            <p>{{ $t('start.loginByKeystoreTxt') }}</p>
        </div>
        <a @click="switchLang()" class="backToStartBtn">{{$t('navMenu.setting.switchLang')}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'startForm',
  data () {
    return {

    }
  },
  methods: {
      toOtherForm(router) {
        this.$router.push(router);
      },
      switchLang() {      //切换语言
        this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        this.$parent.saveAsString("lang",this.$i18n.locale);
      },
      switchNet(Base) {        //切换网络
        let _this = this;
        _this.$store.state.vuexStore.NodeUriWebSocket.close();
        _this.$store.state.vuexStore.baseChain = Base;

        if(_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "ETH"){          //ETH测试网
          console.log("切换到ETH测试网");
          web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/5a89dae544414c24951c3144d47dc84d")); 
          _this.$store.state.vuexStore.NetMagic = "527465737419990331";                                                //修改网络号
          _this.$store.state.vuexStore.tncContractAddress = "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218";            //修改token合约地址
          _this.$store.state.vuexStore.trinityContractAddress = "0xB38758094373f9C6651a765e7bbB38722a07c63a";        //修改trinity合约地址
          _this.$store.state.vuexStore.trinityDataContractAddress = "0xF928BA6a908207BF6C0Cd73eba2f165B6115AbD9";    //修改trinity合约地址
          _this.$store.state.vuexStore.NodeUriWebSocket = "47.104.81.20:9000";                                       //修改全节点IP
        } else if(!_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "ETH"){        //ETH主网
          console.log("切换到ETH主网");
          web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/5a89dae544414c24951c3144d47dc84d"));
          _this.$store.state.vuexStore.NetMagic = "4061696020030515";                                                //修改网络号
          _this.$store.state.vuexStore.tncContractAddress = "0xc9ad73d11d272c95b5a2c48780a55b6b3c726cac";            //修改token合约地址
          _this.$store.state.vuexStore.trinityContractAddress = "0x7A332beF593d6bd6B9d314959295239c46D5C127";        //修改trinity合约地址
          _this.$store.state.vuexStore.trinityDataContractAddress = "0xF8ac6d07e825338720bC7D3ee119B3C88560FaF5";    //修改trinity合约地址
          _this.$store.state.vuexStore.NodeUriWebSocket = "47.97.96.192:9000";                                       //修改全节点IP
        } else if(_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "NEO"){        //NEO测试网
          console.log("切换到NEO测试网");
          _this.$store.state.vuexStore.NetMagic = "195378745719990331";                                                //修改网络号
          _this.$store.state.vuexStore.NodeRpcUri = "http://47.254.64.251:21332";                                      //全节点通用Uri
          //_this.$store.state.vuexStore.NodeSendrawUri = "http://47.254.64.251:20332";                                  //全节点上链Uri
        } else if(!_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "NEO"){ 
          console.log("切换到NEO主网");
          _this.$store.state.vuexStore.NetMagic = "195378745719990331";                                                //修改网络号
          _this.$store.state.vuexStore.NodeRpcUri = "http://47.96.175.193:21332";                                      //全节点通用Uri
          //_this.$store.state.vuexStore.NodeSendrawUri = "http://47.96.175.193:10332";                                  //全节点上链Uri
        } else {
          console.log("切换网络错误");
        }
        if(_this.$store.state.vuexStore.baseChain == "ETH"){                //当ETH时连接全节点websocket
            setTimeout(function (){                                           //修改全节点IP
                _this.$parent.connectWebSocketForNodeUri(); 
            },1500);

            setTimeout(function (){                                           //修改全节点IP
            if(_this.$store.state.vuexStore.isLogin == true){
                let Message = {
                    "messageType":"init", 
                    "walletAddress":_this.$store.state.vuexStore.walletInfo.address
                }
                _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
                _this.cycleReconnectWebsocket();
            }
            },3000);
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.startForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
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
.chainIconBox{
    height: 27px;
    line-height: 26px;
    float:right;
}
.chainIconBox p{
    margin: 0;
    font-size: 16px;
    line-height: 27px;
    display: inline-block;
}
.chainIconBox i{
    font-size: 27px;
    color: #DCDFE6;
    cursor: pointer;
}
.chainIconBox .el-icon-ETH-ETH.active{
    color: RGBA(30, 64, 122, 1.00);
}
.chainIconBox .el-icon-ETH-NEO.active{
    color: RGBA(89, 191, 1, 1.00);
}
.clooseLoginBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
}
.clooseLoginBox-blue{
    background-color: #ecf8ff;
    border-left: 5px solid #50bfff;
}
.clooseLoginBox-green{
    background-color: #f0f9eb;
    border-left: 5px solid #67c23a;
}
.clooseLoginBox-gray{
    background-color: #f4f4f5;
    border-left: 5px solid #909399;
}
.clooseLoginBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    font-size: 18px;
    /* border-bottom: 1px solid #CCCCCC; */
}
.clooseLoginBox p{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
.fade-in-out-enter-active, .fade-in-out-leave-active {
  transition: 10s;
}
.fade-in-out-enter, .fade-in-out-leave-to {
  width: calc(100% - 300px);
  opacity: 1;
}
.fade-in-out-leave, .fade-in-out-enter-to {
  width: 100%;
  opacity: 1;
}
</style>
