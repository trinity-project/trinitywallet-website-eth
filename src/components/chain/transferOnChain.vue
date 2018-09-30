<template>
  <div class="transferOnChainForm">
    <div class="headBox">
      <div class="header-button is-left">
        <i @click="$router.go(-1)" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1>{{ assetType }}链上转账</h1>
      <div class="header-button is-right" style="text-align:right;">
        <i @click="$router.go(-1)" class="el-icon-ETH-saoyisao"></i>
      </div>
    </div>
    <div class="contentBox">
        <el-form :model="txOnChainInfo" status-icon :rules="txOnChainRules" ref="txOnChainInfo" class="demo-ruleForm">
            <el-select size="mini" v-model="contact" @change="contactChange" filterable clearable :placeholder="$t('index.transferByContact')" style="margin-bottom: 12px;">
                <el-option v-for="item in $store.state.vuexStore.contactList" :key="item.address" :label="item.name" :value="item.address">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px;overflow: hidden;margin-left: 20px;width: 175px;text-overflow:ellipsis;white-space: nowrap;">{{ item.address }}</span>
                </el-option>
            </el-select>
            <el-form-item prop="address">
                <el-input type="textarea" v-model="txOnChainInfo.address" :placeholder="$t('index.address')" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="amount">
                <el-input v-model.number.trim="txOnChainInfo.amount" :placeholder="$t('index.amount')" auto-complete="off"></el-input>
            </el-form-item>
            <span>矿工费:</span>
            <span style="float:right;">{{ txOnChainInfo.gasPrice }} Gwei ≈ {{ Gwei2ETH(txOnChainInfo.gasPrice) }} ETH</span>
            <el-form-item prop="gasPrice">
                <el-slider v-model="txOnChainInfo.gasPrice" :min='1' :max='100' :step='0.1'></el-slider>
            </el-form-item>
            <el-form-item prop="keyStorePass">
                <el-input v-model="txOnChainInfo.keyStorePass" type="password" :placeholder="$t('index.password')" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div style="text-align:center;">
            <el-button type="primary" @click="txOnChain()" class="transferBtn">{{ $t('index.transfer') }}</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'

Vue.use(VueQriously)

export default {
  name: 'transferOnChainForm',
  data () {
        var checkTxOnChainAddress = (rule, value, callback) => {    //验证链上转账地址
      if (!value) {
        return callback(new Error(this.$t('index.callback-1')));
      } else {
        if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
          if (value.length !== 42) {
              callback(new Error(this.$t('index.callback-2')));
          } else {
              callback();
          }
        } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
          if (value.length !== 34) {
              callback(new Error(this.$t('index.callback-2')));
          } else {
              callback();
          }
        }
      }
    };
    var checkTxOnChainAmount = (rule, value, callback) => {    //验证链上转账金额
        if (!value) {
          return callback(new Error(this.$t('index.callback-3')));
        }
        if (isNaN(value)) {
            callback(new Error(this.$t('index.callback-4')));
          } else {
            if (value < 0) {
              callback(new Error(this.$t('index.callback-5')));
            } else {
              callback();
            }
        }
    };
    var checkTxOnChainAssets = (rule, value, callback) => {    //验证链上转账资产类型
      if (!value) {
        return callback(new Error(this.$t('index.callback-6')));
      } else {
        callback();
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('index.callback-7')));
      } else {
        let PrivateKey;
        if(this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
          PrivateKey = this.$parent.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
        } else if (this.$store.state.vuexStore.baseChain == "NEO"){                  //当前为ETH钱包时
          PrivateKey = scrypt_module_factory(DecryptWalletByPassword, {}, {
              'WalletScript': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
              'password': value,
              'address': this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
          });
        }
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error(this.$t('index.callback-8')));
            }
        }, 1000);
      }
    };
    return {
        txOnChainInfo: {        //链上转账信息
          "address": '',
          "assetType": '',
          "amount": '',
          "gasPrice": 1,
          "keyStorePass": ''
        },
        contact: '',     //当前选中联系人,
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
    };
  },
  computed: {
    assetType() {
        return this.$store.state.vuexStore.activeAssetInfo.assetType;
    },
    balanceData() {
        return this.$store.state.vuexStore.balanceData;
    }
  },
  filters:{
    
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    contactChange() {       //当选中联系人时将值赋给payment code
      this.txOnChainInfo.address = this.contact;
    },
    Gwei2ETH(val) {         //Gwei转ETH
      let _this = this;
      let result;
      if(val){
        result = val.div(10e9);
        _this.$parent.$parent.keepDecimalPlaces(result, 7);
      } else {
        result = "error";
      }
      return result;
    },
    txOnChain() {     //链上转账方法 总
      let _this = this;
      _this.$refs['txOnChainInfo'].validate((valid) => {
        if (valid) {
          if(_this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
            if(_this.assetType == "ETH"){
              _this.txEthOnChain();
            } else {
              _this.txTncOnChain();
            }
          } else if(_this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为ETH钱包时
            _this.NEOtxOnChain();
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
                gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice),  
                to: _this.txOnChainInfo.address,
                from: _this.$store.state.vuexStore.walletInfo.address,
                value: web3.utils.toHex(_this.txOnChainInfo.amount.mul(10e17)),         
                data: ''
            }
            console.log(txData);

            let signedData = signData(txData,decryptPK.privateKey);
            console.log(signedData);

            let date = new Date().getTime();        //获取当前时间戳
            web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {     //发送交易上链
            if (!err) {       //当不错误的时候
                console.log(hash);
                _this.$notify({
                    title: _this.$t('common.success'),
                    dangerouslyUseHTMLString: true,
                    message: _this.$t('common.callback-14'),
                    duration: 3000,
                    type: 'success'
                });
                _this.ShowTxOnChainBox = false;

                let recordMessage = {       //构造交易记录信息
                date: date,
                name: _this.txOnChainInfo.address,
                Amount: _this.txOnChainInfo.amount.mul(10e7),
                assetType: 'ETH',
                isOnChannel: false,
                isPay: true,
                isSuccess: true,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : hash,
                blockHash: ""
                }
                _this.$store.state.vuexStore.recordList.push(recordMessage);
                _this.$parent.StoreData("recordList");         //保存交易信息
                _this.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
                _this.clearTxData();                                      //清空交易数据
            } else {
                console.log(err);
            }
            })
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
              gasPrice: web3.utils.toHex(_this.$store.state.vuexStore.gasPrice), 
              gasLimit: web3.utils.toHex(4500000),
              to: _this.$store.state.vuexStore.tncContractAddress,
              from: _this.$store.state.vuexStore.walletInfo.address, 
              value: '0x00', 
              data: '0x' + functionSig + web3.utils.padLeft(_this.txOnChainInfo.address.slice(2), 64) + web3.utils.padLeft(web3.utils.toHex(_this.txOnChainInfo.amount.mul(10e7)).substr(2), 64)
          };
          console.log(txData);

          let signedData = signData(txData,decryptPK.privateKey);
          console.log(signedData);

          let date = new Date().getTime();        //获取当前时间戳
          web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
            if (!err) {
              console.log(hash);
              _this.$notify({
                  title: _this.$t('common.success'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-14'),
                  duration: 3000,
                  type: 'success'
              });
              _this.ShowTxOnChainBox = false;
              
              let recordMessage = {
                date: date,
                name: _this.txOnChainInfo.address,
                Amount: _this.txOnChainInfo.amount * 10e7,
                assetType: 'TNC',
                isOnChannel: false,
                isPay: true,
                state: 0,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : hash,
                blockHash: ""
              }
              console.log(_this.txOnChainInfo.address);
              console.log(recordMessage);
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              _this.$parent.StoreData("recordList");         //保存交易记录
              _this.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
              _this.clearTxData();                                      //清空交易数据
            } else {
              _this.$notify({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-25') + err,
                  duration: 3000,
                  type: 'error'
              });
              _this.ShowTxOnChainBox = false;
              _this.clearTxData();                                      //清空交易数据
            }
          })
        })   
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.transferOnChainForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
    padding: 15px 20px;
    box-sizing: border-box;
    display: flex;
    color: #FFFFFF;
    padding: 0 20px;
}
.header-button{
    flex: .5;
    width: 100%;
    max-width: 70px;
    font-size: 26px;
    height: 56px;
    line-height: 56px;
}
h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 56px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
button{
    width: 80%;
}
/* 手机端改变某些字体大小 */
@media screen and (max-width: 450px) {
    .QRCodeBox p{
        font-size: 12px;
    }
}
</style>
