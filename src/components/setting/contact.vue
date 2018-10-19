<template>
  <div class="contactBox">
    <headBox/>
    <div class="contentBox">
        <h2 class="title_h2">{{ $t('contact.title') }}</h2>
        <hr/>
        <el-button @click="centerDialogVisible = true" style="margin:10px 0;" type="primary" icon="el-icon-plus" plain>{{ $t('contact.addContact') }}</el-button>
        <el-table ref="multipleTable" :data="contactList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="name" :label="$t('contact.name')" width="120">
            </el-table-column>
            <el-table-column prop="address" :label="$t('contact.address')">
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button :disabled="multipleSelection.length != 1" type="success" plain @click="transfer()">{{ $t('contact.transfer') }}</el-button>
            <el-button type="danger" plain @click="DeltableData()">{{ $t('contact.delete') }}</el-button>
            <el-button plain @click="toggleSelection()">{{ $t('contact.cancelSelection') }}</el-button>
        </div>
    </div>
    <el-dialog :title="$t('contact.addContact')" :visible.sync="centerDialogVisible" width="40%" center :modal-append-to-body='false'>
      <el-form :model="addContactForm" status-icon :rules="addContactRules" ref="addContactForm" label-width="70px" class="demo-ruleForm">
        <el-form-item :label="$t('contact.name')" prop="name">
          <el-input v-model="addContactForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('contact.address')" prop="address">
          <el-input v-model="addContactForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addContact()">{{ $t('contact.add') }}</el-button>
        <el-button @click="centerDialogVisible = false">{{ $t('contact.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'contactBox',
  data () {
    var checkName = (rule, value, callback) => {      //contact 名字输入规则
      if (value === '') {
        return callback(new Error(this.$t('contact.callback-1')));
      } else {
        callback();
      }
    };
    var checkAddress = (rule, value, callback) => {     //contact 地址输入规则
      let _this = this;
      let flag = false;
      _this.$store.state.vuexStore.contactList.forEach(function(data,index){
        if(data.address === value){
          flag = true;
        }
      })
      if (value === '') {
        callback(new Error(this.$t('contact.callback-2')));
      } else {
        if(value.length !== 42) {
          callback(new Error(this.$t('contact.callback-3')));
        } else if(flag){
          callback(new Error(this.$t('contact.callback-4')));
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
      addContactRules: {      //contact 输入规则
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        address: [
          { validator: checkAddress, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    headBox
  },
  mounted() {
    this.$nextTick(function(){        //加载时判断是否登录,如登录则获取contactList
      if(!this.$store.state.vuexStore.isLogin){
        this.$router.push('/start');
      } else {
        this.contactList = this.$store.state.vuexStore.contactList;
      }
    })
  },
  methods: {
    toggleSelection(rows) {       //取消选择
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    handleSelectionChange(val) {      //选中改变事件
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
          this.$notify({                 //消息提醒
              title: this.$t('common.success'),
              dangerouslyUseHTMLString: true,
              message: this.$t('contact.callback-5'),
              duration: 3000,
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
    height: calc(100% - 56px);
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
h3{
    text-align: center;
}
.fullPage{
    width: 100% !important;
}
</style>
