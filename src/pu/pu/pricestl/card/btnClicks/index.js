import { PAGECODE, STATUS, FIELD, TRANSFER30, OrderCache } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { BUTTON } from '../../constance';
import rowClick from './rowClick';
import pageInfoClick from './pageInfoClick';
import backBtnClick from './backBtnClick';
import checkdatapermissionClick from './checkdatapermissionClick';
import editBtnClick from './editBtnClick';
import deletebtnclick from './deletebtnclick';
import cancelBtnClick from './cancelBtnClick';
import saveBtnClick from './saveBtnClick';
import commitBtnClick from './commitBtnClick';
import savecommitBtnClick from './savecommitBtnClick';
import uncommitBtnClick from './uncommitBtnClick';
import print_BtnClick from './print_BtnClick';
import printOutBtnClick from './printOutBtnClick';
import refreshBtnClick from './refreshBtnClick';
import saveAndCommitBtnClick from './saveAndCommitBtnClick';

// import {
// 	Backbutton,
// 	Checkdatapermission,
// 	Editbutton,
// 	Deletebtnclick,
// 	Cancelbutton,
// 	Savebtnclick,
// 	commit,
// 	savecommit,
// 	uncommit,
// 	print_BtnClick,
// 	printOut,
// 	Refresh
// } from './index.js';
function btnClick(props, key, text, record, index) {
	let pk_pricesettle = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
	pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
	pk_pricesettle =
		pk_pricesettle == null || pk_pricesettle == '' || pk_pricesettle == 'undefined'
			? this.props.getUrlParam(FIELD.id)
			: pk_pricesettle;
	pk_pricesettle = pk_pricesettle == '' || pk_pricesettle == 'undefined' ? null : pk_pricesettle;
	let ts = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts);
	ts = ts && ts.value;
	switch (key) {
		case BUTTON.Back: // 返回
			backBtnClick.bind(this)();
			break;
		case BUTTON.Add: // 新增，转单
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER30.GOTO20, { pagecode: TRANSFER30.PAGEID });
			break;
		case BUTTON.Edit: // 修改
			checkdatapermissionClick.call(this, record, 'edit', () => {
				editBtnClick.call(this);
			});
			break;
		case BUTTON.Delete: // 删除
			deletebtnclick.call(this, this.props);
			break;
		case BUTTON.Cancel: // 取消
			cancelBtnClick.call(this, this.props, this.curindex);
			break;
		case BUTTON.Save: // 保存
			saveBtnClick.call(this, this.props);
			break;
		case BUTTON.Commit: // 提交
			commitBtnClick.call(this, this.props);
			break;
		case BUTTON.Save_Commit: // 保存提交
			saveAndCommitBtnClick.call(this, this.props);
			break;
		// case BUTTON.Save_Commit: // 保存提交
		// 	savecommitBtnClick.call(this);
		// 	break;
		case BUTTON.UnCommit: // 收回
			uncommitBtnClick.call(this);
			break;
		case BUTTON.Print: //打印
			print_BtnClick.call(this, this.props);
			break;
		case BUTTON.PrintOut: //输出
			printOutBtnClick.call(this, this.props);
			break;
		case BUTTON.Refresh: //刷新
			refreshBtnClick.call(this, this.props);
			break;
		case BUTTON.openmeterialbrowse: //物料浏览态行操作展开
			props.cardTable.toggleRowView(PAGECODE.cardbody, record);
			break;
		// case BUTTON.openmeterialedit: //物料编辑态行操作展开
		// 	props.cardTable.openModel(PAGECODE.cardbody, STATUS.edit, record, index);
		// 	break;
		case BUTTON.openqualitybrowse: //优质优价浏览态行操作展开
			props.cardTable.toggleRowView(PAGECODE.cardbodyano, record);
			break;
	}
}
export { btnClick, pageInfoClick, rowClick, refreshBtnClick, commitBtnClick, saveAndCommitBtnClick };
