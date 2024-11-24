import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/MainPage.vue';
import DestinationPick from '@/views/DestinationPick.vue';
import PlanList from '@/views/plan/PlanList.vue';
import PlanView from '@/views/plan/PlanView.vue';
import LoginPage from '@/views/LoginPage.vue';

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
    {
        path: '/plan/:planId',
        name: 'PlanView',
        component: PlanView,
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;