<template>
  <div class="scanForm">
      <headBox/>
      <div id= "bcid"></div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'scanForm',
  data () {
    return {

    }
  },
  components: {
    headBox
  },
  computed: {

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
      console.log(4);
      console.log(text + ": " + result);
      _this.closeScan();
      _this.$router.go(-1);
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
    height: calc(100% - 56px);
    width: 100%;
    /* height:480px;
    width:360px; */
    background: rgba(0,0,0,0.5);
}
</style>
