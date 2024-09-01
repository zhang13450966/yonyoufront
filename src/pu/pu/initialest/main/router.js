/*
 * @Author: zhaochyu 
 * @PageInfo: 路由文件
 * @Date: 2018-08-08 16:04:33 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:04:14
 */
import { asyncComponent } from 'nc-lightapp-front';
//import InitialEstList from "../list";
const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/initialest/list/list"*/ /*webpackMode:"eager"*/ '../list')
);
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/initialest/card/card"*/ /*webpackMode:"eager"*/ '../card')
);
const transfer = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/initialest/transfer/transfer"*/ /*webpackMode:"eager"*/ '../transfer')
);
//const transfer = asyncComponent(() => import("../transfer"));
const routes = [
	{
		path: '/',
		component: list,
		exact: true
	},
	{
		path: '/list',
		component: list
	},
	{
		path: '/card',
		component: card
	},
	{
		path: '/transfer',
		component: transfer
	}
];
export default routes;
