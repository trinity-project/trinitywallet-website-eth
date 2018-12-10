<template>
  <div class="createForm">
    <div class="headBox">
      <div class="header-button is-left">

      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">

      </div>
    </div>
    <div class="contentBox">
        <h2 @click="test()" class="title_h2">恢复钱包</h2>
        <hr/>
        <el-form :model="backForm" status-icon ref="backForm" label-position="top" class="demo-ruleForm">
            <el-form-item :label="$t('create.password')" prop="pass">
              <el-input type="password" v-model="backForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;margin:10% 0 22px;">
                <el-button type="primary" @click="toLoginForm()" :disabled="isDisable" style="width: 80%;">恢复</el-button>
            </div>
        </el-form>
        <a @click="$parent.$parent.backToStart()" class="backToStartBtn">{{ $t('loginByPrivateKey.backToStart') }}</a>
    </div>
  </div>
</template>

<script>
import Bus from './../bus.js'
export default {
  name: 'createForm',
  data () {
    return {
        isDisable: false,       //用于禁用快速导致多次提交
        backForm: {
          pass: ''
        },
    }
  },
  components: {

  },
  computed: {
    baseChain(){                                    //底层链
      return this.$store.state.vuexStore.baseChain;
    },
    keyStore(){                                    //底层链
      if(this.baseChain == "ETH"){
        return this.$store.state.vuexStore.walletInfo.keyStore;
      } else if(this.baseChain == "NEO"){
        return this.$store.state.vuexStore.NEOwalletInfo.keyStore;
      
      }
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    toLoginForm() {       //切换到登录窗口
      let _this = this;
      _this.isDisable = true;
      setTimeout(() => {
        _this.isDisable = false;
      }, 2000);
      let keyStorePass = _this.backForm.pass;
      let decryptPK;
      console.log(!keyStorePass);
      if(!keyStorePass){
        alert("钱包密码不能为空，否则将无法恢复");
      } else {
        try {
          if(_this.baseChain == "ETH"){                  //当前为ETH钱包时
            console.log()
            decryptPK = web3.eth.accounts.decrypt(this.keyStore, keyStorePass);
          } else if (_this.baseChain == "NEO"){                  //当前为ETH钱包时
            decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
              'WalletScript': this.keyStore.accounts[0].key,
              'password': keyStorePass,
              'address': this.keyStore.accounts[0].address
            });
          }
        } catch (e) {
          // alert("钱包解锁失败,可能是密码错误");
        }
      

        if(decryptPK){
          if(this.baseChain == "ETH"){                 //当前为ETH钱包时

            let privateKey1 = new Buffer(decryptPK.privateKey.substring(2),'hex');
            let privateKey = privateKey1.toString('hex');
            console.log(privateKey);

            let address = web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address;
            address = web3.utils.toChecksumAddress(address);        //转化为校验和地址
            //console.log(address);

            if(web3.utils.checkAddressChecksum(address)){
              this.$store.state.vuexStore.isLogin = true;
              this.$store.state.vuexStore.walletInfo.keyStorePass = keyStorePass;
              this.$notify({
                title: this.$t('loginByKeyStore.callback-10'),
                dangerouslyUseHTMLString: true,
                message: this.$t('loginByKeyStore.callback-11'),
                duration: 3000,
                type: 'success'
              });
              Bus.$emit('getAddressInfo', true);
              
              this.$router.push('/wallet');         //跳转到首页
            } else {
              this.$notify.error({
                title: this.$t('loginByKeyStore.callback-12'),
                dangerouslyUseHTMLString: true,
                message: this.$t('loginByKeyStore.callback-13'),
                duration: 3000
              });
            }
          } else if (this.baseChain == "NEO"){                 //当前为NEO钱包时
            //this.$store.state.vuexStore.NEOwalletInfo.keyStore = this.keyStoreContent;                        //存入KeyStore
            //this.$store.state.vuexStore.NEOwalletInfo.publicKey = getPublicKeyEncoded(ab2hexstring(getPublicKey(decryptPK, 0)));   //存入publicKey
            //console.log(this.$store.state.vuexStore.NEOwalletInfo.publicKey);
            //this.$store.state.vuexStore.NEOwalletInfo.address = this.keyStoreContent.accounts[0].address;       //存入地址
            this.$store.state.vuexStore.NEOwalletInfo.keyStorePass = keyStorePass;
            this.$store.state.vuexStore.isLogin = true;                     //登录标志
            this.$notify({
              title: this.$t('loginByKeyStore.callback-10'),
              dangerouslyUseHTMLString: true,
              message: this.$t('loginByKeyStore.callback-11'),
              duration: 3000,
              type: 'success'
            });
            this.keyStoreContent = '';      //清空数据
            this.keyStorePass = '';
            this.$router.push('/wallet');         //跳转到首页
          }
        } else {
          alert("钱包解锁失败,可能是密码错误");
        }
      }
      this.backForm.pass = '';
    },
    test() {
      console.log(1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.createForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.contentBox{
    height: calc(100% - 64px);
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
}
.PrivateKeyBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    background-color: #ecf8ff;
    border-left: 5px solid #50bfff;
}

.TipsBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    background-color: #fef0f0;
    border-left: 5px solid #f56c6c;
}
.PrivateKeyBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
}
.PrivateKeyBox p{
    font-size: 16px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
</style>
