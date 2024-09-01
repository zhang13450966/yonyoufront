/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单卡片删除
 * @Date: 2021-11-23 21:39:08 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-11 16:35:19
 */

import { ajax } from 'nc-lightapp-front';
import queryCardBtnClick from './queryCardBtnClick';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { URL, AREA, CONSTFIELD, FIELD, UISTATE } from '../../constance';

export default function delBtnClick(props, skipCodes) {
	/**
	 * getLangByResId(this, '4008PUB-000052')-删除：
	 * getLangByResId(this, '4008PUB-000053')-确定要删除吗？
	 */
	showSingleDeleteDialog({
		beSureBtnClick: () => {
			let batchData = props.form.getFormItemsValue(AREA.head, [ FIELD.hid, FIELD.ts ]);
			let id = batchData[0].value;
			let ts = batchData[1].value;
			let batchInfo = { billInfo: [ { pk: id, ts: ts, bodys: [] } ] };
			// 获取表头表体的主键和ts
			let rows = props.cardTable.getAllRows(AREA.body);
			rows.forEach((row) => {
				batchInfo.billInfo[0].bodys.push({
					pk: row.values[FIELD.bid].value,
					ts: row.values[FIELD.ts].value
				});
			});
			skipCodes = skipCodes ? skipCodes : new Array();
			batchInfo['skipCodes'] = skipCodes;
			ajax({
				url: URL.delete,
				data: batchInfo,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data && data.isResume && data.isResume == true) {
							// 如果不需要交互式异常，后面可以去掉
							showResumeModal.bind(this)(
								props,
								'ResumeMessageDlg',
								skipCodes,
								data,
								delBtnClick,
								props,
								constance,
								currentindex
							);
							return;
						} else {
							let channelType = this.props.getUrlParam('channelType');
							if (channelType && props.transferTable.getTransformFormAmount('leftarea') > 1) {
								this.indexstatus = {};
								props.transferTable.setTransformFormStatus(AREA.leftarea, {
									status: false,
									onChange: (current, next) => {
										showSuccessInfo(
											getLangByResId(this, '4004planconfirm-000009')
										); /* 国际化处理： 删除成功*/
									}
								});
							} else {
								let nextId = getNextId(props, id, CONSTFIELD.dataSource);
								deleteCacheData(props, FIELD.hid, id, CONSTFIELD.dataSource);
								props.setUrlParam({
									status: UISTATE.browse,
									id: nextId
								});
								showSuccessInfo(getLangByResId(this, '4004planconfirm-000009')); /* 国际化处理： 删除成功！*/
								queryCardBtnClick.call(this, props, nextId);
							}
						}
					}
				}
			});
		}
	});
}
