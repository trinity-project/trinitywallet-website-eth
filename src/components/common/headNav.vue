<template>
    <nav>
        <h1 @click="testFun()">{{$t('navMenu.title')}}</h1>
        <el-row class="tac">
            <el-col :span="24">
                <el-menu :default-active="navSelected" :active="navSelected" @select="selectItems" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true">
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
                    <el-menu-item @click="switchNet()" index="3-2" style="position: relative;">
                        <template slot="title">
                            <i class="el-icon-ETH-wangluo"></i>
                            <span>{{$t('navMenu.setting.switchNet')}}
                                <p v-if="!$store.state.vuexStore.isTestNet" style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 30px;" active-color="#F8D163">MainNet
                                </p>
                                <p v-if="$store.state.vuexStore.isTestNet" style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 30px;" active-color="#F8D163">Ropsten TsetNet 
                                </p>
                            </span>
                        </template>
                    </el-menu-item>
                    <!-- <el-submenu index="3-2">
                        <template slot="title">
                            <i class="el-icon-ETH-wangluo"></i>
                            <span>{{$t('navMenu.setting.switchNet')}}</span>
                        </template>
                        <el-menu-item @click="switchNet('Mainnet')" index="3-2-1">Mainnet</el-menu-item>
                        <el-menu-item @click="switchNet('Ropsten')" index="3-2-2">Ropsten</el-menu-item>
                    </el-submenu> -->
                    <el-submenu index="3-7">
                        <template slot="title">
                            <i class="el-icon-ETH-wuliaojiage"></i>
                            <span>设置Gas Price</span>
                        </template>
                        <el-menu-item index="3-7-1">
                            <div class="block">
                                <el-slider v-model="gasPrice" :min="1" :max="100"></el-slider>
                                <p style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 30px;"> {{ gasPrice }} Gwei
                                </p>
                            </div>
                        </el-menu-item>
                        <el-menu-item index="3-7-1">
                            <div class="block">
                                <p style="position: absolute;color: #ffd04b;font-size: 12px;margin: 0;top: 0;" >建议不要小于当前平均价格---{{ recommendGasPrice / 10e8 }} Gwei</p>
                            </div>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3-3" style="position: relative;" disabled>
                            <i class="el-icon-ETH-pifu"></i>
                            <span>{{$t('navMenu.setting.nightMode')}}
                                <el-switch v-model="isNightMode" style="position: absolute;top:50%;right:45px;margin-top: -9px;" active-color="#F8D163" disabled>
                                </el-switch>
                            </span>
                    </el-menu-item>
                    <el-menu-item @click="toOtherForm('/changePassword')" index="3-4">
                        <i class="el-icon-ETH-xiugaimima"></i>
                        <span>{{$t('navMenu.setting.changePass')}}</span>
                    </el-menu-item>
                    <el-menu-item @click="toOtherForm('/backup')" index="3-5">
                        <i class="el-icon-ETH-fuzhi"></i>
                        <span>{{$t('navMenu.setting.backup')}}</span>
                    </el-menu-item>
                    <el-menu-item @click="showSignOutBox()" index="3-6">
                        <i class="el-icon-ETH-tuichu"></i>
                        <span slot="title">{{$t('navMenu.setting.signOut')}}</span>
                    </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item @click="toOtherForm('/about')" index="4">
                    <i class="el-icon-ETH-xinxi"></i>
                    <span slot="title">{{ $t('navMenu.about') }}</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </nav>
</template>

<script>
import Vue from 'Vue'
export default {
  name: 'LeftNav',
  data () {
    return {
      isLogin: false,
      isNightMode: false,
      navSelected: "1-1",          //当前active Nav
      isSignOutBoxShow: false,       //是否显示退出框
      gasPrice: 1,                //GasPrice
      recommendGasPrice: 0
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
        _this.$parent.saveAsString("isNightMode", newValue);
    },
    gasPrice(newValue, oldValue) { 
        let _this = this;
        _this.$store.state.vuexStore.gasPrice = newValue * 10e8;
        _this.$parent.saveAsString("gasPrice", newValue * 10e8);
    },
    '$store.state.vuexStore.gasPrice': 'changeGasPrice',           // 监测store中的activeNavIndex
    '$store.state.vuexStore.activeNavIndex': 'storeToNav',           // 监测store中的activeNavIndex
    '$store.state.vuexStore.walletInfo.address': 'getAddressInfo'            // 监测store中的address,出现变化时获取相关信息
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        let _this = this;
        _this.isNightMode = _this.$parent.fetchAsString("isNightMode");

        web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
            _this.recommendGasPrice = gasPrice;
            if(_this.$parent.fetchAsString("gasPrice") == ""){
                _this.$store.state.vuexStore.gasPrice = parseInt(gasPrice);
            } else {
                _this.$store.state.vuexStore.gasPrice = parseInt(_this.$parent.fetchAsString("gasPrice"));
            }
        })
        if(!_this.$store.state.vuexStore.isLogin){
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
    switchNet() {        //切换网络
        this.$store.state.vuexStore.isTestNet === true ? this.$store.state.vuexStore.isTestNet = false : this.$store.state.vuexStore.isTestNet = true;
        console.log("切换网络");
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
    changeGasPrice() {      //传递GasPrice
        this.gasPrice = this.$store.state.vuexStore.gasPrice / 10e8;
    },
    testFun() {      //用于测试
        let result = web3.utils.keccak256("0x4c6dc84a0bce23e93d8b40b0517801d0f9354b284e8aa0fa75ff1ba6c4ed5c68");
        console.log(result);
        console.log("0x8d1cb246ceeed51bf56c47c2e42f7e28811267f10ede218f168168a233067619");

        return false;
        let _this = this;
        let redata = {
            "MessageType":"Rsmc",
            "Sender": "0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089",
            "Receiver": "0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089",
            "TxNonce": 1,
            "ChannelName": 0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf,
            "NetMagic": this.$store.state.vuexStore.NetMagic,
            "MessageBody": {
            "AssetType": "TNC",
            "PaymentCount": 2,
            "SenderBalance": 10,
            "ReceiverBalance": 10,
            "Commitment": "0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf"
            },
            "Comments": {}
        }
        _this.$notify.info({
            title: '消息',
            duration: 0,
            message: redata.Sender.split("@")[0] + "正在向你转账,需要你解锁钱包,点击进行解锁",
            onClick: _this.$parent.showReceiptRsmcInfoBox
        });
        return false;
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
    },
    getAddressInfo() {      // 监测store中的address,出现变化时获取相关信息
        let Message = {
            "messageType":"init", 
            "walletAddress":this.$store.state.vuexStore.walletInfo.address
        }
        this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
            let channelList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList");//获取通道列表
            let p = [];
            channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
                if(data.transactionHash != undefined){
                    p.push(data);
                }
            })
        this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
        this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@contactList");           //获取联系人列表
        this.$store.state.vuexStore.recordList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@recordList");                             //获取交易记录列表
        this.getBalance();                           //获取总的余额
        this.cycleReconnectWebsocket();             //循环连接websocket
        this.BalanceCycle();                        //反复获取钱包余额
    },
    BalanceCycle: function() {                //循环获取余额
      setInterval(this.getBalance, 5000);
    },
    getBalance() {      //获取总的余额
      if(web3.utils.isAddress(this.$store.state.vuexStore.walletInfo.address)){             //当钱包地址正确时获取余额
        this.getEthBalance();
        this.getTncBalance();
        this.$parent.getChannelBalance();
      }
    },
    getEthBalance() {      //获取ETH余额
      let _this = this;
      if(_this.$store.state.vuexStore.walletInfo.address){
        if(web3.utils.checkAddressChecksum(_this.$store.state.vuexStore.walletInfo.address)){         //判断是否为address
          web3.eth.getBalance(_this.$store.state.vuexStore.walletInfo.address).then(function(val){
            //   console.log(val);
              let ethBalance = web3.utils.fromWei(web3.utils.hexToNumberString(val));
            //   console.log(ethBalance);
              _this.$store.state.vuexStore.balanceData.Chain.ETH = _this.$parent.keepDecimalPlaces(ethBalance,3);
          }); 
        }
      }
    },
    getTncBalance() {       //获取TNC余额
      let _this = this;
      web3.eth.getGasPrice().then(function(gasPrice){               // 获取GAS价格
        var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
            from: _this.$store.state.vuexStore.walletInfo.address,              //发送地址
            gasPrice: gasPrice                                                  // GAS价格
        });
        myContract.methods.balanceOf(_this.$store.state.vuexStore.walletInfo.address).call({from: _this.$store.state.vuexStore.tncContractAddress}, function(error, result){
            if(!error) {
                let tncBalance= (result / 10e7);
                _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.$parent.keepDecimalPlaces(tncBalance,3);
            } else {
                console.log(error);
            }
        });
      });
    },
    cycleReconnectWebsocket() {             //登录后循环连接各个通道
        var _this = this;
        _this.$store.state.vuexStore.channelList.forEach(function(val,index){           //遍历channelList
            _this.$parent.reconnectWebsocket(val.Ip + ":8766",val.ChannelName);
        })
    },
    showSignOutBox() {                       //显示退出提醒框
        if(this.$store.state.vuexStore.isLogin == true){
            this.$parent.showSignOutBox();
        } else {
            
        }
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
