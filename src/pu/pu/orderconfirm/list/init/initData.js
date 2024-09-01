import { BUTTON_ID, AREA, URL, PAGECODE, DATASOURCE, FIELD, DATASOURCECACHE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import buttonControl from '../viewControl/buttonControl';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props, showMessage, refreshFlag) {
	let queryInfo;
	if (refreshFlag) {
		queryInfo = getDefData(DATASOURCE.LIST, FIELD.QRYINFO);
	} else {
		queryInfo = props.search.getQueryInfo(AREA.LIST_SEARCH);
		let confirm = props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.CONFIRM).value.firstvalue;
		// 缓存查询条件
		setDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM, confirm);
		// this.queryInfo = queryInfo;
		setDefData(DATASOURCE.LIST, FIELD.QRYINFO, queryInfo);
	}
	queryInfo = queryInfo || {};
	let pageInfo = this.props.table.getTablePageInfo(AREA.LIST_HEAD); //分页信息
	queryInfo.pageInfo = pageInfo;
	queryInfo.pageCode = PAGECODE.LIST;
	ajax({
		url: URL.SEARCH,
		data: queryInfo,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.data) {
				let size = res.data[AREA.LIST_HEAD].pageInfo.total;
				showMessage && showMessage.success && showMessage.success(size);
				props.table.setAllTableData(AREA.LIST_HEAD, res.data[AREA.LIST_HEAD]);
			} else {
				showMessage && showMessage.failure && showMessage.failure();
				props.table.setAllTableData(AREA.LIST_HEAD, { rows: [] });
			}
			buttonControl.call(this, props);
		}
	});
}
