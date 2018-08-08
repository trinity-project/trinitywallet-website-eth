<template>
  <div class="loginByPrivateKeyForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>导入私钥</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="loginByPrivateKeyForm" status-icon :rules="loginByPrivateKeyRules" ref="loginByPrivateKeyForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="私钥" prop="privateKey">
                <el-input v-model="loginByPrivateKeyForm.privateKey"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="loginByPrivateKeyForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="loginByPrivateKeyForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="Login()" style="margin-left:-40px;width: 120px;">提交</el-button>
            </el-form-item>
        </el-form>
        <a @click="$parent.backToStart()" class="backToStartBtn">返回开始界面</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginByPrivateKeyForm',
  data () {
    var checkPrivateKey = (rule, value, callback) => {      //loginByPrivateKey  私钥规则
      if (!value) {
        return callback(new Error('私钥不能为空'));
      }
      if (value.length !== 64) {
          callback(new Error('请输入正确的私钥'));
      } else {
          callback();
      }
    };
    var validatePass = (rule, value, callback) => {         //loginByPrivateKey  密码规则
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.loginByPrivateKeyForm.checkPass !== '') {
          this.$refs.loginByPrivateKeyForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {        //loginByPrivateKey  重复密码规则
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.loginByPrivateKeyForm.pass) {
        callback(new Error('两次输入密码不一致!'));
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
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
      Login() {           //登录方法
        let _this = this;
        this.$refs['loginByPrivateKeyForm'].validate((valid) => {
          if (valid) {
            let keyStore = web3.eth.accounts.encrypt('0x' + this.loginByPrivateKeyForm.privateKey, this.loginByPrivateKeyForm.pass);
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
                  title: '成功',
                  dangerouslyUseHTMLString: true,
                  message: '导入成功',
                  duration: 3000,
                  type: 'success'
              });
              this.$router.push('/backup');       //跳转到备份界面
              this.$store.state.vuexStore.activeNavIndex = "3-5";
            } else {
              this.$notify.error({
                  title: '警告',
                  dangerouslyUseHTMLString: true,
                  message: '导入失败，请确认私钥正确',
                  duration: 3000
              });
            }
            this.loginByPrivateKeyForm.privateKey = '';   //清空数据
            this.loginByPrivateKeyForm.pass = '';
            this.loginByPrivateKeyForm.checkPass = '';
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
.loginByPrivateKeyForm{
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
h2{
    margin: 0;
}
.fullPage{
    width: 100% !important;
}
</style>
