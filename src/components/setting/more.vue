<template>
  <div class="moreForm">
    <headBox/>
    <div class="contentBox">
        <router-link to="/setting/more" class="cell">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.more.oneStepPayment') }} ( Test ) </span>
                </div>
                <div class="cell-right">
                    <el-switch v-model="$store.state.vuexStore.isOneStepPayment" active-color="#13ce66" inactive-color="#CCCCCC">
                    </el-switch>
                </div>
            </div>
        </router-link>
    </div>
    <el-dialog title="免密支付" :visible.sync="isComfirmOneStepPaymentShow" width="calc(100% - 20px)" center>
        <span>注意:开启免密支付后收付款不用再输入密码</span>
        <span slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="oneStepPaymentRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
                <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>            
        </span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm()">{{ $t('common.continue') }}</el-button>
        <el-button @click="isComfirmOneStepPaymentShow = false;">{{ $t('common.cancel') }}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'moreForm',
  data () {
    var validatePass = (rule, value, callback) => {         //Receipt 密码输入规则
      if (!value) {
        return callback(new Error(this.$t('common.callback-1')));
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
        }, 100);
      }
    };
    return {
        isComfirmOneStepPaymentShow: false,                             //确认开启免密支付窗口
        activeInfo: {
            keyStorePass: ""
        },
        oneStepPaymentRules: {        //验证钱包密码 输入规则
          keyStorePass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
    }
  },
  components: {
    headBox
  },
  filters:{

  },
  watch: {
      '$store.state.vuexStore.isOneStepPayment': 'oneStepChange',               // 监测到主/测试网变化时,更新配置
  },
  methods: {
    oneStepChange() {
        console.log(this.$store.state.vuexStore.isOneStepPayment);
        if(this.$store.state.vuexStore.isOneStepPayment){
            this.isComfirmOneStepPaymentShow = true;
        } else {
            this.$parent.$parent.saveAsString(this.$store.state.vuexStore.walletInfo.address + "@isOneStepPayment", this.$store.state.vuexStore.isOneStepPayment);         // 存储免密支付信息
        }
    },
    confirm() {
      this.$refs['activeInfo'].validate((valid) => {
        if(this.$store.state.vuexStore.baseChain == "ETH"){
            this.$store.state.vuexStore.walletInfo.keyStorePass = this.activeInfo.keyStorePass;                     //储存keystore密码
            console.log(this.$store.state.vuexStore.walletInfo.keyStorePass);
        } else if(this.$store.state.vuexStore.baseChain == "NEO"){
            this.$store.state.vuexStore.NEOwalletInfo.keyStorePass = this.activeInfo.keyStorePass;                     //储存keystore密码
            console.log(this.$store.state.vuexStore.NEOwalletInfo.keyStorePass);
        }
        this.$parent.$parent.saveAsString(this.$store.state.vuexStore.walletInfo.address + "@isOneStepPayment", this.$store.state.vuexStore.isOneStepPayment);         // 存储免密支付信息
        this.isComfirmOneStepPaymentShow = false;
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.moreForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #F2F2F2;
    z-index: 2;
}
.headBox{
    background-color: RGBA(64, 64, 67, 0.97);
}
h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.contentBox{
    height: calc(100% - 106px);
    width: 100%;
    padding: 30px 0;
    box-sizing: border-box;
}

h2{
    margin: 0 20px 12px;
    font-size: 24px;
}

</style>
