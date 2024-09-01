/*
 * @Author: hufei
 * @PageInfo: 适用于SR001 默认补货单据类型参数面板
 * @Date: 2018-07-24 16:07:45
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-04-06 13:59:16
 */

import React, { Component } from 'react';
import { base, ajax, toast, createPage } from 'nc-lightapp-front';
let { NCSelect: Select } = base;
import './index.less';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data;
		this.state = {
			// 多语
			json: {},
			inlt: null,
			transtype: null,
			factype: null,
			potype: null,
			sctype: null,
			selectDataSource: []
		};
	}

	componentDidMount() {
		this.props.modal.show('param-panel');
		initLang(this, [ '4001busiparam' ], 'scmpub', () => {
			this.setState({
				selectDataSource: [
					{
						label: getLangByResId(this, '4001BUSIPARAM-000014') /* 国际化处理： 分销补货件默认补货单据*/,
						code: 'transtype',
						options: []
					},
					{
						label: getLangByResId(this, '4001BUSIPARAM-000015') /* 国际化处理： 工厂补货件默认补货单据*/,
						code: 'factype',
						options: []
					},
					{
						label: getLangByResId(this, '4001BUSIPARAM-000016') /* 国际化处理： 采购件默认补货单据*/,
						code: 'potype',
						options: []
					},
					{
						label: getLangByResId(this, '4001BUSIPARAM-000017') /* 国际化处理： 委外件默认补货单据*/,
						code: 'sctype',
						options: []
					}
				]
			});
		});
		this.getData();
	}

	// 确定按钮保存数据,然后关闭模态框
	closeModal = (flag) => {
		if (flag) {
			this.saveData().then((resVal) => {
				if (this.props.batch) {
					this.props.valueChange(resVal);
				} else {
					this.data.sysinitvo.value = resVal[0].value;
					this.props.valueChange(this.data);
				}
			});
		} else {
			this.props.valueChange();
		}
	};

	// 下拉
	selectChange = (code, value) => {
		this.setState({ [code]: value });
	};

	// 将后台数据转成下拉的选项
	toOptions = (data, code) => {
		let select = this.state.selectDataSource.find((item) => item.code === code);
		select.options = data[code].map((item) => {
			return {
				label: item.name,
				value: item.code
			};
		});
	};

	// 查询数据
	getData = () => {
		if (this.props.initcode) {
			ajax({
				url: '/nccloud/scmpub/param/sr001qry.do',
				data: {
					paramcode: this.props.initcode,
					pk_orgs: this.props.pkorgs,
					isbatch: this.props.batch
				},
				success: (res) => {
					if (res.data) {
						let { allchoices, selected } = res.data;
						Object.keys(allchoices).forEach((item) => {
							this.toOptions(allchoices, item);
						});
						this.setState({
							selectDataSource: this.state.selectDataSource,
							transtype: selected.transtype,
							factype: selected.factype,
							potype: selected.potype,
							sctype: selected.sctype
						});
					}
				}
			});
		}
	};

	// 保存数据
	saveData = () => {
		return new Promise((resolve, reject) => {
			if (!this.props.pkorgs || this.props.pkorgs.length == 0) {
				toast({
					content: getLangByResId(this, '4001BUSIPARAM-000019') /* 国际化处理： 已选组织列表为空，请选择参数所属组织后再批量设置参数*/,
					color: 'danger'
				});
				reject();
			} else {
				let { transtype, factype, potype, sctype } = this.state;
				let data = {
					paramcode: this.props.initcode,
					pk_orgs: this.props.pkorgs,
					selectVal: transtype + '_' + factype + '_' + potype + '_' + sctype
				};
				ajax({
					url: '/nccloud/scmpub/param/sr001save.do',
					data,
					success: (res) => resolve(res.data)
				});
			}
		});
	};

	render() {
		let { selectDataSource } = this.state;
		let { createModal } = this.props.modal;
		const NCOption = Select.NCOption;

		return createModal('param-panel', {
			width: '600px',
			height: '315px',
			title: getLangByResId(this, '4001BUSIPARAM-000000') /* 国际化处理： 动态参数设置*/,
			content: (
				<div className="scm-param-sr001">
					<div className="title">{getLangByResId(this, '4001BUSIPARAM-000018') /* 国际化处理： 询源默认补货单据类型*/}</div>
					{selectDataSource.map((item) => (
						<div className="select-item">
							<span className="select-label">{item.label}：</span>
							<Select
								className="scm-param-sr001-select"
								value={this.state[item.code]}
								onChange={(value) => this.selectChange(item.code, value)}
								data={item.options}
								showClear={false}
							/>
						</div>
					))}
				</div>
			),
			beSureBtnClick: () => this.closeModal(this.props.editMode == 'edit'), //点击确定按钮事件
			cancelBtnClick: () => this.closeModal(false), //取消按钮事件回调
			closeModalEve: () => this.closeModal(false), //关闭按钮事件回调
			disableLeftBtn: this.props.editMode !== 'edit',
			userControl: true
		});
	}
}
export default createPage({})(ParamPanel);
