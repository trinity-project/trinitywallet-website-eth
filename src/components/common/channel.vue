<template>
  <transition name="fade">
    <div @click="$store.state.vuexStore.isChannelFormShow = false;" v-show="$store.state.vuexStore.isChannelFormShow" class="channelForm">
      <div style="position: absolute;bottom:0;left:0;right:0;padding: 40px 40px 20px 40px;">
          <div class="buttonBox" style="text-align:center;">
            <!-- <div v-if="$store.state.vuexStore.isChannelFormShow" v-for="(item, index) in buttonItem" :key="index" class="button-item">
                <div>
                  <div class="button-item-img">
                    <img :style="{ marginLeft: item.iconStyle}" src="./../../assets/img/channelIcon.png" alt="">
                  </div>
                  <p class="button-item-label">{{ item.name }}</p>
                </div>
            </div> -->
            <transition name="slide-fade1">
              <router-link to="/addChannel" v-show = "$store.state.vuexStore.isChannelFormShow" class="button-item">
                  <div>
                    <div class="button-item-img">
                      <img style="margin-left: -60px"  src="./../../assets/img/channelIcon.png" alt="">
                    </div>
                    <p class="button-item-label">添加</p>
                  </div>
              </router-link>
            </transition>
            <transition name="slide-fade2">
              <router-link to="/channelList" v-show = "$store.state.vuexStore.isChannelFormShow" class="button-item">
                  <div>
                    <div class="button-item-img">
                      <img style="margin-left: -180px"  src="./../../assets/img/channelIcon.png" alt="">
                    </div>
                    <p class="button-item-label">列表</p>
                  </div>
              </router-link>
            </transition>
            <transition name="slide-fade3">
              <router-link to="/channel/payment" v-show = "$store.state.vuexStore.isChannelFormShow" class="button-item">
                  <div>
                    <div class="button-item-img">
                      <img style="margin-left: 0px"  src="./../../assets/img/channelIcon.png" alt="">
                    </div>
                    <p class="button-item-label">付款码</p>
                  </div>
              </router-link>
            </transition>
            <transition name="slide-fade4">
              <router-link to="/scan" v-show = "$store.state.vuexStore.isChannelFormShow" class="button-item">
                  <div>
                    <div class="button-item-img">
                      <img style="margin-left: -120px"  src="./../../assets/img/channelIcon.png" alt="">
                    </div>
                    <p class="button-item-label">扫一扫</p>
                  </div>
              </router-link>
            </transition>
          </div>
        <div class="closeBox">
          <span @click="$store.state.vuexStore.isChannelFormShow = false;">
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
          name: "添加",
          iconStyle: "-60px",
          link: ""
        },
        {
          name: "列表",
          iconStyle: "-180px",
          link: ""
        },
        {
          name: "支付码",
          iconStyle: "0px",
          link: ""
        },
        {
          name: "扫一扫",
          iconStyle: "-120px",
          link: ""
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(function(){
      
    })
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelForm{
  height: 100%;
  width: 100%;
  background: rgb(255, 255, 255, 0.95);
  padding: 15px;
  box-sizing: border-box;
  z-index: 5;
  position: relative;
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
