
Page({

  data: {
  },

  onLoad: function (options) {
    var allHouseInfo = JSON.parse(options.allHouseInfo);
    this.setData({
      allHouseInfo: allHouseInfo
    })
  },
  bindHouseDetails: function (event) {
    wx.navigateTo({
      url: '../housedetails/details?id=' + event.currentTarget.id,
    })
  }
})