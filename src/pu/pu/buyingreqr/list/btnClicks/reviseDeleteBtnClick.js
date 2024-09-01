/*
 * @Author: tianzhyw 
 * @PageInfo: 列表修订删除按钮
 * @Date: 2021-06-04 15:11:05 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-04 15:11:05 
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { buttonController } from '../viewControl';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';
export default function reviseDeleteBtnClick(props, record, index) {
	// 弹出确认删除的框
	showWarningDialog(getLangByResId(this, '4004PRAYBILLR-000032'), getLangByResId(this, '4004PRAYBILLR-000033'), {
		/* 国际化处理： 是否确定要删除该修订？*/
		beSureBtnClick: backtotransfer.bind(this, props, record, index)
	});
}
function backtotransfer(props, record, index) {
	let oldPk_praybill = record.pk_praybill.value;
	let delRows = [];
	let datas = {
		id: record.pk_praybill.value,
		ts: record.ts.value
	};
	delRows.push(datas);
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: BUYINGREQ_LIST.listpageid
	};
	ajax({
		url: BUYINGREQ_LIST.reviseDeleteURL,
		data: data,
		success: (res) => {
			if (res.success) {
				// 删除页面数据
				props.table.deleteTableRowsByIndex(BUYINGREQ_LIST.formId, index);
				//删除缓存中的记录
				deleteCacheData(props, ATTRCODE.pk_praybill, oldPk_praybill, BUYINGREQ_LIST.dataSource);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000035')); /* 国际化处理： 修订删除成功！*/
				// 设置按钮显示状态
				buttonController.setListButtonVisiable(this.props);
			}
		}
	});
}
