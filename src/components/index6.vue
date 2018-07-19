<template>
  <div class="indexForm">
    <div class="headBox"></div>
    <div class="contentBox">
        <h5 @click="createPrivateKey()">创建私钥</h5>
        <h5>私钥为：{{ privateKey }}</h5>
        <h5 @click="privateKey2PublicKey()">私钥转公钥</h5>
        <h5>公钥为：{{ publicKey }}</h5>
        <h5 @click="publicKey2Address()">公钥转地址</h5>
        <h5>地址为：{{ address }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'indexForm',
  data () {
    return {
      privateKey: '',
      publicKey:'',
      address:''
    }
  },
  methods: {
    createPrivateKey(){
      this.privateKey = createPrivateKey().toString('hex');
    },
    privateKey2PublicKey(){
      let _this = this;
      _this.publicKey = privateKey2PublicKey(_this.privateKey).toString('hex');
    },
    publicKey2Address(){
      let _this = this;
      _this.address = publicKey2Address(_this.publicKey).toString('hex');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
    font-weight: normal;
}
.indexForm{
    float: left;
    height: calc(100vh - 50px);
    width: calc(100% - 300px);
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(70, 78, 86);
}
.contentBox{
    height: calc(100vh - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
</style>
