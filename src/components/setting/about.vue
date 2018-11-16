<template>
  <div class="aboutForm">
    <headBox/>
    <div class="contentBox">
        <h2 @click="testNum += 1" class="title_h2">{{ $t('about.title') }}</h2>
        <hr/>
        <div style="text-align:center;">
            <img @click="clickNum += 1" src="./../../assets/img/Trinity.png" alt="Trinity">
            <h4>Trinity Wallet for ETH</h4>
            <p v-if="$store.state.vuexStore.isTestNet" style="color:red;">Test Network</p>
            <p>Version: V{{ $store.state.vuexStore.version }}</p>
            <template v-if="$store.state.vuexStore.isOneStepPayment">
                <p>当前交易笔数: {{ transNum }}笔,其中RSMC笔数: {{ $store.state.vuexStore.RSMCNum }}笔</p>
                <p>HTLC笔数: {{ $store.state.vuexStore.HTLCNum }}笔, HTLC - R: {{ $store.state.vuexStore.HTLCRNum }}笔</p>
            </template>
        </div>
        <div>
            <p>{{ $t('about.content') }}</p>
            <p><b>{{ $t('about.tipsTitle') }}  </b>{{ $t('about.tips') }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'aboutForm',
  data () {
    return {
        clickNum: 0,
        testNum: 0,
        transNum: 0,
        testWebSocket: "",
        txOnChannelInfo: {               //通道转账
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
    }
  },
  components: {
    headBox
  },
  watch: {
    clickNum(newValue, oldValue) { 
        if(newValue%5 == 0){            //每5次切换网络
            console.log('切换主网/测试网')
            this.switchNet();
        }
    },
    testNum(newValue, oldValue) { 
        if(newValue%5 == 0){            //每5次切换网络
            if((newValue/5)%2 ==0){
                console.log("关闭TestFun");
                clearInterval(this.transCycle);
                let transNum = this.transNum;
                let RSMCNum = this.$store.state.vuexStore.RSMCNum;
                let HTLCNum = this.$store.state.vuexStore.HTLCNum;
                let HTLCRNum = this.$store.state.vuexStore.HTLCRNum;
                console.log(`期间一共转账${transNum}笔交易,其中RSMC${RSMCNum}笔,HTLC${HTLCNum}笔,HTLC - R${HTLCRNum}笔`);
            } else {
                console.log('开启TestFun')
                this.test();
            }
        }
    }
  },
  filters:{

  },
  methods: {
      switchNet() {
          this.$store.state.vuexStore.isTestNet ? this.$store.state.vuexStore.isTestNet = false : this.$store.state.vuexStore.isTestNet = true;
      },
      test() {
        let _this = this;
        if(_this.$store.state.vuexStore.isOneStepPayment && _this.$store.state.vuexStore.walletInfo.keyStorePass){
            let wsuri = _this.$store.state.vuexStore.nodeWebSocketIp + ":" + _this.$store.state.vuexStore.spvPort;               //建立websocket连接
            _this.testWebSocket = new WebSocket(wsuri);
            _this.testWebSocket.onmessage = _this.websocketOnMessage;
            _this.testWebSocket.onclose = _this.websocketClose;
            let Message = {
                AssetType: "TNC",
                MessageBody: {},
                MessageType: "GetNodeList",
                NetMagic: "527465737419990331",
                Sender: "0x4E801062608188F5d6815ddC3e98B766088784CE@47.98.228.81:8866"
            }
            setTimeout(function(){
                _this.testWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
            },1000);
        } else {
            console.log("未打开免密支付");
        }
      },
      websocketOnMessage(e) {
          let redata = JSON.parse(e.data);
          let nodeList = [];
          redata.Nodes.nodes.forEach(function(data, index){
              nodeList.push(data.Ip.split(":")[0] + ":21556");
          });
          this.$store.state.vuexStore.nodeList = nodeList;
          console.log(this.$store.state.vuexStore.nodeList);

          this.htlcCycle();
      },
      websocketClose() {
          console.log("关闭");
      },
      randomNum(n, m){                          //参数为最小值与最大值
        var random = Math.floor(Math.random() * ( m - n + 1) + n);
        return random;
      },
      htlcCycle: function() {                //循环获取余额
        this.transCycle = setInterval(this.autoHtlc, 10000);
      },
      autoHtlc() {
        let _this = this;
        let random = _this.randomNum(1, 10);
        console.log(random);
       // if(random > 7){
            //  随机选取节点获取payment
            this.transNum += 1;
            _this.$store.state.vuexStore.txOnChannelInfo = [];
            _this.txOnChannelInfo = {               //清空数据
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
            }
            let n = _this.randomNum(0, _this.$store.state.vuexStore.nodeList.length - 1);
            console.log(n);
            let value = _this.randomNum(1, 10);
            axios({
                method: 'post',
                url: "http://" + _this.$store.state.vuexStore.nodeList[n],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "GetPayment",
                    "params": ["TNC", Number(value).mul(10e6)],
                    "id": 1
                })
            }).then(function(res){
                console.log(res.data);
                let payment = res.data.result.MessageBody.pycode;
                //解析payment
                let LinkData = base58decode(payment.substring(2)).toString();
                let LinkDataList = LinkData.split("&");     //去除隔离符取出数据
                console.log(LinkDataList);
                _this.txOnChannelInfo.receiverUri = LinkDataList[0];                  //uri
                _this.txOnChannelInfo.netMagic = LinkDataList[1];                           //NetMagic
                _this.txOnChannelInfo.hr = LinkDataList[2];                                 //hashR
                _this.txOnChannelInfo.assetType = LinkDataList[3];        //资产类型
                _this.txOnChannelInfo.value = LinkDataList[4];                 //支付金额
                _this.txOnChannelInfo.description = LinkDataList[5];                  //备注
                //构造路由消息
                let l = _this.$parent.$parent.getChannelSerial("OtherUri", _this.txOnChannelInfo.receiverUri, 'open', false);
                if(l >= 0){
                    if(Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) >= Number(_this.txOnChannelInfo.value)){
                        console.log("RSMC");
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
                            "PaymentCount": _this.txOnChannelInfo.value,
                            "SenderBalance": Number(_this.$store.state.vuexStore.channelList[l].SelfBalance) - Number(_this.txOnChannelInfo.value),
                            "ReceiverBalance": Number(_this.$store.state.vuexStore.channelList[l].OtherBalance) + Number(_this.txOnChannelInfo.value),
                            //"HashR": 0x0,
                            "Commitment": "",
                            "RoleIndex": 0
                        },
                        "Comments": {}
                        }
                        _this.$store.state.vuexStore.txOnChannelInfo = _this.txOnChannelInfo;           //保存通道转账信息
                        console.log(_this.$store.state.vuexStore.txOnChannelInfo);
                        _this.$parent.$parent.sendWebsocket(_this.txOnChannelInfo.receiverUri, Message);        //发送websocket消息
                    }  else {
                        console.log("余额不足,停止交易");
                        clearInterval(_this.transCycle);
                    }
                } else {
                    console.log("HTLC");
                    let i ;
                    _this.$store.state.vuexStore.channelList.forEach(function(data,index){          //遍历通道列表,获取任意一个开通的通道
                    if(data.State == 3 && data.isConnect == true){
                        i = index;
                        return;
                        }
                    })

                    let UriList = [];                   //声明Uri队列
                    _this.$store.state.vuexStore.channelList.forEach(function(data,index){          //遍历通道列表,获取所有开通状态的的uriList
                        if(data.State == 3 && data.isConnect == true){
                        UriList.push(data.OtherUri);
                        }
                    })
                    console.log(UriList);
                    console.log(i);
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
                    _this.$store.state.vuexStore.HTLCNum += 1;
                    if(Number(_this.$store.state.vuexStore.channelList[i].SelfBalance) >= Number(_this.txOnChannelInfo.value)){
                        _this.$parent.$parent.sendWebsocket(_this.$store.state.vuexStore.channelList[i].SelfUri, Message);        //发送websocket消息
                    } else {
                       console.log("余额不足,停止交易");
                       clearInterval(_this.transCycle); 
                    }
                }
            })
        //}
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutForm{
    float: left;
    height: calc(100% - 44px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 4;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h4{
    font-size: 14px;
}
img{
    width: 72px;
}
p{
    font-size: 12px;
    line-height: 20px;
}
</style>
