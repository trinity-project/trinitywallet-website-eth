<template>
  <div class="loginByPrivateKeyForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('loginByPrivateKey.title') }}</h2>
        <hr/>
        <el-form :model="loginByPrivateKeyForm" status-icon :rules="loginByPrivateKeyRules" label-position="top" ref="loginByPrivateKeyForm" label-width="80px" class="demo-ruleForm">
            <el-form-item :label="$t('loginByPrivateKey.privateKey')" prop="privateKey">
                <el-input v-model="loginByPrivateKeyForm.privateKey"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginByPrivateKey.password')" prop="pass">
              <el-input type="password" v-model="loginByPrivateKeyForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginByPrivateKey.checkPass')" prop="checkPass">
              <el-input type="password" v-model="loginByPrivateKeyForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;margin-bottom: 22px;">
                <el-button type="primary" @click="Login()" style="width: 80%;">{{ $t('loginByPrivateKey.import') }}</el-button>
            </div>
        </el-form>
        <a @click="$parent.$parent.backToStart()" class="backToStartBtn">{{ $t('loginByPrivateKey.backToStart') }}</a>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
import Bus from './../bus.js'
export default {
  name: 'loginByPrivateKeyForm',
  data () {
    var checkPrivateKey = (rule, value, callback) => {      //loginByPrivateKey  私钥规则
      if (!value) {
        return callback(new Error(this.$t('loginByPrivateKey.callback-1')));
      }
      if (value.length !== 64) {
          if(value.length == 66 && value.substr(0,2) == "0x"){
            callback();
          } else {
            callback(new Error(this.$t('loginByPrivateKey.callback-2')));
          }
      } else {
          callback();
      }
    };
    var validatePass = (rule, value, callback) => {         //loginByPrivateKey  密码规则
      if (value === '') {
        callback(new Error(this.$t('loginByPrivateKey.callback-3')));
      } else {
        if (this.loginByPrivateKeyForm.checkPass !== '') {
          this.$refs.loginByPrivateKeyForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {        //loginByPrivateKey  重复密码规则
      if (value === '') {
        callback(new Error(this.$t('loginByPrivateKey.callback-4')));
      } else if (value !== this.loginByPrivateKeyForm.pass) {
        callback(new Error(this.$t('loginByPrivateKey.callback-5')));
      } else {
        callback();
      }
    };
    return {
        loginByPrivateKeyForm: {
          privateKey: '',
          pass: '',
          checkPass: ''
        },
        loginByPrivateKeyRules: {       //loginByPrivateKey  输入规则
          privateKey: [
            { validator: checkPrivateKey, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
    }
  },
  components: {
    headBox
  },
  computed: {
    completePrivateKey() {                                          //补齐私钥的0x
      if(this.loginByPrivateKeyForm.privateKey.startsWith("0x")){
        return this.loginByPrivateKeyForm.privateKey;
      } else {
        return "0x" + this.loginByPrivateKeyForm.privateKey;
      }
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    Login() {           //登录方法
      let _this = this;
      this.$refs['loginByPrivateKeyForm'].validate((valid) => {
        if (valid) {
          if (this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
            let keyStore = web3.eth.accounts.encrypt(this.completePrivateKey, this.loginByPrivateKeyForm.pass);
            console.log(keyStore);
            let address = web3.utils.toChecksumAddress(keyStore.address);
            console.log(address);
            if(web3.utils.checkAddressChecksum(address)){
              this.$store.state.vuexStore.walletInfo.keyStore = keyStore;
              // console.log(this.$store.state.vuexStore.walletInfo.keyStore);
              // this.$store.state.vuexStore.walletInfo.publicKey = privateKey2PublicKey(this.loginByPrivateKeyForm.privateKey).toString('hex');   //存入publicKey
              // console.log(this.$store.state.vuexStore.walletInfo.publicKey);
              this.$store.state.vuexStore.walletInfo.address = address;       //存入地址
              // console.log(this.$store.state.vuexStore.walletInfo.address);
              this.$store.state.vuexStore.isLogin = true;
              this.$notify({
                  title: this.$t('loginByPrivateKey.callback-6'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-7'),
                  duration: 3000,
                  type: 'success'
              });
              Bus.$emit('getAddressInfo', true);
              this.$parent.$parent.saveAsString("isLogin", this.$store.state.vuexStore.isLogin);                      // 存储wallet信息
              this.$parent.$parent.saveAsArray("walletInfo", this.$store.state.vuexStore.walletInfo);                 // 存储wallet信息
              this.$router.push('/setting/backup');       //跳转到备份界面
            } else {
              this.$notify.error({
                  title: this.$t('loginByPrivateKey.callback-8'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-9'),
                  duration: 3000
              });
            }
          } else if (this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
            let keyStore = scrypt_module_factory(generateWalletFileBlob, {}, {'privateKey':this.loginByPrivateKeyForm.privateKey,'password':this.loginByPrivateKeyForm.pass});
            console.log(keyStore);
            if(keyStore.accounts[0].address.length == 34){                                  //判断钱包地址长度
              this.$store.state.vuexStore.NEOwalletInfo.keyStore = keyStore;                //保存keystore
              this.$store.state.vuexStore.NEOwalletInfo.publicKey = getPublicKeyEncoded(ab2hexstring(getPublicKey(this.loginByPrivateKeyForm.privateKey, 0)));                                //存入publicKey
              console.log(this.$store.state.vuexStore.NEOwalletInfo.keyStore);
              this.$store.state.vuexStore.NEOwalletInfo.address = keyStore.accounts[0].address;       //存入地址
              this.$store.state.vuexStore.isLogin = true;
              this.$notify({
                  title: this.$t('loginByPrivateKey.callback-6'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-7'),
                  duration: 3000,
                  type: 'success'
              });
              Bus.$emit('getAddressInfo', true);
              this.$parent.$parent.saveAsString("isLogin", this.$store.state.vuexStore.isLogin);                      // 存储wallet信息
              this.$parent.$parent.saveAsArray("walletInfo", this.$store.state.vuexStore.NEOwalletInfo);              // 存储wallet信息
              this.$router.push('/setting/backup');       //跳转到备份界面
            } else {
              this.$notify.error({
                  title: this.$t('loginByPrivateKey.callback-8'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-9'),
                  duration: 3000
              });
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
        this.loginByPrivateKeyForm.privateKey = '';   //清空数据
        this.loginByPrivateKeyForm.pass = '';
        this.loginByPrivateKeyForm.checkPass = '';
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginByPrivateKeyForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.contentBox{
    height: calc(100% - 44px);
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
}
.fullPage{
    width: 100% !important;
}
</style>
