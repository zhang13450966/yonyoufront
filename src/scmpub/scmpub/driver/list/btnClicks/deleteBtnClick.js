/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义删除
 * @Date: 2020-02-10 12:39:35 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-20 16:33:36
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog, showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function deleteBtnClick() {
	let indexSet = new Set();
	let type = this.props.getUrlParam(FILED.type);
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	let checkeddata = this.props.editTable.getCheckedRows(AREA.listTable);
	for (let i = 0; i < checkeddata.length; i++) {
		indexSet.add(checkeddata[i].index);
		if (type == 0) {
			if (checkeddata[i].data.values.pk_group.value == checkeddata[i].data.values.pk_org.value) {
				showErrorInfo(getLangByResId(this, '4001DRIVER-000002')); /* 国际化处理： 组织节点不能删除集团级节点数据*/
				return;
			}
		}
	}
	if (this.props.editTable.getStatus(AREA.listTable) == 'edit') {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet));
		this.props.button.setButtonDisabled([ 'Delete' ], true);
		return;
	}
	// 执行删除操作提示
	showWarningDialog(getLangByResId(this, '4001DRIVER-000003'), getLangByResId(this, '4001DRIVER-000004'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: () => {
			let pk = [];
			let rows = this.props.editTable.getCheckedRows(AREA.listTable);
			rows.map((row) => {
				pk.push(row.data.values.cdriverid.value);
			});
			let data = { id: pk, pagecode: pageid };
			ajax({
				method: 'post',
				data: data,
				url: URL.delete,
				success: (res) => {
					if (res.success) {
						this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet), true);
						setBrowseStatusButton.call(this);
						showSuccessInfo(getLangByResId(this, '4001DRIVER-000005')); /* 国际化处理： 删除成功！*/
						let count = this.props.editTable.getNumberOfRows(AREA.listTable);
						if (count > 0) {
							this.props.button.setButtonDisabled([ 'Edit' ], false);
						} else {
							this.props.button.setButtonDisabled([ 'Edit' ], true);
						}
					}
				}
			});
		}
	});
}
