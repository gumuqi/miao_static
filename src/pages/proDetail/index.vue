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
          <div v-if="detail.status==0" class="status status0">招募中</div>
          <div v-if="detail.status==1" class="status status1">开发中</div>
          <div v-if="detail.status==2" class="status status2">已结束</div>
        </i-col>
      </i-row>
      <i-row>
        <i-col span="24">
          <div class="price_time_count">
            金额 ¥ {{ detail.price }}    <span class="spliter">|</span> 
            发布时间 {{ detail.updateTime }} <span class="spliter">|</span>
            <span v-if="detail.isMine" v-on:click="toUsers" class="link">
              报名人数 {{ deliverList.length }}
            </span>
            <span v-else>
              报名人数 {{ deliverList.length }}
            </span>
          </div>
        </i-col>
      </i-row>
      <div class="hr"></div>
      <div v-if="detail.winner">
        <div class="box-title">中标者</div>
        <div class="partAside">
          <i-row class="name">
            <i-col span="4">
              <img class="avatarUrl" v-bind:src="bidder.avatarUrl" />
            </i-col>
            <i-col span="20">
              <div class="name"> {{ bidder.nick_name }}</div>
              <div class="other">擅长 {{ bidder.good_at }}</div>
              <div class="other">入驻时间 {{ bidder.joinTime }}</div>
            </i-col>
          </i-row>
        </div>
      </div>

      <div class="box-title">技术要求</div>
      <div class="box-text">
        {{ detail.technology }}
      </div>
        
      <div class="box-title">项目描述</div>
      <div class="box-text">
        {{ detail.description }}
      </div>

      <div class="box-title">需求方</div>
      <div class="partAside">
        <i-row class="name">
          <i-col span="4">
            <img class="avatarUrl" v-bind:src="tenderee.avatarUrl" />
          </i-col>
          <i-col span="20">
            <div class="name"> {{ tenderee.nick_name }}</div>
            <div class="other">发布项目 {{ tenderee.count }} 个</div>
            <div class="other">入驻时间 {{ tenderee.joinTime }}</div>
          </i-col>
        </i-row>
      </div>

      <div class="tools clearfix">
        <div v-if="detail.isMine" >
          <i-button type="primary" v-if="detail.status==0" v-on:click="toEditProject">编辑</i-button>
          <i-button type="success" v-if="detail.status==1" v-on:click="endProject">完成</i-button>
          <i-button v-if="detail.status==2">已结束</i-button>
        </div>
        <div v-else>
          <i-button type="success" v-if="detail.delivered">已投递</i-button>
          <i-button type="primary" v-else v-on:click="deliver" v-bind:loading="delivering">投递</i-button>
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
        <div class="msg" v-if="comments.length==0">
          暂无评论
        </div>
      </div>
    </div>
    <div class="comment-input">
      <i-row class="head" v-if="comInputFocus" >
          <i-col class="cancel" span="4">
            <span v-on:click="cancelComment">取消</span>
          </i-col>
          <i-col class="title" span="16">
            评论
          </i-col>
          <i-col class="submit" span="4">
            <span v-on:click="submitComment">确定</span>
          </i-col>
      </i-row>
      <textarea
        auto-height="true"
        placeholder="发表评论..."
        v-bind:class="textareaClass"
        v-model="commentTxt"
        v-on:focus="onComInputFocus"
      />
      <i-badge v-if="!comInputFocus" v-bind:count="comments.length" overflow-count="100">
        <i-icon class="f-left comment-icon" type="message" size="24"/>
      </i-badge>
    </div>
    <i-modal title="结束确认" v-bind:visible="showWin" v-on:ok="endProjectSubmit" v-on:cancel="endProjectCancel">
      <view class="confirm-msg">
        请确认项目已完工？
      </view>
    </i-modal>
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
      bidder: {},   // 投标人、中标者
      tenderee: {}, // 招标人、需求方
      deliverList: [],
      comments: [],
      showWin: false,
      comInputFocus: false, // 评论输入框是否获取到焦点
      textareaClass: 'f-left',
      commentTxt: ''
    }
  },
  onShow() {
    this.getProjectDetail();
    this.getDelivered();
  },
  methods: {
    /**
     * 获取项目详情
     */
    getProjectDetail: function() {
      let id = util.getUrlParam('project_id');
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
          this.getTendereeDetail();
          this.getBidderDetail();
          this.getComments();
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取招标人详情
     */
    getTendereeDetail: function() {
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: this.detail.user_id
        },
        success: (res) => {
          this.setTenderee(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取中标人信息
     */
    getBidderDetail: function() {
      const winner = this.detail.winner;
      if (!winner) return; // 如无中标者，无需发起请求
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: winner
        },
        success: (res) => {
          this.setBidder(res.data);
        },
        fail: () => {

        }
      })
    },
    /**
     * 获取项目的投递情况
     */
    getDelivered: function() {
      let id = util.getUrlParam('project_id');
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
    setTenderee(data) {
      data.joinTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.tenderee = data;
    },
    setBidder(data) {
      data.joinTime = new Date(data.created_at).Format('yyyy-MM-dd');
      this.bidder = data;
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
      wx.navigateTo({
        url: '../pubProject/main'
      });
    },
    /**
     * 结束项目
     */
    endProject() {
      this.showWin = true;
    },
    endProjectSubmit() {
      let id = util.getUrlParam('project_id');
      wx.request({
        url: process.env.API_BASE_URL + '/endProject',
        method: 'POST',
        data: {
          project_id: id
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.showWin = false;
          wx.switchTab({
            url: '../home/main'
          });
        },
        fail: () => {

        }
      })
    },
    endProjectCancel() {
      this.showWin = false;
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
    },
    /**
     * 查看投递该项目的开发者列表
     */
    toUsers() {
      wx.navigateTo({
        url: '../bidder/main?project_id=' + this.detail.id
      })
    },
    /**
     * 评论输入框获取焦点时
     */
    onComInputFocus() {
      this.comInputFocus = true;
      this.textareaClass = 'f-left inputing';
      console.log('评论输入框获取焦点时，弹出评论面板');
    },
    /**
     * 取消评论
     */
    cancelComment() {
      this.commentTxt = '';
      this.textareaClass = 'f-left';
      setTimeout(() => {
        this.comInputFocus = false;
      }, 300);
    },
    /**
     * 提交评论
     */
    submitComment() {
      let id = util.getUrlParam('project_id');
      let userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/comment',
        method: 'POST',
        data: {
          project_id: id,
          user_id: userInfo.openid,
          comment_cont: this.commentTxt
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          this.cancelComment();
          // 将刚才评论的放在所有评论最前面
          this.comments = [res.data].concat(this.comments);
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
}
.base-info .status0 {
  color: #61c279;
}
.base-info .status1 {
  color: #5cadff;
}
.base-info .status2 {
  color: #bbbec4;
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
.tools{
  margin-top: 40px;
}

.partAside {
  padding: 12px;
  border: 1px solid #dddee1;
  box-shadow: 0 0 5px rgba(200, 200, 200, 0.5);
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
.comments {
  margin-bottom: 74px;
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
.link {
  display: inline;
}
.msg {
  font-size: 12px;
  text-align: center;
  color: #888;
}
.comment-input {
  position:fixed;
  left:0;
  right:0;
  bottom:0;
  padding:8px 16px;
  background:#fff;
  box-shadow: -2px 0px 5px rgba(200, 200, 200, 0.5);
}
.comment-input .head {
  margin-bottom: 10px;
  text-align: center;
  line-height: 3em;
  font-size: 12px;
  color: #666;
}
.comment-input .title {
  font-size: 16px;
  color: #333;
}
.comment-input .submit {
  color: #5cadff;
}
.comment-input textarea {
  width: 80%;
  height:auto;
  min-height:16px;
  margin-top: 2px;
  padding: 6px;
  font-size:12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
}
.comment-input textarea.inputing {
  width: 96%;
  min-height: 120px;
}
.comment-input .comment-icon {
  margin-left: 20px;
}
</style>
