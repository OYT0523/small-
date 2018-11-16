// pages/consultRecord/consultRecord.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:true,
    recorde:'暂时没有记录哦',
    consultRecode:0,
    tel:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.updataApp();
    var that = this
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/get/linkuser',
      method:"GET",
      data:{
        openid: open
      },
      success:function(res){
        console.log(res.data.data)
         that.setData({
           consultRecode:res.data.data
         })
        if(res.data.data.length == 0){
          that.setData({
            display:false
          })
        }
      }
    })
  },
  click: function (e) {
    let doctorId = e.currentTarget.dataset.doctorid
    let phone = e.currentTarget.dataset.phoneid
    this.setData({
      tel: phone
    })
    wx.navigateTo({
      url: '/pages/consult/consult?id=' + doctorId,
    })
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/delete/message',
      method: "GET",
      data:{
        openid:open,
        doctor_phone: phone
      },
      success:function(res){
        console.log(res)
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
    this.onLoad();
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
    // var that = this
    // var open = wx.getStorageSync("saas")
    // wx.request({
    //   url: 'https://yk.eeboo.cn/api/get/linkuser',
    //   method: "GET",
    //   data: {
    //     openid: open
    //   },
    //   success: function (res) {
    //     console.log(res.data.data)
    //     that.setData({
    //       consultRecode: res.data.data
    //     })
    //   }
    // })
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