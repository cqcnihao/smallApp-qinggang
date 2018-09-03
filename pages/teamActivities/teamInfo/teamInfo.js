var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time: util.formatTime(new Date()),
    start_Time: util.formatTime(new Date()),
    start_time_date: util.formatTime(new Date()).split("-", 3)[1] + "月" + util.formatTime(new Date()).split("-", 3)[2] + "日",
    end_time: util.getDateStr(util.formatTime(new Date()), 1),
    end_Time: util.getDateStr(util.formatTime(new Date()), 1),
    end_time_date: util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[1] + "月" + util.getDateStr(util.formatTime(new Date()), 1).split("-", 3)[2] + "日",
    imgUrl: '/img/id-1.png',
    tempFilePaths: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = this.data;
    var day = util.countDayMount(data.start_time, data.end_time);
    this.setData({
      day: day,
      id: options.id
    })
  },
  bindStartDateChange: function(e) {
    var start_time = e.detail.value;
    var end_time = util.getDateStr(e.detail.value, 1);
    var day = util.countDayMount(start_time, end_time);
    this.setData({
      start_time: start_time,
      end_time: end_time,
      end_Time: end_time,
      start_time_date: start_time.split("-", 3)[1] + "月" + start_time.split("-", 3)[2] + "日",
      end_time_date: util.getDateStr(start_time, 1).split("-", 3)[1] + "月" + util.getDateStr(start_time, 1).split("-", 3)[2] + "日",
      day: day
    });
  },
  bindEndDateChange: function(e) {
    var end_time = e.detail.value;
    var start_time = this.data.start_time;
    var day = util.countDayMount(start_time, end_time);
    this.setData({
      end_time: end_time,
      end_time_date: end_time.split("-", 3)[1] + "月" + end_time.split("-", 3)[2] + "日",
      day: day
    });
  },
  submitIdFront: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData ({
          imgUrl: tempFilePaths,
          tempFilePaths: tempFilePaths,
        })
      },
      fail: function() {
        console.log('上传照片失败')
      }
    })
  },
  formSubmit: function(e) {
    var formValue = e.detail.value;
    this.setData({
      formValue: formValue
    })
    if (formValue.linkman === '') {
      wx.showModal({
        title: '提示',
        content: '联系人不能为空',
        showCancel: false
      })
    } else if (!/^1\d{10}$/.test(formValue.phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        showCancel: false
      })
    } else if (this.data.tempFilePaths === '') {
      wx.showModal({
        title: '提示',
        content: '身份证正面照片不能为空',
        showCancel: false
      }) 
    } else {
      //提交信息
      var that = this;
      var url = app.globalData.url + '/whole/add'
      wx.uploadFile({ 
        url: url,  //后台地址
        filePath: that.data.imgUrl[0], //图片地址
        name: 'file',
        method: 'POST',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          "linkman": formValue.linkman, //联系人
          "phone": formValue.phone,   //联系电话
          "liveTime": that.data.start_time, //入住时间
          "leaveTime": that.data.end_time,  //离开时间
          "id": that.data.id //用户id
        }, //上传的数据
        success: function (res) {
          var data = JSON.parse(res.data);
          if(data.code === 1) {
            wx.showModal({
              title: '提示',
              content: '信息提交成功，我们工作人员随后会联系您。',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    formValue: '',
                    imgUrl: '/img/id-1.png'
                  })
                }
              }
            }) 
          }
        },
        fail: function() {
          console.log('上传文件失败')
        }
      })
    }
  }
})