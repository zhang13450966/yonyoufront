/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-29 19:28:47
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST, ATTRCODES } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setBtnShow } from './pageInfoClick';
let tableId = STOREREQ_CARD.tableId;
let formId = STOREREQ_CARD.formId; //'head';

export default function openRowBtnClick(props, text, record, index) {
	// 获取选中行  区分行操作或者是  肩上按钮

	let _this = this;
	if (record != undefined) {
		// 获取待处理表格行的行号
		let indexs = [ index ];
		let ts = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.ts).value;
		let b_ts = props.cardTable.getValByKeyAndIndex(STOREREQ_CARD.tableId, index, ATTRCODES.ts).value;
		// 拼装json
		let data = {
			pageid: STOREREQ_CARD.cardpageid,
			id: record.values.pk_storereq.value,
			selectIndex: indexs,
			ts: ts,
			bts: b_ts
		};
		// 发送请求
		ajax({
			url: STOREREQ_CARD.lineOpenURL,
			data: data,
			success: (res) => {
				if (res.success) {
					//渲染数据，
					if (res.data.head) {
						_this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						_this.setState({
							lineShowType: [],
							vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
							billId: res.data.head[formId].rows[0].values.pk_storereq.value,
							billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
						});
						let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
						// 设置按钮可用性
						setBtnShow(_this, fbillstatus);
					}
					if (res.data.body) {
						_this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
					}
					let pkid = res.data.head[formId].rows[0].values.pk_storereq.value;
					updateCacheData(
						_this.props,
						ATTRCODE.pk_storereq,
						pkid,
						res.data,
						formId,
						STOREREQ_LIST.dataSource
					);
					_this.props.cardTable.setStatus(tableId, STOREREQ_CARD.browse);
					_this.props.form.setFormStatus(formId, STOREREQ_CARD.browse);
					showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000044')); /* 国际化处理： 行打开成功！*/
				} else {
					showErrorInfo(getLangByResId(_this, '4004STOREREQ-000012')); /* 国际化处理： 行打开失败！*/
				}
			}
		});
	} else {
		let rows = props.table.getCheckedRows(formId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			showWarningInfo(getLangByResId(this, '4004STOREREQ-000006')); /* 国际化处理： 请选择需要操作的数据！*/
			return;
		}
		// 获取待删除表格行的行号
		let indexs = rows.map((item) => {
			return item.index;
		});

		// 拼装json
		let data = {
			id: STOREREQ_CARD.cardpageid,
			id: this.props.getUrlParam(STOREREQ_CARD.id),
			selectIndex: indexs
		};
		// 发送请求
		ajax({
			url: STOREREQ_CARD.lineCloseURL,
			data: data,
			success: (res) => {
				if (res.success) {
					showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000044')); /* 国际化处理： 行打开成功！*/
				} else {
					showErrorInfo(getLangByResId(_this, '4004STOREREQ-000012')); /* 国际化处理： 行打开失败！*/
				}
			}
		});
	}
}
