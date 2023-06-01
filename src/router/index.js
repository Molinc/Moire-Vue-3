import { createRouter, createWebHashHistory } from 'vue-router';
import CatalogView from '@/views/CatalogView.vue';

const routes = [
  { path: '/', name: 'catalog', component: CatalogView },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/ProductView.vue'), // ленивая загрузка
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/OrderView.vue'),
  },
  {
    path: '/order/:id',
    name: 'orderInfo',
    component: () => import('@/views/OrderInfoView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL), // ! ОБЯЗАТЕЛЬНО в адрес для статичных ресурсов (напр., link:css в index.html) подставлять <%= BASE_URL %>
  routes,
  scrollBehavior(to, from, savedPosition) {
    // применить позицию, если есть сохраненная позиция, либо если это изменение параметров одной и той же страницы
    if (savedPosition || from.path == to.path) {
      const position = {
        left: savedPosition?.left,
        top: savedPosition?.top,
        // добавить плавную прокрутку с нужному месту
        behavior: 'smooth',
      };

      return new Promise((resolve) => {
        // чтобы все нужные DOM-элементы успели отрендериться, добавляем таймаут
        setTimeout(() => {
          resolve(position);
        }, 1000);
      });
    }

    // в остальных случаях отмотать наверх
    return { left: 0, top: 0 };
  },
});

export default router;
