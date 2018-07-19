<template>
    <footer v-if="$route.path !='/login'" class="Footer">
        <div class="container-fluid">
            <ul class="clearfloat">
                <li @click="testfun()" :class="{ active: item.isActive }" v-for="(item,index) in FooterList" :key="index">
                    <a @click="changeActive(index)" href="javascript:;">
                        <span>{{ item.Name }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'footerBox',
  data () {
    return {
        FooterList:[
            {
                class:"transfer",
                isActive:true,
                Icon:"#icon-zhuanzhang",
                Name:"Transfer"
            },
            {
                class:"addchannel",
                isActive:false,
                Icon:"#icon-tianjia",
                Name:"Add Channel"
            },
            {
                class:"channellist",
                isActive:false,
                Icon:"#icon-list",
                Name:"Channel List"
            },
            {
                class:"record",
                isActive:false,
                Icon:"#icon-dujiayuniconzhenggao-19",
                Name:"Record"
            }
        ]
    }
  },
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods:{
    changeActive (index){
        // console.log(index);
        var _this = this;
        _this.FooterList.forEach(function(data,index){
            data.isActive = false;
        });
        _this.FooterList[index].isActive = true;
    },
    testfun (){
        console.log(this.$route.path);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer{
    width: calc(100% - 300px);
    height: 50px;
    float: left;
    color: RGBA(124, 125, 129, 1.00);
    background: RGBA(248, 248, 248, 1.00);
    z-index: 2;
}
ul { 
  list-style-type: none;
  padding: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  /* border-top: 1px solid RGBA(183, 183, 184, 1.00); */
}
li {
    display: inline-block;
    /* margin: 0 10px; */
    width: 25%;
    height: 100%;
    float: left;
}
.icon{
    color: RGBA(117, 118, 122, 1.00);
    font-size: 21px;
    margin: 7px auto 0;
    /* margin: 7px 28px 0; */
}
a{
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 20px;
    text-align: center;
    color: RGBA(117, 118, 122, 1.00);
    text-decoration: none;
}
span{
  font-size: 10px;
}
.container-fluid{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.active a{
    color: #EE5487;
}
.active .icon{
    color: #EE5487;
}
@media (max-width: 992px){
  .navbar{
    margin-bottom: 0px;
  }
  .NavbarTitle{
    font-size: 17px;
    margin: 0;
    line-height: 39px;
    text-align: center;
  }
  .container-fluid{
    text-align: center;
  }
  .navbar-right{
    font-size: 14px;
    margin: 0;
  }
}
</style>
