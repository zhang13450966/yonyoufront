/*
 * @Author: fangmj7 
 * @PageInfo: 进度确认单，列表页面按钮派发
 * @Date: 2022-2-25 15:10:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-04-24 15:51:31
 */
import { toast } from 'nc-lightapp-front';
import { ajax } from 'nc-lightapp-front';
import { BTNID, AREA, FIELD, PAGECODE, URL, UISTATE } from '../../constance';
import {
	addBtnClick,
	queryBtnClick,
	commonSerach,
	delBtnClick,
	delBatchBtnClick,
	comBtnClick,
	unCommitBatchBtnClick,
	print_BtnClick,
	output_BtnClick,
	commitBatchBtnClick,
	linkBtnClick
} from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, key, text, record, index) {
	switch (key) {
		case BTNID.Add: // 新增
			addBtnClick.call(this, props);
			break;
		case BTNID.Query: // 查询
			queryBtnClick.call(this, props);
			break;
		case BTNID.Refresh: //刷新
			{
				let searchVal = this.state.searchVal;
				let tabcode = this.state.currentTab;
				commonSerach.call(this, tabcode, searchVal, true, false);
			}
			break;
		case BTNID.Delete: //删除
			if (record) {
				let del = delBtnClick.bind(this, props, record);
				return del(props);
			} else {
				let delB = delBatchBtnClick.bind(this, props);
				return delB(props);
			}
		case BTNID.Commit: //提交
			if (record) {
				let comR = comBtnClick.bind(this, props, record);
				return comR(props);
			} else {
				let com = commitBatchBtnClick.bind(this, props, record);
				return com(props);
			}
		case BTNID.UnCommit: //收回
			let uncom = unCommitBatchBtnClick.bind(this);
			return uncom(props);

		case BTNID.Print: //打印
			let print = print_BtnClick.bind(this, props);
			return print(props);

		case BTNID.Output: //输出
			let output = output_BtnClick.bind(this, props);
			return output(props);
		case BTNID.Edit:
			let pk =  record.pk_planconfirm.value;
	let info = { actioncode: 'edit', pks: [ pk ] };
	ajax({
		url: URL.permission,
		data: info,
		method: 'post',
		success: (res) => {
			props.pushTo(URL.card, {
				
				status: UISTATE.edit,
				id: record.pk_planconfirm.value,
				pagecode: PAGECODE.card
			});
			
		}
	});
	return;
			
			
		case BTNID.BillLink:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		case BTNID.File: // 上传附件
			{
				let rows = props.table.getCheckedRows(AREA.head);
				if (rows.length == 0) {
					toast({
						content: getLangByResId(this, '4004planconfirm-000016'),
						color: 'warning'
					}); /* 国际化处理： 请先选择数据*/
					break;
				}
				let ids = rows.map((row) => {
					return row.data.values.pk_planconfirm.value;
				});
				let vbillcode = rows.map((row) => {
					return row.data.values.vbillcode.value;
				});
				this.setState({
					pk_planconfirm: ids[0],
					// target: event.target,
					showUploader: true,
					billNo: vbillcode[0]
				});
			}
			break;
		case BTNID.ApproveDetail: //审批详情
			this.setState({
				showApproveInfo: true,
				pk_planconfirm: record.pk_planconfirm.value,
				billtype: record.vtrantypecode.value
			});
			break;

		default:
			break;
	}
}
