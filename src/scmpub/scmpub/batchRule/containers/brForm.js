/*
 * @Author: huangkewei 
 * @Date: 2018-04-17 10:55:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-26 20:59:50
 */
import React, { Component } from 'react';
import { base, getBusinessInfo } from 'nc-lightapp-front';
import { DateFormate, objLngNum, orderNum, checkKeys, ruleType, defaultChecked } from '../event/config';
import { getStrLen } from './method';
import { showWarningInfo } from '../../pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCSelect, NCFormControl } = base;
const Option = NCSelect.NCOption;

export default class RightForm extends Component {
	constructor() {
		super();
		this.state = {
			isCheck: defaultChecked,
			ruleInfo: {
				vprefix: { value: '' },
				object1: { value: '1' },
				object2: { value: '1' },
				vyear: { value: '' },
				vmonth: { value: '' },
				vday: { value: '' },
				snnum: { value: '0' },
				vsuffix: { value: '' },
				obj1length: { value: '' },
				obj2length: { value: '' },
				snresetflag: { value: '0' },
				ts: { value: '' }
			},
			// 多语
			json: {},
			inlt: null
		};
	}

	componentDidMount() {
		initLang(this, [ '4001batchrule' ], 'scmpub', () => {
			this.forceUpdate();
		});
	}

	componentWillReceiveProps(nextProps) {
		let { ruleInfo } = nextProps;
		let isCheck = Object.assign({}, defaultChecked);
		for (const key in ruleInfo) {
			let condition = '';
			if (checkKeys.includes(key)) {
				if (key == 'snnum') {
					if (ruleInfo[key].value !== '' && ruleInfo[key].value != 0) {
						isCheck[key] = true;
					} else {
						isCheck[key] = false;
					}
				} else {
					if (ruleInfo[key].value) {
						if (ruleInfo[key].value !== condition) {
							isCheck[key] = true;
						} else {
							isCheck[key] = false;
						}
					}
				}
			}
		}
		this.setState({ isCheck, ruleInfo });
	}

	// 设置归零标志
	handleSnresetflag = (val = '') => {
		this.state.ruleInfo.snresetflag.value = val;
		this.setState({ ruleInfo: this.state.ruleInfo });
		this.props.getNewRule('snresetflag', val);
	};

	// 修改复选框状态
	ruleCheckedChange = (key, val) => {
		let { isCheck, ruleInfo } = this.state;
		let { isEdit } = this.props;
		if (!isEdit) {
			return;
		}
		// let date = new Date();
		let busiDate = getBusinessInfo().businessDate; // 获取业务日期
		let date = new Date(busiDate);
		let year = date.getFullYear();
		let m = date.getMonth() + 1;
		let month = m < 10 ? '0' + m : m;
		let d = date.getDate();
		let day = d < 10 ? '0' + d : d;
		switch (key) {
			case 'vprefix':
			case 'vsuffix':
				if (ruleInfo[key].value != '') {
					if (!val) {
						isCheck[key] = false;
						ruleInfo[key].value = '';
						this.props.getNewRule(key, '');
					}
					this.setState({ isCheck, ruleInfo });
				}
				break;
			case 'object1':
			case 'object2':
			case 'snnum':
				let condition = '';
				if (ruleInfo[key].value !== condition) {
					isCheck[key] = val;
					if (!val) {
						// 取消勾选时置为0
						this.props.getNewRule(key, key == 'snnum' ? 0 : '');
					} else {
						if (key == 'object1') {
							this.props.getNewRule('object1', ruleInfo.object1.value);
							this.props.getNewRule('obj1length', ruleInfo.obj1length.value);
						} else if (key == 'object2') {
							this.props.getNewRule('object2', ruleInfo.object2.value);
							this.props.getNewRule('obj2length', ruleInfo.obj2length.value);
						} else {
							this.props.getNewRule('snnum', ruleInfo.snnum.value);
						}
					}
					this.setState({ isCheck });
				}
				break;
			case 'vday':
				if (val) {
					isCheck.vyear = true;
					isCheck.vmonth = true;
					isCheck.vday = true;
					ruleInfo.vmonth.value = month;
					ruleInfo.vyear.value = year;
					ruleInfo.vday.value = day;
					this.props.getNewRule('vmonth', month);
					this.props.getNewRule('vyear', year);
					this.props.getNewRule('vday', day);
				} else {
					isCheck.vday = false;
					ruleInfo.vday.value = '';
					this.props.getNewRule('vday', '');
				}
				this.setState({ isCheck, ruleInfo });
				break;
			case 'vmonth':
				if (!isCheck.vday) {
					if (val) {
						isCheck.vmonth = true;
						isCheck.vyear = true;
						ruleInfo.vmonth.value = month;
						ruleInfo.vyear.value = year;
						this.props.getNewRule('vmonth', month);
						this.props.getNewRule('vyear', year);
					} else {
						isCheck.vmonth = false;
						ruleInfo.vmonth.value = '';
						this.props.getNewRule(key, '');
					}
					this.setState({ isCheck });
				}

				break;
			case 'vyear':
				if (!isCheck.vmonth && !isCheck.vday) {
					if (val) {
						ruleInfo.vyear.value = year;
					} else {
						ruleInfo.vyear.value = '';
					}
					isCheck[key] = val;
					this.setState({ isCheck, ruleInfo });
					this.props.getNewRule(key, val ? year : '');
				}
				break;
			default:
				break;
		}
	};

	// 修改规则内容
	ruleContentChange = (key, val = '') => {
		let { isCheck, ruleInfo } = this.state;
		let { objectOps } = this.props;
		getStrLen();
		switch (key) {
			case 'object1':
			case 'object2':
				if (objectOps[val] && objectOps[val].showNumber == '0') {
					showWarningInfo(
						null,
						getLangByResId(this, '4001BATCHRULE-000000') +
							val +
							getLangByResId(this, '4001BATCHRULE-000001')
					); /* 国际化处理： 业务对象,还未定义长度，不能选择！*/
					break;
				}
				let objLng = key == 'object1' ? 'obj1length' : 'obj2length';
				if (val == '') {
					// 清空select
					isCheck[key] = false;
					ruleInfo[objLng].value = '';
				} else {
					let dataType = objectOps[val].dataType;
					if (dataType == 'Entity') {
						ruleInfo[objLng].value = objectOps[val].showNumber;
					} else {
						if (dataType == 'Date') {
							ruleInfo[objLng].value = 'yy';
						} else if (dataType == 'String') {
							ruleInfo[objLng].value = '1';
						}
					}
					isCheck[key] = true;
				}
				ruleInfo[key].value = val;

				this.props.getNewRule(key, val); // 将新规则传递到父组件
				this.props.getNewRule(objLng, ruleInfo[objLng].value);
				this.setState({ isCheck, ruleInfo });
				break;
			case 'snnum':
			case 'vprefix':
			case 'vsuffix':
				if (key != 'snnum') {
					let len = val.gblen();
					if (len > 8) {
						showWarningInfo(null, getLangByResId(this, '4001BATCHRULE-000002')); /* 国际化处理： 最多输入8个字符！*/
						val = getSubString(val, 8);
					}
				}
				let condition = '';
				// let condition = key == 'snnum' ? 0 : ''
				isCheck[key] = val !== condition ? true : false;
				ruleInfo[key].value = val;
				this.props.getNewRule(key, val); // 将新规则传递到父组件
				this.setState({ isCheck, ruleInfo });
				break;
			case 'obj1length':
			case 'obj2length':
				ruleInfo[key].value = val;
				this.props.getNewRule(key, val); // 将新规则传递到父组件
				this.setState({ ruleInfo });
				break;
			default:
				break;
		}
	};

	// 创建业务对象下拉框
	createBoOptions = () => {
		const { objectOps } = this.props;
		return Object.keys(objectOps).map((item, index) => {
			return (
				<Option key={index} value={item}>
					<span title={item}> {item} </span>
				</Option>
			);
		});
	};

	// 创建业务对象长度下拉框
	createSecSelect = (key) => {
		const { objectOps, isEdit } = this.props;
		let { ruleInfo } = this.state;
		let obj = ruleInfo[key].value;
		let opType = objectOps[obj].dataType;
		if (opType != 'Entity') {
			let defaultValue, ops;
			if (opType == 'Date') {
				defaultValue = 'yy';
				ops = DateFormate.concat([]);
			} else {
				defaultValue = 1;
				ops = objLngNum.concat([]);
			}
			let objLng = key == 'object1' ? 'obj1length' : 'obj2length';
			return (
				<NCSelect
					className="sec-select"
					disabled={!isEdit}
					defaultValue={defaultValue}
					value={ruleInfo[objLng].value}
					onChange={(value) => {
						this.ruleContentChange(objLng, value);
					}}
				>
					{ops.map((item, index) => {
						return (
							<Option key={index} value={item}>
								<span title={item}>{item}</span>
							</Option>
						);
					})}
				</NCSelect>
			);
		}
	};
	// 创建流水号下拉框
	createOrderNumOps = () => {
		return orderNum.map((item, index) => {
			return (
				<Option key={index} value={item}>
					{item}
				</Option>
			);
		});
	};

	widthClass = (val) => {
		let widthClass = '';
		switch (val) {
			case 'snnum':
			case 'vprefix':
			case 'vsuffix':
				widthClass = 'mwidth';
				break;
			case 'object1':
			case 'object2':
				widthClass = 'lwidth';
				break;
			case 'vyear':
			case 'vmonth':
			case 'vday':
				widthClass = 'swidth';
				break;
			default:
				break;
		}
		return widthClass;
	};
	// 判断勾选icon显隐性
	checkIcon = (isEdit, isCheck, item) => {
		let markBaseClasses = 'iconfont icon-shenpitongguo check-mark';
		if (isEdit) {
			return <span className={isCheck[item.value] ? `${markBaseClasses} mark-alive` : markBaseClasses} />;
		} else {
			return isCheck[item.value] ? <span className={markBaseClasses} /> : '';
		}
	};
	// 创建规则类别
	createRuleType = () => {
		let { isCheck } = this.state;
		let { isEdit } = this.props;
		let typeBaseClasses = 'rule-type-title';
		return (
			<ul className="rule-type">
				{ruleType.map((item, index) => {
					let widthClass = this.widthClass(item.value);
					return (
						<li
							fieldid={'ruleName' + index}
							className={
								isEdit && isCheck[item.value] ? (
									`${typeBaseClasses} ${widthClass} alive`
								) : (
									`${typeBaseClasses} ${widthClass}`
								)
							}
							key={index}
							onClick={() => {
								this.ruleCheckedChange(item.value, !isCheck[item.value]);
							}}
						>
							{getLangByResId(this, item.label)}
							{this.checkIcon(isEdit, isCheck, item)}
						</li>
					);
				})}
			</ul>
		);
	};

	// 计算规则和规则显示
	ruleResult = () => {
		const snnum = '0000000001';
		let { isCheck, ruleInfo } = this.state;
		let rule = '',
			display = '';
		for (let key in isCheck) {
			switch (key) {
				case 'vprefix':
				case 'vyear':
				case 'vmonth':
				case 'vday':
				case 'vsuffix':
					let unit = '/';
					if (key == 'vyear') {
						unit = getLangByResId(this, '4001BATCHRULE-000003') + unit; /* 国际化处理： 年*/
					} else if (key == 'vmonth') {
						unit = getLangByResId(this, '4001BATCHRULE-000004') + unit; /* 国际化处理： 月*/
					} else if (key == 'vday') {
						unit = getLangByResId(this, '4001BATCHRULE-000005') + unit; /* 国际化处理： 日*/
					} else if (key == 'vsuffix') {
						unit = '';
					}
					rule += isCheck[key] && ruleInfo[key].value ? ruleInfo[key].value + unit : '';
					display += isCheck[key] ? ruleInfo[key].value || '' : '';
					break;
				case 'snnum':
					rule += isCheck[key] ? snnum.substr(10 - ruleInfo[key].value) + '/' : '';
					display += isCheck[key] ? snnum.substr(10 - ruleInfo[key].value) : '';
					break;
				case 'object1':
				case 'object2':
					let objLng = key == 'object1' ? 'obj1length' : 'obj2length';
					rule += isCheck[key] && ruleInfo[key].value ? ruleInfo[key].value + '/' : '';
					display += isCheck[key] ? this.objectRule(key, ruleInfo[objLng].value) : '';
					break;
				default:
					break;
			}
		}
		return { rule, display };
	};

	// 业务对象的显示规则
	objectRule = (obj, length) => {
		let mark = obj == 'object1' ? '*' : '#';
		let result = '';
		if (DateFormate.includes(length)) {
			result = length.replace(/[a-z]/g, mark);
		} else {
			for (let index = 0; index < length; index++) {
				result += mark;
			}
		}
		return result;
	};
	render() {
		let { isEdit, objectOps } = this.props;
		let { ruleInfo } = this.state;
		let { snresetflag, vprefix, object1, object2, snnum, vsuffix } = ruleInfo;
		let snval = '0';
		if (snresetflag && snresetflag.value) {
			snval = snresetflag.value;
		}
		return (
			<div>
				<div fieldid="zero_sign" className="zero-box">
					<p className="rule-title nc-theme-common-font-c">
						{getLangByResId(this, '4001BATCHRULE-000006') /* 国际化处理： 归零标志*/}
					</p>
					<NCSelect
						fieldid="zero_sign_select"
						value={snval}
						disabled={!isEdit}
						onChange={(value) => {
							this.handleSnresetflag(value);
						}}
						className="zero-mark"
					>
						<Option value="0">{getLangByResId(this, '4001BATCHRULE-000007') /* 国际化处理： 不归零*/}</Option>
						<Option value="1">{getLangByResId(this, '4001BATCHRULE-000003') /* 国际化处理： 年*/}</Option>
						<Option value="2">{getLangByResId(this, '4001BATCHRULE-000004') /* 国际化处理： 月*/}</Option>
						<Option value="3">{getLangByResId(this, '4001BATCHRULE-000005') /* 国际化处理： 日*/}</Option>
					</NCSelect>
				</div>
				<div fieldid="rule_define" style={{ paddingTop: '22px' }}>
					<p className="rule-title nc-theme-common-font-c">
						{getLangByResId(this, '4001BATCHRULE-000008') /* 国际化处理： 规则定义*/}
					</p>
					{this.createRuleType()}
				</div>
				<div fieldid="select_option" className="rule-container">
					<span className="rule-content-box mwidth">
						<NCFormControl
							fieldid="prefix"
							disabled={!isEdit}
							value={vprefix && vprefix.value}
							onChange={(value) => this.ruleContentChange('vprefix', value)}
						/>
					</span>
					{/* 业务对象1 */}
					<span className="rule-content-box lwidth">
						<NCSelect
							fieldid="businessObject1"
							value={object1 && object1.value}
							disabled={!isEdit}
							onChange={(value) => this.ruleContentChange('object1', value)}
						>
							{this.createBoOptions()}
						</NCSelect>
						{object1 && objectOps[object1.value] && objectOps[object1.value].dataType != 'Entity' ? (
							this.createSecSelect('object1')
						) : (
							''
						)}
					</span>
					{/* 业务对象2 */}
					<span className="rule-content-box lwidth ">
						<NCSelect
							fieldid="businessObject2"
							value={object2 && object2.value}
							disabled={!isEdit}
							onChange={(value) => this.ruleContentChange('object2', value)}
						>
							{this.createBoOptions()}
						</NCSelect>
						{object2 && objectOps[object2.value] && objectOps[object2.value].dataType != 'Entity' ? (
							this.createSecSelect('object2')
						) : (
							''
						)}
					</span>
					{/* 年 */}
					<span fieldid="year" className="rule-content-box swidth" />
					<span fieldid="month" className="rule-content-box swidth" />
					<span fieldid="day" className="rule-content-box swidth" />
					{/* 流水号 */}
					<span className="rule-content-box mwidth">
						<NCSelect
							fieldid="serialNum"
							value={snnum && snnum.value}
							defaultValue={'0'}
							disabled={!isEdit}
							onChange={(value) => this.ruleContentChange('snnum', value)}
						>
							{this.createOrderNumOps()}
						</NCSelect>
					</span>
					<span className="rule-content-box mwidth">
						<NCFormControl
							fieldid="vsuffix"
							disabled={!isEdit}
							value={vsuffix && vsuffix.value}
							onChange={(value) => this.ruleContentChange('vsuffix', value)}
						/>
					</span>
				</div>

				<div fieldid="apply_result" className="rule-display rule-res-box">
					<p className="rule-title nc-theme-common-font-c">
						{getLangByResId(this, '4001BATCHRULE-000009') /* 国际化处理： 应用效果*/}
					</p>
					<p className="rule-res nc-theme-common-font-c">{this.ruleResult().rule}</p>
				</div>
				<div fieldid="show_mean" className="rule-display">
					<p className="rule-title nc-theme-common-font-c">
						{getLangByResId(this, '4001BATCHRULE-000010') /* 国际化处理： 表示*/}
					</p>
					<p className="res-display nc-theme-common-font-c">{this.ruleResult().display}</p>
				</div>
			</div>
		);
	}
}

/** 
 * 截取字符串
 * @param val 字符串
 * @param len 需要截取的字符串长度
 * @说明：在JS里一个汉字代表1个字符
*/
function getSubString(val, len) {
	let arr = val.split(''),
		res = '',
		length = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].charCodeAt(0) > 127) {
			length += 2;
		} else {
			length++;
		}
		if (length <= len) {
			res += arr[i];
		} else {
			break;
		}
	}
	return res;
	//return val.slice(0, len).replace(/([^x00-xff])/g, '$1a').slice(0, len).replace(/([^x00-xff])a/g, '$1')
}
