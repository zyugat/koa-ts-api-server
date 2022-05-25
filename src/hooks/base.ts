function createOrderNum() {
  let setTimeDateFmt = s => {
    return s < 10 ? '0' + s : s
  }
  const now = new Date()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let hour = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  month = setTimeDateFmt(month)
  day = setTimeDateFmt(day)
  hour = setTimeDateFmt(hour)
  minutes = setTimeDateFmt(minutes)
  seconds = setTimeDateFmt(seconds)
  let orderCode =
    now.getFullYear().toString() +
    month.toString() +
    day +
    hour +
    minutes +
    seconds +
    Math.round(Math.random() * 100000000).toString()
  return orderCode
  //基于年月日时分秒+随机数生成订单编号
}

export { createOrderNum }
