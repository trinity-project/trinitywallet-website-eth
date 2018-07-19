<template>
  <div class="receiveForm">
    <div class="headBox"></div>
    <div class="contentBox">
        <h2>收款</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-tabs type="border-card" style="width: 100%;max-width: 400px;">
            <el-tab-pane label="链上">
                <div class="tipBox tipBox-white">
                    <h3>收款地址</h3>
                    <qriously :value="Address" level="H" :size="200" />
                    <p>{{ Address }}</p>
                </div>
                <el-input id="receiveAddress" placeholder="Address" v-model="Address">
                    <el-button class="btncopy" data-clipboard-target="#receiveAddress" @click="copyfun()" slot="append" icon="el-icon-search">Copy</el-button>
                </el-input>
            </el-tab-pane>
            <el-tab-pane label="通道">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" style="text-align:center;">
                    <el-form-item label="金额" prop="amount">
                        <el-input type="number" v-model.number="ruleForm.amount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="资产类型" prop="assetType" >
                        <el-select v-model="ruleForm.assetType" placeholder="请选择资产类型" style="width:100%;">
                        <el-option label="TNC" value="TNC"></el-option>
                        <el-option label="ETH" value="ETH"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form>
                <div>
                    <el-button @click="submitForm('ruleForm')">重置</el-button>
                    <div class="tipBox tipBox-white">
                        <h3>收款地址</h3>
                        <qriously :value="Address" level="H" :size="200" />
                        <p>{{ Address }}</p>
                    </div>
                    <el-input id="receiveAddress" placeholder="Address" v-model="Address">
                        <el-button class="btncopy" data-clipboard-target="#receiveAddress" @click="copyfun()" slot="append" icon="el-icon-search">Copy</el-button>
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
        if (!Number.isInteger(value)) {
           callback(new Error('请输入数字值'));
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
      Address:"APWDCZ6SY2VgPV37EKbrkYD6XwjVaa8u8B",
      ruleForm: {
        amount: '',
        assetType: ''
      },
      rules: {
        amount: [
            { validator: checkAmount, trigger: 'blur' }
        ],
        assetType: [
            { validator: checkAssetType, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    copyfun (){			//copy
        let _this = this;
        var clipboard = new ClipboardJS('.btncopy');
        clipboard.on('success', function(e) {   //成功回调 
            _this.$message({
                showClose: true,
                message: '复制成功'
            });
        });
        clipboard.on('error', function(e) {     //失败回调
            _this.$message({
                showClose: true,
                message: '浏览器不支持'
            });
        });
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
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
.receiveForm{
    float: left;
    height: calc(100vh - 50px);
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
.btnBox{
    width: 100%;
    max-width: 400px;
    text-align:center;
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
