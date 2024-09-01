/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-09 11:29:02 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:48:44
 */
import { toast } from 'nc-lightapp-front';
import { LIST_BUTTON, PAGECODE, STATUS, URL, OrderReviseCache, FIELD } from '../../constance';
import reviseHistory_BtnClick from '../btnClicks/reviseHistory_BtnClick';
import {
	searchBtnClick,
	pageInfoClick,
	addBtnClick,
	deleteBtnClick,
	print_BtnClick,
	checkDataPermission,
	commit,
	unCommit,
	bizInfoBtnClick,
	deleteLine
} from '../btnClicks/index';
import commonSerach from '../btnClicks/commonSearch';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function(props, key, text, record, index) {
	let pk = null;
	let data = props.table.getCheckedRows(PAGECODE.list_head);
	let values = data && data[0] && data[0].data && data[0].data.values;
	pk = values && values.pk_order.value;
	let pk_src = values && values.pk_srcorder.value;
	if (pk_src != null) {
		pk = pk_src;
	}
	let vbillcode = values && values.vbillcode.value;
	switch (key) {
		case LIST_BUTTON.search: // 查询
			searchBtnClick.bind(this)();
			break;
		case LIST_BUTTON.Annex_Management: // 附件管理
			if (data.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004ORDERREVISE-000015') /* 国际化处理： 请选择要添加附件的数据！*/
				});
			} else {
				this.setState({
					pk_order: pk,
					vbillcode: vbillcode,
					showUploader: true
					// target: event.target
				});
			}
			break;
		case LIST_BUTTON.QueryAboutBusiness: // 单据追溯
			if (data.length <= 0) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004ORDERREVISE-000016') /* 国际化处理： 请选择要追溯的数据！*/
				});
			} else {
				this.setState({ pk_order: pk, showTrack: true });
			}
			break;
		case LIST_BUTTON.Refresh: // 刷新
			let queryInfo = getDefData(OrderReviseCache.OrderReviseCacheKey, 'queryInfo');
			commonSerach.call(this, queryInfo, true);
			break;
		case LIST_BUTTON.Print: // 打印
			print_BtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.Revise: //行修改
			let bfinalclose = record && record.bfinalclose && record.bfinalclose.value;
			if (bfinalclose) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004ORDERREVISE-000028') /* 国际化处理： 该订单已最终关闭，如需修订，请打开*/
				});
			} else {
				checkDataPermission.call(this, record, 'revise', () => {
					let pk_order = record && record.pk_order && record.pk_order.value;
					props.pushTo(URL.gotoCard, { status: STATUS.edit, id: pk_order, pagecode: PAGECODE.cardcode });
				});
			}
			break;
		case LIST_BUTTON.Revised_Record_Info: //修订历史
			reviseHistory_BtnClick.call(this, props, record, index);
			break;
		case LIST_BUTTON.ApproveInfo: //审批详情
			this.setState({
				show: true,
				billId: record.pk_order.value,
				billtype: record.vtrantypecode.value
			});
			break;
		case LIST_BUTTON.Commit: // 提交
			commit.call(this, props, record);
			break;
		case LIST_BUTTON.UnCommit: // 收回
			unCommit.call(this);
			break;
		case LIST_BUTTON.Delete: // 删除
			deleteLine.call(this, props, record);
			break;
		case LIST_BUTTON.PrintCountQuery: // 打印次数查询
			let mark = FIELD.pk_order;
			if (pk_src != null) {
				mark = FIELD.pk_srcorder;
			}
			let CONST = { hid: mark, area: PAGECODE.list_head };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
		case LIST_BUTTON.ToInformation: //内部交易信息
			bizInfoBtnClick.call(this, props);
			break;
		default:
			break;
	}
}
