<template>
  <div class="recordForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2 @click="testfun()">交易记录</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul v-if="formatRecordList(recordList).length">
            <li @click="showRecordInfo(data,index)" v-for="(data,index) in formatRecordList(recordList)" :key="index">
                <h3>{{ data.name | formatAddress }} - {{ data.isOnChannel | formatIsOnChannel}}</h3><br>
                <p>{{ data.date | formatDateTime }}</p>
                <p>State：{{ data.state | formatState }}</p>
                <span>{{ data.isPay | formatIsPay }}{{ data.Amount / 10e7 }}<sup>{{ data.assetType }}</sup></span>
            </li>
        </ul>
        <p v-if="!formatRecordList(recordList).length" style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
            还没有交易，立即去转账
        </p>
    </div>
    <el-dialog class="recordInfoBox" title="通道信息" :visible.sync="isRecordInfoBoxShow" width="30%" center :modal-append-to-body='false'>
        <span>对端地址：{{ activeInfo.name }}</span>
        <span>交易时间：{{ activeInfo.date | formatDateTime }}</span>
        <span>交易金额：{{ activeInfo.Amount / 10e7 }}{{ activeInfo.assetType }}</span>
        <span>交易方式：{{ activeInfo.isOnChannel | formatIsOnChannel}}</span>
        <span>交易结果：{{ activeInfo.state | formatState}}</span>
        <span>transactionHash: {{ activeInfo.transactionHash}}</span>
        <span>blockHash: {{ activeInfo.blockHash }}</span>
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
        // tableData: [{
        //   date: '1495157126',
        //   name: '王小虎',
        //   Amount: '87',
        //   assetType: 'TNC',
        //   isOnChannel: true,
        //   isPay: true,
        //   isSuccess: true,
        //   transactionHash : "",
        //   blockHash: ""
        // }, {
        //   date: '1495157126',
        //   name: '王小虎',
        //   Amount: '87',
        //   assetType: 'TNC',
        //   isOnChannel: true,
        //   isPay: true,
        //   isSuccess: false,
        //   transactionHash : ""
        // }, {
        //   date: '1495157126',
        //   name: '王小虎',
        //   Amount: '127',
        //   assetType: 'ETH',
        //   isOnChannel: false,
        //   isPay: false,
        //   isSuccess:true,
        //   transactionHash : ""
        // }, {
        //   date: '1495157126',
        //   name: '王小虎',
        //   Amount: '87',
        //   assetType: 'TNC',
        //   isOnChannel: true,
        //   isPay: true,
        //   isSuccess:true,
        //   transactionHash : ""
        // }],
        isRecordInfoBoxShow: false,         //显示交易记录详情
        activeInfo:{                        //当前显示的交易记录信息
          date: '',
          name: '',
          Amount: '',
          assetType: '',
          isOnChannel: true,
          isPay: true,
          isSuccess:true,
          transactionHash : ""
        },
    }
  },
  filters:{
    formatAddress:function(val){
        var address;
        address = val.replace(/(.{5}).*(.{5})/,"$1......$2");
        return address;
    },
    formatIsOnChannel:function(val){            //格式化支付方式
        var state;
        if(val){
            state = "通道";
        } else {
            state = "链上";
        }
        return state;
    },
    formatState:function(val){            //格式化支付状态
        let x;
        switch (val)
        {
        case -1:
            x="Fail";
            break;
        case 0:
            x="Pending";
            break;
        case 1:
            x="Success";
            break;
        }
        return x;
    },
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
        // date.setTime(val * 1000);
        var yy = date.getFullYear();    
        var mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        var dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    }
  },
  computed:{
      recordList() {
          return this.$store.state.vuexStore.recordList;
      }
  },
  methods: {
    showRecordInfo(data) {              //显示交易记录详情
        this.isRecordInfoBoxShow = true;
        this.activeInfo = data;
        console.log(data);
    },
    formatRecordList(val) {
      let data = [];
      if(this.$store.state.vuexStore.isTestNet){
        val.forEach(function(val1,index){
          if(val1.isTestNet){
            data.push(val1);
          }
        });
      } else {
        val.forEach(function(val1,index){
          if(val1.isTestNet === false){
            data.push(val1);
          }
        });
      }
      var min;
      for(var i = 0; i < data.length; i++){
          for(var j = i; j < data.length;j++){
              if(data[i].date < data[j].date){              //按时间戳由大到小排序
                min = data[j];
                data[j] = data[i];
                data[i] = min;
              }
          }
      }
      return data;
    },
    testfun() {
        let PaymentCode = "0xDd1C2C608047Bd98962Abf15f9f074620f9d44bf@106.15.91.150:8089&48c3075df5730554ea78c5529efe279cda2a236b&0x65096f2B7A8dc1592479F1911cd2B98dae4d2218&1&PaymentCode";
        console.log(PaymentCode);
        let Paymentlink = "TN" + base58encode(PaymentCode);
        console.log(Paymentlink);

        let Message = {
            'messageType': 'test',
            "walletAddress": this.$store.state.vuexStore.walletInfo.address,
            'comments': ''
        }
        this.$store.state.vuexStore.NodeUriWebSocket.send(JSON.stringify(Message));
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
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    overflow-x: hidden;
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
    word-wrap: break-word;
    word-break: break-all;
}
.errorState{
    color: #F56C6C;
}
.successState{
    color: #67C23A;
}
</style>
