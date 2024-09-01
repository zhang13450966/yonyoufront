import { asyncComponent } from 'nc-lightapp-front';
import ArrivalList from '../list';
//import card from '../card';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/arrival/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const ref21 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/arrival/transfer21/ref21"*/ /* webpackMode: "eager" */ '../transfer21')
);
const return21 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/arrival/return21/ref21"*/ /* webpackMode: "eager" */ '../return21')
);
const return61 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/arrival/return61/ref61"*/ /* webpackMode: "eager" */ '../return61')
);

const ref61 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/arrival/transfer61/ref61"*/ /* webpackMode: "eager" */ '../transfer61')
);
const routes = [
	{
		path: '/',
		component: ArrivalList,
		exact: true
	},
	{
		path: '/list',
		component: ArrivalList
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/return21',
		component: return21
	},
	{
		path: '/return61',
		component: return61
	},
	{
		path: '/ref21',
		component: ref21
	},
	{
		path: '/ref61',
		component: ref61
	}
];
export default routes;
