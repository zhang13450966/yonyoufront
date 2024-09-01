import { asyncComponent } from 'nc-lightapp-front';

const list = asyncComponent(() =>
    import(/*webpackChunkName: "scmpub/scmpub/carriergroup/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const card = asyncComponent(() =>
    import(/*webpackChunkName: "scmpub/scmpub/carriergroup/card/card"*/ /* webpackMode: "eager" */ '../card')
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
    },
    {
        path: '/card',
        component: card
    }
];

export default routes;