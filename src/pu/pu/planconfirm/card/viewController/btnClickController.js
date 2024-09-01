/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单卡片，按钮派发
 * @Date: 2021-11-20 10:37:56 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-18 13:52:20
 */
import { BTNID, URL, PAGECODE, UISTATE, AREA, FIELD, CONSTFIELD } from '../../constance';
import {
	addBtnClick,
	saveBtnClick,
	resetRowNoBtnClick,
	cancelBtnClick,
	queryCardBtnClick,
	editBtnClick,
	delBtnClick,
	commitBtnClick,
	deleteLinesBtnClick,
	print_BtnClick,
	output_BtnClick,
	saveAndCommitClick,
	backButton
} from '../btnClicks';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props, key, text, record, index) {
	switch (key) {
		case BTNID.Add: // 新增
			addBtnClick.call(this, props);
			break;
		case BTNID.Edit: // 修改
			editBtnClick.call(this, props);
			break;
		case BTNID.Delete: // 删除
			delBtnClick.call(this, props);
			break;
		case BTNID.Commit: // 提交
			commitBtnClick.call(this, props, true);
			break;
		case BTNID.UnCommit: // 收回
			commitBtnClick.call(this, props, false);
			break;
		case BTNID.ApproveDetail: //审批详情
			let pk = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
			let vtrantypecode = props.form.getFormItemsValue(AREA.head, FIELD.vtrantypecode).value;
			this.setState({
				show: true,
				pk: pk,
				vtrantypecode: vtrantypecode
			});
			break;
		case BTNID.SaveCommit: //保存提交
			saveAndCommitClick.call(this, props);
			break;
		case BTNID.Save: // 保存
			saveBtnClick.call(this, props);
			break;
		case BTNID.Cancel: // 取消
			cancelBtnClick.call(this, props);
			break;
		case BTNID.Refresh: // 刷新
			let freshid = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
			queryCardBtnClick.call(this, props, freshid, true);
			break;
		case BTNID.Back: // 返回列表页面
			let channelType = props.getUrlParam('channelType');
			if (channelType) {
				backButton.call(this, props);
			} else {
				props.pushTo(URL.list, { status: UISTATE.browse, pagecode: PAGECODE.list });
			}
			break;

		case BTNID.ResetRowNo: // 重排行号
			resetRowNoBtnClick.call(this, props);
			break;
		case BTNID.OpenCard: //展开
			if (props.cardTable.getStatus(AREA.body) == UISTATE.edit) {
				props.cardTable.openModel(PAGECODE.body, UISTATE.edit, record, index);
				break;
			} else {
				props.cardTable.toggleRowView(PAGECODE.body, record);
				break;
			}

		case BTNID.DeleteLine: //删行
			if (record) {
				props.cardTable.delRowsByIndex(PAGECODE.body, index);
			} else {
				deleteLinesBtnClick.bind(this)();
			}
			break;
		case BTNID.BillLink: // 单据追溯
			let pk_planconfirm = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
			this.setState({ pk_planconfirm: pk_planconfirm, showTrack: true });
			break;
		case BTNID.File: // 上传附件
			let planconfirmpk = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
			this.setState({
				pk_planconfirm: planconfirmpk,
				showUploader: true
			});
			break;
		case BTNID.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);

		case BTNID.Output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		default:
			break;
	}
}
