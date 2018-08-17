<template>
    <footer v-if="$route.path !='/start' && $route.path !='/create' && $route.path !='/loginByPrivateKey' && $route.path !='/loginByKeyStore'" class="footer">
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
    </footer>
</template>

<script>
export default {
  name: 'footerBox',
  data () {
    return {
        FooterList:[
            {
                index: "1-1",
                icon: "el-icon-ETH-geren1",
                name: this.$t('navMenu.wallet.index'),
                router: "/"
            },
            {
                index: "1-2",
                icon: "el-icon-ETH-zhuanzhang",
                name: "Receive",
                router: "/receive"
            },
            {
                index: "1-3",
                icon: "el-icon-ETH-list",
                name: "Channel",
                router: "/channelList"
            },
            {
                index: "1-4",
                icon: "el-icon-ETH-dujiayuniconzhenggao-19",
                name: "Record",
                router: "/record"
            }
        ],
        navSelected: "1-1"
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  watch: {
    '$store.state.vuexStore.activeNavIndex': 'storeToFooter'            // 监测store中的activeNavIndex
  },
  methods:{
    selectItems(index){
        this.$store.state.vuexStore.activeNavIndex = index;        //Nav选中之后设置store里的值为当前的index。
        // console.log(this.$store.state.vuexStore.activeNavIndex);
    },
    storeToFooter() {
        this.navSelected = this.$store.state.vuexStore.activeNavIndex;
        //store.state.adminleftnavnum里值变化的时候，设置navSelected
    },
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
  box-sizing: border-box;
  /* border-top: 1px solid RGBA(183, 183, 184, 1.00); */
}
li {
    width: 25%;
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
span{
    display: block;
    font-size: 10px;
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
</style>
