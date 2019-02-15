<template>
  <div>
    <div class="base-info">
      <i-row>
        <i-col span="18">
          <div class="name">
            {{ detail.name }}
          </div>
        </i-col>
        <i-col span="6">
          <div class="status">
            {{ detail.statusTxt }}
          </div>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="24">
          <div class="price_time_count">
            金额 ¥ {{ detail.price }}    <span class="spliter">|</span> 
            发布时间 {{ detail.updateTime }} <span class="spliter">|</span>
            <span v-if="detail.isMine">
              <navigator url='../deliverUsers/main' class="link">
                报名人数 {{ deliverList.length }}
              </navigator>
            </span>
            <span v-else>
              报名人数 {{ deliverList.length }}
            </span>
          </div>
        </i-col>
      </i-row>
      <div class="hr"></div>
      <div class="box-title">需求方</div>
      <div class="partAside">
        <i-row class="name">
          <i-col span="4">
            <img class="avatarUrl" v-bind:src="user.avatarUrl" />
          </i-col>
          <i-col span="20">
            <div class="name"> {{ user.nick_name }}</div>
            <div class="other">发布项目 {{ user.count }} 个</div>
            <div class="other">入驻时间 {{ user.joinTime }}</div>
          </i-col>
        </i-row>
      </div>
      <div class="box-title">技术要求</div>
      <div class="box-text">
        {{ detail.technology }}
      </div>
        
      <div class="box-title">项目描述</div>
      <div class="box-text">
        {{ detail.description }}
      </div>

      <div class="tools clearfix">
        <div v-if="detail.isMine" >
          <i-button type="primary" class="btn" v-on:click="toEditProject">编辑</i-button>
        </div>
        <div v-else>
          <i-button type="success" class="btn" v-if="detail.delivered">已投递</i-button>
          <i-button type="primary" class="btn" v-else v-on:click="deliver" v-bind:loading="delivering">投递</i-button>
        </div>
      </div>
      <div class="hr"></div>
      <div class="comments">
        <div class="title">全部评论</div>
        <i-row v-for="(item, index) in comments" v-bind:key="index">
          <i-col span="3">
            <img class="avatarUrl" v-bind:src="item.avatarUrl" />
          </i-col>
          <i-col span="21">
            <div class="nick_name"> {{ item.nick_name }}</div>
            <div class="text">{{ item.comment_cont }}</div>
            <div class="time">{{ item.commentTime }}</div>
          </i-col>
        </i-row>
      </div>
    </div>
  </div>
</template>

<script>
import cookies from 'weapp-cookie';
import globalStore from '../../stores/global-store';
import util from '../../utils/index';
export default {
  data () {
    return {
      delivering: false, // 投递中
      isMine: false,  // 是否是我的项目，如果是，那么具有编辑功能
      delivered: false, // 是否已投递该项目
      detail: {},
      user: {},
      deliverList: [],
      comments: []
    }
  },
  onShow() {
    this.getProjectDetail();
    this.getDelivered();
    this.getUserDetail();
  },
  methods: {
    /**
     * 获取项目详情
     */
    getProjectDetail: function() {
      let id = util.getUrlParam('id');
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.request({
        url: process.env.API_BASE_URL + '/getProjectDetail',
        method: 'GET',
        data: {
          id: id,
          user_id: userInfo.openid
        },
        success: (res) => {
          this.setProject(res.data);
          this.getComments();
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取用户详情
     */
    getUserDetail: function() {
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: userInfo.openid
        },
        success: (res) => {
          this.setUser(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取项目的投递情况
     */
    getDelivered: function() {
      let id = util.getUrlParam('id');
      wx.request({
        url: process.env.API_BASE_URL + '/getDelivered',
        method: 'GET',
        data: {
          id: id
        },
        success: (res) => {
          this.setDelivered(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取项目的评论列表
     */
    getComments: function() {
      wx.request({
        url: process.env.API_BASE_URL + '/getComments',
        method: 'GET',
        data: {
          project_id: this.detail.id
        },
        success: (res) => {
          this.setComments(res.data);
        },
        fail: () => {

        }
      })
    },
    setProject(data) {
      data.updateTime = new Date(data.updated_at).Format('MM-dd');
      data.count = data.count || 0;
      switch(data.status) {
        case 0:
          data.statusTxt = '招募中';
          break;
        case 1:
          data.statusTxt = '开发中';
          break;
        case 2:
          data.statusTxt = '已结束';
          break;
        default:
          data.statusTxt = '招募中';
      }
      this.detail = data;
    },
    setDelivered(data) {
      this.deliverList = data;
    },
    setUser(data) {
      data.joinTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.user = data;
    },
    setComments(data) {
      data.commentTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.comments = data;
    },
    /**
     * 编辑项目信息
     */
    toEditProject() {
      // 由于切换tab时不能携带参数，所以参与全部变量的方式传递
      globalStore.state.curProject = this.detail;
      wx.switchTab({
        url: '../pubProject/main'
      });
    },
    /**
     * 投递当前项目
     */
    deliver() {
      this.delivering = true;
      var userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/deliver',
        method: 'POST',
        data: {
          project_id: this.detail.id,
          user_id: userInfo.openid
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.detail.delivered = true;
          this.delivering = false;
        },
        fail: () => {
          this.delivering = false;
        }
      })
    }
  },
  computed: {

  }
}
</script>
<style scoped>
img.avatarUrl {
  display:inline-block;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  position:relative;
  margin-left:auto;
  margin-right:auto;
  overflow:hidden;
  background-size:cover;
  vertical-align:middle;
}
.base-info {
  padding: 16px;
}
.base-info .name {
  font-size: 16px;
}
.base-info .status {
  font-size: 14px;
  text-align: right;
  color: #61c279;
}
.price_time_count {
  margin-top: 16px;
  font-size: 12px;
  color: #8796a8;
}
.spliter {
  margin: 0 6px;
}
.box-title {
  margin: 24px 0 16px 0;
  font-size: 14px;
}
.box-text {
  font-size: 14px;
  color: #666;
}
.tools .btn {
  display: inline-block;
  float: right;
}

.partAside {
  padding: 12px;
  border: 1px solid #dddee1;
  box-shadow: 0 0 5px rgba(100, 100, 100, 0.3);
}
.partAside .name {
  font-size: 14px;
  line-height: 32px;
  color: #61c279;
}
.partAside .other {
  font-size: 12px;
  color: #8796a8;
}
.comments .title {
  margin-bottom: 32px;
  font-size: 14px;
}
.comments .avatarUrl {
  width: 22px;
  height: 22px;
}
.comments .nick_name {
  font-size: 12px;
  color: #666;
}
.comments .text {
  font-size: 14px;
  padding: 12px 0;
}
.comments .time {
  font-size: 10px;
  color: #888;
}
</style>
