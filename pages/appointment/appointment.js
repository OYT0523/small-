const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    day: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    list: "",
    time: 0,
    flag: true,
    shijian: 0,
    name: 0,
    tel: 0,
    doctor: 0,
    currentDay: 0,
    cuurent: 0,
    statusNine: 0,
    Day: 0,
    flags: true,
    timeshow: false,
    showModalStatus: false,
    notice_message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.updataApp();
    wx.request({
      url: 'https://yk.eeboo.cn/api/beizhu',
      method: "GET",
      success: function (res) {
        wx.hideLoading()
          that.setData({
            notice_message:res.data
          })
      }
    })

    // 获取日期
    var that = this
    let day = new Date();
    let Year = 0;
    let Month = 0;
    let Day = 0;
    let CurrentDate = "";
    //初始化时间
    //Year = day.getYear();//有火狐下2008年显示108的bug
    Year = day.getFullYear(); //ie火狐下都可以
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10) {
      CurrentDate += Month + "-";
    } else {
      CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
      CurrentDate += Day;
    } else {
      CurrentDate += "0" + Day;
    }
    let s = CurrentDate.split("-").join("")

    that.setData({
      currentDay: s
    })
    // 获取某个医生预约时间段

    var currentDay = that.data.currentDay
    var open = wx.getStorageSync("saas")
    let doctorId = options.id
    that.setData({
      doctor: doctorId
    })
    wx.showLoading({
      title: '正在加载排班表',
    });
    // console.log(doctorId)
    wx.request({
      method: "GET",
      url: 'https://yk.eeboo.cn/api/get/doctorapps',
      data: {
        doctor_id: doctorId,
        device: "app",
        date: currentDay,
        openid: open
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == "0") {
          that.setData({
            list: res.data.data,
            statusNine: res.data.data[800]
          });
        } else {
          wx.showModal({
            title: '错误',
            content: '加载排班表失败，请点击确认重试',
            showCancel: false,
            success: function () {
              console.log(111);
            }
          })
        }
      },
      fail: function (){
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络有点不好哦~，请重试',
          showCancel: false
        })
      }
    });

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let rizi = now.getDate()
    if (rizi < 10) {
      rizi = '0' + rizi
    }
    let months = now.getMonth() + 1;
    if (months < 10) {
      months = '0' + months
    }
    let riqi = now.getDate()
    if (riqi < 10) {
      riqi = '0' + riqi
    }
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      Day: rizi,
      isToday: '' + year + month + rizi,
      istoday: '' + year + months + riqi
    })
  },

  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    let Month = month + 1
    if (Month < 10) {
      Month = "0" + Month
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (num < 10) {
          num = "0" + num;
        }
        obj = {
          isToday: '' + year + (Month) + num,
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },

  // 点击日历获取某个医生某天的排班情况
  clicks: function(e) {
    // 点击日历添加样式
    var that = this
    var open = wx.getStorageSync("saas")
    var dateId = e.currentTarget.dataset.date
    that.setData({
      key: e.currentTarget.dataset.index,
      currentDay: dateId,
      flags: false
    })
    wx.showLoading({
      title: '正在加载排班表',
    })
    var doctor = that.data.doctor;
    wx.request({
      url: 'https://yk.eeboo.cn/api/get/doctorapps',
      method: "GET",
      data: {
        doctor_id: doctor,
        device: "app",
        date: dateId,
        openid: open
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.data[900] == 0) {
          that.setData({

          })
        }
        that.setData({
          list: res.data.data,
          statusNine: res.data.data[900],
          flags: true
        })
      }
    })
  },
  // 用户添加预约
  click: function(e) {
    
    // 弹出框显示隐藏
    var statusId = e.currentTarget.dataset.status;
    var timeId = e.currentTarget.dataset.timeid;
    if (statusId == 0 || statusId == 2) {
      this.setData({
        flag: true,
      })
      wx.showToast({
        title: '该时间段不可预约',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        flag: false,
        shijian: timeId
      })
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    }

  },
  // 获取input框输入值
  xing: function(e) {
    let xingming = e.detail.value;
    this.setData({
      name: xingming
    })
  },
  tel: function(e) {
    let Tel = e.detail.value;
    this.setData({
      tel: Tel
    })
  },
  // 隐藏弹窗
  hide: function(e) {
    var that = this
    var quantum = that.data.shijian;
    var Na = that.data.name;
    var tels = that.data.tel;
    var currentlyDay = that.data.currentDay;
    var doctor = that.data.doctor;
    var openID = wx.getStorageSync("saas")

    if (Na == "" || tels == "") {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (Na !== "" && tels !== "") {
      wx.request({
        url: 'https://yk.eeboo.cn/api/user/addappointment',
        method: "POST",
        data: {
          time: quantum,
          phone: tels,
          date: currentlyDay,
          realname: Na,
          openid: openID,
          doctor_id: doctor
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              showModalStatus: false
            })
           
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    }
  },
  hides: function() {
    this.setData({
      flag: true
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 300,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).translateY(100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).translateY(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 400)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // var that = this
    // that.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loopRequest: function () {
    var that = this;
    
  }
})