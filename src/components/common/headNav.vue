<template>
    <nav>
        <h1 @click="testFun()">{{$t('navMenu.title')}}</h1>
        <el-row class="tac">
            <el-col :span="24">
                <el-menu :default-active="navSelected" :active="navSelected" @select="selectItems" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-ETH-32"></i>
                    <span>{{$t('navMenu.wallet.title')}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item @click="toOtherForm('/')" index="1-1">
                            <i class="el-icon-ETH-geren1"></i>
                            <span slot="title">{{$t('navMenu.wallet.index')}}</span>
                        </el-menu-item>
                        <el-menu-item @click="toOtherForm('/receive')" index="1-2">
                            <i class="el-icon-ETH-zhuanzhang"></i>
                            <span slot="title">{{$t('navMenu.wallet.receive')}}</span>
                        </el-menu-item>
                        <el-menu-item @click="toOtherForm('/channelList')" index="1-3">
                            <i class="el-icon-ETH-list"></i>
                            <span slot="title">{{$t('navMenu.wallet.channelList')}}</span>
                        </el-menu-item>
                        <el-menu-item @click="toOtherForm('/record')" index="1-4">
                            <i class="el-icon-ETH-dujiayuniconzhenggao-19"></i>
                            <span slot="title">{{$t('navMenu.wallet.record')}}</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item @click="toOtherForm('/contact')" index="2">
                    <i class="el-icon-ETH-lianxiren"></i>
                    <span slot="title">{{$t('navMenu.contact')}}</span>
                </el-menu-item>
                <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>{{$t('navMenu.setting.title')}}</span>
                    </template>
                    <el-menu-item-group>
                    <el-menu-item @click="switchLang()" index="3-1">
                        <i :class="classObject"></i>
                        <span>{{$t('navMenu.setting.switchLang')}}</span>
                    </el-menu-item>
                    <el-submenu index="3-2" disabled>
                        <template slot="title">
                            <i class="el-icon-ETH-wangluo"></i>
                            <span>{{$t('navMenu.setting.switchNet')}}</span>
                        </template>
                        <el-menu-item @click="switchNet('Mainnet')" index="3-2-1">Mainnet</el-menu-item>
                        <el-menu-item @click="switchNet('Ropsten')" index="3-2-2">Ropsten</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3-3" style="position: relative;" disabled>
                            <i class="el-icon-ETH-pifu"></i>
                            <span>{{$t('navMenu.setting.nightMode')}}
                                <el-switch v-model="isNightMode" style="position: absolute;top:50%;right:45px;margin-top: -9px;" active-color="#F8D163" disabled>
                                </el-switch>
                            </span>
                    </el-menu-item>
                    <el-menu-item index="3-4" disabled>
                        <i class="el-icon-ETH-xiugaimima"></i>
                        <span>{{$t('navMenu.setting.changePass')}}</span>
                    </el-menu-item>
                    <el-menu-item @click="toOtherForm('/backup')" index="3-5">
                        <i class="el-icon-ETH-fuzhi"></i>
                        <span>{{$t('navMenu.setting.backup')}}</span>
                    </el-menu-item>
                    <el-menu-item index="3-6">
                        <i class="el-icon-ETH-tuichu"></i>
                        <span slot="title">{{$t('navMenu.setting.signOut')}}</span>
                    </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item @click="toOtherForm('/about')" index="4">
                    <i class="el-icon-ETH-xinxi"></i>
                    <span slot="title">{{ $t('navMenu.about') }}</span>
                </el-menu-item>
                <!-- <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>测试功能</span>
                    </template>
                    <el-menu-item-group>
                        <router-link to="/start">
                            <el-menu-item index="4-1">
                                <i class="el-icon-setting"></i>
                                <span slot="title">开始页</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/create">
                            <el-menu-item index="4-2">
                                <i class="el-icon-setting"></i>
                                <span slot="title">创建</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/login">
                            <el-menu-item index="4-3">
                                <i class="el-icon-setting"></i>
                                <span slot="title">导入</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/addChannel">
                            <el-menu-item index="4-4">
                                <i class="el-icon-ETH-tianjia"></i>
                                <span slot="title">{{$t('navMenu.wallet.addChannel')}}</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/index6">
                            <el-menu-item index="4-5">
                                <i class="el-icon-setting"></i>
                                <span slot="title">私钥转地址</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/loginByKeyStore">
                            <el-menu-item index="4-6">
                                <i class="el-icon-setting"></i>
                                <span slot="title">由KeyStore导入</span>
                            </el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </el-submenu> -->
                </el-menu>
            </el-col>
        </el-row>
    </nav>
</template>

<script>
export default {
  name: 'LeftNav',
  data () {
    return {
      isLogin: false,
      isNightMode: false,
      navSelected: "1-1"          //当前active Nav
    }
  },
  computed: {
    classObject: function () {      //中英文切换对应图标
        return {
            'el-icon-ETH-yingwenyuyan': this.$i18n.locale === 'cn',
            'el-icon-ETH-zhongwenyuyan': this.$i18n.locale === 'en'
        }
    }
  },
  watch: {
    isNightMode(newValue, oldValue) { 
        let _this = this;
        console.log("当前夜间模式为" + newValue);
        _this.$store.state.vuexStore.isNightMode = newValue;
        _this.$parent.saveAsString("isNightMode",_this.$store.state.vuexStore.isNightMode);
    },
    '$store.state.vuexStore.activeNavIndex': 'storeToNav',           // 监测store中的activeNavIndex
    '$store.state.vuexStore.walletInfo.address': 'getAddressInfo'            // 监测store中的address,出现变化时获取相关信息
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        let _this = this;
        _this.$store.state.vuexStore.isLogin = _this.$parent.fetchAsArray("isLogin");
        console.log("当前登陆状态为" + _this.$store.state.vuexStore.isLogin);
        // console.log(!_this.$store.state.vuexStore.isLogin);
        _this.isNightMode = _this.$parent.fetchAsString("isNightMode");
        if(!_this.$store.state.vuexStore.isLogin || _this.$store.state.vuexStore.isLogin == ""){
            _this.$router.push('/start');
        }
    })
  },
  methods: {
    switchLang() {      //切换语言
        this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        this.$parent.saveAsString("lang",this.$i18n.locale);
    },
    switchNightMode() {     //切换夜间模式
        this.$store.state.vuexStore.isNightMode === false ? this.$store.state.vuexStore.isNightMode = true : this.$store.state.vuexStore.isNightMode = false;
        this.$parent.saveAsString("isNightMode",this.$store.state.vuexStore.isNightMode);
    },
    switchNet(Net) {        //切换网络
        console.log("切换到" + Net);
    },
    storeToNav() {      //传递activeNavIndex
        this.navSelected = this.$store.state.vuexStore.activeNavIndex;
    },
    selectItems(index){     //Nav选中之后设置store里的值为当前的index
        this.$store.state.vuexStore.activeNavIndex = index;        
    },
    toOtherForm(router) {        //跳转页面时判断是否登录
        if(!this.$store.state.vuexStore.isLogin || this.$store.state.vuexStore.isLogin == ""){
            this.$router.push('/start');
        } else {
            this.$router.push(router);
        }
    },
    testFun() {      //切换登录状态并保存，用于测试
        // this.$store.state.vuexStore.channelList = [];
        // this.$parent.StoreChannel();
        // return false;
        let _this = this;
        let txData = web3.utils.soliditySha3(         //生成代签名交易数据
            {t: 'bytes32', v: _this.$store.state.vuexStore.channelList[0].ChannelName},    //通道名称
            {t: 'uint256', v: 1},                                   //TXnonce
            {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},       //本端地址
            {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].SelfBalance - (0.2 * 10e7)},       //本端押金
            {t: 'address', v: _this.$store.state.vuexStore.channelList[0].OtherUri.split("@")[0]},                       //对端地址
            {t: 'uint256', v: _this.$store.state.vuexStore.channelList[0].OtherBalance + (0.2 * 10e7)}       //对端押金
        );
        console.log(txData);

        let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,"123");        //解锁钱包用于签名          
        let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
        console.log(selfSignedData); 

        let Message = {
            "MessageType":"Rsmc",
            "Sender": _this.$store.state.vuexStore.channelList[0].SelfUri,
            "Receiver": _this.$store.state.vuexStore.channelList[0].OtherUri,
            "TxNonce": 1,
            "ChannelName": _this.$store.state.vuexStore.channelList[0].ChannelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "MessageBody": {
                "AssetType": "TNC",
                "PaymentCount": 0.2,
                "SenderBalance": (_this.$store.state.vuexStore.channelList[0].SelfBalance - (0.2 * 10e7)) / 10e7,
                "ReceiverBalance": (_this.$store.state.vuexStore.channelList[0].OtherBalance + (0.2 * 10e7)) / 10e7,
                "Commitment": selfSignedData,
            },
            "Comments": {}
        }
        _this.$store.state.vuexStore.channelList[0].websock.send(JSON.stringify(Message));


        // this.$store.state.vuexStore.channelList = [];
        // this.$parent.StoreChannel();         //储存通道信息
        // this.$store.state.vuexStore.channelList[0].State = 3;
        // console.log(this.$store.state.vuexStore.channelList[0]);
            // var a1 = web3.utils.padLeft(_this.$store.state.vuexStore.addChannelInfo.channelName, 64);
            // console.log(a1);
            // var a2 = web3.utils.padLeft(web3.utils.toHex(0).substr(2), 64);
            // console.log(a2);
            // var a3 = web3.utils.padLeft(_this.$store.state.vuexStore.walletInfo.address.slice(2), 64);
            // console.log(a3);
            // var a4 = web3.utils.padLeft(web3.utils.toHex(_this.$store.state.vuexStore.addChannelInfo.selfDeposit * 10e7).substr(2), 64);
            // console.log(a4);
            // var a5 = web3.utils.padLeft(_this.$store.state.vuexStore.addChannelInfo.uri.split("@")[0].slice(2), 64);
            // console.log(a5);
            // var a6 = web3.utils.padLeft(web3.utils.toHex(_this.$store.state.vuexStore.addChannelInfo.otherDeposit * 10e7).substr(2), 64);
            // console.log(a6);
            // var a7 = web3.utils.hexToBytes(_this.$store.state.vuexStore.addChannelInfo.selfSignedData);
            // console.log(a7);
            // var a8 = web3.utils.hexToBytes(redata.MessageBody.Commitment);
            // console.log(a8);

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
    getAddressInfo() {      // 监测store中的address,出现变化时获取相关信息
        this.getBalance();          //获取总的余额
        let Message = {
            "messageType":"init", 
            "walletAddress":this.$store.state.vuexStore.walletInfo.address
        }
        this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
        this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@contactList");           //获取联系人列表
        this.$store.state.vuexStore.channelList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList");           //获取通道列表
        this.cycleReconnectWebsocket();
    },
    getBalance() {      //获取总的余额
      this.getEthBalance();
      this.getTncBalance();
    },
    getEthBalance() {      //获取ETH余额
      let _this = this;
      if(_this.$store.state.vuexStore.walletInfo.address){
        if(web3.utils.checkAddressChecksum(_this.$store.state.vuexStore.walletInfo.address)){         //判断是否为address
          web3.eth.getBalance(_this.$store.state.vuexStore.walletInfo.address).then(function(val){
              console.log(val);
              let ethBalance = web3.utils.fromWei(web3.utils.hexToNumberString(val));
              console.log(ethBalance);
              _this.$store.state.vuexStore.balanceData.Chain.ETH = _this.keepDecimalPlaces(ethBalance,3);
          }); 
        }
      }
    },
    getTncBalance() {       //获取TNC余额
      let _this = this;
      let contractAddress = "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218";       //TNC合约地址
      var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
          from: _this.$store.state.vuexStore.walletInfo.address, // default from address
          gasPrice: '10000000000' // default gas price in wei, 10 gwei in this case
      });
      myContract.methods.balanceOf(_this.$store.state.vuexStore.walletInfo.address).call({from: contractAddress}, function(error, result){
          if(!error) {
              let btnBalance= (result/100000000);
              _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.keepDecimalPlaces(btnBalance,3);
          } else {
              console.log(error);
          }
      });
    },
    cycleReconnectWebsocket() {
        var _this = this;
        _this.$store.state.vuexStore.channelList.forEach(function(val,index){           //遍历channelList
            _this.$parent.reconnectWebsocket(val.Ip + ":8766",val.ChannelName);
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav{
    width: 100%;
    max-width: 300px;
    height: 100%;
    float: left;
    user-select:none;
    overflow-x: hidden;
    background-color: rgb(84, 92, 100);
    position: absolute;
    left: 0;
    z-index: 1;
}
nav h1{
    font-size: 20px;
    color: #303133;
    padding: 0 20px;
    cursor: pointer;
    transition: border-color .3s,background-color .3s,color .3s;
    box-sizing: border-box;
    padding-left: 20px;
    color: rgb(255, 255, 255);
    background-color: rgb(84, 92, 100);
    margin: 0;
    height: 56px;
    line-height: 56px;
    position: relative;
    white-space: nowrap;
    list-style: none;
    text-align: center;
    cursor: default;
}
</style>
