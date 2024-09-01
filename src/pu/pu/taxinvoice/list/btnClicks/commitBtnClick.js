/*
 * @Author: chaiwx 
 * @PageInfo: 提交 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 14:59:44
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props, record, index, assign) {
	let data = { infos: [] };
	let checkArr = [];
	if (index >= 0 && record) {
		// 操作列提交
		data.infos.push({
			id: record[FIELDS.pk_taxinvoice].value,
			ts: record[FIELDS.ts].value
		});
	} else {
		// 表头按钮
		checkArr = props.table.getCheckedRows(AREA.listTableId);
		if (!checkArr || checkArr.length < 1) {
			showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
			return;
		}

		checkArr.map((row) => {
			data.infos.push({
				id: row.data.values[FIELDS.pk_taxinvoice].value,
				ts: row.data.values[FIELDS.ts].value
			});
		});
	}

	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}

	ajax({
		url: REQUESTURL.commit,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					if (
						res.data.userObj &&
						res.data.userObj.workflow &&
						(res.data.userObj.workflow == 'approveflow' || res.data.userObj.workflow == 'workflow')
					) {
						if (index >= 0 && record) {
							//缓存当前数据
							this.commitInfo = {
								record: record,
								index: index
							};
						} else {
							checkArr.map((row) => {
								data.infos.push({
									id: row.data.values[FIELDS.pk_taxinvoice].value,
									ts: row.data.values[FIELDS.ts].value
								});
							});

							//缓存当前数据
							this.commitInfo = { isBatch: true };
						}

						this.setState({
							compositedata: res.data.userObj,
							compositedisplay: true
						});
					} else {
						batchOperateUtils.batchOp(props, res, checkArr, record, index, {
							messageTitle: getLangByResId(this, '4004Taxinvoice-000010')
						}); /* 国际化处理： 提交成功*/
					}
				}
				onSelected.call(this, props);
			}
		}
	});
}
