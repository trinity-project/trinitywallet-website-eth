<template>
  <div class="loginByKeyStoreForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox loginByKeyStoreContentBox">
        <h2>{{ $t('loginByKeyStore.title') }}</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form status-icon ref="loginByKeyStoreForm" label-position="top" label-width="80px" class="demo-ruleForm">
            <el-upload class="upload-demo" ref="upload" :on-change="handleChange" :file-list="fileList" accept = ".json" :auto-upload="false" :limit="1" action="/">
                <el-button slot="trigger">{{ $t('loginByKeyStore.chooseKeyStore') }}</el-button>
            </el-upload>
            <el-form-item :label="$t('loginByKeyStore.password')" prop="keyStorePass">
                <el-input type="password" v-model="keyStorePass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align:center">
                <el-button @click="login()" type="primary" style="width:120px;">{{ $t('loginByKeyStore.import') }}</el-button>
            </el-form-item>
        </el-form>
        <a @click="$parent.backToStart()" class="backToStartBtn">{{ $t('loginByPrivateKey.backToStart') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginByKeyStoreForm',
  data () {
    return {
        fileList: [],           //当前文件
        keyStoreContent: '',        //KeyStore内容
        keyStorePass: ""            //KeyStore密码
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    handleChange(file, fileList) {          //获取上传的文件信息
        var _this = this;
        if (file.raw) {                    
            let reader = new FileReader()  
            reader.onload = function (e) {
                _this.keyStoreContent = JSON.parse(e.target.result);
                if(_this.keyStoreContent.address.length !== 40){
                    _this.$notify.error({
                        title: _this.$t('loginByKeyStore.callback-1'),
                        dangerouslyUseHTMLString: true,
                        message: _this.$t('loginByKeyStore.callback-2'),
                        duration: 3000
                    });
                    _this.keyStoreContent = "";
                }
            };
            reader.readAsText(file.raw,'gb2312');
        }
    },
    login() {                     //登录方法
        if(this.keyStoreContent == ''){
            this.$notify.error({
                title: this.$t('loginByKeyStore.callback-3'),
                dangerouslyUseHTMLString: true,
                message: this.$t('loginByKeyStore.callback-4'),
                duration: 3000
            });
            return false;
        } else if (this.keyStorePass == ''){
            this.$notify.error({
                title: this.$t('loginByKeyStore.callback-5'),
                dangerouslyUseHTMLString: true,
                message: this.$t('loginByKeyStore.callback-6'),
                duration: 3000
            });
            return false;
        }
        let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.loginByKeyStoreContentBox')
        });
        let _this = this;
        setTimeout(function () {
            _this.loginByKeyStore();
            loading.close();
        }, 2000);
    },
    loginByKeyStore() {              //解锁Ketstore
        let decryptPK;
        try {
            decryptPK = web3.eth.accounts.decrypt(this.keyStoreContent, this.keyStorePass);
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
        let privateKey = privateKey1.toString('hex')
        // console.log(privateKey);

        let address = web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address;
        address = web3.utils.toChecksumAddress(address);        //转化为校验和地址
        //console.log(address);

        if(web3.utils.checkAddressChecksum(address)){
            this.$store.state.vuexStore.walletInfo.keyStore = this.keyStoreContent;
            // this.$store.state.vuexStore.walletInfo.publicKey = privateKey2PublicKey(privateKey).toString('hex');   //存入publicKey
            // console.log(this.$store.state.vuexStore.walletInfo.publicKey);
            this.$store.state.vuexStore.walletInfo.address = address;       //存入地址
            // console.log(this.$store.state.vuexStore.walletInfo.address);
            this.$store.state.vuexStore.isLogin = true;
            this.$notify({
                title: this.$t('loginByKeyStore.callback-10'),
                dangerouslyUseHTMLString: true,
                message: this.$t('loginByKeyStore.callback-11'),
                duration: 3000,
                type: 'success'
            });
            this.$router.push('/');         //跳转到首页
            this.$store.state.vuexStore.activeNavIndex = "1-1";
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginByKeyStoreForm{
    float: left;
    height: calc(100% - 106px);
    width: 100%;
    overflow: hidden;
}
.headBox{
    height: 56px;
    width: 100%;
    background-color: rgb(67, 74, 80);
}
.contentBox{
    height: calc(100% - 106px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
h2{
    margin: 0;
    font-size: 24px;
}
.upload-demo{
    height: 78px;
}
.fullPage{
    width: 100% !important;
}
</style>
