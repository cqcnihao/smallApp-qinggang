var post_ip ="http://192.168.1.3:8080/";
/**
 * 获取指定格式的当前时间
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}
/**
 * 获取指定格式的当前时间
 */
function getDateStr(today, addDayCount) {
  var dd;
  if (today) {
    dd = new Date(today);
  } else {
    dd = new Date();
  }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "-" + m + "-" + d;
}
/**
 * 接口
 */
function uploadData(posturl, data, methodtepy, success_function){
  wx.request({
    url: post_ip+posturl, //仅为示例，并非真实的接口地址
    method: methodtepy,
    dataType:"json",
    data: {data},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.data.code=="1"){
        console.log(res.data);
        success_function(res.data);
        
      }else{
        console.log(res.data.msg);
      }
      
    },
    fail:function(res){
      console.log("网络异常");
    }
  })
  
}
function resultData(data){
  that.setData({
    houseArray:data.obj
  })
  console.log(data.obj);
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

module.exports = {
  formatTime: formatTime,
  uploadData: uploadData,
  resultData: resultData,
  getDateStr: getDateStr,
  json2Form: json2Form
}
