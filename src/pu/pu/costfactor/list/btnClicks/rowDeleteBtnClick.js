/*
 * @Author: zhaochyu 
 * @PageInfo: 删除功能
 * @Date: 2018-05-29 11:04:51 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:12:14
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, UISTATE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props, record, index, e) {
	let pk = record.values.pk_costfactor.value;
	let ts = record.values.ts.value;
	let data = { id: pk, ts: ts }; // 主键 // 时间戳
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				showSuccessInfo(getLangByResId(this, '4004COSTFACTOR-000011'));
				/* 国际化处理： 删除成功！*/
				ajax({
					url: URL.listHeadQuery,
					data: { pagecode: PAGECODE.listpagecode },
					success: (res) => {
						//let { success, data } = res;
						if (res.success) {
							if (res.data && res.data.list_head && res.data.list_head.list_head) {
								this.props.editTable.setTableData(PAGECODE.headId, res.data.list_head.list_head);
							} else {
								this.props.editTable.setTableData(PAGECODE.headId, {
									rows: []
								});
							}
							if (res.data && res.data.list_body && res.data.list_body.list_body) {
								this.props.editTable.setTableData(PAGECODE.bodyId, res.data.list_body.list_body);
							} else {
								this.props.editTable.setTableData(PAGECODE.bodyId, {
									rows: []
								});
							}
							//页面定位到第一行
							props.editTable.focusRowByIndex(PAGECODE.headId, 0);
							this.setState({ status: UISTATE.browse }, () => {
								this.toggleShow();
							});
						}
					}
				});
			} else {
				showSuccessInfo(getLangByResId(this, '4004COSTFACTOR-000012'));
				/* 国际化处理： 删除失败！*/
			}
		}
	});
}
