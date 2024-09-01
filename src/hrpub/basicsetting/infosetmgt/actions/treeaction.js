/**
 * 左树列表action
 * @constructor
 * @author neo   
*/
export default class TreeAction {
	constructor(comp) {
		this.comp = comp;
	}
	selectTree = (pk, node) => {
		const { dispatch, infosetmgt } = this.comp.props;
		const { action } = this.comp;
		const { children } = node;
		/* pageSize是否要设为默认10需要商榷 */
		let pgif = infosetmgt.pageInfo;
		// pgif.pageSize = 10;
		pgif.pageIndex = 1;
		// pgif.total = 1;
		// pgif.totalPage = 1;
		if (!children.length) {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					selectedTreeData: pk,
					selectedTreePid: node.id,
					pkOrg: node.refpk,
					pageInfo: pgif
				}
			});
			action.TableAction.setMainTableData();
		}
	};
	// selectedChange = (node) => {
	// 	console.log(node);
	// };
}
