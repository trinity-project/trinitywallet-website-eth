<template>
  <div>
    <!-- <div v-if="$route.path == '/wallet' || $route.path == '/channel/payment'" class="headBox">
      <div class="header-button is-left">
        <i @click.stop="$store.state.vuexStore.isNavShow = !$store.state.vuexStore.isNavShow" class="listIcon el-icon-ETH-liebiao"></i>
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
        <i class="notificationIcon el-icon-ETH-saoyisao"></i>
      </div>
    </div> -->
    <div v-if="$route.path == '/message' || $route.path == '/discover' || $route.path == '/start'" class="headBox">
      <div class="header-button is-left">
        
      </div>
      <h1> </h1>
      <div class="header-button is-right" style="text-align:right;">
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headBox',
  data () {
    return {

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
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    padding: 15px 20px;
    box-sizing: border-box;
    display: flex;
    color: #FFFFFF;
    padding: 0 20px;
}
.header-button{
    flex: .5;
    width: 100%;
    max-width: 70px;
    font-size: 26px;
    height: 56px;
    line-height: 56px;
}
h1{
    font-size: 0.8em;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 56px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.listIcon{
    font-size: 26px;
    cursor: pointer;
}
.notificationIcon{
    font-size: 24px;
    cursor: pointer;
}
.el-badge__content.is-fixed {
    right: 4px;
}
</style>
