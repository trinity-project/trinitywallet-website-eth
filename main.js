var crypto = require('crypto');
// var CryptoJS = require('crypto-js');
// var sign = crypto.createSign('SHA256');
var secp256k1 = require('secp256k1/elliptic');
// var createKeccakHash = require('keccak');
// var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var base58 = require('base-x')(BASE58);


global.signData = signData;
global.ecSign = ecSign;
// global.createR = createR;
// global.createHr = createHr;
global.base58decode = base58decode;     //base58解密
global.base58encode = base58encode;     //base58加密
global.md5encode = md5encode;

function ab2ASCII(str) { 
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

// function createR() {
//     var b = crypto.randomBytes(32);
//     console.log(b.toString('hex'));
//     return b.toString('hex');
// }

// function createHr(b) {
//     var c = CryptoJS.SHA1(b.toString('hex'));
//     console.log(c.toString());
//     return c.toString();
// }

function base58decode(data) {
    var DecryptedData = base58.decode(data);
    return DecryptedData;
}

function base58encode(data) {
    var CryptedData = base58.encode(ab2ASCII(data));
    return CryptedData;
}

function md5encode1(data){
    var md5 = crypto.createHash('md5');
    var CryptedData = md5.update(data).digest('hex');
    return CryptedData;
}

function md5encode(data1, data2) {
  var md5 = crypto.createHash('md5');
  var CryptedData = md5.update(data1).update(data2.toString()).digest('hex');
  return CryptedData;
}

// 左边0补齐,参数为原数字,补齐位数
function addPreZero(num, length) {
  var t = (num + '').length,
    s = '';
  for (var i = 0; i < length - t; i++) {
    s += '0';
  }
  return s + num;
}

function signData(rawTx, privateKey) {
  var tx = new Tx(rawTx);
  console.log(tx);
  var privateKey1 = privateKey.slice(2);
  const privateKeyBuffer = Buffer.from(privateKey1.toString(), 'hex');
  tx.sign(privateKeyBuffer);

  var serializedTx = tx.serialize().toString('hex');
  return serializedTx;
}

function ecSign(rawTx, privateKey) {
  var rawTx1 = rawTx.slice(2);
  const rawTxBuffer = Buffer.from(rawTx1.toString(), 'hex');
  var privateKey1 = privateKey.slice(2);
  const privateKeyBuffer = Buffer.from(privateKey1.toString(), 'hex');
  let signedData = secp256k1.sign(rawTxBuffer, privateKeyBuffer);

  let result = "0x" + signedData.signature.toString('hex') + addPreZero(signedData.recovery, 2);
  console.log(result);
  return result;
}

// //随机生成私钥
// function createPrivateKey() {
//     var privateKey = crypto.randomBytes(32);
//     console.log(privateKey);
//     return privateKey;
// }

//私钥转公钥
// function privateKey2PublicKey(privateKey) {
//     var privateKeyBuffer = Buffer.from(privateKey.toString(),'hex');
//     console.log(privateKeyBuffer);
//     var publicKey = secp256k1.publicKeyCreate(privateKeyBuffer, false).slice(1);
//     console.log(publicKey);
//     return publicKey;
// }

// //公钥转地址
// function publicKey2Address(publicKey) {
//     var publicKeyBuffer = Buffer.from(publicKey.toString(), 'hex');
//     console.log(publicKeyBuffer);
//     var address = createKeccakHash("keccak256").update(publicKeyBuffer).digest().slice(-20);
//     console.log(address);
//     return address;
// }
