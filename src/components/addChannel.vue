<template>
  <div class="addChannelBox">
    <div class="contentBox">
        <div>
          <p v-if="addChannelForm.assetType" style="float:right;margin: 5px 0;">资产余额：{{ $store.state.vuexStore.balanceData.Chain[addChannelForm.assetType] }}{{ addChannelForm.assetType }}</p>
          <h2>添加通道</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="addChannelForm" status-icon :rules="addChannelRules" ref="addChannelForm" label-width="100px" class="addChannelForm">
          <el-form-item label="对端URI" prop="uri">
            <el-input v-model="addChannelForm.uri" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetType">
            <el-select v-model="addChannelForm.assetType" placeholder="请选择资产类型" style="width:100%;">
              <el-option label="TNC" value="TNC"></el-option>
              <el-option label="ETH" value="ETH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="本端押金" prop="selfDeposit">
            <el-input v-model.number="addChannelForm.selfDeposit"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="对端押金" prop="otherDeposit">
            <el-slider v-model="addChannelForm.otherDeposit" :show-input-controls="false" :max="addChannelForm.selfDeposit" show-input ></el-slider>
          </el-form-item>
          <el-form-item label="通道名称" prop="alice">
            <el-input v-model="addChannelForm.alice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="keyStorePass">
            <el-input v-model="addChannelForm.keyStorePass" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addChannel()">添加通道</el-button>
            <el-button @click="removeAddChannelData()">返回</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addChannelForm',
  data () {
    var checkUri = (rule, value, callback) => {  
      let _this = this;
      if (!value) {
        return callback(new Error('对端URI不能为空'));
      } else {
          if (value.indexOf('@') < -1) {
            callback(new Error('URI格式不正确'));
          } else if(value.split('@')[0].length !== 42){
            callback(new Error('URI格式不正确'));
          } else {
              _this.$store.state.vuexStore.channelList.forEach(function(val,index){    //判断是否已有通道
                if(val.otherUri === _this.addChannelForm.uri){
                  callback(new Error('你已经和这个TNAP有一个通道了'));
                }
              });
            callback();
          }
        }
    };
    var checkAssetType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择资产类型'));
      } else {
        callback();
      }
    };
    var checkSelfDeposit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('本端押金数量不能为空'));
      } else {
        if (value <= 0) {
          callback(new Error('本端押金数量必须大于0'));
        } else {
          if(value > this.$store.state.vuexStore.balanceData.Chain[this.addChannelForm.assetType]){
            callback(new Error('押金数量不能大于钱包余额'));
          } else{
            callback();
          }
        }
      }
    };
    var checkOtherDeposit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('对端押金数量不能为空'));
      } else {
        if (value <= 0) {
          callback(new Error('对端押金数量必须大于0'));
        } else {
            callback();
          }
      }
    };
    var checkAlice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('通道名称不能为空'));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        callback();
      }
    };
    return {
      addChannelForm: {
        uri: '',
        assetType: '',
        selfDeposit: 0,
        otherDeposit: 0,
        alice: '',
        channelName: '',
        selfSignedData: '',
        keyStorePass: ''
      },
      addChannelRules: {
        uri: [
          { validator: checkUri, trigger: 'blur' }
        ],
        assetType: [
          { validator: checkAssetType, trigger: 'change' }
        ],
        selfDeposit: [
          { validator: checkSelfDeposit, trigger: 'blur' }
        ],
        otherDeposit: [
          { validator: checkOtherDeposit, trigger: 'blur' }
        ],
        alice: [
          { validator: checkAlice, trigger: 'blur' }
        ],
        keyStorePass: [
          { validator: checkKeyStorePass, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // formatTooltip(val) {      //用于自定义滑块显示内容
    //     let multiple;
    //     if(this.addChannelForm.selfdeposit === ''){
    //       multiple = 1;
    //     } else {
    //       multiple = this.addChannelForm.selfDeposit;
    //     }
    //     return parseInt(val * multiple)/100;
    // },
    addChannel() {
      let _this = this;
      _this.$refs['addChannelForm'].validate((valid) => {
        if (valid) {
          let Ip = this.uri2Ip(_this.addChannelForm.uri,8766);
          const wsuri = "ws://" + Ip + "/";               //建立websocket连接
          var l = _this.$store.state.vuexStore.channelList.length;      //获取channelList长度
          console.log(l);
          let SelfUri = _this.$store.state.vuexStore.walletInfo.address + "@" + Ip;     //得到本端URI
          let OtherAddress = _this.addChannelForm.uri.split('@')[0];      //截取对端URI得到对端地址
          let date = new Date().getTime();        //获取当前时间戳
          let ChannelNamePart1 = md5encode(_this.addChannelForm.uri, date);  
          let ChannelNamePart2 = md5encode(SelfUri, date);
          _this.addChannelForm.channelName = "0x" + ChannelNamePart1 + ChannelNamePart2;       //生成ChannelName
          console.log(_this.addChannelForm.channelName);
          var channelInfo = { 
            "channelName": _this.addChannelForm.channelName,
            "websock":new WebSocket(wsuri)
          }
          console.log(channelInfo);
          _this.$store.state.vuexStore.channelList.push(channelInfo);
          _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.$parent.websocketOnmessage;
          _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.$parent.websocketClose;

          let txData = web3.utils.soliditySha3({t: 'bytes32', v: _this.addChannelForm.channelName},{t: 'uint256', v: 0},{t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},{t: 'uint256', v: _this.addChannelForm.selfDeposit * 10e8},{t: 'address', v: OtherAddress},{t: 'uint256', v: _this.addChannelForm.otherDeposit * 10e8});
          console.log(txData);
          let selfSignedData = web3.eth.accounts.sign(txData, '0x015693f1ebc0d1ff42cd150de5d81bfee7eba4dc18cdd381329d10a3364f9643');
          console.log(selfSignedData);
          _this.addChannelForm.selfSignedData = selfSignedData.signature;

          var Message = {       //创建通道消息体
            "MessageType": "Founder",
            "Sender": SelfUri,
            "Receiver": _this.addChannelForm.uri,
            "TxNonce": 0,
            "ChannelName": _this.addChannelForm.channelName,
            "NetMagic": _this.$store.state.vuexStore.NetMagic,
            "MessageBody": {
                "FounderDeposit": parseInt(_this.addChannelForm.selfDeposit * 10e8) / 10e8,
                "PartnerDeposit": parseInt(_this.addChannelForm.otherDeposit * 10e8) / 10e8,
                "Commitment": _this.addChannelForm.selfSignedData,
                "AssetType" : _this.addChannelForm.assetType
            }
          }
          setTimeout(function (){
              _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送消息
          }, 2000);
          
          _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //
          console.log(_this.$store.state.vuexStore.addChannelInfo);

          _this.$store.state.vuexStore.channelList[l].ChannelName = _this.addChannelForm.channelName;
          _this.$store.state.vuexStore.channelList[l].Alice = _this.addChannelForm.alice;
          _this.$store.state.vuexStore.channelList[l].State = 2;
          _this.$store.state.vuexStore.channelList[l].isConnect = true;
          _this.$store.state.vuexStore.channelList[l].SelfBalance = _this.addChannelForm.selfDeposit;      //本端余额
          _this.$store.state.vuexStore.channelList[l].OtherBalance = _this.addChannelForm.otherDeposit;     //对端余额
          _this.$store.state.vuexStore.channelList[l].assetType = _this.addChannelForm.assetType;     //资产类型
          // _this.$store.state.vuexStore.channelList[l].BalanceInfo = {};
          // _this.$store.state.vuexStore.channelList[l].BalanceInfo[SelfUri] = {};
          // _this.$store.state.vuexStore.channelList[l].BalanceInfo[_this.addChannelForm.uri] = {};
          // _this.$store.state.vuexStore.channelList[l].BalanceInfo[SelfUri][_this.addChannelForm.assetType] = _this.addChannelForm.selfDeposit; 
          // _this.$store.state.vuexStore.channelList[l].BalanceInfo[_this.addChannelForm.uri][_this.addChannelForm.assetType] = _this.addChannelForm.otherDeposit;
          _this.$store.state.vuexStore.channelList[l].isTestNet = true;
          _this.$store.state.vuexStore.channelList[l].SelfUri = SelfUri;
          _this.$store.state.vuexStore.channelList[l].OtherUri = _this.addChannelForm.uri;
          _this.$store.state.vuexStore.channelList[l].date = date;
          _this.$store.state.vuexStore.channelList[l].Ip = _this.uri2Ip(_this.addChannelForm.uri,null);

          _this.StoreChannel();
          _this.$router.push('/channelList');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    WebsocketClose(val){  		//websocket关闭
      console.log("已断开websocket");
      // console.log(val);
      let Ip = val.currentTarget.url.split('/')[2].split(':')[0];
      console.log(Ip);
      let ChannelName;
      //2console.log("------------");
      //console.log(this.ChannelItems);
      var _this = this;
      _this.ChannelItems.forEach(function(data,index){
        console.log(data.Ip);
        if(data.Ip === Ip){
          ChannelName = data.ChannelName;
          console.log("断开时oldFlag:" + data.oldFlag);
          let c = data.Flag
          // data.oldFlag = ;
          _this.$set(data,'oldFlag',c);
          console.log("断开时oldFlag:" + data.oldFlag);
          _this.$set(data,'Flag',5);
        }
        return;
      });
    },
    uri2Ip(uri,port) {      //URI转化Ip
      let ip = uri.split("@")[1];
      if(port == null){
        ip = ip.split(":")[0];
      } else {
        ip = ip.split(":")[0]+":" + port;
      }
      return ip;
    },
    getChannelSerial(type,value) {      //获取所需的channel在List的位置
        let _this = this;
        let i;
        _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
         if(data[type] === value){
              i = index;
              return;
          }
       })
       return i;
    },
    StoreChannel() {
      this.$parent.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@channelList",this.$store.state.vuexStore.channelList);
    },
    CreateFounder() {

    },
    removeAddChannelData() {      //清除AddChannelData
      this.$refs['addChannelForm'].resetFields();
      this.$router.push('/channelList');
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addChannelBox{
    float: left;
    height: calc(100vh - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100vh - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
.contentBox .addChannelForm{
    width:100%;
    max-width: 420px;
}
h2{
    margin: 0;
}
.fullPage{
    width: 100% !important;
}
</style>
