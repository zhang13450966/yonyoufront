import { asyncComponent } from 'nc-lightapp-front';

const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/orderoutput/list/list"*/ /* webpackMode: "eager" */ '../list')
);

const routes = [
	{
		path: '/list',
		component: list
	}
];

export default routes;
