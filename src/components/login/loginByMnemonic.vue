<template>
  <div class="loginByMnemonicForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">助记词导入</h2>
        <hr/>
        <el-form :model="loginByMnemonicForm" status-icon :rules="loginByMnemonicRules" label-position="top" ref="loginByMnemonicForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="助记词" prop="mnemonic" placeholder="请输入12个单词,以空格隔开">
              <el-input type="textarea" rows="2" v-model="loginByMnemonicForm.mnemonic" placeholder="请输入12个单词,以空格隔开"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginByPrivateKey.password')" prop="pass">
              <el-input type="password" v-model="loginByMnemonicForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginByPrivateKey.checkPass')" prop="checkPass">
              <el-input type="password" v-model="loginByMnemonicForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="Login()" style="width: 80%;">{{ $t('loginByPrivateKey.import') }}</el-button>
            </el-form-item>
        </el-form>
        <a @click="$parent.$parent.backToStart()" class="backToStartBtn">{{ $t('loginByPrivateKey.backToStart') }}</a>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'loginByMnemonicForm',
  data () {
    var checkMnemonic = (rule, value, callback) => {      //loginByPrivateKey  私钥规则
      if (!value) {
        return callback(new Error("助记词不能为空"));
      }
      console.log(validateMnemonic(value));
      if (validateMnemonic(value)) {
        callback();
      } else {
        callback(new Error("助记词验证失败"));
      }
    };
    var validatePass = (rule, value, callback) => {         //loginByPrivateKey  密码规则
      if (value === '') {
        callback(new Error(this.$t('loginByPrivateKey.callback-3')));
      } else {
        if (this.loginByMnemonicForm.checkPass !== '') {
          this.$refs.loginByMnemonicForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {        //loginByPrivateKey  重复密码规则
      if (value === '') {
        callback(new Error(this.$t('loginByPrivateKey.callback-4')));
      } else if (value !== this.loginByMnemonicForm.pass) {
        callback(new Error(this.$t('loginByPrivateKey.callback-5')));
      } else {
        callback();
      }
    };
    return {
      loginByMnemonicForm: {
        mnemonic: '',
        pass: '',
        checkPass: ''
      },
      loginByMnemonicRules: {       //loginByPrivateKey  输入规则
        mnemonic: [
          { validator: checkMnemonic, trigger: 'blur' }
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
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    Login() {           //登录方法
      let _this = this;
      this.$refs['loginByMnemonicForm'].validate((valid) => {
        if (valid) {
          if (this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
            let mnemonic = this.loginByMnemonicForm.mnemonic;
            console.log(mnemonic);
            let privateKey = mnemonic2privateKey(mnemonic);
            console.log(privateKey);
            let keyStore = web3.eth.accounts.encrypt("0x" + privateKey, this.loginByMnemonicForm.pass);
            console.log(keyStore);
            let address = web3.utils.toChecksumAddress(keyStore.address);
            console.log(address);
            if(web3.utils.checkAddressChecksum(address)){
              this.$store.state.vuexStore.walletInfo.keyStore = keyStore;
              this.$store.state.vuexStore.walletInfo.address = address;       //存入地址
              this.$store.state.vuexStore.isLogin = true;
              this.$notify({
                  title: this.$t('loginByPrivateKey.callback-6'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-7'),
                  duration: 3000,
                  type: 'success'
              });
              this.$router.push('/wallet');       //跳转到备份界面
            } else {
              this.$notify.error({
                  title: this.$t('loginByPrivateKey.callback-8'),
                  dangerouslyUseHTMLString: true,
                  message: this.$t('loginByPrivateKey.callback-9'),
                  duration: 3000
              });
            }
            this.loginByMnemonicForm.mnemonic = '';   //清空数据
            this.loginByMnemonicForm.pass = '';
            this.loginByMnemonicForm.checkPass = '';
          } else if (this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
            
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginByMnemonicForm{
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
