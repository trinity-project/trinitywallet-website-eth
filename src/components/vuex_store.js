export default {
  state: {
    version: '0.0.1',               //版本号
    isLogin: false,                 //登录标志
    baseChain: 'ETH',               //底层主链
    isTestNet: true,                //是否为测试网
    isNightMode: false,             //夜间模式
    activeNavIndex: '1-1',          //当前active Nav
    isNavShow: true,                //Nav显示
    isMessageBoxShow: false,        //MessageBox显示
    NetMagic: "195378745719990331", //网络magic
    gasPrice: 5000000000,           //Gas Price倍数
    NodeUriWebSocketIp: "ws://47.104.81.20:9000", //全节点websocket IP
    NodeUriWebSocket: "",                           //全节点websocket方法
    NodeRpcUri: 'http://47.254.64.251:21332',     //全节点通用RPC接口   NEO
    spvPortNEO: "8766",                           //SPV端口号         NEO
    walletInfo: {               //钱包信息
      keyStore: "",
      publicKey: "",
      address: ""
    },
    NEOwalletInfo: {            //NEO钱包消息
      keyStore: "",
      publicKey: "",
      address: ""
    },
    balanceData: {              //余额信息
      Chain: {                  //链上余额
        "TNC": 0,
        "ETH": 0,
        "NEO": 0,
        "GAS": 0
      },
      Channel: {                //通道余额
        "TNC": 0,
        "ETH": 0,
        "NEO": 0,
        "GAS": 0
      }
    },
    addChannelInfo: [],         //添加通道信息
    txOnChannelInfo: [],        //通道转账信息
    closeChannelInfo: [],       //关闭通道信息
    channelList: [],            //通道列表
    contactList: {},            //联系人列表
    txList: [],                 //交易签名列表
    recordList: [],             //交易记录列表
    RList: [],                  //R与hashR对应表
    eventList: [],              //与块高相关的event事件列表
    tncContractAddress: "",         //ERC20资产合约地址
    tncContractAbi: [],             //ERC20资产合约Abi
    trinityContractAddress: "",     //Trinity状态通道合约地址
    trinityDataContractAddress: "", //Trinity状态通道合约Abi
    trinityContractAbi: []          //Trinity状态通道数据合约地址
  },
  getters: {
    channelList(state) {
      return !state.channelList;
    }
  },
  mutations: {
    switch_dialog(state) {
      state.show = state.show ? false : true;
    }
  },
  actions: {
    switch_dialog(context) {
      context.commit('switch_dialog');
    }
  }
}