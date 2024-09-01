/*
 * @Author: zhangchangqing
 * @PageInfo: 批量删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:09:37
 */
import { TARGETADJ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import {
	showWarningDialog,
	showBatchOprMessage,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
let formId = TARGETADJ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行
	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001TARGETADJ-000032') /* 国际化处理： 请选择需要删除的数据！*/
		});
		return;
	}
	// 弹出确认删除的框
	showWarningDialog(getLangByResId(this, '4001TARGETADJ-000057'), getLangByResId(this, '4001TARGETADJ-000014'), {
		/* 国际化处理： 确认要删除吗？*/
		beSureBtnClick: backtotransfer.bind(this, props, rows)
	});
}
function backtotransfer(props, rows) {
	//自己的逻辑
	// 获取待删除表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行删除操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_targetadj.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfos: delRows
	};
	// 发送请求
	ajax({
		url: TARGETADJ_LIST.batchDeleteURL,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
						// 成功的index
						let sucIndex = [];
						rows.forEach((element, index) => {
							if (!res.data.errorMessageMap[index]) {
								sucIndex.push(element.index);
							}
							deleteCacheDataForList(props, formId, element.data.values.pk_targetadj.value);
						});
						props.table.deleteTableRowsByIndex(formId, sucIndex);
					} else {
						//
						let succIndex = [];
						rows.forEach((element, index) => {
							deleteCacheDataForList(props, formId, element.data.values.pk_targetadj.value);
							succIndex.push(element.index);
						});
						props.table.deleteTableRowsByIndex(formId, succIndex);
					}
					// 删除成功之后，前台删除数据
					showBatchOprMessage(
						getLangByResId(this, '4001TARGETADJ-000003'),
						res.data,
						{},
						getLangByResId(this, '4001TARGETADJ-000057')
					); /* 国际化处理： 提示*/
					buttonController.setListButtonVisiable(this.props, true);
				} else {
					showErrorInfo(getLangByResId(this, '4001TARGETADJ-000063')); /* 国际化处理： 删除失败！*/
				}
			}
		}
	});
}
