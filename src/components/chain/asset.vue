<template>
  <div class="assetForm">
    <div class="headBox">
      <div class="header-button is-left">
        <i @click="back()" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1>{{ assetType }}</h1>
      <div class="header-button is-right"></div>
    </div>
    <div style="position: relative;height:calc(100% - 44px)">
        <div class="assetBox">
            <div class="amountBox">
                <h3>{{ balanceData.Chain[assetType] }}</h3>
            </div>
            <div class="buttonBox clearfloat">
                <el-row :gutter="20">
                    <el-col v-for="(item,index) in buttonBoxData" :key="index" :span="12">
                        <a @click="toOtherForm(item.link)" class="button-item">
                            <i :class="item.icon"></i>
                            <p>{{ item.name }}</p>
                        </a>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="contentBox">
            <h2 class="title_h2" style="margin: 0 30px;">{{ $t('record.title') }}</h2>
            <hr style="margin-bottom: 0;" />
            <div v-if="formatRecordList(recordData).length" style="overflow-x: hidden;height: calc(100% - 50px);">
                <ul class="listUl">
                    <li @click="showRecordInfo(data,index)" v-for="(data,index) in formatRecordList(recordData)" :key="index">
                        <h4>{{ data.isOnChannel | formatIsOnChannel }} - {{ data.name | formatAddress }}
                            <span style="float:right;">{{ data.isPay | formatIsPay }}{{ data.Amount / 10e7 }}{{ data.assetType }}</span>
                        </h4>
                        <p>{{ data.date | formatDateTime }}<span style="float: right;">State：{{ data.state | formatState }}</span></p>
                    </li>
                </ul>
            </div>
            <p v-else style="margin: 30% 0 0;text-align: center;">{{ $t('record.noRecord') }}</p>
        </div>
        <div v-if="isRecordInfoShow" class="assetInfo">
            <h2 class="title_h2">{{ $t('record.recordInfo') }}</h2>
            <hr style="margin:8px 0 0 0;" />
            <h1>{{ activeData.isPay | formatIsPay }}{{ activeData.Amount / 10e7 }}{{ activeData.assetType }}</h1>
            <p>{{ $t('record.state') }}: {{ activeData.state | formatState}}</p>
            <p>{{ $t('record.otherUri') }}: {{ activeData.name }}</p>
            <p>{{ $t('record.date') }}: {{ activeData.date | formatDateTime }}</p>
            <p>{{ $t('record.amount') }}: {{ activeData.Amount / 10e7 }}{{ activeData.assetType }}</p>
            <p>{{ $t('record.isOnChannel') }}: {{ activeData.isOnChannel | formatIsOnChannel}}</p>
            <p>{{ $t('record.transactionHash') }}: {{ activeData.transactionHash}}</p>
            <p>{{ $t('record.blockHash') }}: {{ activeData.blockHash }}</p>
            <div style="text-align:center;margin:15% 0;">
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
        buttonBoxData:[                                     //按钮组数据
            {
                name: this.$t('asset.receive'),
                icon: "el-icon-ETH-shoukuan",
                link: "receive",
            },
            {
                name: this.$t('asset.send'),
                icon: "el-icon-ETH-fukuan",
                link: "transfer",
            }
        ],
        isRecordInfoShow: false,                            //交易详情是否显示
        activeData: {                                       //当前显示的交易详情
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
    assetType() {                               //当前显示资产类型
        return this.$store.state.vuexStore.activeAssetInfo.assetType;
    },
    balanceData() {                             //当前显示资产余额信息
        return this.$store.state.vuexStore.balanceData;
    },
    recordData() {                              //当前显示资产交易记录
        return this.$store.state.vuexStore.recordList;
    },
  },
  filters:{
    formatAddress:function(val){
        var address = "";
        if(val){
            address = val.replace(/(.{5}).*(.{5})/,"$1......$2");
        }
        return address;
    },
    formatIsOnChannel:function(val){            //格式化支付方式
        var state;
        if(val){
            state = "Channel";
        } else {
            state = "Chain";
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
          this.$router.push('/chain/' + router);
      },
      formatRecordList (val){          //过滤交易记录为当前资产类型
        let _this = this;
        let result = [];
        console.log(val.length);
        if(val.length > 0){
            val.forEach(function(data,index){
                if(data.isOnChannel == false && data.assetType == _this.assetType){
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
    z-index: 2;
}
/* h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
} */
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
    line-height: 44px;
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
.contentBox p{
    font-size: 12px;
    line-height: 16px;
    margin: 10px 0 0;
}
.assetBox{
    height: 30vh;
    width: 100%;
    background-color: RGBA(56, 56, 59, 0.97);
    color: #FFFFFF;
    padding: 10px 20px;
    box-sizing: border-box;
}
.assetBox p{
    font-size: 13px;
}
.amountBox{
    width: 100%; 
    height: 54px; 
}
.amountBox span{
    display: inline-block; 
    font-size: 0.1em; 
    vertical-align: middle;
}
.buttonBox{
    height: calc(100% - 130px);
    width: 100%;
}
.buttonBox .el-button{
    width: 100%;
    color: #FFFFFF;
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
.assetInfo{
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
.assetInfo p{
    font-size: 14px;
    line-height: 16px;
    word-break: break-all;
}
</style>
