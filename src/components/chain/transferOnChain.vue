<template>
  <div class="transferOnChainForm">
    <headBox/>
    <div class="contentBox">
      <h2 class="title_h2">{{ $t('transferOnChian.title1') }}{{ assetType }}{{ $t('transferOnChian.title2') }}</h2>
      <hr/>
      <div class="buttonBox clearfloat">
        <router-link to="/channel/createPayment" class="button-item">
          <i class="el-icon-ETH-lianxiren"></i>
          <p>{{ $t('setting.contact') }}</p>
        </router-link>
        <a class="button-item">
          <i class="el-icon-ETH-saoyisao"></i>
          <p>{{ $t('common.scan') }}</p>
        </a>
      </div>
      <el-form :model="txOnChainInfo" status-icon :rules="txOnChainRules" ref="txOnChainInfo" class="demo-ruleForm">
          <el-form-item prop="address">
              <el-input v-model="txOnChainInfo.address" :placeholder="$t('transferOnChian.address')" auto-complete="off"></el-input>
          </el-form-item>
          <label for="" style="font-size: 14px;line-height: 28px;">{{ $t('transferOnChian.amount') }}: </label>
          <span style="font-size: 14px;line-height: 28px;float:right;">{{ $t('transferOnChian.balance') }}: {{ balanceData.Chain[assetType] }}{{ assetType }}</span>
          <el-form-item prop="amount">
              <el-input v-model.number.trim="txOnChainInfo.amount" :placeholder="$t('transferOnChian.amount')" auto-complete="off"></el-input>
          </el-form-item>
          <template v-if="$store.state.vuexStore.baseChain == 'ETH'">
            <span>{{ $t('transferOnChian.miningFee') }}: </span>
            <span style="float:right;"> ≈ {{ Gwei2ETH(txOnChainInfo.gasPrice) }} ETH</span>
            <el-form-item prop="gasPrice">
                <el-slider v-model="txOnChainInfo.gasPrice" :min='1' :max='100' :step='0.1' :format-tooltip="formatTooltip"></el-slider>
            </el-form-item>
          </template>
          <span v-if="$store.state.vuexStore.baseChain == 'NEO'">密码: </span>
          <el-form-item prop="keyStorePass">
              <el-input v-model="txOnChainInfo.keyStorePass" type="password" :placeholder="$t('index.password')" auto-complete="off"></el-input>
          </el-form-item>
      </el-form>
      <div style="text-align:center;margin-top: 10%;">
          <el-button type="primary" @click="txOnChain()" class="transferBtn">{{ $t('index.transfer') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
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
              if (value > this.balanceData.Chain[this.assetType]){
              callback(new Error('转账金额不能大于余额'));
            } else {
              callback();
            }
          }
      }
    };
    var checkTxOnChainGasPrice = (rule, value, callback) => {    //验证链上转账资产类型
      if(this.assetType == "ETH"){
        if (this.Gwei2ETH(value) + this.txOnChainInfo.amount >= this.balanceData.Chain['ETH']) {
          return callback(new Error('转账金额加矿工费不能大于余额'));
        } else {
          callback();
        }
      } else if (this.assetType == "TNC"){
        if(this.Gwei2ETH(value) >= this.balanceData.Chain['ETH']) {
          return callback(new Error('转账金额加矿工费不能大于余额'));
        } else {
          callback();
        }
      }
    };
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('index.callback-7')));
      } else {
        let PrivateKey;
        if(this.$store.state.vuexStore.baseChain == "ETH"){                  //当前为ETH钱包时
          PrivateKey = this.$parent.$parent.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
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
        gasPrice: [
          { validator: checkTxOnChainGasPrice, trigger: 'change' }
        ],
        keyStorePass: [
          { validator: checkKeyStorePass, trigger: 'blur' }
        ]
      },
    };
  },
  components: {
    headBox
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
    this.$nextTick(function(){                        //首次加载时查询当前gasPrice
      let _this = this;
      web3.eth.getGasPrice().then(function(gasPrice){
        _this.txOnChainInfo.gasPrice = Number(gasPrice).div(10e8);
      })
    })
  },
  methods: {
    contactChange() {       //当选中联系人时将值赋给payment code
      this.txOnChainInfo.address = this.contact;
    },
    formatTooltip(val) {
        return val + " Gwei";
    },
    Gwei2ETH(val) {         //Gwei转ETH
      let _this = this;
      let result;
      if(val){
        result = val.mul(22000).div(10e8);                  //21000为链上转账大约Gas,10e9为wei与ETH的转换
        result = _this.$parent.$parent.keepDecimalPlaces(result, 7);
      } else {
        result = "error";
      }
      // console.log(result);
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
      let decryptPK = _this.$parent.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.txOnChainInfo.keyStorePass);
      web3.eth.getTransactionCount(_this.$store.state.vuexStore.walletInfo.address, web3.eth.defaultBlock.pending).then(function(nonce){
        // 获取交易次数
        console.log(nonce);
        var txData = {
          // nonce每次++，以免覆盖之前pending中的交易
          nonce: web3.utils.toHex(nonce++),
          gasLimit: web3.utils.toHex(22000),                    //上链转账ETH Gas估算
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

            let recordMessage = {       //构造交易记录信息
              date: date,
              name: _this.txOnChainInfo.address,
              Amount: _this.txOnChainInfo.amount.mul(10e7),
              assetType: 'ETH',
              isOnChannel: false,
              isPay: true,
              state: 0,
              isTestNet: _this.$store.state.vuexStore.isTestNet,
              transactionHash : hash,
              blockHash: ""
            }
            _this.$store.state.vuexStore.recordList.push(recordMessage);
            _this.$parent.$parent.StoreData("recordList");         //保存交易信息
            _this.$parent.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
            _this.clearTxData();                                      //清空交易数据
            _this.$router.go(-1);                                      //返回上一页面
          } else {
              console.log(err);
          }
        })
      })
    },
    async txTncOnChain() {    //链上TNC转账方法
      let _this = this;

      let dataTypeList = ['address','uint256']; 
      let dataList = [
        _this.txOnChainInfo.address, 
        _this.txOnChainInfo.amount.mul(10e7)
      ];
      let signedData = await _this.$parent.$parent.signDataForERC20Contract(_this.$store.state.vuexStore.tncContractAddress, "transfer", dataTypeList, dataList, _this.txOnChainInfo.keyStorePass, _this.txOnChainInfo.gasPrice.mul(10e8));               //签名
      console.log(signedData);
      _this.sendSignedTransaction(signedData);
      // let date = new Date().getTime();        //获取当前时间戳
      // web3.eth.sendSignedTransaction('0x' + signedData, function(err, hash) {
      //   if (!err) {
      //     console.log(hash);
      //     _this.$notify({
      //         title: _this.$t('common.success'),
      //         dangerouslyUseHTMLString: true,
      //         message: _this.$t('common.callback-14'),
      //         duration: 3000,
      //         type: 'success'
      //     });
          
      //     let recordMessage = {
      //       date: date,
      //       name: _this.txOnChainInfo.address,
      //       Amount: _this.txOnChainInfo.amount.mul(10e7),
      //       assetType: 'TNC',
      //       isOnChannel: false,
      //       isPay: true,
      //       state: 0,
      //       isTestNet: _this.$store.state.vuexStore.isTestNet,
      //       transactionHash : hash,
      //       blockHash: ""
      //     }
      //     console.log(_this.txOnChainInfo.address);
      //     console.log(recordMessage);
      //     _this.$store.state.vuexStore.recordList.push(recordMessage);
      //     _this.$parent.$parent.StoreData("recordList");         //保存交易记录
      //     _this.$parent.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
      //     _this.$router.go(-1);                                      //清空交易数据
      //   } else {
      //     _this.$notify({
      //         title: _this.$t('common.warning'),
      //         dangerouslyUseHTMLString: true,
      //         message: _this.$t('common.callback-25') + err,
      //         duration: 3000,
      //         type: 'error'
      //     });
      //     _this.$router.go(-1);                                      //清空交易数据
      //   }
      // })
    },
    sendSignedTransaction(signedData) {
      let _this = this;
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
          
          let recordMessage = {
            date: date,
            name: _this.txOnChainInfo.address,
            Amount: _this.txOnChainInfo.amount.mul(10e7),
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
          _this.$parent.$parent.StoreData("recordList");         //保存交易记录
          _this.$parent.$parent.cycleGetTransactionReceipt(hash);           //循环查询交易hash
          _this.$router.go(-1);                                      //清空交易数据
        } else {
          _this.$notify({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-25') + err,
              duration: 3000,
              type: 'error'
          });
          _this.$router.go(-1);                                      //清空交易数据
        }
      })
    },
    NEOtxOnChain() {          //NEO链上转账方法
      let _this = this;
      console.log(_this.assetType);
      let AssetId = _this.$parent.$parent.AssetTypeToAssetId(_this.assetType);
      console.log(AssetId);
      axios({                     //发送构造交易消息
        method: 'post',
        url: _this.$store.state.vuexStore.NodeRpcUri,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "constructTx",
          "params":[_this.$store.state.vuexStore.NEOwalletInfo.address, _this.txOnChainInfo.address, _this.txOnChainInfo.amount, AssetId],
          "id": 1
        })
      }).then(function(res){
        console.log(res.data);
        if(res.data.error){
          _this.$notify({
              title: _this.$t('common.warning'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('common.callback-25'),
              duration: 3000,
              type: 'warning'
          });
          _this.$router.go(-1); 
          _this.clearTxData();                                      //清空交易数据
        } else {
          let txData = res.data.result.txData;
          let decryptPK;                                    //解锁钱包
          try {
              decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
                  'WalletScript': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].key,
                  'password': _this.txOnChainInfo.keyStorePass,
                  'address': _this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address
              });
          } catch (e) {
              _this.$notify.error({
                  title: _this.$t('loginByKeyStore.callback-9'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('loginByKeyStore.callback-8'),
                  duration: 3000
              });
              return false;
          }
          console.log(decryptPK);
          let txDataSign = signatureData(txData, decryptPK);
          console.log(txDataSign);
          console.log(_this.$store.state.vuexStore.NEOwalletInfo.publicKey);
          let witness1 = res.data.result.witness.replace('{signature}', txDataSign);
          let witness2 = witness1.replace('{pubkey}', _this.$store.state.vuexStore.NEOwalletInfo.publicKey);
          let witness = txData + witness2;
          axios({     //上链
            method: 'post',
            url: _this.$store.state.vuexStore.NodeRpcUri,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "sendRawTx",
              "params":[witness],
              "id": 1
            })
          }).then(function(res1){
            console.log(res1);
            if(res1.data.result == true){
              _this.$notify({
                  title: _this.$t('common.success'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-14'),
                  duration: 3000,
                  type: 'success'
              });

              let date = new Date().getTime();        //获取当前时间戳
              let recordMessage = {
                date: date,
                name: _this.txOnChainInfo.address,
                Amount: _this.txOnChainInfo.amount.mul(10e7),
                assetType: 'TNC',
                isOnChannel: false,
                isPay: true,
                state: 1,
                isTestNet: _this.$store.state.vuexStore.isTestNet,
                transactionHash : res.data.result.txid,
                blockHash: ""
              }
              console.log(_this.txOnChainInfo.address);
              console.log(recordMessage);
              _this.$store.state.vuexStore.recordList.push(recordMessage);
              _this.$parent.$parent.StoreData("recordList");         //保存交易记录

              _this.$router.go(-1); 
              _this.clearTxData();                                      //清空交易数据
            } else {
              _this.$notify({
                  title: _this.$t('common.warning'),
                  dangerouslyUseHTMLString: true,
                  message: _this.$t('common.callback-25'),
                  duration: 3000,
                  type: 'warning'
              });
              _this.$router.go(-1); 
              _this.clearTxData();                                      //清空交易数据
            }
          })
        }
      })
    },
    clearTxData() {       //清空转账信息
      this.txOnChainInfo = {        //清空链上转账信息
        "address": '',
        "assetType": '',
        "amount": '',
        "keyStorePass": ''
      };
      this.contact = '';            //清空选中的联系人     
    }
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
    background:#FFFFFF;
    z-index: 3;
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
.buttonBox{
  text-align: center; 
  padding: 12px 0 20px;
}
.button-item{
  width: 50%;
  float: left;
  color: #000000;
}
.buttonBox i{
  color:#FFFFFF;
  width: 60px;
  height: 60px;
  line-height: 62px;
  font-size: 28px;
  text-align: center; 
  border-radius: 50%; 
}
.el-icon-ETH-lianxiren{
    background: #FF7600;
}
.el-icon-ETH-saoyisao{
    background: #00B481;
}
p{
    font-size: 13px;
    margin-bottom: 0;
}
.contentBox{
    height: calc(100% - 56px);
    width: 100%;
    padding: 30px 30px 56px;
    box-sizing: border-box;
}
.transferBtn{
    width: 100%;
}
</style>
