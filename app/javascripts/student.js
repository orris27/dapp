const utils = require('./utils')
module.exports = {
  // 注册客户
  newStudent: function (DinningInstance, account) {
    const address = document.getElementById('studentAddress').value
    const password = document.getElementById('studentPassword').value
    console.log(address + ' ' + password)
    DinningInstance.newStudent(address, password, { from: account, gas: 3000000 }).then(function () {
      DinningInstance.NewStudent(function (e, r) {
        if (!e) {
          console.log(r)
          console.log(r.args)
          if (r.args.isSuccess === true) {
            window.App.setStatus('注册成功')
          } else {
            window.App.setStatus('账户已经注册')
          }
        } else {
          console.log(e)
        }
      })
    })
  },
  // 客户登录
  studentLogin: function (DinningInstance, account) {
    const address = document.getElementById('studentLoginAddr').value
    const password = document.getElementById('studentLoginPwd').value
    DinningInstance.getStudentPassword(address, { from: account, gas: 3000000 }).then(function (result) {
      if (result[0]) {
        // 查询密码成功
        if (password.localeCompare(utils.hexCharCodeToStr(result[1])) === 0) {
          console.log('登录成功')
          // 跳转到用户界面
          window.location.href = 'student.html?account=' + address
          localStorage.setItem("account", address)
        } else {
          console.log('密码错误，登录失败')
          window.App.setStatus('密码错误，登录失败')
        }
      } else {
        // 查询密码失败
        console.log('该用户不存在，请确定账号后再登录！')
        window.App.setStatus('该用户不存在，请确定账号后再登录！')
      }
    })
  },
  //查询余额
  getStudentBalance: function (currentAccount, DinningInstance, account) {
    DinningInstance.getStudentBalance.call(currentAccount, { from: account }).then(function (value) {
      window.App.setStatus('当前余额：' + value.valueOf())
    }).catch(function (e) {
      console.log(e)
      window.App.setStatus('出现异常，查询余额失败！')
    })
  },
  //获取已经购买的物品
  getFoodsByStudent: function (currentAccount, DinningInstance, account) {
    DinningInstance.getFoodsByStudent.call(currentAccount, { from: account }).then(function (result) {
      if (result.length === 0) {
        window.App.setStatus('空...')
      } else {
        let goods = ''
        result.forEach(e => {
          goods += utils.hexCharCodeToStr(e) + ', '
        })
        window.App.setStatus(goods.substr(0, goods.length - 2))
      }
    })
  },
  // 客户实现任意的积分转让
  transferMoney: function (currentAccount, DinningInstance, account) {
    const receivedAddr = document.getElementById('anotherAddress').value
    const amount = parseInt(document.getElementById('scoreAmount').value)
    DinningInstance.transferMoney(0, currentAccount, receivedAddr, amount, { from: account })
    DinningInstance.TransferMoney(function (e, r) {
      if (!e) {
        console.log(r.args)
        window.App.setStatus(r.args.message)
      }
    })
  },
  // 购买物品
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
  // 查看当前账户信息
  showCurrentAccount: function (currentAccount) {
    window.App.setStatus(currentAccount)
  }
}
