import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    navMenu: {
        'title': '菜单',
        'wallet': {
            'title': '钱包',
            'index': '首页',
            'receive': '收款',
            'addChannel': '添加通道',
            'channelList': '通道',
            'record': '交易记录'
        },
        'contact': '联系人',
        'setting': {
            'title': '设置',
            'switchLang': 'Switch Language',
            'switchNet': '选择网络',
            'nightMode': '夜间模式',
            'changePass': '修改密码',
            'backup': '备份',
            'signOut': '退出'
        },
        'about': '关于我们'
    },
    start: {
        'title': '欢迎',
        'createWallet': '创建新钱包',
        'loginByPrivateKey': '从私钥导入',
        'loginByKeystore': '从备份文件恢复',
        'createWalletTxt': '创建新钱包开始加密货币交易之旅',
        'loginByPrivateKeyTxt': '可以通过导入私钥的方式将钱包导入',
        'loginByKeystoreTxt': '如果之前备份文件，也可以通过备份文件的方式导入钱包',
    },
    create: {
        'title': '创建钱包',
        'password': '密码',
        'checkPass': '确认密码',
        'create': '创建',
        'callback-1': '请输入密码',
        'callback-2': '请再次输入密码',
        'callback-3': '两次输入密码不一致',
        'callback-4': '成功',
        'callback-5': '创建成功',
        'callback-6': '成功',
        'callback-7': '警告',
        'callback-8': '创建失败,请再试一次'
    },
    loginByPrivateKey: {
        'title': '导入私钥',
        'privateKey': '私钥',
        'password': '密码',
        'checkPass': '确认密码',
        'import': '导入',
        'backToStart': '返回开始界面',
        'callback-1': '私钥不能为空',
        'callback-2': '请输入正确的私钥',
        'callback-3': '请输入密码',
        'callback-4': '请再次输入密码',
        'callback-5': '两次输入密码不一致',
        'callback-6': '成功',
        'callback-7': '导入成功',
        'callback-8': '警告',
        'callback-9': '导入失败，请确认私钥正确'
    },
    loginByKeyStore: {
        'title': '从备份文件恢复',
        'chooseKeyStore': '选取文件',
        'password': '密码',
        'import': '导入',
        'callback-1': '警告',
        'callback-2': 'KeyStore文件读取错误',
        'callback-3': '警告',
        'callback-4': 'KeyStore文件不能为空',
        'callback-5': '警告',
        'callback-6': '密码不能为空',
        'callback-7': '警告',
        'callback-8': '钱包解锁失败 - 可能是密码错误',
        'callback-9': '警告',
        'callback-10': '成功',
        'callback-11': '导入成功',
        'callback-12': '警告',
        'callback-12': '导入失败，请确认KeyStore和密码正确'
    },
    index: {
        'assetType': '资产类型',
        'balanceOnChain': '链上金额',
        'balanceOnChannel': '通道金额',
        'title': '转账',
        'paymentCode': '支付码/地址',
        'transferByContact': '从联系人里转账',
        'transfer': '转账'
    },
    receive: {
        'title': '收款',
        'chain': '链上',
        'channel': '通道',
        'receiveAddress': '收款地址',
        'copy': '复制',
        'amount': '金额',
        'assetType': '资产类型',
        'chooseAssetType': '请选择资产类型',
        'create': '创建',
        'reset': '重置',
        'receiveCode': '收款码'
    },
    channelList: {
        'title': '通道列表',
        'addChannel': '添加通道',
        'noChannel': '还没有通道，立即去添加',
        'channelName': '通道名称',
        'date': '开通时间',
        'selfUri': '本端地址',
        'selfBalance': '本端余额',
        'otherUri': '对端地址',
        'otherBalance': '对端余额',
        'channelState': '通道状态',
        'isConnect': '是否连接',
        'isTestNet': '网络',
        'closeChannel': '关闭通道',
        'password': '密码',
        'inputPassword': '在此输入密码',
        'confirm': '确定',
        'cancel': '取消'
    },
    addChannel: {
        'title': '添加通道',
        'assetBalance': '资产余额',
        'otherUri': '对端地址',
        'assetType': '资产类型',
        'chooseAssetType': '请选择资产类型',
        'selfDeposit': '本端余额',
        'otherDeposit': '对端余额',
        'alice': '通道名称',
        'password': '密码',
        'addChannel': '添加通道',
        'cancel': '取消'
    },
    record: {
        'title': '交易记录',
        'noRecord': '还没有交易，立即去转账',
        'recordInfo': '交易信息',
        'otherUri': '对端地址',
        'date': '交易时间',
        'amount': '交易金额',
        'isOnChannel': '交易方式',
        'state': '交易结果',
        'transactionHash': '交易哈希',
        'blockHash': '块哈希',
        'close': '关闭'
    },
    backup: {
        'title': '备份',
        'backupBtn': '备份钱包',
        'tips': '温馨提醒',
        'tipsContent': '备份当前钱包后，浏览器会生成一个钱包备份文件，当您清空数据库、或者更换 浏览器、重装系统后，可以使用钱包备份文件恢复当前钱包。同时保存好文件和 钱包密码，钱包文件丢失或忘记密码可能会导致您的资产丢失。'
    }
}

export default cn;