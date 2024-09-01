/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-04 13:42:17
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 15:23:21
 */
import { ajax } from 'nc-lightapp-front';
import buttonController from '../../list/viewController/buttonController';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { POSITION_CONST, URL } from '../../const';
import { setTableData, getCacheByPk, setDownTableData } from 'scmpub/scmpub/components/VerticalEditTable';

export default function commonSearch(event, isRefresh) {
	let pk_org = event.refpk;
	// 清空主组织
	if (!pk_org) {
		this.mainorgvalue.refpk = null;
		this.mainorgvalue.refname = null;
		// // 控制按钮状态
		setTableData.call(this, undefined, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID);
		buttonController.call(this, this.props, POSITION_CONST.BROWSER_STATUS);
		return;
	}
	// 查询组织下数据
	this.mainorgvalue = event;
	ajax({
		url: URL.QUERY,
		data: { pk_org: pk_org, nodecode: this.nodecode, pagecode: POSITION_CONST.PAGECODE },
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						[POSITION_CONST.UPTABLEID]: 'cardTable',
						[POSITION_CONST.DOWNTABLEID]: 'cardTable'
					}
				);
			}
			setTableData.call(this, res.data, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID);
			// // 控制按钮状态
			buttonController.call(this, this.props, POSITION_CONST.BROWSER_STATUS);
			//如果是刷新提示刷新成功
			if (isRefresh) {
				showRefreshInfo();
			}
		}
	});
}

export function searchById(props, moduleId, record, index) {
	let pk_bill = record.values['pk_position'].value;
	if (!pk_bill) {
		return;
	}
	let bodys = getCacheByPk.call(this, pk_bill);

	if (bodys) {
		setDownTableData.call(this, bodys, POSITION_CONST.DOWNTABLEID);
	} else {
		ajax({
			url: URL.QUERYBYID,
			data: { pk_bill: pk_bill, pagecode: POSITION_CONST.PAGECODE },
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							[POSITION_CONST.UPTABLEID]: 'cardTable',
							[POSITION_CONST.DOWNTABLEID]: 'cardTable'
						}
					);
				}
				setDownTableData.call(this, res.data, POSITION_CONST.DOWNTABLEID);
			}
		});
	}
}
