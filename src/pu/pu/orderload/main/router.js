import { asyncComponent } from 'nc-lightapp-front';
import LoadList from '../list';

const LoadCard = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/orderload/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: LoadList,
		exact: true
	},
	{
		path: '/list',
		component: LoadList
	},
	{
		path: '/card',
		component: LoadCard
	}
];

export default routes;
