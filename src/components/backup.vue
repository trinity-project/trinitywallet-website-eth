<template>
  <div class="backupForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>{{$t('backup.title')}}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-button @click="backup()" style="margin:10px 0;" type="primary" icon="el-icon-edit" plain>{{$t('backup.backupBtn')}}</el-button>
        <div class="tipBox tipBox-red">
            <h3>{{$t('backup.tips')}}</h3>
            <p>点击“备份当前钱包”按钮后，浏览器会生成一个钱包备份文件，当您清空浏览器数据库、或者更换浏览器、重装系统后，可以使用钱包备份文件恢复当前钱包。请将该文件保存到安全的地方，并牢记钱包密码，钱包文件丢失或钱包密码遗忘可能会导致您的资产丢失。</p>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'backupForm',
  data () {
    return {

    }
  },
  methods: {
      backup() {            //备份事件,生成json文件
          console.log(this.$store.state.vuexStore.walletInfo.keyStore);
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
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.backupForm{
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
    /* border-bottom: 1px solid #CCCCCC; */
}
.fullPage{
    width: 100% !important;
}
</style>
