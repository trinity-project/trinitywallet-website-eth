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
        <h2>发现</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
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
