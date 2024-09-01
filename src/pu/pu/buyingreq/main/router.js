import { asyncComponent } from 'nc-lightapp-front';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/buyingreq/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/buyingreq/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const transfer = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/buyingreq/transfer/transfer"*/ /* webpackMode: "eager" */ '../transfer')
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
	},
	{
		path: '/transfer',
		component: transfer
	}
];

export default routes;
