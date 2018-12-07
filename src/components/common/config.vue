<template>
    <div>

    </div>
</template>

<script>
import Vue from 'Vue'
import Bus from './../bus.js'
export default {
  name: 'config',
  data () {
    return {

    }
  },
  computed: {
    isTestNet() {                       //获取vuex中的isTestNet赋值给isTestNet
        return this.$store.state.vuexStore.isTestNet;
    },
    address() {                       //获取vuex中的address赋值给address
        if(this.$store.state.vuexStore.baseChain == "ETH"){
            return this.$store.state.vuexStore.walletInfo.address;
        } else if(this.$store.state.vuexStore.baseChain == "NEO"){
            return this.$store.state.vuexStore.NEOwalletInfo.address;
        }
    },
    baseChain() {                       //获取vuex中的baseChain赋值给baseChain
        return this.$store.state.vuexStore.baseChain;
    },
    isLogin() {
        return this.$store.state.vuexStore.isLogin;
    }
  },
  watch: {
    '$store.state.vuexStore.baseChain': 'UpdateConfig',               // 监测到主/测试网变化时,更新配置
    '$store.state.vuexStore.isTestNet': 'UpdateConfig',               // 监测到主/测试网变化时,更新配置
    //'$store.state.vuexStore.walletInfo.address': 'getAddressInfo',    // 监测store中的address,出现变化时获取相关信息
    //'$store.state.vuexStore.NEOwalletInfo.address': 'getAddressInfo'
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        let _this = this;
        let isLogin = _this.$parent.fetchAsString("isLogin");                     //获取登录标记
        console.log(isLogin);
        isLogin === "true" ? _this.$store.state.vuexStore.isLogin = true : _this.$store.state.vuexStore.isLogin = false;
        console.log(_this.$store.state.vuexStore.isLogin);
        
        let isTestNet = _this.$parent.fetchAsString("isTestNet");                     //获取登录标记
        console.log(isTestNet);
        isTestNet === "true" ? _this.$store.state.vuexStore.isTestNet = true : _this.$store.state.vuexStore.isTestNet = false;
        console.log(_this.$store.state.vuexStore.isTestNet);
        // _this.$store.state.vuexStore.isTestNet = _this.$parent.fetchAsString("isTestNet") || false;                  //获取网络
        // _this.isTestNet ? _this.$store.state.vuexStore.isTestNet = true : _this.$store.state.vuexStore.isTestNet = false
        // console.log(_this.isTestNet);
        _this.$store.state.vuexStore.baseChain = _this.$parent.fetchAsString("baseChain") || "ETH";                  //获取底层链
        console.log(_this.baseChain);

        let nullWalletInfo = {               //钱包信息
            keyStore: "",
            publicKey: "",
            address: "",
            keyStorePass: ""
        }
        if(_this.baseChain == "ETH"){
            _this.$store.state.vuexStore.walletInfo = _this.$parent.fetchAsArray("walletInfo");                             //获取钱包信息
            if(_this.$store.state.vuexStore.walletInfo.length){
                _this.$store.state.vuexStore.walletInfo = nullWalletInfo;
            }
            console.log(_this.$store.state.vuexStore.walletInfo);
        } else if (_this.baseChain == "NEO"){
            _this.$store.state.vuexStore.NEOwalletInfo = _this.$parent.fetchAsArray("walletInfo") || nullWalletInfo;        //获取钱包信息
            console.log(_this.$store.state.vuexStore.NEOwalletInfo);
        }
        _this.$store.state.vuexStore.isLogin ? _this.$router.push('/back') : _this.$router.push('/start'); 

        // console.log(_this.isTestNet != undefined);
        // console.log(_this.baseChain != "");
        // if(_this.isTestNet != undefined && _this.baseChain != ""){
        //     console.log("更新当前参数");
            _this.getConfig();                              //更新配置文件信息
        // }
    }),
    Bus.$on('getAddressInfo', (e) => {
        this.getAddressInfo();
    })
  },
  methods: {
    getConfig() {                                       //获取配置文件信息,用于开始界面
      let _this = this;
      if(configData){
        let Network;
        _this.$store.state.vuexStore.isTestNet ? Network = "testNet" : Network = "mainNet";
        console.log(Network);
        if(_this.baseChain == "ETH"){                  //当底层链为ETH时
            console.log("切换到ETH");
            web3 = new Web3(new Web3.providers.HttpProvider(configData.ETH[Network].web3));
            _this.$store.state.vuexStore.NodeUriWebSocketIp = configData.ETH[Network].NodeUriWebSocketIp;               //全节点Ip
            _this.$store.state.vuexStore.NetMagic = configData.ETH[Network].NetMagic;                                   //修改网络号
            _this.$store.state.vuexStore.spvPort = configData.ETH[Network].spvPort;                                     //spv端口号
            _this.$store.state.vuexStore.delayBlock = configData.ETH[Network].delayBlock;                        //sHTLC延迟块高数(每一跳)
            _this.$store.state.vuexStore.nodeWebSocketIp = configData.ETH[Network].nodeWebSocketIp;                     //当前网络稳定的节点,用于获取nodeList
            _this.$store.state.vuexStore.tncContractAddress = configData.ETH[Network].tncContractAddress;               //ERC20资产合约地址
            _this.$store.state.vuexStore.trinityDataContractAddress = configData.ETH[Network].trinityDataContractAddress; //Trinity状态通道数据合约地址
            _this.$store.state.vuexStore.trinityContractAddress = configData.ETH[Network].trinityContractAddress; //Trinity状态通道合约地址
            _this.$store.state.vuexStore.tncContractAbi = configData.ETH.tncContractAbi;                            //ERC20资产合约Abi
            _this.$store.state.vuexStore.trinityContractAbi = configData.ETH.trinityContractAbi;                 //Trinity状态通道合约Abi
        } else if(_this.baseChain == "NEO"){
            console.log("切换到NEO");
            _this.$store.state.vuexStore.NetMagic = configData.NEO[Network].NetMagic;                                    //修改网络号
            _this.$store.state.vuexStore.NodeRpcUri = configData.NEO[Network].NodeRpcUri;                                //全节点通用Uri 
            _this.$store.state.vuexStore.spvPort = configData.NEO[Network].spvPort;                                      //spv端口号
        }
        setTimeout(function (){                                           //连接全节点
            _this.$parent.connectWebSocketForNodeUri(); 
            _this.getAddressInfo();
        },1500);

        // if(_this.baseChain == "ETH"){                //当ETH时连接全节点websocket
        //     setTimeout(function (){                                           //修改全节点IP
        //         if(_this.$store.state.vuexStore.isLogin == true){
        //             _this.getAddressInfo();
        //             //_this.cycleReconnectWebsocket();
        //         }
        //     },3000);
        // }

        _this.$parent.saveAsString("baseChain",_this.$store.state.vuexStore.baseChain);                 // 存储底层主链信息
        _this.$parent.saveAsString("isTestNet",_this.$store.state.vuexStore.isTestNet);                 // 存储主测试网信息
      } else {
        console.log("获取配置文件失败");
      }
    },
    UpdateConfig() {                                     //更新配置文件信息        
      console.log(this.address);
      console.log(this.$store.state.vuexStore.isLogin);
      console.log(this.$store.state.vuexStore.baseChain);
      //if(this.$store.state.vuexStore.isLogin && this.address != ""){
        this.getConfig();                           //获取配置文件信息
    //   } else {
    //     this.$router.push('/start');
    //   }
    },
    getAddressInfo() {                              // 监测store中的address,出现变化时获取相关信息
        let _this = this;
        console.log(_this.baseChain);
        let channelList = _this.$parent.fetchAsArray(_this.address + "@channelList");//获取通道列表
        console.log(channelList);
            let p = [];
            if(channelList){
                channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
                    if(data.transactionHash != undefined){
                        p.push(data);
                    }
                })
            }
        _this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
        _this.$store.state.vuexStore.txList = _this.$parent.fetchAsArray(_this.address + "@txList");                 //获取TxList列表
        console.log(_this.$store.state.vuexStore.txList);
        _this.$store.state.vuexStore.contactList = _this.$parent.fetchAsArray(_this.address + "@contactList");       //获取联系人列表
        _this.$store.state.vuexStore.recordList = _this.$parent.fetchAsArray(_this.address + "@recordList");         //获取交易记录列表
        _this.$store.state.vuexStore.eventList = _this.$parent.fetchAsArray(_this.address + "@eventList");           //获取event列表
        console.log(_this.$store.state.vuexStore.eventList);
        _this.$store.state.vuexStore.RList = _this.$parent.fetchAsArray(_this.address + "@RList");                   //获取R和HashR的列表
        let isOneStepPayment = _this.$parent.fetchAsString(_this.address + "@isOneStepPayment");                     //获取是否开启免密支付
        console.log(isOneStepPayment);
        isOneStepPayment == "true" ? _this.$store.state.vuexStore.isOneStepPayment = true : _this.$store.state.vuexStore.isOneStepPayment = false;                                                    //免密支付
        console.log(_this.$store.state.vuexStore.isOneStepPayment);
        
        _this.getBalance();                          //获取总的余额

        if(_this.baseChain == "ETH" && _this.address){                  //当前为ETH钱包时
            let Message = {
                "messageType": "init", 
                "walletAddress": _this.address
            }
            let Message1 = {
                "messageType": "monitorAddress",
                "walletAddress": _this.address,
                "playload": _this.address,
                "chainType": "ETH",
                "comments": {}
            }
            setTimeout(function (){                                           //连接全节点
                _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
                _this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message1));        //向全节点请求监听到账信息
            }, 1500);
            _this.$parent.blockHeightCycle();                    //循环查询块高
        }
        _this.BalanceCycle();                        //反复获取钱包余额
        _this.cycleReconnectWebsocket();             //循环连接websocket
    },
    BalanceCycle: function() {                      //循环获取余额
      setInterval(this.getBalance, 20000);
    },
    getBalance() {                                  //获取总的余额
      if(this.baseChain == "ETH"){                  //当前为ETH钱包时
        if(web3.utils.isAddress(this.address)){             //当钱包地址正确时获取余额
            this.getEthBalance();
            this.getTncBalance();
            this.$parent.getChannelBalance();
        }
      } else if (this.baseChain == "NEO"){               //当前为NEO钱包时
        if(this.address.length == 34){             //当钱包地址正确时获取余额
            this.NEOgetTncBalance();
            // this.$parent.getChannelBalance();
        }
      }
    },
    getEthBalance() {                           //获取ETH余额
      let _this = this;
      if(_this.address){
        if(web3.utils.checkAddressChecksum(_this.address)){         //判断是否为address
          web3.eth.getBalance(_this.address).then(function(val){
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
            from: _this.address,              //发送地址
            gasPrice: gasPrice                                                  // GAS价格
        });
        myContract.methods.balanceOf(_this.address).call({from: _this.$store.state.vuexStore.tncContractAddress}, function(error, result){
            if(!error) {
                let tncBalance= (result / 10e7);
                _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.$parent.keepDecimalPlaces(tncBalance,3);
            } else {
                console.log(error);
            }
        });
      });
    },
    NEOgetTncBalance() {       //获取余额,NEO
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
          "params": [_this.address],
          "id": 1
        })
      }).then(function(res){
        _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.$parent.keepDecimalPlaces(res.data.result.tncBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.NEO = _this.$parent.keepDecimalPlaces(res.data.result.neoBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.GAS = _this.$parent.keepDecimalPlaces(res.data.result.gasBalance,3);
      });
    },
    cycleReconnectWebsocket() {             //登录后循环连接各个通道
        var _this = this;
        _this.$store.state.vuexStore.channelList.forEach(function(val,index){           //遍历channelList
            if(val.isTestNet == _this.$store.state.vuexStore.isTestNet){
                if(_this.baseChain == "ETH"){
                    _this.$parent.reconnectWebsocket(val.Ip, val.ChannelName);
                } else if (_this.baseChain == "NEO"){
                    _this.$parent.reconnectWebsocket(val.Ip, val.ChannelName);
                }
            }
        })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
