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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// function json2Form(json) {
//   var str = [];
//   for (var p in json) {
//     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
//   }
//   return str.join("&");
// }
function countDayMount(livetime, leavetime) {
  var leaveYear = Number(leavetime.split("-")[0]);
  var leaveTimeMonth = Number(leavetime.split("-")[1]);
  var leaveDay = Number(leavetime.split("-")[2]);
  var leaveDate = new Date(leaveYear, leaveTimeMonth, leaveDay);
  var leaveTime = leaveDate.getTime();
  var startYear = Number(livetime.split("-")[0]);
  var startTimeMonth = Number(livetime.split("-")[1]);
  var startDay = Number(livetime.split("-")[2]);
  var startDate = new Date(startYear, startTimeMonth, startDay);
  var livetime = startDate.getTime();
  //计算入住的天数
  var day = parseInt((leaveTime - livetime) / (1000 * 60 * 60 * 24));

  return day
}

module.exports = {
  formatTime: formatTime,
  getDateStr: getDateStr,
  countDayMount: countDayMount
}
