/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义删除
 * @Date: 2020-02-10 12:39:35 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 14:12:20
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGEID, FILED, URL } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog, showSuccessInfo, showErrorDialog } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function deleteBtnClick() {
	let indexSet = new Set();
	let type = this.props.getUrlParam(FILED.type);
	let pageid = type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup;
	let checkeddata = this.props.editTable.getCheckedRows(AREA.listTable);
	let tip = '';
	for (let i = 0; i < checkeddata.length; i++) {
		indexSet.add(checkeddata[i].index);
		if (type == 0) {
			let rowd = checkeddata[i].data.values;
			if (rowd.pk_org.value == rowd.pk_group.value) {
				tip +=
					getLangByResId(this, '4001VEHICLETYPE-000001') +
					rowd.vvhcltypecode.value +
					getLangByResId(this, '4001VEHICLETYPE-000002') +
					rowd.vvhcltypename.value +
					getLangByResId(this, '4001VEHICLETYPE-000003'); /* 国际化处理： 编码：, 名称 ,：原因组织节点不能删除集团数据; \r*/
			}
		}
	}
	if (tip) {
		showErrorDialog(getLangByResId(this, '4001VEHICLETYPE-000004'), tip); /* 国际化处理： 以下档案不能删除：*/
		return;
	}
	if (this.props.editTable.getStatus(AREA.listTable) == 'edit') {
		this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet));
		this.props.button.setButtonDisabled([ 'Delete' ], true);
		return;
	}
	// 执行删除操作提示
	showWarningDialog(getLangByResId(this, '4001VEHICLETYPE-000005'), getLangByResId(this, '4001VEHICLETYPE-000006'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: () => {
			let pk = [];
			let rows = this.props.editTable.getCheckedRows(AREA.listTable);
			rows.map((row) => {
				pk.push(row.data.values.cvehicletypeid.value);
			});
			let data = { id: pk, pagecode: pageid };
			ajax({
				method: 'post',
				data: data,
				url: URL.delete,
				success: (res) => {
					if (res.success) {
						this.props.editTable.deleteTableRowsByIndex(AREA.listTable, Array.from(indexSet), true);
						if (this.props.editTable.getNumberOfRows(AREA.listTable) == 0) {
							this.props.button.setButtonDisabled([ 'Edit' ], true);
						}
						setBrowseStatusButton.call(this);
						showSuccessInfo(getLangByResId(this, '4001VEHICLETYPE-000007')); /* 国际化处理： 删除成功!*/
					}
				}
			});
		}
	});
}
