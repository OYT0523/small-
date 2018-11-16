var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    untreated:[],
    agree:[],
    refused:[],
    recorde:'暂时没有记录哦',
    display:0,
    displayY:0,
    show:true,
    shows:true,
    showhide:true,
    showhides: true,
    untreatedPoint:true,
    agreePoint:true,
    refusePoint:true,
    flags:true
  },
  // 取消预约
  canc:function(e){
    console.log(e)
    var that = this
    let oppomentID = e.currentTarget.dataset.oppoid
    wx.showActionSheet({
      itemList: ['确认'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0){
          wx.request({
            url: 'https://yk.eeboo.cn/api/edit/appointmentstatus',
            method: "POST",
            data: {
              status: 6,
              appointment_id: oppomentID,
              xxx: "xxx"
            },
            success: function (res) {
              console.log(res)
              that.onLoad()
              setTimeout(function(){
                wx.showToast({
                  title: '取消成功',
                  icon: "none",
                  duration: 2000
                })
              },1000)
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
   
  },
  cancl:function(e){
    console.log(e)
    var that = this
    let oppoId = e.currentTarget.dataset.oppoid
    wx.showActionSheet({
      itemList: ['确认'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.request({
            url: 'https://yk.eeboo.cn/api/edit/appointmentstatus',
            method: "POST",
            data: {
              status: 6,
              appointment_id: oppoId,
              xxx: "xxx"
            },
            success: function (res) {
              console.log(res)
              setTimeout(function () {
                // wx.showToast({
                //   title: '取消成功',
                //   icon:"none",
                //   duration: 2000
                // })
              }, 1000)
              that.agree()
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    if (e.detail.current == 1){
      wx.showLoading({
        title: '正在加载',
        icon: 'loading',
      })
      that.setData({
        flags: false
      })
      var open = wx.getStorageSync("saas")
      wx.request({
        url: 'https://yk.eeboo.cn/api/user/apphistory',
        method: 'GET',
        data: {
          openid: open,
          status: 1
        },
        success: function (res) {
          that.setData({
            agree: res.data.data
          })
          if (res.data.data) {
            wx.hideLoading()
            that.setData({
              flags: true,
              shows: false
            })
          }
          if (res.data.data.length == 0) {
            wx.hideLoading()
            that.setData({
              showhide: false,
              flags: true
            })
          } else {
            that.setData({
              shows: false,
              showhide: true,
            })
          }
        }
      })
    }
    if (e.detail.current == 0){
      wx.showLoading({
        title: '正在加载',
        icon: 'loading',
      })
      that.setData({
        flags: false
      })
      var open = wx.getStorageSync("saas")
      wx.request({
        url: 'https://yk.eeboo.cn/api/user/apphistory',
        method: 'GET',
        data: {
          openid: open,
          status: 0
        },
        success: function (res) {
          that.setData({
            agree: res.data.data
          })
          if (res.data.data) {
            wx.hideLoading()
            that.setData({
              flags: true,
              shows: false
            })
          }
          if (res.data.data.length == 0) {
            wx.hideLoading()
            that.setData({
              show: false,
              flags: true
            })
          } else {
            that.setData({
              shows: false,
              show: true,
            })
          }
        }
      })
    }
    if (e.detail.current == 2){
      wx.showLoading({
        title: '正在加载',
        icon: 'loading',
      })
      that.setData({
        flags: false
      })
      var open = wx.getStorageSync("saas")
      wx.request({
        url: 'https://yk.eeboo.cn/api/user/apphistory',
        method: 'GET',
        data: {
          openid: open,
          status: 2
        },
        success: function (res) {
          that.setData({
            agree: res.data.data
          })
          if (res.data.data) {
            wx.hideLoading()
            that.setData({
              flags: true,
              shows: false
            })
          }
          if (res.data.data.length == 0) {
            wx.hideLoading()
            that.setData({
              showhides: false,
              flags: true
            })
          } else {
            that.setData({
              showhides: true,
              shows: false
            })
          }
        }
      })
    }
  },
  // 点击标题切换当前页时改变样式 
  // 未处理
  swichNav: function (e) {
    var that= this
    wx.showLoading({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      flags: false
    })
    var cur = e.target.dataset.current;
    if (that.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        currentTab: cur
      })
    }
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/apphistory',
      method: 'GET',
      data: {
        openid: open,
        status: 0
      },
      success: function (res) {
        that.setData({
          untreated: res.data.data
        })
        if (res.data.data) {
          wx.hideLoading()
          that.setData({
            flags: true,
            shows: false
          })
        }
        if (res.data.data.length == 0) {
          wx.hideLoading()
          that.setData({
            show: false,
            flags: true
          })
        } else {
          that.setData({
            shows: false,
            show: true,
          })
        }
      }
    })
    // 小红点消失
    wx.request({
      url: 'https://yk.eeboo.cn/api/flush/newapp',
      method:"GET",
      data:{
        openid: open,
        status:0
      },
      success:function(res){
        console.log(res)
        if(res.data.data == ""){
          that.setData({
            untreatedPoint:true
          })
        }else{

        }
      }
    })
  },
  // 已同意
  swichNavs: function (e) {
    var that = this
    var cur = e.target.dataset.current;
    console.log(e)
    wx.showLoading({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      flags:false
    })
    if (that.data.currentTaB == cur){ return false; }
    else {
      that.setData({
        currentTab: cur
      })
    }
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/apphistory',
      method: 'GET',
      data: {
        openid: open,
        status: 1
      },
      success: function (res) {
        that.setData({
          agree: res.data.data
        })
        if (res.data.data) {
          console.log(res.data.data)
          wx.hideLoading()
          that.setData({
            flags: true,
            shows: false
          })
        }
        if (res.data.data.length == 0) {
          wx.hideLoading()
          that.setData({
            showhide: false,
            flags:true
          })
        } else {
          that.setData({
            shows: false,
             showhide: true,
          })
        }
      }
    })
    // 小红点消失
    wx.request({
      url: 'https://yk.eeboo.cn/api/flush/newapp',
      method: "GET",
      data: {
        openid: open,
        status: 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == "") {
          that.setData({
            agreePoint: true
          })
        }else{

        }
      }
    })

  },
  swichNavz: function (e) {
    var that =this
    wx.showLoading({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      flags: false
    })
    var cur = e.target.dataset.current;
    if (that.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        currentTab: cur
      })
    }
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/apphistory',
      method: 'GET',
      data: {
        openid: open,
        status: 2
      },
      success: function (res) {
        that.setData({
          refused: res.data.data
        })
        if (res.data.data) {
          wx.hideLoading()
          that.setData({
            flags: true,
            shows: false
          })
        }
        if (res.data.data.length == 0) {
          wx.hideLoading()
          that.setData({
            showhides: false,
            flags: true
          })
        } else {
          that.setData({
            showhides: true,
            shows: false
          })
        }
      }
    })
    // 小红点消失
    wx.request({
      url: 'https://yk.eeboo.cn/api/flush/newapp',
      method: "GET",
      data: {
        openid: open,
        status: 2
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == "") {
          that.setData({
            refusePoint: true
          })
        }else{
          
        }
      }
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    app.updataApp();
    var that = this;
    var open = wx.getStorageSync("saas")
    wx.showLoading({
      title: '正在加载',
      icon: 'loading',
    })
    that.setData({
      flags:false
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });
    // 小红点提示
      // 未处理
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/statusnewapp',
      method:"GET",
      data:{
        openid: open,
        status:0
      },
      success:function(res){
        console.log(res)
        if(res.data.data.status0 !== 0){
          that.setData({
            untreatedPoint:false
          })
        }else{
          that.setData({
            untreatedPoint: true
          })
        }
      }
    })
    // 已同意
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/statusnewapp',
      method: "GET",
      data: {
        openid: open,
        status: 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.status1 !== 0) {
          that.setData({
            agreePoint: false
          })
        }else{
          that.setData({
            agreePoint: true
          })
        }
      }
    })
    // 已拒绝
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/statusnewapp',
      method: "GET",
      data: {
        openid: open,
        status: 2
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.status2 !== 0) {
          that.setData({
            refusePoint: false
          })
        }else{
          that.setData({
            refusePoint: true
          })
        }
      }
    })

    // // 判断是否授权
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       that.setData({
    //         // display: true
    //       })
    //     } else {
    //       // 未授权
    //       that.setData({
    //         show: false,
    //       })
    //     }
    //   }
    // })

    // 未处理
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/apphistory',
      method:'GET',
      data:{
        openid:open,
        status:0
      },
      success:function(res){
        console.log(res.data.data)
          that.setData({
            untreated:res.data.data
          })
        if(res.data.data){
          wx.hideLoading()
          that.setData({
            flags:true,
            shows:false
          })
        }
        if (res.data.data.length == 0) {
          wx.hideLoading()
          that.setData({
            show: false,
            flags: true
          })
        }else{
          that.setData({
            shows: false
          })
        }
      }
    })
  },
  agree:function(){
    var that = this
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/apphistory',
      method: 'GET',
      data: {
        openid: open,
        status: 1
      },
      success: function (res) {
        that.setData({
          agree: res.data.data
        })
        if (res.data.data) {
          console.log(res.data.data)
          wx.hideLoading()
          that.setData({
            flags: true,
            shows: false
          })
        }
        if (res.data.data.length == 0) {
          wx.hideLoading()
          that.setData({
            showhide: false,
            flags: true
          })
        } else {
          that.setData({
            shows: false,
            showhide: true,
          })
        }
      }
    })
  },
  footerTap: app.footerTap
})