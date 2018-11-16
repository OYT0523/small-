const app = getApp();
Page({
  
  data: {
    
  },
  click:function(){
    // 获取日期
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
    // console.log(s)

    wx.scanCode({
      success: (res) => {
        let add = res.result.substring(6,14)
        if (add == s){
           wx.navigateTo({
             url: '/pages/sao/sao',
           })
        } else {
          wx.showToast({
            title: '二维码无效',
            icon:"none",
            duration: 2000
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