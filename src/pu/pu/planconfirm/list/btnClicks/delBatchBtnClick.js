/*
 * @Author: fangmj7
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-04-18 14:10:47
 */
import { AREA, URL } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import {
	showWarningDialog,
	showErrorInfo,
	showSuccessInfo,
	showBatchOperateInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController';

export default function clickDelBtn(props) {
	// 获取选中行
	let rows = props.table.getCheckedRows(AREA.head);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004planconfirm-000021') /* 国际化处理： 请选择需要删除的数据！*/
		});
		return;
	}
	// 弹出确认删除的框
	showWarningDialog(getLangByResId(this, '4004planconfirm-000022'), getLangByResId(this, '4004planconfirm-000023'), {
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
			pk: item.data.values.pk_planconfirm.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		billInfo: delRows
	};
	// 发送请求
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					// 删除失败数组，成功的数组，用于页面删除数据，数组中的元素时下标
					let errorArray = [];
					let successArray = [];
					let successPK = []; //删除成功的主键，用于处理缓存

					// 删除失败的行下标
					let errorMsg = res.data.errorMessageMap;
					let errorMessage = res.data.errorMessage;
					for (let key in errorMsg) {
						errorArray.push(parseInt(key));
					}

					// 处理提示信息(单据执行失败)
					let contentMsg =
						getLangByResId(this, '4004planconfirm-000033') +
						(res.data.sucessNum ? res.data.sucessNum : '0'); /* 国际化处理： 成功条数：*/

					if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
						// 成功的index
						let sucIndex = [];

						rows.forEach((element, index) => {
							if (!res.data.errorMessageMap[index]) {
								sucIndex.push(element.index);
							}
							deleteCacheDataForList(props, AREA.head, element.data.values.pk_planconfirm.value);
						});
						props.table.deleteTableRowsByIndex(AREA.head, sucIndex);
					} else {
						rows.forEach((element, index) => {
							deleteCacheDataForList(props, AREA.head, element.data.values.pk_planconfirm.value);
							successArray.push(element.index);
						});
						props.table.deleteTableRowsByIndex(AREA.head, successArray);
					}
					if (res.data.errorMessage) {
						// 错误提示信息
						contentMsg =
							contentMsg +
							getLangByResId(this, '4004planconfirm-000034') +
							errorArray.length; /* 国际化处理： </br>失败条数：*/ /* 国际化处理： </br>失败条数：*/
						let errorMessages = [];
						for (let k in res.data.errorMessageMap) {
							errorMessages.push(
								getLangByResId(this, '4004planconfirm-000035') +
									(parseInt(k) + 1) +
									getLangByResId(this, '4004planconfirm-000036') +
									res.data.errorMessageMap[k] /* 国际化处理： 第,,条数据操作失败。失败原因：*/
							); /* 国际处理： 第,条数据操作失败。失败原因：*/
						}
						/**
						 * 处理提示信息
						 * sucNum 成功条数
						 * failNum 失败条数
						 * toastMsg 提示信息
						 */
						let sucNum = Number.parseInt(res.data.sucessNum ? res.data.sucessNum : '0');
						let failNum = Number.parseInt(errorArray.length ? errorArray.length : '0');
						let langID = '4004planconfirm-000037';
						let toastMsg = { totalNum: sucNum + failNum };
						if (sucNum && sucNum <= 0) {
							langID = '4004planconfirm-000037';
							toastMsg = { totalNum: sucNum + failNum, failNum };
						} else {
							langID = '4004planconfirm-000038';
							toastMsg = { totalNum: sucNum + failNum, sucNum, failNum };
						}

						showBatchOperateInfo(
							getLangByResId(this, '4004planconfirm-000040') /* 国际化处理： 出错啦*/,
							getLangByResId(this, langID, toastMsg),
							errorMessages
						);
					} else {
						showSuccessInfo(
							getLangByResId(this, '4004planconfirm-000009'),
							getLangByResId(this, '4004planconfirm-000039', {
								sucNum: res.data.sucessNum ? res.data.sucessNum : '0'
							})
						); /* 国际化处理： 删除成功！,处理成功,条*/
					}

					buttonController.call(this, this.props);
				} else {
					showErrorInfo(getLangByResId(this, '4004planconfirm-000027')); /* 国际化处理： 删除失败！*/
				}
			} else {
			}
		}
	});
}
