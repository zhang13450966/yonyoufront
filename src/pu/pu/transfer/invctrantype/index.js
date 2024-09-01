/*
 * @Author: hufei 
 * @PageInfo: 交易类型管理扩展 适用于 采购发票
 * @Date: 2018-07-06 14:17:47 
 * @Last Modified by: hufei
 * @Last Modified time: 2018-12-26 15:57:24
 */

import React, { Component } from 'react';
import { renderForm, getValues } from '../methods';
import { ajax } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import '../index.less';
let template = [
	{
		itemtype: 'select',
		label: '4004transfer-000001' /* 国际化处理： 传应付控制*/,
		code: 'itoarapmode',
		options: [
			{ label: '4004transfer-000002', value: '0' },
			{ label: '4004transfer-000003', value: '1' }
		] /* 国际化处理： 入库匹配,不控制*/
	},
	{
		itemtype: 'switch',
		label: '4004transfer-000004',
		code: 'bcheckquality'
	} /* 国际化处理： 质量合格检查*/,
	{ itemtype: 'switch', label: '4004transfer-000005', code: 'bconsumepur' } /* 国际化处理： 消耗性采购*/,
	{ itemtype: 'switch', label: '4004transfer-000006', code: 'bsendpay' } /* 国际化处理： 结算完毕自动传应付*/,
	{ itemtype: 'switch', label: '4004transfer-000007', code: 'bajust' } /* 国际化处理： 调整发票*/
];

export default class InvctrantypeExt extends Component {
	constructor() {
		super();
		this.state = {
			fields: {
				itoarapmode: { label: getLangByResId(this, '4004transfer-000002'), value: '0' } /* 国际化处理： 入库匹配*/,
				bcheckquality: false,
				bconsumepur: false,
				bsendpay: false,
				bajust: false,
				ts: null
			},
			disabled: {
				bcheckquality: false,
				bconsumepur: true
			}, // 编辑态下禁用的元素
			status: 'browse' // 页面状态
		};
		this.fields_bak = null; // 备份字段数据
		this.fields_default = JSON.parse(JSON.stringify(this.state.fields)); // 备份字段默认值
		initLang(this, [ '4004transfer' ], 'pu', () => {
			this.fields_default.itoarapmode.label = getLangByResId(this, '4004transfer-000002');
			this.setState({
				fields: {
					...this.state.fields,
					itoarapmode: { label: getLangByResId(this, '4004transfer-000002'), value: '0' }
				}
			});
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
			console.log(this.state.fields, 'fields');
			console.log(this.fields_default, 'default');
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
			url: '/nccloud/pu/puinvoice/exttranstypequeryaction.do',
			data: {
				pk_billtypeid: billID,
				ts: this.state.fields.ts
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					// 请求成功,根据请求结果设置state中的值
					Object.keys(this.state.fields).forEach((item) => {
						if (data[item] !== undefined) {
							console.log('111before', this.state.fields);
							if (item === 'itoarapmode') {
								let options = [
									{ label: getLangByResId(this, '4004transfer-000002'), value: '0' },
									{ label: getLangByResId(this, '4004transfer-000003'), value: '1' }
								]; /* 国际化处理： 入库匹配,不控制*/
								let option = options.find((opt) => opt.value == data[item]);
								console.log('111center', option);
								if (option) this.state.fields[item] = option;
							} else {
								this.state.fields[item] = data[item];
							}
						}
					});
					this.setState({
						fields: this.state.fields,
						ts: data.ts
					});
					console.log('111after', this.state.fields);
				} else {
					// 请求不成功,state置为默认值
					this.recoveryState('fields_default');
				}
			}
		});
	};

	// 下拉改变后的回调
	selectChangeFn = (code, opt) => {
		if (code == 'itoarapmode') {
			if (opt.value === '0') {
				this.setState({
					disabled: {
						...this.state.disabled,
						bconsumepur: true,
						bcheckquality: false
					},
					fields: {
						...this.state.fields,
						bconsumepur: false,
						bcheckquality: false
					}
				});
			} else {
				if (opt.value === '1') {
					this.setState({
						disabled: {
							...this.state.disabled,
							bconsumepur: false,
							bcheckquality: true
						},
						fields: {
							...this.state.fields,
							bconsumepur: false,
							bcheckquality: false
						}
					});
				}
			}
		}
	};

	// 开关改变后的回调
	switchChangeFn = (code, value) => {
		if (this.state.fields.itoarapmode.value !== '0') {
			if (code == 'bsendpay') {
				this.setState({
					fields: {
						...this.state.fields,
						bconsumepur: false
					}
				});
			} else if (code == 'bconsumepur') {
				this.setState({
					fields: {
						...this.state.fields,
						bsendpay: false
					}
				});
			}
		}
	};
	render() {
		return (
			<div className="scm-transtype-wrap">
				{renderForm.call(this, template, this.switchChangeFn, this.selectChangeFn)}
			</div>
		);
	}
}
/*********渲染位置#transtypebusi是固定的************************ */
ReactDOM.render(<InvctrantypeExt />, document.querySelector('#transtypebusi'));
