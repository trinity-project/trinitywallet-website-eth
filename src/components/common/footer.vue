<template>
    <div>
        <!-- <footer style="display:none;" v-if="$route.path !='/start' && $route.path !='/create' && $route.path !='/loginByPrivateKey' && $route.path !='/loginByKeyStore'" class="footer">
            <el-menu :default-active="navSelected" :active="navSelected" @select="selectItems" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1-1">
                    <router-link to="/" class="clearfloat">
                        <span><i class="el-icon-ETH-geren1"></i></span>
                        <span>{{ $t('navMenu.wallet.index') }}</span>
                    </router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                    <router-link to="/receive" class="clearfloat">
                        <span><i class="el-icon-ETH-zhuanzhang"></i></span>
                        <span>{{ $t('navMenu.wallet.receive') }}</span>
                    </router-link>
                </el-menu-item>
                <el-menu-item index="1-3">
                    <router-link to="/channelList" class="clearfloat">
                        <span><i class="el-icon-ETH-list"></i></span>
                        <span>{{ $t('navMenu.wallet.channelList') }}</span>
                    </router-link>
                </el-menu-item>
                <el-menu-item index="1-4">
                    <router-link to="/record" class="clearfloat">
                        <span><i class="el-icon-ETH-dujiayuniconzhenggao-19"></i></span>
                        <span>{{ $t('navMenu.wallet.record') }}</span>
                    </router-link>
                </el-menu-item>
            </el-menu>
        </footer> -->
        <div class="tabbar" v-if="$route.path !='/start' && $route.path !='/create' && $route.path !='/loginByPrivateKey' && $route.path !='/loginByKeyStore'">
            <div v-for="(item, index) in tabbarList" :key="index" style="flex: 1;">
                <a @click.stop="selectItems(index,item.router)" v-if="index != 2 && index != 1" :class="{'is-selected': tabbarSelected == index}" class="tab-item">
                    <div class="tab-item-icon">
                        <i :class="item.icon"></i>
                    </div>
                    <div class="tab-item-label">
                        {{ item.name }}
                    </div>
                </a>
                <a @click.stop="selectItems(index,item.router)" v-if="index == 1" :class="{'is-selected': tabbarSelected == index}" class="tab-item">
                    <el-badge  :value="3" :max="99" class="item">
                        <div class="tab-item-icon">
                            <i :class="item.icon"></i>
                        </div>
                        <div class="tab-item-label">
                            {{ item.name }}
                        </div>
                    </el-badge>
                </a>
                <a @click.stop="showChannelForm()" v-if="index == 2" class="tab-item">
                    <div class="logoBox">
                        <img src="./../../assets/img/Trinity.png" alt="Trinity">
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'footerBox',
  data () {
    return {
        tabbarList:[
            {
                index: "0",
                icon: "el-icon-ETH-qianbao",
                name: "钱包",
                router: "/wallet"
            },
            {
                index: "1",
                icon: "el-icon-ETH-comment",
                name: "消息",
                router: "/message"
            },
            {
                index: "2",
                icon: "./../../assets/img/Trinity.png"
            },
            {
                index: "3",
                icon: "el-icon-ETH-discover",
                name: "发现",
                router: "/discover"
            },
            {
                index: "4",
                icon: "el-icon-ETH-wode",
                name: "我的",
                router: "/setting"
            }
        ],
        tabbarSelected: 0
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  watch: {
    
  },
  methods:{
    selectItems(index,router){
        this.tabbarSelected = index;        //Nav选中之后设置store里的值为当前的index。
        this.$router.push(router);
        // console.log(this.$store.state.vuexStore.activeNavIndex);
    },
    showChannelForm() {
        this.$store.state.vuexStore.isChannelFormShow = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer{
    width: 100%;
    height: 50px;
    padding-bottom: 2px;
    box-sizing: border-box;
    float: left;
    color: RGBA(124, 125, 129, 1.00);
    background: RGBA(248, 248, 248, 1.00);
    z-index: 2;
}
ul { 
  list-style-type: none;
  padding: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  /* border-top: 1px solid RGBA(183, 183, 184, 1.00); */
}
li {
    flex: 1;
    height: 100%;
}
a{
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 20px;
    text-align: center;
    color: RGBA(117, 118, 122, 1.00);
    text-decoration: none;
    box-sizing: border-box;
    /* padding: 8px 0; */
}
.logoBox{
    display: block;
    font-size: 10px;
    text-align: center;
}
.logoBox img{
    margin: 2px 0 4px;
    width: 38px;
}
[class^="el-icon-ETH"], [class*=" el-icon-ETH"] {
    font-size: 21px;
    margin: 0;
}
.container-fluid{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.fullPage{
    width: 100% !important;
}
.tabbar{
    height: 55px;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 1;
    display: flex;
    background: RGBA(255, 255, 255, 0.93);
    border-top: 1px solid #CCCCCC;
}
.tab-item{
    display: block;
    padding: 7px 0;
    text-decoration: none;
    cursor: pointer;
}
.tabbar>div>.tab-item.is-selected {
    color: #000000;
}
.tab-item-icon{
    width: 24px;
    height: 24px;
    margin: 0 auto 5px;
}
.tab-item-label {
    color: inherit;
    font-size: 12px;
    line-height: 1;
}
@keyframes antzone {
    0% {
        transform: none;
    }
    15% {
        transform: translate3d(-25%,0,0) rotate3d(0,0,1,-5deg);
    }
    30% {
        transform: translate3d(20%,0,0) rotate3d(0,0,1,3deg);
    }
    45% {
        transform: translate3d(-15%,0,0) rotate3d(0,0,1,-3deg);
    }
    60% {
        transform: translate3d(10%,0,0) rotate3d(0,0,1,2deg);
    }
    75% {
        transform: translate3d(-5%,0,0) rotate3d(0,0,1,-1deg);
    }
    100% {
        transform: none;
    }
}
</style>
