<template>
  <div class="contactBox">
    <div class="headBox"></div>
    <div class="contentBox">
        <h2>我的联系人</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-button @click="centerDialogVisible = true" style="margin:10px 0;" type="primary" icon="el-icon-plus" plain>添加联系人</el-button>
        <!-- <h3>你还没有联系人</h3> -->
        <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button type="success" plain @click="toggleSelection()">转账</el-button>
            <el-button type="danger" plain @click="DeltableData()">删除</el-button>
            <el-button plain @click="toggleSelection()">取消选择</el-button>
        </div>
    </div>
    <el-dialog title="添加联系人" :visible.sync="centerDialogVisible" width="40%" center>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="50px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm2.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm2.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'contactBox',
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('姓名不能为空'));
      } else {
        callback();
      }
    };
    var checkAddress = (rule, value, callback) => {
      let _this = this;
      let flag = false;
      _this.tableData3.forEach(function(data,index){
        if(data.address === value){
          flag = true;
        }
      })
      if (value === '') {
        callback(new Error('地址不能为空'));
      } else {
        if(value.length !== 42) {
          callback(new Error('地址检测错误'));
        } else if(flag){
          callback(new Error('地址已经存在'));
        } else {
          callback();
        }
      }
    };
    return {
      tableData3: [{
        name: '王小虎',
        address: '0xEcbA79761bcAEbc16ee45E5979376E471b28795E'
      }, {
        name: '王小虎',
        address: '0xEcbA7976BbcAEb316ee45E5979376E471b28795E'
      }, {
        name: '王小虎',
        address: '0xEcbA7976BbcAEbc16ee45E1979376E471b28795E'
      }, {
        name: '王小虎',
        address: '0xEBbA7976BbcAEbc16ee45E5979376E471b28795E'
      }],
      multipleSelection: [],
      centerDialogVisible: false,
      ruleForm2: {
        name: '',
        address: ''
      },
      rules2: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        address: [
          { validator: checkAddress, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let message = {
            name: this.ruleForm2.name,
            address: this.ruleForm2.address
          };
          this.tableData3.push(message);
          this.centerDialogVisible = false;
          this.$message({
            showClose: true,
            message: '添加联系人成功',
            type: 'success'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    DeltableData() { 
      let _this = this;
      _this.multipleSelection.forEach(function(data,index1){
        _this.tableData3.forEach(function(val,index2){
          if(val.address === data.address){
            _this.tableData3.splice(index2,1);
          }
        })
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contactBox{
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
h3{
    text-align: center;
}

</style>
