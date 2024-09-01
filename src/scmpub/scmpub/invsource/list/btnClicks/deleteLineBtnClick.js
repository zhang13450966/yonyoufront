/*
 * @Author: 王龙华 
 * @PageInfo: 行删除事件
 * @Date: 2018-05-11 17:43:12 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-26 16:02:07
 */
import { INVSOURCE_CONST } from '../../const';
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController'

export default function deleteLineBtnClick(props, record, index) {
	let status = props.editTable.getStatus(INVSOURCE_CONST.TABLEID);
	if (status === INVSOURCE_CONST.EDIT_STATUS) {
		props.editTable.deleteTableRowsByIndex(INVSOURCE_CONST.TABLEID, index);
	    buttonController.call(this, props, status)
	} else {
		let seldata = JSON.parse(JSON.stringify(record));
		seldata.status = '3';
		let data = {
			pageid: INVSOURCE_CONST.PAGECODE,
			table: {
				areaType: 'table',
				pageinfo: null,
				rows: [ seldata ]
			}
		};
		ajax({
			url: INVSOURCE_CONST.SAVE_URL,
			data,
			success: (res) => {
				showSuccessInfo(getLangByResId(this, '4001INVSOURCE-000008')); /* 国际化处理： 删除成功*/
				props.editTable.deleteTableRowsByIndex(INVSOURCE_CONST.TABLEID, index, true);
				buttonController.call(this, props, status)
			}
		});
	}
}
