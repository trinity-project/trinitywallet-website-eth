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
        <p style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
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
.descoverForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.contentBox{
    height: calc(100% - 56px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}

h2{
    margin: 0;
    font-size: 24px;
}
</style>
