import { asyncComponent } from 'nc-lightapp-front';

const list = asyncComponent(() =>
    import(/*webpackChunkName: "scmpub/scmpub/driver/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const routes = [
    {
        path: '/',
        component: list,
        exact: true
    },
    {
        path: '/list',
        component: list
    }
];

export default routes;