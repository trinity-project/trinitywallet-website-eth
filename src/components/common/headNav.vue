<template>
    <nav>
        <h1 @click="storeLoginFlag()">{{$t('navMenu.title')}}</h1>
        <el-row class="tac">
            <el-col :span="24">
                <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>钱包</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item @click="toLoginForm()" index="1-1">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <router-link to="/receive">
                            <el-menu-item index="1-2">
                                <i class="el-icon-setting"></i>
                                <span slot="title">收款</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/addChannel">
                            <el-menu-item index="1-3">
                                <i class="el-icon-setting"></i>
                                <span slot="title">添加通道</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/channelList">
                            <el-menu-item index="1-4">
                                <i class="el-icon-setting"></i>
                                <span slot="title">通道列表</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/record">
                            <el-menu-item index="1-5">
                                <i class="el-icon-setting"></i>
                                <span slot="title">交易记录</span>
                            </el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </el-submenu>
                <router-link to="/contact">
                    <el-menu-item index="2">
                        <i class="el-icon-document"></i>
                        <span slot="title">联系人</span>
                    </el-menu-item>
                </router-link>
                <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>设置</span>
                    </template>
                    <el-menu-item-group>
                    <el-menu-item @click="switchLang()" index="3-1">更改语言</el-menu-item>
                    <el-menu-item index="3-2">自定义主题</el-menu-item>
                    <el-menu-item index="3-3">修改密码</el-menu-item>
                    <router-link to="/backup">
                        <el-menu-item index="3-4">备份</el-menu-item>
                    </router-link>
                    <el-menu-item index="3-5">退出</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>测试功能</span>
                    </template>
                    <el-menu-item-group>
                        <router-link to="/login">
                            <el-menu-item index="4-1">
                                <i class="el-icon-setting"></i>
                                <span slot="title">登录</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/index6">
                            <el-menu-item index="4-2">
                                <i class="el-icon-setting"></i>
                                <span slot="title">私钥转地址</span>
                            </el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
    </nav>
</template>

<script>
export default {
  name: 'LeftNav',
  data () {
    return {
      isLogin:false,
    }
  },
  mounted() {
    this.$nextTick(function(){
        this.$store.state.vuexStore.isLogin = this.fetch("isLogin");
        console.log(this.$store.state.vuexStore.isLogin);
        if(!this.$store.state.vuexStore.isLogin){
            this.$router.push('/login')
        }
    })
  },
  methods: {
    switchLang (){
        // console.log(1);
        this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        this.save1("lang",this.$i18n.locale);
    },
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
        console.log(key, keyPath);
    },
    toLoginForm() {
        if(this.$store.state.vuexStore.isLogin){
            this.$router.push('/')
        } else {
            this.$router.push('/login')
        }
    },
    storeLoginFlag() {
        this.$store.state.vuexStore.isLogin = !this.$store.state.vuexStore.isLogin;
        this.save1("isLogin",this.$store.state.vuexStore.isLogin);
    },
    fetch:function(key){
      const KEY1 = key.toString();
      return JSON.parse(window.localStorage.getItem(KEY1) || '[]')
    },
    save:function(key,items){
      const KEY1 = key.toString();
      window.localStorage.setItem(KEY1,JSON.stringify(items))
    },
    save1:function(key,items){
      const KEY1 = key.toString();
      window.localStorage.setItem(KEY1,items);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav{
    width: 100%;
    max-width: 300px;
    height: 100vh;
    float: left;
    background-color: #555C63;
}
nav h1{
    font-size: 20px;
    color: #303133;
    padding: 0 20px;
    cursor: pointer;
    transition: border-color .3s,background-color .3s,color .3s;
    box-sizing: border-box;
    padding-left: 20px;
    color: rgb(255, 255, 255);
    background-color: rgb(84, 92, 100);
    margin: 0;
    height: 56px;
    line-height: 56px;
    position: relative;
    white-space: nowrap;
    list-style: none;
    text-align: center;
    cursor: default;
}
</style>
