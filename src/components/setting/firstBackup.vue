<template>
  <div class="firstBackupForm">
    <div class="headBox">
      <div class="header-button is-left">
          <!-- <i @click="$router.push('/wallet')" class="el-icon-ETH-fanhui"></i> -->
      </div>
      <h1></h1>
      <div class="header-button is-right" style="text-align:right;">
      </div>
    </div>
    <div class="contentBox">
        <h2 class="title_h2">{{$t('backup.title')}}</h2>
        <hr/>
        <div class="buttonBox clearfloat">
            <el-row :gutter="20">
                <el-col v-for="(item,index) in buttonBoxData" :key="index" :span="12">
                    <a @click="backup(item.func)" class="button-item">
                        <i :class="item.icon"></i>
                        <p>{{ item.name }}</p>
                    </a>
                </el-col>
            </el-row>
        </div>
        <el-input v-if="mnemonic" id="backupKeyStore" type="textarea" rows="4" v-model="mnemonic" readonly="readonly"></el-input>
        <el-input v-if="privateKey" id="backupPrivateKey" type="textarea" rows="3" v-model="privateKey" readonly="readonly"></el-input>
        <div v-if="!mnemonic && !privateKey" class="tipBox tipBox-red">
            <h3>{{$t('backup.tips')}}</h3>
            <p>{{ $t('backup.tipsContent') }}</p>
        </div>
        <a @click="$router.push('/wallet')" class="toWalletBtn">> 我已安全备份</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'firstBackupForm',
  data () {
    return {
        buttonBoxData:[                                     //按钮组数据
          {
            name: "备份助记词",
            icon: "el-icon-ETH-daima",
            func: "backupKeyStore",
          },
          {
            name: "备份私钥",
            icon: "el-icon-ETH-mima",
            func: "backupPrivateKey",
          }
        ],
        mnemonic: "",
        privateKey: "",
    }
  },
  components: {

  },
  computed: {
    baseChain(){                                    //底层链
      return this.$store.state.vuexStore.baseChain;
    },
  },
  mounted() {
    this.$nextTick(function(){
      if(this.$route.params.mnemonic){
        this.mnemonic = this.$route.params.mnemonic;
      } else {
        this.$router.push('/setting/backup');
      }
    })
  },
  methods: {
    backup(type) {            //备份事件,生成json文件
      if(type == "backupKeyStore"){                                      //如果是移动端
            this.privateKey = "";
            this.mnemonic = this.$route.params.mnemonic;
        } else if(type == "backupPrivateKey"){
            this.privateKey = mnemonic2privateKey(this.mnemonic);
            this.mnemonic = "";
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.firstBackupForm{
    float: left;
    height: calc(100% - 44px);
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    z-index: 3;
    position: relative;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
}
.tipBox{
    padding: 8px 16px;
    border-radius: 4px;
    margin: 20px 0;
    cursor: pointer;
}
.tipBox-red{
    background-color: #fef0f0;
    border-left: 5px solid #f56c6c;
}
.tipBox h3{
    display: inline-block;
    margin: 14px 0 0 0;
    font-weight: 400;
    color: #f56c6c;
    font-size: 18px;
    /* border-bottom: 1px solid #CCCCCC; */
}
.tipBox p{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-weight: 400;
}
.fullPage{
    width: 100% !important;
}
.toWalletBtn{
    position: absolute;
    bottom: 10%;
    right: 30px;
    text-decoration: underline;
}
</style>
