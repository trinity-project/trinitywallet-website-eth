<template>
  <div class="changePasswordForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('changePassword.title') }}</h2>
        <hr/>
        <el-form :model="changePasswordForm" status-icon :rules="changePasswordRules" ref="changePasswordForm" label-position="top" label-width="92px" class="demo-ruleForm">
            <el-form-item :label="$t('changePassword.oldPass')" prop="oldPass">
              <el-input type="password" v-model="changePasswordForm.oldPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('changePassword.password')" prop="pass">
              <el-input type="password" v-model="changePasswordForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('changePassword.checkPass')" prop="checkPass">
              <el-input type="password" v-model="changePasswordForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;" class="button-item">
                <el-button type="primary" @click="toLoginForm()">{{ $t('changePassword.changePassword') }}</el-button>
            </div>
        </el-form>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'changePasswordForm',
  data () {
    var validateOldPass = (rule, value, callback) => {         //changePassword 原密码输入规则
      if (!value) {
        return callback(new Error(this.$t('changePassword.callback-1')));
      } else {
        let PrivateKey = this.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore, value);
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error(this.$t('changePassword.callback-2')));
            }
        }, 2000);
      }
    };
    var validatePass = (rule, value, callback) => {         //changePassword 密码输入规则
      if (value === '') {
        callback(new Error(this.$t('changePassword.callback-3')));
      } else {
        if (this.changePasswordForm.checkPass !== '') {
          this.$refs.changePasswordForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {      //changePassword 重复密码输入规则
      if (value === '') {
        callback(new Error(this.$t('changePassword.callback-4')));
      } else if (value !== this.changePasswordForm.pass) {
        callback(new Error(this.$t('changePassword.callback-5')));
      } else {
        callback();
      }
    };
    return {
        changePasswordForm: {
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        changePasswordRules: {        //changePassword 输入规则
          oldPass: [
            { validator: validateOldPass, trigger: 'blur' }
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
    toLoginForm() {       //切换到登录窗口
        this.$refs['changePasswordForm'].validate((valid) => {
            if (valid) {
                let PrivateKey = this.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore, this.changePasswordForm.oldPass);
                console.log(PrivateKey);
                let keyStore = web3.eth.accounts.encrypt(PrivateKey.privateKey, this.changePasswordForm.pass);
                console.log(keyStore);
                let address = web3.utils.toChecksumAddress(keyStore.address);
                console.log(address);
                if(address == this.$store.state.vuexStore.walletInfo.address){
                this.$store.state.vuexStore.walletInfo.keyStore = keyStore;

                this.$notify({
                    title: this.$t('changePassword.callback-6'),
                    dangerouslyUseHTMLString: true,
                    message: this.$t('changePassword.callback-7'),
                    duration: 3000,
                    type: 'success'
                });
                } else {
                this.$notify.error({
                    title: this.$t('changePassword.callback-8'),
                    dangerouslyUseHTMLString: true,
                    message: this.$t('changePassword.callback-9'),
                    duration: 3000
                });
                }
                
            } else {
                console.log('error submit!!');
                return false;
            }
            this.changePasswordForm.oldPass = '';
            this.changePasswordForm.pass = '';
            this.changePasswordForm.checkPass = '';
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.changePasswordForm{
    float: left;
    height: calc(100% - 56px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 2;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
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
.button-item button{
  width: 80%;
}
</style>
