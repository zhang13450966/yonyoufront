/*
 * @Author: zhaochyu 
 * @PageInfo: 车辆保存
 * @Date: 2020-02-10 12:46:07 
 * @Last Modified by: jiangzls
 * @Last Modified time: 2020-12-22 20:15:51
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FILED, PAGEID } from '../../constance';
import { setBrowseStatusButton, setDeleteStatus } from '../viewController/buttonController';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function SaveBtnClick() {
	// 过滤表格空行（排除新增时某些字段有默认值）
	const defaultValueField = [ 'pk_org', 'org_id', 'numberindex', 'fattributeflag', 'fusestatusflag' ];
	// 新增时赋默认值的字段
	this.props.editTable.filterEmptyRows(AREA.listTable, defaultValueField);
	let rows = this.props.editTable.getAllRows(AREA.listTable, true);
	let flag = this.props.editTable.checkRequired(AREA.listTable, rows);
	if (!flag) {
		return;
	}
	let type = this.props.getUrlParam(FILED.type);
	let data = {
		pageid: type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup,
		model: {
			areaType: 'table',
			areacode: AREA.listTable,
			rows: rows
		}
	};
	this.props.validateToSave(data, () => {
		ajax({
			url: URL.save,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res && res.data) {
					if (res.data[AREA.listTable]) {
						res.data.listhead.rows.map((k) => {
							if (k.values.pk_org_v.value) {
								k.values.org_id = { value: k.values.pk_org_v.display };
							} else {
								k.values.org_id = { value: k.values.pk_group.display };
							}
						});
						this.props.editTable.setTableData(AREA.listTable, res.data.listhead);
						this.props.editTable.setStatus(AREA.listTable, 'browse');
						setDeleteStatus.call(this);
						this.props.button.setButtonDisabled([ 'Edit' ], false);
					} else {
						this.props.editTable.setTableData(AREA.listTable, {
							rows: [],
							areacode: AREA.listTable
						});
						this.props.button.setButtonDisabled([ 'Edit' ], true);
					}
				} else {
					this.props.editTable.setTableData(AREA.listTable, {
						rows: [],
						areacode: AREA.listTable
					});
					this.props.button.setButtonDisabled([ 'Edit' ], true);
				}
				this.props.editTable.setStatus(AREA.listTable, 'browse');
				setBrowseStatusButton.call(this);
				showSuccessInfo(getLangByResId(this, '4001VEHICLE-000009')); /* 国际化处理： 保存成功!*/
			}
		});
	});
}
