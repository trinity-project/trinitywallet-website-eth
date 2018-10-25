<template>
  <div class="settingForm">
    <div class="headBox">
      <div class="header-button is-left">
      </div>
      <h1>{{ $t('setting.title') }}</h1>
      <div class="header-button is-right"></div>
    </div>
    <div class="contentBox">
        <!-- <h2></h2> -->
        <!-- <hr style=" height:2px;border:none;border-top:2px dotted #EBEEF5;" /> -->
        <router-link to="/setting/backup" class="cell cell-hover">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.backup') }}</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <router-link to="/setting/changePassword" class="cell cell-hover">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.changePass') }}</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <router-link to="/setting/contact" class="cell cell-hover">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.contact') }}</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <router-link to="/setting/language" class="cell cell-hover">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.switchLang') }}</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <router-link to="/setting/more" class="cell cell-hover">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">更多</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <router-link to="/setting/about" class="cell cell-hover" style="margin-top: 30px;">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">{{ $t('setting.about') }}</span>
                </div>
                <div class="cell-right">
                    <i class="el-icon-ETH-qianjin"></i>
                </div>
            </div>
        </router-link>
        <div style="text-align:center;margin-top:42px;">
            <el-button @click="showSignOutBox()" style="width: 80%;" type="primary">{{ $t('setting.signOut') }}</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settingForm',
  data () {
    return {

    }
  },
  filters:{

  },
  methods: {
    showSignOutBox() {
        this.$parent.$parent.showSignOutBox();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settingForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #F2F2F2;
    z-index: 1;
}
.headBox{
    background-color: RGBA(64, 64, 67, 0.97);
}
h1{
    font-size: 18px;
    font-weight: 400;
    margin: 0;
    text-align: center;
    line-height: 56px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.contentBox{
    height: calc(100% - 106px);
    width: 100%;
    padding: 30px 0;
    box-sizing: border-box;
}

h2{
    margin: 0 20px 12px;
    font-size: 24px;
}

</style>
