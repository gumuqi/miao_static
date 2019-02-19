<script>
import globalStore from './stores/global-store';
import utils from './utils/index';

export default {
  beforeCreate() {
    // 隐藏系统元素tabbar，使用自定义的iview tabbar
    wx.hideTabBar();
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo: function() {
      var that = this;
      var userInfo = wx.getStorageSync('userInfo') || {}; 
      if(!userInfo.openid){
        let info = {};
        wx.login({  
          success: function(res){ 
            if(res.code) {
              let appId = globalStore.state.appId;
              let appSecret = globalStore.state.appSecret;
              wx.request({  
                url: process.env.API_BASE_URL + '/getOpenId',
                data: {
                  appId: globalStore.state.appId,
                  appSecret: globalStore.state.appSecret,
                  code: res.code
                },  
                method: 'GET',
                success: function(res){ 
                  userInfo = res.data || {};
                  wx.setStorageSync('userInfo', userInfo); //存储openid
                }  
              });
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }          
          }  
        }); 
      }
    }
  }
}

</script>

<style>
* {
  box-sizing: border-box;
}
.container {
  background: #ccc;
}
.clearfix::after {
  display: block;
  clear: both;
  content: '.';
  width: 0;
  height: 0;
  visibility: hidden;
}
.autocut {
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hr {
  display: block;
  width: 100%;
  height: 1px;
  margin: 16px 0;
  border-bottom: 1px solid #dddee1;
}
.f-left {
  float: left;
}
.f-right {
  float: right;
}
textarea {
  height: auto;
}
.msg {
  padding:96px 0;
  text-align:center;
  font-size:12px;
  color: #888;
}
</style>
