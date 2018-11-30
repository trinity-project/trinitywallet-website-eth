<template>
  <div class="backupForm">
    <div class="headBox">
      <div class="header-button is-left">
          <i @click="$router.push('/wallet')" class="el-icon-ETH-fanhui"></i>
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
      </div>
    </div>
    <div class="contentBox">
        <h2 class="title_h2">{{$t('backup.title')}}</h2>
        <hr/>
        <div class="buttonBox clearfloat">
            <el-row :gutter="20">
                <el-col v-for="(item,index) in buttonBoxData" :key="index" :span="12">
                    <a @click="confirmBackup(item.func)" class="button-item">
                        <i :class="item.icon"></i>
                        <p>{{ item.name }}</p>
                    </a>
                </el-col>
            </el-row>
        </div>
        <el-input v-if="keyStore" id="backupKeyStore" type="textarea" rows="6" v-model="keyStore" readonly="readonly"></el-input>
        <el-input v-if="privateKey" id="backupPrivateKey" type="textarea" rows="3" v-model="privateKey" readonly="readonly"></el-input>
        <div v-if="!keyStore && !privateKey" class="tipBox tipBox-red">
            <h3>{{$t('backup.tips')}}</h3>
            <p>{{ $t('backup.tipsContent') }}</p>
        </div>
        <div v-if="keyStore" class="align-center" style="margin-top:18%;">
            <el-button data-clipboard-target="#backupKeyStore" @click="copyfun()" type="primary" class="btncopy">复制</el-button>
        </div>
        <div v-if="privateKey" class="align-center" style="margin-top:18%;">
            <el-button data-clipboard-target="#backupPrivateKey" @click="copyfun()" type="primary" class="btncopy">复制</el-button>
        </div>
        <el-dialog class="unlockWalletBox" title="请输入密码" :visible.sync="isUnlockWalletBox" width="calc(100% - 20px)" center :modal-append-to-body='false'> 
          <span slot="footer" class="dialog-footer">
            <el-form :model="unlockWalletForm" status-icon :rules="unlockWalletRules" ref="unlockWalletForm" label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('common.password')" prop="keyStorePass">
                <el-input v-model="unlockWalletForm.keyStorePass" :placeholder="$t('common.inputPassword')" type="password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="text-align:center;margin-left: -80px;">
                <el-button @click="backup()" type="primary" :disabled="isDisable">{{ $t('common.continue') }}</el-button>
                <el-button @click="isUnlockWalletBox = false;">{{ $t('common.cancel') }}</el-button>
              </el-form-item>
            </el-form>            
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'backupForm',
  data () {
    var checkKeyStorePass = (rule, value, callback) => {        //验证钱包密码
      if (!value) {
        return callback(new Error(this.$t('common.callback-1')));
      } else {
        let PrivateKey;
        if(this.baseChain == "ETH"){                  //当前为ETH钱包时
          console.log(this.$store.state.vuexStore.walletInfo);
          console.log(value);
          PrivateKey = this.$parent.$parent.verifyPassword(this.$store.state.vuexStore.walletInfo.keyStore, value);
        } else if (this.baseChain == "NEO"){                  //当前为ETH钱包时
          console.log(1);
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
            return callback(new Error(this.$t('common.callback-2')));
          }
        }, 300);
      }
    };
    return {
        isDisable: false,       //用于禁用快速导致多次提交
        buttonBoxData:[                                     //按钮组数据
          {
            name: "备份keyStore",
            icon: "el-icon-ETH-daima",
            func: "backupKeyStore",
          },
          {
            name: "备份私钥",
            icon: "el-icon-ETH-mima",
            func: "backupPrivateKey",
          }
        ],
        backupType: "",
        keyStore: "",
        privateKey: "",
        isUnlockWalletBox: false,
        unlockWalletForm:{
          keyStorePass: ''
        },
        unlockWalletRules: {        //unlockWallet输入规则
          keyStorePass: [
            { validator: checkKeyStorePass, trigger: 'blur' }
          ],
        }
    }
  },
  components: {

  },
  computed: {
    isMobile(){                                             //是否为移动端
      return this.$store.state.vuexStore.isMobile;
    },
    baseChain(){                                    //底层链
      return this.$store.state.vuexStore.baseChain;
    },
  },
  methods: {
    confirmBackup(type) {            //备份事件,生成json文件
      this.isUnlockWalletBox = true;
      this.backupType = type;
    },
    cancel() {

    },
    backup() {
      let _this = this;
      _this.isDisable = true;
      setTimeout(() => {
        _this.isDisable = false;
      }, 2000)
      this.$refs['unlockWalletForm'].validate((valid) => {
        if (valid) {
          let keyStorePass = this.unlockWalletForm.keyStorePass;
          if(this.backupType == "backupKeyStore"){
            if(this.isMobile){                                      //如果是移动端
              this.privateKey = "";
              if(this.$store.state.vuexStore.walletInfo.keyStore){
                this.keyStore = JSON.stringify(this.$store.state.vuexStore.walletInfo.keyStore);
              }
            } else {                                                //如果是PC端
              if(this.$store.state.vuexStore.baseChain == "ETH"){
                if(this.$store.state.vuexStore.walletInfo.keyStore){
                  var content = JSON.stringify(this.$store.state.vuexStore.walletInfo.keyStore);
                  var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                  saveAs(blob, this.$store.state.vuexStore.walletInfo.keyStore.id + ".json");//saveAs(blob,filename)
                } else {
                  this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '备份失败，请确认正确导入钱包',
                    duration: 3000
                  });
                }
              } else if(this.$store.state.vuexStore.baseChain == "NEO"){
                if(this.$store.state.vuexStore.NEOwalletInfo.keyStore){
                  var content = JSON.stringify(this.$store.state.vuexStore.NEOwalletInfo.keyStore);
                  var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                  saveAs(blob, this.$store.state.vuexStore.NEOwalletInfo.keyStore.accounts[0].address + ".json");//saveAs(blob,filename)
                } else {
                  this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '备份失败，请确认正确导入钱包',
                    duration: 3000
                  });
                }
              }
            }
          } else if(this.backupType == "backupPrivateKey"){
            this.keyStore = "";
            let decryptPK = this.$parent.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore, keyStorePass);
            this.privateKey = decryptPK.privateKey;
          }
          this.isUnlockWalletBox = false;
          this.unlockWalletForm.keyStorePass = "";
        }
      })
    },
    copyfun() {			//copy
        let _this = this;
        if(clipboard){
            clipboard.destroy();
        }
        clipboard = new ClipboardJS('.btncopy');
        clipboard.on('success', function(e) {   //成功回调 
            _this.$notify.info({
                title: '消息',
                dangerouslyUseHTMLString: true,
                message: '复制成功',
                duration: 3000
            });
        });
        clipboard.on('error', function(e) {     //失败回调
            _this.$notify.info({
                title: '警告',
                dangerouslyUseHTMLString: true,
                message: '复制失败，请自行复制',
                duration: 3000,
                type: 'warning'
            });
        });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.backupForm{
    float: left;
    height: calc(100% - 44px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
.tipBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
}
.tipBox-red{
    background-color: #fef0f0;
    border-left: 5px solid #f56c6c;
}
.tipBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    color: #f56c6c;
    font-size: 18px;
    /* border-bottom: 1px solid #CCCCCC; */
}
.tipBox p{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
</style>
