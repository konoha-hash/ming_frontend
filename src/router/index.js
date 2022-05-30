import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manage',
    component: () => import('../views/Manage'),
    children:[
      {path: 'user',
      name: 'User',
      component: () => import('../views/User.vue'),}
    ]
  },
  {
    path: '/ming',
    name: 'MingMain',
    component: () => import('../views/MingMain'),
    children:[
        {
          path: 'drought',
          name: 'Drought',
          component: () => import('../views/Drought/DroughtMain'),
          children:[
            {
              path: 'maininfo',
              name: '实时信息',
              component: () => import('../components/ming/Drought/MainInfo'),
            }
          ]
        },

    ]
  },
    // 干旱子系统
  {
    path: '/drought',
    name: '干旱',
    component: () => import('../views/Drought/DroughtMain'),
    children:[
      {
        path: 'maininfo',
        name: '实时信息',
        component: () => import('../components/ming/Drought/MainInfo'),
      },
      {
        path: 'imgDataMan',
        name: '影像数据管理',
        component: () => import('../views/Drought/DataMan/ImgDataMan'),
      },
      {
        path: 'algorithmDoc',
        name: '算法调度',
        component: () => import('../views/Drought/Algorithm/AlgorithmDoc'),
      },
      {
        path: 'thematicData',
        name: '专题数据管理',
        component: () => import('../views/Drought/DataMan/ThematicData'),
      },
      {
        path: 'monitoringEquip',
        name: '监测设备管理',
        component: () => import('../views/Drought/MonitoringEquipmentMan/MonitoringEquip'),
      },
      {
        path: 'TVDIMonth',
        name: '干旱指数',
        component: () => import('../views/Drought/TVDI/TVDIMonth'),
      },
      {
        path: 'RSEI',
        name: '遥感生态指数',
        component: () => import('../views/Drought/RSEI/RSEIanalysis'),
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
