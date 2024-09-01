/*
 * @Author: yechd5
 * @PageInfo: 计划岗物料设置页面
 * @Date: 2018-05-10 09:29:49
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-12 21:21:34
 */
import { Component } from 'react';
import { initTemplate } from './init';
import { onButtonClicks } from './btnClicks';
import { searchById } from './btnClicks/commonSearch_BtnClick';
import downOperate_buttonClick from '../list/btnClicks/downBtnClicks/operate_buttonClick';
import { headButtonController, bodyButtonController } from './viewController/rowButtonController';

import { afterEvent, beforeEvent, mainOrgAfterEvent, head_beforeEvent } from './events';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { POSITION_CONST } from '../const';
import { createVerticalEditTableWithOrgPanel } from 'scmpub/scmpub/components/VerticalEditTable';

export default class Position extends Component {
	constructor(props) {
		super(props);
		props.use.cardTable(POSITION_CONST.UPTABLEID);
		props.use.cardTable(POSITION_CONST.DOWNTABLEID);
		this.props = props;
		//主组织参照是否可用编辑
		this.state = { mainOrgDisabled: false };
		this.mainorgvalue = { refpk: null, refname: null };
	}

	// 关闭浏览器提示
	componentWillMount() {
		let path = [ '4004position' ];
		let extPath = this.getResPath();
		if (extPath) {
			path.concat(extPath);
		}
		// 适配多语
		initLang(this, path, 'pu', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(POSITION_CONST.UPTABLEID);
			if (status == POSITION_CONST.EDIT_STATUS) {
				return getLangByResId(this, '4004POSITION-000014'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	getResPath = () => {};

	getMainOrgConfig = () => {
		return {};
	};

	getAppname = () => {
		return;
	};

	// 主渲染方法
	render() {
		// 主组织配置
		let mainOrgConfig = this.getMainOrgConfig();
		mainOrgConfig.disabled = this.state.mainOrgDisabled;
		mainOrgConfig.onChange = mainOrgAfterEvent.bind(this);
		mainOrgConfig.value = this.mainorgvalue;
		mainOrgConfig.required = true;
		mainOrgConfig.queryCondition = () => {
			return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
		};
		// 页面配置
		let pageConfig = {
			btnArea: POSITION_CONST.BTNAREA,
			appname: this.getAppname(),
			isShowIcon: true,
			mainOrgConfig: mainOrgConfig,
			onBtnClick: onButtonClicks.bind(this),
			pk_head_field: 'pk_position',
			pk_body_field: 'pk_position_b'
		};
		// 上部表格配置
		let upAreaConfig = {
			tableId: POSITION_CONST.UPTABLEID,
			onRowClick: searchById.bind(this),
			showCheck: true,
			onBeforeEvent: head_beforeEvent.bind(this),
			onSelected: headButtonController.bind(this),
			onSelectedAll: headButtonController.bind(this)
		};
		// 下部表格配置
		let downAreaConfig = {
			tableId: POSITION_CONST.DOWNTABLEID,
			btnArea: POSITION_CONST.DOWNBTNAREA,
			adaptionHeight: true,
			showCheck: true,
			onBeforeEvent: beforeEvent.bind(this),
			onBtnClick: downOperate_buttonClick.bind(this),
			onAfterEvent: afterEvent.bind(this),
			onSelected: bodyButtonController.bind(this),
			onSelectedAll: bodyButtonController.bind(this)
		};
		return createVerticalEditTableWithOrgPanel.call(this, pageConfig, upAreaConfig, downAreaConfig);
	}
}
