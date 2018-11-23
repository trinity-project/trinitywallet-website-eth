<template>
  <div class="messageForm">
    <div class="headBox">
      <div class="header-button is-left">
        
      </div>
      <h1>消息中心</h1>
      <div class="header-button is-right" style="text-align:right;">
        <p v-if="messageList.length" @click="clearAll()">清空全部</p>
      </div>
    </div>
    <div class="contentBox">
        <ul v-if="messageList.length" class="listUl">
            <li @click="readMessage(item)" v-for="(item,index) in messageList" :key="index">
                <h2 class="title">{{ item.title }}<span :class='{ isRead: item.isRead }' class="readFlag"></span><span class="date">{{ item.date | formatDateTime }}</span></h2>
                <div class="bottomBox">
                    <img :src="item.imgLink" alt="image">
                    <p>{{ item.content }}</p>
                    <p v-if="item.sender.type == 'channel'">发起人: {{ item.sender.name }} - 通道</p>
                    <p v-if="item.sender.type == 'address'">发起人: {{ item.sender.name | formatAddress }}</p>
                    <p v-if="item.sender.type == 'trinity'">发起人: {{ item.sender.name }}</p>
                </div>
            </li>
        </ul>
        <p v-else style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
            消息中心功能正在加入中...
        </p>
    </div>
    <!-- <i @click="clearAll()" class="clearAllBtn el-icon-ETH-qingkong"></i> -->
  </div>
</template>

<script>
import Vue from 'Vue'
export default {
  name: 'messageForm',
  data () {
    return {
        messageList:[
            {
                title: "欢迎来到消息中心",
                messageType: "signFun",
                isRead: false,
                date: 1539314320400,
                imgLink: "./../../../static/Trinity.png",
                content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
                sender: {
                    type: "channel",
                    name: "1" 
                }
            },
            {
                title: "目前该功能还在开发中",
                messageType: "showPrivateKey",
                isRead: false,
                date: 1539314320400,
                imgLink: "./../../../static/Trinity.png",
                content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
                sender: {
                    type: "address",
                    name: "0xADCe15cDEc589f93D25BE13DFa9370F659e78D45" 
                }
            },
            {
                title: "敬请期待",
                messageType: "testFun",
                isRead: true,
                date: 1539314320400,
                imgLink: "./../../../static/Trinity.png",
                content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
                sender: {
                    type: "trinity",
                    name: "Trinity" 
                }
            }
        ],
        messageList1: []
    }
  },
  filters:{
    formatAddress:function(val){
        var address;
        address = val.replace(/(.{8}).*(.{8})/,"$1...$2");
        return address;
    },
    formatDateTime:function(val) {              //格式化时间戳
        var date = new Date(val);
        var MM = date.getMonth() + 1;    
        MM = MM < 10 ? ('0' + MM) : MM;    
        var DD = date.getDate();    
        DD = DD < 10 ? ('0' + DD) : DD;
        var hh = date.getHours();
        var mm = date.getMinutes(); 
        return MM + '-' + DD + ' ' + hh + ':' + mm;    
    }
  },
  methods: {
    readMessage(item) {
        console.log(item);
        switch (item.messageType)
        {
        case "signFun":
            this.signFun();
            break;
        case "showPrivateKey":
            this.showPrivateKey();
            break;
        case "testFun":
            this.testFun1();
            break;
        default:
            alert("未知消息类型");
        }
    },
    clearAll() {
      console.log("清除全部");
      this.$store.state.vuexStore.channelList = [];
      this.$parent.$parent.StoreData("channelList");
      this.$store.state.vuexStore.recordList = [];
      this.$parent.$parent.StoreData("recordList");
      this.$store.state.vuexStore.txList = [];
      this.$parent.$parent.StoreData("txList");
      this.$store.state.vuexStore.eventList = [];
      this.$parent.$parent.StoreData("eventList");
      return false;
    },
    signFun() {
      let _this = this;
      let txData = web3.utils.soliditySha3(         //生成代签名交易数据
          {t: 'bytes32', v: "0x295722f9ae1a0fe6315a9d7c7b930f5740c8ca8f8163da076e35c1f347f5410e"},    //通道名称
          {t: 'uint256', v: 2},                                //TXnonce
          {t: 'address', v: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F"},                 //对端地址
          {t: 'uint256', v: 900000000},                                 //对端余额
          {t: 'address', v: "0xA5a0640c9542c7621cDA89Cce562580b66333549"},                                    //本端地址
          {t: 'uint256', v: 1100000000},                                 //本端余额
          {t: 'bytes32', v: "0x0000000000000000000000000000000000000000000000000000000000000000"},           //HashR
          {t: 'bytes32', v: "0x0000000000000000000000000000000000000000000000000000000000000000"},               //R
      );
      console.log(txData);
      
      let selfSignedData = ecSign(txData,"0xab669573efbdcaf5f2d88704b41162a77c6090cf908d937979d5c38b44e66741");         //签名
      console.log(selfSignedData);
    },
    showPrivateKey() {
      this.$notify.error({
        title: this.$t('common.warning'),
        dangerouslyUseHTMLString: true,
        message: "e",
        duration: 0
      });
    },
    testFun1() {                                 //恢复到刚建通道的状态
        let channelName = this.$store.state.vuexStore.channelList[0].ChannelName;
        let TxNonce = 1;
        let founderBalance = 1000000000;
        let peerBalance = 1000000000;
        // let txListMessage = {                           //txData
        //     "state": "INIT",
        //     "founderSignedData": "",
        //     "peerSignedData": ""
        // }
        // this.$parent.$parent.updateTxList1(channelName, TxNonce, txListMessage);                  //更新TxList
        this.$parent.$parent.updateTxListLength(channelName, TxNonce + 1);
        this.$parent.$parent.StoreData("txList");

        let l = this.$parent.$parent.getChannelSerial("ChannelName", channelName);
        let channelInfo = this.$store.state.vuexStore.channelList[l];
        channelInfo.SelfBalance = founderBalance;     //本端余额更新
        channelInfo.OtherBalance = peerBalance;    //对端余额更新
        channelInfo.TxNonce = TxNonce;
        Vue.set(this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(this.$store.state.vuexStore.channelList[l]);
        this.$parent.$parent.StoreData("channelList");                   //保存通道信息

        this.$store.state.vuexStore.eventList = [];
        this.$parent.$parent.StoreData("eventList");
    },
    testFun2() {                                 //恢复到"INIT"状态
        let channelName = this.$store.state.vuexStore.channelList[0].ChannelName;
        let TxNonce = 2;
        let founderBalance = 1000000000;
        let peerBalance = 1000000000;
        let txListMessage = {                           //txData
            "state": "INIT",
            "founderSignedData": "",
            "peerSignedData": ""
        }
        this.$parent.$parent.updateTxList1(channelName, TxNonce, txListMessage);                  //更新TxList
        this.$parent.$parent.updateTxListLength(channelName, TxNonce + 1);
        this.$parent.$parent.StoreData("txList");

        let l = this.$parent.$parent.getChannelSerial("ChannelName", channelName);
        let channelInfo = this.$store.state.vuexStore.channelList[l];
        channelInfo.SelfBalance = founderBalance;     //本端余额更新
        channelInfo.OtherBalance = peerBalance;    //对端余额更新
        channelInfo.TxNonce = TxNonce;
        Vue.set(this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(this.$store.state.vuexStore.channelList[l]);
        this.$parent.$parent.StoreData("channelList");                   //保存通道信息

        this.$store.state.vuexStore.eventList = [];
        this.$parent.$parent.StoreData("eventList");
    },
    testFun3() {                                 //恢复到"confirming"状态
        let channelName = this.$store.state.vuexStore.channelList[0].ChannelName;
        let TxNonce = 2;
        let founderBalance = 1000000000;
        let peerBalance = 1000000000;
        let txListMessage = {                           //txData
            "state": "confirming",
            "founderSignedData": "",
            // "peerSignedData": ""
        }
        this.$parent.$parent.updateTxList1(channelName, TxNonce, txListMessage);                  //更新TxList
        this.$parent.$parent.updateTxListLength(channelName, TxNonce + 1);
        this.$parent.$parent.StoreData("txList");

        let l = this.$parent.$parent.getChannelSerial("ChannelName", channelName);
        let channelInfo = this.$store.state.vuexStore.channelList[l];
        channelInfo.SelfBalance = founderBalance;     //本端余额更新
        channelInfo.OtherBalance = peerBalance;    //对端余额更新
        channelInfo.TxNonce = TxNonce;
        Vue.set(this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(this.$store.state.vuexStore.channelList[l]);
        this.$parent.$parent.StoreData("channelList");                   //保存通道信息

        this.$store.state.vuexStore.eventList = [];
        this.$parent.$parent.StoreData("eventList");
    },
    testFun4() {                                 //恢复到刚建通道的状态
        let channelName = this.$store.state.vuexStore.channelList[0].ChannelName;
        let TxNonce = 1;
        let founderBalance = 1000000000;
        let peerBalance = 1000000000;
        // let txListMessage = {                           //txData
        //     "state": "INIT",
        //     "founderSignedData": "",
        //     "peerSignedData": ""
        // }
        // this.$parent.$parent.updateTxList1(channelName, TxNonce, txListMessage);                  //更新TxList
        this.$parent.$parent.updateTxListLength(channelName, TxNonce + 1);
        this.$parent.$parent.StoreData("txList");

        let l = this.$parent.$parent.getChannelSerial("ChannelName", channelName);
        let channelInfo = this.$store.state.vuexStore.channelList[l];
        channelInfo.SelfBalance = founderBalance;     //本端余额更新
        channelInfo.OtherBalance = peerBalance;    //对端余额更新
        channelInfo.TxNonce = TxNonce;
        Vue.set(this.$store.state.vuexStore.channelList, l, channelInfo);            //更改通道信息
        console.log(this.$store.state.vuexStore.channelList[l]);
        this.$parent.$parent.StoreData("channelList");                   //保存通道信息

        this.$store.state.vuexStore.eventList = [];
        this.$parent.$parent.StoreData("eventList");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.messageForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #F2F2F2;
    z-index: 1; 
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}
.content_text{
    color:#000000;
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    margin:auto;
}
/* .clearAllBtn{
    background: rgba(25, 25, 25, 1);
    cursor: pointer;
    position: absolute;
    bottom: 86px;
    left: 30px;
    color: #FFFFFF;
    width: 60px;
    height: 60px;
    line-height: 62px;
    font-size: 28px;
    text-align: center;
    border-radius: 50%;
    opacity: 0.4;
}
.clearAllBtn:hover{
    opacity: 0.8;
} */
ul li{
    height: 136px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
}
li .title{
    font-size: 16px;
    margin: 6px 0;
    font-weight: 500;
}
li .date{
    float: right;
    font-size: 13px;
    color: #B7B7B7;
}
li .bottomBox{
    width: 100%;
    height: 86px;
    background: #F9F9F9;
    padding: 5px;
    box-sizing: border-box;
}
li .bottomBox img{
    padding: 10px;
    width: 76px;
    box-sizing: border-box;
    float: left;
}
/* 超出2行部分显示为省略号 */
li .bottomBox p{
    margin-top: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.readFlag{
    width: 10px;
    height: 10px;
    background: #f56c6c;
    border-radius: 50%;
    margin: 2px 0 2px 4px;
    float: right;
}
.isRead{
    background: inherit;
}
</style>
