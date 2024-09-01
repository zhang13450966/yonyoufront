import { asyncComponent } from 'nc-lightapp-front';

const list = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/list/list"*/ /* webpackMode: "eager" */ '../list')
);
const card = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/card/card"*/ /* webpackMode: "eager" */ '../card')
);
const transfer50 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/transfer50/transfer50"*/ /* webpackMode: "eager" */ '../transfer50')
);
// const multitransfer = asyncComponent(() =>
// 	import(/*webpackChunkName: "pu/pu/puinvoice/multitransfer/multitransfer"*/ /* webpackMode: "eager" */ '../multitransfer')
// );
// const sctransfer = asyncComponent(() =>
// 	import(/*webpackChunkName: "pu/pu/puinvoice/sctransfer/sctransfer"*/ /* webpackMode: "eager" */ '../sctransfer')
// );
const scInvoice = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/scInvoice/scInvoice"*/ /* webpackMode: "eager" */ '../scInvoice')
);

const invoice = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/invoice/invoice"*/ /* webpackMode: "eager" */ '../invoice')
);
const transfer21Pto25 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/transfer21Pto25/transfer21Pto25"*/ /* webpackMode: "eager" */ '../transfer21Pto25')
);

const transfer55E6to25 = asyncComponent(() =>
	import(/*webpackChunkName: "pu/pu/puinvoice/transfer55E6to25/transfer55E6to25"*/ /* webpackMode: "eager" */ '../transfer55E6to25')
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
		path: '/transfer50',
		component: transfer50
	},
	// {
	// 	path: '/multitransfer',
	// 	component: multitransfer
	// },
	{
		path: '/invoice',
		component: invoice
	},
	// {
	// 	path: '/sctransfer',
	// 	component: sctransfer
	// },
	{
		path: '/scInvoice',
		component: scInvoice
	},
	{
		path: '/transfer21Pto25',
		component: transfer21Pto25
	},
	{
		path: '/transfer55E6to25',
		component: transfer55E6to25
	}
];

export default routes;
