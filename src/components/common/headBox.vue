<template>
    <div class="headBox"></div>
</template>

<script>
export default {
  name: 'footerBox',
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
    width: calc(100% - 300px);
    background-color: rgb(67, 74, 80);
}
</style>
