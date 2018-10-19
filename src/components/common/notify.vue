<template>
  <transition name="top-show"> 
    <div v-show="$store.state.vuexStore.isNotifyShow" @touchstart.capture="touchStart" @touchend.capture="touchEnd" class="notifyBox">
        <div class="notify-title">
            <img src="./../../../static/Trinity.png" alt="">
            <p style="display: inline-block;margin: 0;">标题</p>
        </div>
        <div class="notify-label">
            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
            <div style="text-align: center;">
                <i @click="$store.state.vuexStore.isNotifyShow = false;" class="closeBtn el-icon-ETH-shouqi1"></i>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'notifyBox',
  data () {
    return {
        startY : 0 ,                //触控监控,开始Y
        endY : 0 ,                  //触控监控,结束Y
    }
  },
  filters:{

  },
  methods: {
    touchStart(e) {            //监听滑动开始事件
      this.startY = e.touches[0].clientY;
      console.log("开始X:" + this.startY);
    },
    touchEnd(e) {              //监听滑动结束事件
      // 记录结束位置
        this.endY = e.changedTouches[0].clientY;
        console.log("结束X:" + this.endY);

        if(this.startY < 100 && this.startY - this.endY > 10 && this.$store.state.vuexStore.isNotifyShow){                 //左滑
          this.$store.state.vuexStore.isNotifyShow = false;
        }
        this.startY = 0;
        this.endY = 0;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notifyBox{
    width: 100%;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
}
.notify-title{
    height: 30px;
    padding: 6px 8px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 18px;
    background: RGBA(255,255,255,1);
    color: #999999;
}
.notify-title img{
    width: 18px;
    vertical-align: top;
}
.notify-label{
    height: 70px;
    padding: 10px 8px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
    background: RGBA(230,230,230,1);
    color: #333333;
}
.closeBtn{
    font-size: 18px;
    width: 100px;
    font-weight: 600;
    color: RGBA(195, 195, 195, 1.00);
}
.top-show-enter-active,
.top-show-leave-active {
  will-change: transform;
  transition: all 0.6s ease;
  position: absolute;
}
.top-show-enter-active {
  transform: translateY(-100%);
}
.top-show-enter-to {
  transform: translateX(0);
}
.top-show-leave-active {
  transform: translateX(0);
}
.top-show-leave-to{
  transform: translateY(-100%);
}
</style>
