/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消安排按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-23 09:17:30
 */
import { BUYINGREQ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import refreshBtnClick from './refreshBtnClick';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let formId = BUYINGREQ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行

	let checkData = props.editTable.getCheckedRows(formId);
	if (checkData == undefined) {
		return;
	}
	if (checkData.length <= 0) {
		showWarningDialog(null, getLangByResId(this, '4004PRAYBILLARRANGE-000000')); /* 国际化处理： 请选择需要处理的数据！*/
		return;
	}
	// 弹出确认框
	showWarningDialog(
		getLangByResId(this, '4004PRAYBILLARRANGE-000011'),
		getLangByResId(this, '4004PRAYBILLARRANGE-000012'),
		{
			/* 国际化处理： 确认要取消吗？*/
			beSureBtnClick: () => {
				let rows = [];
				checkData.map((item) => {
					rows.push(item.data);
				});
				let formData = {
					areacode: BUYINGREQ_LIST.formId,
					areaType: 'table',
					rows: rows
				};
				let data = {
					pageid: BUYINGREQ_LIST.listpageid,
					model: formData
				};
				// 发送请求
				ajax({
					url: BUYINGREQ_LIST.cancelBatchURL,
					data: data,
					success: (res) => {
						if (res.success) {
							showSuccessInfo(getLangByResId(this, '4004PRAYBILLARRANGE-000019')); /* 国际化处理： 取消安排成功！*/
							refreshBtnClick.call(this);
						} else {
						}
					}
				});
			}
		}
	);
	// props.modal.show('modelCancel', {
	// 	beSureBtnClick: () => {
	// 		let rows = [];
	// 		checkData.map((item) => {
	// 			rows.push(item.data);
	// 		});
	// 		let formData = {
	// 			areacode: BUYINGREQ_LIST.formId,
	// 			areaType: 'table',
	// 			rows: rows
	// 		};
	// 		let data = {
	// 			pageid: BUYINGREQ_LIST.listpageid,
	// 			model: formData
	// 		};
	// 		// 发送请求
	// 		ajax({
	// 			url: BUYINGREQ_LIST.cancelBatchURL,
	// 			data: data,
	// 			success: (res) => {
	// 				if (res.success) {
	// 					refreshBtnClick.call(this);
	// 				} else {
	// 				}
	// 			}
	// 		});
	// 	}
	// });
}
