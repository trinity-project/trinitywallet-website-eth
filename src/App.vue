<template>
  <div id="app" class="clearfloat">
    <head-nav/>
    <router-view/>
    <footer-box/>
  </div>
</template>

<script>
import headNav from './components/common/headNav'
import footerBox from './components/common/footer'

export default {
  name: 'App',
  components: {
    headNav,
    footerBox
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
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
nav .el-menu-item-group__title {
    padding: 0;
}
nav .el-menu {
    border-right: 0;
}
.el-dialog{
  min-width: 300px;
}
.headBox .assetTable tr,.headBox .assetTable th,.headBox .assetTable td{
  background-color:transparent;
}
.contactBox .el-dialog__body{
  padding: 18px 25px 0;
}
</style>
