import { asyncComponent } from 'nc-lightapp-front';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/prepaidinvoice/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const list = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/prepaidinvoice/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const ref30 = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/prepaidinvoice/ref30/ref30"*/ /* webpackMode: "eager" */ '../ref30')
);
const ref4804 = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/prepaidinvoice/ref4804/ref4804"*/ /* webpackMode: "eager" */ '../ref4804')
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
		path: '/ref30',
		component: ref30
	},
	{
		path: '/ref4804',
		component: ref4804
	}
];

export default routes;
