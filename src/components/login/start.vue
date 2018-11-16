<template>
  <div class="startForm">
    <div class="headBox">
      <div class="header-button is-left">
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
      </div>
    </div>
    <div class="contentBox">
        <div>
            <div class="chainIconBox">
                <p>切换主链: </p>
                <i @click="switchNet('ETH')" :class="{ active: $store.state.vuexStore.baseChain == 'ETH' }" class="el-icon-ETH-ETH"></i>
                <i @click="switchNet('NEO')" :class="{ active: $store.state.vuexStore.baseChain == 'NEO' }" class="el-icon-ETH-NEO"></i>
            </div>
            <h2 @click="test1()" class="title_h2">{{ $t('start.title') }}</h2>
        </div>
        <hr/>
        <div @click="toOtherForm('./create')" class="clooseLoginBox clooseLoginBox-blue">
            <h3>{{ $t('start.createWallet') }}</h3>
            <p>{{ $t('start.createWalletTxt') }}</p>
        </div>
        <div @click="toOtherForm('./loginByPrivateKey')" class="clooseLoginBox clooseLoginBox-green">
            <h3>{{ $t('start.loginByPrivateKey') }}</h3>
            <p>{{ $t('start.loginByPrivateKeyTxt') }}</p>
        </div>
        <div v-if="$store.state.vuexStore.isMobile" @click="toOtherForm('./loginByMnemonic')" class="clooseLoginBox clooseLoginBox-yellow">
            <h3>从助记词恢复</h3>
            <p>{{ $t('start.loginByPrivateKeyTxt') }}</p>
        </div>
        <div v-else @click="toOtherForm('./loginByKeyStore')" class="clooseLoginBox clooseLoginBox-gray">
            <h3>{{ $t('start.loginByKeystore') }}</h3>
            <p>{{ $t('start.loginByKeystoreTxt') }}</p>
        </div>
        <a @click="switchLang()" class="backToStartBtn">{{$t('common.switchLang')}}</a>
    </div>
  </div>
</template>

<script>
import Bus from './../bus.js'
export default {
  name: 'startForm',
  data () {
    return {

    }
  },
  methods: {
      toOtherForm(router) {               //跳转到其他页面
        this.$router.push(router);
      },
      switchLang() {                      //切换语言
        this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        this.$parent.$parent.saveAsString("lang",this.$i18n.locale);
      },
      switchNet(Base) {                   //切换网络
        let _this = this;
        if(typeof(_this.$store.state.vuexStore.NodeUriWebSocket) == 'object'){
            _this.$store.state.vuexStore.NodeUriWebSocket.close();
            _this.$store.state.vuexStore.NodeUriWebSocket = "";
        }
        _this.$store.state.vuexStore.baseChain = Base;
        _this.$parent.$parent.saveAsString("baseChain",_this.$store.state.vuexStore.baseChain);                 // 存储底层主链信息
        Bus.$emit('UpdateConfig', true);                                                                        //调用config.vue更新配置
      },
      test1() {
        let a = createMnemonic();
        if(validateMnemonic(a)){
            mnemonic2privateKey(a);
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.startForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.contentBox{
    height: calc(100% - 44px);
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
}
.chainIconBox{
    height: 27px;
    line-height: 26px;
    float:right;
}
.chainIconBox p{
    margin: 0;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    float: left;
}
.chainIconBox i{
    font-size: 27px;
    color: #DCDFE6;
    margin: -4px 0 0 6px;
    cursor: pointer;
}
.chainIconBox .el-icon-ETH-ETH.active{
    color: RGBA(30, 64, 122, 1.00);
}
.chainIconBox .el-icon-ETH-NEO.active{
    color: RGBA(89, 191, 1, 1.00);
}
.clooseLoginBox{
    padding: 2px 16px;
    border-radius: 4px;
    margin: 5% 0;
    cursor: pointer;
}
.clooseLoginBox-blue{
    background-color: #ecf8ff;
    border-left: 5px solid #50bfff;
}
.clooseLoginBox-green{
    background-color: #f0f9eb;
    border-left: 5px solid #67c23a;
}
.clooseLoginBox-gray{
    background-color: #f4f4f5;
    border-left: 5px solid #909399;
}
.clooseLoginBox-yellow{
    background-color: #FEFBE5;
    border-left: 5px solid #FFBD2D;
}
.clooseLoginBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    font-size: 15px;
    /* border-bottom: 1px solid #CCCCCC; */
}
.clooseLoginBox p{
    font-size: 12px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
.fade-in-out-enter-active, .fade-in-out-leave-active {
  transition: 10s;
}
.fade-in-out-enter, .fade-in-out-leave-to {
  width: calc(100% - 300px);
  opacity: 1;
}
.fade-in-out-leave, .fade-in-out-enter-to {
  width: 100%;
  opacity: 1;
}
</style>
