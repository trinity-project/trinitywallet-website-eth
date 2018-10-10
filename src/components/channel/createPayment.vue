<template>
  <div class="descoverForm">
    <headBox/>
    <div class="contentBox">
        <el-button @click="resetForm('ruleForm')" size="mini" style="font-size:12px;float:right;">{{ $t('receive.reset') }}</el-button>
        <h2 class="title_h2">创建收款码</h2>
        <hr/>
        <div v-if="!isPaymentCodeBoxShow">
            <el-form :model="paymentCodeForm" status-icon :rules="paymentCodeRules" ref="paymentCodeForm" label-width="80px" label-position="top" class="demo-ruleForm">
                <el-form-item :label="$t('receive.amount')" prop="amount">
                    <el-input type="number" v-model.number="paymentCodeForm.amount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('receive.assetType')" prop="assetType" >
                    <el-select v-model="paymentCodeForm.assetType" :placeholder="$t('receive.chooseAssetType')" style="width:100%;">
                    <el-option label="TNC" value="TNC"></el-option>
                    <el-option label="ETH" value="ETH"></el-option>
                    </el-select>
                </el-form-item>
                <div style="text-align:center;">
                    <el-button type="primary" @click="createPaymentCode()">{{ $t('receive.create') }}</el-button>
                </div>
                
            </el-form>
        </div>
        <div v-else>
            <div class="QRCodeBox QRCodeBox-white">
                <qriously :value="paymentCodeForm.Code" level="H" :size="244" style="zoom: 0.76;"/>
                <p style="margin-top: 22px;">{{ $t('receive.receiveCode') }}</p>
            </div>
            <hr/>
            <p>收款码</p>
            <h3 id="receivePaymentCode">{{ paymentCodeForm.Code }}</h3>
            <div style="text-align:center;">
                <el-button data-clipboard-target="#receivePaymentCode" @click="copyfun()" type="primary" class="btncopy">{{ $t('receive.copy') }}</el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
import VueQriously from 'vue-qriously'
export default {
  name: 'descoverForm',
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
  filters:{

  },
  components: {
    headBox
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
    createPaymentCode() {
        let _this = this;
        _this.$refs['paymentCodeForm'].validate((valid) => {
          if (valid) {
            console.log('submit!');
            if(_this.paymentCodeForm.assetType == "TNC"){
                _this.paymentCodeForm.assetContractAddress = _this.$store.state.vuexStore.tncContractAddress;
            } else if (_this.paymentCodeForm.assetType == "ETH"){
                _this.paymentCodeForm.assetContractAddress = "";
            } else {
                _this.$notify.info({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '资产类型出错',
                    duration: 3000,
                    type: 'warning'
                });
                return false;
            }
            //_this.paymentCodeForm.R = web3.utils.randomHex(32);                              //调用web3生成的位数有BUG,弃用
            _this.paymentCodeForm.R = randomBytes(32);                                         //随机生成指定位数
            console.log(_this.paymentCodeForm.R);
            _this.paymentCodeForm.Hr = web3.utils.keccak256(_this.paymentCodeForm.R);          //sha3 Hash
            console.log(_this.paymentCodeForm.Hr);
            _this.$store.state.vuexStore.channelList.forEach(function(data,index){   //遍历
                if(data.State == 3 && data.assetType == _this.paymentCodeForm.assetType){
                    _this.paymentCodeForm.selfUri = data.SelfUri;
                }
            })
            if(_this.paymentCodeForm.selfUri == ''){
                _this.$notify.info({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '没有该资产类型的通道',
                    duration: 3000,
                    type: 'warning'
                });
                return false;
            }
            let PaymentCode = _this.paymentCodeForm.selfUri + "&" +  _this.$store.state.vuexStore.NetMagic + "&" + _this.paymentCodeForm.Hr + "&" + _this.paymentCodeForm.assetType + "&" + (_this.paymentCodeForm.amount).mul(10e7) + "&" + "PaymentCode";
            console.log(PaymentCode);
            _this.paymentCodeForm.Code = "TN" + base58encode(PaymentCode);
            console.log(_this.paymentCodeForm.Code);
            _this.isPaymentCodeBoxShow = true;
            let Message = {
                "Hr": _this.paymentCodeForm.Hr,
                "R": _this.paymentCodeForm.R
            }
            _this.$store.state.vuexStore.RList.push(Message);
            _this.$parent.$parent.StoreData("RList");
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm() {
        this.isPaymentCodeBoxShow = false;
        this.paymentCodeForm = {
        amount: '',
        assetType: '',
        selfUri: '',
        R: '',
        Hr: '',
        Code: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.descoverForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
}

.contentBox{
    height: calc(100% - 56px);
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
.QRCodeBox{
    padding: 20px 16px 10px;
    border-radius: 4px;
    /* margin: 20px 0; */
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}
h3{
    font-size: 13px;
    font-weight: 400;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
.btncopy{
    width: 180px;
}
</style>
