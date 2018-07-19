import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import loginForm from '@/components/loginForm'
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
      path: '/login',
      name: 'loginForm',
      component: loginForm
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
