/*
 * @Author: jiangphk
 * @PageInfo: 会计平台联查来源，加载数据
 * @Date: 2018-04-10 12:21:36 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:18:49
 */
import { AREA, REQUESTURL, BUTTONID, UISTATE, FIELDS, PAGECODE } from '../../constance';
import { ajax, cacheTools } from 'nc-lightapp-front';

export default function(props) {
	let src = this.props.getUrlParam('scene');
	if (src && 'fip' == src) {
		//fip代表会计平台
		let checkedData = cacheTools.get('checkedData');
		ajax({
			url: REQUESTURL.linkQuery,
			data: checkedData,
			success: (res) => {
				if (res.data) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (res.data.head.rows.length == 1) {
						this.props.pushTo(REQUESTURL.toCard, {
							status: UISTATE.browse,
							id: res.data.head.rows[0].values[FIELDS.pk_taxinvoice].value,
							pagecode: PAGECODE.cardPagecode
						});
					} else {
						this.props.table.setAllTableData(AREA.listTableId, res.data[AREA.listTableId]);
						this.props.button.setDisabled({
							[BUTTONID.Print]: true,
							[BUTTONID.Output]: true,
							[BUTTONID.Refresh]: false //刷新可点
						});
					}
				} else {
					this.props.table.setAllTableData(AREA.listTableId, { rows: [] });
					this.props.button.setDisabled({
						[BUTTONID.Print]: true,
						[BUTTONID.Output]: true,
						[BUTTONID.Refresh]: false //刷新可点
					});
				}
			}
		});
	}
}
