<template>
  <div class="scanForm">
      <headBox/>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'scanForm',
  data () {
    return {

    }
  },
  components: {
    headBox
  },
  computed: {

  },
  filters:{

  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  watch: {

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scanForm{
  float: left;
  height: calc(100% - 56px);
  width: 100%;
  overflow: hidden;
  background: #FFFFFF;
  z-index: 3;
}
</style>
