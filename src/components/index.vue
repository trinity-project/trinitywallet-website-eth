<template>
  <div class="indexBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="assetBox">
      <h1>{{ $store.state.vuexStore.balanceData.Chain.TNC }} TNC</h1>
      <el-collapse-transition>
        <div v-show="isShowMoreAsset">
          <table class="assetTable">
            <thead>
              <tr>
                <th>资产类型</th>
                <th>链上金额</th>
                <th>通道金额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TNC</td>
                <td>{{ $store.state.vuexStore.balanceData.Chain.TNC }}</td>
                <td>{{ $store.state.vuexStore.balanceData.Channel.TNC }}</td>
              </tr>
              <tr>
                <td>ETH</td>
                <td>{{ $store.state.vuexStore.balanceData.Chain.ETH }}</td>
                <td>{{ $store.state.vuexStore.balanceData.Channel.ETH }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-collapse-transition>
      <el-button @click="showMoreAsset()" :class="{ showMoreAssetBtn_active :isShowMoreAsset}" class="showMoreAssetBtn" type="primary" icon="el-icon-arrow-down" circle></el-button>
    </div>
    <div class="contentBox">
        <h2>转账</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form class="indexForm" ref="form">
          <label>支付码/地址</label>
            <el-select size="mini" v-model="contact" @change="contactChange" filterable clearable placeholder="从联系人里转账" style="float: right;margin-bottom: 12px;">
              <el-option v-for="item in $store.state.vuexStore.contactList" :key="item.address" :label="item.name" :value="item.address">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;overflow: hidden;margin-left: 20px;width: 175px;text-overflow:ellipsis;white-space: nowrap;">{{ item.address }}</span>
              </el-option>
            </el-select>
          <el-form-item style="margin-top:10px">
            <el-input type="textarea" v-model="paymentCode"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button class="transferBtn" type="primary" @click="decryptPaymentCode">转账</el-button>
          </el-form-item>
        </el-form>
    </div>
    <el-dialog class="txOnChainBox" title="链上转账" :visible.sync="ShowTxOnChainBox" width="30%" center :modal-append-to-body='false'>
      <el-form :model="txOnChainInfo" status-icon :rules="txOnChainRules" ref="txOnChainInfo" label-width="70px" class="demo-ruleForm">
        <el-form-item label="地址" prop="address">
          <el-input v-model="txOnChainInfo.address" readonly="readonly" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产类型" prop="assetType">
          <el-select v-model="txOnChainInfo.assetType" placeholder="请选择资产类型" style="width:100%;">
            <el-option label="TNC" value="TNC"></el-option>
            <el-option label="ETH" value="ETH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model.number="txOnChainInfo.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="keyStorePass">
          <el-input v-model="txOnChainInfo.keyStorePass" type="password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="txOnChain()">转账</el-button>
        <el-button @click="ShowTxOnChainBox = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'indexForm',
  data () {
    var checkTxOnChainAddress = (rule, value, callback) => {    //验证链上转账地址
      if (!value) {
        return callback(new Error('地址不能为空'));
      } else {
        if (value.length !== 42) {
            callback(new Error('请输入正确的地址'));
        } else {
            callback();
        }
      }
    };
    var checkTxOnChainAmount = (rule, value, callback) => {    //验证链上转账金额
        if (!value) {
          return callback(new Error('金额不能为空'));
        }
        if (isNaN(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('金额必须大于0'));
            } else {
              callback();
            }
        }
    };
    var checkTxOnChainAssets = (rule, value, callback) => {    //验证链上转账资产类型
      if (!value) {
        return callback(new Error('资产类型不能为空'));
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
        isShowMoreAsset: false,     //是否显示更多资产
        paymentCode: '',        //PaymentCode
        txOnChainInfo: {        //链上转账信息
          "address": '',
          "assetType": '',
          "amount": '',
          "keyStorePass": ''
        },
        txOnChainRules: {       //链上转账规则
          address: [
            { validator: checkTxOnChainAddress, trigger: 'blur' }
          ],
          amount: [
            { validator: checkTxOnChainAmount, trigger: 'blur' }
          ],
          assetType: [
            { validator: checkTxOnChainAssets, trigger: 'change' }
          ],
          keyStorePass: [
            { validator: checkKeyStorePass, trigger: 'blur' }
          ]
        },
        txOnChannelInfo: {      //通道转账
          "sendUrl": '',
          "receiverUrl": '',
          "hr": '',
          "assetType": '',
          "value": 0,
          "fee": 0,
          "description": ''
        },
        ShowTxOnChainBox: false,    //是否显示链上转账窗口
        contact: ''     //当前选中联系人
    }
  },
  mounted() {
    this.$nextTick(function(){
      // this.getEthBalance();
      // this.getTncBalance();
      if(this.$route.params.address){         //检测路由是否带参数，用于联系人页面直接转账
        this.paymentCode = this.$route.params.address;
      }
    })
  },
  watch: {

  },
  methods: {  
    showMoreAsset() {   //切换显示资产详情
      this.isShowMoreAsset = !this.isShowMoreAsset;
    },
    decryptPaymentCode() {    //解析Payment Code
      let _this = this;
      if (_this.paymentCode.length == "") {       //判断paymentCode是否为空
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '付款码/地址不能为空',
            duration: 3000
          });
          return;
      } else if (_this.paymentCode.length === 42) {       //判断paymentCode是否为地址
        if (_this.paymentCode === _this.$store.state.vuexStore.walletInfo.address){   //判断是否为本端地址
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '收付款地址不能相同',
            duration: 3000
          });
          return;
        } else {
          _this.txOnChainInfo.address = _this.paymentCode;
          _this.ShowTxOnChainBox = true;
          return;
        }
      } else {
        if(_this.paymentCode.substr(0,2) == "TN"){
          console.log("进入通道交易");
        } else {
          _this.$notify.error({
            title: '警告',
            dangerouslyUseHTMLString: true,
            message: '付款码错误，请确认',
            duration: 3000
          });
          return;
        }
      }
    },
    contactChange() {       //当选中联系人时将值赋给payment code
      this.paymentCode = this.contact;
    },
    txOnChain() {     //链上转账方法 总
      let _this = this;
      _this.$refs['txOnChainInfo'].validate((valid) => {
        if (valid) {
          if(_this.txOnChainInfo.assetType == "ETH"){
            _this.txEthOnChain();
          } else {
            _this.txTncOnChain();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    txEthOnChain() {    //链上ETH转账方法
      let _this = this;
      let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.txOnChainInfo.keyStorePass);
      web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
          // 获取交易次数
          console.log(nonce);

          web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
              console.log(gasPrice);

              var txData = {
                  // nonce每次++，以免覆盖之前pending中的交易
                  nonce: web3.utils.toHex(nonce++),
                  gasLimit: web3.utils.toHex(4500000),   
                  gasPrice: web3.utils.toHex(gasPrice),  
                  to: _this.txOnChainInfo.address,
                  from: _this.$store.state.vuexStore.walletInfo.address,
                  value: web3.utils.toHex(_this.txOnChainInfo.amount * 10e17),         
                  data: ''
              }
              console.log(txData);

              let signedData = signData(txData,decryptPK.privateKey);
              console.log(signedData);

              web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
                  if (!err) {
                      console.log(hash);
                      _this.$notify({
                          title: '成功',
                          dangerouslyUseHTMLString: true,
                          message: '上链成功，请交易确认',
                          duration: 3000,
                          type: 'success'
                      });
                      _this.ShowTxOnChainBox = false;
                      _this.clearTxData();
                      _this.$parent.cycleGetTransactionReceipt(hash);
                  } else {
                      _console.log(err)
                  }
              });
          })   
      })
    },
    txTncOnChain() {    //链上TNC转账方法
      let _this = this;
      let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.txOnChainInfo.keyStorePass);
      web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
        // 获取交易次数
          console.log(nonce);

          web3.eth.getGasPrice().then(function(gasPrice){   // 获取GAS价格
          console.log(gasPrice);

          var functionSig = web3.utils.sha3("transfer(address,uint256)").substr(2, 8);
          console.log(functionSig);

          var txData = {
              nonce: web3.utils.toHex(nonce++),
              gasPrice: web3.utils.toHex(gasPrice), 
              gasLimit: web3.utils.toHex(4500000),
              to: "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218",
              from: _this.$store.state.vuexStore.walletInfo.address, 
              value: '0x00', 
              data: '0x' + functionSig + web3.utils.padLeft(_this.txOnChainInfo.address.slice(2), 64) + web3.utils.padLeft(web3.utils.toHex(_this.txOnChainInfo.amount * 10e7).substr(2), 64)
          };
          console.log(txData);

          let signedData = signData(txData,decryptPK.privateKey);
          console.log(signedData);

          web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
              if (!err) {
                  console.log(hash);
                  _this.$notify({
                      title: '成功',
                      dangerouslyUseHTMLString: true,
                      message: '上链成功，请交易确认',
                      duration: 3000,
                      type: 'success'
                  });
                  _this.ShowTxOnChainBox = false;
                  _this.clearTxData();
                  _this.$parent.cycleGetTransactionReceipt(hash);
              } else {
                  _console.log(err)
              }
          });
        })   
      })
    },
    clearTxData() {       //清空链上转账信息
      this.txOnChainInfo = {
        "address": '',
        "assetType": '',
        "amount": '',
        "keyStorePass": ''
      };
      this.paymentCode = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexBox{
  float: left;
  height: calc(100vh - 106px);
  width: 100%;
  overflow: hidden;
}
.assetBox{
  /* height: 290px; */
  width: 100%;
  background-color: rgb(67, 74, 80);
  position: relative;
}
.assetBox h1{
  text-align: center;
  line-height: 240px;
  margin: 0;
  color: #FFFFFF;
}
.assetBox .showMoreAssetBtn{
  position: absolute;
  bottom: -20px;
  left: 50%;
  margin-left: -20px;
  z-index: 2;
  transition: 0.3s;
}
.assetBox .showMoreAssetBtn_active{
  transform: rotate(180deg);
}
.assetBox .assetTable{
  width: 100%;
  background-color:transparent;
  /* height: 192px; */
  color: #CCCCCC;
  padding-bottom: 20px;
}
.assetTable th {
  border-bottom: 1px solid #ebeef5;
  user-select: none;
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.assetTable td {
  border-bottom: 1px solid #ebeef5;
  user-select: none;
  padding: 12px 0;
  min-width: 0;
  text-align: center;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.assetTable tr:last-child td{
  border-bottom: 0px;
}
.contentBox{
  height: calc(100vh - 340px);
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  transition: 1s;
}
h2{
  margin: 0;
}
.indexForm{
  padding: 12px 0;
}
.transferBtn{
  width: 100%;
  max-width: 300px;
}
.fullPage{
    width: 100% !important;
}
</style>
