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
            <el-slider v-model="addChannelForm.otherDeposit" :show-input-controls="false" :max="addChannelForm.selfDeposit" :step="0.00000001" show-input ></el-slider>
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
    var checkUri = (rule, value, callback) => {         //add Channel Uri输入规则
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
    var checkAssetType = (rule, value, callback) => {     //add Channel assetType输入规则
      if (value === '') {
        callback(new Error('请选择资产类型'));
      } else {
        callback();
      }
    };
    var checkSelfDeposit = (rule, value, callback) => {         //add Channel 本端Deposit输入规则
      if (value === '') {
        callback(new Error('本端押金数量不能为空'));
      } else {
        if (value <= 0) {
          callback(new Error('本端押金数量必须大于0'));
        } else {
          if(value > this.$store.state.vuexStore.balanceData.Chain[this.addChannelForm.assetType]){
            callback(new Error('押金数量不能大于钱包余额'));
          } else {
            if(String(value).indexOf(".") > -1){              //判断是否为小数,若为小数,则限制小数长度为8位
              let length = String(value).indexOf(".") + 1;//获取小数点的位置
              var num = String(value).length - length;//获取小数点后的个数
              if(num > 8){
                  callback(new Error('本端押金小数最多为8位'));
              } else {
                  callback();
              }
            } else {      //若不为小数则通过
              callback();
            }
          }
        }
      }
    };
    var checkOtherDeposit = (rule, value, callback) => {          //add Channel 对端Deposit输入规则
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
    var checkAlice = (rule, value, callback) => {         //add Channel Alice输入规则
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
        let PrivateKey = this.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore, value);
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error('钱包解锁失败 - 可能是密码错误'));
            }
        }, 2000);
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
      addChannelRules: {        //add Channnel输入规则
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
          _this.$parent.showLoading();

          web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
            console.log(gasPrice);
          var myContract = new web3.eth.Contract(_this.$store.state.vuexStore.tncContractAbi, _this.$store.state.vuexStore.tncContractAddress, {
              from: _this.$store.state.vuexStore.walletInfo.address,          //发起地址
              gasPrice: gasPrice * 10        //Gas价格
          });
          let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.addChannelForm.keyStorePass);
          web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
            // 获取交易次数
              console.log(nonce);

              // approve押金金额
              let functionSig = web3.eth.abi.encodeFunctionSignature('approve(address,uint256)');     //获取functionSig
              console.log(functionSig);

              let data = web3.eth.abi.encodeParameters(['address','uint256'], [ _this.$store.state.vuexStore.trinityContractAddress, _this.addChannelForm.selfDeposit * 10e7]);        //abi加密参数
              console.log(data);

              var txData = {        //组成txData数据
                  nonce: web3.utils.toHex(nonce++),
                  gasPrice: web3.utils.toHex(gasPrice * 10), 
                  gasLimit: web3.utils.toHex(4500000),
                  to: _this.$store.state.vuexStore.tncContractAddress,
                  from: _this.$store.state.vuexStore.walletInfo.address, 
                  value: '0x00', 
                  data: functionSig + data.substr(2)
              };
              console.log(txData);

              let signedData = signData(txData,decryptPK.privateKey);     //签名
              console.log(signedData);

              web3.eth.sendSignedTransaction('0x' + signedData)         //上链
              .on('transactionHash', function(hash){      //收到hash时
                  console.log(hash);
              })
              .on('receipt', function(receipt){           //块确认后
                console.log(receipt);
                let Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri,8766);       //截取对端Uri的Ip
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
                  "websock":new WebSocket(wsuri)
                }
                console.log(channelInfo);
                _this.$store.state.vuexStore.channelList.push(channelInfo);
                _this.$store.state.vuexStore.channelList[l].websock.onmessage = _this.$parent.websocketOnmessage;
                _this.$store.state.vuexStore.channelList[l].websock.onclose = _this.$parent.websocketClose;

                let txData = web3.utils.soliditySha3(         //生成代签名交易数据
                  {t: 'bytes32', v: _this.addChannelForm.channelName},    //通道名称
                  {t: 'uint256', v: 0},                                   //TXnonce
                  {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},       //本端地址
                  {t: 'uint256', v: _this.addChannelForm.selfDeposit * 10e7},       //本端押金
                  {t: 'address', v: OtherAddress},                                  //对端地址
                  {t: 'uint256', v: _this.addChannelForm.otherDeposit * 10e7}       //对端押金
                );
                console.log(txData);

                let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.addChannelForm.keyStorePass);        //解锁钱包用于签名          
                let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
                console.log(selfSignedData); 
                _this.addChannelForm.selfSignedData = selfSignedData;
                // return false;

                var Message = {         //创建通道消息体
                  "MessageType": "Founder",
                  "Sender": SelfUri,
                  "Receiver": _this.addChannelForm.uri,
                  "TxNonce": 0,
                  "ChannelName": _this.addChannelForm.channelName,
                  "NetMagic": _this.$store.state.vuexStore.NetMagic,
                  "MessageBody": {
                      "FounderDeposit": parseInt(_this.addChannelForm.selfDeposit * 10e7) / 10e7,
                      "PartnerDeposit": parseInt(_this.addChannelForm.otherDeposit * 10e7) / 10e7,
                      "Commitment": _this.addChannelForm.selfSignedData,
                      "AssetType" : _this.addChannelForm.assetType
                  }
                }
                setTimeout(function (){
                    _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送websocket消息
                }, 2000);
                
                _this.$store.state.vuexStore.addChannelInfo = _this.addChannelForm;     //保存信息,用于后续信息来回传输
                console.log(_this.$store.state.vuexStore.addChannelInfo);

                _this.$store.state.vuexStore.channelList[l].ChannelName = _this.addChannelForm.channelName;     //通道名字
                _this.$store.state.vuexStore.channelList[l].Alice = _this.addChannelForm.alice;       //通道昵称
                _this.$store.state.vuexStore.channelList[l].State = 2;            //通道初始状态
                _this.$store.state.vuexStore.channelList[l].isConnect = true;         //是否连接上websocket
                _this.$store.state.vuexStore.channelList[l].SelfBalance = _this.addChannelForm.selfDeposit * 10e7;      //本端余额
                _this.$store.state.vuexStore.channelList[l].OtherBalance = _this.addChannelForm.otherDeposit * 10e7;     //对端余额
                _this.$store.state.vuexStore.channelList[l].assetType = _this.addChannelForm.assetType;     //资产类型
                _this.$store.state.vuexStore.channelList[l].isTestNet = true;             //是否为测试网
                _this.$store.state.vuexStore.channelList[l].SelfUri = SelfUri;            //本端Uri
                _this.$store.state.vuexStore.channelList[l].OtherUri = _this.addChannelForm.uri;        //对端Uri
                _this.$store.state.vuexStore.channelList[l].TxNonce = 0;                  //交易次数
                _this.$store.state.vuexStore.channelList[l].date = date;                  //时间戳
                _this.$store.state.vuexStore.channelList[l].Ip = _this.$parent.uri2Ip(_this.addChannelForm.uri,null);       //IP

                _this.$parent.StoreChannel();         //储存通道信息
                _this.$router.push('/channelList');       //跳转到channelList页面
                _this.$parent.closeLoading();
              })
              .on('confirmation', function(confirmationNumber, receipt){
                // console.log(confirmationNumber);
              })
              .on('error', console.error);
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100% - 106px);
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
