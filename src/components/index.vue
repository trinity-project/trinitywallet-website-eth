<template>
  <div class="indexBox">
    <div class="headBox">
      <h1>0 TNC</h1>
      <el-collapse-transition>
        <div v-show="isShowMoreAsset">
          <el-table class="assetTable"  :data="tableData">
            <el-table-column prop="assetType" label="资产类型">
            </el-table-column>
            <el-table-column prop="valve" label="数量">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
      <el-button @click="showMoreAsset()" :class="{ showMoreAssetBtn_active :isShowMoreAsset}" class="showMoreAssetBtn" type="primary" icon="el-icon-arrow-down" circle></el-button>
    </div>
    <div class="contentBox">
        <h2>转账</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form class="indexForm" ref="form">
          <label>支付码/地址</label>
          <el-form-item style="margin-top:10px">
            <el-input type="textarea" v-model="desc"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button class="transferBtn" type="primary" @click="onSubmit">转账</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'indexForm',
  data () {
    return {
        isShowMoreAsset:false,
        desc: '',
        tableData: [{
            assetType: 'TNC',
            valve: 100
          }, {
            assetType: 'ETH',
            valve: 100
          }, {
            assetType: 'RATING',
            valve: 100
        }]
    }
  },
  methods: {
    showMoreAsset() {
      this.isShowMoreAsset = !this.isShowMoreAsset;
    },
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexBox{
  float: left;
  height: calc(100vh - 50px);
  width: calc(100% - 300px);
  overflow: hidden;
}
.headBox{
  /* height: 290px; */
  width: 100%;
  background-color: rgb(67, 74, 80);
  position: relative;
}
.headBox h1{
  text-align: center;
  line-height: 290px;
  margin: 0;
  color: #FFFFFF;
}
.headBox .showMoreAssetBtn{
  position: absolute;
  bottom: -20px;
  left: 50%;
  margin-left: -20px;
  z-index: 2;
  transition: 0.3s;
}
.headBox .showMoreAssetBtn_active{
  transform: rotate(180deg);
}
.headBox .assetTable{
  width: 100%;
  background-color:transparent;
  height: 192px;
}
.contentBox{
  height: calc(100vh - 340px);
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  transition: 1s;
}
h2{
  margin: 0;
}
.indexForm{
  padding: 12px 0;
}
.transferBtn{
  width: 100%;
  max-width: 300px;
}
</style>
