/*
 * @Author: CongKe 
 * @PageInfo: 采购订单修订路由 
 * @Date: 2018-08-09 19:49:36 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-29 11:12:36
 */
import { asyncComponent } from 'nc-lightapp-front';
import OrderReviseList from '../list';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/orderrevise/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: OrderReviseList,
		exact: true
	},
	{
		path: '/list',
		component: OrderReviseList
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;
