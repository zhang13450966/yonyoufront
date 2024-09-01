import { asyncComponent } from 'nc-lightapp-front';
import TaxinvoiceList from '../list';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "me/me/settlerule/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/',
		component: TaxinvoiceList,
		exact: true
	},
	{
		path: '/list',
		component: TaxinvoiceList
	},
	{
		path: '/card',
		component: card
	}
];

export default routes;
