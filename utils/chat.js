//index.js
//获取应用实例
const app = getApp()
const WebIMs = require('../../utils/WebIM.js')
var sendPrivateText = function (mes) {
  var id = conn.getUniqueId();                 // 生成本地消息id
  var msg = new WebIM.message('txt', id);      // 创建文本消息
  msg.set({
    msg: mes,                  // 消息内容
    to: 'admin',                          // 接收消息对象（用户id）
    roomType: false,
    success: function (id, serverMsgId) {
      console.log('send private text Success');
    },
    fail: function (e) {
      console.log("Send private text error");
    }
  });
  msg.body.chatType = 'singleChat';
  conn.send(msg.body);
};

var WebIM = WebIMs.default
var conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
});

Page({
  data: {
   moren: ''
  },

  send: function () {
    sendPrivateText(this.data.moren)
  },

  inp: function (e) {
    var val = e.detail.value;
    this.setData({
      moren: val
    });
  },
  onLoad: function () {
    console.log(WebIMs.default);

    
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: 'username',
      pwd: 'password',
      appKey: WebIM.config.appkey
    };
    conn.open(options);


  },
})
