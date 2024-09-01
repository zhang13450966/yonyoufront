/*
 * @Author: hufei
 * @PageInfo: SCM03（传金税的数据合并原则-集团级参数） 参数面板
 * @Date: 2018-07-24 16:07:45
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-03-28 11:18:17
 */

/**
 * 规则
 * 单选：
 * 不合并 0
 * 按存货合并	1
 * 按存货类合并	2
 * 组合：
 * 不合并 不能勾复选
 * 按存货合并 按价格合并 5
 * 按存货合并 销售发票是否多单合并 9
 * 按存货合并 按价格合并 销售发票是否多单合并 13
 * 按存货类合并 按价格合并 6
 * 按存货类合并 销售发票是否多单合并 10
 * 按存货类合并 按价格合并 销售发票是否多单合并 14
 */
import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
let { NCRadio: Radio, NCCheckbox: Checkbox } = base;
let { NCRadioGroup: RadioGroup } = Radio;
import './index.less';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data || {};
		let radioVal = '0',
			checkVal1 = false,
			checkVal2 = false;
		// 传过来的props.data.sysinitvo.value 是个字符串数字，代表的含义见上面的规则
		if (this.data.sysinitvo && this.data.sysinitvo.value) {
			switch (this.data.sysinitvo.value) {
				case '0':
				case '1':
				case '2':
					radioVal = this.data.sysinitvo.value;
					break;
				case '5':
					radioVal = '1';
					checkVal1 = true;
					checkVal2 = false;
					break;
				case '6':
					radioVal = '2';
					checkVal1 = true;
					checkVal2 = false;
					break;
				case '9':
					radioVal = '1';
					checkVal1 = false;
					checkVal2 = true;
					break;
				case '10':
					radioVal = '2';
					checkVal1 = false;
					checkVal2 = true;
					break;
				case '13':
					radioVal = '1';
					checkVal1 = true;
					checkVal2 = true;
					break;
				case '14':
					radioVal = '2';
					checkVal1 = true;
					checkVal2 = true;
					break;
				default:
					break;
			}
		}
		this.state = {
			radioVal,
			checkVal1,
			checkVal2,
			// 多语
			json: {},
			inlt: null
		};
	}
	componentDidMount() {
		this.props.modal.show('param-panel');
		initLang(this, [ '4001busiparam' ], 'scmpub', () => {
			this.setState(this.state);
		});
	}

	//  确定按钮按上面的规则将勾选状态转换成数字，传递给父组件
	sureBtnClick = () => {
		if (this.data.sysinitvo) {
			let value,
				{ radioVal, checkVal1, checkVal2 } = this.state;
			if (radioVal === '0') {
				value = '0';
			} else if (radioVal === '1') {
				if (!checkVal1 && !checkVal2) {
					value = '1';
				} else if (checkVal1 && !checkVal2) {
					value = '5';
				} else if (!checkVal1 && checkVal2) {
					value = '9';
				} else if (checkVal1 && checkVal2) {
					value = '13';
				}
			} else if (radioVal === '2') {
				if (!checkVal1 && !checkVal2) {
					value = '2';
				} else if (checkVal1 && !checkVal2) {
					value = '6';
				} else if (!checkVal1 && checkVal2) {
					value = '10';
				} else if (checkVal1 && checkVal2) {
					value = '14';
				}
			}
			this.data.sysinitvo.value = value;
			this.props.valueChange && this.props.valueChange(this.data);
		}
	};

	// 关闭模态框需要调用 props.valueChange ,传递原来旧的数据即可
	closeModal = () => {
		this.props.valueChange && this.props.valueChange(this.data);
	};

	raidoChange = (value) => {
		if (value === '0') {
			this.setState({ checkVal1: false, checkVal2: false });
		}
		this.setState({ radioVal: value });
	};

	render() {
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			width: '600px',
			height: '240px',
			title: getLangByResId(this, '4001BUSIPARAM-000000') /* 国际化处理： 动态参数设置*/,
			// <div className="param-panel-form">
			content: (
				<div className="scm-param-scm03">
					<div className="title">
						{getLangByResId(this, '4001BUSIPARAM-000001') /* 国际化处理：
							传金税数据合并规则*/}
					</div>
					<RadioGroup
						selectedValue={this.state.radioVal}
						onChange={this.raidoChange}
						className="scm-param-scm03-radiogroup"
					>
						<Radio value="0" className="scm-param-scm03-radio">
							<span className="ref-label  nc-theme-common-font-c">
								{getLangByResId(this, '4001BUSIPARAM-000002') /* 国际化处理： 不合并*/}
							</span>
						</Radio>
						<Radio value="1" className="scm-param-scm03-radio">
							<span className="ref-label  nc-theme-common-font-c">
								{getLangByResId(this, '4001BUSIPARAM-000003') /* 国际化处理： 按存货合并*/}
							</span>
						</Radio>
						<Radio value="2" className="scm-param-scm03-radio">
							<span className="ref-label  nc-theme-common-font-c">
								{getLangByResId(this, '4001BUSIPARAM-000004') /* 国际化处理： 按存货类合并*/}
							</span>
						</Radio>
					</RadioGroup>
					<Checkbox
						className="scm-param-scm03-checkbox"
						checked={this.state.checkVal1}
						disabled={this.state.radioVal === '0'}
						onChange={() => this.setState({ checkVal1: !this.state.checkVal1 })}
					>
						{/* <span className="ref-label  nc-theme-common-font-c"> */}
						{getLangByResId(this, '4001BUSIPARAM-000005') /* 国际化处理： 按价格合并*/}
						{/* </span> */}
					</Checkbox>
					<Checkbox
						className="scm-param-scm03-checkbox"
						checked={this.state.checkVal2}
						disabled={this.state.radioVal === '0'}
						onChange={() => this.setState({ checkVal2: !this.state.checkVal2 })}
					>
						<span className="ref-label  nc-theme-common-font-c">
							{getLangByResId(this, '4001BUSIPARAM-000006') /* 国际化处理： 销售发票是否多单合并*/}
						</span>
					</Checkbox>
				</div>
			),
			beSureBtnClick: () => this.sureBtnClick(this.props.editMode == 'edit'), //点击确定按钮事件
			cancelBtnClick: () => this.closeModal(false), //取消按钮事件回调
			closeModalEve: () => this.closeModal(false), //关闭按钮事件回调
			disableLeftBtn: this.props.editMode !== 'edit',
			userControl: true
		});
	}
}

export default createPage({})(ParamPanel);
