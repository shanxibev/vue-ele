<template>
  <div id="login">
    <div class="login_wrap">
      <ul class="menu_tab">
        <li
          :class="{ current: item.current }"
          v-for="(item, index) in menuTab"
          :key="index"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="form_item">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form_item">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-show="mode == 'register'"
          prop="password1"
          class="form_item"
        >
          <label for="password1">请确认密码</label>
          <el-input
            id="password1"
            type="text"
            v-model="ruleForm.password1"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="form_item">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <!-- 强制限制输入的位数 -->
            <!-- maxlength="6"
                minlength="6" -->
            <el-col :span="15"
              ><el-input id="code" v-model="ruleForm.code"></el-input
            ></el-col>
            <el-col :span="9"
              ><el-button
                type="success"
                style="display:block; width: 100%;"
                @click="getCode"
                >获取验证码</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item class="form_item">
          <el-button
            type="danger"
            style="display:block; width: 100%;margin-top: 30px;"
            @click="submitForm('ruleForm')"
            >{{ this.mode == 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 导入过滤特殊字符的函数
import validateUtils from '@/utils/validate.js'
import { onMounted, reactive, ref } from '@vue/composition-api'
import { get_code } from '@/api/login.js'
export default {
  setup(prop, { refs, root }) {
    //  -----------------------     生命周期     ---------------------------------------------

    onMounted(()=>{
         get_code( {
            username: '123@qq.com',
            password: 'fdassd11'
         }).then((res)=>{//.then必须是一个promies
            console.log(res)
         }).catch((err)=>{
            console.log('Error',err)//最后
         })
      })
    //  -----------------------     data      ---------------------------------------------
    let validateUsername = (rule, value, callback) => {
      ruleForm.username = value = validateUtils.validate_inputValue(
        value,
        'email'
      )
      //   let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      //   严谨模式的邮箱
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (validateUtils.test_email(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    // 密码验证
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = value = validateUtils.validate_inputValue(
        value,
        'password'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value === '') {
        //   输入错误
        callback(new Error('请输入密码'))
      } else if (validateUtils.test_password(value)) {
        callback(new Error('密码格式需6~20位'))
      } else {
        //   输入正确
        callback()
      }
    }
    // 重复密码验证
    let validatePassword1 = (rule, value, callback) => {
      // 登录时不在重复捕捉输入密码
      if (mode.value == 'login') {
        callback()
        return
      }
      //   console.log('重复密码')
      ruleForm.password1 = value = validateUtils.validate_inputValue(
        value,
        'password1'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value !== ruleForm.password) {
        //   输入错误
        callback(new Error('两次密码输入不一致'))
      } else {
        //   输入正确
        callback()
      }
    }
    //   验证码验证
    let validateCode = (rule, value, callback) => {
      //过滤特殊字符
      ruleForm.code = value = validateUtils.validate_inputValue(value, 'code')

      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (validateUtils.test_code(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }
    // 定义tab切换模式
    const mode = ref('login')
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' },
    ])
    //   input双向数据绑定
    const ruleForm = reactive({
      username: '',
      password: '',
      password1: '',
      code: '',
    })
    //   校验方式
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      password1: [{ validator: validatePassword1, trigger: 'blur' }],
      code: [{ validator: validateCode, trigger: 'blur' }],
    })

    //  -----------------------     methods      ---------------------------------------------
    const toggleMenu = (item) => {
      menuTab.map((item) => (item.current = false))
      item.current = true
      mode.value = item.type
      //   点击切换的时候清除数据
      refs['ruleForm'].resetFields()
    }
    // 对表单的每一个字段再次进行验证
    const submitForm = (formName) => {
      refs[formName].validate((result) => {
        if (result) {
          alert('submit!')
        } else {
          //   console.log('error submit!!')
          //   console.log(result)
          return false
        }
      })
    }
    // 获取验证码请求
    const getCode = () => {
      // 判断如果没有邮箱或者不存在
      if (ruleForm.username == '') {
        root.$message.error('邮箱不能为空！！')
        return false
      }
            const data = {//定义data
              username: ruleForm.username,//邮箱
              module: mode.value,
            }
      get_code(data).then((res) => {//验证码
          root.$message.success(res.data.message)//验证码
        })
        .catch((err) => {
          console.log(2)
        })
    }
    return {
      mode,
      menuTab,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getCode,
    }
    //  -----------------------     data      ---------------------------------------------
  },
}
</script>
<style lang="scss" scoped>
#login {
  height: 100vh; //基于浏览器的可视区域
  background-color: #344a5f;
  .login_wrap {
    width: 329px;
    height: 652px;
    margin: 0px auto 0 auto;
    box-sizing: content-box;

    .menu_tab {
      text-align: center;
      padding-top: 180px;
      margin-bottom: 39px;
      li {
        width: 88px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 2px;
        display: inline-block;
      }
      .current {
        background-color: #304256;
      }
    }
  }
}
.login-form {
  label {
    display: block;
    color: #fff;
    font-size: 14px;
    margin-bottom: 3px;
  }
  .form_item {
    margin-bottom: 13px;
  }
}
</style>
