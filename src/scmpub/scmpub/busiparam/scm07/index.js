/*
 * @Author: hufei 
 * @PageInfo: SCM07 参数面板  
 * @Date: 2018-07-24 16:07:45 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-04-09 14:55:31
 */

import React, { Component } from 'react';
import { base, high, ajax } from 'nc-lightapp-front';
let { NCModal: Modal, NCButton: Button, NCTabs: Tabs, NCHotKeys, NCTooltip } = base;
let { Transfer } = high;
let { NCTabPane: TabPane } = Tabs;
let { Header, Body, Footer } = Modal;
import './index.less';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data;
		this.state = {
			// 多语
			json: {},
			inlt: null,
			tab0: {
				dataSource: [],
				targetKeys: [],
				defaults: []
			},
			tab1: {
				dataSource: [],
				targetKeys: [],
				defaults: []
			},
			activeTabKey: 'tab0'
		};
	}

	componentDidMount() {
		initLang(this, [ '4001busiparam' ], 'scmpub', () => {
			this.setState(this.state);
		});
		this.getData();
	}

	// 确定按钮保存数据,然后关闭模态框
	sureBtnClick = () => {
		if (this.props.editMode !== 'edit') {
			this.closeModal();
		} else {
			this.saveData().then(() => {
				this.closeModal();
			});
		}
	};

	// 关闭模态框需要调用 props.valueChange ,传递原来旧的数据即可
	closeModal = () => {
		this.props.valueChange && this.props.valueChange(this.data);
	};

	// 穿梭值改变回调
	onTargetKeysChange = (tab, targetKeys) => {
		this.setState({
			[tab]: {
				...this.state[tab],
				targetKeys
			}
		});
	};

	// 重置按钮将已选项置为默认值
	resetTargetKeys = () => {
		let { tab0, tab1 } = this.state;
		this.setState({
			tab0: {
				...tab0,
				targetKeys: tab0.defaults
			},
			tab1: {
				...tab1,
				targetKeys: tab1.defaults
			},
			activeTabKey: 'tab0'
		});
	};

	// 请求穿梭所有的数据
	getData = () => {
		if (this.data.sysinittempvo && this.data.m_sysinitvo) {
			ajax({
				url: '/nccloud/scmpub/param/scm07qry.do',
				data: {
					paramcode: this.data.sysinittempvo.initcode,
					pk_org: this.data.m_sysinitvo.pk_org
				},
				success: (res) => {
					if (res.data) {
						let process = (data) => {
							let dataSource = [],
								targetKeys = [],
								defaults = [];
							if (data && data.allchoices) {
								dataSource = data.allchoices.map((item) => ({
									key: item.code,
									title: item.name
								}));
								defaults = data.allchoices.filter((item) => !!item.isdefault).map((item) => item.code);
							}
							if (data && data.selected) {
								targetKeys = data.selected.map((item) => item.code);
							}
							return { dataSource, targetKeys, defaults };
						};
						this.setState({
							tab0: process(res.data[0]),
							tab1: process(res.data[1])
						});
					}
				}
			});
		}
	};

	// 保存数据
	saveData = () => {
		return new Promise((resolve) => {
			ajax({
				url: '/nccloud/scmpub/param/scm07save.do',
				data: {
					headSel: this.state.tab0.targetKeys,
					bodySel: this.state.tab1.targetKeys
				},
				success: resolve
			});
		});
	};

	render() {
		const { tab0, tab1, activeTabKey } = this.state;
		const transferProps = {
			className: 'param-panel-transfer',
			showMoveBtn: true,
			titles: [
				getLangByResId(this, '4001BUSIPARAM-000009'),
				getLangByResId(this, '4001BUSIPARAM-000010')
			] /* 国际化处理： 待选,已选*/,
			lazy: { container: 'modal' }
		};
		return (
			<div>
				<Modal show={true} className="param-panel-modal" onHide={() => this.closeModal()}>
					<NCHotKeys
						keyMap={{
							confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
							cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
						}}
						handlers={{
							confirmBtnHandler: () => {
								// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
								this.sureBtnClick(this.props.editMode == 'edit' ? true : false);
							},
							cancelBtnHandler: () => {
								// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
								this.closeModal();
							}
						}}
						className="simpleModal-hotkeys-wrapper"
						focused={true}
						attach={document.body}
						display="inline-block"
					/>
					<Header closeButton>
						<span className="title">{getLangByResId(this, '4001BUSIPARAM-000000') /* 国际化处理： 动态参数设置*/}</span>
					</Header>
					<Body>
						<Tabs
							activeKey={activeTabKey}
							onChange={(key) => {
								this.setState({ activeTabKey: key });
							}}
						>
							<TabPane tab={getLangByResId(this, '4001BUSIPARAM-000011') /* 国际化处理： 金税发票表头*/} key="tab0">
								<Transfer
									{...transferProps}
									dataSource={tab0.dataSource}
									targetKeys={tab0.targetKeys}
									onTargetKeysChange={(keys) => this.onTargetKeysChange('tab0', keys)}
								/>
							</TabPane>
							<TabPane tab={getLangByResId(this, '4001BUSIPARAM-000012') /* 国际化处理： 金税发票表体*/} key="tab1">
								<Transfer
									{...transferProps}
									dataSource={tab1.dataSource}
									targetKeys={tab1.targetKeys}
									onTargetKeysChange={(keys) => this.onTargetKeysChange('tab1', keys)}
								/>
							</TabPane>
						</Tabs>
					</Body>
					<Footer>
						<div className="extend-info">
							<Button onClick={this.resetTargetKeys}>
								{getLangByResId(this, '4001BUSIPARAM-000013') /* 国际化处理： 重置*/}
							</Button>
						</div>
						<NCTooltip
							placement="top"
							inverse
							overlay={`${getLangByResId(this, '4001BUSIPARAM-000007')}  (${NCHotKeys.USUAL_KEYS
								.NC_MODAL_CONFIRM})`}
							trigger={[ 'hover', 'focus' ]}
							className="model-helper-overlay"
						>
							<Button
								className="button-primary"
								disabled={this.props.editMode != 'edit'}
								onClick={() => this.sureBtnClick(this.props.editMode == 'edit')}
							>
								{getLangByResId(this, '4001BUSIPARAM-000007') /* 国际化处理： 确定*/}(<u>Y</u>)
							</Button>
						</NCTooltip>
						<NCTooltip
							placement="top"
							inverse
							overlay={`${getLangByResId(this, '4001BUSIPARAM-000008')}  (${NCHotKeys.USUAL_KEYS
								.NC_MODAL_CALCEL})`}
							trigger={[ 'focus', 'hover' ]}
							className="model-helper-overlay"
						>
							<Button onClick={this.closeModal}>
								{getLangByResId(this, '4001BUSIPARAM-000008') /* 国际化处理：取消*/}(<u>N</u>)
							</Button>
						</NCTooltip>
					</Footer>
				</Modal>
			</div>
		);
	}
}
