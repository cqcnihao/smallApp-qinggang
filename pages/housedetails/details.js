var userInfo = wx.getStorageSync('userInfo');
var app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    imgUrls: [],
    duration: 1000,//每个图片滑动速度,
    circular: true,//是否采用衔接滑动
    current: 0,//初始化时第一个显示的图片 下标值（从0）index
    preIndex: 0,
    houseName:'',//房名
    price:'',//价格
    peopleNum:'',//人数
    acreage:'',//面积
    roomNum:'',//房间数量 
    bedNum:'',//床位
    toilet:'',//卫
    introduce:'',//详情
    address:'',//位置
    facilities:'',//配套
    houseType:'',//户型
    orders: [] //该房源订单情况
    // houseInfo: {}, //保存房源相关所有信息 ,传递数据失败改用通过缓存
  },
  callback: function(res) {
    console.log(res.data);
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (res.data.code == "1") {//当code为1的时候
      that.setData({
        imgUrls: res.data.obj.imgs,
        price: res.data.obj.price,
        peopleNum: res.data.obj.peopleNum,
        acreage: res.data.obj.acreage,
        roomNum: res.data.obj.roomNum,
        bedNum: res.data.obj.bedNum,
        toilet: res.data.obj.toilet,
        introduce: res.data.obj.introduce,
        address: res.data.obj.address,
        facilities: res.data.obj.facilities,
        houseType: res.data.obj.houseType,
        houseName: res.data.obj.name,
        orders: res.data.obj.orders,
        userInfo: userInfo,
      })
      wx.setStorageSync("houseInfo", res.data.obj)
    }
  },
  onLoad: function(option) {
    var startTime = wx.getStorageSync('startTime');
    var endTime = wx.getStorageSync('endTime');
    var url = app.globalData.url + '/house/findOne?id=' + option.id;
    var data = {
      "liveTime": startTime,
      "leaveTime": endTime
    };
    util.sendRequest(url, 'GET', data, 'application/json', this.callback)
  },
  /**
 * 点击跳转到下单页面
 */
  immediatereservation: function () {
    var that = this;
    if(!that.data.userInfo) {
      wx.showModal({
        title: '提示',
        content: '用户未登录，无法提交预订，点击确定按钮前去登录',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/index',
            })
          }
        }
      })
    }
    else if (this.data.orders.length === 0 || this.data.orders === null) {
      wx.navigateTo({
        url: '../confirmationorder/confirmationorder',
      })
    } else {
      var orders = that.data.orders;
      var orderTime = [] ;//存放order中的入住时间和离开时间
      for (var i=0; i<orders.length; i++) {
        orderTime.push(orders[i].liveTime+" 至 "+orders[i].leaveTime);
      }
      var timeInterval = orderTime.join(" | "); //拼接orderTime中的每一项
      wx.showModal({
        title: '提示',
        content: '该房源 ' + timeInterval + ' 时间段已被预订，您可以选择其他房源或其他时间段',
        showCancel: false
      })  
    }
  },
  swiperChange: function(e) {
    this.setData({
      current: e.detail.current,
    });
  }
})