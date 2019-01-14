module.exports = {

  //默认coinbase是银行账户
  adminLogin: function (DinningInstance, account) {
    const address = document.getElementById('adminLoginAddr').value
    DinningInstance.getOwner({ from: account }).then(function (result) {
      if (address.localeCompare(result) === 0) {
        // 跳转到管理员页面
        window.location.href = 'admin.html?account=' + address
      } else {
        window.alert('不是银行账户，登录失败')
      }
    })
  },

  // 银行向顾客发送积分
  sendMoneyToStudent: function (DinningInstance, account) {
    const address = document.getElementById('customerAddress').value
    const score = document.getElementById('scoreAmount').value
    DinningInstance.sendMoneyToStudent(address, score, { from: account })
    DinningInstance.sendMoneyToStudent(function (e, r) {
      if (!e) {
        console.log(r.args.message)
        window.App.setStatus(r.args.message)
      }
    })
  },

  // 银行获取已经发行的积分
  getIssuedAmount: function (DinningInstance, account) {
    DinningInstance.getIssuedAmount({ from: account }).then(function (result) {
      window.App.setStatus('已发行的餐券总数为：' + result)
    })
  },
}
