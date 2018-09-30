<template>
  <div class="backupForm">
    <headBox/>
    <div class="contentBox">
        <h2>{{$t('backup.title')}}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-button @click="backup()" style="margin:10px 0;" type="primary" icon="el-icon-edit" plain>{{$t('backup.backupBtn')}}</el-button>
        <div class="tipBox tipBox-red">
            <h3>{{$t('backup.tips')}}</h3>
            <p>{{ $t('backup.tipsContent') }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'backupForm',
  data () {
    return {

    }
  },
  components: {
    headBox
  },
  methods: {
      backup() {            //备份事件,生成json文件
          if(this.$store.state.vuexStore.baseChain == "ETH"){
            if(this.$store.state.vuexStore.walletInfo.keyStore){
                var content = JSON.stringify(this.$store.state.vuexStore.walletInfo.keyStore);
                var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                saveAs(blob, this.$store.state.vuexStore.walletInfo.keyStore.id + ".json");//saveAs(blob,filename)
            } else {
                this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '备份失败，请确认正确导入钱包',
                    duration: 3000
                });
            }
          } else if(this.$store.state.vuexStore.baseChain == "NEO"){
            if(this.$store.state.vuexStore.NEOwalletInfo.keyStore){
                var content = JSON.stringify(this.$store.state.vuexStore.NEOwalletInfo.keyStore);
                var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                saveAs(blob, this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address + ".json");//saveAs(blob,filename)
            } else {
                this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '备份失败，请确认正确导入钱包',
                    duration: 3000
                });
            }
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.backupForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
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
}
h2{
    margin: 0;
    font-size: 24px;
}
.tipBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
}
.tipBox-red{
    background-color: #fef0f0;
    border-left: 5px solid #f56c6c;
}
.tipBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    color: #f56c6c;
    font-size: 18px;
    /* border-bottom: 1px solid #CCCCCC; */
}
.tipBox p{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
</style>
