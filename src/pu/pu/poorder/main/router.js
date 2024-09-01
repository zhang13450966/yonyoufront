/*
 * @Author: CongKe 
 * @PageInfo: 路由映射 
 * @Date: 2018-08-08 14:34:30 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-10 10:25:06
 */
import { asyncComponent } from 'nc-lightapp-front';
import OrderList from '../list';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const transfer20 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer20/transfer20"*/ /* webpackMode: "eager" */ '../transfer20')
);
const transferz2 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transferz2/transferz2"*/ /* webpackMode: "eager" */ '../transferz2')
);
const transfer30sale = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer30sale/transfer30sale"*/ /* webpackMode: "eager" */ '../transfer30sale')
);
const transfer30coop = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer30coop/transfer30coop"*/ /* webpackMode: "eager" */ '../transfer30coop')
);
const transfer23_45 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer23_45/transfer23_45"*/ /* webpackMode: "eager" */ '../transfer23_45')
);
const transfer49 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/poorder/transfer49/transfer49"*/ /* webpackMode: "eager" */ '../transfer49')
);

const routes = [
	{
		path: '/',
		component: OrderList,
		exact: true
	},
	{
		path: '/list',
		component: OrderList
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/transfer20',
		component: transfer20
	},
	{
		path: '/transferz2',
		component: transferz2
	},
	{
		path: '/transfer30sale',
		component: transfer30sale
	},
	{
		path: '/transfer30coop',
		component: transfer30coop
	},
	{
		path: '/transfer23_45',
		component: transfer23_45
	},
	{
		path: '/transfer49',
		component: transfer49
	}
];

export default routes;
