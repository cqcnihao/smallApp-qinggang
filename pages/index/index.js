//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var post_ip = "http://192.168.1.3:8080/";
var post_find_house_by_date = "greenbar/house/findByTime";
var post_find_house_all ="greenbar/house/findAll";

Page({
  data:{
      imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    /**轮播组件参数设置 */
      indicatorDots: false,  //面板是否显示指示点
      autoplay: true,       //自动播放
      interval: 5000,    //自动切换时间间隔
      duration: 1000,    //滑动动画时长
      ActiveColor: "#6495ED",   //当前选中指示点颜色
      /**根据日期搜索房源 */
      search_button_size: "mini",//按钮大小
      search_button_type: "primary",//按钮的样式类型
      end_time: util.getDateStr(util.formatTime(new Date()), 1),//结束时间上传数据
      start_time: util.formatTime(new Date()),//开始时间上传数据
      start_time_date: util.formatTime(new Date()).split("-", 3)[1] + "月" + util.formatTime(new Date()).split("-", 3)[2] + "日",//开始时间显示
      end_time_date: util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[1] + "月" + util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[2] + "日",//结束时间显示
      listData: [
        { "code": "01", "text": "text1", "type": "type1" },
      ],//表格样式
      //房源图片
      houseImg: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      houseArray:null,//房源json数据
  },
  /**
   * 页面加载时绘制所有房源
   */
  onLoad: function (options) { 
    var that = this;
    /**接口访问 */
    wx.request({
      url: 'http://192.168.1.3:8080/greenbar/house/findByTime',
      method: "GET",
      data: {
        "liveTime": that.data.start_time,
        "leaveTime": that.data.end_time
      },
      dataType: "json",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == "1") {//当code为1的时候
          that.setData({
            houseArray: res.data.obj,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          });
        } else {
          console.log(res.data.msg);
        }

      },
      fail: function (error) {
        console.log(error);
      }
    }),
    //缓存开始时间和结束时间
    wx.setStorageSync('startTime', that.data.start_time);
    wx.setStorageSync('endTime', that.data.end_time);
  },
  /**
   * 开始时间选择功能
   */
  bindStartDateChange:function(e){
    this.setData({
      start_time: e.detail.value,
      end_time: util.getDateStr(e.detail.value, 1),
      start_time_date: e.detail.value.split("-", 3)[1] + "月" + e.detail.value.split("-", 3)[2]+"日",
      end_time_date: util.getDateStr(e.detail.value, 1).split("-", 3)[1] + "月" + util.getDateStr(e.detail.value, 1).split("-", 3)[2] + "日",
      
    });
    //更新缓存开始时间和结束时间
    wx.setStorageSync('startTime', e.detail.value);
    wx.setStorageSync('endTime', util.getDateStr(e.detail.value, 1));

  },
  /**
   * 结束时间选择功能
   */
  bindEndDateChange:function(e){
    this.setData({
      end_time: e.detail.value,
      end_time_date: e.detail.value.split("-", 3)[1] + "月" + e.detail.value.split("-", 3)[2] + "日",
    });
    //更新缓存的结束时间
    wx.setStorageSync('endTime', e.detail.value);
  },
    /**
   * 获取开始时间和结束时间查询房源
   */
  bindSearchDate:function(e){
    var that = this;
    /**接口访问 */
    wx.request({
      url: 'http://192.168.1.3:8080/greenbar/house/findByTime', //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        "liveTime": that.data.start_time,
        "leaveTime": that.data.end_time
      },
      dataType: "json",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == "1") {//当code为1的时候
          that.setData({
            houseArray: res.data.obj,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
        } else {
          console.log(res.data.msg);
        }

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 点击房源获取id
   */
  bindHouseDetails:function(event){
    wx.navigateTo({
      url: '../housedetails/details?id=' + event.currentTarget.id,
    })
  }
})