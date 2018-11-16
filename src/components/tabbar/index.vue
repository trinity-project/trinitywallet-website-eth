<template>
  <div class="indexBox">
    <div class="headBox">
      <div class="header-button is-left">
        <p @click="isChangeWalletBoxShow = true;">ETH/NEO</p>
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
        <router-link to="/scan">
          <i click="$router.push('/scan')" class="notificationIcon el-icon-ETH-saoyisao"></i>
        </router-link>
      </div>
    </div>
    <div class="assetBox">
      <div class="amountBox">
        <h3>TNC</h3>
        <h1>{{ balanceData.Chain.TNC }}</h1>
      </div>
      <div class="addressBox">
        <el-row :gutter="20">
          <el-col :span="8" style="border-right: 1px solid #8A9199;">
            {{ baseChain }}
          </el-col>
          <el-col :span="16">
            <router-link to="/chain/receive">
              <i class="el-icon-ETH-erweima"></i>
              {{ walletInfo.address | formatAddress }}
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content1Box">
      <ul class="listUl">
        <li @click="toAssetForm(item.name)" v-if="item.baseChain == baseChain || item.baseChain == 'all'" v-for="(item,index) in assetList" :key="index">
          <div class="assetIcon">
            <img :style="{ marginLeft : item.iconStyle}" src="./../../assets/img/assetIcon.png" alt="">
          </div>
          <span>{{ item.name }}</span>
          <span>{{ balanceData.Chain[item.name] }}</span>
        </li>
      </ul>
    </div>
    <el-dialog title="切换钱包" :visible.sync="isChangeWalletBoxShow" width="calc(100% - 20px)" center>
      <span> 是否切换钱包 </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeWallet()()">{{ $t('common.continue') }}</el-button>
        <el-button @click="isChangeWalletBoxShow = false">{{ $t('common.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'indexForm',
  data () {
    return {
        assetList: [
          {
            name: "TNC",
            iconStyle: "-53px",
            baseChain: "all",
          },
          {
            name: "ETH",
            iconStyle: "-25px",
            baseChain: "ETH",
          },
          {
            name: "NEO",
            iconStyle: "3px",
            baseChain: "NEO",
          },
          {
            name: "GAS",
            iconStyle: "3px",
            baseChain: "NEO",
          }
        ],
        isChangeWalletBoxShow: false,
    }
  },
  computed: {
    walletInfo() {                       //获取vuex中的address赋值给address
      if(this.$store.state.vuexStore.baseChain == "ETH"){
          return this.$store.state.vuexStore.walletInfo;
      } else if(this.$store.state.vuexStore.baseChain == "NEO"){
          return this.$store.state.vuexStore.NEOwalletInfo;
      }
    },
    balanceData() {
        return this.$store.state.vuexStore.balanceData;
    },
    baseChain() {                               //当前显示当前底层主链
        return this.$store.state.vuexStore.baseChain;
    },
  },
  filters:{
    formatAddress:function(val){
        var address;
        address = val.replace(/(.{10}).*(.{10})/,"$1......$2");
        return address;
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  watch: {

  },
  methods: {
    toAssetForm(assetType) {           //跳转到资产页面
      this.$router.push('/chain/asset');
      this.$store.state.vuexStore.activeAssetInfo.assetType = assetType;
    },
    changeWallet() {
      console.log(1);
      this.$store.state.vuexStore.baseChain == "ETH" ? this.$store.state.vuexStore.baseChain = "NEO" : this.$store.state.vuexStore.baseChain = "ETH";
      console.log(this.$store.state.vuexStore.baseChain);
      if(this.$store.state.vuexStore.isLogin && this.address != ""){

      } else {
        this.$router.push('/start');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexBox{
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #FFFFFF;
}
/* p{
  font-size: 10px;
} */
.assetBox{
  height: 30vh;
  width: 100%;
  background-color: RGBA(56, 56, 59, 0.97);
  position: relative;
}
.amountBox{
  position: absolute;
  bottom: 16px;
  right: 30px;
  color: #FFFFFF;
}
.addressBox{
  color: #8A9199;
  padding: 8px 0;
  text-align: center;
  line-height: 20px;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}
.addressBox a{
  color:#8A9199;
  font-size: 12px;
}
.addressBox i{
  font-size: 14px;
}
.assetBox h1{
  font-size: 50px;
  text-align: center;
  font-weight: 300;
  margin: 20px 0;
}
.assetBox h3{
  font-size: 36px;
  text-align: right;
  font-weight: 400;
  margin: -17px 0;
  color: #FFFFFF;
}
.content1Box{
  height: calc(70vh - 44px);
  width: 100%;
  box-sizing: border-box;
  transition: 1s;
  overflow-x: hidden;
}
.content1Box li {
  height: 90px;
  padding: 0 20px;
  border-bottom: 2px dotted #EBEEF5;
}
.content1Box li:hover {
  background-color: #E5E5E5;
}
.content1Box li .assetIcon{
  height: 90px;
  width: 28px;
  overflow: hidden;
  float: left;
}
.assetIcon img{
  height: 28px;
  margin: 31px 0;
}
.content1Box li span{
  line-height: 90px;
  font-size: 20px;
  margin-left: 10px; 
  float: left;
}
.content1Box li span:nth-child(3){
  float: right;
  font-size: 24px;
}
h2{
  margin: 0;
  font-size: 24px;
}
.indexForm{
  padding: 12px 0;
}
.transferBtn{
  width: 100%;
  max-width: 300px;
}
.txOnChannelBox .el-dialog__body span{
  display: block;
  margin: 10px 0;
  word-wrap: break-word;
  word-break: break-all;
}
.header-button a{
  color: #FFFFFF;
}
</style>
