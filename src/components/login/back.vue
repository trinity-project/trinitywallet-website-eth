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
        <h2 class="title_h2">恢复钱包</h2>
        <hr/>
        <el-form :model="backForm" status-icon :rules="backRules" ref="backForm" label-position="top" class="demo-ruleForm">
            <el-form-item :label="$t('create.password')" prop="pass">
              <el-input type="password" v-model="backForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;margin:10% 0 22px;">
                <el-button type="primary" @click="toLoginForm()" style="width: 80%;">恢复</el-button>
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
    var validatePass = (rule, value, callback) => {         //create 密码输入规则
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
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
        }, 300);
      }
    };
    return {
        backForm: {
          pass: ''
        },
        backRules: {          //back 输入规则
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
    }
  },
  components: {

  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    toLoginForm() {       //切换到登录窗口
      this.$refs['backForm'].validate((valid) => {
        if (valid) {
          if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
            let decryptPK;
            try {
              decryptPK = web3.eth.accounts.decrypt(this.$store.state.vuexStore.walletInfo.keyStore, this.backForm.pass);
            } catch (e) {
              if(e.message == 'Key derivation failed - possibly wrong password'){
                this.$notify.error({
                  title: this.$t('loginByKeyStore.callback-7'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByKeyStore.callback-8'),
                  duration: 3000
                });
                return false;
              } else {
                this.$notify.error({
                  title: this.$t('loginByKeyStore.callback-9'),
                  dangerouslyUseHTMLString: true,
                  message: e.message,
                  duration: 3000
                });
                return false;
              }
            }

            let privateKey1 = new Buffer(decryptPK.privateKey.substring(2),'hex');
            let privateKey = privateKey1.toString('hex');
            console.log(privateKey);

            let address = web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address;
            address = web3.utils.toChecksumAddress(address);        //转化为校验和地址
            //console.log(address);

            if(web3.utils.checkAddressChecksum(address)){
              this.$store.state.vuexStore.isLogin = true;
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
            this.keyStoreContent = '';      //清空数据
            this.keyStorePass = '';
          } else if (this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
            console.log(this.keyStoreContent);
            let decryptPK;
            try {
              decryptPK = scrypt_module_factory(DecryptWalletByPassword, {}, {
                'WalletScript':this.keyStoreContent.accounts[0].key,
                'password': this.keyStorePass,
                'address': this.keyStoreContent.accounts[0].address
              });
              console.log(decryptPK);
            } catch (e) {
              this.$notify.error({
                title: this.$t('loginByKeyStore.callback-9'),
                dangerouslyUseHTMLString: true,
                message: e.message,
                duration: 3000
              });
              return false;
            }

            this.$store.state.vuexStore.NEOwalletInfo.keyStore = this.keyStoreContent;                        //存入KeyStore
            this.$store.state.vuexStore.NEOwalletInfo.publicKey = getPublicKeyEncoded(ab2hexstring(getPublicKey(decryptPK, 0)));   //存入publicKey
            console.log(this.$store.state.vuexStore.NEOwalletInfo.publicKey);
            this.$store.state.vuexStore.NEOwalletInfo.address = this.keyStoreContent.accounts[0].address;       //存入地址
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
          console.log('error submit!!');
          return false;
        }
        this.backForm.pass = '';
      });
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
