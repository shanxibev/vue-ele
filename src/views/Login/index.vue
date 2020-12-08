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
                v-bind:disabled='codeButtonStatus'
                >{{ codeButtonText }}</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item class="form_item">
          <el-button
           type="danger"
            :disabled='buttonStatus'
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
import { get_code,do_registor,do_login} from '@/api/login.js'
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
    const status_username = ref ( false )
    const status_password = ref ( false )
    const status_password1 = ref ( false )
    let validateUsername = (rule, value, callback) => {
      ruleForm.username = value = validateUtils.validate_inputValue(
        value,
        'email'
      )
      //   let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      //   严谨模式的邮箱
      if (value === '') {
        status_username.value = false
        callback(new Error('请输入邮箱'))
      } else if (validateUtils.test_email(value)) {
        status_username.value = false
        callback(new Error('邮箱格式错误'))
      } else {
        status_username.value = true
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
        status_password.value=false
        callback(new Error('请输入密码'))
      } else if (validateUtils.test_password(value)) {
         status_password.value=false
        callback(new Error('密码格式需6~20位'))
      } else {
        //   输入正确
         status_password.value=true
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
        status_password1.value = false
        callback(new Error('两次密码输入不一致'))
      } else {
         status_password1.value = true
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
    //   校验方式按钮默认的启用
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      password1: [{ validator: validatePassword1, trigger: 'blur' }],
      code: [{ validator: validateCode, trigger: 'blur' }],
    })
    //定义登录注册按钮的启用和禁用
    const buttonStatus=ref(true)
    //定义验证码的启用和禁用
    const codeButtonStatus=ref(false)
    //定义验证码按钮文本
    const codeButtonText = ref('获取验证码')
    //定义验证码延迟定时器
    const timer_delay = ref(null)
    //第一验证码倒计时定时器
    const timer_count_down = ref(null)
    //  -----------------------     methods      ---------------------------------------------
    const toggleMenu = (item) => {
      menuTab.map((item) => (item.current = false))
      item.current = true
      mode.value = item.type
      //   点击切换的时候清除数据
      refs['ruleForm'].resetFields()
      //还原验证码的相关状态
      resetCodeButton()
      //还原登录注册按钮的状态
      buttonStatus.value = true
    }
    // 对表单的每一个字段再次进行验证
    const submitForm = (formName) => {
      refs[formName].validate((result) => {
        if (result) {
           mode.value === 'login' ? dologin() : doRegister ()
        } else {
           
          return false
        }
      })
    }
    // 获取验证码请求
    const getCode = () => {
      const {result,filed} = validateFileds()
      let offset = 20
      // 判断如果没有邮箱格式以及密码重复 ，密码的
      if(!result){//如果返回的为false，则反过来执行if
         filed.map(item=>{//循环出filed的错误对象
         offset += 50//调试样式布局
          root.$message ( {
              type:'error',
              message:`错误字段:${item.massage}`,
              offset:offset,
              duration:2000//2000毫秒后关闭
          } )
         }) 
        return false
      }
       //让按钮显示发送中，禁用
      //  codeButtonText.value='发送中'
      //  codeButtonStatus.value=true
         setCodeButton({
                    status:true,
                    text:'发送中'
                 })
      //为了模拟网络延迟
     timer_delay.value = setTimeout(()=>{//3秒钟后发送验证码
           const data = {//定义data
              username: ruleForm.username,//邮箱
              module: mode.value,
            }
      get_code(data).then((res) => {//验证码
      //获取到对应验证码
          root.$message.success(res.data.message)//验证码
       //显示倒计时
       countDown(5)
       //登录注册按钮启用
          buttonStatus.value=false
       }).catch((err) => {
          console.log(err)
        })
      },1000)
           
    }
//-------------------------------------辅助方法-----------------------------
              //完成对定时器的倒计时效果
    const countDown = ((timer) =>{
      if(timer_count_down.value){
        clearTimeout(timer_delay.value)
      }
         timer_count_down.value=setInterval(()=>{
           timer--;
           if(timer === 0){//类型和值的共同判断
                //显示重新发送验证
                clearInterval(timer_count_down.value)
                // codeButtonText.value='重新发送'
                // codeButtonStatus.value=false
                 setCodeButton({
                    status:false,
                    text:'重新发送'
                 })

           }else{
              codeButtonText.value=`倒计时${timer}秒`
           }
           
         },1000)
    })
    //还原验证码的相关状态
    const resetCodeButton = ()=>{
        //默认为启用，获取验证码
        // codeButtonText.value='发送中'
        // codeButtonStatus.value=falsee
        setCodeButton({//封装
          status:false,
          text:'获取验证码'
        })
        //清空所有定时器
        clearTimeout(timer_delay.value)
        clearInterval(timer_count_down.value)
    }
    //设置获取验证码的相关状态
     const setCodeButton=({status,text})=>{//解构
        codeButtonStatus.value = status
        codeButtonText.value = text
     }
     //执行登录
     const dologin = ()=>{
            const data= {
          username:ruleForm.username,
          passwordL:ruleForm.password,
          code:ruleForm.code
        }
        //执行登录
      do_login(data).then(res=>{
        //提示注册成功
        root.$message.success(res.data.message)
     }).catch(err=>{
          console.log(err)
     })
     }
     //执行注册
     const doRegister = ()=>{
        const data= {
          username:ruleForm.username,
          passwordL:ruleForm.password,
          code:ruleForm.code
        }
        //执行注册
      do_registor(data).then(res=>{
        //提示注册成功
        root.$message.success(res.data.message)
       //注册成功后切换到登录tab
        toggleMenu(menuTab[0])
     }).catch(err=>{
          console.log(err)
     })
     }
     //发送验证码时验证密码，邮箱是否输入
     const validateFileds =()=>{
       //status_username.value&&status_password.value&&status,password1.value//只要有一个false，就返回false
       //如果 返回结果为true，则验证通过，反之，则走getCode里面的if判断
         const _filed_arr= [
             {filed:'password1',flag:status_password1.value,massage:'重复密码不正确'},
             {filed:'password',flag:status_password.value, massage:"密码不正确"},
             {filed:'username',flag:status_username.value,massage:'邮箱格式不正确'},
           ].filter(item=>!item.flag)//过滤出false
           console.log(_filed_arr)
        return{
          result:status_username.value&&status_password.value&&status_password1.value,
          filed:_filed_arr
        }
        
     }
    return {
      mode,
      menuTab,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getCode,
      buttonStatus,
      codeButtonText,
      codeButtonStatus 
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
