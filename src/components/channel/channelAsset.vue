<template>
  <div class="assetForm">
    <div class="headBox">
      <div class="header-button is-left">
        <i @click="back()" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1>通道 - {{ Data.Alice }}</h1>
      <div class="header-button is-right"></div>
    </div>
    <div style="position: relative;height:calc(100% - 44px)">
        <div class="assetBox">
            <div class="amountBox">
                <h3>{{ Data.SelfBalance | formatBalance }}{{ Data.assetType }}</h3>
            </div>
            <div class="buttonBox">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <router-link to="/channel/createPayment" class="button-item">
                            <i class="el-icon-ETH-shoukuan"></i>
                            <p>收款</p>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <router-link to="/channel/payment" class="button-item">
                            <i class="el-icon-ETH-fukuan"></i>
                            <p>付款</p>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <a @click="showChannelInfo()" class="button-item">
                            <i class="el-icon-ETH-xiangqing"></i>
                            <p>详情</p>
                        </a>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="contentBox">
            <h2 class="title_h2" style="margin: 0 30px;">交易记录</h2>
            <hr style="margin-bottom: 0;" />
            <div v-if="formatRecordList(recordData).length" style="overflow-x: hidden;height: 100%;">
                <ul class="listUl">
                    <li @click="showRecordInfo(data,index)" v-for="(data,index) in formatRecordList(recordData)" :key="index">
                        <h4>{{ data.isOnChannel }} - {{ data.name | formatAddress }}
                            <span style="float:right;">{{ data.isPay | formatIsPay }}{{ data.Amount / 10e7 }}{{ data.assetType }}</span>
                        </h4>
                        <p>{{ data.date | formatDateTime }}<span style="float: right;">State：{{ data.state | formatState }}</span></p>
                    </li>
                </ul>
            </div>
            <p v-else style="margin: 30% 0 0;text-align: center;">没有交易记录</p>
        </div>
        <div v-if="isRecordInfoShow" class="channelAssetInfo">
            <h2 class="title_h2">交易详情</h2>
            <hr style="margin:8px 0 0 0;" />
            <h1>{{ activeData.isPay | formatIsPay }}{{ activeData.Amount / 10e7 }}{{ activeData.assetType }}</h1>
            <p>{{ $t('record.state') }}: {{ activeData.state | formatState}}</p>
            <p>{{ $t('record.otherUri') }}: {{ activeData.name }}</p>
            <p>{{ $t('record.date') }}: {{ activeData.date | formatDateTime }}</p>
            <p>{{ $t('record.amount') }}: {{ activeData.Amount / 10e7 }}{{ activeData.assetType }}</p>
            <p>{{ $t('record.isOnChannel') }}: {{ activeData.isOnChannel | formatIsOnChannel}}</p>
            <p>{{ $t('record.transactionHash') }}: {{ activeData.transactionHash}}</p>
            <p>{{ $t('record.blockHash') }}: {{ activeData.blockHash }}</p>
            <div style="text-align:center;margin:15%;">
                <el-button @click="isRecordInfoShow = false" style="width:80%;"> {{ $t('record.close') }} </el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'assetForm',
  data () {
    return {
        isRecordInfoShow: false,
        activeData: {
            Amount: "",
            assetType: "",
            blockHash: "",
            date: "",
            isOnChannel: "",
            isPay: "",
            isTestNet: "",
            name: "",
            state: "",
            transactionHash: "",
        }
    }
  },
  computed: {
    channelName() {                               //当前显示channelName
        return this.$store.state.vuexStore.activeAssetInfo.channelName;
    },
    Data() {                       //获取router传递的值
        let _this = this; 
        let Data1 = {};
        if(_this.$store.state.vuexStore.activeAssetInfo.channelName){
            _this.$store.state.vuexStore.channelList.forEach(function(data,index){
                if(data.ChannelName == _this.$store.state.vuexStore.activeAssetInfo.channelName){
                    Data1 = data;      
                }
            })
        } 
        // else {
        //     let Data1 = {
        //         Alice: "",
        //         ChannelName: "",
        //         Ip: "",
        //         OtherBalance: "",
        //         OtherUri: "",
        //         SelfBalance: "",
        //         SelfUri: "",
        //         State: "",
        //         TxNonce: "",
        //         assetType: "",
        //         date: "",
        //         isConnect: "",
        //         isTestNet: "",
        //         transactionHash: "",
        //         websock: ""
        //     }
        // }
        return Data1;
    },
    recordData() {                              //当前显示资产交易记录
        return this.$store.state.vuexStore.recordList;
    }
  },
  filters:{
    formatAddress:function(val){
        var address = "";
        if(val){
            address = val.replace(/(.{5}).*(.{5})/,"$1......$2");
        }
        return address;
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
        var date = new Date(val);
        var YY = date.getFullYear();    
        var MM = date.getMonth() + 1;    
        MM = MM < 10 ? ('0' + MM) : MM;    
        var DD = date.getDate();    
        DD = DD < 10 ? ('0' + DD) : DD;
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();   
        return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;    
    }
  },
  mounted() {
    this.$nextTick(function(){ 
        // console.log(1);
    })
  },
  methods: {
      toOtherForm (router){
          this.$router.push('/channel/' + router);
      },
      formatRecordList (val){          //过滤交易记录为当前资产类型
        let _this = this;
        let result = [];
        console.log(val);
        console.log(val.length);
        if(val.length > 0){
            val.forEach(function(data,index){
                if(data.isOnChannel == true && data.assetType == _this.Data.assetType){
                    result.push(data);
                }
            })
        }
        var min;
        for(var i = 0; i < result.length; i++){
            for(var j = i; j < result.length;j++){
                if(result[i].date < result[j].date){              //按时间戳由大到小排序
                    min = result[j];
                    result[j] = result[i];
                    result[i] = min;
                }
            }
        }
        console.log(result);
        return result;
      },
      showChannelInfo() {             //查看通道信息
        console.log(this.Data);
        this.$router.push({name:'channelInfo',params: { Data: this.Data }});
      },
      showRecordInfo(data){
          console.log(data);
          this.activeData = data;
          this.isRecordInfoShow = true;
      },
      back(){
          if(this.isRecordInfoShow){
            this.isRecordInfoShow = false;
          } else {
            this.$router.go(-1); 
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.assetForm{
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
}
h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.contentBox{
    height: calc(70vh - 44px);
    width: 100%;
    padding: 30px 0 0;
    box-sizing: border-box;
}
h3 {
    font-size: 28px;
    text-align: center;
    margin: 0;
    line-height: 60px;
    font-weight: 400;
}
h4{
    font-size: 15px;
    margin: 0;
    font-weight: 500;
}
img{
    width: 130px;
}
p{
    font-size: 13px;
    line-height: 20px;
    margin: 10px 0 0;
}
.assetBox{
    height: 30vh;
    width: 100%;
    background-color: RGBA(56, 56, 59, 0.97);
    color: #FFFFFF;
    padding: 20px;
    box-sizing: border-box;
}
.amountBox{
    width: 100%; 
    height: 60px; 
}
.amountBox span{
    display:inline-block; 
    font-size:0.1em; 
    vertical-align:middle;
}
.buttonBox a{
    color: #FFFFFF;
}
.el-icon-ETH-xiangqing{
    background: #00B481;
}
ul li {
    border-bottom: 1px solid #ebeef5;
    position: relative;
    padding: 12px 30px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}
ul li:hover{
    background: #E5E5E5;
}
.channelAssetInfo{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFFFFF;
    color: #000000;
    padding: 30px;
    box-sizing: border-box;
}
.channelAssetInfo p{
    font-size: 14px;
    line-height: 16px;
    word-break: break-all;
}
</style>
