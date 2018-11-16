const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    tel: 0,
    patientInfo: {},
    currentDay: 0,
    currentYear: 0,
    appoment: 0,
    display:true,
    displayY:true,
    flags:true
  },
  // drawAfter: function () {
  //   wx.canvasToTempFilePath({
  //     x: 100,
  //     y: 200,
  //     width: 100,
  //     height: 500,
  //     destWidth: 300,
  //     destHeight: 300,
  //     canvasId: 'myC',
  //     success: (res) => {
  //       console.log(res.tempFilePath);
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //     },
  //   })
  // },
  // 保存
  baocun: function () {
    var that = this
    console.log(123)
    that.setData({
      flags: false
    })
    wx.showLoading({
      title: '正在保存',
      icon: 'loading',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: 'myC',
      success: function (res) {
        that.setData({
          link: res.tempFilePath
        })
        console.log(that.data.link)
        wx.saveImageToPhotosAlbum({
          filePath: that.data.link,
          success(res) {
            console.log(res)
           setTimeout(function(){
             wx.showToast({
               title: '保存成功',
               icon: 'none',
               duration: 2000
             })
             that.setData({
               flags: true
             })
           },1200)
          
          }
        })
      }
    }) 
   
   
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('您已授权')
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.updataApp();
    var that = this;
    var myDate = new Date()
    var mytime = myDate.toLocaleTimeString()
    that.setData({
      currentDay: mytime
    })
    var myYear = myDate.toLocaleDateString()
    var xx = myYear.replace('/', '-')
    var xxx = xx.replace('/', '-')
    that.setData({
      currentYear: xxx
    })

    wx.connectSocket({
      url: 'wss://yk.eeboo.cn:9503',

    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })


    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/openid/exists',
      method: "GET",
      data: {
        openid: open
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          patientInfo: res.data.data,
        })
        if(res.data.data){
          const ctx = wx.createCanvasContext('myC')
          ctx.setTextAlign('center')
          ctx.setFontSize(20);
          ctx.setFillStyle('#3e3e3e');
          ctx.fillText(res.data.data.realname, 150, 40);
          ctx.setFillStyle('#3e3e3e');
          ctx.setFontSize(23);
          ctx.fillText('您的排队号码是：', 150, 80);
          ctx.setFillStyle('#3e3e3e');
          ctx.setFontSize(25);
          ctx.fillText(res.data.data.user_code, 150, 130);
          ctx.setFillStyle('#595959');
          ctx.setFontSize(18);
          ctx.fillText('您预约的医生是:' + res.data.data.doctor_name, 150, 180);
          ctx.draw()
        }
    
        if (res.data.code == 0) {
          that.setData({
            display: true,
            displayY: false
          })
         }
        if (res.data.code == 301) {
          that.setData({
            hiddenmodalput: false,
            // displayY:true
          });
        }
        if(res.data.code == 302){
          wx.showToast({
            title: '请等待医生同意您的预约，预约成功后请注意短信通知',
            icon: 'none',
            duration: 2500
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/sweep/sweep',
            })
          }, 2500)

        }
      }
    }) 
  },
  // 点击打印
  daying: function () {
    var that = this
    that.setData({
      flags: false
    })
    let appomentId = that.data.patientInfo.appointment_id
    wx.request({
      url: 'https://yk.eeboo.cn/api/is/printed',
      method:"GET",
      data:{
        appointment_id: appomentId
      },
      success:function(res){
        console.log(res)
         if(res.data.code == 0){
           that.setData({
             flags: false
           })
           wx.showLoading({
             title: '正在打印',
             icon: 'loading',
           })
           wx.sendSocketMessage({
             data: 'print_' + appomentId
           })
           wx.onSocketClose(function (res) {
             console.log('WebSocket 已关闭！')
           })
            var req = setInterval(function(){
             wx.request({
               url: 'https://yk.eeboo.cn/api/is/printed',
               method: "GET",
               data: {
                 appointment_id: appomentId
               },
               success:function(res){
                 console.log(res.data)
                 if(res.data.code == 302){
                   wx.hideLoading()
                   that.setData({
                     flags: true
                   })
                   clearInterval(req)
                 }else{

                 }
               }
             })
           },1000)
         }else{
           that.setData({
             flags: true
           })
           wx.showToast({
             title: res.data.msg,
             icon: 'none',
             duration: 2000
           })
           return
         }
      }
    })
    
  },
  // 获取弹出框的值
  numb: function (e) {
    let modalNum = e.detail.value;
    this.setData({
      tel: modalNum
    })
  },

  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function () {
    var that = this;
    that.setData({
      hiddenmodalput: true
    })
    var open = wx.getStorageSync("saas")
    var Phone = that.data.tel;
    wx.request({
      url: 'https://yk.eeboo.cn/api/get/userinfo',
      method: 'GET',
      data: {
        openid: open,
        phone: Phone
      },
      success: function (res){
        console.log(res)
        if(res.data.code == 302){
           wx.showToast({
            title: '您还没有预约',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/sweep/sweep',
            })
          }, 2000)
        // 
        }
        if(res.data.code == 0){
           that.setData({
             displayY:false,
             patientInfo:res.data.data 
           });
          const ctx = wx.createCanvasContext('myC')
          ctx.setTextAlign('center')
          ctx.setFontSize(20);
          ctx.setFillStyle('#3e3e3e');
          ctx.fillText(res.data.data.realname, 150, 40);
          ctx.setFillStyle('#3e3e3e');
          ctx.setFontSize(23);
          ctx.fillText('您的排队号码是：', 150, 80);
          ctx.setFillStyle('#3e3e3e');
          ctx.setFontSize(25);
          ctx.fillText(res.data.data.user_code, 150, 130);
          ctx.setFillStyle('#595959');
          ctx.setFontSize(18);
          ctx.fillText('您预约的医生是:' + res.data.data.doctor_name, 150, 180);
          ctx.draw()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.onUserCaptureScreen(function (res) {
      console.log('用户截屏了')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})