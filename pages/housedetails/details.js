var userInfo = wx.getStorageSync('userInfo');

Page({
  data: {
    imgUrls: [],
    duration: 1000,//每个图片滑动速度,
    circular: true,//是否采用衔接滑动
    current: 0,//初始化时第一个显示的图片 下标值（从0）index
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

  onLoad: function(option) {
    var startTime = wx.getStorageSync('startTime');
    var endTime = wx.getStorageSync('endTime');
    var that = this;
    wx.request({
      url: 'http://192.168.1.6:8080/greenbar/house/findOne?id=' + option.id, //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        "liveTime": startTime, //客户首页选的
        "leaveTime": endTime, //客户首页选的
      },
      dataType: "json",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
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
            orders: res.data.obj.orders
            // houseInfo: res.data.obj
          })
          wx.setStorageSync("houseInfo", res.data.obj)
        } else {
          console.log(res.data.msg);
        }
      },
      fail: function (res) {
        console.log("网络异常");
      }
    })
  },
  /**
 * 点击跳转到下单页面
 */
  immediatereservation: function () {
    var that = this;
    // var data = JSON.stringify(this.data.houseInfo); 不知道怎么回事，前面可以用，现在失败了，改用缓存数据

    if (this.data.orders.length === 0 || this.data.orders === null) {
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
        content: timeInterval+ '时间段已满房，您可以选择其他房源或其他时间段',
        showCancel: false
      })  
    }
  }
})