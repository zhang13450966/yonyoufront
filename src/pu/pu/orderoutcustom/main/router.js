import { asyncComponent } from 'nc-lightapp-front';
import OutCustomList from '../list';

const OutCustomCard = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/orderoutcustom/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: OutCustomList,
		exact: true
	},
	{
		path: '/list',
		component: OutCustomList
	},
	{
		path: '/card',
		component: OutCustomCard
	}
];

export default routes;
