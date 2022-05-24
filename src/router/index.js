import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const HomeView = () => import('@/views/HomeView.vue');
const ManageView = () => import(/* webpackChunkName> "groupedChunk" */ '@/views/ManageView.vue');
const SongView = () => import(/* webpackChunkName> "groupedChunk" */ '@/views/SongView.vue');
const AboutView = () => import('@/views/AboutView.vue');

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView,
  },
  {
    name: 'manage',
    path: '/manage-music',
    // alias: '/manage',
    component: ManageView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }
  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
