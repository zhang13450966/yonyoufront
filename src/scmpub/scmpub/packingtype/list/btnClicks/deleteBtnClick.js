import { ajax } from 'nc-lightapp-front';
import { PAGECODE, PAGEAREA, UISTATE, URL, BUTTONS } from '../constance';
import { showWarningDialog, showSuccessInfo, showWarningInfo } from '../../../pub/tool/messageUtil';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, record, index, isLine) {
	let rows = props.editTable.getCheckedRows(PAGEAREA.list); //选中行
	let status = props.editTable.getStatus(PAGEAREA.list);
	//行删除
	if (isLine) {
		if (status == UISTATE.browse) {
			//将record的值赋值到新的delRecord对象中，避免删除失败时，当前行的状态被改变后，没有恢复，造成异常
			let delRecord = {};
			delRecord.rowid = record.rowid;
			delRecord.status = 3;
			delRecord.values = record.values;
			let allarr = [];
			allarr.push(delRecord);
			doDelete.call(this, props, allarr, index);
		} else {
			props.editTable.deleteTableRowsByIndex(PAGEAREA.list, index);
			let checkrows = props.editTable.getCheckedRows(PAGEAREA.list);
			if (checkrows.length <= 0) {
				props.button.setButtonDisabled(BUTTONS.Delete, true);
			}
		}
	} else {
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			showWarningInfo(getLangByResId(this, '4001PACKINGTYPE-000003')); /* 国际化处理： 请选择要删除的数据*/
			return;
		}
		let indexes = []; //选中行号
		//删行
		rows.forEach((row) => {
			indexes.push(row.index);
		});
		if (status == UISTATE.browse) {
			let allarr = props.editTable.getAllRows(PAGEAREA.list);
			let delarr = [];
			allarr.forEach((item) => {
				rows.forEach((i) => {
					if (i.data.rowid == item.rowid) {
						item.status = 3;
						delarr.push(item);
					}
				});
			});
			//浏览态删除
			showWarningDialog(
				getLangByResId(this, '4001PACKINGTYPE-000004'),
				getLangByResId(this, '4001PACKINGTYPE-000005'),
				{
					/* 国际化处理： 删除,确定要删除所选数据吗？*/
					beSureBtnClick: doDelete.bind(this, props, delarr, indexes)
				}
			);
		} else {
			props.editTable.deleteTableRowsByIndex(PAGEAREA.list, indexes);
			buttonController.call(this, props, UISTATE.edit);
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
		//data: { infos: deleteInfos },
		data: {
			pageid: PAGECODE,
			model: {
				areaType: 'table',
				areacode: PAGEAREA.list,
				PageInfo: {},
				rows: allarr
			}
		},
		success: (res) => {
			if (res && res.success) {
				props.editTable.deleteTableRowsByIndex(PAGEAREA.list, rowIds, true);
				showSuccessInfo(getLangByResId(this, '4001PACKINGTYPE-000006')); /* 国际化处理： 删除成功！*/
				buttonController.call(this, props, UISTATE.browse);
			}
		}
	});
}
