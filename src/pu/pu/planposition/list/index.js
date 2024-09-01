/*
 * @Author: yechd5 
 * @PageInfo: 计划岗物料设置页面
 * @Date: 2018-05-10 09:29:49 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 14:43:34
 */
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, createPageIcon } from 'nc-lightapp-front';
import { afterEvent, beforeEvent } from './events';
import { initTemplate } from './init';
import { buttonClick, selectedClick, selectedAllClick } from './btnClicks';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from './const';
import buttonController from '../list/viewController/buttonController';
// import '../../../../scmpub/scmpub/pub/style/singtable.less';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
class PlanPositionTable extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(PLANPOSITION_CONST.TABLEID);
		this.props = props;
		this.state = {
			disabled: false, // 主组织参照是否可用编辑
			pk_org: { value: '', display: '' },
			// 多语
			json: {},
			inlt: null
		};
	}

	componentDidMount() {
		buttonController.call(this, this.props, this.state.pk_org.value, PLANPOSITION_CONST.BROWSE);
	}

	// 关闭浏览器提示
	componentWillMount() {
		// 适配多语
		initLang(this, [ '4004planposition' ], 'pu', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PLANPOSITION_CONST.TABLEID);
			if (status == PLANPOSITION_CONST.EDIT) {
				return getLangByResId(this, '4004PLANPOSITION-000014'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	// 加载数据
	getData = (req) => {
		ajax({
			url: PLANPOSITION_CONST.QUERYURL,
			data: req,
			success: (res) => {
				if (res.success) {
					if (res.data && res.data[PLANPOSITION_CONST.TABLEID]) {
						this.props.editTable.setTableData(
							PLANPOSITION_CONST.TABLEID,
							res.data[PLANPOSITION_CONST.TABLEID]
						);
					} else {
						this.props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
					}

					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(res.formulamsg);
					}
					buttonController.call(this, this.props, this.state.pk_org.value, PLANPOSITION_CONST.BROWSE);
				}
			}
		});
	};

	// 库存组织改变事件
	handleChange = (event) => {
		this.setState({
			pk_org: {
				value: event.refpk,
				display: event.refname
			}
		});

		if (event.refpk) {
			let data = {
				pk_org: event.refpk,
				pageId: PLANPOSITION_CONST.PAGEID,
				nodecode: PLANPOSITION_CONST.NODECODE
			};
			this.getData(data);
		} else {
			this.props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
			buttonController.call(this, this.props, event.refpk, PLANPOSITION_CONST.BROWSE);
		}
	};

	// 主渲染方法
	render() {
		let { editTable } = this.props;
		let { createEditTable } = editTable;
		// 获取小应用里注册的按钮
		let buttons = this.props.button.getButtons();
		buttons.sort((a, b) => {
			return a.btnorder - b.btnorder;
		});

		return (
			<div className="nc-single-table">
				<div className="nc-singleTable-header-area">
					<div className="header-title-search-area">
						{/*页面大图标*/}
						{createListTitle(this)}
						<MainOrgRef
							ref="mainOrg"
							placeholder={getLangByResId(this, '4004PLANPOSITION-000015')} /* 国际化处理： 库存组织*/
							refPath={'org/StockOrgGridRef/index.js'}
							queryGridUrl={'/nccloud/uapbd/org/StockOrgGridRef.do'}
							required={true}
							// 取个性化中心值
							value={{ refpk: this.state.pk_org.value, refname: this.state.pk_org.display }}
							disabled={this.state.disabled}
							onChange={this.handleChange}
							className="title-search-detail"
							// 主组织权限过滤
							queryCondition={() => {
								return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
							}}
						/>
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: PLANPOSITION_CONST.LIST_HEAD,
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(PLANPOSITION_CONST.TABLEID, {
						onAfterEvent: afterEvent.bind(this),
						onBeforeEvent: beforeEvent.bind(this),
						showCheck: true,
						showIndex: true,
						// 单选及多选事件触发
						onSelected: selectedClick.bind(this),
						onSelectedAll: selectedAllClick.bind(this)
					})}
				</div>
			</div>
		);
	}
}

PlanPositionTable = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PLANPOSITION_CONST.PAGEID,
		bodycode: { po_planposition_list: 'editTable' }
	},
	// Tab快捷键适配
	orderOfHotKey: [ PLANPOSITION_CONST.TABLEID ]
})(PlanPositionTable);

ReactDOM.render(<PlanPositionTable />, document.querySelector('#app'));
