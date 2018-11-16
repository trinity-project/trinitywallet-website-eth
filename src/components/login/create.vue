<template>
  <div class="createForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('create.title') }}</h2>
        <hr/>
        <el-form :model="createForm" status-icon :rules="createRules" ref="createForm" label-position="top" class="demo-ruleForm">
            <el-form-item :label="$t('create.password')" prop="pass">
              <el-input type="password" v-model="createForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('create.checkPass')" prop="checkPass">
              <el-input type="password" v-model="createForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <div style="text-align:center;margin-bottom: 22px;">
                <el-button type="primary" @click="toLoginForm()" style="width: 80%;">{{ $t('create.create') }}</el-button>
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
  name: 'createForm',
  data () {
    var validatePass = (rule, value, callback) => {         //create 密码输入规则
      if (value === '') {
        callback(new Error(this.$t('create.callback-1')));
      } else {
        if (this.createForm.checkPass !== '') {
          this.$refs.createForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {      //create 重复密码输入规则
      if (value === '') {
        callback(new Error(this.$t('create.callback-2')));
      } else if (value !== this.createForm.pass) {
        callback(new Error(this.$t('create.callback-3')));
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
  components: {
    headBox
  },
  mounted() {
    this.$nextTick(function(){
        
    })
  },
  methods: {
    toLoginForm() {       //切换到登录窗口
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          if(this.$store.state.vuexStore.baseChain == "ETH"){                 //当前为ETH钱包时
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
                title: this.$t('create.callback-4'),
                dangerouslyUseHTMLString: true,
                message: this.$t('create.callback-5'),
                duration: 3000,
                type: 'success'
              });
              console.log(JSON.stringify(this.$store.state.vuexStore.walletInfo));
              Bus.$emit('getAddressInfo', true);
              this.$parent.$parent.saveAsString("isLogin", this.$store.state.vuexStore.isLogin);                      // 存储wallet信息
              this.$parent.$parent.saveAsArray("walletInfo", this.$store.state.vuexStore.walletInfo);                 // 存储wallet信息
            }
            this.$router.push('/setting/backup');
          } else if(this.$store.state.vuexStore.baseChain == "NEO"){                 //当前为NEO钱包时
            let privateKey = ab2hexstring(generatePrivateKey());
            console.log(privateKey);
            let keyStore = scrypt_module_factory(generateWalletFileBlob, {}, {'privateKey':privateKey,'password':this.createForm.pass});
            console.log(keyStore);
            let address = keyStore.accounts[0].address;
            console.log(address);
            if(address.length == 34){
                this.$store.state.vuexStore.NEOwalletInfo.keyStore = keyStore;     //存入KeyStore
                this.$store.state.vuexStore.NEOwalletInfo.publicKey = getPublicKeyEncoded(ab2hexstring(getPublicKey(privateKey, 0)));                      //存入publicKey
                this.$store.state.vuexStore.NEOwalletInfo.address = address;       //存入地址
                // console.log(this.$store.state.vuexStore.NEOwalletInfo);
                this.$store.state.vuexStore.isLogin = true;
                this.$notify({
                    title: this.$t('create.callback-4'),
                    dangerouslyUseHTMLString: true,
                    message: this.$t('create.callback-5'),
                    duration: 3000,
                    type: 'success'
                });
            }
            Bus.$emit('getAddressInfo', true);
            this.$parent.$parent.saveAsString("isLogin", this.$store.state.vuexStore.isLogin);                      // 存储wallet信息
            this.$parent.$parent.saveAsArray("walletInfo", this.$store.state.vuexStore.NEOwalletInfo);              // 存储wallet信息
            this.$router.push('/setting/backup');
          }
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
