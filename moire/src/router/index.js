import { createRouter, createWebHistory } from 'vue-router';
import CatalogView from '@/views/CatalogView.vue';

const routes = [
  { path: '/', name: 'catalog', component: CatalogView },
  // {
  //   path: '/product/:id',
  //   name: 'product',
  //   component: () => import('@/views/ProductView.vue'), // ленивая загрузка
  // },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
  },
  // {
  //   path: '/order/',
  //   name: 'order',
  //   component: () => import('@/views/OrderView.vue'),
  // },
  // {
  //   path: '/order/:id',
  //   name: 'orderInfo',
  //   component: () => import('@/views/OrderInfoView.vue'),
  // },
  // {
  //   path: '/*',
  //   name: 'notFound',
  //   component: () => import('@/views/NotFoundView.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // ! ОБЯЗАТЕЛЬНО в адрес для статичных ресурсов (напр., link:css в index.html) подставлять <%= BASE_URL %>
  routes,
  scrollBehavior(to, from, savedPosition) {
    // возвращаем требуемую позицию прокрутки
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
