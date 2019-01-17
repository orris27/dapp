const utils = require('./utils')
var sha256 = require('js-sha256');

module.exports = {
  // 注册学生
  newStudent: function (DinningInstance, account) {
    const address1 = document.getElementById('studentAddress').value
    const address = '0x' + sha256.sha256(address1)
    const password = document.getElementById('studentPassword').value
    console.log(address)
    console.log(password)
    console.log(address + ' ' + password)
    DinningInstance.newStudent(address, password, { from: account, gas: 3000000 }).then(function () {
      DinningInstance.NewStudent(function (e, r) {
        if (!e) {
          console.log(r)
          console.log(r.args)
          if (r.args.isSuccess === true) {
            window.App.setStatus('注册成功')
            window.location.href = "student.html"
            sessionStorage.setItem('account', student)
          } else {
            window.App.setStatus('账户已经注册')
          }
        } else {
          console.log(e)
        }
      })
    })
  },
  // 学生登录
  studentLogin: function (DinningInstance, account) {
    const address1 = document.getElementById('studentLoginAddr').value
    const address = '0x' + sha256.sha256(address1)
    const password = document.getElementById('studentLoginPwd').value
    DinningInstance.getStudentPassword(address, { from: account, gas: 3000000 }).then(function (result) {
      if (result[0]) {
        if (password.localeCompare(utils.hexCharCodeToStr(result[1])) === 0) {
          console.log('登录成功')
          sessionStorage.setItem("account", address)
          sessionStorage.setItem("username", address1)
          window.location.href = 'student.html'
        } else {
          console.log('密码错误，登录失败')
          window.App.setStatus('密码错误，登录失败')
        }
      } else {
        console.log('该用户不存在，请确定账号后再登录！')
        window.App.setStatus('该用户不存在，请确定账号后再登录！')
      }
    })
  },
  // 获得学生的余额
  getStudentBalance: function (currentAccount, DinningInstance, account) {
    DinningInstance.getStudentBalance.call(currentAccount, { from: account }).then(function (value) {
      document.getElementById('balanceLabel').innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      window.App.setStatus('出现异常，查询余额失败！')
    })
  },
  // 购买食物
  getFoodsByStudent: function (currentAccount, DinningInstance, account) {
    DinningInstance.getFoodsByStudent.call(currentAccount, { from: account }).then(function (result) {
      if (result.length === 0) {
        document.getElementById('foodLabel').innerHTML = 'empty..'
      } else {
        let goods = ''
        result.forEach(e => {
          goods += utils.hexCharCodeToStr(e) + ', '
        })
        document.getElementById('foodLabel').innerHTML = goods.substr(0, goods.length - 2)
      }
    })
  },
  transferMoney: function (currentAccount, DinningInstance, account) {
    const receivedAddr1 = document.getElementById('anotherAddress').value
    const receivedAddr = "0x" + sha256(receivedAddr1)
    const amount = parseInt(document.getElementById('amount').value)
    DinningInstance.transferMoney(0, currentAccount, receivedAddr, amount, { from: account })
    DinningInstance.TransferMoney(function (e, r) {
      if (!e) {
        console.log(r.args)
        alert(r.args.message)

      }
    })
  },
  buyFood: function (currentAccount, DinningInstance, account) {
    const goodId = document.getElementById('goodId').value
    DinningInstance.buyFood(currentAccount, goodId, { from: account, gas: 1000000 }).then(function () {
      DinningInstance.BuyFood(function (error, event) {
        if (!error) {
          console.log(event.args.message)
          window.App.setStatus(event.args.message)
        }
      })
    })
  },
  showCurrentAccount: function (currentAccount) {
    window.App.setStatus(currentAccount)
  }
}
