/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型设置页面 
 * @Date: 2018-04-04 13:10:26 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-03-26 15:35:51
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base } from 'nc-lightapp-front';
import { buttonClick, selectedClick, selectedAllClick } from './btnClicks';
import { initTemplate } from './init';
import { afterEvent } from './events';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
import { MARTRANTYPE_CONST, BTNCODE } from './const';
import buttonController from '../list/viewController/buttonController';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCAffix, NCDiv } = base;
class MartrantypeTable extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(MARTRANTYPE_CONST.TABLEID);
		this.props = props;
		this.state = {
			json: {},
			inlt: null,
			disabled: false, // 主组织参照是否可用编辑
			pk_org: { value: '', display: '' }
		};
	}

	componentDidMount() {
		buttonController.call(this, this.props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE);
	}

	// 关闭浏览器提示
	componentWillMount() {
		initLang(this, [ '4001martrantype' ], 'scmpub', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(MARTRANTYPE_CONST.TABLEID);
			if (status == MARTRANTYPE_CONST.EDIT) {
				return getLangByResId(this, '4001MARTRANTYPE-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	// 加载数据
	getData = (req) => {
		ajax({
			url: MARTRANTYPE_CONST.QUERYURL,
			data: req,
			success: (res) => {
				if (res.success) {
					if (res.data && res.data[MARTRANTYPE_CONST.TABLEID]) {
						this.props.editTable.setTableData(
							MARTRANTYPE_CONST.TABLEID,
							res.data[MARTRANTYPE_CONST.TABLEID]
						);
					} else {
						this.props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
					}
					// 适配公式
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(res.formulamsg);
					}
					buttonController.call(this, this.props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE);
				}
			}
		});
	};

	// 采购组织改变事件
	handleChange = (event) => {
		this.setState({
			pk_org: {
				value: event.refpk,
				display: event.refname
			}
		});
		if (event.refpk) {
			let data = { pk_org: event.refpk, pageId: MARTRANTYPE_CONST.PAGEID };
			this.getData(data);
		} else {
			this.props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
			buttonController.call(this, this.props, event.refpk, MARTRANTYPE_CONST.BROWSE);
		}
	};

	// 主渲染方法
	render() {
		let { editTable, BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		const { createBillHeadInfo } = BillHeadInfo;
		let buttons = this.props.button.getButtons();
		buttons.sort((a, b) => {
			return a.btnorder - b.btnorder;
		});

		return (
			<div className="nc-single-table">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							<MainOrgRef
								ref="mainOrg"
								placeholder={getLangByResId(this, '4001MARTRANTYPE-000002')} /* 国际化处理： 采购组织*/
								refPath={'org/PurchaseOrgGridRef'}
								queryGridUrl={'/nccloud/uapbd/ref/PurchaseOrgGridRef.do'}
								// 取个性化中心值
								value={{ refpk: this.state.pk_org.value, refname: this.state.pk_org.display }}
								disabled={this.state.disabled}
								onChange={this.handleChange}
								className="title-search-detail"
								required={true}
								// 主组织权限过滤
								queryCondition={() => {
									return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
								}}
							/>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: MARTRANTYPE_CONST.LIST_HEAD,
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								ignoreHotkeyCode: [ BTNCODE.DELETE ],
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-singleTable-table-area">
					{createEditTable(MARTRANTYPE_CONST.TABLEID, {
						onAfterEvent: afterEvent.bind(this),
						showCheck: true,
						showIndex: true,
						onSelected: selectedClick.bind(this),
						onSelectedAll: selectedAllClick.bind(this),
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}

MartrantypeTable = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: MARTRANTYPE_CONST.PAGEID,
		bodycode: { ordertranstype: 'editTable' }
	},
	// Tab快捷键适配
	orderOfHotKey: [ MARTRANTYPE_CONST.TABLEID ]
})(MartrantypeTable);

ReactDOM.render(<MartrantypeTable />, document.querySelector('#app'));
