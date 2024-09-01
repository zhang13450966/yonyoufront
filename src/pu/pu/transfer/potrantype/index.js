/*
 * @Author: hufei
 * @PageInfo: 交易类型管理扩展 适用于 采购订单
 * @Date: 2018-07-06 14:18:03
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-25 13:39:29
 */

import React, { Component } from 'react';
import { renderPotrantypeForm, getValues } from '../methods';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
import '../index.less';
let leftTemplate = [
	{ itemtype: 'checkbox', label: '4004transfer-000011', code: 'bvmi' } /* 国际化处理： 是否供应商寄存*/,
	{ itemtype: 'checkbox', label: '4004transfer-000012', code: 'bdirect' } /* 国际化处理： 是否采购直运*/,
	{ itemtype: 'checkbox', label: '4004transfer-000041', code: 'bismilepost' } /* 国际化处理： 里程碑采购*/,
	{
		itemtype: 'checkbox',
		label: '4004transfer-000042',
		code: 'bplanconfirm',
		parentCode: 'bismilepost'
	} /* 国际化处理： 里程碑逐级确认*/,
	{
		itemtype: 'checkbox',
		label: '4004transfer-000013',
		code: 'bcheckcenpur'
	} /* 国际化处理： 采购订单是否检查采购业务委托关系*/,
	{ itemtype: 'checkbox', label: '4004transfer-000014', code: 'boverpay' } /* 国际化处理： 允许超订单付款*/,
	{ itemtype: 'number', label: '4004transfer-000043', code: 'noverpay', parentCode: 'boverpay' } /* 国际化处理： 超付款容差（%）*/,
	{
		itemtype: 'select',
		label: '4004transfer-000015' /* 国际化处理： 请购单生成订单限制方式*/,
		code: 'iprtopolimit',
		options: [
			{ label: '4004transfer-000016', value: '0' },
			{ label: '4004transfer-000017', value: '1' },
			{ label: '4004transfer-000018', value: '2' }
		] /* 国际化处理： 不限制,存在有效供应商价格才能生成,经过价格审批才能生成*/
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000019',
		code: 'breceiveplan'
	} /* 国际化处理： 是否进行到货计划安排*/,
	{
		itemtype: 'select',
		label: '4004transfer-000020' /* 国际化处理： 在途开始*/,
		code: 'ionwaybegin',
		options: [
			{ label: '4004transfer-000021', value: '0' } /* 国际化处理： 审批*/
			//  0 = 审批，1 = 输出，2 = 确认，3 = 发货，4 = 装运，5 = 报关，6 = 出关，7 = 到货，8 = 入库
		]
	},
	{
		itemtype: 'select',
		label: '4004transfer-000022' /* 国际化处理： 在途结束*/,
		code: 'ionwayend',
		options: [ { label: '', value: null } ]
	}
];

let rightTemplate = [
	{
		itemtype: 'checkbox',
		label: '4004transfer-000023',
		code: 'boutput',
		option: { label: '4004transfer-000023', value: '1' }
	} /* 国际化处理： 输出,输出*/,
	{
		itemtype: 'checkbox',
		label: '4004transfer-000024' /* 国际化处理： 对方确认*/,
		code: 'bconfirm',
		option: { label: '4004transfer-000025', value: '2' } /* 国际化处理： 确认*/,
		children: [
			{
				itemtype: 'checkbox',
				label: '4004transfer-000026',
				code: 'bconfirmcode',
				parentCode: 'bconfirm'
			} /* 国际化处理： 单据号*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000027',
				code: 'bconfirmdate',
				parentCode: 'bconfirm'
			} /* 国际化处理： 单据日期*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000028',
				code: 'bconfirmnum',
				parentCode: 'bconfirm'
			} /* 国际化处理： 是否数量*/
		]
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000029' /* 国际化处理： 发货通知*/,
		code: 'bconsign',
		option: { label: '4004transfer-000030', value: '3' } /* 国际化处理： 发货*/,
		children: [
			{
				itemtype: 'checkbox',
				label: '4004transfer-000026',
				code: 'bconsigncode',
				parentCode: 'bconsign'
			} /* 国际化处理： 单据号*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000027',
				code: 'bconsigndate',
				parentCode: 'bconsign'
			} /* 国际化处理： 单据日期*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000028',
				code: 'bconsignnum',
				parentCode: 'bconsign'
			} /* 国际化处理： 是否数量*/
		]
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000031' /* 国际化处理： 装运通知*/,
		option: { label: '4004transfer-000032', value: '4' } /* 国际化处理： 装运*/,
		code: 'bload',
		children: [
			{
				itemtype: 'checkbox',
				label: '4004transfer-000026',
				code: 'bloadcode',
				parentCode: 'bload'
			} /* 国际化处理： 单据号*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000027',
				code: 'bloaddate',
				parentCode: 'bload'
			} /* 国际化处理： 单据日期*/
		]
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000033' /* 国际化处理： 报关*/,
		code: 'bcustom',
		option: { label: '4004transfer-000033', value: '5' } /* 国际化处理： 报关*/,
		children: [
			{
				itemtype: 'checkbox',
				label: '4004transfer-000026',
				code: 'bcustomcode',
				parentCode: 'bcustom'
			} /* 国际化处理： 单据号*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000027',
				code: 'bcustomdate',
				parentCode: 'bcustom'
			} /* 国际化处理： 单据日期*/
		]
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000034' /* 国际化处理： 出关*/,
		code: 'boutcustom',
		option: { label: '4004transfer-000034', value: '6' } /* 国际化处理： 出关*/,
		children: [
			{
				itemtype: 'checkbox',
				label: '4004transfer-000026',
				code: 'boutcustomcode',
				parentCode: 'boutcustom'
			} /* 国际化处理： 单据号*/,
			{
				itemtype: 'checkbox',
				label: '4004transfer-000027',
				code: 'boutcustomdate',
				parentCode: 'boutcustom'
			} /* 国际化处理： 单据日期*/
		]
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000035' /* 国际化处理： 到货*/,
		code: 'barrive',
		option: { label: '4004transfer-000035', value: '7' } /* 国际化处理： 到货*/
	},
	{
		itemtype: 'checkbox',
		label: '4004transfer-000036' /* 国际化处理： 入库*/,
		code: 'bstore',
		option: { label: '4004transfer-000036', value: '8' }
	} /* 国际化处理： 入库*/
];

function deepClone(data) {
	return JSON.parse(JSON.stringify(data));
}
export default class PotrantypeExt extends Component {
	constructor() {
		super();
		this.state = {
			fields: {
				bvmi: false,
				bdirect: false,
				bismilepost: false,
				bplanconfirm: false,
				bcheckcenpur: false,
				boverpay: false,
				noverpay: null,
				iprtopolimit: { label: getLangByResId(this, '4004transfer-000016'), value: '0' } /* 国际化处理： 不限制*/,
				breceiveplan: false,
				ionwaybegin: { label: getLangByResId(this, '4004transfer-000021'), value: '0' }, // 在途开始,/* 国际化处理： 审批*/
				ionwayend: { label: '', value: null }, // 在途结束
				boutput: false, // 输出
				bconfirm: false, // 对方确认
				bconfirmcode: false,
				bconfirmdate: false,
				bconfirmnum: false,
				bconsign: false, // 发货通知
				bconsigncode: false,
				bconsigndate: false,
				bconsignnum: false,
				bload: false, // 装运通知
				bloadcode: false,
				bloaddate: false,
				bcustom: false, // 报关
				bcustomcode: false,
				bcustomdate: false,
				boutcustom: false, // 出关
				boutcustomcode: false,
				boutcustomdate: false,
				bstore: false, //入库
				barrive: false, // 到货
				ts: null,
				pk_potrantype: null
			},
			disabled: {}, // 编辑态下禁用的元素
			status: 'browse' // 页面状态
		};
		this.fields_bak = null; // 备份字段数据
		this.fields_default = deepClone(this.state.fields); // 备份字段默认值
		this.ionwaybegin_options = null; // 备份在途开始下拉列表
		this.ionwayend_options = null; // 备份在途结束下拉列表
		initLang(this, [ '4004transfer' ], 'pu', () => {
			this.fields_default.iprtopolimit.label = getLangByResId(this, '4004transfer-000016') /* 国际化处理： 不限制*/;
			this.fields_default.ionwaybegin.label = getLangByResId(this, '4004transfer-000021'); // 在途开始,/* 国际化处理： 审批*/
			this.setState({
				fields: {
					...this.state.fields,
					iprtopolimit: {
						label: getLangByResId(this, '4004transfer-000016'),
						value: '0'
					} /* 国际化处理： 不限制*/,
					ionwaybegin: { label: getLangByResId(this, '4004transfer-000021'), value: '0' } // 在途开始,/* 国际化处理： 审批*/
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
		this.queryData();
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
		let confirmmodel = 'Y';
		if (stat === 'add') {
			// 新增,置为可编辑态,值为默认值
			this.recoveryState('fields_default');
			this.setState({ status: 'add' });

			if (!this.state.fields.bstore && !this.state.fields.barrive) {
				//入库// 到货都为否则校验
				confirmmodel = 'Y';
			} else {
				confirmmodel = 'N';
			}
			// 校验
			document.getElementById('extInfo').setAttribute('confirmmodel', confirmmodel); //是否弹出确认对话框，Y 弹出 N不弹出
			document.getElementById('extInfo').setAttribute('confirmtips', getLangByResId(this, '4004transfer-000038')); //是否弹出确认对话框消息内容 未设置到货或入库状态，此交易上的订单将无法到货或入库，是否继续？
		} else if (stat === 'edit') {
			// 修改,置为可编辑态,值为billID对应的值
			this.backupState();
			this.backupOptions();
			this.setState({ status: 'edit' });
			// 校验
			if (!this.state.fields.bstore && !this.state.fields.barrive) {
				//入库// 到货都为否则校验
				confirmmodel = 'Y';
			} else {
				confirmmodel = 'N';
			}
			// 校验
			document.getElementById('extInfo').setAttribute('confirmmodel', confirmmodel); //是否弹出确认对话框，Y 弹出 N不弹出
			document.getElementById('extInfo').setAttribute('confirmtips', getLangByResId(this, '4004transfer-000038')); //是否弹出确认对话框消息内容 未设置到货或入库状态，此交易上的订单将无法到货或入库，是否继续？
		} else if (stat === 'cancel') {
			// 取消,置位浏览态,新增取消置为默认值,编辑取消置为编辑前的值,还需要把在途开始和在途结束下拉中的选项列表置为之前的值或者默认值
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
		if (source == 'fields_default') {
			leftTemplate[9].options = [ { label: '4004transfer-000021', value: '0' } /* 国际化处理： 审批*/ ];
			leftTemplate[10].options = [ { label: '', value: null } ];
		} else if (source == 'fields_bak') {
			leftTemplate[9].options = deepClone(this.ionwaybegin_options);
			leftTemplate[10].options = deepClone(this.ionwayend_options);
		}
		this.setState({
			fields: deepClone(this[source])
		});
	};

	// 备份state
	backupState = () => {
		this.fields_bak = deepClone(this.state.fields);
	};

	// 备份在途开始和在途结算的下拉，供点击取消时恢复用
	backupOptions = () => {
		this.ionwaybegin_options = deepClone(leftTemplate[9].options);
		this.ionwayend_options = deepClone(leftTemplate[10].options);
	};

	// 查询事件
	queryData = (billID) => {
		// 浏览,置为浏览态,值为根据billID请求回来的值
		// 请求数据
		if (!billID) return;
		ajax({
			url: '/nccloud/pu/poorder/exttranstypequeryaction.do',
			data: {
				pk_billtypeid: billID
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					// 根据请求结果先把已勾选项填到下拉的选项中,并移除下拉中的未勾选项
					let checks = [
						'boutput',
						'bconfirm',
						'bconsign',
						'bload',
						'bcustom',
						'boutcustom',
						'bstore',
						'barrive'
					];
					checks.forEach((item) => {
						this.checkChangeFn(item, data[item]);
					});
					// 请求成功,根据请求结果设置state中的值
					// 先置为false，这两个字段是后加的，2207预置的交易类型这两个字段没有值，所以后台数据不会传回来，因此不会渲染  begin
					// 这里默认设置为false，没有值当false处理
					this.state.fields.bismilepost = false;
					this.state.fields.bplanconfirm = false;
					// 先置为false，这两个字段是后加的，2207预置的交易类型这两个字段没有值，所以后台数据不会传回来，因此不会渲染  end
					Object.keys(this.state.fields).forEach((item) => {
						if (data[item] !== undefined) {
							if (item === 'iprtopolimit') {
								let options = [
									{
										label: getLangByResId(this, '4004transfer-000016'),
										value: '0'
									} /* 国际化处理： 不限制*/,
									{
										label: getLangByResId(this, '4004transfer-000017'),
										value: '1'
									} /* 国际化处理： 存在有效供应商价格才能生成*/,
									{
										label: getLangByResId(this, '4004transfer-000018'),
										value: '2'
									} /* 国际化处理： 经过价格审批才能生成*/
								];
								let option = options.find((opt) => opt.value == data.iprtopolimit);
								if (option) this.state.fields.iprtopolimit = option;
							} else if (item === 'ionwaybegin' || item === 'ionwayend') {
								let options = [
									{
										label: getLangByResId(this, '4004transfer-000021'),
										value: '0'
									} /* 国际化处理： 审批*/,
									{
										label: getLangByResId(this, '4004transfer-000023'),
										value: '1'
									} /* 国际化处理： 输出*/,
									{
										label: getLangByResId(this, '4004transfer-000025'),
										value: '2'
									} /* 国际化处理： 确认*/,
									{
										label: getLangByResId(this, '4004transfer-000030'),
										value: '3'
									} /* 国际化处理： 发货*/,
									{
										label: getLangByResId(this, '4004transfer-000032'),
										value: '4'
									} /* 国际化处理： 装运*/,
									{
										label: getLangByResId(this, '4004transfer-000033'),
										value: '5'
									} /* 国际化处理： 报关*/,
									{
										label: getLangByResId(this, '4004transfer-000034'),
										value: '6'
									} /* 国际化处理： 出关*/,
									{
										label: getLangByResId(this, '4004transfer-000035'),
										value: '7'
									} /* 国际化处理： 到货*/,
									{
										label: getLangByResId(this, '4004transfer-000036'),
										value: '8'
									} /* 国际化处理： 入库*/
								];
								let option = options.find((opt) => opt.value == data[item]);
								if (option) this.state.fields[item] = option;
							} else if (item === 'noverpay') {
								// 超付款容差（%）显示时处理为4位精度
								this.state.fields[item] = parseFloat(data[item]).toFixed(4);
							} else {
								this.state.fields[item] = data[item];
							}
						}
					});
					this.setState({
						fields: this.state.fields
					});
				} else {
					// 请求不成功,state置为默认值
					this.recoveryState('fields_default');
				}
			}
		});
	};

	// checkbox 改变后的回调
	checkChangeFn = (code, value) => {
		// 把code对应的选项放入到select的options中，不能重复
		let ionwaybegin = leftTemplate.find((item) => item.code == 'ionwaybegin');
		let ionwayend = leftTemplate.find((item) => item.code == 'ionwayend');
		let currentCheckbox = rightTemplate.find((item) => item.code === code);
		if (value) {
			// code 勾选,把勾选的选项放入到下拉中（要去重）,并把下拉选中的值置为默认值
			let has = ionwaybegin.options.find((item) => item.value === currentCheckbox.option.value);
			if (!has) {
				ionwaybegin.options.push(currentCheckbox.option);
				ionwayend.options.push(currentCheckbox.option);
				ionwaybegin.options.sort((a, b) => a.value - b.value);
				ionwayend.options.sort((a, b) => a.value - b.value);
			}
		} else {
			// code 不勾选,把选项从下拉中移除,并把下拉选中的值置为默认值
			let beginOptions = ionwaybegin.options.filter((item) => item.value !== currentCheckbox.option.value);
			let endOptions = ionwayend.options.filter((item) => item.value !== currentCheckbox.option.value);
			ionwaybegin.options = beginOptions;
			ionwayend.options = endOptions;
		}
		this.setState({
			fields: {
				...this.state.fields,
				ionwaybegin: { label: getLangByResId(this, '4004transfer-000021'), value: '0' }, // 在途开始,/* 国际化处理： 审批*/
				ionwayend: { label: '', value: null } // 在途结束
			}
		});
	};

	// 左侧区域元素编辑事件(下面调用的时候方法不是很明确，但是还是可以直接用的，只是变量名不太明确)
	leftChangeValueFn = (key, value) => {
		switch (key) {
			case 'boverpay':
				// 允许超订单付款
				let noverpayNum = !value ? null : 0;
				// if (!value) {
				// 	this.setState({ fields: { ...this.state.fields, noverpay: null } });
				// }
				this.setState({ fields: { ...this.state.fields, noverpay: noverpayNum } });
				break;
			case 'noverpay':
				// 超付款容差（%）
				if (value <= 0) {
					this.setState({ fields: { ...this.state.fields, noverpay: null } });
					showErrorInfo.call(this, null, getLangByResId(this, '4004transfer-000052')); /* 国际化处理： 付款容差必须大于0！*/
				} else if (value) {
					// 若value小数点后有五位以上则舍掉最后一位
					value =
						value.indexOf('.') > 0 && value.substr(value.indexOf('.'), value.length).length > 5
							? value.substr(0, value.indexOf('.') + 5)
							: value;
					this.setState({ fields: { ...this.state.fields, noverpay: value } });
				}
				break;
			case 'bismilepost':
				// 里程碑采购
				let check = !value ? false : true;
				// if (!value) {
				// 	this.setState({ fields: { ...this.state.fields, bplanconfirm: false } });
				// } else {
				// 	this.setState({ fields: { ...this.state.fields, bplanconfirm: true } });
				// }
				this.setState({
					fields: { ...this.state.fields, bplanconfirm: check, bvmi: false },
					disabled: { bvmi: check }
				});
				break;
			case 'bvmi':
				// 是否寄存供应商
				let check4Bvmi = !value ? false : true;
				this.setState({
					fields: { ...this.state.fields, bplanconfirm: false, bismilepost: false },
					disabled: { bismilepost: check4Bvmi, bplanconfirm: check4Bvmi }
				});
				break;
			case 'bplanconfirm':
				// 里程碑采购逐级确认
				break;
			default:
				break;
		}
	};

	// 失去焦点事件
	onBlurFn = (key, value) => {
		switch (key) {
			case 'noverpay':
				// 超付款容差（%）在失去焦点时保留4位有效数字
				this.setState({ fields: { ...this.state.fields, noverpay: parseFloat(value).toFixed(4) } });
				break;
		}
	};

	render() {
		return (
			<div className="scm-potrantype-wrapper">
				<div className="left">
					{renderPotrantypeForm.call(this, leftTemplate, this.leftChangeValueFn, null, this.onBlurFn)}
				</div>
				<div className="right">
					{/* 国际化处理： 订单状态选择*/}
					<h3>{getLangByResId(this, '4004transfer-000037')}</h3>
					{renderPotrantypeForm.call(this, rightTemplate, this.checkChangeFn, null, this.onBlurFn)}
				</div>
			</div>
		);
	}
}
/*********渲染位置#transtypebusi是固定的************************ */
ReactDOM.render(<PotrantypeExt />, document.querySelector('#transtypebusi'));
