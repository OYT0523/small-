//app.js
const WebIMs = require('utils/WebIM.js')
App({
  getRoomPage: function () {
    return this.getPage("pages/consult/consult")//聊天界面
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  
  onLaunch: function () {
    // this.updataApp();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    var that = this;
    var WebIM = WebIMs.default
    WebIM.conn.listen({
      onTextMessage: function (message) {
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveMsg(message, 'txt')//receiveMsg方法就是咱在自己界面定义的方法
          } else {
            //界面不存在
          }
        }
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code)
        if (res.code) {
          wx.request({
            url: 'https://yk.eeboo.cn/api/get/useropenid',
            method: "GET",
            data: {
              code: res.code,
            },
            header: {
              'Content-type': 'application/json'
            },
            success: function (res) {
              // console.log(res.data.openid)
              wx.setStorageSync('saas', res.data.openid)
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    version:"1.1.6",
  },
  // checkVersion: function () {
  //   var that = this;
  //   wx.request({
  //     url: 'https://yk.eeboo.cn/api/version/minipro',
  //     method: "GET",
  //     success: function (res) {
  //       if (that.globalData.version != res.data) {
  //         console.log('nonono');
  //         const updateManager = wx.getUpdateManager();
  //         console.log(updateManager);
  //         updateManager.onUpdateReady(function () {
  //           wx.showModal({
  //             title: '发现新版本',
  //             content: '新版本上线啦，是否安装新版本？',
  //             success: function (res) {
  //               if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
  //                 updateManager.applyUpdate()
  //               }
  //             }
  //           })
  //         })
  //         updateManager.onUpdateFailed(function () {
  //           wx.showModal({// 新的版本下载失败
  //             title: '已经有新版本了哟~',
  //             content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
  //           })
  //         })
  //       }
  //     },
  //   })
  // },
  updataApp: function () {//版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('request--------------request');
        console.log(res.hasUpdate);
        if (res.hasUpdate) { // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '发现新版本',
              content: '新版本上线啦，是否安装新版本？',
              success: function (res) {
                if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({// 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
})