<template>
  <div class="aboutForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>关于我们</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div style="text-align:center;">
            <img src="./../assets/img/Trinity.png" alt="Trinity">
            <p>Version: V{{ $store.state.vuexStore.version }}</p>
        </div>
        <div>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'aboutForm',
  data () {
    return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }, {
          date: '2016-05-04',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }, {
          date: '2016-05-01',
          name: '王小虎',
          Amount: '127',
          assetType: 'TNC',
          isPay: false
        }, {
          date: '2016-05-03',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }],
        currentRow: null
    }
  },
  filters:{
      formatIsPay:function(val){
        var symbol;
        if(val){
            symbol = "-";
        } else {
            symbol = "+";
        }
        return symbol;
    }
  },
  methods: {
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutForm{
    float: left;
    height: calc(100vh - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100vh - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h2{
    margin: 0;
}
img{
    width: 130px;
}
</style>
