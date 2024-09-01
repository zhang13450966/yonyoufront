import { BUTTON, PAGECODE, FIELD, URL, STATUS, OrderCache, TRANSFER30, LIST_BUTTON } from '../../constance';
import commitBtnClick from './commitBtnClick';
import unCommitBtnClick from './unCommitBtnClick';
import deleteLineBtnClick from './deleteLineBtnClick';
import print_BtnClick from './print_BtnClick';
import searchBtnClick from './searchBtnClick';
import deleteBtnClick from './deleteBtnClick';
import printOutBtnClick from './printOutBtnClick';
import checkDataPermissionBtnClick from './checkDataPermissionBtnClick';
import pageInfoClick from './pageInfoClick';
// import {
// 	commit,
// 	uncommit,
// 	deleteLine,
// 	print_BtnClick,
// 	searchBtnClick,
// 	deleteBtnClick,
// 	printOut,
// 	checkDataPermission
// } from './index.js';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
function btnClick(props, key, text, record, index) {
	let pk = null;
	let _this = this;
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	let rowsdata = [];
	let rowindex = [];
	if (rows.length > 0) {
		rows.map((item) => {
			let data = {
				[FIELD.pks]: item.data.values.pk_pricesettle.value,
				[FIELD.ts]: item.data.values.ts.value
			};
			rowsdata.push(data);
			rowindex.push(item.index);
		});
	}
	let _url = null;
	switch (key) {
		case BUTTON.Add: // 新增，转单
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER30.GOTO20, { pagecode: TRANSFER30.PAGEID });
			break;
		case BUTTON.Delete: // 删除
			deleteBtnClick.call(this, props);
			break;
		case BUTTON.Commit: // 提交
			commitBtnClick.call(this, this.props, null);
			break;
		case BUTTON.UnCommit: // 收回
			unCommitBtnClick.call(this);
			break;
		case BUTTON.List_Inner_Commit: // 行提交
			commitBtnClick.call(this, this.props, record);
			break;
		case BUTTON.List_Inner_UnCommit: // 行收回
			unCommitBtnClick.call(this, this.props, record, 'uncommit');
			break;
		case BUTTON.List_Inner_Update: // 行修改
			checkDataPermissionBtnClick.call(this, record, 'edit', () => {
				let scene = this.props.getUrlParam('scene');
				pk = record && record.pk_pricesettle.value;
				props.pushTo(URL.gotoCard, { status: STATUS.edit, id: pk, scene: scene, pagecode: PAGECODE.cardcode });
			});
			break;
		case BUTTON.List_Inner_Delete: // 行删除
			deleteLineBtnClick.call(this, this.props, record);
			break;
		case BUTTON.List_Inner_Approval_Info: // 行查看审批意见
			pk = record && record.pk_pricesettle && record.pk_pricesettle.value;
			this.setState({ show: true, pk_order: pk, ctrantypeid: '24' });
			break;
		case BUTTON.Print: // 打印
			print_BtnClick.call(this, this.props);
			break;
		case BUTTON.Refresh: // 刷新
			searchBtnClick.bind(this, props, BUTTON.Refresh)();
			break;
		case LIST_BUTTON.PrintOut: // 行输出
			printOutBtnClick.call(this, this.props);
			break;
	}
}
export { btnClick, searchBtnClick, pageInfoClick, commitBtnClick };
