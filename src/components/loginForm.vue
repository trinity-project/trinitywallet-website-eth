<template>
  <div class="loginForm">
    <div class="headBox"></div>
    <div class="contentBox">
        <h2>欢迎</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <div class="clooseLoginBox clooseLoginBox-blue">
            <h3>创建新钱包</h3>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
        </div>
        <div class="clooseLoginBox clooseLoginBox-green">
            <h3>从私钥导入</h3>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
        </div>
        <div class="clooseLoginBox clooseLoginBox-gray">
            <h3>创建新钱包</h3>
            <p>从场景上说，MessageBox 的作用是美化系统自带的，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。</p>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginForm',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginForm{
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
.clooseLoginBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
}
.clooseLoginBox-blue{
    background-color: #ecf8ff;
    border-left: 5px solid #50bfff;
}
.clooseLoginBox-green{
    background-color: #f0f9eb;
    border-left: 5px solid #67c23a;
}
.clooseLoginBox-gray{
    background-color: #f4f4f5;
    border-left: 5px solid #909399;
    cursor: not-allowed;
}
.clooseLoginBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    /* border-bottom: 1px solid #CCCCCC; */
}
.clooseLoginBox p{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
</style>
