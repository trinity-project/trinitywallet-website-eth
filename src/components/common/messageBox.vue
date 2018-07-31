<template>
    <div class="messageBox">
        <div class="content_text">
            <p>{{ msg }}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'messageBox',
  data () {
    return {
        msg:'coming soon'
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
.messageBox{
    position:relative;
    height: 560px;
    width: 400px;
    z-index:1;
    background-color: rgba(25, 25, 25, 0.7);
    position: absolute;
    top: 66px;
    right: 10px;
    border-radius: 5px;
    display: none;
}
.messageBox::before{
    content: " ";
    width: 0;
    height: 0;
    border-width: 0 7px 7px;
    border-style: solid;
    border-color: transparent transparent rgba(25, 25, 25, 0.7);
    position: absolute;
    top: -7px;
    right: 15px;
}
.content_text{
    color:#FFFFFF;
    position:absolute;
    padding: 15px 20px;
    box-sizing: border-box;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    margin:auto;
}
</style>
