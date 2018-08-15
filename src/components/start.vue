<template>
  <div class="startForm">
    <div class="contentBox">
        <h2>{{ $t('start.title') }}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div @click="toOtherForm('./create')" class="clooseLoginBox clooseLoginBox-blue">
            <h3>{{ $t('start.createWallet') }}</h3>
            <p>{{ $t('start.createWalletTxt') }}</p>
        </div>
        <div @click="toOtherForm('./loginByPrivateKey')" class="clooseLoginBox clooseLoginBox-green">
            <h3>{{ $t('start.loginByPrivateKey') }}</h3>
            <p>{{ $t('start.loginByPrivateKeyTxt') }}</p>
        </div>
        <div @click="toOtherForm('./loginByKeyStore')" class="clooseLoginBox clooseLoginBox-gray">
            <h3>{{ $t('start.loginByKeystore') }}</h3>
            <p>{{ $t('start.loginByKeystoreTxt') }}</p>
        </div>
        <a @click="switchLang()" class="backToStartBtn">{{$t('navMenu.setting.switchLang')}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'startForm',
  data () {
    return {

    }
  },
  methods: {
      toOtherForm(router) {
        this.$router.push(router);
      },
      switchLang() {      //切换语言
        this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        this.$parent.saveAsString("lang",this.$i18n.locale);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.startForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
}
.contentBox{
    height: calc(100% - 56px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h2{
    margin: 0;
}
.clooseLoginBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
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
.clooseLoginBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    /* border-bottom: 1px solid #CCCCCC; */
}
.clooseLoginBox p{
    font-size: 14px;
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
