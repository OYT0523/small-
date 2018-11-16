//index.js
//获取应用实例
const app = getApp()
const WebIMs = require('../../utils/WebIM.js')
var util = require('../../utils/util.js');
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
    moren: '',
    head:0,
    tel:0,
    UserInfo:'',
    news:0,
    input_code:"",
    otherMessage:0,
    newsList:[],
    Date:0,
    display:false,
    chats:0,
    doctorid:0,
    doctorName:0,
    scrollTop: 0,
    bottom:0,
    tels:0,
    sec:0,
    msg:0
  },
  substance: function (e) {
     var val = e.detail.value;
    this.setData({
      moren: val
    });
  },

  // 发送消息
  send: function () {
    var that = this
    that.sendPrivateText(that.data.moren)
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/save/chathistory',
      method:"POST",
      data:{
        openid: open,
        doctor_phone: that.data.tel,
        from_to:1,
        content: that.data.moren
      },
      success:function(res){
          
      }
    })
    if (that.data.moren == ""){
      wx.showToast({
        title: '不能发送空白消息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 发送信息调用接口
    wx.request({
      url: 'https://yk.eeboo.cn/api/create/chatlink',
      method:"GET",
      data:{
        openid: open,
        doctor_id: that.data.doctorid 
      },
      success:function(res){

      }
    })
    var time = util.formatTime(new Date());
    console.log(time)
    var recode = wx.getStorageSync("sbc")
    var date = new Date()
    var seconds = date.getTime()
    // var mytime = date.toLocaleTimeString(); //获取当前时间
    // var ss = date.toLocaleString()
    var xx = time.replace('/', '-')
    var xxx = xx.replace('/', '-')
    console.log(xxx)
    var tep = { 'time': xxx}
    var obj = Object.assign(recode, tep);
    var list =[];
    list = that.data.newsList;
    var info = obj
    list.push(obj);
    that.setData({
      sec: seconds,
      newsList: list,
      moren: "",
      toView: "bottom",
    })
   
    console.log(that.data.msg)
    setTimeout(function(){
        if(seconds && !that.data.msg){
          that.auto()
        }
    },5000)
  },
 
  onLoad: function (options){
    app.updataApp();
    var that = this 
    let doctorId = options.id
    var useInfo = wx.getStorageSync("sas")
    var open = wx.getStorageSync("saas")
    that.setData({
      UserInfo: useInfo,
      hidden:false,
      doctorid: doctorId,
    })
  
    // 获取医生信息
    wx.request({
      url: 'https://yk.eeboo.cn/api/select/doctor/' + doctorId,
      success: function (res) {
        that.setData({
          head: res.data.data.avatar,
          tel: res.data.data.phone,
          doctorName: res.data.data.name
        })
        // 查询自己聊天记录
        wx.request({
          url: 'https://yk.eeboo.cn/api/chat/history',
          method: "GET",
          data: {
            openid: open,
            doctor_phone: that.data.tel
          },
          success: function (res) {
            that.setData({
              newsList: res.data.data,
              toView: "bottom"
            })
          }
        })
         // 修改导航标题
        wx.setNavigationBarTitle({
          title: that.data.doctorName,
          success: function (res) {
         
          }
        })
      }
    })
   
    // 登录
    wx.request({
      url: 'https://yk.eeboo.cn/api/reg/imuser',
      method: "POST",
      data: {
        openid: open
      },
      success: function (res) {
        if (res.data.data.error) {
         
        } else {
         
        }
      }
    })
    
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: open,
      pwd: open,
      appKey: WebIM.config.appkey
    };
    conn.open(options);
    conn.listen({
      onTextMessage: function(message){
        console.log(message)
        console.log(message.from)
        console.log(that.data.tel)
        console.log(that.data.sec)
        if (that.data.tel == message.from){
          // 接收消息
          wx.request({
            url: 'https://yk.eeboo.cn/api/save/chathistory',
            method: "POST",
            data: {
              openid: open,
              doctor_phone: message.from,
              from_to: 0,
              content: message.data
            },
            success: function (res) {
              console.log(res)
            }
          })
          // var date = new Date()
          // // var receiveTime = date.toLocaleTimeString(); //获取接受信息当前时间
          // var kk = date.toLocaleString()
          // var vv = kk.replace('/', '-')
          // var yy = vv.replace('/', '-')
          // var tt = yy.replace("", '')
          // console.log(tt)
          var times = util.formatTime(new Date());
          var aa = times.replace('/', '-')
          var bb = aa.replace('/', '-')
          console.log(bb)
          var tem = { "receiveTime": bb }
          var obj = Object.assign(message, tem);
          var lists = [];
          lists = that.data.newsList;
          var Info = obj
          lists.push(obj);
          console.log(lists)
          that.setData({
            newsList: lists,
            msg: message
          })
          console.log(newsList)
        }else{
         return
        }
       
        // var date = new Date()
        // var receiveTime = date.toLocaleTimeString(); //获取接受信息当前时间
        // var tem = { "receiveTime": receiveTime}
        // var obj = Object.assign(message, tem);
        // var lists = [];
        // lists = that.data.newsList;
        // var Info = obj
        // lists.push(obj);
        // console.log(lists)
        // that.setData({
        //   newsList: lists,
        //   msg:message
        // })
        // console.log(newsList)
      },
       
    })
    
  },
  sendPrivateText: function (mes) {
    var phone = this.data.tel
    console.log(phone)
    var id = conn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
      msg: mes,                  // 消息内容
      to: phone,            // 接收消息对象（用户id）           
      roomType: false,
      success: function (id, serverMsgId) {
        // console.log('send private text Success');
      },
      fail: function (e) {
        // console.log("Send private text error");
      }
    });
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);
    console.log(msg.body)
    wx.setStorageSync('sbc', msg.body)
  },
  onShow:function(){
   
  },
  // 自动回复
  auto:function(){
    var that = this
    var ph = that.data.tel
    console.log(that.data.tel)
    var open = wx.getStorageSync("saas")
    wx.request({
      url: 'https://yk.eeboo.cn/api/send/message',
      method: "GET",
      data: {
        username: open,
        doctor_phone: ph
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }
})
