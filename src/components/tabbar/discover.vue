<template>
  <div class="descoverForm">
    <div class="headBox">
      <div class="header-button is-left">
        
      </div>
      <h1>发现</h1>
      <div class="header-button is-right" style="text-align:right;">
        
      </div>
    </div>
    <div class="contentBox">
      <ul v-if="descoverList.length" class="listUl">
          <li @click="descoverLink(item.link)" :style="item.style" v-for="(item,index) in descoverList" :key="index">
              <h2 class="title">{{ item.title }}</h2>
              <div class="bottomBox">
                  <img :src="item.imgLink" alt="image">
              </div>
          </li>
      </ul>
      <p v-else style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
          一键资产转换等功能正在加入中...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'descoverForm',
  data () {
    return {
      descoverList:[
        {
            title: "排行榜",
            link: "/discover/ranking",
            imgLink: require('./../../assets/img/discover/ranking/ranking.png'),
            style: {
              background: "#CCCCCC"
            }
        },
      ],
    }
  },
  filters:{

  },
  methods: {
    descoverLink(router) {
      this.$router.push(router);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.descoverForm{
    float: left;
    height: 100%;
    width: 100%;
    background: #F2F2F2;
    overflow: hidden;
}
.contentBox{
    height: calc(100% - 44px);
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
}
h2{
    margin: 0;
    font-size: 18px;
    line-height: 40px;
}
li{
  width: 46%;
  height: 80px;
  border-radius: 10px;
  float: left;
  margin: 0 2% 10px;
  padding: 20px 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
li img{
  width: 66px;
  position: absolute;
  right: 0px;
  top: 35%;
}
</style>
