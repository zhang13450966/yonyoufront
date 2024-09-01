/*
 * @Author: guoylei 
 * @PageInfo:PO91 请购单建议供应商取值 参数面板 适用于 PO91
 * @Date: 2021-05-25 09:56:16 
 * @Last Modified by: guoylei 
 * @Last Modified time: 2021-05-25 09:56:16 
 */

import React, { Component } from 'react';
import { high, createPage } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let { Transfer } = high;
import getParamData from './data.js';

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data || {};
		//参数已选的参数值
		let targetKeys = [];
		//获取参数所有可选的参数值
		let DATA = getParamData.call(this);
		let CODE = props.initcode; //参数代码 PO91
		initLang(this, [ '4004sysinit' ], 'pu', () => {
			//获取数据
			DATA = getParamData.call(this);
			//设置UI快照
			this.setState({
				dataSource: (DATA[CODE] && DATA[CODE].dataSource) || [],
				targetKeys
			});
		});
		//判断不是批量修改
		if (!props.batch) {
			// 穿梭已选的项是传过来的props.data.sysinitvo.value(逗号分隔的字符串)所代表的值,如果没有值，则放默认值到右边
			// sysinitvo.value结尾有时候是个逗号，分割后会生成一个空字符串的已选项，会影响已选项不能为空校验，需要去掉结尾的逗号
			// 获取到已选择的参数值
			if (this.data.sysinitvo.value) {
				targetKeys = this.data.sysinitvo.value.replace(/,$/, '').split(',');
			}
		}
		//UI快照
		this.state = {
			dataSource: (DATA[CODE] && DATA[CODE].dataSource) || [],
			targetKeys
		};
	}

	componentDidMount() {
		this.props.modal.show('param-panel');
	}

	// 调用props.valueChange方法关闭模态框，并传递数据，编辑态点确定（checkflag为true）传新的已选的值，其它情况都不传值
	closeModal = (checkflag) => {
		let valueStr, param;
		if (checkflag) {
			// 编辑态点击确定，需要校验已选项，并且传递新的已选值到父组件，批量修改传字符串，单个修改传完整vo对象
			// 点击取消或关闭的X按钮或浏览态点击确定，不需要校验，不需要传值
			valueStr = this.state.targetKeys.join(',');

			if (this.props.batch) {
				// 批量修改
				param = this.props.pkorgs.map((org) => {
					return { pk_org: org, value: valueStr };
				});
			} else {
				// 单独修改
				this.data.sysinitvo.value = valueStr;
				param = this.data;
			}
		}
		this.props.valueChange(param);
	};

	// 穿梭内容改变时的回调
	onTargetKeysChange = (targetKeys) => {
		this.setState({ targetKeys });
	};

	render() {
		const { dataSource, targetKeys } = this.state;
		const transferProps = {
			dataSource,
			targetKeys,
			onTargetKeysChange: this.onTargetKeysChange,
			className: 'param-panel-transfer',
			showMoveBtn: true,
			titles: [
				getLangByResId(this, '4004sysinit-000048'),
				getLangByResId(this, '4004sysinit-000049')
			] /* 国际化处理： 待选,已选*/,
			lazy: { container: 'modal' }
		};
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			title: getLangByResId(this, '4004sysinit-000020') /* 国际化处理： 动态参数设置*/,
			content: (
				<div style={{ height: '100%' }}>
					<Transfer {...transferProps} />
				</div>
			),
			beSureBtnClick: () => this.closeModal(this.props.editMode == 'edit'), //点击确定按钮事件
			cancelBtnClick: () => this.closeModal(false), //取消按钮事件回调
			closeModalEve: () => this.closeModal(false), //关闭按钮事件回调
			disableLeftBtn: this.props.editMode !== 'edit',
			userControl: true, // 点 确定/取消 按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
			className: 'combine'
		});
	}
}
export default createPage({})(ParamPanel);
