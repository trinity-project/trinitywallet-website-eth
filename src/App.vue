<template>
  <div id="app" class="clearfloat" mode="in-out">
      <head-nav/>
      <div class="rightBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
          <head-box/>
          <router-view/>
          <message-box/>
          <footer-box/>
      </div>
  </div>
</template>

<script>
import headNav from './components/common/headNav'
import headBox from './components/common/headBox'
import messageBox from './components/common/messageBox'
import footerBox from './components/common/footer'

export default {
  name: 'App',
  components: {
    headNav,
    headBox,
    footerBox,
    messageBox
  },
  methods: {
    backToStart() {
      this.$router.push('/start');
    },
    fetchAsArray:function(key){     //获取localStorage的数组，json，boolean等数据
      let KEY1 = key.toString();
      return JSON.parse(window.localStorage.getItem(KEY1) || '[]')
    },
    fetchAsString:function(key){           //获取localStorage的String数据
      let KEY1 = key.toString();
      return window.localStorage.getItem(KEY1) || ''
    },
    saveAsArray:function(key,items){    //以数组，json，boolean等数据格式储存localStorage
      let KEY1 = key.toString();
      window.localStorage.setItem(KEY1,JSON.stringify(items))
    },
    saveAsString:function(key,items){    //以String格式储存localStorage
      let KEY1 = key.toString();
      window.localStorage.setItem(KEY1,items);
    },
    decryptPrivateKey (keyStore,password) {
      let decryptPrivateKey;
      try {
          decryptPrivateKey = web3.eth.accounts.decrypt(keyStore, password);
      } catch (e) {
          if(e.message == 'Key derivation failed - possibly wrong password'){
              _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '钱包解锁失败 - 可能是密码错误',
                  duration: 3000
              });
              return false;
          } else {
              _this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: e.message,
                  duration: 3000
              });
              return false;
          }
      }
      return decryptPrivateKey;
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100vh;
}
#app {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
.clearfloat:after{
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat{
  zoom: 1;
}
a{
  text-decoration: none;
}
ul,li{ 
  padding:0;
  margin:0;
  list-style:none
}
.rightBox{
  width: calc(100% - 300px);
  height: 100vh;
  background: #FFFFFF;
  transition:ease 0.7s;
  position: absolute;
  right: 0;
  z-index: 2;
}
.fullPage{
  width: 100% !important;
}
.backToStartBtn{
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  text-decoration: underline;
}
nav .el-menu-item-group__title {
  padding: 0;
}
nav .el-menu {
  border-right: 0;
}
.headBox .el-badge__content {
  border: 0;       /* 去除角标边框 */
}
.el-dialog{
  min-width: 300px;
}
.indexBox .assetBox .assetTable tr,.indexBox .assetBox .assetTable th,.indexBox .assetBox .assetTable td{
  background-color:transparent;
}
.contactBox .el-dialog__body,.txOnChainBox .el-dialog__body{
  padding: 18px 25px 0;
}
.footer .el-menu--horizontal>.el-menu-item {
  height: 48px;
  line-height: 23px;
}
.footer .el-menu--horizontal {
  border-top: solid 2px RGBA(248, 248, 248, 1.00);
  border-bottom: solid 2px #e6e6e6;
}
.footer .el-menu{
  background-color: transparent;
}
</style>
