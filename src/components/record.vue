<template>
  <div class="recordForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>交易记录</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul>
            <li @click="showRecordInfo(data)" v-for="(data,index) in tableData" :key="index">
                <h3>{{ data.name }}</h3><br>
                <p>{{ data.date | formatDateTime }}</p>
                <p>State：Success</p>
                <span>{{ data.isPay | formatIsPay }}{{ data.Amount }}<sup>{{ data.assetType }}</sup></span>
            </li>
        </ul>
    </div>
    <el-dialog class="recordInfoBox" title="通道信息" :visible.sync="isRecordInfoBoxShow" width="30%" center :modal-append-to-body='false'>
        <span>对端地址：{{ activeInfo.name }}</span>
        <span>交易时间：{{ activeInfo.date | formatDateTime }}</span>
        <span>交易金额：{{ activeInfo.Amount }}{{ activeInfo.assetType }}</span>
        <span>transactionHash:</span>
        <span>blockHash:</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isRecordInfoBoxShow = false;"> 关闭 </el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'recordForm',
  data () {
    return {
        tableData: [{
          date: '1495157126',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }, {
          date: '1495157126',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }, {
          date: '1495157126',
          name: '王小虎',
          Amount: '127',
          assetType: 'ETH',
          isPay: false
        }, {
          date: '1495157126',
          name: '王小虎',
          Amount: '87',
          assetType: 'TNC',
          isPay: true
        }],
        isRecordInfoBoxShow: false,         //显示交易记录详情
        activeInfo:{                    //当前显示的交易记录信息
          date: '',
          name: '',
          Amount: '',
          assetType: '',
          isPay: true
        },
    }
  },
  filters:{
      formatIsPay:function(val){            //是否为支付
        var symbol;
        if(val){
            symbol = "-";
        } else {
            symbol = "+";
        }
        return symbol;
    },
    formatDateTime:function(val) {              //格式化时间戳
        var date = new Date();
        date.setTime(val * 1000);
        var yy = date.getFullYear();    
        var mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        var dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    }
  },
  methods: {
    showRecordInfo(data) {              //显示交易记录详情
        this.isRecordInfoBoxShow = true;
        this.activeInfo = data;
        console.log(data);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recordForm{
    float: left;
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100% - 106px);
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
    cursor: pointer;
}
ul li:hover{
    background: #f5f7fa;
}
ul li p{
    display: inline-block;
    margin: 0;
    width: 20%;
    min-width: 100px;
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
.recordInfoBox{
    min-width: 420px;
}
.recordInfoBox span{
    display: block;
    margin: 10px 0;
}
</style>
