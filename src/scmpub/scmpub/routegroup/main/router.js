/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-集团-路由跳转设置  
 * @Date: 2020-01-17 09:45:22 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-12 14:52:18
 */
import { asyncComponent } from 'nc-lightapp-front';

const cardPage = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/routegroup/card/Card"*/ /* webpackMode: "eager" */ '../card')
);
const listPage = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/routegroup/list/List"*/ /* webpackMode: "eager" */ '../list')
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
