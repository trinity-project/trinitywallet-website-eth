<template>
  <div class="channelListForm" :class="{ fullPage: !$store.state.vuexStore.isNavShow }">
    <div class="contentBox">
        <div>
            <router-link to="/addChannel" style="float:right">
                <el-button size="mini" icon="el-icon-plus">添加通道</el-button>
            </router-link>
            <h2>通道列表</h2>
        </div>
        <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" />
        <ul>
            <li @click="showChannelInfo(data)" v-for="(data,index) in channelList" :key="index">
                <h3>{{ data.name }}</h3><br>
                <p>{{ data.date | formatDateTime }}</p>
                <p>State：Open</p>
                <span>{{ data.balance }}<sup>{{ data.assetType }}</sup></span>
            </li>
        </ul>
    </div>
    <el-dialog class="channelInfoBox" title="通道信息" :visible.sync="isChannelInfoBoxShow" width="30%" center :modal-append-to-body='false'>
        <span>通道名称：{{ activeInfo.name }}</span>
        <span>开通时间：{{ activeInfo.date | formatDateTime }}</span>
        <span>余额：{{ activeInfo.balance }}</span>
        <span>通道状态：{{ activeInfo.state }}</span>
        <span>对端地址：{{ activeInfo.name }}</span>
        <span v-if="!isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <el-button @click="showConfirmCloseChannelData()" type="danger"> 关闭通道 </el-button>
        </span>
        <span v-if="isConfirmCloseChannel" slot="footer" class="dialog-footer">
            <span v-if="isConfirmCloseChannel" style="color:#F56C6C">确定关闭通道吗</span>
            <el-button @click="closeChannel()" type="danger"> 确定 </el-button>
            <el-button @click="isChannelInfoBoxShow = false;isConfirmCloseChannel = false;"> 取消 </el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'channelListForm',
  data () {
    return {
        channelList: [{
          date: '1495157126',
          name: '王小虎',
          balance: '100',
          assetType: 'TNC',
          state: 'Open',
          isPay: true
        }, {
          date: '1495157126',
          name: '王小虎',
          balance: '38',
          assetType: 'ETH',
          state: 'Open',
          isPay: true
        }, {
          date: '1495157126',
          name: '王小虎',
          balance: '27',
          assetType: 'TNC',
          state: 'Open',
          isPay: true
        }, {
          date: '1495157126',
          name: '王小虎',
          balance: '87',
          assetType: 'TNC',
          state: 'Open',
          isPay: true
        }],
        isChannelInfoBoxShow: false,
        activeInfo:{
          date: '',
          name: '',
          balance: '',
          state: '',
          isPay: true
        },
        isConfirmCloseChannel: false
    }
  },
  filters:{
    formatStatus:function(val){
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
    formatDateTime:function(val) {
        var date = new Date();
        date.setTime(val * 1000);
        var yy = date.getFullYear();    
        var mm = date.getMonth() + 1;    
        mm = mm < 10 ? ('0' + mm) : mm;    
        var dd = date.getDate();    
        dd = dd < 10 ? ('0' + dd) : dd;   
        return yy + '-' + mm + '-' + dd;    
    }
  },
  methods: {
    showChannelInfo(data) {
        this.isChannelInfoBoxShow = true;
        this.activeInfo = data;
        console.log(data);
    },
    showConfirmCloseChannelData() {
        this.isConfirmCloseChannel = true;
    },
    closeChannel() {
        console.log('关闭通道');
        this.isChannelInfoBoxShow = false;
        this.isConfirmCloseChannel = false;
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
}
</style>
