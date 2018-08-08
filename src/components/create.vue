<template>
  <div class="createForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>创建钱包</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="createForm" status-icon :rules="createRules" ref="createForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="createForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="createForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="toLoginForm()" style="margin-left:-40px;width: 120px;">提交</el-button>
            </el-form-item>
        </el-form>
        <a @click="$parent.backToStart()" class="backToStartBtn">返回开始界面</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'createForm',
  data () {
    var validatePass = (rule, value, callback) => {         //create 密码输入规则
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.createForm.checkPass !== '') {
          this.$refs.createForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {      //create 重复密码输入规则
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.createForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
        createForm: {
          pass: '',
          checkPass: ''
        },
        createRules: {        //create 输入规则
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
    toLoginForm() {       //切换到登录窗口
        this.$refs['createForm'].validate((valid) => {
            if (valid) {
                let privateKey = web3.eth.accounts.create().privateKey.slice(2);
                console.log(privateKey);
                let keyStore = web3.eth.accounts.encrypt('0x' + privateKey, this.createForm.pass);
                console.log(keyStore);
                let address = web3.utils.toChecksumAddress(keyStore.address);
                console.log(address);
                if(web3.utils.checkAddressChecksum(address)){
                    this.$store.state.vuexStore.walletInfo.keyStore = keyStore;
                    // console.log(this.$store.state.vuexStore.walletInfo.keyStore);
                    // this.$store.state.vuexStore.walletInfo.publicKey = privateKey2PublicKey(privateKey).toString('hex');   //存入publicKey
                    // console.log(this.$store.state.vuexStore.walletInfo.publicKey);
                    this.$store.state.vuexStore.walletInfo.address = address;       //存入地址
                    // console.log(this.$store.state.vuexStore.walletInfo.address);
                    this.$store.state.vuexStore.isLogin = true;
                    this.$notify({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '创建成功',
                        duration: 3000,
                        type: 'success'
                    });
                }
                this.$router.push('/backup');
            } else {
                console.log('error submit!!');
                return false;
            }
            this.createForm.pass = '';
            this.createForm.checkPass = '';
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.createForm{
    float: left;
    height: calc(100vh - 106px);
    width: 100%;
    overflow: hidden;
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
