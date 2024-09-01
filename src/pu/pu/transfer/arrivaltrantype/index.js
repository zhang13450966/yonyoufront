/*
 * @Author: zhanghrh 
 * @PageInfo: 交易类型管理扩展 适用于 到货单
 * @Date: 2018-07-06 14:17:31 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-01-04 16:48:23
 */

import React, { Component } from 'react';
import { renderForm, getValues } from '../methods';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';
import '../index.less';
let template = [ { itemtype: 'switch', label: '4004transfer-000039', code: 'bneedcheck' } ]; /* 国际化处理： 需要请购安排*/

export default class ArrivaltrantypeExt extends Component {
	constructor() {
		super();
		this.state = {
			fields: {
				bneedcheck: false,
				ts: null
			},
			disabled: {}, // 编辑态下禁用的元素
			status: 'browse' // 页面状态
		};
		this.fields_bak = null; // 备份字段数据
		this.fields_default = JSON.parse(JSON.stringify(this.state.fields)); // 备份字段默认值
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

		// 以下为业务组适配 ，目前stat确定的状态有 add,edit,cancel,browse
		// add edit cancel分别对应动作 新增 修改 取消，请根据动作修改表单的显示状态以及数据
		//    新增状态add，billID 为''：表示需要清空扩展属性的数据
		//    编辑状态edit，billID 为具体值
		//    取消状态cancel，新增后取消，billID 为具体'',编辑后取消billID 为具体值
		// browse 为展示数据,请根据billID 查询数据并展示。
		// 在browse状态下,如billID 为'',表示需要清空扩展属性的数据。例如删除动作后，状态为browse, billID =''
		//    新增保存，修改保存成功后，重新渲染，状态为browse billID 为具体值
		//    单行查询，状态为browse billID 为具体值
		// billID 为交易类型pk_billtypid。初次初始化该扩展属性时，billID 为 Event，已设置为空，清空扩展属性的数据；

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
			url: '/nccloud/pu/arrival/exttranstypequeryaction.do',
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
							bneedcheck: data.bneedcheck,
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
ReactDOM.render(<ArrivaltrantypeExt />, document.querySelector('#transtypebusi'));
