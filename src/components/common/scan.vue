<template>
  <div class="scanForm">
    <div class="headBox">
      <div class="header-button is-left">
        <i @click="back()" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1>{{ $router.name }}</h1>
      <div class="header-button is-right" style="text-align:right;">
        
      </div>
    </div>
    <div id= "bcid"></div>
  </div>
</template>

<script>
export default {
  name: 'scanForm',
  data () {
    return {

    }
  },
  computed: {
    baseChain() {                       //获取vuex中的baseChain赋值给baseChain
        return this.$store.state.vuexStore.baseChain;
    },
  },
  filters:{

  },
  mounted() {
    this.$nextTick(function(){
      let _this = this;
      setTimeout(function () {
          _this.startRecognize();
      },350);
    })
  },
  watch: {

  },
  methods: {
    back() {
      this.$router.go(-1);
      scan.close();
    },
    startRecognize() {
        scan = new plus.barcode.Barcode('bcid');
        scan.onmarked = this.onmarked;
        this.startScan();
    },
    onmarked (type, result) {
      let _this = this;
      var text = '未知';
      switch (type) {
        case plus.barcode.QR:
          text = 'QR';
          break;
        case plus.barcode.EAN13:
          text = 'EAN13';
          break;
        case plus.barcode.EAN8:
          text = 'EAN8';
          break;
      }
      console.log(text + ": " + result);
      _this.closeScan();
      if(result.startsWith('TN')){
        _this.$router.push({name: 'payment', params: {paymentCode: result}});
      } else {
        if(result.includes('@') && result.includes(':')){
          _this.$router.push({name: 'addChannelForm', params: {Uri: result}});
        } else {
          if(_this.baseChain == "ETH" && web3.utils.checkAddressChecksum(result)){
            _this.$router.push({name: 'transferOnChain', params: {address: result}});
          } else if(_this.baseChain == "NEO" && result.length == 34){
            _this.$router.push({name: 'transferOnChain', params: {address: result}});
          } else {
            alert("无效二维码");
            _this.$router.go(-1);
          }
        }
      }
	  },
    startScan () {
        scan.start();
    },
    closeScan () {
        scan.close();
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scanForm{
  float: left;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #FFFFFF;
  z-index: 3;
}
#bcid{
    height: calc(100% - 44px);
    width: 100%;
    /* height:480px;
    width:360px; */
    background: rgba(0,0,0,0.5);
}
</style>
