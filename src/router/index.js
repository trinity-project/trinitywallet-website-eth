import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import startForm from '@/components/start'
import createForm from '@/components/create'
import loginByPrivateKeyForm from '@/components/loginByPrivateKey'
import loginByKeyStoreForm from '@/components/loginByKeyStore'
import BackupForm from '@/components/backup'
import contactForm from '@/components/contact'
import receiveForm from '@/components/receive'
import addChannelForm from '@/components/addChannel'
import channelListForm from '@/components/channelList'
import recordForm from '@/components/record'
import index6 from '@/components/index6'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/backup',
      name: 'BackupForm',
      component: BackupForm
    },
    {
      path: '/contact',
      name: 'contactForm',
      component: contactForm
    },
    {
      path: '/receive',
      name: 'receiveForm',
      component: receiveForm
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
      path: '/index6',
      name: 'index6',
      component: index6
    },
    {
      path: '/channelList',
      name: 'channelListForm',
      component: channelListForm
    },
    {
      path: '/record',
      name: 'recordForm',
      component: recordForm
    },
  ],
  mode: "history" //消除链接上的#号
})
