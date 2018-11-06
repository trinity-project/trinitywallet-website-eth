<template>
  <div class="languageForm">
    <headBox/>
    <div class="contentBox">
        <a @click="ChangeLang(item, index)" v-for="(item, index) in languageData" :key="index" class="cell">
            <div class="cell-wrapper">
                <div class="cell-title">
                    <span class="cell-text">
                        <div :class="[item.isSelected ? 'el-icon-check' : 'el-icon-null' ]"></div>
                        {{ item.name }}
                    </span>
                </div>
                <div class="cell-right">
                    
                </div>
            </div>
        </a>
    </div>
  </div>
</template>

<script>
import headBox from './../common/headBoxForChild'
export default {
  name: 'languageForm',
  data () {
    return {
        languageData: [
            {
                name: '中文',
                lang: 'cn',
                isSelected: false
            },
            {
                name: 'English',
                lang: 'en',
                isSelected: false
            }
        ]
    }
  },
  components: {
    headBox
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function(){
      let _this = this;
      if(_this.$i18n.locale){         //根据当前i18n数据设置选中效果
        _this.languageData.forEach(function(data,index){
            if(data.lang == _this.$i18n.locale){
                data.isSelected = true;
            }
        });
      }
    })
  },
  filters:{

  },
  methods: {
    ChangeLang(data, index) {
        //this.$i18n.locale === 'cn' ? this.$i18n.locale ='en' : this.$i18n.locale ='cn';
        data.lang != undefined ? this.$i18n.locale = data.lang : this.$i18n.locale ='cn';            //切换i18n语言
        this.$parent.$parent.saveAsString("lang",this.$i18n.locale);                                 //localstorage储存语言设置

        this.languageData.forEach(function(data1,index1){                                           //移除所有选中样式
            data1.isSelected = false;
        });
        data.isSelected = true;
        this.$set(this.languageData, index, data);                                                  //更新选中样式

        let _this = this;
        setTimeout(function (){
            _this.$router.go(-1); 
        }, 300);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.languageForm{
    float: left;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #F0EFF4;
    z-index: 2;
}
.contentBox{
    height: 100%;
    width: 100%;
    padding: 30px 0;
    box-sizing: border-box;
}
h2{
    margin: 0;
    font-size: 24px;
}
h4{
    font-size: 16px;
}
img{
    width: 120px;
}
p{
    font-size: 16px;
    line-height: 20px;
}
.el-icon-null{
    width: 14px;
    height: 14px;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
}
.cell:hover{
    
}
</style>
