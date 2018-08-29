<template>
  <div class="aboutForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>关于我们</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div style="text-align:center;">
            <img src="./../assets/img/Trinity.png" alt="Trinity">
            <h4>Trinity Wallet for ETH</h4>
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
export default {
  name: 'aboutForm',
  data () {
    return {

    }
  },
  filters:{

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutForm{
    float: left;
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100% - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h2{
    margin: 0;
    font-size: 24px;
}
h4{
    font-size: 16px;
}
img{
    width: 130px;
}
p{
    font-size: 16px;
    line-height: 20px;
}
</style>
