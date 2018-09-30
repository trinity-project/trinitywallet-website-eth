import Vue from 'vue'
import Router from 'vue-router'

import index from '@/components/index'
import messageForm from '@/components/common/message'
import discoverForm from '@/components/common/discover'
import settingForm from '@/components/common/setting'
import assetForm from '@/components/asset'
import receiveForm from '@/components/receive'
import recordForm from '@/components/record'

import startForm from '@/components/login/start'
import createForm from '@/components/login/create'
import loginByPrivateKeyForm from '@/components/login/loginByPrivateKey'
import loginByKeyStoreForm from '@/components/login/loginByKeyStore'

import receive1Form from '@/components/chain/receive1'
import transferOnChainForm from '@/components/chain/transferOnChain'

import addChannelForm from '@/components/channel/addChannel'
import channelListForm from '@/components/channel/channelList'
import channelInfoForm from '@/components/channel/channelInfo'
import paymentForm from '@/components/channel/payment'

import BackupForm from '@/components/setting/backup'
import contactForm from '@/components/setting/contact'
import changePasswordForm from '@/components/setting/changePassword'
import languageForm from '@/components/setting/language'
import aboutForm from '@/components/setting/about'


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
      path: '/receive',
      name: 'receiveForm',
      component: receiveForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/start',
      name: 'startForm',
      component: startForm
    },
    {
      path: '/create',
      name: 'createForm',
      component: createForm
    },
    {
      path: '/loginByPrivateKey',
      name: 'loginByPrivateKeyForm',
      component: loginByPrivateKeyForm
    },
    {
      path: '/loginByKeyStore',
      name: 'loginByKeyStoreForm',
      component: loginByKeyStoreForm
    },
    {
      path: '/addChannel',
      name: 'addChannelForm',
      component: addChannelForm
    },
    {
      path: '/channelList',
      name: 'channelListForm',
      component: channelListForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/record',
      name: 'recordForm',
      component: recordForm
    },
    {
      path: '/wallet/asset',
      name: 'asset',
      component: assetForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/chain/receive1',
      name: 'receive1',
      component: receive1Form,
      meta: {
        index: 2
      },
    },
    {
      path: '/chain/transfer',
      name: 'transferOnChain',
      component: transferOnChainForm,
      meta: {
        index: 1
      },
    },
    {
      path: '/channel/payment',
      name: 'payment',
      component: paymentForm
    },
    {
      path: '/channel/channelInfo',
      name: 'channelInfo',
      component: channelInfoForm,
      meta: {
        index: 2
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
  ],
  mode: 'hash'
})
