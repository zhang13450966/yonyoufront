/*
 * @Author: zhangchangqing 
 * @PageInfo: 按钮事件
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-12-03 10:42:32
 */
import { BUYINGREQ_LIST_BUTTON, BUYINGREQ_LIST, BUYINGREQ_CARD, ATTRCODE } from '../../siconst';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
// let tableId = BUYINGREQ_LIST.tableId;
// let formId = BUYINGREQ_LIST.formId;
import addBtnClick from '../btnClicks/addBtnClick';
import delBatchBtnClick from '../btnClicks/delBatchBtnClick';
import { ajax } from 'nc-lightapp-front';
import comBtnClick from '../btnClicks/commitBtnClick';
import commitBatchBtnClick from '../btnClicks/commitBatchBtnClick';
import unCommitBatchBtnClick from '../btnClicks/unCommitBatchBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import openButtonClick from '../btnClicks/openBillBtnClick'; //整单打开，整单关闭
import openBatchButtonClick from '../btnClicks/openBatchBillBtnClick'; //整单打开，整单关闭
import closeButtonClick from '../btnClicks/closeBillBtnClick'; //整单打开，整单关闭
import closeBatchButtonClick from '../btnClicks/closeBatchBillBtnClick'; //整单打开，整单关闭
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import fileBtnClick from '../btnClicks/fileBtnClick'; //附件管理
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n\
import printList_BtnClick from '../btnClicks/printList_BtnClick'; //打印清单
import output_BtnClick from '../btnClicks/output_BtnClick'; //打印n
import commonSerach from '../btnClicks/commonSearch'; //刷新
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

import { YYC_BUTTON_ARRAY } from '../../../yyc/constance';
import { reqYYCBtnClick } from '../../../yyc/ext/yycBtnClick';

export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//刷新
		case BUYINGREQ_LIST_BUTTON.Refresh:
			let refresh = true;
			let commonSer = commonSerach.bind(
				this,
				getDefData(BUYINGREQ_LIST.dataSource, 'currentTab'),
				getDefData(BUYINGREQ_LIST.dataSource, 'searchVal'),
				refresh
			);
			return commonSer(props);
		//新增
		case BUYINGREQ_LIST_BUTTON.add:
			return addBtnClick(props);
		// 删除 record有值走行删除逻辑，没有值走批量处理逻辑
		case BUYINGREQ_LIST_BUTTON.delete:
			if (record) {
				let del = delBtnClick.bind(this, props, record);
				return del(props);
			} else {
				let delB = delBatchBtnClick.bind(this, props);
				return delB(props);
			}
		// // 删除-行
		// case BUYINGREQ_LIST_BUTTON.deleteRow:
		// 	let del = delBtnClick.bind(this, props, record);
		// 	return del(props);
		//提交  record有值走行提交逻辑，没有值走批量处理逻辑
		case BUYINGREQ_LIST_BUTTON.commit:
			if (record) {
				let comR = comBtnClick.bind(this, props, record);
				return comR(props);
			} else {
				let com = commitBatchBtnClick.bind(this);
				return com(props);
			}
		//收回
		case BUYINGREQ_LIST_BUTTON.uncommit:
			let uncom = unCommitBatchBtnClick.bind(this);
			return uncom(props);
		//打印
		case BUYINGREQ_LIST_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//打印清单
		case BUYINGREQ_LIST_BUTTON.Print_list:
			let printList = printList_BtnClick.bind(this, props);
			return printList(props);
		//输出
		case BUYINGREQ_LIST_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		// //提交-行
		// case BUYINGREQ_LIST_BUTTON.commitRow:
		// 	let comR = comBtnClick.bind(this, props, record);
		// 	return comR(props);
		//修改
		case BUYINGREQ_LIST_BUTTON.Edit:
			let data = { keyword: record.pk_praybill.value, pageid: BUYINGREQ_LIST.cardpageid };
			ajax({
				url: BUYINGREQ_CARD.editCardInfoURL,
				data: data,
				success: (res) => {
					props.pushTo(BUYINGREQ_LIST.cardUrl, {
						status: BUYINGREQ_LIST.edit,
						id: record.pk_praybill.value,
						pagecode: BUYINGREQ_LIST.cardpageid
					});
				}
			});
			return;
		//整单打开 record有值走行提交逻辑，没有值走批量处理逻辑
		case BUYINGREQ_LIST_BUTTON.OpenBill:
			if (record) {
				let open = openButtonClick.bind(this, props, record, index);
				return open(props);
			} else {
				let openB = openBatchButtonClick.bind(this, props);
				return openB(props);
			}
		//整单关闭
		case BUYINGREQ_LIST_BUTTON.CloseBill:
			if (record) {
				let close = closeButtonClick.bind(this, props, record, index);
				return close(props);
			} else {
				let closeB = closeBatchButtonClick.bind(this, props);
				return closeB(props);
			}
		//复制
		case BUYINGREQ_LIST_BUTTON.copy:
			props.pushTo(BUYINGREQ_LIST.cardUrl, {
				status: BUYINGREQ_LIST.add,
				id: record.pk_praybill.value,
				copy: true,
				pagecode: BUYINGREQ_LIST.cardpageid
			});
			return;
		//物资需求申请单，拉单
		case BUYINGREQ_LIST_BUTTON.StorereqBtn:
			//跳转卡片页之前先清除缓存
			clearTransferCache(props, BUYINGREQ_LIST.transferDataSource);
			props.pushTo(BUYINGREQ_LIST.transferUrl, {
				type: BUYINGREQ_LIST.transfer,
				pagecode: BUYINGREQ_LIST.transferList
			});
			break;
		//单据追溯
		case BUYINGREQ_LIST_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		//附件管理
		case BUYINGREQ_LIST_BUTTON.File:
			let file = fileBtnClick.bind(this);
			return file(props);
		//审批详情
		case BUYINGREQ_LIST_BUTTON.ApproveInfo:
			this.setState({
				show: true,
				billId: record.pk_praybill.value,
				billtype: record.vtrantypecode.value
			});
			break;
		//导出
		case BUYINGREQ_LIST_BUTTON.Export:
			this.props.modal.show('exportFileModal');
			break;
		//打印次数查询
		case BUYINGREQ_LIST_BUTTON.PrintCountQuery:
			let CONST = { hid: ATTRCODE.pk_praybill, area: BUYINGREQ_LIST.formId };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
	}
	// 友云采扩展 add by guozhq
	if (YYC_BUTTON_ARRAY.includes(id)) {
		reqYYCBtnClick.call(this, props, id, {
			isList: true,
			listArea: 'list_head',
			billidField: 'pk_praybill',
			pageCode: BUYINGREQ_LIST.listpageid
		});
	}
}
