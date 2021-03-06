const utils = require('./utils')
var sha256 = require('js-sha256');

module.exports = {
  status : 0,

  newCook: function (DinningInstance, account) {
    const address1 = document.getElementById('cookAddress').value
    const address = '0x' + sha256.sha256(address1)
    const password = document.getElementById('cookPassword').value
    DinningInstance.newCook(address, password, { from: account, gas: 1000000 }).then(function () {
      DinningInstance.NewCook(function (error, event) {
        if (!error) {
          console.log(event.args.message)
          window.App.setStatus(event.args.message)
          sessionStorage.setItem('cook_account', address)
          sessionStorage.setItem('username', address1)
          window.location.href = "cook.html"
        }
      })
    })
  },

  cookLogin: function (DinningInstance, account) {
    const address1 = document.getElementById('cookLoginAddr').value
    const address = '0x' + sha256.sha256(address1)
    console.log(address)
    const password = document.getElementById('cookLoginPwd').value
    DinningInstance.getCookPassword(address, { from: account }).then(function (result) {
      if (result[0]) {
        if (password.localeCompare(utils.hexCharCodeToStr(result[1])) === 0) {
          console.log('登录成功')
          sessionStorage.setItem("cook_account", address)
          sessionStorage.setItem("username", address1)
          window.location.href = 'cook.html'
        } else {
          console.log('密码错误,登录失败')
          window.App.setStatus('密码错误，登录失败')
        }
      } else {
        console.log('该商户不存在，请确定账号后再登录！')
        window.App.setStatus('该商户不存在，请确定账号后再登录！')
      }
    })
  },
  getScoreWithCookAddr: function (currentAccount, DinningInstance, account) {
    console.log(currentAccount)
    DinningInstance.getScoreWithCookAddr.call(currentAccount, { from: account }).then(function (value) {
      window.App.setStatus('当前余额：' + value.valueOf())
    }).catch(function (e) {
      console.log(e)
      window.App.setStatus('出现异常，查询余额失败！')
    })
  },
  getCurrentCook: function (currentAccount) {
    window.App.setStatus(currentAccount)
  },
  transferScoreToAnotherFromCook: function (currentAccount, DinningInstance, account) {
    const receivedAddr = document.getElementById('anotherAccountAddr').value
    const amount = parseInt(document.getElementById('scoreAmount').value)
    DinningInstance.transferScoreToAnother(1, currentAccount, receivedAddr, amount, { from: account })
    DinningInstance.TransferScoreToAnother(function (error, event) {
      if (!error) {
        console.log(event.args.message)
        window.App.setStatus(event.args.message)
      }
    })
  },
  addFood: function (currentAccount, DinningInstance, account) {
    const goodId = document.getElementById('goodId').value
    const goodPrice = parseInt(document.getElementById('goodPrice').value)
    DinningInstance.addFood(currentAccount, goodId, goodPrice, { from: account, gas: 2000000 }).then(function () {
      DinningInstance.AddFood(function (error, event) {
        if (!error) {
          console.log(event.args.message)
          window.App.setStatus(event.args.message)
        }
      })
    })
  },
  getFoodsByCook: function (currentAccount, DinningInstance, account) {
    DinningInstance.getFoodsByCook.call(currentAccount, { from: account }).then(function (result) {
      console.log(result.length)
      console.log(result)
      if (result.length === 0) {
        window.App.setStatus('空...')
      }
      let allFoods = ''
      result.forEach(e => {
        allFoods += utils.hexCharCodeToStr(e) + ', '
      })
      allFoods = allFoods.substr(0, allFoods.length - 2)
      window.App.setStatus(allFoods)
    })
  },
  settleScoreWithBank: function (currentAccount, DinningInstance, account) {
    const settleAmount = parseInt(document.getElementById('settleAmount').value)
    DinningInstance.settleScoreWithBank(currentAccount, settleAmount, { from: account }).then(function () {
      DinningInstance.SettleScoreWithBank(function (error, event) {
        if (!error) {
          console.log(event.args.message)
          window.App.setStatus(event.args.message)
        } else {
          console.log('清算积分失败', error)
          window.App.setStatus('清算积分失败')
        }
      })
    })
  }
}
