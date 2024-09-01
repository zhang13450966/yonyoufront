import { asyncComponent } from 'nc-lightapp-front';
import CustomList from '../list';

const CustomCard = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/ordercustom/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: CustomList,
		exact: true
	},
	{
		path: '/list',
		component: CustomList
	},
	{
		path: '/card',
		component: CustomCard
	}
];

export default routes;
