<template>
    <div>

    </div>
</template>

<script>
import Vue from 'Vue'
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
  },
  watch: {
    '$store.state.vuexStore.walletInfo.address': 'getAddressInfo',    // 监测store中的address,出现变化时获取相关信息
    '$store.state.vuexStore.NEOwalletInfo.address': 'getAddressInfo'
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        let _this = this;
        if(!_this.$store.state.vuexStore.isLogin){                                          // 当未登录时,都跳转到开始界面
            _this.$router.push('/start');
        }

        _this.$store.state.vuexStore.isTestNet = _this.$parent.fetchAsString("isTestNet") || true;                  //获取网络
        _this.isTestNet ? _this.$store.state.vuexStore.isTestNet = true : _this.$store.state.vuexStore.isTestNet = false
    
        _this.$store.state.vuexStore.baseChain = _this.$parent.fetchAsString("baseChain") || "ETH";                  //获取底层链

        console.log(_this.isTestNet);
        console.log(_this.baseChain);
        if(_this.isTestNet != "" && _this.baseChain != ""){
            console.log("更新当前参数");
            _this.UpdateConfig();                              //更新配置文件信息
        }
    })
  },
  methods: {
    UpdateConfig() {                                     //更新配置文件信息        
      let _this = this;
      axios({                                            //获取本地config
        method: 'get',
        url: './../../../static/config/config.json',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(function(res){
        if(res){
          let data = res.data;
          let Network;
          _this.$store.state.vuexStore.isTestNet ? Network = "testNet" : Network = "mainNet";
          if(_this.baseChain == "ETH"){                  //当底层链为ETH时
            console.log("切换到ETH");
            _this.$store.state.vuexStore.NetMagic = data.ETH[Network].NetMagic;                                     //修改网络号
            _this.$store.state.vuexStore.tncContractAddress = data.ETH[Network].tncContractAddress;                 //ERC20资产合约地址
            _this.$store.state.vuexStore.trinityDataContractAddress = data.ETH[Network].trinityDataContractAddress; //Trinity状态通道数据合约地址
            _this.$store.state.vuexStore.trinityContractAddress = data.ETH[Network].trinityContractAddress;   //Trinity状态通道合约地址
            _this.$store.state.vuexStore.tncContractAbi = data.ETH.tncContractAbi;                            //ERC20资产合约Abi
            _this.$store.state.vuexStore.trinityContractAbi = data.ETH.trinityContractAbi;                    //Trinity状态通道合约Abi
          } else if(_this.baseChain == "NEO"){
            console.log("切换到NEO");
            _this.$store.state.vuexStore.NetMagic = data.NEO[Network].NetMagic;                                     //修改网络号
            _this.$store.state.vuexStore.NodeRpcUri = data.NEO[Network].NodeRpcUri;                                 //全节点通用Uri 
          }
          setTimeout(function (){                                           //连接全节点
            _this.$parent.connectWebSocketForNodeUri(); 
          },1500);

          if(_this.baseChain == "ETH"){                //当ETH时连接全节点websocket
            setTimeout(function (){                                           //修改全节点IP
                if(_this.$store.state.vuexStore.isLogin == true){
                    _this.getAddressInfo();
                    _this.cycleReconnectWebsocket();
                }
            },3000);
          }
        } else {
            console.log("获取配置文件失败");
        }
      })
    },
    getAddressInfo() {                              // 监测store中的address,出现变化时获取相关信息
        console.log(this.baseChain);
        let channelList = this.$parent.fetchAsArray(this.address + "@channelList");//获取通道列表
        console.log(channelList);
            let p = [];
            channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
                if(data.transactionHash != undefined){
                    p.push(data);
                }
            })
        this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
        this.$store.state.vuexStore.txList = this.$parent.fetchAsArray(this.address + "@txList");           //获取TxList列表
        console.log(this.$store.state.vuexStore.txList);
        this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.address + "@contactList");                            //获取联系人列表
        this.$store.state.vuexStore.recordList = this.$parent.fetchAsArray(this.address + "@recordList");                             //获取交易记录列表
        this.$store.state.vuexStore.eventList = this.$parent.fetchAsArray(this.address + "@eventList");
        console.log(this.$store.state.vuexStore.eventList);                              //获取event列表
        this.$store.state.vuexStore.RList = this.$parent.fetchAsArray(this.address + "@RList");
        this.getBalance();                          //获取总的余额

        if(this.baseChain == "ETH"){                  //当前为ETH钱包时
            let Message = {
                "messageType":"init", 
                "walletAddress":this.address
            }
            this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
            let Message1 = {
                "messageType":"monitorAddress",
                "walletAddress": this.address,
                "playload": this.address,
                "chainType":"ETH",
                "comments":{}
            }
            this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message1));        //向全节点请求监听到账信息
            this.cycleReconnectWebsocket();             //循环连接websocket
            this.BalanceCycle();                        //反复获取钱包余额
            this.$parent.blockHeightCycle();                    //循环查询块高
        }
        //  else if (this.baseChain == "NEO"){               //当前为NEO钱包时
        //     console.log("获取钱包信息");
        //     let channelList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@channelList");//获取通道列表
        //         console.log(channelList);
        //         let p = [];
        //         channelList.forEach(function(data,index){   //遍历chanelList,去除未上链(未成功)的通道
        //             if(data.transactionHash != undefined){
        //                 p.push(data);
        //             }
        //         })
        //     this.$store.state.vuexStore.channelList = p;           //赋值有transactionHash的通道列表
        //     // this.$store.state.vuexStore.TxList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@TxList");           //获取TxList列表
        //     // console.log( this.$store.state.vuexStore.TxList);
        //     this.$store.state.vuexStore.contactList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@contactList");                            //获取联系人列表
        //     this.$store.state.vuexStore.recordList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@recordList");                             //获取交易记录列表
        //     this.$store.state.vuexStore.RList = this.$parent.fetchAsArray(this.$store.state.vuexStore.NEOwalletInfo.address + "@RList");

        //     this.getBalance();                          //获取总的余额
        // }
    },
    BalanceCycle: function() {                //循环获取余额
      setInterval(this.getBalance, 5000);
    },
    getBalance() {                            //获取总的余额
      if(this.baseChain == "ETH"){                  //当前为ETH钱包时
        if(web3.utils.isAddress(this.address)){             //当钱包地址正确时获取余额
            this.getEthBalance();
            this.getTncBalance();
            this.$parent.getChannelBalance();
        }
      } else if (this.baseChain == "NEO"){               //当前为NEO钱包时
        console.log(this.address);
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
          "params": [_this.address],
          "id": 1
        })
      }).then(function(res){
        _this.$store.state.vuexStore.balanceData.Chain.TNC = _this.$parent.keepDecimalPlaces(res.data.result.tncBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.NEO = _this.$parent.keepDecimalPlaces(res.data.result.neoBalance,3);
        _this.$store.state.vuexStore.balanceData.Chain.GAS = _this.$parent.keepDecimalPlaces(res.data.result.gasBalance,3);
        console.log(_this.address);
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
