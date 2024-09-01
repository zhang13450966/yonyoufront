/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义，车辆定义，司机定义公共类 
 * @Date: 2020-01-15 09:17:21 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-13 14:45:40
 */
import { ajax, toast } from 'nc-lightapp-front';
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
//import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { RownoUtils } from '../../../../scmpub/pub/tool/editTableTools';
const BROWSEBUTTONS = [
	'Add',
	'Edit',
	'Delete',
	'Export',
	'Import',
	'Assign',
	'ExportImport',
	'Refresh',
	'PrintPop',
	'Print',
	'Output'
];
const EDITBUTTONS = [ 'Add', 'Save', 'Delete', 'Cancel' ];

function getMainOrgAfter(listTable, urldata, event, pagecode, isorg) {
	let refpk = null;
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
		url: urldata,
		data: {
			key: 'pk_org',
			value: refpk,
			pagecode: pagecode,
			isOrg: isorg
		},
		success: (res) => {
			if (res && res.data) {
				this.props.editTable.setTableData(listTable, res.data.listhead);
				this.state.defaultVO = res.data[listTable].rows[0];
				this.props.button.setButtonDisabled([ 'PrintPop', 'Delete', 'Output' ], true);
				this.props.button.setButtonDisabled([ 'Refresh', 'Edit' ], false);
			} else if (!res.data) {
				this.props.editTable.setTableData(listTable, { rows: [] });
				this.props.button.setButtonDisabled([ 'Refresh' ], false);
			}
			this.props.button.setButtonDisabled([ 'Add' ], false);
		}
	});
}
function getOrgInterface(listTable, urlorg, pagecode) {
	return (
		<MainOrgRef
			refName={'物流组织'}
			placeholder={'物流组织'}
			ref="mainorg"
			refType="grid"
			required={true}
			refCode={'pk_org'}
			queryGridUrl={'/nccloud/uapbd/org/TrafficOrgGridRef.do'}
			value={this.state.mainOrg}
			disabled={this.state.status == 'edit'}
			queryCondition={() => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			}}
			onChange={(event) => {
				if (event.refpk) {
					//&& event.refpk != this.state.pk_org
					getMainOrgAfter.call(this, listTable, urlorg, event, pagecode, 'isOrg');
				} else if (!event.refpk) {
					this.state.defaultVO = null;
					this.state.pk_org = '';
					this.props.editTable.setTableData(listTable, { rows: [] });
				}
			}}
		/>
	);
}
function selectChangeMethod(listTable) {
	let rows = this.props.editTable.getCheckedRows(listTable);
	if (rows && rows.length == 0) {
		this.props.button.setButtonDisabled([ 'Delete', 'Output', 'PrintPop', 'StartUse', 'StopUse' ], true);
	} else if (rows && rows.length > 1) {
		this.props.button.setButtonDisabled([ 'Print', 'Delete', 'Output', 'PrintPop' ], false);
	} else if (rows && rows.length == 1) {
		this.props.button.setButtonDisabled([ 'Edit', 'Delete', 'PrintPop', 'Output', 'StartUse', 'StopUse' ], false);
		// if (isEdit == 'edit') {
		//     this.props.button.setDisabled(["Delete"], false);
		// } else {
		//     this.props.button.setDisabled(["Delete"], true);
		// }
	}
}
function selectAllMethod(listTable) {
	let rows = this.props.editTable.getCheckedRows(listTable);
	if (rows && rows.length == 1) {
		if (rows[0].data.values.fpricesrctype.value == 3) {
			this.props.button.setButtonDisabled(
				[ 'Print', 'Delete', 'Output', 'Edit', 'Assign', 'Export', 'PrintPop' ],
				false
			);
		} else {
			this.props.button.setButtonDisabled([ 'Print', 'Output', 'Edit', 'Assign', 'Export', 'PrintPop' ], false);
		}
	} else if (rows && rows.length > 1) {
		this.props.button.setButtonDisabled(
			[ 'Print', 'Delete', 'Output', 'Edit', 'Assign', 'Export', 'PrintPop' ],
			false
		);
	}
}
function addRowBackMethod(listTable) {
	this.setState({
		status: 'edit'
	});
	let props = this.props;
	props.button.setPopContent('Delete', '');
	props.button.setButtonVisible(EDITBUTTONS, true);
	if (!this.state.defaultVO) {
		toast({
			content: '主组织不能为空',
			color: 'warning'
		}); /* 国际化处理： 主组织不能为空*/
		return;
	}
	if (this.props.editTable.getStatus(listTable) != 'edit') {
		this.props.button.setButtonDisabled([ 'Delete' ], true);
	}
	let row = props.editTable.getNumberOfRows(listTable) - 1;
	RownoUtils.setRowNoByIndex(props, listTable, 'crowno', row);
	let defaultKey = [ 'pk_org', 'pk_org_v', 'pk_group', 'corigcurrencyid', 'tcreatetime' ];
	let _this = this;
	defaultKey.forEach((key) => {
		_this.props.editTable.setValByKeyAndIndex(listTable, row, key, _this.state.defaultVO.values[key]);
	});
}
export { getMainOrgAfter, getOrgInterface, selectChangeMethod, selectAllMethod, addRowBackMethod };
