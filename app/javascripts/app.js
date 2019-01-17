import '../stylesheets/app.css'
import '../stylesheets/bootstrap.css'

const student = require('./student')
const admin = require('./admin')
const cook = require('./cook')
const header = require('./header')



import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { sha256, sha224 } from 'js-sha256';


import DinningArtifacts from '../../build/contracts/Dinning'

let DinningContract = contract(DinningArtifacts)
let DinningInstance
let accounts
let account
let message



window.App = {
  init: function () {

    DinningContract.setProvider(window.web3.currentProvider)
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
  showHeader: function () {
    header.showHeader()
  },
  newStudent: function () {
    student.newStudent(DinningInstance, account)
  },
  getUsername: function () {
    document.getElementById('usernameLabel').innerHTML = sessionStorage.getItem('username')
  },
  studentLogin: function () {
    student.studentLogin(DinningInstance, account)
  },
  getCurrentStudent: function (currentAccount) {
    student.showCurrentAccount(currentAccount)
  },
  getStudentBalance: function (currentAccount) {
    student.getStudentBalance(currentAccount, DinningInstance, account)
  },
  buyFood: function (currentAccount) {
    student.buyFood(currentAccount, DinningInstance, account)
  },
  getFoodsByStudent: function (currentAccount) {
    student.getFoodsByStudent(currentAccount, DinningInstance, account)
  },
  transferMoney: function (currentAccount) {
    student.transferMoney(currentAccount, DinningInstance, account)
  },
  newCook: function () {
    cook.newCook(DinningInstance, account)
  },
  cookLogin: function () {
    cook.cookLogin(DinningInstance, account)
  },
  getCurrentCook: function (currentAccount) {
    cook.getCurrentCook(currentAccount)
  },
  addFood: function (currentAccount) {
    cook.addFood(currentAccount, DinningInstance, account)
  },
  getFoodsByCook: function (currentAccount) {
    cook.getFoodsByCook(currentAccount, DinningInstance, account)
  },
  sendMoneyToStudent: function () {
    admin.sendMoneyToStudent(DinningInstance, account)
  },
  adminLogin: function () {
    admin.adminLogin(DinningInstance, account)
  },
  getIssuedAmount: function () {
    admin.getIssuedAmount(DinningInstance, account)
  },
  fillAdmin: function () {
    let a = 0
    let adminAccount = ''
    window.web3.eth.accounts.forEach(e => {
      if (a == 0) {
        adminAccount = e
        a += 1
      }
    })
    document.getElementById('adminLoginAddr').value = adminAccount

  },
  setStatus: function (message) {
    alert(message)
  },
  setConsole: function (message) {
    const status = document.getElementById('console')
    status.innerHTML = message

  },


  logout: function (currentAccount) {
    sessionStorage.removeItem('account')
    sessionStorage.removeItem('cook_account')
    sessionStorage.removeItem('admin_account')
    sessionStorage.removeItem('username')
    location.reload()
  }


}

window.addEventListener('load', function () {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  window.App.init()
})
