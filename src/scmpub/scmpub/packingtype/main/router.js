import list from '../list';
const routes = [
	{
		path: '/',
		component: list,
		exact: true
	},
	{
		path: '/list',
		component: list
	}
];
export default routes;
