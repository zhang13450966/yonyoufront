import { asyncComponent } from 'nc-lightapp-front';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/arsub/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/arsub/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const ref4621 = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/arsub/ref4621/ref4621"*/ /* webpackMode: "eager" */ '../ref4621')
);
const ref4641 = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/arsub/ref4641/ref4641"*/ /* webpackMode: "eager" */ '../ref4641')
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
	},
	{
		path: '/ref4621',
		component: ref4621
	},
	{
		path: '/ref4641',
		component: ref4641
	}
];

export default routes;
