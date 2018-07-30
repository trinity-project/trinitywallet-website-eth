export default {
  state: { //state
    isLogin: false,        //登录标志
    isNightMode: false,     //夜间模式
    activeNavIndex: '1-1',    //当前active Nav
    Magic: "",
    walletInfo: {
      keyStore: "",
      publicKey: "",
      address: ""
    },
    balanceData: {
      Chain: {
        "TNC": 0,
        "ETH": 0
      },
      Channel: {
        "TNC": 0,
        "ETH": 0
      }
    },
    channelList: [],
    contactList: {

    },
    FoundertxDataSign: ""       //暂存签名后的FoundertxData
  },
  getters: {
    switchLogin(state) { //这里的state对应着上面这个state
      return !state.isLogin;
    },
    signOut(state) {
      state.walletInfo = {
        privateKey: "",
        publicKey: "",
        address: ""
      }
      return state.walletInfo;
    }
  },
  mutations: {
    switch_dialog(state) { //这里的state对应着上面这个state
      state.show = state.show ? false : true;
      //你还可以在这里执行其他的操作改变state
    }
  },
  actions: {
    switch_dialog(context) { //这里的context和我们使用的$store拥有相同的对象和方法
      context.commit('switch_dialog');
      //你还可以在这里触发其他的mutations方法
    }
  }
}