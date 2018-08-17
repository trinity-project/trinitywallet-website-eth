<template>
  <div class="channelListForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <div>
            <router-link to="/addChannel" style="float:right">
                <el-button size="mini" icon="el-icon-plus" type="primary">{{ $t('channelList.addChannel') }}</el-button>
            </router-link>
            <h2>{{ $t('channelList.title') }}</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul v-if="channelList.length">
            <li @click="showChannelInfo(data,index)" v-for="(data,index) in channelList" :key="index">
                <h3>{{ data.Alice }}</h3><br>
                <p>{{ data.date | formatDateTime }}</p>
                <p v-if="data.isConnect" style="min-width: 180px;">State：{{ data.State | formatStatus }}</p>
                <p v-if="!data.isConnect" style="min-width: 180px;">State：NotConnect</p>
                <span>{{ data.SelfBalance | formatBalance }}<sup>{{ data.assetType }}</sup></span>
            </li>
        </ul>
        <p v-if="!channelList.length" style="text-align:center;margin-top:20vh;font-size: 14px;color: #5e6d82;line-height: 1.5em;font-weight: 400;">
            {{ $t('channelList.noChannel') }}
        </p>
    </div>
    <el-dialog class="channelInfoBox" :title="activeInfo.Alice" :visible.sync="isChannelInfoBoxShow" width="30%" center :modal-append-to-body='false'>
        <span>{{ $t('channelList.channelName') }}：{{ activeInfo.ChannelName }}</span>
        <span>{{ $t('channelList.date') }}：{{ activeInfo.date | formatDateTime }}</span>
        <span>{{ $t('channelList.selfUri') }}：{{ activeInfo.SelfUri }}</span>
        <span>{{ $t('channelList.selfBalance') }}：{{ activeInfo.SelfBalance | formatBalance }}{{ activeInfo.assetType }}</span>
        <span>{{ $t('channelList.otherUri') }}：{{ activeInfo.OtherUri }}</span>
        <span>{{ $t('channelList.otherBalance') }}：{{ activeInfo.OtherBalance | formatBalance }}{{ activeInfo.assetType }}</span>
        <span>{{ $t('channelList.channelState') }}：{{ activeInfo.State | formatStatus }}</span>
        <span>{{ $t('channelList.isConnect') }}：{{ activeInfo.isConnect | formatConnect }}</span>
        <span>{{ $t('channelList.isTestNet') }}：{{ activeInfo.isTestNet | formatNet}}</span>
        <span v-if="!isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <el-button @click="showConfirmCloseChannelData()" type="danger"> {{ $t('channelList.closeChannel') }} </el-button>
        </span>
        <span v-if="isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <el-form :model="activeInfo" status-icon :rules="confirmCloseRules" ref="activeInfo" label-width="80px" class="demo-ruleForm">
                <el-form-item :label="$t('channelList.password')" prop="keyStorePass">
                    <el-input v-model="activeInfo.keyStorePass" :placeholder="$t('channelList.inputPassword')" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;margin-left: -80px;">
                    <el-button @click="closeChannel()" type="danger"> {{ $t('channelList.confirm') }} </el-button>
                    <el-button @click="isChannelInfoBoxShow = false;isConfirmCloseChannel = false;"> {{ $t('channelList.cancel') }} </el-button>
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
  computed:{
      channelList() {
          return this.$store.state.vuexStore.channelList;
      }
  },
  filters:{
    formatStatus:function(val){         //格式化Channel状态
      let x;
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
    formatBalance:function(val) {          //格式化余额
        let result;
        if(val < 0 || isNaN(val)){
            result = "error"; 
        } else {
            result = val / 10e7;
        }
        return result;
    },
    formatDateTime:function(val) {          //格式化时间戳
        let date = new Date();
        date.setTime(val);
        let yy = date.getFullYear();    
        let mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        let dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    },
    formatConnect:function(val) {          //格式化连接状态
        let result;
        if(val){
            result = "已连接";
        } else {
            result = "未连接";
        }
        return result;
    },
    formatNet:function(val) {          //格式化网络
        let result;
        if(val){
            result = "测试网";
        } else {
            result = "主网";
        }
        return result;
    }
  },
  mounted() {
    this.$nextTick(function(){      //首次加载时判断是否登录，是否为夜间模式,连接至全节点
        if(this.$store.state.vuexStore.channelList.length == 0){
            this.$router.push('/addChannel');
        }
    })
  },
  watch: {
    '$store.state.vuexStore.walletInfo.channelList': 'getAddressInfo'            // 监测store中的channelList,出现变化时获取相关信息
  },
  methods: {
    showChannelInfo(data,index) {             //查看通道信息
        this.isChannelInfoBoxShow = true;
        this.activeInfo = data;
        this.activeInfo.keyStorePass = "";
        console.log(index);
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
            if(l === -1){             //如果未检测到通道,给出提醒
                _this.$notify.error({
                    title: '警告',
                    dangerouslyUseHTMLString: true,
                    message: '未找到该通道,请重试一次',
                    duration: 3000
                });
                return;
            } else {
                console.log(_this.$store.state.vuexStore.channelList[l].isConnect);
                if(_this.$store.state.vuexStore.channelList[l].isConnect == true){          //如果为连接状态,进入快速拆通道
                    let txData = web3.utils.soliditySha3(         //生成代签名交易数据
                    {t: 'bytes32', v: _this.activeInfo.ChannelName},    //通道名称
                    {t: 'uint256', v: 4294967295},                                   //TXnonce
                    {t: 'address', v: _this.$store.state.vuexStore.walletInfo.address},       //本端地址
                    {t: 'uint256', v: _this.activeInfo.SelfBalance},       //本端押金
                    {t: 'address', v: _this.activeInfo.OtherUri.split("@")[0]},                                  //对端地址
                    {t: 'uint256', v: _this.activeInfo.OtherBalance}       //对端押金
                    );
                    console.log(txData);

                    let decryptPK = _this.$parent.decryptPrivateKey(_this.$store.state.vuexStore.walletInfo.keyStore,_this.activeInfo.keyStorePass);        //解锁钱包用于签名          
                    let selfSignedData = ecSign(txData,decryptPK.privateKey);         //签名
                    console.log(selfSignedData); 

                    let Message = {
                        "MessageType":"Settle",
                        "Sender": _this.activeInfo.SelfUri,
                        "Receiver": _this.activeInfo.OtherUri,
                        "TxNonce": 4294967295,              //0xFFFFFFFF,暂用
                        "ChannelName": _this.activeInfo.ChannelName,
                        "AssetType": _this.activeInfo.assetType,
                        "NetMagic": _this.$store.state.vuexStore.NetMagic,
                        "MessageBody": {
                            "Commitment": selfSignedData,
                            "SenderBalance": _this.activeInfo.SelfBalance / 10e7,
                            "ReceiverBalance": _this.activeInfo.OtherBalance /10e7
                        },
                        "Comments": {}
                    }
                    _this.$store.state.vuexStore.channelList[l].websock.send(JSON.stringify(Message));        //发送消息
                    _this.$store.state.vuexStore.closeChannelInfo = _this.activeInfo;
                    console.log(_this.$store.state.vuexStore.closeChannelInfo.keyStorePass);
                    _this.$store.state.vuexStore.closeChannelInfo.selfSignedData = selfSignedData;
                    _this.$store.state.vuexStore.channelList[l].State = 1;              //通道状态改为closing
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
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.channelListForm{
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
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    overflow-x: hidden;
}
.contentBox::-webkit-scrollbar {
    display: none;
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
