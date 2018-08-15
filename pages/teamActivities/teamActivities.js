
Page({

  data: {
  
  },
  contactKefu: function() {
    wx.showModal({
      title: '提示',
      content: '拨打客服热线： 028-3301 0517',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '028-3301 0517'
          })
        }
      }
    })
  }
})