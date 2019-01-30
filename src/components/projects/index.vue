<template>
    <div>
      <div class="item" v-for="(pro, index) in list">
        <div class="icon-cnt">
            <img v-bind:src="pro.avatarUrl" />
        </div>
        <div class="body-cnt">
          <i-row>
            <i-col span="18">
              <div class="name autocut">
                {{ pro.name }}
              </div>
            </i-col>
            <i-col span="6">
              <div class="price">
                ¥ {{ pro.price }}
              </div>
              
            </i-col>
          </i-row>
          <i-row>
            <i-col span="24">
              <div class="technology">
                技术要求 : {{ pro.technology }}
              </div>
            </i-col>
          </i-row>
          <i-row>
            <i-col span="12">
              <div class="duration">
                {{ pro.updateTime }}  <span class="spliter">|</span>  {{ pro.count }} 人投递
              </div>
            </i-col>
            <i-col span="12" class="status-cnt">
              <span class="status">
                {{ pro.statusTxt }}
              </span>
            </i-col>
          </i-row>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  props: ["list"],
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
img {
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
.item {
  display: flex;
  margin:0 16px;
  margin-bottom: 10px;
  padding: 6px 0px 16px 0px;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  background:#fff;
  border-bottom: 1rpx solid #dddee1;

}
.icon-cnt {

}
.body-cnt {
  flex-grow: 1;
  width:calc(100% - 44px);
  padding-left: 10px;
}

.body {
  height: 30px;
}
.name {
  color: #525b66;
}
.price {
  text-align: right;
  color: #f75288;
}
.technology {
  padding: 16px 0px;
}
.duration {
  font-size: 12px;
  color: #8796a8;
}
.status-cnt {
  text-align: right;
}
.status {
  padding: 2px 4px;
  font-size: 12px;
  border: 1px solid #61c279;
  color: #61c279;
}
.spliter {
  margin: 0 6px;
}
</style>

