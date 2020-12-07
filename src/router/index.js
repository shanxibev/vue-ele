import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/Home/index.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login/index.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});
// 路由守卫 登录才可以跳转页面
router.beforeEach((to, from, next) => {
    // console.log(to);//要去的位置，从哪里来的，名字
    // console.log(from);//以前的位置，到哪里去，路径
    // console.log(next);//方法

    //声明看有没有登录
    const isLogin = localStorage.getItem('ele_login') ? true : false;
    if (to.path === '/login') {
        // 往下一步走
        next();
    } else {
        // localStorage.setItem('ele_login', true) //可以正常跳转
        // 是否登录,没有登录就重定向到登录页面，如果登录了就正常往下一步走 next();
        isLogin ? next() : next('/login');
        // 后台写 ele_login true 可以跳转

    }
})
export default router;
