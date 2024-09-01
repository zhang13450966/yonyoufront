/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，交易类型面板
 * @Date: 2021-11-18 20:41:02 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-01-19 18:29:04
 */
import React, { Component } from 'react';
import { renderForm, getValues } from '../methods';
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';

let template = [ { itemtype: 'switch', label: '4004transfer-000040', code: 'bautoest' } ]; /* 国际化处理： 服务类物料审批通过自动暂估应付*/

export default class PlanConfirmtrantype extends Component {
	constructor() {
		super();
		this.state = {
			fields: {
				bautoest: false,
				ts: null
			},
			disabled: {}, // 编辑态下禁用的元素
			status: 'browse' // 页面状态
		};
		this.fields_bak = null; // 备份字段数据
		this.fields_default = JSON.parse(JSON.stringify(this.state.fields)); // 备份字段默认值
		// 初始化多语
		initLang(this, [ '4004transfer' ], 'pu', () => {
			this.setState(this.state);
		});
	}
	componentDidMount() {
		let dom = document.getElementById('extInfo');
		if (dom.onclick != null) {
			dom.onclick(this.showData);
		}
		if (dom.method != null) {
			dom.method(() => getValues(this.state.fields));
		}
	}
	setExtendPaneStat() {
		let extendStat = document.getElementById('extInfo').getAttribute('extendStat');
		return extendStat;
	}
	//请求列表数据
	showData = (billID) => {
		let stat = this.setExtendPaneStat();
		if (billID instanceof Event) {
			billID = '';
		}

		if (stat === 'add') {
			// 新增,置为可编辑态,值为默认值
			this.recoveryState('fields_default');
			this.setState({ status: 'add' });
		} else if (stat === 'edit') {
			// 修改,置为可编辑态,值为billID对应的值
			this.backupState();
			this.setState({ status: 'edit' });
		} else if (stat === 'cancel') {
			// 取消,置位浏览态,新增取消置为默认值,编辑取消置为编辑前的值
			if (this.state.status === 'add') {
				this.recoveryState('fields_default');
			} else if (this.state.status === 'edit') {
				this.recoveryState('fields_bak');
			}
			this.setState({ status: 'browse' });
		} else if (stat === 'browse') {
			// 浏览,置为浏览态,值为根据billID请求回来的值
			// 请求数据
			this.setState({ status: 'browse' });
			this.queryData(billID);
		}
	};
	// 恢复state到编辑前的值
	recoveryState = (source) => {
		this.setState({
			fields: JSON.parse(JSON.stringify(this[source]))
		});
	};

	// 备份state
	backupState = () => {
		this.fields_bak = JSON.parse(JSON.stringify(this.state.fields));
	};

	// 查询事件
	queryData = (billID) => {
		// 浏览,置为浏览态,值为根据billID请求回来的值
		// 请求数据
		if (!billID) return;
		ajax({
			url: '/nccloud/pu/planconfirm/exttranstypequeryaction.do',
			data: {
				pk_billtypeid: billID,
				ts: this.state.fields.ts
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					// 请求成功,根据请求结果设置state中的值
					this.setState({
						fields: {
							bautoest: data.bautoest,
							ts: data.ts
						}
					});
				} else {
					// 请求不成功,state置为默认值
					this.recoveryState('fields_default');
				}
			}
		});
	};
	render() {
		return <div className="scm-transtype-wrap">{renderForm.call(this, template)}</div>;
	}
}

/*********渲染位置#transtypebusi是固定的************************ */
ReactDOM.render(<PlanConfirmtrantype />, document.querySelector('#transtypebusi'));
