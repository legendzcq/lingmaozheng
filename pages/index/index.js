//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tempFilePaths: "",
        logs: '',
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
  onLoad: function (query) {
        //当前时间
        function CNDateString(date) {
            var cn = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var s = [];
            var YY = date.getFullYear().toString();
            for (var i = 0; i < YY.length; i++)
                if (cn[YY.charAt(i)]) {
                    s.push(cn[YY.charAt(i)]);
                } else {
                    s.push(YY.charAt(i));
                }
            s.push("年");
            var MM = date.getMonth() + 1;
            if (MM < 10) {
                s.push(cn[MM])
            } else if (MM < 20) {
                if (MM == 10) {
                    s.push("十");
                } else {
                    s.push("十" + cn[MM % 10]);
                }
            }
            s.push("月");
            var DD = date.getDate();
            if (DD < 10) {
                s.push(cn[DD]);
            } else if (DD < 20) {
                if (DD == 10) {
                    s.push("十");
                } else {
                    s.push("十" + cn[DD % 10]);
                }
            } else if (DD < 30) {
                s.push("二十" + cn[DD % 10]);
            } else {
                s.push("三十" + cn[DD % 10])
            }
            s.push("日");
            return s.join('');
        }
        this.setData({
            logs: CNDateString(new Date()),
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                tempFilePaths: app.globalData.userInfo.avatarUrl
            })
        } else if (this.data.canIUse){
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    tempFilePaths: app.globalData.userInfo.avatarUrl
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
         
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                        tempFilePaths: app.globalData.userInfo.avatarUrl
                    })
                }
            })
        }
    console.log("eeeeee" + app.globalData.userInfo)
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene


     wx.request({
       url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa54b9fe75b093b81&secret=d0c121dcc85f60324d82b1533fe6a8b3',
       method:'GET',
       header: {
         "Content-Type": "application/json"
       },
       success: function (res) {
        //  access_token
         console.log(res.data.access_token)
         var token = res.data.access_token
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + token,
          method:'POST',
          data:{
            path:'pages/index/index',
            width:100
          },
          success: function (res) {
          
            var temp = wx.arrayBufferToBase64(res.data)
            console.log(temp)
            // this.setData({
            //   tempFilePaths: temp
            // })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) { },
        })


       },
       fail: function (res) {
         console.log(res);
       },
       complete: function (res) { },
     })



    },
    chooseimage: function(){
        var _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                _this.setData({
                    tempFilePaths: res.tempFilePaths
                })
            },
        })
    },
    getUserInfo: function(e) {
        //console.log(e)
        app.globalData.userInfo = e.detail.userInfo
      console.log("eeeeee" + app.globalData.userInfo.secret)
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
            tempFilePaths: app.globalData.userInfo.avatarUrl
        })
    },

})
