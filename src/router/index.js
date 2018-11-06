import Vue from 'vue'
import Router from 'vue-router'

import index from '@/components/tabbar/index'
import messageForm from '@/components/tabbar/message'
import discoverForm from '@/components/tabbar/discover'
import settingForm from '@/components/tabbar/setting'

import scanForm from '@/components/common/scan'
import EtherScanForm from '@/components/common/EtherScan'

import startForm from '@/components/login/start'
import createForm from '@/components/login/create'
import loginByPrivateKeyForm from '@/components/login/loginByPrivateKey'
import loginByKeyStoreForm from '@/components/login/loginByKeyStore'
import backForm from '@/components/login/back'

import assetForm from '@/components/chain/asset'
import receiveForm from '@/components/chain/receive'
import transferOnChainForm from '@/components/chain/transferOnChain'

import addChannelForm from '@/components/channel/addChannel'
import channelListForm from '@/components/channel/channelList'
import channelAssetForm from '@/components/channel/channelAsset'
import channelInfoForm from '@/components/channel/channelInfo'
import paymentForm from '@/components/channel/payment'
import createPaymentForm from '@/components/channel/createPayment'

import ranking from '@/components/discover/ranking'

import BackupForm from '@/components/setting/backup'
import contactForm from '@/components/setting/contact'
import changePasswordForm from '@/components/setting/changePassword'
import languageForm from '@/components/setting/language'
import aboutForm from '@/components/setting/about'
import moreForm from '@/components/setting/more'


Vue.use(Router)

export default new Router({
  // base: '///Users/mean/Documents/工作/Trinity/ETH/Wallet/dist/', //添加根目录
  //   scrollBehavior: () => ({
  //     y: 0
  // }),
  routes: [
    {
      path: '/wallet',
      name: 'index',
      component: index,
      meta: {
        index: 0
      }, //meta对象的index用来定义当前路由的层级,由小到大,由低到高
    },
    {
      path: '/message',
      name: 'message',
      component: messageForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/discover',
      name: 'discover',
      component: discoverForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/setting',
      name: 'setting',
      component: settingForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/scan',
      name: 'scan',
      component: scanForm,
      meta: {
        index: 3
      },
    },
    {
      path: '/EtherScan',
      name: 'EtherScan',
      component: EtherScanForm,
      meta: {
        index: 3
      },
    },
    {
      path: '/start',
      name: 'startForm',
      component: startForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/create',
      name: 'createForm',
      component: createForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/loginByPrivateKey',
      name: 'loginByPrivateKeyForm',
      component: loginByPrivateKeyForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/loginByKeyStore',
      name: 'loginByKeyStoreForm',
      component: loginByKeyStoreForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/back',
      name: 'backForm',
      component: backForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/chain/asset',
      name: 'asset',
      component: assetForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/chain/receive',
      name: 'receive',
      component: receiveForm,
      meta: {
        index: 2
      },
    },
    {
      path: '/chain/transfer',
      name: 'transferOnChain',
      component: transferOnChainForm,
      meta: {
        index: 2
      }, 
      params: {
        address: ""
      }
    },
    {
      path: '/channel/addChannel',
      name: 'addChannelForm',
      component: addChannelForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/channel/channelList',
      name: 'channelListForm',
      component: channelListForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/channel/payment',
      name: 'payment',
      component: paymentForm,
      meta: {
        index: 0
      },
    },
    {
      path: '/channel/createPayment',
      name: 'createPayment',
      component: createPaymentForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/channel/channelAsset',
      name: 'channelAsset',
      component: channelAssetForm,
      meta: {
        index: 2
      },
    },
    {
      path: '/channel/channelInfo',
      name: 'channelInfo',
      component: channelInfoForm,
      meta: {
        index: 3
      },
      params: {
        Data: {
          Alice: "",
          ChannelName : "",
          date: "",
          SelfUri: "",
          SelfBalance: "",
          OtherUri: "",
          OtherBalance: "",
          State: "",
          isConnect: "",
          isTestNet: ""
        }
      }
    },
    {
      path: '/setting/backup',
      name: 'BackupForm',
      component: BackupForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/setting/changePassword',
      name: 'changePasswordForm',
      component: changePasswordForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/setting/contact',
      name: 'contactForm',
      component: contactForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/setting/language',
      name: 'language',
      component: languageForm, meta: {
        index: 1
      },
    },
    {
      path: '/setting/about',
      name: 'aboutForm',
      component: aboutForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/setting/more',
      name: 'moreForm',
      component: moreForm,
      meta: {
        index: 2
      },
    },
    {
      path: '/discover/ranking',
      name: 'ranking',
      component: ranking,
      meta: {
        index: 1
      },
    },
  ],
  mode: 'hash'
})
