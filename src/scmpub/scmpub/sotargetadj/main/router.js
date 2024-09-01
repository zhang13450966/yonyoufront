import { asyncComponent } from 'nc-lightapp-front';
const card = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/sotargetadj/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/sotargetadj/list/list"*/ /* webpackMode: "eager" */ '../list')
);
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
	}
];

export default routes;
