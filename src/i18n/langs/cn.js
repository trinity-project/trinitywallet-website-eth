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
    backup: {
        'title': '备份',
        'backupBtn': '备份钱包',
        'tips': '温馨提醒',
        'tipsContent': '备份当前钱包后，浏览器会生成一个钱包备份文件，当您清空数据库、或者更换 浏览器、重装系统后，可以使用钱包备份文件恢复当前钱包。同时保存好文件和 钱包密码，钱包文件丢失或忘记密码可能会导致您的资产丢失。'
    }
}

export default cn;