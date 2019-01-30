<template>
  <div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        项目名称
      </div>
      <input v-model="name" class="i-input-input i-cell-bd" autofocus placeholder="请输入项目名字" maxlength="20" />
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        技术要求
      </div>
      <input v-model="technology" class="i-input-input i-cell-bd" placeholder="如java、c++、react、vue等" maxlength="30" />
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        项目周期
      </div>
      <input v-model="duration" class="i-input-input i-cell-bd" type="number" placeholder="单位（天）" min="1" max="365" />
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        报价
      </div>
      <input v-model="price" class="i-input-input i-cell-bd" type="number" placeholder="单位（元）" min="100" max="990000" />
    </div>
    <div class="i-cell i-input">
      <div class="i-cell-hd i-input-title">
        描述
      </div>
      <textarea v-model="description" class="i-input-input i-cell-bd" placeholder="请详细描述您的项目需求，以便开发者更好的判断自己是否合适投递该项目"  maxlength="255"/>
    </div>
    <i-button v-on:click="submit" type="primary">发布</i-button>
  </div>
</template>

<script>
import globalStore from '../../stores/global-store';
import cookies from 'weapp-cookie';
export default {
  data () {
    return {
      name: '',
      technology: '',
      duration: 1,
      price: 0,
      description: ''
    }
  },
  methods: {
    
    submit: function() {
      var userInfo = wx.getStorageSync('userInfo') || {}; 
      wx.request({
        url: process.env.API_BASE_URL + '/saveProject',
        method: 'POST',
        data: {
          name: this.name,
          technology: this.technology,
          duration: this.duration,
          price: this.price,
          description: this.description,
          user_id: userInfo.openid
        },
        header: {
          'x-csrf-token': cookies.get('csrfToken', '')
        },
        success: (res) => {
          wx.navigateTo({
            url: '../mineProjects/main'
          });
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
