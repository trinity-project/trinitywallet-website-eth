export default {
  state: {
    version: '0.3.0',               //版本号
    baseChain: 'ETH',               //底层主链
    isTestNet: true,                //是否为测试网
    isLogin: false,                 //登录标志
    activeNavIndex: '1-1',          //当前active Nav
    isNavShow: true,                //Nav显示
    isMessageBoxShow: false,        //MessageBox显示
    isChannelFormShow: false,       //通道页面显示
    gasPrice: 5000000000,           //Gas Price倍数
    isMobile: true,                 //是否为移动端
    
    isNotifyShow: false,          //消息弹窗显示,测试
    isOneStepPayment: "",        //是否开启免密支付
    RSMCNum: 0,
    HTLCNum: 0,
    HTLCRNum: 0,
    nodeList: [],                //当前网络的钱包
    walletInfo: {               //钱包信息
      keyStore: "",
      publicKey: "",
      address: "",
      keyStorePass: ""
    },
    NEOwalletInfo: {            //NEO钱包消息
      keyStore: "",
      publicKey: "",
      address: "",
      keyStorePass: ""
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
    activeAssetInfo: {          //当前显示的资产页面
      assetType: "",            //用于缓存当前*链上*资产页面信息
      channelName: "",          //用于缓存当前*通道*资产页面信息
    },
    addChannelInfo: [],         //添加通道信息
    txOnChannelInfo: [],        //通道转账信息
    closeChannelInfo: [],       //关闭通道信息

    channelList: [],            //通道列表
    webSocketList: [],          //websocket列表
    contactList: {},            //联系人列表
    txList: [],                 //交易签名列表
    recordList: [],             //交易记录列表
    RList: [],                  //R与hashR对应表
    eventList: [],              //与块高相关的event事件列表

    NetMagic: "",                   //网络magic
    NodeUriWebSocketIp: "",         //全节点websocket IP
    NodeUriWebSocket: "",           //全节点websocket方法
    tncContractAddress: "",         //ERC20资产合约地址
    tncContractAbi: [],             //ERC20资产合约Abi
    trinityContractAddress: "",     //Trinity状态通道合约地址
    trinityDataContractAddress: "", //Trinity状态通道合约Abi
    trinityContractAbi: [],         //Trinity状态通道数据合约地址,
    spvPort: "",                    //spv 端口号
    delayBlock: "",                 //HTLC延迟块高数(每一跳)
    nodeWebSocketIp: "",            //稳定的node节点,用于获取nodeList
    NodeRpcUri: "",                 //全节点通用RPC接口   NEO
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