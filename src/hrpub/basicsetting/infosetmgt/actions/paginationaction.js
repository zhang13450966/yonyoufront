/**
 * 分页action
 * @constructor
 * @author neo   
*/
export default class TableAction {
	constructor(comp) {
		this.comp = comp;
	}
	changePageSize = (newvalue) => {
		const { dispatch, infosetmgt } = this.comp.props;
		const { action } = this.comp;
		let pgif = infosetmgt.pageInfo;
		pgif.pageSize = newvalue;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				pageInfo: pgif
			}
		});
		action.TableAction.setMainTableData();
	};
	changePageNum = (page) => {
		const { dispatch, infosetmgt } = this.comp.props;
		const { action } = this.comp;
		let pgif = infosetmgt.pageInfo;
		pgif.pageIndex = page;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				pageInfo: pgif
			}
		});
		action.TableAction.setMainTableData();
	};
}
