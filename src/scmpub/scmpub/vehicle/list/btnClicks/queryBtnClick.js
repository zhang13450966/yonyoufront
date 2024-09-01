/*
 * @Author: zhaochyu 
 * @PageInfo: 车辆定义查询 
 * @Date: 2020-02-10 12:49:16 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 14:08:59
 */
import { AREA, URL } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function queryBtnClick(event, isorg, isRefresh) {
	let refpk = null;
	let refname = null;
	if (event != null) {
		refpk = event.refpk;
		this.setState({
			pk_org: refpk,
			refname: event.refname,
			mainOrg: event,
			defaultVO: null
		});
	}
	ajax({
		method: 'POST',
		url: URL.orgChange,
		data: {
			key: 'pk_org',
			value: refpk,
			isOrg: isorg
		},
		success: (res) => {
			if (res && res.data) {
				this.props.editTable.setTableData(AREA.listTable, res.data.listhead);

				this.state.defaultVO = res.data[AREA.listTable].rows[0];
				this.props.button.setButtonDisabled([ 'PrintPop', 'Delete', 'Output' ], true);
				this.props.button.setButtonDisabled([ 'Add', 'Refresh', 'Edit' ], false);
				if (event == null) {
					this.setState({
						refname: refname
					});
				}
				if (isRefresh) {
					showSuccessInfo(getLangByResId(this, '4001VEHICLE-000007')); /* 国际化处理： 刷新成功！*/
				}
			} else if (!res.data) {
				this.props.editTable.setTableData(AREA.listTable, { rows: [] });
				this.props.button.setButtonDisabled([ 'Add', 'Refresh' ], false);
				this.props.button.setButtonDisabled([ 'Edit' ], true);
				if (isRefresh) {
					showSuccessInfo(getLangByResId(this, '4001VEHICLE-000007')); /* 国际化处理： 刷新成功！*/
				}
			}
		}
	});
}
