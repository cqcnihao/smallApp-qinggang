
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data:{
      imgUrls: [], //首页图片
    /**轮播组件参数设置 */
      indicatorDots: false,  //面板是否显示指示点
      autoplay: true,       //自动播放
      interval: 3000,    //自动切换时间间隔
      duration: 1000,    //滑动动画时长
      ActiveColor: "#6495ED",   //当前选中指示点颜色
      end_time: util.getDateStr(util.formatTime(new Date()), 1),//结束时间上传数据
      start_time: util.formatTime(new Date()),//开始时间上传数据
      start_Time: util.formatTime(new Date()),
      end_Time: util.getDateStr(util.formatTime(new Date()), 1),
      start_time_date: util.formatTime(new Date()).split("-", 3)[1] + "月" + util.formatTime(new Date()).split("-", 3)[2] + "日",//开始时间显示
      end_time_date: util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[1] + "月" + util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[2] + "日",//结束时间显示
      listData: [
        { "code": "01", "text": "text1", "type": "type1" },
      ],//表格样式
      houseArray:null,//房源json数据
  },
  onLoad: function (options) {
    var data = this.data;
    var day= util.countDayMount(data.start_time, data.end_time);
    var url = app.globalData.url + '/page/imgs';
    util.sendRequest(url, 'GET', '', 'application/json', this.imgsCallback)
    this.setData({
      day: day
    })
    //页面加载的时候就缓存初始的开始时间，结束时间，入住天数
    wx.setStorageSync('dayCount', day);
    wx.setStorageSync('startTime', data.start_time); 
    wx.setStorageSync('endTime', data.end_time);
  },
  imgsCallback: function(res) {
    this.setData({
      imgUrls: res.data.obj
    })
  },
  /**
   * 开始时间选择功能
   */
  bindStartDateChange:function(e){
    var start_time = e.detail.value;
    var end_time = util.getDateStr(e.detail.value, 1);
    var day = util.countDayMount(start_time, end_time);
    this.setData({
      start_time: start_time,
      end_time: end_time,
      end_Time: end_time,
      start_time_date: start_time.split("-", 3)[1] + "月" + start_time.split("-", 3)[2]+"日",
      end_time_date: util.getDateStr(start_time, 1).split("-", 3)[1] + "月" + util.getDateStr(start_time, 1).split("-", 3)[2] + "日",
      day: day
    });
    //更新缓存开始时间和结束时间和天数
    wx.setStorageSync('startTime', e.detail.value);
    wx.setStorageSync('endTime', util.getDateStr(e.detail.value, 1));
    wx.setStorageSync('dayCount', day);
  },
  /**
   * 结束时间选择功能
   */
  bindEndDateChange:function(e){
    var end_time = e.detail.value;
    var start_time = this.data.start_time;
    var day = util.countDayMount(start_time, end_time);
    this.setData({
      end_time_date: end_time.split("-", 3)[1] + "月" + end_time.split("-", 3)[2] + "日",
      day: day
    });
    //更新缓存的结束时间和天数
    wx.setStorageSync('endTime', e.detail.value);
    wx.setStorageSync('dayCount', day);
  },
    /**
   * 获取开始时间和结束时间查询房源
   */
  callback: function(res) {
    var that = this;
    if (res.data.code == "1") {
          that.setData({
            houseArray: res.data.obj,
          })
          var allHouseInfo = JSON.stringify(that.data.houseArray);
          wx.navigateTo({
            url: '/pages/houseInfo/houseInfo?allHouseInfo=' + allHouseInfo
          })
    }
  },
  bindSearchDate:function(e){
    //不能在前面时间选择事件处理程序里面设置开始时间和离开data数据，会导致时间选择了某个月份后无法再选它前一个月的bug,通过缓存解决
    var startTime = wx.getStorageSync('startTime'); 
    var endTime = wx.getStorageSync('endTime');
    var that = this;
    var url = app.globalData.url + '/house/findByTime';
    var data = {
      "liveTime": startTime,
      "leaveTime": endTime
    };
    util.sendRequest(url, 'GET', data, 'application/json', this.callback)
  },
  toTeamPage: function() {
    wx.navigateTo({
      url: '/pages/teamActivities/teamActivities',
    })
  }
})