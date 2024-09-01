import { asyncComponent } from 'nc-lightapp-front';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/buyingreqr/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/buyingreqr/list/list"*/ /* webpackMode: "eager" */ '../list')
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
