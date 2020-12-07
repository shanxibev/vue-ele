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
      <!-- <p>{{ num1 }}</p>
      <p>{{ obj.name }}</p>
      <p @click="test">自定义</p> -->
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
              ><el-button type="success" style="display:block; width: 100%;"
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
export default {
  setup(prop, { refs }) {
    //context.attrs--> this.$attrs //包含了父组件给子组件传递的属性(除了prop,style,class之外其他的属性)
    //context.slots--> this.$slots //访问当前组件中的具名插槽
    //context.parent-->this.$parent //代表父组件的实例对象 this.$parent,调用父组件的方法和属性
    //context.root-->this.$root //更组件
    //context.emit--> this.$emit //子组件向父组件触发一个自定义方法，目的是为了传递参数，是实现2.0父子组件传值的基本方式
    //context.refs--> this.$refs //组件中获取dom元素的引用，返回的是一个对象，ref在dom返回就是dom的js对象，ref在子组件上，返回的是子组件的实例对象 this.$refs.xx 调用子组件的数据和方法

    // 1.数据的定义和使用
    // 引用类型 object array
    const obj = reactive({ name: 'zhangsan', age: '18' })
    console.log(obj.name)
    //基本数据类型 string number boolean null undefined 返回的是一个相应式对象
    const num = ref(100)
    console.log(num)
    console.log(num.value)
    num.value = 200

    const falg = ref(true)
    console.log(falg)
    falg.value = false
    const num1 = 400
    console.log(falg.value)
    /*
    相应式对象
    //获取 value触发get方法
    num.value
    // 设置value新值触发set方法  -->通知视图更新
    num.value = 200
     */
    // 2.  setup 定义数据，生命周期钩子，自定义方法
    //2.1定义的数据必须return ,不return,不能在模板中使用
    // 2.2 定义生命周期
    onMounted(() => {
      // 回调函数
      //   console.log('aaa')
      //   也可以执行函数
      //   test()
    })
    // 2.3定义自定义方法  在模板中使用函数必须return
    // const test = (() => {
    //   console.log('定义自定义方法')
    // })
    // 同上简化括号
    const test = () => {
      //   console.log('定义自定义方法')
    }
    return {
      obj,
      //   num,
      num1,
      test,
    }
  },
  data() {
    // 邮箱验证
    var validateUsername = (rule, value, callback) => {
      this.ruleForm.username = value = validateUtils.validate_inputValue(
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
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password = value = validateUtils.validate_inputValue(
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
    var validatePassword1 = (rule, value, callback) => {
      // 登录时不在重复捕捉输入密码
      if (this.mode == 'login') {
        callback()
        return
      }
      console.log('重复密码')
      this.ruleForm.password1 = value = validateUtils.validate_inputValue(
        value,
        'password1'
      )
      // 验证的字段 rule  输入的值 value 验证后做的操作（回调函数）
      //   注意是数字字母组合

      if (value !== this.ruleForm.password) {
        //   输入错误
        callback(new Error('两次密码输入不一致'))
      } else {
        //   输入正确
        callback()
      }
    }

    //   验证码验证
    var validateCode = (rule, value, callback) => {
      //过滤特殊字符
      this.ruleForm.code = value = validateUtils.validate_inputValue(
        value,
        'code'
      )

      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (validateUtils.test_code(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }
    return {
      mode: 'login',
      menuTab: [
        { txt: '登录', current: true, type: 'login' },
        { txt: '注册', current: false, type: 'register' },
      ],
      //   input双向数据绑定
      ruleForm: {
        username: '',
        password: '',
        password1: '',
        code: '',
      },
      //   校验方式
      rules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        password1: [{ validator: validatePassword1, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }],
      },
    }
  },
  methods: {
    toggleMenu(item) {
      this.menuTab.map((item) => (item.current = false))
      item.current = true
      this.mode = item.type
    },
    // 对表单的每一个字段再次进行验证
    submitForm(formName) {
      this.$refs[formName].validate((result) => {
        if (result) {
          alert('submit!')
        } else {
          //   console.log('error submit!!')
          //   console.log(result)
          return false
        }
      })
    },
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
      padding-top: 220px;
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
