/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，提交，收回按钮
 * @Date: 2021-11-24 15:44:14 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-19 15:39:43
 */

import { URL, AREA, CONSTFIELD, FIELD, PAGECODE } from '../../constance';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { buttonController } from '../viewController/index';

export default function commitBtnClick(props, flag, assign, skipCodes) {
	let batchData = props.form.getFormItemsValue(AREA.head, [ FIELD.hid, FIELD.ts ]);
	let id = batchData[0].value;
	let ts = batchData[1].value;
	let batchInfo = { pagecode: PAGECODE.card, isCard: true, billInfo: [ { pk: id, ts: ts, bodys: [] } ] };
	skipCodes = skipCodes ? skipCodes : new Array();
	batchInfo['skipCodes'] = skipCodes;
	// 获取表头表体的主键和ts
	let rows = props.cardTable.getAllRows(AREA.body);
	rows.forEach((row) => {
		batchInfo.billInfo[0].bodys.push({
			pk: row.values[FIELD.bid].value,
			ts: row.values[FIELD.ts].value
		});
	});
	// 提交指派添加 20180823 begin
	if (assign) {
		batchInfo['assign'] = JSON.stringify(assign);
	}
	// 提交指派添加 20180823 end
	let url = '';
	if (flag) {
		url = URL.commit;
	} else {
		url = URL.uncommit;
	}
	ajax({
		url,
		data: batchInfo,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				//缓存当前数据
				this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}

			if (res && res.success) {
				//交互式异常处理
				props.beforeUpdatePage();
				if (res.data && res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data.data.billcard,
						commitBtnClick,
						props,
						flag,
						assign,
						null
					);
					return;
				} else {
					// 删除成功之后前台跳转到列表态
					if (flag) {
						showSuccessInfo(
							getLangByResId(this, getLangByResId(this, '4004planconfirm-000006'))
						); /* 国际化处理： 提交成功*/
					} else {
						showSuccessInfo(
							getLangByResId(this, getLangByResId(this, '4004planconfirm-000010'))
						); /* 国际化处理： 收回成功*/
					}
					let config = {
						headAreaId: AREA.head,
						bodyAreaId: AREA.body,
						bodyPKfield: FIELD.hid
					};

					let comRes = { data: res.data.data };
					//comRes.data = updateDtaForCompareByPk(props, comRes.data, config);

					updateCacheData(props, FIELD.hid, id, comRes.data, AREA.head, CONSTFIELD.dataSource);
					props.form.setAllFormValue({
						[AREA.head]: res.data.data.head[AREA.head]
					});
					//设置表头数据
					props.form.setAllFormValue({
						[AREA.head]: res.data.data.head[AREA.head]
					});
					props.cardTable.setTableData(AREA.body, res.data.data.body[AREA.body]);
					props.updatePage(AREA.head, AREA.body);

					buttonController.call(this, props);
				}
			} else {
				showWarningInfo(null, res); /* 国际化处理： 请注意*/
			}
		}
	});
}
