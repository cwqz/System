import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 静态路由
const routes = [{
        path: "/",
        name: "Login",
        component: () =>
            import ("@/views/Login.vue"),
        hidden: true
    },
    {
        path: "/Survey",
        name: "系统整体概况",
        component: () =>
            import ("@/views/Survey.vue"),
        hidden: true

    },
    {
        path: "/Home",
        name: "Home",
        component: () =>
            import ("@/views/Home.vue"),
        hidden: true,
        children: [
        {
            path: "/Home",
            name: "首页",
            component: () =>
                import ("@/views/Index.vue"),
            hidden: true
        },
      
        {
            path: "/receiveNotice",
            name: "通知",
            component: () =>
                import ("@/views/notice/receiveNotice.vue"),
            hidden: true
        },
        {
            path: "/sendNotice",
            name: "发布通知",
            component: () =>
                import ("@/views/notice/sendNotice.vue"),
            hidden: true
        },
        {
            path: "/detailsNotice",
            name: "消息详情",
            component: () =>
                import ("@/views/notice/detailsNotice.vue"),
            hidden: true
        },
        {
            path: "/personal",
            name: "个人中心",
            component: () =>
                import ("@/views/personal.vue"),
            hidden: true
        }
    ]
    },
    {
        path: "/waterAbnormal",
        name: "waterAbnormal",
            component: () =>
                import ("@/views/diagnosis/abnormal/waterAbnormal.vue"),
            hidden: true
    }
];

const router = new VueRouter({
    mode: "history",
    // base:"/znyt/",
    base: process.env.BASE_URL,
    routes
});
export default router;