import { asyncComponent } from 'nc-lightapp-front';
import PlanConfirmList from '../list/list';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/planconfirm/card/card"*/ /* webpackMode: "eager" */ '../card/card')
);
const transfer = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/planconfirm/transfer/transfer"*/ /* webpackMode: "eager" */ '../transfer')
);
const transfer21P = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/planconfirm/transfer/transfer"*/ /* webpackMode: "eager" */ '../transfer21P')
);
const routes = [
	{
		path: '/',
		component: PlanConfirmList,
		exact: true
	},
	{
		path: '/list',
		component: PlanConfirmList
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/transfer',
		component: transfer
	},
	{
		path: '/transfer21P',
		component: transfer21P
	}
];

export default routes;
