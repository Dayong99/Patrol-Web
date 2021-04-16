import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import db from '@/utils/localstorage'
import request from '@/utils/request'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const constRouter = [{
        path: '/404',
        component: () =>
            import ('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/login',
        name: '登录页',
        component: () =>
            import ('@/views/login/index')
    },
    {
        path: '/model',
        name: '模块页',
        component: () =>
            import ('@/views/login/model')
    },
    // {
    //   path: '/dashboard',
    //   name: '主页',
    //   component: () => import('@/views/dashboard/index')
    // },
    {
        path: '/',
        name: '模块页',
        component: () =>
            import ('@/views/login/model')
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: 'dashboard', icon: 'dashboard', affix: true }
        }]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/profile/index'),
            name: 'Profile',
            meta: { title: 'profile', icon: 'user', noCache: true }
        }]
    },
    {
        path: '/document',
        name: '文档',
        component: () =>
            import ('@/views/textdocument/textpdf'),
    },
    {
        path: '/excel',
        name: 'Excel',
        component: () =>
            import ('@/views/textdocument/textexcel'),
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: {
            title: 'errorPages',
            icon: '404'
        },
        children: [{
            path: '404',
            component: () =>
                import ('@/views/error-page/404'),
            name: 'Page404',
            meta: { title: 'page404', noCache: true }
        }]
    }
]

const adminRouter = [{
        path: "/inspection_report",
        name: "巡察报告",
        component: "Layout",
        meta: {
            title: "巡察报告",
            icon: "el-icon-document-copy",
            breadcrumb: false,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/inspection_report",
            name: "巡察报告",
            component: "admin/inspection_report/index",
            meta: { title: "巡察报告", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]

    },
    {
        path: "/issue_list",
        name: "问题清单",
        component: "Layout",
        meta: {
            title: "问题清单",
            // icon: "iconfont icon-baogao-copy",
            icon: "el-icon-document",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
                path: "/issue_list/district_level",
                name: "区级问题",
                component: "admin/issue_list/district_level",
                meta: { title: "区级问题", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/issue_list/village_level",
                name: "村社级问题",
                component: "admin/issue_list/village_level",
                meta: { title: "村社级问题", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/issue_list/intelligent_analysis",
                name: "智能分析",
                component: "admin/issue_list/intelligent_analysis",
                meta: { title: "智能分析", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
        ],
    },
    {
        path: "/special_report",
        name: "专题报告",
        component: "Layout",
        meta: {
            title: "专题报告",
            // icon: "iconfont icon-baogao",
            icon: "el-icon-tickets",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/special_report/index",
            name: "专题报告",
            component: "admin/special_report/index",
            meta: { title: "专题报告", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]
    },
    {
        path: "/correct",
        name: "立行立改及立查立处",
        component: "Layout",
        meta: {
            title: "立行立改及立查立处",
            icon: "el-icon-data-line",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/correct/index",
            name: "立行立改",
            component: "admin/correct/index",
            meta: { title: "立行立改", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, {
            path: "/correct/check",
            name: "立查立处",
            component: "admin/correct/check",
            meta: { title: "立查立处", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }]
    },
    {
        path: "/clue",
        name: "线索办理",
        component: "Layout",
        meta: {
            title: "线索办理",
            icon: "el-icon-bangzhu",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
                path: "/clue/list",
                name: "清单列表",
                component: "admin/clue/list",
                meta: { title: "清单列表", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/clue/analysis",
                name: "智能分析",
                component: "admin/clue/analysis",
                meta: { title: "智能分析", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },

        ],
    },
    {
        path: "/suggest",
        name: "移交问题建议",
        component: "Layout",
        meta: {
            title: "移交问题建议",
            icon: "el-icon-chat-dot-square",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/suggest/index",
            name: "移交问题建议",
            component: "admin/suggest/index",
            meta: { title: "移交问题建议", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]
    },
    {
        path: "/system",
        name: "系统设置",
        component: "Layout",
        meta: {
            title: "系统设置",
            icon: "el-icon-setting",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
                path: "/system/district_level",
                name: "区级层面巡察对象库",
                component: "admin/system/district_level/district_level",
                meta: {
                    title: "区级层面巡察对象库",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/village_level",
                name: "村/社区巡察对象库",
                component: "admin/system/village_level/village_level",
                meta: {
                    title: "村/社区巡察对象库",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/people_management",
                name: "人员管理",
                component: "admin/system/people_management",
                meta: {
                    title: "人员管理",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/department_management",
                name: "部门管理",
                component: "admin/system/department_management",
                meta: {
                    title: "部门管理",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/inspection_management",
                name: "巡察任务",
                component: "admin/system/inspection_management",
                meta: {
                    title: "巡察任务",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/issue_list",
                name: "问题清单便签分类",
                component: "admin/system/issue_list",
                meta: {
                    title: "问题清单便签分类",
                    icon: "",
                    breadcrumb: true,

                },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/system/clue",
                name: "线索办理便签分类",
                component: "admin/system/clue",
                meta: {
                    title: "线索办理便签分类",
                    icon: "",
                    breadcrumb: true,
                },
                hidden: false,
                alwaysShow: false,
            },

        ],
    }
]

const userRouter = [{
        path: "/user-inspection_report",
        name: "巡察报告",
        component: "Layout",
        meta: {
            title: "巡察报告",
            icon: "el-icon-document-copy",
            breadcrumb: false,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/user-inspection_report",
            name: "巡察报告",
            component: "normal_user/inspection_report/index",
            meta: { title: "巡察报告", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]

    },
    {
        path: "/user-issue_list",
        name: "问题清单",
        component: "Layout",
        meta: {
            title: "问题清单",
            icon: "iconfont icon-baogao-copy",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
                path: "/user-issue_list/district_level",
                name: "区级问题",
                component: "normal_user/issue_list/district_level",
                meta: { title: "区级问题", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/user-issue_list/village_level",
                name: "村社级问题",
                component: "normal_user/issue_list/village_level",
                meta: { title: "村社级问题", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/user-issue_list/intelligent_analysis",
                name: "智能分析",
                component: "normal_user/issue_list/intelligent_analysis",
                meta: { title: "智能分析", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
        ],
    },
    {
        path: "/user-special_report",
        name: "专题报告",
        component: "Layout",
        meta: {
            title: "专题报告",
            icon: "iconfont icon-baogao",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/user-special_report/index",
            name: "专题报告",
            component: "normal_user/special_report/index",
            meta: { title: "专题报告", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]
    },
    {
        path: "/user-correct",
        name: "立行立改及立查立处",
        component: "Layout",
        meta: {
            title: "立行立改及立查立处",
            icon: "el-icon-data-line",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/user-correct/index",
            name: "立行立改",
            component: "normal_user/correct/index",
            meta: { title: "立行立改", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, {
            path: "/user-correct/check",
            name: "立查立处",
            component: "normal_user/correct/check",
            meta: { title: "立查立处", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }]
    },
    {
        path: "/user-clue",
        name: "线索办理",
        component: "Layout",
        meta: {
            title: "线索办理",
            icon: "el-icon-bangzhu",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
                path: "/user-clue/list",
                name: "清单列表",
                component: "normal_user/clue/list",
                meta: { title: "清单列表", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },
            {
                path: "/user-clue/analysis",
                name: "智能分析",
                component: "normal_user/clue/analysis",
                meta: { title: "智能分析", icon: "", breadcrumb: true },
                hidden: false,
                alwaysShow: false,
            },

        ],
    },
    {
        path: "/user-suggest",
        name: "移交问题建议",
        component: "Layout",
        meta: {
            title: "移交问题建议",
            icon: "el-icon-chat-dot-square",
            breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
        children: [{
            path: "/user-suggest/index",
            name: "移交问题建议",
            component: "normal_user/suggest/index",
            meta: { title: "移交问题建议", icon: "", breadcrumb: true },
            hidden: false,
            alwaysShow: false,
        }, ]
    }
]


const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {

    NProgress.start()
    if (whiteList.indexOf(to.path) !== -1) {
        asyncRouter = null
        next()
    } else {
        const user = store.state.account.user
        if (user.role) {

            if (!asyncRouter) {

                const position = user.role
                if (position == '管理员' || position == "巡察办") {
                    asyncRouter = adminRouter
                } else if (position == "巡察组") {
                    asyncRouter = userRouter
                }

                store.commit('account/setRoutes', asyncRouter)
                save('USER_ROUTER', asyncRouter)
                go(to, next)

            } else {
                next()
                    // next('/login')
            }
        } else {
            if (to.path === '/login') {
                next()
            } else {
                next('/login')
            }
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})


function go(to, next) {
    asyncRouter = filterAsyncRouter(asyncRouter)

    router.addRoutes(asyncRouter)
    next({...to, replace: true })
}

function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}

function get(name) {
    return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter(routes) {
    if (routes) {
        return routes.filter((route) => {
            const component = route.component
            if (component) {
                if (route.component === 'Layout') {
                    route.component = Layout
                } else {
                    route.component = view(component)
                }
                if (route.children && route.children.length) {
                    route.children = filterAsyncRouter(route.children)
                }
                return true
            }
        })
    }

}

function view(path) {
    return function(resolve) {
        //   import(`@/views/${path}.vue`).then(mod => {
        //     resolve(mod)
        //   })
        require([`@/views/${path}.vue`], mod => {
            resolve(mod)
        })
    }
}
export default router
