
App({
  onLaunch: function () {
    // var that = this;
    // wx.login({
    //   success: function(res) {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     if(res.code) {
    //       wx.getUserInfo({
    //         withCredentials: true,
    //         success: function (res_user) {
    //           //发起网络请求
    //           wx.request({
    //             url: 'http://192.168.1.3:8080/greenbar/user/add',
    //             data: {
    //               "code": res.code,
    //               "portrait": res_user.userInfo.avatarUrl,
    //               "nickname": res_user.userInfo.nickName,
    //             },
    //             method: 'POST',
    //             header: {
    //               'content-type': 'application/x-www-form-urlencoded'
    //             },
    //             success: function(res) {
    //               that.globalData.userInfo = res.data.obj;
    //             },
    //             fail: function () {
    //               console.log('获取信息失败');
    //             }
    //           })
    //         }
    //       });
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }

    //   }
    // })
  },
  globalData: {
    userInfo: '',
  }
})