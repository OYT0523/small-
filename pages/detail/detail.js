const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    item:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    app.updataApp();
    var that = this
    let doctorId = options.id
    wx.showLoading({
      title: '加载医生信息中',
    });
    // console.log(doctorId)
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor/' + doctorId + '?xxx=minipro',
      success:function(res){
        wx.hideLoading();
        // console.log(res.data.data)
        if (res.data.code == "0") {
          var data = res.data.data;
          data.shanchang = data.shanchang.split(',');
          that.setData({
            item: res.data.data
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '医生信息加载失败，请稍后再试',
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络有点不好哦~，请重试',
          showCancel: false,
          success: function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  },
  appo:function (event) {
    let doctorId = event.currentTarget.dataset.doctorid
    let online = event.currentTarget.dataset.online
    if (online == 0) {
      wx.showToast({
        title: '医生没有开通预约',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      wx.navigateTo({
        url: '/pages/appointment/appointment?id=' + doctorId,
      })
    } 
  },
  chat: function (event) {
    let doctorId = event.currentTarget.dataset.doctorid
    let chatid = event.currentTarget.dataset.online
    if (chatid == 0) {
      wx.showToast({
        title: '医生没有开通咨询',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      wx.navigateTo({
        url: '/pages/consult/consult?id=' + doctorId,
      })
    }
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