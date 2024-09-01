import { asyncComponent } from 'nc-lightapp-front';
import PricestlList from '../list';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const transfer30 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer30/transfer30"*/ /* webpackMode: "eager" */ '../transfer30')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer30/transfer30"*/ /* webpackMode: "eager" */ '../list')
);
const routes = [
	{
		path: '/',
		component: PricestlList,
		exact: true
	},
	{
		path: '/list',
		component: PricestlList
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/transfer30',
		component: transfer30
	}
];
export default routes;
