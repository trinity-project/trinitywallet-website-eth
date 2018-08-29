export default {
  state: { //state
    version: '0.0.1',
    isLogin: false,        //登录标志
    isTestNet: true,
    isNightMode: false,     //夜间模式
    activeNavIndex: '1-1',    //当前active Nav
    isNavShow: true,          //Nav显示
    isMessageBoxShow: false,      //MessageBox显示
    NetMagic: "527465737419990331",        //网络magic
    gasPrice: 1000000000, //Gas Price倍数
    NodeUriWebSocket: "",
    rpcIp: "",          //全节点调用ip
    walletInfo: {         //钱包信息
      keyStore: "",
      publicKey: "",
      address: ""
    },
    balanceData: {        //余额信息
      Chain: {
        "TNC": 0,
        "ETH": 0
      },
      Channel: {
        "TNC": 0,
        "ETH": 0
      }
    },
    channelList: [],        //通道列表
    addChannelInfo: [],       //添加通道信息
    txOnChannelInfo: [],        //通道转账信息
    closeChannelInfo: [],       //关闭通道信息
    contactList: {},            //联系人列表
    TxList: {},                 //交易签名列表
    recordList: [],             //交易记录列表
    FoundertxDataSign: "",       //暂存签名后的FoundertxData
    tncContractAddress: "0x65096f2B7A8dc1592479F1911cd2B98dae4d2218",     //TNC ERC20合约地址
    tncContractAbi: [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}],     //TNC ERC20 Abi
    trinityContractAddress: "0x56a8DcDB4480d73ddE0a13E87206C887D466872E", //trinity通道合约地址
    trinityContractAbi: [ { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, {"name": "founder", "type": "address" }, { "name": "founderBalance", "type": "uint256" }, { "name": "partner", "type": "address"}, { "name": "partnerBalance", "type": "uint256" }, { "name": "closerSignature", "type": "bytes" }, { "name": "partnerSignature",
    "type": "bytes" } ], "name": "closeChannel", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, {
    "name": "funderAddress", "type": "address" }, { "name": "funderAmount", "type": "uint256" }, { "name": "partnerAddress",
    "type": "address" }, { "name": "partnerAmount", "type": "uint256" }, { "name": "funderSignature", "type": "bytes" }, { "name":
    "partnerSignature", "type": "bytes" } ], "name": "deposit", "outputs": [], "payable": false, "stateMutability": "nonpayable",
    "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability":
    "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name":
    "nonce", "type": "uint256" }, { "name": "funder", "type": "address" }, { "name": "funderBalance", "type": "uint256" }, {
    "name": "partner", "type": "address" }, { "name": "partnerBalance", "type": "uint256" }, { "name": "closerSignature", "type":
    "bytes" }, { "name": "partnerSignature", "type": "bytes" } ], "name": "quickCloseChannel", "outputs": [], "payable": false,
    "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_dataContract", "type":
    "address" } ], "name": "setDataContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" } ], "name": "settleTransaction", "outputs":
    [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause",
    "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [
    { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "funderAddress", "type": "address"
    }, { "name": "funderAmount", "type": "uint256" }, { "name": "partnerAddress", "type": "address" }, { "name": "partnerAmount",
    "type": "uint256" }, { "name": "funderSignature", "type": "bytes" }, { "name": "partnerSignature", "type": "bytes" } ], "name":
    "updateDeposit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false,
    "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "partnerA", "type":
    "address" }, { "name": "updateBalanceA", "type": "uint256" }, { "name": "partnerB", "type": "address" }, { "name": "updateBalanceB",
    "type": "uint256" }, { "name": "signedStringA", "type": "bytes" }, { "name": "signedStringB", "type": "bytes" } ], "name":
    "updateTransaction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant":
    false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "funder",
    "type": "address" }, { "name": "funderBalance", "type": "uint256" }, { "name": "partner", "type": "address" }, { "name":
    "partnerBalance", "type": "uint256" }, { "name": "closerSignature", "type": "bytes" }, { "name": "partnerSignature", "type":
    "bytes" } ], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "lockHash", "type": "bytes32" },
    { "name": "secret", "type": "bytes32" } ], "name": "withdrawSettle", "outputs": [], "payable": false, "stateMutability":
    "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "channleId", "type": "bytes32"
    }, { "indexed": false, "name": "partnerA", "type": "address" }, { "indexed": false, "name": "amountA", "type": "uint256"
    }, { "indexed": false, "name": "partnerB", "type": "address" }, { "indexed": false, "name": "amountB", "type": "uint256"
    } ], "name": "UpdateTransaction", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "channleId",
    "type": "bytes32" }, { "indexed": false, "name": "hashLock", "type": "bytes32" }, { "indexed": false, "name": "nonce", "type":
    "uint256" }, { "indexed": false, "name": "balance", "type": "uint256" } ], "name": "WithdrawUpdate", "type": "event" }, {
    "anonymous": false, "inputs": [ { "indexed": false, "name": "channleId", "type": "bytes32" }, { "indexed": false, "name":
    "invoker", "type": "address" }, { "indexed": false, "name": "nonce", "type": "uint256" }, { "indexed": false, "name": "blockNumber",
    "type": "uint256" } ], "name": "CloseChannel", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name":
    "channleId", "type": "bytes32" }, { "indexed": false, "name": "closer", "type": "address" }, { "indexed": false, "name":
    "amount1", "type": "uint256" }, { "indexed": false, "name": "partner", "type": "address" }, { "indexed": false, "name": "amount2",
    "type": "uint256" } ], "name": "QuickCloseChannel", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false,
    "name": "channleId", "type": "bytes32" }, { "indexed": false, "name": "hashLock", "type": "bytes32" }, { "indexed": false,
    "name": "balance", "type": "uint256" } ], "name": "WithdrawSettle", "type": "event" }, { "anonymous": false, "inputs": [
    { "indexed": false, "name": "channleId", "type": "bytes32" }, { "indexed": false, "name": "partnerA", "type": "address" },
    { "indexed": false, "name": "amountA", "type": "uint256" }, { "indexed": false, "name": "partnerB", "type": "address" },
    { "indexed": false, "name": "amountB", "type": "uint256" } ], "name": "Settle", "type": "event" }, { "anonymous": false,
    "inputs": [ { "indexed": false, "name": "channleId", "type": "bytes32" }, { "indexed": false, "name": "invoker", "type":
    "address" }, { "indexed": false, "name": "nonce", "type": "uint256" }, { "indexed": false, "name": "hashLock", "type": "bytes32"
    }, { "indexed": false, "name": "secret", "type": "bytes32" } ], "name": "Withdraw", "type": "event" }, { "anonymous": false,
    "inputs": [ { "indexed": false, "name": "channleId", "type": "bytes32" }, { "indexed": false, "name": "partnerA", "type":
    "address" }, { "indexed": false, "name": "amountA", "type": "uint256" }, { "indexed": false, "name": "partnerB", "type":
    "address" }, { "indexed": false, "name": "amountB", "type": "uint256" } ], "name": "UpdateDeposit", "type": "event" }, {
    "anonymous": false, "inputs": [ { "indexed": false, "name": "channleId", "type": "bytes32" }, { "indexed": false, "name":
    "partnerA", "type": "address" }, { "indexed": false, "name": "amountA", "type": "uint256" }, { "indexed": false, "name":
    "partnerB", "type": "address" }, { "indexed": false, "name": "amountB", "type": "uint256" } ], "name": "Deposit", "type":
    "event" }, { "constant": false, "inputs": [ { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256"
    }, { "name": "sender", "type": "address" }, { "name": "receiver", "type": "address" }, { "name": "lockTime", "type": "uint256"
    }, { "name": "lockAmount", "type": "uint256" }, { "name": "lockHash", "type": "bytes32" }, { "name": "partnerAsignature",
    "type": "bytes" }, { "name": "partnerBsignature", "type": "bytes" }, { "name": "secret", "type": "bytes32" } ], "name": "withdraw",
    "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [
    { "name": "channelId", "type": "bytes32" }, { "name": "nonce", "type": "uint256" }, { "name": "sender", "type": "address"
    }, { "name": "receiver", "type": "address" }, { "name": "lockTime", "type": "uint256" }, { "name": "lockAmount", "type":
    "uint256" }, { "name": "lockHash", "type": "bytes32" }, { "name": "partnerAsignature", "type": "bytes" }, { "name": "partnerBsignature",
    "type": "bytes" } ], "name": "withdrawUpdate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type":
    "function" }, { "inputs": [ { "name": "_dataAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable",
    "type": "constructor" }, { "payable": false, "stateMutability": "nonpayable", "type": "fallback" }, { "constant": true, "inputs":
    [ { "name": "channelId", "type": "bytes32" } ], "name": "getChannelBalance", "outputs": [ { "name": "", "type": "uint256"
    } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "channelId",
    "type": "bytes32" } ], "name": "getChannelStatus", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability":
    "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "channelId", "type": "bytes32" } ], "name": "getTimeoutBlock",
    "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant":
    true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability":
    "view", "type": "function" }, { "constant": true, "inputs": [], "name": "trinityDataContract", "outputs": [ { "name": "",
    "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
    trinityDataContractAddress: "0x77080e395c328bd2Cb0F0166c459E85041Bd4d7F"
  },
  getters: {
    channelList(state) { //这里的state对应着上面这个state
      return !state.channelList;
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