<template>
    <transition name="el-fade-in-linear">
        <div v-if="$store.state.vuexStore.isMessageBoxShow" @click="$store.state.vuexStore.isMessageBoxShow = false" style="width:100%;height:100%;position: absolute;">
            <div class="messageBox">
                <div class="content_text">
                    <a @click.stop="clearAll()" class="clearAllBtn">清除全部</a>
                    <h1>消息</h1>
                    <hr style="color:#606266;">
                    <div class="ulBox">
                        <ul>
                            <li>欢迎点击消息中心</li>
                            <li>目前该功能还未投入使用</li>
                            <li>敬请期待</li>
                        </ul>  
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'messageBox',
  data () {
    return {
        msg:'coming soon'
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods:{
      clearAll() {
        console.log("清除全部");
        this.$store.state.vuexStore.channelList = [];
        this.$parent.StoreChannel();
        return false;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.messageBox{
    position:relative;
    height: 560px;
    width: 95%;
    max-width: 400px;
    z-index: 3;
    background-color: rgba(25, 25, 25, 0.88);
    position: absolute;
    top: 66px;
    right: 10px;
    border-radius: 5px;
}
.messageBox::before{
    content: " ";
    width: 0;
    height: 0;
    border-width: 0 7px 7px;
    border-style: solid;
    border-color: transparent transparent rgba(25, 25, 25, 0.7);
    position: absolute;
    top: -7px;
    right: 15px;
}
.content_text{
    color:#FFFFFF;
    position:absolute;
    padding: 20px;
    box-sizing: border-box;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    margin:auto;
}
.clearAllBtn{
    float: right;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    border-radius: 50px;
    background: rgba(25, 25, 25, 0.3);
    cursor: pointer;
    border: 1px solid rgba(25, 25, 25, 0.3);
}
.clearAllBtn:hover{
    background: rgba(25, 25, 25, 0.6);
    border: 1px solid #606266;
}
h1{
    font-size: 22px;
    margin: 0 0 20px 0;
}
ul li{
    height: 60px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
}
.ulBox{
    overflow-x:hidden;
    height: calc(100% - 65px);
}
.ulBox::-webkit-scrollbar {           /* 隐藏滚动条 */
    display: none;
}
</style>
