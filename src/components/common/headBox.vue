<template>
    <div class="headBox">
      <i @click="$store.state.vuexStore.isNavShow = !$store.state.vuexStore.isNavShow" class="listIcon el-icon-ETH-liebiao"></i>
      <el-badge :value="3" :max="99" class="item" style="float: right;display:none;font-size: 12px;">
        <i @click="$store.state.vuexStore.isMessageBoxShow = !$store.state.vuexStore.isMessageBoxShow" class="notificationIcon el-icon-ETH-xiaoxi"></i>
      </el-badge>
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
    float: left;
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    padding: 15px 20px;
    box-sizing: border-box;
}
.listIcon{
    font-size: 26px;
    color: #FFFFFF;
    float: left;
    cursor: pointer;
}
.notificationIcon{
    font-size: 26px;
    color: #FFFFFF;
    cursor: pointer;
}
</style>
