import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    navMenu: {
        'title': 'Menu',
        'wallet': {
            'title': 'Wallet',
            'index': 'Home',
            'receive': 'Receive',
            'addChannel': 'Add Channel',
            'channelList': 'Channel',
            'record': 'Record'
        },
        'contact': 'Contact',
        'setting': {
            'title': 'Setting',
            'switchLang': '更改语言',
            'switchNet': 'Switch Net',
            'nightMode': 'Night Mode',
            'changePass': 'Change Pass',
            'backup': 'Backup',
            'signOut': 'Sign Out'
        },
        'about': 'About Us'
    },
    start: {
        'title': 'Welcome',
        'createWallet': 'Create Wallet',
        'loginByPrivateKey': 'Import by Private Key',
        'loginByKeystore': 'Restore form the Backup File',
        'createWalletTxt': 'Create a new wallet and start a transaction of crypto asset',
        'loginByPrivateKeyTxt': 'You can import your wallet by your private key',
        'loginByKeystoreTxt': 'If you once backed up your files, you can import the wallet by the files',
    },
    create: {
        'title': 'Create Wallet',
        'password': 'Password',
        'checkPass': 'CheckPass',
        'create': 'Create',
        'callback-1': 'Please input the password',
        'callback-2': 'Please repeat the password',
        'callback-3': "Passwords don't match",
        'callback-4': 'Succeed',
        'callback-5': 'Create Succeed',
        'callback-6': 'Succeed',
        'callback-7': 'Warning',
        'callback-8': 'Create failed, please again'
    },
    loginByPrivateKey: {
        'title': 'Import the Private Key',
        'privateKey': 'PrivateKey',
        'password': 'Password',
        'checkPass': 'CheckPass',
        'import': 'Import',
        'backToStart': 'Back to start page',
        'callback-1': 'Private key can not be empty',
        'callback-2': 'Please input the correct private key',
        'callback-3': 'Please input the password',
        'callback-4': 'Please repeat the password',
        'callback-5': "Passwords don't match",
        'callback-6': 'Succeed',
        'callback-7': 'Import succeed',
        'callback-8': 'Warning',
        'callback-9': 'Import failed, please confirm the private key'
    },
    loginByKeyStore: {
        'title': 'Restore form the Backup File',
        'chooseKeyStore': 'Choose the File',
        'password': 'Password',
        'import': 'Import',
        'callback-1': 'Warning',
        'callback-2': 'KeyStore file read error',
        'callback-3': 'Warning',
        'callback-4': 'KeyStore file can not be empty',
        'callback-5': 'Warning',
        'callback-6': 'Please input the password',
        'callback-7': 'Warning',
        'callback-8': 'Key derivation failed - possibly wrong password',
        'callback-9': 'Warning',
        'callback-10': 'Succeed',
        'callback-11': 'Restore succeed',
        'callback-12': 'Warning',
        'callback-12': 'Restore failed，please confirm the file and password'
    },
    backup: {
        'title': 'Backup',
        'backupBtn': 'Backup Wallet',
        'tips': 'Tips',
        'tipsContent': 'After backed up the wallet, the system will generate a wallet backup file. When you clear the data, change the browser, or reinstall the system, you can use the wallet backup file to restore the wallet. Please save the file and the wallet password. Once lost wallet files or forgotten wallet passwords you may lost your assets.'
    }
}

export default en;