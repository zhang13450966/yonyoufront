/*
 * @Author: zhangchangqing
 * @PageInfo: 点击按钮事件进行分发
 * @Date: 2018-04-19 10:34:04
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:22:22
 */
import { ajax } from 'nc-lightapp-front';
import { STOREREQ_LIST_BUTTON, STOREREQ_CARD, STOREREQ_LIST, NCMODULE, ATTRCODE } from '../../siconst';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import addBtnClick from '../btnClicks/addBtnClick';
import delBatchBtnClick from '../btnClicks/delBatchBtnClick';
import comBtnClick from '../btnClicks/commitBtnClick';
import commitBatchBtnClick from '../btnClicks/commitBatchBtnClick';
import unCommitBatchBtnClick from '../btnClicks/unCommitBatchBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import openButtonClick from '../btnClicks/openBillBtnClick'; //整单打开，整单关闭
import closeButtonClick from '../btnClicks/closeBillBtnClick'; //整单打开，整单关闭
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n
import printList_BtnClick from '../btnClicks/printList_BtnClick'; //打印清单
import output_BtnClick from '../btnClicks/output_BtnClick'; //打印n
import fileBtnClick from '../btnClicks/fileBtnClick'; //附件管理
import commonSerach from '../btnClicks/commonSearch';
import sysModuleCheck from '../../../pub/remoteCall/sysModuleCheck';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//刷新
		case STOREREQ_LIST_BUTTON.Refresh:
			let refresh = true;
			let commonSer = commonSerach.bind(
				this,
				getDefData(STOREREQ_LIST.dataSource, 'currentTab'),
				getDefData(STOREREQ_LIST.dataSource, 'searchVal'),
				refresh
			);
			return commonSer(props);
		//新增
		case STOREREQ_LIST_BUTTON.add:
			return addBtnClick(props);
		case STOREREQ_LIST_BUTTON.AddFrom4D14:
			sysModuleCheck.call(this, NCMODULE.PIM, getLangByResId(this, '4004STOREREQ-000059'), () => {
				//跳转卡片页之前先清除缓存
				clearTransferCache(props, STOREREQ_LIST.transferDataSource);
				props.pushTo(STOREREQ_LIST.transferUrl, {
					type: STOREREQ_LIST.transfer,
					pagecode: STOREREQ_LIST.transferList
				});
			});
			break;
		// 删除  record有值走行删除逻辑，没有值走批量处理逻辑
		case STOREREQ_LIST_BUTTON.delete:
			if (record) {
				let del = delBtnClick.bind(this, props, record);
				return del(props);
			} else {
				let delB = delBatchBtnClick.bind(this, props);
				return delB(props);
			}
		//打印
		case STOREREQ_LIST_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//打印清单
		case STOREREQ_LIST_BUTTON.Print_list:
			let printList = printList_BtnClick.bind(this, props);
			return printList(props);
		//输出
		case STOREREQ_LIST_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);

		// // 删除-行
		// case STOREREQ_LIST_BUTTON.deleteRow:
		// 	let del = delBtnClick.bind(this, props, record);
		// 	return del(props);
		//提交 record有值走行提交逻辑，没有值走批量处理逻辑
		case STOREREQ_LIST_BUTTON.commit:
			if (record) {
				let comR = comBtnClick.bind(this, props, record);
				return comR(props);
			} else {
				let com = commitBatchBtnClick.bind(this);
				return com(props);
			}
		//收回
		case STOREREQ_LIST_BUTTON.uncommit:
			let uncom = unCommitBatchBtnClick.bind(this);
			return uncom(props);
		// //提交-行
		// case STOREREQ_LIST_BUTTON.commitRow:
		// 	let comR = comBtnClick.bind(this, props, record);
		// 	return comR(props);
		//修改
		case STOREREQ_LIST_BUTTON.Edit:
			let data = { keyword: record.pk_storereq.value, pageid: STOREREQ_CARD.cardpageid };
			ajax({
				url: STOREREQ_CARD.editCardInfoURL,
				data: data,
				success: (res) => {
					props.pushTo(STOREREQ_CARD.cardUrl, {
						status: STOREREQ_CARD.edit,
						id: record.pk_storereq.value,
						option: 'edit',
						pagecode: STOREREQ_CARD.cardpageid
					});
				}
			});

			return;
		//整单打开
		case STOREREQ_LIST_BUTTON.OpenBill:
			let open = openButtonClick.bind(this);
			return open(props);
		//整单关闭
		case STOREREQ_LIST_BUTTON.CloseBill:
			let close = closeButtonClick.bind(this);
			return close(props);
		//复制
		case STOREREQ_LIST_BUTTON.copy:
			props.pushTo(STOREREQ_CARD.cardUrl, {
				status: STOREREQ_CARD.add,
				id: record.pk_storereq.value,
				copy: true,
				option: 'copy',
				pagecode: STOREREQ_CARD.cardpageid
			});
			return;
		//单据追溯
		case STOREREQ_LIST_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		//附件管理
		case STOREREQ_LIST_BUTTON.File:
			let file = fileBtnClick.bind(this);
			return file(props);
		//审批详情
		case STOREREQ_LIST_BUTTON.ApproveInfo:
			this.setState({
				show: true,
				billId: record.pk_storereq.value,
				billtype: record.vtrantypecode.value
			});
			break;
		case STOREREQ_LIST_BUTTON.PrintCountQuery: //打印次数查询
			let CONST = { hid: ATTRCODE.pk_storereq, area: STOREREQ_LIST.formId };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
	}
}
