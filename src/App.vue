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
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+appSecret+'&js_code='+res.code+'&grant_type=authorization_code',  
                data: {},  
                method: 'GET',
                success: function(res){ 
                  userInfo.openid = res.data.openid;  
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
</style>
