<template>
  <transition name="fade">
    <div @click="$store.state.vuexStore.isChannelFormShow = false" v-show="$store.state.vuexStore.isChannelFormShow" class="channelForm">
      <div style="position: absolute;bottom:0;left:0;right:0;padding: 40px 40px 20px 40px;">
          <div class="buttonBox" style="text-align:center;">
            <transition :name="item.actionName" v-for="(item,index) in buttonItem" :key="index">
              <div @click="toOtherForm(item.link)" v-show = "$store.state.vuexStore.isChannelFormShow" class="button-item">
                <div class="button-item-img">
                  <img :style="{ marginLeft: item.iconStyle }" src="./../../assets/img/channelIcon.png" alt="">
                </div>
                <p class="button-item-label">{{ item.name }}</p>
              </div>
            </transition>
          </div>
        <div class="closeBox">
          <span @click="$store.state.vuexStore.isChannelFormShow = false">
            <i class="el-icon-ETH-guanbi"></i>
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'channelForm',
  data () {
    return {
      buttonItem:[
        {
          name: this.$t('tabbar.channel.addChannel'),
          iconStyle: "-60px",
          link: "/channel/addChannel",
          actionName: "slide-fade1"
        },
        {
          name: this.$t('tabbar.channel.channelList'),
          iconStyle: "-180px",
          link: "/channel/channelList",
          actionName: "slide-fade2"
        },
        {
          name: this.$t('tabbar.channel.payment'),
          iconStyle: "0px",
          link: "/channel/payment",
          actionName: "slide-fade3"
        },
        {
          name: this.$t('tabbar.channel.scan'),
          iconStyle: "-120px",
          link: "/scan",
          actionName: "slide-fade4"
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(function(){
      
    })
  },
  methods:{
    toOtherForm(router) {                   //跳转页面时判断是否正在关闭channel页面,为防止关闭时的误触情况
      if(this.$store.state.vuexStore.isChannelFormShow == true){
        this.$router.push(router);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelForm{
  /* height: 100%;
  width: 100%; */
  background: rgb(255, 255, 255, 0.95);
  padding: 15px;
  box-sizing: border-box;
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.buttonBox{
  display: flex;
}
.button-item{
  width: 60px;
  text-align: center;
  flex: 1;
}
.button-item-img{
  height: 60px;
  width: 60px;
  margin: 0 auto;
  overflow: hidden;
}
.button-item-img img{
  height: 60px;
  margin-left: 0;
}
.button-item-label{
  margin-bottom: 0;
  color:#000000;
}
.closeBox{
  margin: 30% 0 0;
  text-align: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-fade1-enter-active {
  transition: all .4s ease 0s;
}
.slide-fade1-leave-active {
  transition: all .4s ease 0s;
}
.slide-fade2-enter-active {
  transition: all .4s ease .1s;
}
.slide-fade2-leave-active {
  transition: all .4s ease .1s;
}
.slide-fade3-enter-active {
  transition: all .4s ease .2s;
}
.slide-fade3-leave-active {
  transition: all .4s ease .2s;
}
.slide-fade4-enter-active {
  transition: all .4s ease .3s;
}
.slide-fade4-leave-active {
  transition: all .4s ease .3s;
}
.slide-fade1-enter, .slide-fade1-leave-to, .slide-fade2-enter, .slide-fade2-leave-to, .slide-fade3-enter, .slide-fade3-leave-to, .slide-fade4-enter, .slide-fade4-leave-to {
  transform: translateY(180px);
  opacity: 0;
}
</style>
