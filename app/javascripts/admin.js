

var sha256 = require('js-sha256');
module.exports = {

  adminLogin: function (DinningInstance, account) {
    const address = document.getElementById('adminLoginAddr').value
    DinningInstance.getOwner({ from: account }).then(function (result) {
      if (address.localeCompare(result) === 0) {
        sessionStorage.setItem("admin_account", address)
        window.location.href = 'index.html'
      } else {
        window.alert('不是管理账户，登录失败')
      }
    })
  },

  sendMoneyToStudent: function (DinningInstance, account) {
    const address1 = document.getElementById('studentAddress').value
    const address = '0x' + sha256.sha256(address1)
    const amount = parseInt(document.getElementById('amount').value)
    console.log(amount)
    DinningInstance.sendMoneyToStudent(address, amount, { from: account })
    DinningInstance.SendMoneyToStudent(function (e, r) {
      if (!e) {
        console.log(r.args.message)
        window.App.setStatus(r.args.message)
      }
    })
  },

  getIssuedAmount: function (DinningInstance, account) {
    DinningInstance.getIssuedAmount({ from: account }).then(function (result) {
      document.getElementById('amountLabel').innerHTML = result
    })
  },
}
