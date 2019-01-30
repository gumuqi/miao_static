<template>
  <div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        昵称
      </div>
      <span>
        {{ nickName }}
      </span>
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        擅长
      </div>
      <input v-model="good_at" class="i-input-input i-cell-bd" placeholder="如java、c++、react、vue等" maxlength="50" />
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        联系方式
      </div>
      <input v-model="contact_info" class="i-input-input i-cell-bd" placeholder="只有被您投递的项目方可以看到，请放心填写" maxlength="50"/>
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        作品展示
      </div>
      <input v-model="works_info" class="i-input-input i-cell-bd" placeholder="如作品链接，名称等" maxlength="200"/>
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        自我介绍
      </div>
      <textarea v-model="description" class="i-input-input i-cell-bd" placeholder="请描述您的项目经历，以便项目方可以判断您是否满足项目需求。" maxlength="255"/>
    </div>
    <i-button v-on:click="submit" type="primary">保存</i-button>
    <i-message id="message" />
  </div>
</template>

<script>
import cookies from 'weapp-cookie';
import globalStore from '../../stores/global-store';
import { $Message } from '../../../static/iview/base/index';

export default {
  data () {
    return {
      nickName: '',
      good_at: '',
      contact_info: '',
      works_info: '',
      description: ''
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo: function() {
      let userInfo = wx.getStorageSync('userInfo') || {};
      wx.request({
        url: process.env.API_BASE_URL + '/getUserInfo',
        method: 'GET',
        data: {
          user_id: userInfo.openid
        },
        success: (res) => {
          let detail = res.data || [];
          detail = detail[0];
          this.nickName     = detail.nick_name;
          this.good_at      = detail.good_at;
          this.contact_info = detail.contact_info;
          this.works_info   = detail.works_info;
          this.description  = detail.description;
        },
        fail: () => {

        }
      })
    },
    submit: function() {
      let userInfo = wx.getStorageSync('userInfo') || {};
      this.saving = true;
      wx.request({
        url: process.env.API_BASE_URL + '/editUser',
        method: 'POST',
        data: {
          good_at: this.good_at,
          contact_info: this.contact_info,
          works_info: this.works_info,
          description: this.description,
          user_id: userInfo.openid
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          $Message({
            type: 'success',
            content: '保存成功',
            duration: 2
          });
          setTimeout(() => {
            wx.switchTab({
            url: '../mine/main'
          });
          }, 2000);
        },
        fail: () => {

        }
      })
    },
    onChange: function({detail}) {
      console.log(detail.value);
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.i-cell {
  padding: 12px 15px;
  display: flex;
  background:#fff;
  align-items: center;
  line-height: 1.4;
  font-size: 13px;
  overflow: hidden;
}
.i-input {
  padding: 6px 15px;
  color:#495060;
}
.i-input-title {
  color:#495060;
  min-width: 65px;
  padding-right: 10px;
}
.i-input-input {
  flex: 1;
  line-height: 1.6;
  padding: 4px 0;
  min-height: 22px;
  height:auto;
  font-size: 13px;
}

</style>
