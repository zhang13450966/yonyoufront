import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, UISTATE } from '../constance/index';
import { viewController, setButtonsEnable } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo, showDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props, record, index, isLine) {
	if (index != undefined) {
		if (this.state.status == UISTATE.edit) {
			this.props.editTable.deleteTableRowsByIndex(AREA.tableArea, index);
			setButtonsEnable.call(this, this.props, true);
		} else {
			//将record的值赋值到新的delRecord对象中，避免删除失败时，当前行的状态被改变后，没有恢复，造成异常
			let delRecord = {};
			delRecord.rowid = record.rowid;
			delRecord.status = 3;
			delRecord.values = record.values;
			let allarr = [];
			allarr.push(delRecord);
			let rowIds = [];
			rowIds.push(index);
			doDelete.call(this, props, allarr, rowIds);
		}
	} else {
		// 获取选中行
		let rows = props.editTable.getCheckedRows(AREA.tableArea);
		if (rows.length <= 0) {
			showWarningInfo(getLangByResId(this, '4001PROMOTTYPE-000001')); /* 国际化处理： 请选择要删除的数据*/
			return;
		}
		//选中行号
		let rowIds = [];
		//删行
		rows.forEach((row) => {
			rowIds.push(row.index);
		});
		//区分浏览态的删除还是编辑态的删除
		if (this.state.status == UISTATE.edit) {
			props.editTable.deleteTableRowsByIndex(AREA.tableArea, rowIds);
			setButtonsEnable.call(this, this.props, true);
		} else {
			//所有的行
			let allarr = props.editTable.getAllRows(AREA.tableArea);
			let delarr = [];
			allarr.forEach((item) => {
				rows.forEach((i) => {
					if (i.data.rowid == item.rowid) {
						(item.status = 3), delarr.push(item);
					}
				});
			});

			showDeleteDialog({
				beSureBtnClick: doDelete.bind(this, props, delarr, rowIds)
			});
		}
	}
}

/**
 * 执行删除
 * @param {*} props 
 * @param {*} allarr 删除的数据
 * @param {*} rowIds 选中行id
 */
function doDelete(props, allarr, rowIds) {
	ajax({
		url: URL.save,
		async: false,
		data: {
			pageid: PAGECODE,
			model: {
				areaType: 'table',
				areacode: AREA.tableArea,
				PageInfo: {},
				rows: allarr
			}
		},
		success: (res) => {
			if (res && res.success) {
				props.editTable.deleteTableRowsByIndex(AREA.tableArea, rowIds, true);
				showSuccessInfo(getLangByResId(this, '4001PROMOTTYPE-000002')); /* 国际化处理： 删除成功！*/
				viewController.call(this, this.props, UISTATE.browse);
				setButtonsEnable.call(this, this.props, true);
			}
		}
	});
}
