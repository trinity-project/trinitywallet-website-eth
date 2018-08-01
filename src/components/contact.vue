<template>
  <div class="contactBox" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <h2>我的联系人</h2>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <el-button @click="centerDialogVisible = true" style="margin:10px 0;" type="primary" icon="el-icon-plus" plain>添加联系人</el-button>
        <!-- <h3>你还没有联系人</h3> -->
        <el-table ref="multipleTable" :data="contactList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button :disabled="multipleSelection.length != 1" type="success" plain @click="transfer()">转账</el-button>
            <el-button type="danger" plain @click="DeltableData()">删除</el-button>
            <el-button plain @click="toggleSelection()">取消选择</el-button>
        </div>
    </div>
    <el-dialog title="添加联系人" :visible.sync="centerDialogVisible" width="40%" center :modal-append-to-body='false'>
      <el-form :model="addContactForm" status-icon :rules="addContactRules" ref="addContactForm" label-width="50px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addContactForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addContactForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addContact()">添加</el-button>
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
      _this.$store.state.vuexStore.contactList.forEach(function(data,index){
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
      contactList: [],
      multipleSelection: [],
      centerDialogVisible: false,
      addContactForm: {
        name: '',
        address: ''
      },
      addContactRules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        address: [
          { validator: checkAddress, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(function(){
      if(!this.$store.state.vuexStore.isLogin){
        this.$router.push('/start');
      } else {
        this.contactList = this.$store.state.vuexStore.contactList;
      }
    })
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
    addContact() {    //添加联系人
      this.$refs['addContactForm'].validate((valid) => {
        if (valid) {
          let message = {
            name: this.addContactForm.name,
            address: this.addContactForm.address
          };
          this.$store.state.vuexStore.contactList.push(message);
          this.saveAsArray(this.$store.state.vuexStore.walletInfo.address + "@contactList",this.$store.state.vuexStore.contactList);
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
    DeltableData() {    //删除选中的数据
      let _this = this;
      _this.multipleSelection.forEach(function(data,index1){
        _this.$store.state.vuexStore.contactList.forEach(function(val,index2){
          if(val.address === data.address){
            _this.$store.state.vuexStore.contactList.splice(index2,1);
          }
        })
        _this.saveAsArray(_this.$store.state.vuexStore.walletInfo.address + "@contactList",_this.$store.state.vuexStore.contactList);
      })
    },
    transfer() {    //传递address参数到index页面
      let address = this.multipleSelection[0].address;
      this.$store.state.vuexStore.activeNavIndex = '1-1';     //将activeNavIndex转到index页面
      this.$router.push({name: 'index', params: {address: address}});
    },
    saveAsArray:function(key,items){    //以数组，json，boolean等数据格式储存localStorage
      let KEY1 = key.toString();
      window.localStorage.setItem(KEY1,JSON.stringify(items))
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contactBox{
    float: left;
    height: calc(100vh - 106px);
    width: 100%;
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
.fullPage{
    width: 100% !important;
}
</style>
