<template>
  <div id="login">
    <div
      class="loginBox"
    >
      <div class="auth-form">
        <div class="panfish">
          WMS
        </div>
        <van-tabs
          v-model="active"
          animated
        >
          <van-tab title="登录">
            <!-- 账号密码登录 -->
            <van-cell-group v-show="!isShowSMSLogin">
              <van-field
                v-model="login_userName"
                required
                clearable
                label="手机号"
                maxlength="11"
                :error-message="phoneNumberRight?'': '手机号格式不正确'"
                placeholder="请输入手机号"
              />
              <van-field
                v-model="login_password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                required
                autocomplete
              />
              <van-field
                v-model="imgCaptcha"
                center
                clearable
                maxlength="4"
                placeholder="请输入验证码"
              >
                <img
                  ref="imgCaptcha"
                  slot="button"
                  class="verificationImage"
                  src="http://demo.itlike.com/web/xlmc/api/captcha"
                  alt="captcha"
                  @click.prevent="getCaptcha"
                >
              </van-field>
              <!-- 手机号快捷登录 -->
            </van-cell-group>
            <van-cell-group v-show="isShowSMSLogin">
              <van-field
                v-model="login_phone"
                required
                clearable
                maxlength="11"
                label="手机号"
                placeholder="请输入手机号"
                :error-message="phoneNumberRight?'': '手机号格式不正确'"
              />
              <van-field
                v-model="smsCaptcha"
                center
                clearable
                required
                label="验证码"
                maxlength="6"
                placeholder="请输入验证码"
              >
                <van-button
                  v-if="!countDown"
                  slot="button"
                  size="small"
                  type="primary"
                  :disabled="captchaDisable"
                  @click="sendVerifyCode"
                >发送验证码</van-button>
                <van-button
                  v-else
                  slot="button"
                  v-model="smsCaptcha"
                  size="small"
                  type="primary"
                  disabled=""
                >已发送{{ countDown }}s</van-button>
              </van-field>
            </van-cell-group>
            <van-button
              type="info"
              size="large"
              style="margin-top:1rem"
              @click="login"
            >登录</van-button>
            <div
              class="switchLogin"
              @click="switchLogin"
            >{{ isShowSMSLogin? '账号密码登录': '短信验证码登录' }}</div>
          </van-tab>
          <!-- 注册 -->
          <van-tab title="注册">
            <van-cell-group>
              <van-field
                v-model="register_userName"
                clearable
                maxlength="11"
                label="手机号"
                placeholder="请输入手机号"
                required
              />
              <van-field
                v-model="register_pwd"
                type="password"
                label="密码"
                placeholder="请输入密码(不少于6位)"
                required
              />
            </van-cell-group>
            <van-button
              type="info"
              size="large"
              style="margin-top:1rem"
              @click="register"
            > 注册 </van-button>
          </van-tab>
        </van-tabs>
        <!-- 底部声明 -->
        <p class="agreement"> 温馨提示：<br>未注册的手机号，登录时将自动注册，且代表同意<a
          class="agreement-box"
          @click.stop="agreement(0)"
        >用户协议</a>、<a
          class="agreement-box"
          @click.stop="agreement(1)"
        >隐私策略</a></p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// 引入Vant的组件
import { Toast, Dialog, Grid, Tabs, Tab, Field, Button, GridItem, Cell, CellGroup, Divider } from 'vant'

export default {
  components: {
    [Grid.name]: Grid,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Field.name]: Field,
    [Button.name]: Button,
    [GridItem.name]: GridItem,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Divider.name]: Divider
  },
  data() {
    return {
      countDown: 0, // 倒计时
      active: 0,
      login_userName: '', // 用户名
      login_password: '', // 用户密码
      login_phone: '', // 手机号码

      register_userName: '', // 注册用户名
      register_pwd: '', // 注册密码

      imgCaptcha: '', // 图片验证码
      smsCaptcha: '', // 短信验证码
      isShowSMSLogin: true, // 是否短信登录
      switchLoginMsg: '账号密码登录',
      smsCaptchaResult: null,
      userInfo: null
    }
  },
  computed: {
    // 1.手机号码验证
    phoneNumberRight() {
      const value = this.isShowSMSLogin ? this.login_phone : this.login_userName
      // 1.1 当输入的手机号大于10位进行验证
      if (value.length > 10) {
        return /[1][3,4,5,6,7,8][0-9]{9}$/.test(value)
      } else {
        return true
      }
    },
    // 2.发送验证码按钮显示
    captchaDisable() {
      if (this.login_phone.length > 10 && this.phoneNumberRight) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 1.账号密码登录及短信验证码切换
    switchLogin() {
      this.isShowSMSLogin = !this.isShowSMSLogin
    },
    // 3.账号密码登录切换图片验证码
    getCaptcha() {
      // 获取验证码的标签
      const captchaEle = this.$refs.imgCaptcha
      this.$set(captchaEle, 'src', 'http://demo.itlike.com/web/xlmc/api/captcha?time=' + new Date())
    },
    // 4.获取手机验证码
    async sendVerifyCode() {
      this.countDown = 60
      this.timeIntervalID = setInterval(() => {
        this.countDown--
        // 4.1 如果减到0 则清除定时器
        if (this.countDown === 0) {
          clearInterval(this.timeIntervalID)
        }
      }, 1000)

      // 4.3  获取验证码成功
      Dialog.alert({
        title: '温馨提示：',
        message: '成功'
      }).then(() => {
      })
    },
    // 5.登录
    async login() {
      if (this.isShowSMSLogin) {
        if (!this.phoneNumberRight || this.login_phone.length < 10) {
          Toast({
            message: '请输入正确的手机号',
            duration: 800
          })
          return
        } else if (!this.smsCaptcha) {
          Toast({
            message: '请输入正确的验证码',
            duration: 800
          })
          return
        }
        this.$router.push('/goods')
      } else {
        if (this.login_userName.length < 1) {
          Toast({
            message: '手机号',
            duration: 800
          })
          return
        } else if (!this.phoneRegex(this.login_userName)) {
          Toast({
            message: '手机号格式不正确',
            duration: 800
          })
          return
        }
        this.$router.back()
      }
    },
    // 6.注册
    async register() {
      if (this.register_userName.length < 1) {
        Toast({
          message: '手机号不能为空',
          duration: 800
        })
      } else if (!this.phoneRegex(this.register_userName)) {
        Toast({
          message: '手机号格式不正确',
          duration: 800
        })
      }
    },
    // 7.用户协议
    agreement(index) {
      console.log('index', index)
      window.location.href = 'https://youzan.github.io/vant/#/zh-CN/area'
    },
    // 正则验证
    phoneRegex(number) {
      return (/[1][3,4,5,6,7,8][0-9]{9}$/.test(number))
    }
  }
}
</script>
<style lang="less" scoped>
#login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("./back2.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  .loginBox {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    opacity: 0.95;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
    .auth-form {
      position: relative;
      padding: 2rem;
      width: 26.5rem;
      max-width: 90%;
      font-size: 1.167rem;
      background-color: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      padding-top: 1rem;
    }
    .panfish{
      text-align: center;
    }
    img {
      position: absolute;
      top: 1rem;
      left: 50%;
      width: 4rem;
      transform: translate(-50%, -70%);
      z-index: 1;
      @media screen and (max-width: 320px) {
        top: 0.5rem;
        transform: translate(-50%, -40%);
        width: 5rem;
      }
    }
    .closeButton {
      position: absolute;
      right: 1rem;
      top: 0.4rem;
    }
    .verificationImage {
      position: absolute;
      right: 0;
      width: 8rem;
      height: 3rem;
      margin-left: 3rem;
    }
    .switchLogin {
      margin-top: 1rem;
      font-size: 0.78rem;
    }
  }
}
.title {
  padding: 0.5rem;
  font-size: 0.5rem;
  color: grey;
}
.agreement {
  // margin-top: 1.667rem;
  line-height: 1rem;
  color: #767676;
  font-size: 0.867rem;
  .agreement-box {
    color: blue;
  }
}
</style>
