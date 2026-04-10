import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import DetailView from '@/views/DetailView.vue';
import MainPortalView from '@/views/MainPortalView.vue';
import DivinationView from '@/views/DivinationView.vue';
import GanZhiView from '@/views/GanZhiView.vue';
import MeiHuaView from '@/views/MeiHuaView.vue';
import FiveElementsView from '@/views/FiveElementsView.vue';
import BasicsView from '@/views/BasicsView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portal',
      component: MainPortalView,
    },
    {
      path: '/hexagrams',
      name: 'hexagrams',
      component: HomeView,
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailView,
    },
    {
      path: '/divination',
      name: 'divination',
      component: DivinationView,
    },
    {
      path: '/ganzhi',
      name: 'ganzhi',
      component: GanZhiView,
    },
    {
      path: '/meihua',
      name: 'meihua',
      component: MeiHuaView,
    },
    {
      path: '/five-elements',
      name: 'five-elements',
      component: FiveElementsView,
    },
    {
      path: '/basics',
      name: 'basics',
      component: BasicsView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // 这里的延时应略小于或等于过渡动画时长 (0.25s)
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        } else {
          resolve({ top: 0 });
        }
      }, 200); // 200ms 是一个比较平滑的折中值
    });
  },
});

export default router;
