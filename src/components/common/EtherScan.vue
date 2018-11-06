<template>
  <div class="EtherScanForm">
    <headBox/>
    <div class="contentBox" id="EtherScanBox">
        <object style="border:0px" type="text/x-scriptlet" data="https://ropsten.etherscan.io" width=100% height=30></object> 
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'EtherScanForm',
  data () {
    return {
        clickNum: 0
    }
  },
  components: {
    headBox
  },
  watch: {

  },
  filters:{

  },
  mounted() {
    this.$nextTick(function(){ 
        // $("#EtherScanBox").load("https://ropsten.etherscan.io");
    })
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.EtherScanForm{
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
</style>
