import searchBtnClick from '../btnClicks/searchBtnClick';
import deleteBtnClick from '../btnClicks/deleteBtnClick';
import doubleClick from '../btnClicks/doubleClick';
import addBtnClick from '../btnClicks/addBtnClick';
import rowDeleteBtnClick from '../btnClicks/rowDeleteBtnClick';
import commonSearch from '../btnClicks/commonSearch';
import editClick from '../btnClicks/editClick';
import pageInfoClick from '../btnClicks/pageInfoClick';
import approveBtnClick from '../btnClicks/approveBtnClick';
import unapproveBtnClick from '../btnClicks/unapproveBtnClick';
import billTraceAbility from '../btnClicks/billTraceAbility';
import attachManageBtnClick from '../btnClicks/attachManageBtnClick';
import print_BtnClick from '../btnClicks/print_BtnClick';
import outputBtnClick from '../btnClicks/outputBtnClick';
import exportBtnClick from '../btnClicks/exportBtnClick';
import initSearch from '../btnClicks/initSearch';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export {
	searchBtnClick,
	deleteBtnClick,
	doubleClick,
	rowDeleteBtnClick,
	commonSearch,
	editClick,
	pageInfoClick,
	approveBtnClick,
	unapproveBtnClick,
	billTraceAbility,
	attachManageBtnClick,
	outputBtnClick,
	initSearch,
	exportBtnClick
};
import { LIST_BUTTON, UISTATE, URL, FIELD, DATASOURCE, PAGECODE } from '../../constance';
export default function buttonClick(props, key, text, record, index) {
	switch (key) {
		case LIST_BUTTON.Selfmake: // 自制
			addBtnClick.bind(this, props)();
			break;
		case LIST_BUTTON.Puorder: //拉单
			props.pushTo(URL.gotoTransfer, { status: FIELD.transfer, pagecode: PAGECODE.transferlist });
			break;
		case LIST_BUTTON.Delete: // 批量删除
			deleteBtnClick.bind(this, props, record, index)();
			break;
		case LIST_BUTTON.Edit: // 修改
			editClick.bind(this, props, record)();
			break;
		case LIST_BUTTON.Copy: // 复制
			props.pushTo(URL.cardurl, {
				status: UISTATE.edit,
				id: record.pk_initialest.value,
				Copy: true,
				pagecode: PAGECODE.cardpagecode
			});
			break;
		// 批量审批
		case LIST_BUTTON.Approve:
			approveBtnClick.call(this, props, key, record, index);
			break;
		// 批量取消审批
		case LIST_BUTTON.UnApprove:
			unapproveBtnClick.call(this, props, key, record, index);
			break;
		//单据追溯
		case LIST_BUTTON.BillTraceability:
			billTraceAbility.call(this, props, key, record);
			break;
		//附件管理
		case LIST_BUTTON.AttaMange:
			attachManageBtnClick.call(this, props);
			break;
		//刷新
		case LIST_BUTTON.Refresh:
			//searchBtnClick.call(this, props, LIST_BUTTON.Refresh);
			let tabcode = getDefData(DATASOURCE.dataSource, 'currentTab');
			let searchVal = getDefData(DATASOURCE.dataSource, 'searchVal');
			commonSearch.call(this, tabcode, searchVal, LIST_BUTTON.Refresh);
			break;
		//打印
		case LIST_BUTTON.Print:
			print_BtnClick.call(this, props);
			break;
		//输出
		case LIST_BUTTON.Output:
			outputBtnClick.call(this, props);
			break;
		//导入
		case LIST_BUTTON.Import:
			// importBtnClick.call(this);
			break;
		//导出
		case LIST_BUTTON.Export:
			exportBtnClick.call(this);
			break;
	}
}
