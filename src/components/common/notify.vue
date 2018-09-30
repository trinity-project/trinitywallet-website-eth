<template>
  <div class="notifyBox">
    <div class="notify-title">
        标题
    </div>
    <div class="notify-label">
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
    </div>
  </div>
</template>

<script>
export default {
  name: 'notifyBox',
  data () {
    return {

    }
  },
  filters:{

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notifyBox{
    width: 100%;
    height: 90px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    display: none;
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
.notify-label{
    height: 60px;
    padding: 10px 8px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 20px;
    background: RGBA(230,230,230,1);
    color: #333333;
}
</style>
