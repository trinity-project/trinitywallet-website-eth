<template>
  <div class="aboutForm">
    <headBox/>
    <div class="contentBox">
        <h2 @click="test()" class="title_h2">{{ $t('about.title') }}</h2>
        <hr/>
        <div style="text-align:center;">
            <img @click="clickNum += 1" src="./../../assets/img/Trinity.png" alt="Trinity">
            <h4>Trinity Wallet for ETH</h4>
            <p v-if="$store.state.vuexStore.isTestNet" style="color:red;">Test Network</p>
            <p>Version: V{{ $store.state.vuexStore.version }}</p>
        </div>
        <div>
            <p>{{ $t('about.content') }}</p>
            <p><b>{{ $t('about.tipsTitle') }}  </b>{{ $t('about.tips') }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'aboutForm',
  data () {
    return {
        clickNum: 0,
        testWebSocket: ""
    }
  },
  components: {
    headBox
  },
  watch: {
    clickNum(newValue, oldValue) { 
        if(newValue%5 == 0){            //每5次切换网络
            console.log('切换主网/测试网')
            this.switchNet();
        }
    }
  },
  filters:{

  },
  methods: {
      switchNet() {
          this.$store.state.vuexStore.isTestNet ? this.$store.state.vuexStore.isTestNet = false : this.$store.state.vuexStore.isTestNet = true;
      },
      test() {
        let _this = this;
        let wsuri = "ws://47.98.228.81:8866";               //建立websocket连接
        _this.testWebSocket = new WebSocket(wsuri);
        _this.testWebSocket.onmessage = _this.websocketOnMessage;
        _this.testWebSocket.onclose = _this.websocketClose;
        let Message = {
            AssetType: "TNC",
            MessageBody: {},
            MessageType: "GetNodeList",
            NetMagic: "527465737419990331",
            Sender: "0x4E801062608188F5d6815ddC3e98B766088784CE@47.98.228.81:8866"
        }
        setTimeout(function(){
            _this.testWebSocket.send(JSON.stringify(Message));        //向发送全节点发送初始化信息
        },1000);
      },
      websocketOnMessage(e) {
          console.log(e);
      },
      websocketClose() {
          console.log("关闭");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 4;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h4{
    font-size: 16px;
}
img{
    width: 88px;
}
p{
    font-size: 13px;
    line-height: 20px;
}
</style>
