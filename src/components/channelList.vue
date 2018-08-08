<template>
  <div class="channelListForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <div>
            <router-link to="/addChannel" style="float:right">
                <el-button size="mini" icon="el-icon-plus" type="primary">添加通道</el-button>
            </router-link>
            <h2>通道列表</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul v-if="$store.state.vuexStore.channelList.length">
            <li @click="showChannelInfo(data)" v-for="(data,index) in $store.state.vuexStore.channelList" :key="index">
                <h3>{{ data.Alice }}</h3><br>
                <p>{{ data.date | formatDateTime }}</p>
                <p>State：{{ data.State | formatStatus }}</p>
                <span>{{ data.SelfBalance }}<sup>{{ data.assetType }}</sup></span>
            </li>
        </ul>
        <p v-if="!$store.state.vuexStore.channelList.length" style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
            还没有通道，立即去添加
        </p>
    </div>
    <el-dialog class="channelInfoBox" :title="activeInfo.Alice" :visible.sync="isChannelInfoBoxShow" width="30%" center :modal-append-to-body='false'>
        <span>通道名称：{{ activeInfo.ChannelName }}</span>
        <span>开通时间：{{ activeInfo.date | formatDateTime }}</span>
        <span>本端地址：{{ activeInfo.SelfUri }}</span>
        <span>本端余额：{{ activeInfo.SelfBalance }}{{ activeInfo.assetType }}</span>
        <span>对端地址：{{ activeInfo.OtherUri }}</span>
        <span>对端余额：{{ activeInfo.OtherBalance }}{{ activeInfo.assetType }}</span>
        <span>通道状态：{{ activeInfo.State | formatStatus }}</span>
        <span>是否连接：{{ activeInfo.isConnect }}</span>
        <span>网络：{{ activeInfo.isTestNet }}</span>
        <span v-if="!isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <el-button @click="showConfirmCloseChannelData()" type="danger"> 关闭通道 </el-button>
        </span>
        <span v-if="isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmCloseRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
                <el-form-item label="密码" prop="keyStorePass">
                    <el-input v-model="activeInfo.keyStorePass" placeholder="在此输入密码" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;margin-left: -80px;">
                    <el-button @click="closeChannel()" type="danger"> 确定 </el-button>
                    <el-button @click="isChannelInfoBoxShow = false;isConfirmCloseChannel = false;"> 取消 </el-button>
                </el-form-item>
            </el-form>            
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'channelListForm',
  data () {
    var validatePass = (rule, value, callback) => {         //create 密码输入规则
      if (!value) {
        return callback(new Error('钱包密码不能为空，否则将无法交易'));
      } else {
        let PrivateKey = this.$parent.decryptPrivateKey(this.$store.state.vuexStore.walletInfo.keyStore,this.activeInfo.keyStorePass);
        setTimeout(() => {
            if(PrivateKey){
            callback();
            } else {
            return callback(new Error('钱包解锁失败 - 可能是密码错误'));
            }
        }, 2000);
      }
    };
    return {
        channelList: [{
          date: '1495157126',
          ChannelName: '王小虎',
          balance: '100',
          assetType: 'TNC',
          State: 'Open'
        }, {
          date: '1495157126',
          ChannelName: '王小虎',
          balance: '38',
          assetType: 'ETH',
          State: 'Open'
        }, {
          date: '1495157126',
          ChannelName: '王小虎',
          balance: '27',
          assetType: 'TNC',
          State: 'Open'
        }, {
          date: '1495157126',
          ChannelName: '王小虎',
          balance: '87',
          assetType: 'TNC',
          State: 'Open'
        }],
        isChannelInfoBoxShow: false,        //显示通道信息
        activeInfo:{                    //当前显示通道信息内容
          Alice: '',
          date: '',
          ChannelName: '',
          SelfUri: '',
          SelfBalance: '',
          OtherUri: '',
          OtherBalance: '',
          assetType: '',
          isConnect: '',
          isTestNet: '',
          State: '',
          keyStorePass: ''
        },
        isConfirmCloseChannel: false,            //显示确认关闭通道
        confirmCloseRules: {        //create 输入规则
          keyStorePass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
    }
  },
  filters:{
    formatStatus:function(val){         //格式化Channel状态
      var x;
      switch (val)
      {
      case 1:
        x="Closing";
        break;
      case 2:
        x="Opening";
        break;
      case 3:
        x="Open";
        break;
      default:
        x="Error";
      }
      return x;
    },
    formatDateTime:function(val) {          //格式化时间戳
        var date = new Date();
        date.setTime(val);
        var yy = date.getFullYear();    
        var mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        var dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    }
  },
  methods: {
    showChannelInfo(data) {             //查看通道信息
        this.isChannelInfoBoxShow = true;
        this.activeInfo = data;
        console.log(data);
    },
    showConfirmCloseChannelData() {         //显示确认关闭通道
        this.isConfirmCloseChannel = true;
    },
    closeChannel() {                //关闭通道时间
        let _this = this;
        _this.$refs['activeInfo'].validate((valid) => {
            if (valid) {
            let l = this.$parent.getChannelSerial('ChannelName',_this.activeInfo.ChannelName);
            console.log(l);
            if(l === null){             //如果未检测到通道,给出提醒
                _this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '未找到该通道,请重试一次',
                    duration: 3000
                });
                return;
            } else {
                if(_this.$store.state.vuexStore.channelList[l].isConnect == true){          //如果为连接状态,进入快速拆通道
                    let Message = {
                        "MessageType":"Settle",
                        "Sender": _this.activeInfo.SelfUri,
                        "Receiver": _this.activeInfo.OtherUri,
                        "TxNonce": -1,
                        "ChannelName": _this.activeInfo.ChannelName,
                        "AssetType": _this.activeInfo.assetType,
                        "NetMagic": _this.$store.state.vuexStore.NetMagic,
                        "MessageBody": {
                            "Commitment":"",
                            "SenderBalance": _this.activeInfo.SelfBalance * 10e7,
                            "ReceiverBalance": _this.activeInfo.OtherBalance * 10e7
                        },
                        "Comments": {}
                    }
                    _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送消息
                    _this.$store.state.vuexStore.closeChannelInfo = _this.activeInfo;
                    console.log(_this.$store.state.vuexStore.closeChannelInfo);22
                    _this.isChannelInfoBoxShow = false;
                    _this.isConfirmCloseChannel = false;
                } else {            //如果为未连接状态,进入强制拆通道
                    console.log('进入强制拆通道');
                }
            }
        } else {
            console.log('error submit!!');
            return false;
        }
        this.activeInfo.keyStorePass = '';
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelListForm{
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
    font-weight: normal;
    display: inline-block;
    margin: 0 0 10px 0;
}
ul li{
    border-bottom:1px solid #ebeef5;
    position: relative;
    padding: 12px;
    cursor: pointer;
}
ul li:hover{
    background: #f5f7fa;
}
ul li p{
    display: inline-block;
    margin: 0;
    width: 20%;
    min-width: 100px;
}
ul li span{
    position: absolute;
    font-size: 36px;
    right: 30px;
    top: 50%;
    margin-top: -20px;
}
ul li span sup {
    top: .2em;
    position: absolute;
    font-size: 34%;
}
.channelInfoBox{
    min-width: 420px;
}
.channelInfoBox span{
    display: block;
    margin: 10px 0;
    word-break: break-all;
}
</style>
