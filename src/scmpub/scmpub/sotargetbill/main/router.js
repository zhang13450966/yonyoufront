import { asyncComponent } from 'nc-lightapp-front';

const card = asyncComponent(() =>
	import(/*webpackChunkName: "scmpub/scmpub/sotargetbill/card/card"*/ /* webpackMode: "eager" */ '../card')
);

const routes = [
	{
		path: '/card',
		component: card
	}
];

export default routes;
