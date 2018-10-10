<template>
  <div class="recordOnChainForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">交易详情</h2>
        <hr style="margin:8px 0 0 0;" />
        <h1>{{ Data.isPay | formatIsPay }}{{ Data.Amount / 10e7 }}{{ Data.assetType }}</h1>
        <p>{{ $t('record.state') }}: {{ Data.state | formatState}}</p>
        <p>{{ $t('record.otherUri') }}: {{ Data.name }}</p>
        <p>{{ $t('record.date') }}: {{ Data.date | formatDateTime }}</p>
        <p>{{ $t('record.amount') }}: {{ Data.Amount / 10e7 }}{{ Data.assetType }}</p>
        <p>{{ $t('record.isOnChannel') }}: {{ Data.isOnChannel | formatIsOnChannel}}</p>
        <p>{{ $t('record.transactionHash') }}: {{ Data.transactionHash}}</p>
        <p>{{ $t('record.blockHash') }}: {{ Data.blockHash }}</p>
        <div style="text-align:center;margin:15%;">
            <el-button @click="$router.go(-1)" style="width:80%;"> {{ $t('record.close') }} </el-button>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'recordOnChainForm',
  data () {
    return {

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
    Data() {                       //获取vuex中的channelList赋值给channelList
        if(this.$route.params.Data){
            console.log(this.$route.params.Data);
            return this.$route.params.Data;
        } else {
        let Data1 = {
            Amount: "",
            assetType: "",
            blockHash: "",
            date: "",
            isOnChannel: "",
            isPay: "",
            isTestNet: "",
            name: "",
            state: "",
            transactionHash: ""
        }
        return Data1;
        }
    }
  },
  components: {
    headBox
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recordOnChainForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    overflow-x: hidden;
}
.contentBox::-webkit-scrollbar {
    display: none;
}
h1{
    font-size: 26px;
    font-weight: 500;
    text-align: center;
}
p{
    font-size: 14px;
    line-height: 16px;
    word-break: break-all;
}
</style>
