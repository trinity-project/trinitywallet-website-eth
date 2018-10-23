<template>
  <div class="rankingForm">
    <div class="headBox">
        <div class="header-button is-left">
        <i @click="$router.go(-1)" class="el-icon-ETH-fanhui"></i>
        </div>
        <h1>{{ $router.name }}</h1>
        <div class="header-button is-right" style="text-align:right;">
        
        </div>
    </div>
    <div class="banner">
        <div class="txtBox">
            <h1>排行榜</h1>
            <p>Trinity状态通道排行榜</p>
        </div>
        <img src="./../../../static/Trinity.png" alt="">
    </div>
    <div class="tabs">
        <div @click="selectPane(index)" :class="{'is-selected': tabPaneSelected == index}" v-for="(item, index) in tabsItems" :key="index" class="tab-pane">
            {{ item.name }}
            <div style="position: absolute;bottom: 0;text-align:center;left: 0;bottom: 0px;width: 100%;">
                <div class="sanjiao"></div>
            </div>
        </div>
    </div>
    <div class="contentBox">
        <div class="cell" v-for="(data, index) in DataList" :key="index">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <div v-if="index == 0" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-1"></use>
                        </svg>
                    </div>
                    <div v-if="index == 1" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-2"></use>
                        </svg>
                    </div>
                    <div v-if="index == 2" class="indexBox">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiangpai-3"></use>
                        </svg>
                    </div>
                    <div v-if="index > 2" class="indexBox">
                        <h2>{{ index + 1 }}</h2>
                    </div>
                    <span class="cell-text">{{ data.address | formatAddress }}</span>
                </div>
                <div class="cell-right">
                        {{ data.number }}{{ data.assetType }}
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'rankingForm',
  data () {
    return {
        tabsItems: [
            {
                name: "按交易量",
                func: ""
            },
            {
                name: "按交易次数",
                func: ""
            },
            {
                name: "按收款量",
                func: ""
            }
        ],
        tabPaneSelected: 0,
        DataList: [
            {
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 10000,
                assetType: "TNC"
            },
            {
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 9000,
                assetType: "TNC"
            },
            {
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 8000,
                assetType: "TNC"
            },
            {
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1700,
                assetType: "TNC"
            },
            {
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },{
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },{
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },{
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },{
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },{
                address: "0xDc1FF8Ee46f97F6089aa17553F1531f81C33fe7F",
                number: 1000,
                assetType: "TNC"
            },
        ]
    }
  },
  components: {
    
  },
  watch: {

  },
  filters:{
    formatAddress:function(val){
        var address = "";
        if(val){
            address = val.replace(/(.{8}).*(.{8})/,"$1......$2");
        }
        return address;
    },
  },
  methods: {
      selectPane(index){
          this.tabPaneSelected = index;                  //Nav选中之后设置store里的值为当前的index。
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rankingForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.headBox{
    background: RGBA(64, 64, 67, 0.97);
}
.banner{
    height: 100px;
    background: RGBA(64, 64, 67, 0.97);
    padding: 0 28px;
    color: #FFFFFF;
    position: relative;
}
.txtBox{
    
}
h1{
    font-size: 30px;
    margin: 0;
}
.txtBox p{
    font-size: 14px;
    line-height: 20px;
    margin: 5px 0;
}
.banner img{
    width: 100px;
    position: absolute;
    right: 30px;
    top: -25px;
}
.contentBox{
    height: calc(100% - 206px);
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
}
.tabs{
    display: flex;
}
.tab-pane{
    font-size: 13px;
    font-weight: normal;
    border: none;
    background: RGBA(56, 56, 59, 0.97);
    color: #FFFFFF;
    height: 50px;
    line-height: 50px;
    text-align: center;
    flex: 1;
    padding: 0 20px;
    display: inline-block;
    list-style: none;
}
.tab-pane.is-selected {
    font-size: 15px;
    font-weight: 600;
    position: relative;
}
.tab-pane .sanjiao{
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent #FFFFFF transparent;
    margin: 0 auto;
}
.cell-wrapper{
    height: 60px;
}
.indexBox{
    display: inline-block;
    vertical-align: middle;
}
.indexBox h2{
    margin: 0;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: -0.15em;
    color: #BBBBBB;
}
p{
    font-size: 13px;
    line-height: 20px;
}
.cell:first-child{
    border-top: none;
}
.cell:last-child{
    border-bottom: none;
    margin-bottom: 56px;
}
.rankingForm .icon {
   width: 30px;
   height: 30px;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
}
</style>
