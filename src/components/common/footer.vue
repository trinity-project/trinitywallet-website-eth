<template>
    <div class="tabbar" v-show="isTabbarShow">
        <div v-for="(item, index) in tabbarList" :key="index" style="flex: 1;">
            <a @click.stop="selectItems(index,item.router)" v-if="index != 2 && index != 1" :class="{'is-selected': tabbarSelected == index}" class="tab-item">
                <div class="tab-item-icon">
                    <i :class="item.icon"></i>
                </div>
                <div class="tab-item-label">
                    <p><span>{{ item.name }}</span></p>
                </div>
            </a>
            <a @click.stop="selectItems(index,item.router)" v-if="index == 1" :class="{'is-selected': tabbarSelected == index}" class="tab-item">
                <el-badge  :value="3" :max="99" class="item">
                    <div class="tab-item-icon">
                        <i :class="item.icon"></i>
                    </div>
                    <div class="tab-item-label">
                        <p><span>{{ item.name }}</span></p>
                    </div>
                </el-badge>
            </a>
            <a @click.stop="showChannelForm()" v-if="index == 2" class="tab-item">
                <div class="TrinityButton">
                    <img src="./../../assets/img/Trinity.png" alt="Trinity">
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
  name: 'tabbar',
  data () {
    return {
        tabbarList:[
            {
                index: "0",
                icon: "el-icon-ETH-qianbao",
                name: this.$t('tabbar.wallet'),
                router: "/wallet"
            },
            {
                index: "1",
                icon: "el-icon-ETH-comment",
                name: this.$t('tabbar.message'),
                router: "/message"
            },
            {
                index: "2",
                icon: "./../../assets/img/Trinity.png"
            },
            {
                index: "3",
                icon: "el-icon-ETH-discover",
                name: this.$t('tabbar.discover'),
                router: "/discover"
            },
            {
                index: "4",
                icon: "el-icon-ETH-wode",
                name: this.$t('tabbar.setting'),
                router: "/setting"
            }
        ],
        tabbarSelected: 0,
        isTabbarShow: false
    }
  },
  mounted() {
    this.$nextTick(function(){
        
    })
  },
  computed: {

  },
  watch: {
    '$route.path': 'showTabbar',
    '$i18n.locale': 'changeLang'
  },
  methods:{
    selectItems(index,router){
        this.tabbarSelected = index;        //Nav选中之后设置store里的值为当前的index。
        this.$router.push(router);
        // console.log(this.$store.state.vuexStore.activeNavIndex);
    },
    showChannelForm() {
        this.$store.state.vuexStore.isChannelFormShow = true;
    },
    showTabbar() {
        let route = this.$route.path;
        if(route =='/start' || route =='/create' || route =='/loginByPrivateKey' || route =='/loginByKeyStore' || route =='/scan' || route =='/setting/language' || route =='/discover/ranking' || route =='/back'){
            this.isTabbarShow = false;
        } else {
            this.isTabbarShow = true;
        }
    },
    changeLang() {              //解决js中的i18n不切换的问题
        this.tabbarList[0].name = this.$t('tabbar.wallet');
        this.tabbarList[1].name = this.$t('tabbar.message');
        this.tabbarList[3].name = this.$t('tabbar.discover');
        this.tabbarList[4].name = this.$t('tabbar.setting');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabbar{
    height: 48px;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 98;
    display: flex;
    background: RGBA(255, 255, 255, 0.93);
    border-top: 1px solid #CCCCCC;
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
.TrinityButton{
    display: block;
    font-size: 10px;
    text-align: center;
}
.TrinityButton img{
    margin: 0;
    width: 36px;
}
[class^="el-icon-ETH"], [class*=" el-icon-ETH"] {
    font-size: 19px;
    margin: 0;
}

.tab-item{
    display: block;
    padding: 5px 0;
    text-decoration: none;
    cursor: pointer;
}
.tabbar>div>.tab-item.is-selected {
    color: #000000;
}
.tab-item-icon{
    width: 24px;
    height: 24px;
    margin: 0 auto 2px;
}
.tab-item-label {
    color: inherit;
    font-size: 10px;
    line-height: 1;
}
.tab-item-label p {
    font-size: 10px;
    margin: 0;
}
.tab-item-label p span {
    -webkit-transform:scale(0.85);
    -o-transform:scale(1); 
    display:inline-block
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
