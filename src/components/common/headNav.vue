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
                    <!-- <el-menu-item @click="switchNet()" index="3-2" style="position: relative;">
                        <template slot="title">
                            <i class="el-icon-ETH-wangluo"></i>
                            <span>{{$t('navMenu.setting.switchNet')}}
                                <p v-if="!$store.state.vuexStore.isTestNet" style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 40px;" active-color="#F8D163">MainNet
                                </p>
                                <p v-if="$store.state.vuexStore.isTestNet" style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 40px;" active-color="#F8D163">Ropsten TsetNet 
                                </p>
                            </span>
                        </template>
                    </el-menu-item> -->
                    <el-submenu index="3-2">
                        <template slot="title">
                            <i class="el-icon-ETH-wangluo"></i>
                            <span>{{$t('navMenu.setting.switchNet')}}</span>
                            <p style="position: absolute;color: #C0C4CC;font-size: 10px;margin: 0;top: 0;right: 40px;" active-color="#F8D163">{{ network }}
                            </p>
                        </template>
                        <el-menu-item @click="switchNet('ETH',false)" index="3-2-1">
                            <i class="el-icon-ETH-ethereum"></i>
                            <span style="font-size: 12px;">ETH MainNet</span>
                        </el-menu-item>
                        <el-menu-item @click="switchNet('ETH',true)" index="3-2-2">
                            <i class="el-icon-ETH-ethereum"></i>
                            <span style="font-size: 12px;">ETH Ropsten TsetNet</span>
                            </el-menu-item>
                        <el-menu-item @click="switchNet('NEO',false)" index="3-2-3" >
                            <i class="el-icon-ETH-neo"></i>
                            <span style="font-size: 12px;">NEO MainNet</span>
                            </el-menu-item>
                        <el-menu-item @click="switchNet('NEO',true)" index="3-2-4" >
                            <i class="el-icon-ETH-neo"></i>
                            <span style="font-size: 12px;">NEO TsetNet</span>
                            </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3-7" v-if="$store.state.vuexStore.baseChain == 'ETH'">
                        <template slot="title">
                            <i class="el-icon-ETH-wuliaojiage"></i>
                            <span>{{$t('navMenu.setting.setGasPrice')}}</span>
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
                                <p style="position: absolute;color: #ffd04b;font-size: 12px;margin: 0;top: 0;" >{{$t('navMenu.setting.recommendGasPrice')}} --- {{ recommendGasPrice / 10e8 }} Gwei</p>
                            </div>
                        </el-menu-item>
                    </el-submenu>
                    <!-- <el-menu-item index="3-3" style="position: relative;" disabled>
                            <i class="el-icon-ETH-pifu"></i>
                            <span>{{$t('navMenu.setting.nightMode')}}
                                <el-switch v-model="isNightMode" style="position: absolute;top:50%;right:45px;margin-top: -9px;" active-color="#F8D163" disabled>
                                </el-switch>
                            </span>
                    </el-menu-item> -->
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
    },
    network: function () {
      let partA = this.$store.state.vuexStore.baseChain;
      let partB;
      if(this.$store.state.vuexStore.isTestNet){
          partB = "TestNet";
      } else {
          partB = "MainNet";
      }
      return partA + " " + partB;
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
        _this.$store.state.vuexStore.gasPrice = Number(newValue).mul(10e8);
        _this.$parent.saveAsString("gasPrice", Number(newValue).mul(10e8));
    },
    '$store.state.vuexStore.gasPrice': 'changeGasPrice',             // 监测store中的activeNavIndex
    '$store.state.vuexStore.activeNavIndex': 'storeToNav',           // 监测store中的activeNavIndex
    '$store.state.vuexStore.walletInfo.address': 'getAddressInfo',    // 监测store中的address,出现变化时获取相关信息
    '$store.state.vuexStore.NEOwalletInfo.address': 'getAddressInfo'
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        let _this = this;
        _this.getConfig();                                  //获取配置文件信息
        _this.isNightMode = _this.$parent.fetchAsString("isNightMode");                                     //获取夜间主题
        if(window.screen.width < 1024){
            _this.$store.state.vuexStore.isNavShow = false;
        }

        _this.$store.state.vuexStore.isTestNet = _this.$parent.fetchAsString("isTestNet");                  //获取网络
        if(_this.$store.state.vuexStore.isTestNet == "" || _this.$store.state.vuexStore.isTestNet == 'true'){
          _this.$store.state.vuexStore.isTestNet = true;
        } else {
          console.log("切换到主网");
          _this.$store.state.vuexStore.isTestNet = false;
        }
        _this.$store.state.vuexStore.baseChain = _this.$parent.fetchAsString("baseChain");                  //获取网络
        if(_this.$store.state.vuexStore.baseChain == ""){
          _this.$store.state.vuexStore.baseChain = "ETH";
        }
        console.log(_this.$store.state.vuexStore.isTestNet);
        console.log(_this.$store.state.vuexStore.baseChain);
        if(_this.$store.state.vuexStore.isTestNet != "" || _this.$store.state.vuexStore.baseChain != ""){
            console.log("更新当前参数");
            _this.deployParameter();      //更新当前环境的参数
        }

        web3.eth.getGasPrice().then(function(gasPrice){                                     // 获取GAS价格
            _this.recommendGasPrice = gasPrice;
            if(_this.$parent.fetchAsString("gasPrice") == ""){
                _this.$store.state.vuexStore.gasPrice = parseInt(gasPrice);
            } else {
                _this.$store.state.vuexStore.gasPrice = parseInt(_this.$parent.fetchAsString("gasPrice"));
            }
        })
        if(!_this.$store.state.vuexStore.isLogin){                                          // 当未登录时,都跳转到开始界面
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
    switchNet(Base, isTestNet) {        //切换网络
        let _this = this;
        console.log(typeof(_this.$store.state.vuexStore.NodeUriWebSocket));
        if(typeof(_this.$store.state.vuexStore.NodeUriWebSocket) == 'object'){
            _this.$store.state.vuexStore.NodeUriWebSocket.close();
        }
        _this.$store.state.vuexStore.isTestNet = isTestNet;                  //更新数据
        _this.$store.state.vuexStore.baseChain = Base;
        _this.$parent.saveAsString("isTestNet", _this.$store.state.vuexStore.isTestNet);
        _this.$parent.saveAsString("baseChain",_this.$store.state.vuexStore.baseChain);

        _this.deployParameter();      //更新当前环境的参数
    },
    getConfig() {                     //获取本地config
      let _this = this;
      axios({ 
        method: 'get',
        url: './../../../static/config/config.json',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(function(res){
        _this.$store.state.vuexStore.tncContractAddress = res.data.tncContractAddress;                   //ERC20资产合约地址
        _this.$store.state.vuexStore.tncContractAbi = res.data.tncContractAbi;                           //ERC20资产合约Abi
        _this.$store.state.vuexStore.trinityContractAddress = res.data.trinityContractAddress;           //Trinity状态通道合约地址
        _this.$store.state.vuexStore.trinityDataContractAddress = res.data.trinityDataContractAddress;   //Trinity状态通道合约Abi
        _this.$store.state.vuexStore.trinityContractAbi = res.data.trinityContractAbi;                   //Trinity状态通道数据合约地址
      })
    },
    deployParameter() {      //配置当前环境的参数
        let _this = this;
        if(_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "ETH"){          //ETH测试网
          console.log("切换到ETH测试网");
          web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/5a89dae544414c24951c3144d47dc84d")); 
          _this.$store.state.vuexStore.NetMagic = "527465737419990331";                                                //修改网络号
          _this.$store.state.vuexStore.tncContractAddress = "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218";            //修改token合约地址
          _this.$store.state.vuexStore.trinityContractAddress = "0xB38758094373f9C6651a765e7bbB38722a07c63a";        //修改trinity合约地址
          _this.$store.state.vuexStore.trinityDataContractAddress = "0xF928BA6a908207BF6C0Cd73eba2f165B6115AbD9";    //修改trinity合约地址
          _this.$store.state.vuexStore.NodeUriWebSocketIp = "ws://47.104.81.20:9000";                                      //修改全节点IP
        } else if(!_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "ETH"){        //ETH主网
          console.log("切换到ETH主网");
          web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/5a89dae544414c24951c3144d47dc84d"));
          _this.$store.state.vuexStore.NetMagic = "4061696020030515";                                                //修改网络号
          _this.$store.state.vuexStore.tncContractAddress = "0xc9ad73d11d272c95b5a2c48780a55b6b3c726cac";            //修改token合约地址
          _this.$store.state.vuexStore.trinityContractAddress = "0x7A332beF593d6bd6B9d314959295239c46D5C127";        //修改trinity合约地址
          _this.$store.state.vuexStore.trinityDataContractAddress = "0xF8ac6d07e825338720bC7D3ee119B3C88560FaF5";    //修改trinity合约地址
          _this.$store.state.vuexStore.NodeUriWebSocketIp = "wss://wss.trinity.ink:9000";                            //修改全节点IP
        } else if(_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "NEO"){        //NEO测试网
          console.log("切换到NEO测试网");
          _this.$store.state.vuexStore.NetMagic = "195378745719990331";                                                //修改网络号
          _this.$store.state.vuexStore.NodeRpcUri = "http://47.254.64.251:21332";                                      //全节点通用Uri
          //_this.$store.state.vuexStore.NodeSendrawUri = "http://47.254.64.251:20332";                                  //全节点上链Uri
        } else if(!_this.$store.state.vuexStore.isTestNet && _this.$store.state.vuexStore.baseChain == "NEO"){ 
          console.log("切换到NEO主网");
          _this.$store.state.vuexStore.NetMagic = "763040120030515";                                                  //修改网络号
          _this.$store.state.vuexStore.NodeRpcUri = "https://neoapi.trinity.ink";                                      //全节点通用Uri
          //_this.$store.state.vuexStore.NodeSendrawUri = "http://47.96.175.193:10332";                                  //全节点上链Uri
        } else {
          console.log("切换网络错误");
        }
        setTimeout(function (){                                           //修改全节点IP
            _this.$parent.connectWebSocketForNodeUri(); 
        },1500);

        if(_this.$store.state.vuexStore.baseChain == "ETH"){                //当ETH时连接全节点websocket
            setTimeout(function (){                                           //修改全节点IP
            if(_this.$store.state.vuexStore.isLogin == true){
                _this.getAddressInfo();
                _this.cycleReconnectWebsocket();
            }
            },3000);
            _this.getBalance();
            _this.BalanceCycle();
        }
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
        this.gasPrice = this.$store.state.vuexStore.gasPrice.div(10e8);
    },
    async testFun() {
        let a = randomBytes(32);
        let b = a.length;
        console.log(b + "____" + a);
    },
    async test1Fun() {      //用于测试
        let _this = this;
        let functionName = "approve";
        let dataTypeList = ["address","uint256"];
        let dataTypeString = dataTypeList.join(",");
        let dataList = [this.$store.state.vuexStore.trinityDataContractAddress, Number(10).mul(10e7)];
        let password = "123";
        let signedData;
        if(dataTypeList.length == dataList.length){
            console.log(functionName);
            console.log(web3.eth.abi.encodeFunctionSignature(`${functionName}(${dataTypeString})`));
            console.log(dataTypeList);
            console.log(dataList);
            console.log(password);
            console.log("________________________");
            let data = web3.eth.abi.encodeParameters(['address','uint256'], [this.$store.state.vuexStore.trinityDataContractAddress, Number(10).mul(10e7)]);
            console.log(data);
            let data1 = web3.eth.abi.encodeParameters(dataTypeList, dataList);
            console.log(data1);
        }
        // var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
        //     from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
        //     gasPrice: _this.$store.state.vuexStore.gasPrice        //Gas价格
        // });
        let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, password);
        await web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
            // 获取交易次数
            console.log(nonce);

            // approve押金金额
            let functionSig = web3.eth.abi.encodeFunctionSignature(`${functionName}(${dataTypeString})`);     //获取functionSig
            console.log(functionSig);

            let data = web3.eth.abi.encodeParameters(dataTypeList, dataList);                       //abi加密参数
            console.log(data);

            var txData = {        //组成txData数据
                nonce: web3.utils.toHex(nonce++),
                gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
                gasLimit: web3.utils.toHex(4500000),
                to: _this.$store.state.vuexStore.tncContractAddress,
                from: _this.$store.state.vuexStore.walletInfo.address, 
                value: '0x00', 
                data: functionSig + data.substr(2)
            };
            console.log(txData);

            signedData = signData(txData,decryptPK.privateKey);     //签名
            console.log(signedData);
        })
        return signedData;
    },
    getAddressInfo() {                              // 监测store中的address,出现变化时获取相关信息
        console.log(this.$store.state.vuexStore.baseChain);
        if(this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
            let Message = {
                "messageType":"init", 
                "walletAddress":this.$store.state.vuexStore.walletInfo.address
            }
            this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
            let Message1 = {
                "messageType":"monitorEthAddress",
                "walletAddress": this.$store.state.vuexStore.walletInfo.address,
                "playload": this.$store.state.vuexStore.walletInfo.address,
                "comments":{}
            }
            this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message1));        //向全节点请求监听到账信息
                let channelList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList");//获取通道列表
                console.log(channelList);
                let p = [];
                channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
                    if(data.transactionHash != undefined){
                        p.push(data);
                    }
                })
            this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
            this.$store.state.vuexStore.txList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@txList");           //获取TxList列表
            console.log(this.$store.state.vuexStore.txList);
            this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@contactList");                            //获取联系人列表
            this.$store.state.vuexStore.recordList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@recordList");                             //获取交易记录列表
            this.$store.state.vuexStore.eventList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@eventList");
            console.log(this.$store.state.vuexStore.eventList);                              //获取event列表
            this.$store.state.vuexStore.RList = this.$parent.fetchAsArray(this.$store.state.vuexStore.walletInfo.address + "@RList");
            this.getBalance();                          //获取总的余额
            this.cycleReconnectWebsocket();             //循环连接websocket
            this.BalanceCycle();                        //反复获取钱包余额
            this.$parent.blockHeightCycle();                    //循环查询块高
        } else if (this.$store.state.vuexStore.baseChain == "NEO"){               //当前为NEO钱包时
            console.log("获取钱包信息");
            let channelList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@channelList");//获取通道列表
                console.log(channelList);
                let p = [];
                channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
                    if(data.transactionHash != undefined){
                        p.push(data);
                    }
                })
            this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
            // this.$store.state.vuexStore.TxList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@TxList");           //获取TxList列表
            // console.log( this.$store.state.vuexStore.TxList);
            this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@contactList");                            //获取联系人列表
            this.$store.state.vuexStore.recordList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@recordList");                             //获取交易记录列表
            this.$store.state.vuexStore.RList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@RList");

            this.getBalance();                          //获取总的余额
        }
    },
    BalanceCycle: function() {                //循环获取余额
      setInterval(this.getBalance, 5000);
    },
    getBalance() {                            //获取总的余额
      if(this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
        if(web3.utils.isAddress(this.$store.state.vuexStore.walletInfo.address)){             //当钱包地址正确时获取余额
            this.getEthBalance();
            this.getTncBalance();
            this.$parent.getChannelBalance();
        }
      } else if (this.$store.state.vuexStore.baseChain == "NEO"){               //当前为NEO钱包时
        console.log(this.$store.state.vuexStore.NEOwalletInfo.address);
        if(this.$store.state.vuexStore.NEOwalletInfo.address.length == 34){             //当钱包地址正确时获取余额
            this.NEOgetTncBalance();
            // this.$parent.getChannelBalance();
        }
      }
    },
    getEthBalance() {                           //获取ETH余额
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
    getTncBalance() {                           //获取TNC余额
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
    NEOgetTncBalance() {       //获取TNC余额,NEO
      let _this = this;
      axios({
        method: 'post',
        url: _this.$store.state.vuexStore.NodeRpcUri,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "getBalance",
          "params": [_this.$store.state.vuexStore.NEOwalletInfo.address],
          "id": 1
        })
      }).then(function(res){
        _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.$parent.keepDecimalPlaces(res.data.result.tncBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.NEO = _this.$parent.keepDecimalPlaces(res.data.result.neoBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.GAS = _this.$parent.keepDecimalPlaces(res.data.result.gasBalance,3);
        console.log(_this.$store.state.vuexStore.NEOwalletInfo.address);
        console.log(_this.$store.state.vuexStore.balanceData.Chain.TNC);
        console.log(_this.$store.state.vuexStore.balanceData.Chain.NEO);
        console.log(_this.$store.state.vuexStore.balanceData.Chain.GAS);
      });
    },
    cycleReconnectWebsocket() {             //登录后循环连接各个通道
        var _this = this;
        _this.$store.state.vuexStore.channelList.forEach(function(val,index){           //遍历channelList
            if(val.isTestNet == _this.$store.state.vuexStore.isTestNet){
                _this.$parent.reconnectWebsocket(val.Ip + ":8866",val.ChannelName);
            }
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
