import { asyncComponent } from 'nc-lightapp-front';
import comparebillList from '../list';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/comparebill/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const transfer21 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/comparebill/transfer21/transfer21"*/ /* webpackMode: "eager" */ '../transfer21')
);
const transfer45 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/comparebill/transfer45/transfer45"*/ /* webpackMode: "eager" */ '../transfer45')
);
const routes = [
	{
		path: '/',
		component: comparebillList,
		exact: true
	},
	{
		path: '/list',
		component: comparebillList
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/transfer21',
		component: transfer21
	},
	{
		path: '/transfer45',
		component: transfer45
	}
];

export default routes;
