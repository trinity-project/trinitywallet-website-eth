<template>
  <div class="rankingForm">
    <div class="headBox">
        <div class="header-button is-left">
        <i @click="back()" class="el-icon-ETH-fanhui"></i>
        </div>
        <h1>{{ $router.name }}</h1>
        <div class="header-button is-right" style="text-align:right;">
        
        </div>
    </div>
    <div class="banner">
        <div class="txtBox">
            <h1>排行榜</h1>
            <p>Trinity状态通道排行榜</p>
        </div>
        <img src="./../../assets/img/discover/ranking/ranking.png" alt="">
    </div>
    <div class="tabs">
        <div @click="selectPane(item.func, index)" :class="{'is-selected': tabPaneSelected == index}" v-for="(item, index) in tabsItems" :key="index" class="tab-pane">
            {{ item.name }}
            <div style="position: absolute;bottom: 0;text-align:center;left: 0;bottom: 0px;width: 100%;">
                <div class="sanjiao"></div>
            </div>
        </div>
    </div>
    <div class="contentBox">
        <div class="cell" v-for="(data, index) in rankingDataOrderBy" :key="index">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <div v-if="index == 0" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-1"></use>
                        </svg>
                    </div>
                    <div v-if="index == 1" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-2"></use>
                        </svg>
                    </div>
                    <div v-if="index == 2" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-3"></use>
                        </svg>
                    </div>
                    <div v-if="index > 2" class="indexBox">
                        <h2>{{ index + 1 }}</h2>
                    </div>
                    <span class="cell-text">{{ data.address | formatAddress }}</span>
                </div>
                <div class="cell-right" v-if="dataOrderBy == 'payment' || dataOrderBy == 'income'">
                    {{ data[dataOrderBy] | formatBalance }}{{ data.assetType }}
                </div>
                <div class="cell-right" v-if="dataOrderBy == 'nonce'">
                    {{ data.nonce }}
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'Vue'
import headBox from './../common/headBoxForChild'
export default {
  name: 'rankingForm',
  data () {
    return {
        tabsItems: [
            {
                name: "按支付量",
                func: "payment"
            },
            {
                name: "按收款量",
                func: "income"
            },
            {
                name: "按交易次数",
                func: "nonce"
            }
        ],
        tabPaneSelected: 0,
        dataOrderBy: "payment",
        DataList: [],
    }
  },
  components: {
    
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时连接至全节点
        //let _this = this;
        this.getnodeList();         //获取排行榜信息
    })
  },
  watch: {

  },
  filters:{
    formatAddress:function(val){
        var address = "";
        if(val){
            address = val.replace(/(.{8}).*(.{8})/,"$1......$2");
        }
        return address;
    },
    formatBalance(val) {
        var value = "";
        if(val > 0){
            value = Number(val).div(10e7);
        } else {
            value = 0;
        }
        return value;
    }
  },
  computed: {
    rankingDataOrderBy() {
      return this.DataList.sort((a,b) => b[this.dataOrderBy] - a[this.dataOrderBy]);             //降序
    },
    nodeWebSocketIp() {                                 //稳定的node节点
      return this.$store.state.vuexStore.nodeWebSocketIp;
    },
    spvPort() {                                         //spv端口号
      return this.$store.state.vuexStore.spvPort;
    },
  },
  methods: {
    selectPane(func, index){                                 //切换Nav事件
        this.tabPaneSelected = index;                  //Nav选中之后设置store里的值为当前的index。
        this.dataOrderBy = func;
    },
    getnodeList() {
        let _this = this;
        let wsuri = "ws://47.98.228.81:8866";               //建立websocket连接
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
    },
    websocketOnMessage(e) {
        let redata = JSON.parse(e.data);
        let nodeList = [];
        redata.Nodes.nodes.forEach(function(data, index){
            nodeList.push(data.Publickey + "@" + data.Ip.split(":")[0] + ":21556");
        });
        this.$store.state.vuexStore.nodeList = nodeList;
        console.log(this.$store.state.vuexStore.nodeList);

        this.getRankingData();                        //立即获取排行榜数据
        this.cycleGetData = setInterval(this.getRankingData, 10000);      //循环获取
    },
    websocketClose() {
        console.log("关闭");
    },
    getRankingData() {
      let _this = this;
      let list = this.$store.state.vuexStore.nodeList;
      for(var i = 0; i < list.length; i++){
        axios({
            method: 'post',
            url: "http://" + list[i].split("@")[1],
            headers: {
            'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "GetWalletStatistics",
            "params": [list[i].split("@")[0]],
            "id": 1
            })
        }).then(function(res){
            if(res.data.result.MessageType == "GetWalletStatisticsAck"){
                console.log(res.data.result.MessageBody);
                let data = res.data.result.MessageBody;

                let rsmc_successed = data.rsmc_successed || 0;
                let htlc_successed = data.htlc_successed || 0;
                let total_rsmc_transaction = data.total_rsmc_transaction || 0;
                let total_htlc_transaction = data.total_htlc_transaction || 0;

                let Message = {
                    address: data.address,
                    assetType: "TNC",
                    income: data.income || 0,
                    rsmc_successed: rsmc_successed,
                    total_rsmc_transaction: total_rsmc_transaction,
                    htlc_successed: htlc_successed,
                    total_htlc_transaction: total_htlc_transaction,
                    total_free: data.total_free || 0,
                    payment: data.payment || 0,
                    nonce_successed: rsmc_successed + htlc_successed,
                    nonce: total_rsmc_transaction + total_htlc_transaction,
                }
                console.log(Message);
                let isNewData = true;
                _this.DataList.forEach(function(val, index){
                    if(val.address == data.address){
                        console.log("更新数据");
                        Vue.set(_this.DataList, index, Message);
                        isNewData = false;
                        return;
                    }
                })
                if(isNewData){
                    _this.DataList.push(Message);
                }
            }
        })
      }
    },
    back() {
        clearInterval(this.cycleGetData);
        this.$router.go(-1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rankingForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.headBox{
    background: RGBA(64, 64, 67, 0.97);
}
.banner{
    height: 100px;
    background: RGBA(64, 64, 67, 0.97);
    padding: 0 28px;
    color: #FFFFFF;
    position: relative;
}
.txtBox{
    
}
h1{
    font-size: 30px;
    margin: 0;
}
.txtBox p{
    font-size: 14px;
    line-height: 20px;
    margin: 5px 0;
}
.banner img{
    width: 76px;
    position: absolute;
    right: 30px;
    top: -3px;
}
.contentBox{
    height: calc(100% - 206px);
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
}
.tabs{
    display: flex;
}
.tab-pane{
    font-size: 13px;
    font-weight: normal;
    border: none;
    background: RGBA(56, 56, 59, 0.97);
    color: #FFFFFF;
    height: 50px;
    line-height: 50px;
    text-align: center;
    flex: 1;
    padding: 0 20px;
    display: inline-block;
    list-style: none;
}
.tab-pane.is-selected {
    font-size: 15px;
    font-weight: 600;
    position: relative;
}
.tab-pane .sanjiao{
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent #FFFFFF transparent;
    margin: 0 auto;
}
.cell-wrapper{
    height: 60px;
}
.indexBox{
    display: inline-block;
    vertical-align: middle;
}
.indexBox h2{
    margin: 0;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: -0.15em;
    color: #BBBBBB;
}
p{
    font-size: 13px;
    line-height: 20px;
}
.cell:first-child{
    border-top: none;
}
.cell:last-child{
    border-bottom: none;
    margin-bottom: 44px;
}
.rankingForm .icon {
   width: 30px;
   height: 30px;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
}
</style>
