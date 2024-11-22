import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/MainPage.vue';
import DestinationPick from '@/views/DestinationPick.vue';
import PlanList from '@/views/plan/PlanList.vue';

const routes = [
    {
        path: '/',
        name: 'HOME',
        component: HomePage,
    },
    {
        path: '/destination',
        name: 'DestinationPick',
        component: DestinationPick,
    },
    {
        path: '/plans/:destination',
        name: 'PlanList',
        component: PlanList,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;