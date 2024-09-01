/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-物流组织-路由跳转设置  
 * @Date: 2020-01-17 09:45:22 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-12 14:54:05
 */
import { asyncComponent } from 'nc-lightapp-front';

const cardPage = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/routeorg/card/Card"*/ /* webpackMode: "eager" */ '../card')
);
const listPage = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/routeorg/list/List"*/ /* webpackMode: "eager" */ '../list')
);
const routes = [
	{
		path: '/',
		component: listPage,
		exact: true
	},
	{
		path: '/list',
		component: listPage
	},
	{
		path: '/card',
		component: cardPage
	}
];

export default routes;
