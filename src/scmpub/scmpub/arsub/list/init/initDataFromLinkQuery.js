/*
 * @Author: sunxxf 
 * @PageInfo: 会计平台联查来源，加载数据
 * @Date: 2021-01-18 15:28:41 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:12:16
 */

import { ArsubHeadItem, ARSUB_CONST, BUTTON } from '../../const';
import { ajax, cacheTools } from 'nc-lightapp-front';

export default function(props) {
	let src = this.props.getUrlParam('scene');
	if (src && 'fip' == src) {
		//fip代表会计平台
		let checkedData = cacheTools.get('checkedData');
		ajax({
			url: ARSUB_CONST.linkQuery,
			data: checkedData,
			success: (res) => {
				if (res.data) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (res.data.head.rows.length == 1) {
						this.props.pushTo('/card', {
							status: 'browse',
							id: res.data.head.rows[0].values[ArsubHeadItem.carsubid].value,
							pagecode: ARSUB_CONST.cardPageId
						});
					} else {
						this.props.table.setAllTableData(ARSUB_CONST.formId, res.data[ARSUB_CONST.formId]);
						this.props.button.setDisabled({
							[BUTTON.print]: true,
							[BUTTON.output]: true,
							[BUTTON.refresh]: false //刷新可点
						});
					}
				} else {
					this.props.table.setAllTableData(ARSUB_CONST.tableId, { rows: [] });
					this.props.button.setDisabled({
						[BUTTON.print]: true,
						[BUTTON.output]: true,
						[BUTTON.refresh]: false //刷新可点
					});
				}
			}
		});
	}
}
