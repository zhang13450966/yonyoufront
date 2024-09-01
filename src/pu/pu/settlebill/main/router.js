import { asyncComponent } from 'nc-lightapp-front';
import SettleBillList from '../list';
const card = asyncComponent(() => import(/*webpackChunkName: "pu/pu/settlebill/card/card"*/ /* webpackMode: "eager" */'../card'));
const routes = [
	{
		path: '/',
		component: SettleBillList,
		exact: true
	},
	{
		path: '/list',
		component: SettleBillList
	},
	{
		path: '/card',
		component: card
	}
];
export default routes;
