
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showhide:true,
  },
  click:function(){
    wx.navigateTo({
      url: '/pages/appointmentRecord/appointmentRecord',
    })
    // var open = wx.getStorageSync("saas")
    // wx.request({
    //   url: 'https:yk.eeboo.cn/api/flush/newapp',
    //   method:"GET",
    //   data:{
    //     openid: open
    //   },
    //   success:function(res){
    //     console.log(res)
    //   }
    // })
  },
  clicks:function(){
    wx.navigateTo({
      url: '/pages/consultRecord/consultRecord',
    })
  },
  knows: function () {
    wx.navigateTo({
      url: '/pages/know/know',
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    app.updataApp();
    var that = this
    var useInfo = wx.getStorageSync("sas")
    that.setData({
      userInfo: useInfo
    })
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        // hasUserInfo: true
      })
      // console.log(app.globalData.userInfo)
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: app.globalData.userInfo,
          // hasUserInfo: true
        })
      }
    }
    // 小红点提示
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/user/newapp',
      method:"GET",
      data:{
        openid: open
      },
      success:function(res){
        console.log(res)
        if(res.data.data !== 0){
          that.setData({
            showhide:false
          })
        }else{
          that.setData({
            showhide: true
          })
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
    this.onLoad()
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

