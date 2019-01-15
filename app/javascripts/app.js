// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

const student = require('./student')
const admin = require('./admin')
const cook = require('./cook')
// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import DinningArtifacts from '../../build/contracts/Dinning'

// MetaCoin is our usable abstraction, which we'll use through the code below.
let DinningContract = contract(DinningArtifacts)
let DinningInstance
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

window.App = {
  // 获得合约实例
  init: function () {
    // 设置web3连接
    DinningContract.setProvider(window.web3.currentProvider)
    // Get the initial account balance so it can be displayed.
    window.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.App.setStatus('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        window.App.setStatus('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }
      accounts = accs
      account = accounts[0]
    })

    DinningContract.deployed().then(function (instance) {
      DinningInstance = instance
    }).catch(function (e) {
      console.log(e, null)
    })
  },
  // 新建客户
  newStudent: function () {
    student.newStudent(DinningInstance, account)

  },
  // 客户登录
  studentLogin: function () {
    student.studentLogin(DinningInstance, account)
  },
  // 当前客户信息
  getCurrentStudent: function (currentAccount) {
    student.showCurrentAccount(currentAccount)
  },
  // 当前客户余额
  getStudentBalance: function (currentAccount) {
    student.getStudentBalance(currentAccount, DinningInstance, account)
  },
  // 客户购买商品
  buyFood: function (currentAccount) {
    student.buyFood(currentAccount, DinningInstance, account)
  },
  // 查看已经购买的物品
  getFoodsByStudent: function (currentAccount) {
    student.getFoodsByStudent(currentAccount, DinningInstance, account)
  },
  // 客户转让积分
  transferMoney: function (currentAccount) {
    student.transferMoney(currentAccount, DinningInstance, account)
  },
  // 商家注册
  newCook: function () {
    cook.newCook(DinningInstance, account)
  },
  // 商家登录
  cookLogin: function () {
    cook.cookLogin(DinningInstance, account)
  },
  // 当前商家账户
  getCurrentCook: function (currentAccount) {
    cook.getCurrentCook(currentAccount)
  },
  // 商家添加商品
  addFood: function (currentAccount) {
    cook.addFood(currentAccount, DinningInstance, account)
  },
  // 显示商家的所有商品
  getFoodsByCook: function (currentAccount) {
    cook.getFoodsByCook(currentAccount, DinningInstance, account)
  },
  // 发行积分
  sendMoneyToStudent: function () {
    admin.sendMoneyToStudent(DinningInstance, account)
  },
  // 银行登录
  adminLogin: function () {
    admin.adminLogin(DinningInstance, account)
  },
  // 查看已经发行的积分
  getIssuedAmount: function () {
    admin.getIssuedAmount(DinningInstance, account)
  },
  // 查询所有的区块链账户
  allAccounts: function () {
    let allAccount = ''
    window.web3.eth.accounts.forEach(e => {
      allAccount += e + '\n'
    })
    window.App.setConsole(allAccount)
  },
  // 状态栏显示
  setStatus: function (message) {
    alert(message)
    // const status = document.getElementById('status')
    // status.innerHTML = message
    // setTimeout(() => {
    //   const info = document.getElementById('info')
    //   info.hidden = true
    //   console.log('ok')
    // }, 1.5 * 1000)
  },
  // 显示console
  setConsole: function (message) {
    const status = document.getElementById('console')
    status.innerHTML = message

  },


  logout: function (currentAccount) {
    window.location.href = "index.html"
  }


}

window.addEventListener('load', function () {
  // 设置web3连接 http://127.0.0.1:8545
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  window.App.init()
})
