import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import TransactionDoer from '../components/TransactionDoer.vue';
import UploadDoer from '../components/UploadDoer.vue';
import MaterialDoer from '../components/MaterialDoer.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/transaction-doer', component: TransactionDoer },
    { path: '/upload-doer', component: UploadDoer },
    { path: '/material-doer', component: MaterialDoer }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
