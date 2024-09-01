/*
 * 整箱定义
 * @Author: zhngzh 
 * @Date: 2019-04-26 15:47:12 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 16:05:29
 */
import React, { Component } from 'react';
import { createPage, base, getBusinessInfo } from 'nc-lightapp-front';
import { PAGECODE, BUTTONAREA, PAGEAREA, UISTATE, FIELDS } from './constance';
import { initTemplate } from './init';
import { btnClick, commonSearch } from './btnClicks';
import { buttonController } from './viewController';
import { afterEvent, beforeEvent } from './events';
import MainOrgRef from 'scmpub/scmpub/components/MainOrgRef';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCAffix, NCDiv } = base;
class WholePack extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(PAGEAREA.list);
		this.state = {
			status: UISTATE.browse, //是否是编辑态
			pk_org: { display: '', value: '' } //主组织
		};
		initLang(this, [ '4001wholepack' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	/**
	 * 主组织编辑事件
	 * @param {*} orfRef 
	 */
	mainOrgOnchange(orfRef) {
		this.setState(
			{
				pk_org: {
					display: orfRef.refname,
					value: orfRef.refpk
				}
			},
			() => {
				commonSearch.call(this, this.props);
			}
		);
	}
	// 渲染页面前，执行
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGEAREA.list) || UISTATE.browse;
			if (status == 'edit') {
				return getLangByResId(this, '4008LOCADJUST-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	/**
	 * 增行默认值
	 */
	addRowDefaultValue() {
		let pk_org = this.state.pk_org;
		return {
			pk_org,
			pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
		};
	}
	render() {
		const { editTable, button } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							{/* 国际化处理：整箱定义*/}
							<MainOrgRef
								ref="mainOrg"
								placeholder={getLangByResId(this, '4001WHOLEPACK-000010')} /* 国际化处理： 公司*/
								refCode={FIELDS.pk_org}
								queryGridUrl={'/nccloud/uapbd/org/CorpDefaultTreeRef.do'}
								disabled={this.state.status == UISTATE.edit}
								value={{ refpk: this.state.pk_org.value, refname: this.state.pk_org.display }}
								refName={getLangByResId(this, '4001WHOLEPACK-000010')} /* 国际化处理： 公司*/
								required={true}
								onChange={this.mainOrgOnchange.bind(this)}
								queryCondition={() => {
									return {
										TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
									};
								}}
							/>
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREA.list_head,
								onButtonClick: btnClick.bind(this),
								ignoreHotkeyCode: [ 'Delete' ]
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-table-area">
					{createEditTable(PAGEAREA.list, {
						showCheck: true,
						showIndex: true,
						isAddRow: true,
						addRowDefaultValue: this.addRowDefaultValue.bind(this),
						onBeforeEvent: beforeEvent.bind(this),
						onAfterEvent: afterEvent.bind(this),
						onSelected: buttonController.bind(this, this.props, true),
						onSelectedAll: buttonController.bind(this, this.props, true),
						adaptionHeight: true
						// pkname: FIELDS.pk_cwholepackid
					})}
				</div>
			</div>
		);
	}
}
WholePack = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: {
			[PAGEAREA.list]: 'editTable'
		}
	}
})(WholePack);
export default WholePack;
