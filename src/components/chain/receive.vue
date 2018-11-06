<template>
  <div class="receiveForm">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('receive.title') }}</h2>
        <hr/>
        <div class="QRCodeBox QRCodeBox-white">
            <qriously :value="walletInfo.address" level="H" :size="210" />
            <p>{{ $t('receive.receiveAddressQRCode') }}</p>
        </div>
        <hr/>
        <p>{{ $t('receive.receiveAddress') }}</p>
        <h3 id="receiveAddress">{{ walletInfo.address }}</h3>
        <div style="text-align:center;">
            <el-button data-clipboard-target="#receiveAddress" @click="copyfun()" type="primary" class="btncopy">{{ $t('receive.copy') }}</el-button>
        </div>
 
                <!-- <el-form v-if="!isPaymentCodeBoxShow" :model="paymentCodeForm" status-icon :rules="paymentCodeRules" ref="paymentCodeForm" label-width="82px" class="demo-ruleForm" style="text-align:center;">
                    <el-form-item :label="$t('receive.amount')" prop="amount">
                        <el-input type="number" v-model.number="paymentCodeForm.amount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('receive.assetType')" prop="assetType" >
                        <el-select v-model="paymentCodeForm.assetType" :placeholder="$t('receive.chooseAssetType')" style="width:100%;">
                        <el-option label="TNC" value="TNC"></el-option>
                        <el-option label="ETH" value="ETH"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="createPaymentCode()">{{ $t('receive.create') }}</el-button>
                </el-form>
                <div v-if="isPaymentCodeBoxShow">
                    <el-button @click="resetForm('ruleForm')">{{ $t('receive.reset') }}</el-button>
                    <div class="QRCodeBox QRCodeBox-white">
                        <h3>{{ $t('receive.receiveCode') }}</h3>
                        <qriously :value="paymentCodeForm.Code" level="H" :size="210" />
                        <p style="width: 378px;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;">{{ paymentCodeForm.Code }}</p>
                    </div>
                    <el-input id="receivePaymentCode" placeholder="Receive Payment Code" v-model="paymentCodeForm.Code">
                        <el-button class="btncopy" data-clipboard-target="#receivePaymentCode" @click="copyfun()" slot="append" icon="el-icon-search">{{ $t('receive.copy') }}</el-button>
                    </el-input>
                </div> -->

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'
import headBox from './../common/headBoxForChild'

Vue.use(VueQriously)

export default {
  name: 'receiveForm',
  data () {
    var checkAmount = (rule, value, callback) => {
      if (!value) {
          return callback(new Error('金额不能为空'));
        }
        if (value < 0) {
           callback(new Error('请输入正确的数字值'));
        }  else {
           callback();
        }
    };
    var checkAssetType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择资产类型'));
        } else {
          callback();
        }
    };
    return {
      paymentCodeForm: {
        amount: '',
        assetType: '',
        assetContractAddress: '',
        selfUri: '',
        R: '',
        Hr: '',
        Code: ''
      },
      paymentCodeRules: {
        amount: [
            { validator: checkAmount, trigger: 'blur' }
        ],
        assetType: [
            { validator: checkAssetType, trigger: 'change' }
        ]
      },
      isPaymentCodeBoxShow: false         //显示PaymentCodeBox
    };
  },
  components: {
    headBox
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  computed: {
    walletInfo() {                       //获取vuex中的address赋值给address
      if(this.$store.state.vuexStore.baseChain == "ETH"){
          return this.$store.state.vuexStore.walletInfo;
      } else if(this.$store.state.vuexStore.baseChain == "NEO"){
          return this.$store.state.vuexStore.NEOwalletInfo;
      }
    }
  },
  methods: {
    copyfun (){			//copy
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
    // createPaymentCode() {
    //     let _this = this;
    //     _this.$refs['paymentCodeForm'].validate((valid) => {
    //       if (valid) {
    //         console.log('submit!');
    //         if(_this.paymentCodeForm.assetType == "TNC"){
    //             _this.paymentCodeForm.assetContractAddress = _this.$store.state.vuexStore.tncContractAddress;
    //         } else if (_this.paymentCodeForm.assetType == "ETH"){
    //             _this.paymentCodeForm.assetContractAddress = "";
    //         } else {
    //             _this.$notify.info({
    //                 title: '警告',
    //                 dangerouslyUseHTMLString: true,
    //                 message: '资产类型出错',
    //                 duration: 3000,
    //                 type: 'warning'
    //             });
    //             return false;
    //         }
    //         //_this.paymentCodeForm.R = web3.utils.randomHex(32);                              //调用web3生成的位数有BUG,弃用
    //         _this.paymentCodeForm.R = randomBytes(32);                                         //随机生成指定位数
    //         console.log(_this.paymentCodeForm.R);
    //         _this.paymentCodeForm.Hr = web3.utils.keccak256(_this.paymentCodeForm.R);          //sha3 Hash
    //         console.log(_this.paymentCodeForm.Hr);
    //         _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
    //             if(data.State == 3 && data.assetType == _this.paymentCodeForm.assetType){
    //                 _this.paymentCodeForm.selfUri = data.SelfUri;
    //             }
    //         })
    //         if(_this.paymentCodeForm.selfUri == ''){
    //             _this.$notify.info({
    //                 title: '警告',
    //                 dangerouslyUseHTMLString: true,
    //                 message: '没有该资产类型的通道',
    //                 duration: 3000,
    //                 type: 'warning'
    //             });
    //             return false;
    //         }
    //         let PaymentCode = _this.paymentCodeForm.selfUri + "&" +  _this.$store.state.vuexStore.NetMagic + "&" + _this.paymentCodeForm.Hr + "&" + _this.paymentCodeForm.assetType + "&" + (_this.paymentCodeForm.amount).mul(10e7) + "&" + "PaymentCode";
    //         console.log(PaymentCode);
    //         _this.paymentCodeForm.Code = "TN" + base58encode(PaymentCode);
    //         console.log(_this.paymentCodeForm.Code);
    //         _this.isPaymentCodeBoxShow = true;
    //         let Message = {
    //             "Hr": _this.paymentCodeForm.Hr,
    //             "R": _this.paymentCodeForm.R
    //         }
    //         _this.$store.state.vuexStore.RList.push(Message);
    //         _this.$parent.StoreData("RList");
    //       } else {
    //         console.log('error submit!!');
    //         return false;
    //       }
    //     });
    // },
    // resetForm() {
    //     this.isPaymentCodeBoxShow = false;
    //     this.paymentCodeForm = {
    //     amount: '',
    //     assetType: '',
    //     selfUri: '',
    //     R: '',
    //     Hr: '',
    //     Code: ''
    //   }
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.receiveForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
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
    height: calc(100% - 44px);;
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
}
.QRCodeBox{
    padding: 8px 16px;
    border-radius: 4px;
    /* margin: 20px 0; */
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}
.QRCodeBox h3{
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    /* color: #f56c6c; */
    /* border-bottom: 1px solid #CCCCCC; */
}
.QRCodeBox p{
    font-size: 16px;
}
h3{
    font-size: 17px;
    font-weight: 400;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
.btncopy{
    width: 80%;
}
/* 手机端改变某些字体大小 */
@media screen and (max-width: 450px) {
    .QRCodeBox p{
        font-size: 12px;
    }
}
</style>
