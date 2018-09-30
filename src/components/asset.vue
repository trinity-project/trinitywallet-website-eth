<template>
  <div class="assetForm">
    <div class="headBox">
      <div class="header-button is-left">
        <i @click="$router.go(-1)" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1>{{ assetType }}</h1>
      <div class="header-button is-right"></div>
    </div>
    <div class="assetBox">
        <div class="amountBox">
            <h3>{{ balanceData.Chain[assetType] }}</h3>
        </div>
        <div class="buttonBox">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button @click="toOtherForm('receive1')" class="transferBtn" type="primary" >收 款</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button @click="toOtherForm('transfer')" class="receiveBtn" type="success" >{{ $t('index.transfer') }}</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
    <div class="contentBox">
        <h2>交易记录</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'assetForm',
  data () {
    return {

    }
  },
  computed: {
    assetType() {
        return this.$store.state.vuexStore.activeAssetInfo.assetType;
    },
    balanceData() {
        return this.$store.state.vuexStore.balanceData;
    }
  },
  filters:{

  },
  mounted() {
    this.$nextTick(function(){ 
        // console.log(1);
    })
  },
  methods: {
      toOtherForm (router){
          this.$router.push('/chain/' + router);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.assetForm{
    float: left;
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    padding: 15px 20px;
    box-sizing: border-box;
    display: flex;
    color: #FFFFFF;
    padding: 0 20px;
}
.header-button{
    flex: .5;
    width: 100%;
    max-width: 70px;
    font-size: 26px;
    height: 56px;
    line-height: 56px;
}
h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 56px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.contentBox{
    height: calc(100% - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h3 {
    font-size: 2.2rem;
    text-align: center;
    margin: 0;
    line-height: 130px;
    font-weight: 400;
}
h2{
    margin: 0;
    font-size: 24px;
}
h4{
    font-size: 16px;
}
img{
    width: 130px;
}
p{
    font-size: 16px;
    line-height: 20px;
}
.assetBox{
    height: 200px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    color: #FFFFFF;
    padding: 0 20px;
    box-sizing: border-box;
}
.amountBox{
    width: 100%; 
    height: 130px; 
}
.amountBox span{
    display:inline-block; 
    font-size:0.1em; 
    vertical-align:middle;
}
/* h1{
    font-size: 1.4rem;
    text-align: center;
    margin: 0;
    line-height: 130px;
    font-weight: 400;
} */
.buttonBox{
    height: calc(100% - 130px);
    width: 100%;
}
.buttonBox .el-button{
    width: 100%;
}
</style>
