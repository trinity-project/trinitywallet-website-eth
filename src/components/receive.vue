<template>
  <div class="receiveForm">
    <div class="contentBox">
        <h2>收款</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-tabs type="border-card" style="width: 100%;max-width: 440px;">
            <el-tab-pane label="链上">
                <div class="tipBox tipBox-white">
                    <h3>收款地址</h3>
                    <qriously :value="this.$store.state.vuexStore.walletInfo.address" level="H" :size="210" />
                    <p v-text="this.$store.state.vuexStore.walletInfo.address"></p>
                </div>
                <el-input id="receiveAddress" placeholder="Address" v-model="this.$store.state.vuexStore.walletInfo.address">
                    <el-button class="btncopy" data-clipboard-target="#receiveAddress" @click="copyfun()" slot="append" icon="el-icon-share">Copy</el-button>
                </el-input>
            </el-tab-pane>
            <el-tab-pane label="通道">
                <el-form v-if="!isPaymentCodeBoxShow" :model="paymentCodeForm" status-icon :rules="paymentCodeRules" ref="paymentCodeForm" label-width="80px" class="demo-ruleForm" style="text-align:center;">
                    <el-form-item label="金额" prop="amount">
                        <el-input type="number" v-model.number="paymentCodeForm.amount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="资产类型" prop="assetType" >
                        <el-select v-model="paymentCodeForm.assetType" placeholder="请选择资产类型" style="width:100%;">
                        <el-option label="TNC" value="TNC"></el-option>
                        <el-option label="ETH" value="ETH"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="createPaymentCode()">创建</el-button>
                </el-form>
                <div v-if="isPaymentCodeBoxShow">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <div class="tipBox tipBox-white">
                        <h3>收款码</h3>
                        <qriously :value="paymentCodeForm.Code" level="H" :size="210" />
                        <p style="width: 378px;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;">{{ paymentCodeForm.Code }}</p>
                    </div>
                    <el-input id="receivePaymentCode" placeholder="Receive Payment Code" v-model="paymentCodeForm.Code">
                        <el-button class="btncopy" data-clipboard-target="#receivePaymentCode" @click="copyfun()" slot="append" icon="el-icon-search">Copy</el-button>
                    </el-input>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'

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
      paymentCode:"APWDCZ6SY2VgPV37EKbrkYD6XwjVaa8u8B",
      paymentCodeForm: {
        amount: '',
        assetType: '',
        selfUrl: '0x23cca051BfedB5e17d3AAD2038Ba0a5155d1B1b7@10.10.10.5:8089',
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
  watch: {

  },
  mounted() {
    this.$nextTick(function(){

    })
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
        this.$refs['paymentCodeForm'].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.paymentCodeForm.R = createR();
            this.paymentCodeForm.Hr = createHr(this.paymentCodeForm.R);
            let PaymentCode = this.paymentCodeForm.selfUrl + "&" + this.paymentCodeForm.Hr + "&" + this.paymentCodeForm.assetType + "&" + this.paymentCodeForm.Amount + "&" + this.paymentCodeForm.Amount + this.paymentCodeForm.assetType;
            console.log(PaymentCode);
            this.paymentCodeForm.Code = "TN" + base58encode(PaymentCode);
            console.log(this.paymentCodeForm.Code);
            this.isPaymentCodeBoxShow = true;
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
        selfUrl: '',
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
.receiveForm{
    float: left;
    height: calc(100vh - 106px);
    width: calc(100% - 300px);
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
.tipBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}
.tipBox-white{
    background-color: #F2F6FC;
}
.tipBox h3{
    display: inline-block;
    /* margin: 14px 0 0 0; */
    font-weight: 400;
    /* color: #f56c6c; */
    /* border-bottom: 1px solid #CCCCCC; */
}
</style>
