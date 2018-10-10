<template>
  <div class="channelListForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <headBox/>
    <div class="contentBox">
        <div>
            <h2 class="title_h2">{{ $t('channelList.title') }}</h2>
        </div>
        <hr style="margin: 8px 0 0 0;" />
        <div class="buttonBox">
            <el-row :gutter="20">
                <el-col v-for="(item,index) in buttonBoxData" :key="index" :span="8">
                    <router-link :to="item.link" class="button-item">
                        <i :class="item.icon"></i>
                        <p>{{ item.name }}</p>
                    </router-link>
                </el-col>
            </el-row>
        </div>
        <div v-if="formatChannelList(channelList).length" style="overflow-x: hidden;height: calc(100% - 220px);">
            <ul>
                <li @click="toChannelAssetForm(data,index)" v-for="(data,index) in formatChannelList(channelList)" :key="index">
                    <h3>{{ data.Alice }}</h3><br>
                    <p>{{ data.date | formatDateTime }}</p>
                    <p v-if="data.isConnect" style="min-width: 180px;">State：{{ data.State | formatStatus }}</p>
                    <p v-if="!data.isConnect" style="min-width: 180px;">State：NotConnect</p>
                    <span>{{ data.SelfBalance | formatBalance }}<sup>{{ data.assetType }}</sup></span>
                </li>
            </ul>
        </div>
        <p v-if="!formatChannelList(channelList).length" style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
            {{ $t('channelList.noChannel') }}
        </p>
    </div>
  </div>
</template>

<script>
import Vue from 'Vue'
import headBox from './../common/headBoxForChild'
export default {
  name: 'channelListForm',
  data () {
    return {
        buttonBoxData:[                                     //按钮组数据
            {
                name: "收 款",
                icon: "el-icon-ETH-shoukuan",
                link: "/channel/createPayment",
            },
            {
                name: "付 款",
                icon: "el-icon-ETH-fukuan",
                link: "/channel/payment",
            },
            {
                name: "添 加",
                icon: "el-icon-plus",
                link: "/channel/addChannel",
            },
        ],
    }
  },
  components: {
    headBox
  },
  computed:{
      channelList() {                       //获取vuex中的channelList赋值给channelList
          return this.$store.state.vuexStore.channelList;
      }
  },
  filters:{
    formatStatus:function(val){         //格式化Channel状态
      let x;
      switch (val)
      {
      case 1:
        x="Closing";
        break;
      case 2:
        x="Opening";
        break;
      case 3:
        x="Open";
        break;
      default:
        x="Error";
      }
      return x;
    },
    formatBalance:function(val) {          //格式化余额
        let result;
        if(val < 0 || isNaN(val)){
            result = "error"; 
        } else {
            result = Number(val).div(10e7);
        }
        return result;
    },
    formatDateTime:function(val) {          //格式化时间戳
        let date = new Date();
        date.setTime(val);
        let yy = date.getFullYear();    
        let mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        let dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    },
    formatConnect:function(val) {          //格式化连接状态
        let result;
        if(val){
            result = "True";
        } else {
            result = "False";
        }
        return result;
    },
    formatNet:function(val) {          //格式化网络
        let result;
        if(val){
            result = "TestNet";
        } else {
            result = "MainNet";
        }
        return result;
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  watch: {
    '$store.state.vuexStore.walletInfo.channelList': 'getAddressInfo'            // 监测store中的channelList,出现变化时获取相关信息
  },
  methods: {
    toChannelAssetForm(data,index) {           //跳转到资产页面
      console.log(data);
      if(data){
          this.$router.push({name:'channelAsset',params: { Data: data }});
      }
    },
    formatChannelList(list) {
        let _this = this;
        let p = [];
        list.forEach(function(data,index){
            if(data.isTestNet == _this.$store.state.vuexStore.isTestNet){
                p.push(data);
            }
        });
        return p;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelListForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px 30px 0;
    box-sizing: border-box;
    overflow-x: hidden;
}
.contentBox::-webkit-scrollbar {
    display: none;
}
h3{
    font-weight: normal;
    display: inline-block;
    margin: 0 0 10px 0;
}
ul li{
    border-bottom:1px solid #ebeef5;
    position: relative;
    padding: 12px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}
ul li:first-child{
    border-top:1px solid #ebeef5;
}
ul li:hover{
    background: #f5f7fa;
}
ul li p{
    display: inline-block;
    margin: 0;
    width: 20%;
    font-size: 12px;
    min-width: 80px;
}
ul li span{
    position: absolute;
    font-size: 36px;
    right: 30px;
    top: 50%;
    margin-top: -20px;
}
ul li span sup {
    top: .2em;
    position: absolute;
    font-size: 34%;
}
.channelInfoBox{
    min-width: 375px;
}
.channelInfoBox span{
    display: block;
    margin: 10px 0;
    word-break: break-all;
}
/* 手机端改变某些字体大小 */
@media screen and (max-width: 450px) {
    ul li p{
        font-size: 12px;
    }
}
.el-icon-plus{
    background: #00B481;
}
.buttonBox a{
    color: #000000;
}
</style>
