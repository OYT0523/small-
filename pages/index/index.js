// index.js
const app = getApp()
Page({

  data: {
    loading:'block',
    hiddenmodalput: false,
    list: [],
    flag: false,
    flags: false,
    page: 0,
    hiddenLoading: 0
  },
  appo: function(event) {
    let doctorId = event.currentTarget.dataset.doctorid
    let online = event.currentTarget.dataset.online
    wx.showLoading({
      title: '请求中',
    });
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor/'+ doctorId,
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          if (res.data.data.app_online == 0) {
            wx.showToast({
              title: '医生没有开通预约',
              icon: 'none',
              duration: 1000
            })
            return;
          } else {
            wx.navigateTo({
              url: '/pages/appointment/appointment?id=' + doctorId,
            })
          }
        } else {
          wx.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
            duration: 1000
          })
          return;
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络有点不好哦~，请刷新重试',
          showCancel: false
        })
      }
    })
  },
  consult: function(event) {
    let doctorId = event.currentTarget.dataset.doctorid
    let chatid = event.currentTarget.dataset.chatid
    wx.showLoading({
      title: '请求中',
    });
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor/' + doctorId,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          if (res.data.data.chat == 0) {
            wx.showToast({
              title: '医生没有开通咨询',
              icon: 'none',
              duration: 1000
            })
            return;
          } else {
            wx.navigateTo({
              url: '/pages/consult/consult?id=' + doctorId,
            })
          }
        } else {
          wx.showToast({
            title: '请求失败，请稍后再试',
            icon: 'none',
            duration: 1000
          })
          return;
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络有点不好哦~，请刷新重试',
          showCancel: false
        })
      }
    });
  },
  detail: function(event) {
    let doctorId = event.currentTarget.dataset.doctorid
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + doctorId,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.updataApp();
    var that = this;
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor',
      method: "GET",
      data: {
        xxx: 'minipro'
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          loading:'none',
          list: res.data.data,
        })
      }
    })
    that.setData({
      hiddenmodalput: false
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            // hiddenmodalput: true
          })
        }
      }
    })
  },

  getUserInfo: function(e) {
    let userInfo = e.detail.userInfo
    wx.setStorageSync('sas', userInfo)
    var that = this
    that.setData({
      // hiddenmodalput: true
    })
    if (e.detail.userInfo) {

    } else {
      wx.showToast({
        title: '您未授权，将不能正常使用小程序,请授权',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        hiddenmodalput: false
      })
    }
    let openId = wx.getStorageSync("saas")
    let nickname = userInfo.nickName
    let picture = userInfo.avatarUrl
    wx.request({
      url: 'https://yk.eeboo.cn/api/add/user',
      method: "POST",
      data: {
        openid: openId,
        name: nickname,
        avatar: picture
      },
      success: function(res) {

      }
    })
  },
  click: function() {
    this.setData({
      hiddenmodalput: true
    })
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
    // var that = this;
    // wx.request({
    //   url: 'https://yk.eeboo.cn/api/select/doctor',
    //   method: "GET",
    //   success: function (res){
    //     that.setData({
    //       list: res.data.data,
    //     })
    //   }
    // })
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
    var that = this
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor',
      method: "GET",
      data: {
        xxx: 'minipro'
      },
      success: function(res) {
        that.setData({
          loading: 'none',
          list: res.data.data,
        })
        setTimeout(function() {
          wx.stopPullDownRefresh()
        }, 2000)

      }
    })

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

})