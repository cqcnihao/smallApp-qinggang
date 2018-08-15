var util = require('../../../../utils/util.js');
var app = getApp();

Page({
  data: {
    showDutyNum: false,
    showBtn: true
  },
  onLoad: function (options) {
    var orderDetails = JSON.parse(options.orderDetails);
    this.setData({
      orderDetails: orderDetails
    })
  },
  //每次页面加载的时候实时查询订单 获取发票状态，为true是按钮不显示
  onShow: function() {
    var url = app.globalData.url + '/order/findOne?id=' + this.data.orderDetails.id;
    util.sendRequest(url, 'GET', '', 'application/json', this.onShowCallback);   
  },
  onShowCallback: function(res) {
    var invoiceStatus = res.data.obj.invoice;
    if (invoiceStatus === 'true') {
      this.setData({
        showBtn: false
      })
    }
  },
  //抬头类型为企业时才显示税号填写项
  radioChange: function(event) {
    var value = event.detail.value;
    if ( value === "company") {
      this.setData({
        showDutyNum: true
      })
    } else {
      this.setData({
        showDutyNum: false
      })
    }
  },
  callback: function(res) {
    var invoiceStatus = res.data.msg.invoice
    wx.showModal({
      title: '提示',
      content: '您的开票信息我们已收到，将会在7个工作日内给您寄出发票',
      showCancel: false
    })
    // 发票状态为 'true' 时按钮不显示
    if (invoiceStatus === 'true') {
      this.setData({
        showBtn: false
      })
    }
  },
  formSubmit: function(event) {
    var content = event.detail.value;
    if (content.name === "") {
      wx.showModal({
        title: '提示',
        content: '发票抬头不能为空',
        showCancel: false
      })
    } else if (content.linkman === "") {
      wx.showModal({
        title: '提示',
        content: '收件人不能为空',
        showCancel: false
      })
    } else if (!/^1\d{10}$/.test(content.phone)) {
      wx.showModal({
        title: '提示',
        content: '联系电话不能为空且需要正确号码',
        showCancel: false
      })
    } else if (content.address === "") {
      wx.showModal({
        title: '提示',
        content: '邮寄地址不能为空',
        showCancel: false
      })
    } else if (content.num === "") {
      wx.showModal({
        title: '提示',
        content: '纳税人识别号不能为空',
        showCancel: false
      })
    } else {
      var url = app.globalData.url + '/order/invoice';
      var data = {
        "address": content.address,
        "linkman": content.linkman,
        "name": content.name,
        "num": content.num || "",
        "orderId": this.data.orderDetails.id,
        "phone": content.phone,
        "price": this.data.orderDetails.price
      }
      util.sendRequest(url, 'POST', data, 'application/json', this.callback)
    }
  }
})