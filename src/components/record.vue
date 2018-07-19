<template>
  <div class="recordForm">
    <div class="headBox"></div>
    <div class="contentBox">
        <h2>交易记录</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul>
            <li v-for="(data,index) in tableData" :key="index">
                <h3>{{ data.name }}</h3><br>
                <p>{{ data.date }}</p>
                <span>{{ data.Amount }}</span>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recordForm',
  data () {
    return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          Amount: '-87',
          isPay: true
        }, {
          date: '2016-05-04',
          name: '王小虎',
          Amount: '-87',
          isPay: true
        }, {
          date: '2016-05-01',
          name: '王小虎',
          Amount: '+127',
          isPay: true
        }, {
          date: '2016-05-03',
          name: '王小虎',
          Amount: '-87',
          isPay: true
        }],
        currentRow: null
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
.recordForm{
    float: left;
    height: calc(100vh - 50px);
    width: calc(100% - 300px);
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
h3{
    font-weight: normal;
    display: inline-block;
    margin: 0 0 10px 0;
}
ul li{
    border-bottom:1px solid #ebeef5;
    position: relative;
    padding: 12px;
}
ul li p{
    display: inline-block;
    margin: 0;
}
ul li span{
    position: absolute;
    font-size: 36px;
    right: 20px;
    top: 50%;
    margin-top: -20px;
}
</style>
