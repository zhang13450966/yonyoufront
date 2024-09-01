/*
 * @Author: qishy 
 * @pageInfo:卡片取消按钮
 * @Date: 2019-04-29 14:08:40 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:07:09
 */

import { AREA, FIELDS, REQUESTURL, CACHDATASOURCE, OPTIONS, PAGECODE } from '../../constance';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache';
import pageInfoClick from './pageInfoClick';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl } from '../viewControl/buttonControl';
export default function(props) {
	let transferFrom = props.getUrlParam('transferFrom');
	showCancelDialog({
		beSureBtnClick: () => {
			if (props.getUrlParam('option') == 'transfer') {
				let pk_comparebill = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill);
				if (pk_comparebill && pk_comparebill.value) {
					// 主键已生成，修改状态
					this.isEdit = false;
					let data = props.transferTable.getTheTransferListDataSavedLastTime(
						AREA.leftarea,
						this.transferCurrentIndex
					);
					if (data.head && data.head[AREA.cardFormId]) {
						props.form.setAllFormValue({ [AREA.cardFormId]: data.head[AREA.cardFormId] });
					}
					if (data.body && data.body[AREA.cardTableId]) {
						this.props.cardTable.setTableData(
							AREA.cardTableId,
							data.body[AREA.cardTableId],
							null,
							true,
							true
						);
					}
					props.setUrlParam({ status: 'browse', id: pk_comparebill });
					let billStatus = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.forderstatus).value;
					buttonControl.call(this, props, billStatus);

					props.transferTable.updateTransformFormStatus(AREA.leftarea, { status: true });
				} else {
					if (props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
						// 转单-剩一条时，返回上级页面
						window.onbeforeunload = null;

						if (transferFrom == OPTIONS.from21) {
							props.pushTo(REQUESTURL.toTransfer21, { pagecode: PAGECODE.transferPagecode21 });
						} else if ((transferFrom = OPTIONS.from45)) {
							props.pushTo(REQUESTURL.toTransfer45, { pagecode: PAGECODE.transferPagecode45 });
						}
					} else {
						// 转单-多条，取消固定写法
						props.transferTable.setTransformFormStatus(AREA.leftarea, {
							status: false,
							onChange: (current, next) => {}
						});
					}
				}
			} else if (props.getUrlParam('status') === 'edit') {
				// 编辑取消
				pageInfoClick.call(this, props, props.getUrlParam('id'));
			} else if (props.getUrlParam('status') === 'add') {
				// 新增取消
				let pk = getCurrentLastId(CACHDATASOURCE.dataSourceList);
				pageInfoClick.call(this, props, pk);
				props.resMetaAfterPkorgEdit();
			}
		}
	});
}
