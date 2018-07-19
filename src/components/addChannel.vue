<template>
  <div class="addChannelBox">
    <div class="headBox"></div>
    <div class="contentBox">
        <h2>添加通道</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-form :model="ruleForm2" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="addChannelForm">
          <el-form-item label="对端URI" prop="uri">
            <el-input v-model="ruleForm2.uri" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetType">
            <el-select v-model="ruleForm2.assetType" placeholder="请选择活动区域" style="width:100%;">
              <el-option label="TNC" value="TNC"></el-option>
              <el-option label="ETH" value="ETH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="押金" prop="deposit">
            <el-input v-model.number="ruleForm2.deposit"></el-input>
          </el-form-item>
          <el-form-item label="通道名称" prop="alice">
            <el-input v-model="ruleForm2.alice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addChannelForm',
  data () {
    var checkUri = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('对端URI不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var checkAssetType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择资产类型'));
      } else {
        callback();
      }
    };
    var checkDeposit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('押金数量不能为空'));
      } else {
        if (value <= 0) {
          callback(new Error('押金数量必须大于0'));
        } else {
          callback();
        }
      }
    };
    var checkAlice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入名称'));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        uri: '',
        assetType: '',
        deposit: '',
        alice: ''
      },
      rules: {
        uri: [
          { validator: checkUri, trigger: 'blur' }
        ],
        assetType: [
          { validator: checkAssetType, trigger: 'blur' }
        ],
        deposit: [
          { validator: checkDeposit, trigger: 'blur' }
        ],
        alice: [
          { validator: checkAlice, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addChannelBox{
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
.contentBox .addChannelForm{
    width:100%;
    max-width: 400px; 
}
h2{
    margin: 0;
}
</style>
