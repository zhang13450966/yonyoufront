import { asyncComponent } from 'nc-lightapp-front';
import SendoutList from '../list';

const SendoutCard = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/ordersendout/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: SendoutList,
		exact: true
	},
	{
		path: '/list',
		component: SendoutList
	},
	{
		path: '/card',
		component: SendoutCard
	}
];

export default routes;
