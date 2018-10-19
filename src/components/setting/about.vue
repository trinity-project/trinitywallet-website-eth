<template>
  <div class="aboutForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('about.title') }}</h2>
        <hr/>
        <div style="text-align:center;">
            <img @click="clickNum += 1" src="./../../assets/img/Trinity.png" alt="Trinity">
            <h4>Trinity Wallet for ETH</h4>
            <p v-if="$store.state.vuexStore.isTestNet" style="color:red;">Test Network</p>
            <p>Version: V{{ $store.state.vuexStore.version }}</p>
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
        clickNum: 0
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
    }
  },
  filters:{

  },
  methods: {
      switchNet() {
          this.$store.state.vuexStore.isTestNet ? this.$store.state.vuexStore.isTestNet = false : this.$store.state.vuexStore.isTestNet = true;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutForm{
    float: left;
    height: calc(100% - 56px);
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
    font-size: 16px;
}
img{
    width: 88px;
}
p{
    font-size: 13px;
    line-height: 20px;
}
</style>
