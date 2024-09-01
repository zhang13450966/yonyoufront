/*
 * @Author: zhaochyu
 * @PageInfo: 车辆定义
 * @Date: 2020-01-14 16:42:14
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 15:57:09
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { lineSelected } from './viewController/buttonController';
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
import { initTemplate } from './init';
import { AREA, STATUS, ROOT, FILED, PAGEID, ALLBUTTONS } from '../constance';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { queryBtnClick } from './btnClicks/queryBtnClick';
import beforeEvent from './events/beforeEvent';
import afterEvent from './events/afterEvent';
import btnClickController from './viewController/btnClickController';
import { getLangByResId, initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCDiv } = base;
class DriverList extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(AREA.listTable);
		this.isAdd = false;
		this.state = {
			status: 'browse',
			defaultVO: null,
			refname: null,
			pk_org: '',
			pageid: '',
			mainOrg: {},
			assignOrg: null,
			assignDisplay: {},
			searchData: null,
			selectedPKS: [],
			delIndex: -1
		};
		initLang(this, [ '4001driver' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(AREA.listTable) || STATUS.browse;
			if (status == STATUS.edit) {
				return getLangByResId(this, '4001DRIVER-000018'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	componentDidMount() {
		this.props.editTable.setTableData(AREA.listTable, { rows: [] });
		this.toggleShow();
	}

	toggleShow = () => {};
	getOrgInterface = (type) => {
		if (type == 0) {
			return (
				<MainOrgRef
					refName={getLangByResId(this, '4001DRIVER-000019')} /* 国际化处理： 物流组织*/
					placeholder={getLangByResId(this, '4001DRIVER-000019')} /* 国际化处理： 物流组织*/
					ref="mainorg"
					refType="grid"
					required={true}
					refCode={'pk_org'}
					queryGridUrl={'/nccloud/uapbd/org/TrafficOrgGridRef.do'}
					value={this.state.mainOrg}
					disabled={this.state.status == 'edit'}
					queryCondition={() => {
						return {
							GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
						};
					}}
					onChange={(event) => {
						if (event.refpk) {
							//&& event.refpk != this.state.pk_org
							queryBtnClick.call(this, event, 'isOrg');
						} else if (!event.refpk) {
							this.state.defaultVO = null;
							this.state.pk_org = '';
							this.props.editTable.setTableData(AREA.listTable, { rows: [] });
							this.props.button.setDisabled(ALLBUTTONS, true);
						}
					}}
				/>
			);
		}
	};
	orgAfterEvent = (field, value) => {
		if (field == 'pk_org' && Array.isArray(value) && value.length > 0) {
			console.log(value);
			this.refs.mainorg.onChange(value[0]);
		}
	};
	renderCompleteEvent = () => {};
	render() {
		const { editTable } = this.props;
		const { createEditTable } = editTable;
		let type = this.props.getUrlParam(FILED.type);
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{this.getOrgInterface(type)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							onButtonClick: btnClickController.bind(this),
							ignoreHotkeyCode: [ 'Delete' ]
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-table-area">
					{createEditTable(AREA.listTable, {
						showIndex: true,
						showCheck: true,
						adaptionHeight: true,
						isAddRow: false,
						onAfterEvent: afterEvent.bind(this),
						onBeforeEvent: beforeEvent.bind(this),
						selectedChange: lineSelected.bind(this, this.props)
						// selectAll: selectAllMethod.bind(this, AREA.listTable),
						//addRowCallback: addRowBackMethod.bind(this, AREA.listTable)
					})}
				</div>
			</div>
		);
	}
}
DriverList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGEID,
		bodycode: {
			[AREA.listTable]: 'editTable' //此处发生变化了，需要传一个对象
		}
	}
})(DriverList);
ReactDOM.render(<DriverList />, document.querySelector(ROOT));
