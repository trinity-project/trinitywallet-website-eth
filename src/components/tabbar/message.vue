<template>
  <div class="messageForm">
    <div class="headBox">
      <div class="header-button is-left">
        
      </div>
      <h1>消息中心</h1>
      <div class="header-button is-right" style="text-align:right;">
        
      </div>
    </div>
    <div class="contentBox">
        <a @click.stop="clearAll()" class="clearAllBtn">清除全部</a>
        <ul>
            <li @click.stop="showPrivateKey()">欢迎点击消息中心</li>
            <li @click.stop="signFun()">目前该功能还未投入使用</li>
            <li>敬请期待</li>
        </ul>  
    </div>
  </div>
</template>

<script>
export default {
  name: 'messageForm',
  data () {
    return {

    }
  },
  filters:{

  },
  methods: {
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
      let _this = this;
      let decryptPK = _this.$parent.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore, "123");
      console.log(decryptPK.privateKey);
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
    padding: 30px;
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
.clearAllBtn{
    font-size: 13px;
    height: 35px;
    line-height: 25px;
    padding: 5px 10px;
    border-radius: 50px;
    background: rgba(25, 25, 25, 1);
    cursor: pointer;
    border: 1px solid rgba(25, 25, 25, 1);
    color: #FFFFFF;
}
.clearAllBtn:hover{
    background: rgba(25, 25, 25, 0.6);
    border: 1px solid #606266;
}
ul li{
    height: 60px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
}
.ulBox{
    overflow-x:hidden;
    height: calc(100% - 65px);
}
.ulBox::-webkit-scrollbar {           /* 隐藏滚动条 */
    display: none;
}
</style>
