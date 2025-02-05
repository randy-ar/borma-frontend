import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/Index.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/auth/login',
      name: 'auth.login',
      component: () => import('../views/auth/Login.vue'),
      meta: {
        layout: 'home-layout'
      }
    },
    {
      path: '/admin/toko',
      name: 'admin.toko.index',
      component: () => import('../views/admin/toko/Index.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/admin/barang',
      name: 'admin.barang.index',
      component: () => import('../views/admin/barang/Index.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/admin/barang/create',
      name: 'admin.barang.create',
      component: () => import('../views/admin/barang/Create.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/admin/barang/edit/:kode_barang',
      name: 'admin.barang.edit',
      component: () => import('../views/admin/barang/Edit.vue'),
      meta: {
        layout: 'admin-layout'
      },
      props: true
    },
    {
      path: '/admin/kassa',
      name: 'admin.kassa.index',
      component: () => import('../views/admin/kassa/Index.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/admin/kassa/create',
      name: 'admin.kassa.create',
      component: () => import('../views/admin/kassa/Create.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/admin/kassa/edit/:kode_kassa',
      name: 'admin.kassa.edit',
      component: () => import('../views/admin/kassa/Edit.vue'),
      meta: {
        layout: 'admin-layout'
      },
      props: true
    },
    {
      path: '/admin/transaksi',
      name: 'admin.transaksi.index',
      component: () => import('../views/admin/transaksi/Index.vue'),
      meta: {
        layout: 'admin-layout'
      }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/Index.vue'),
      meta: {
        layout: 'home-layout'
      }
    },
  ],
})

export default router
