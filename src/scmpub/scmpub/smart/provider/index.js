import React, { Component } from 'react';

import { createPage, base, ajax } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import { getTableMeta } from './constant';
const { NCButton, NCInput, NCSelect, NCTabs, NCHotKeys, NCTooltip } = base;
const NCTabPane = NCTabs.NCTabPane;
const NCOption = NCSelect.NCOption;
import './index.less';
class ScmProvider extends Component {
	constructor(props) {
		super(props);
		props.use.editTable('head');
		this.state = {
			modules: null, // 模块列表
			providerClazz: null, // 输入的类
			providerModule: 'BRM', // 所选module
			activeKey: 'tab-dispose' // 当前页签
		};
		this.resData = null; // 供应链查询数据
		this.dsName = null;
		initLang(this, [ '4001smartprovider' ], 'scmpub', () => {
			this.props.meta.setMeta(getTableMeta.call(this));
		});
	}

	componentDidMount() {
		//设置表格模板
		this.dsName = this.props.tableItem.dsname.value;

		// 请求module列表
		ajax({
			url: '/nccloud/scmpub/smart/scmProviderDesignModulesQuery.do',
			data: {
				testAttr: 'scm'
			},
			success: (res) => {
				if (res.success) {
					this.setState({
						modules: res.data
					});

					// jsonProvider中保存了模板配置相关信息
					if (this.props.jsonProvider && this.props.jsonProvider != '') {
						let scmProvider = JSON.parse(this.props.jsonProvider);
						if (scmProvider.scmSmartVO.factoryClass) {
							this.setState({
								providerClazz: scmProvider.scmSmartVO.factoryClass
							});
						}
						if (scmProvider.scmSmartVO.moduleName) {
							this.setState({
								providerModule: scmProvider.scmSmartVO.moduleName
							});
						}
					}
				}
			}
		});
	}

	render() {
		const { beSureBtnClick, editTable } = this.props;
		const { createEditTable } = editTable;
		return (
			<div className="scm-smart-provider flex-container">
				<NCTabs
					navtype="turn"
					contenttype="moveleft"
					defaultActiveKey="tab-dispose"
					activeKey={this.state.activeKey}
					onChange={this.onTabChange.bind(this)}
					flex={true}
				>
					<NCTabPane
						fieldid="tabs-area"
						tab={getLangByResId(this, '4001SMARTPROVIDER-000019') /* 国际化处理： 模板配置*/}
						key="tab-dispose"
					>
						<div className="table-area top-table">
							<div className="field-item">
								<div className="field-name">
									{getLangByResId(this, '4001SMARTPROVIDER-000000') /* 国际化处理： 模板编码*/}
								</div>
								<NCSelect
									value={this.state.providerModule}
									fieldid="scm-module-select"
									onChange={(value) => this.selectChange(value)}
									className="scm-smartprovider-input"
								>
									{this.state.modules &&
										Object.keys(this.state.modules).map((key, index) => {
											return <NCOption value={key}>{this.state.modules[key]}</NCOption>;
										})}
								</NCSelect>
							</div>
							<div className="field-item">
								<div className="field-name">
									{getLangByResId(this, '4001SMARTPROVIDER-000001') /* 国际化处理： 报表实现类名*/}
								</div>
								<NCInput
									fieldid="scm-clazz-input"
									value={this.state.providerClazz}
									onChange={this.inputChange}
									className="scm-smartprovider-input"
								/>
							</div>
						</div>
					</NCTabPane>
					<NCTabPane
						fieldid="tabs-area"
						tab={getLangByResId(this, '4001SMARTPROVIDER-000020') /* 国际化处理： 元数据*/}
						key="tab-meta"
					>
						<div className="table-area flex-container">
							{createEditTable('head', {
								showIndex: true,
								adaptionHeight: true
							})}
						</div>
					</NCTabPane>
				</NCTabs>
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
				<div className="footer-buttons">
					<NCButton
						onClick={() => {
							ajax({
								url: '/nccloud/scmpub/smart/scmProviderDesign.do',
								data: {
									selectModule: this.state.providerModule,
									clazz: this.state.providerClazz,
									dsName: this.dsName
								},
								success: (res) => {
									if (res.success) {
										this.resData = res.data;
										// this.setState({
										// 	activeKey: 'tab-meta'
										// });
										this.onTabChange('tab-meta');
									}
								}
							});
						}}
					>
						{getLangByResId(this, '4001SMARTPROVIDER-000002') /* 国际化处理： 验证*/}
					</NCButton>

					<NCTooltip
						placement="top"
						inverse
						overlay={`${getLangByResId(this, '4001SMARTPROVIDER-000003')} (Alt+Y)`}
						trigger={[ 'focus', 'hover' ]}
						className="model-helper-overlay"
					>
						<NCButton
							className="button-primary"
							onClick={() => {
								ajax({
									url: '/nccloud/scmpub/smart/scmProviderDesign.do',
									data: {
										selectModule: this.state.providerModule,
										clazz: this.state.providerClazz,
										dsName: this.dsName
									},
									success: (res) => {
										if (res.success) {
											this.resData = res.data;
											beSureBtnClick(res.data);
										}
									}
								});
							}}
						>
							{getLangByResId(this, '4001SMARTPROVIDER-000003') /* 国际化处理： 确定*/}
							(<u>Y</u>)
						</NCButton>
					</NCTooltip>
					<NCTooltip
						placement="top"
						inverse
						overlay={`${getLangByResId(this, '4001SMARTPROVIDER-000021')} (Alt+N)`}
						trigger={[ 'focus', 'hover' ]}
						className="model-helper-overlay"
					>
						<NCButton
							onClick={() => {
								this.props.closeModal();
							}}
						>
							{getLangByResId(this, '4001SMARTPROVIDER-000021') /* 国际化处理： 取消*/}
							(<u>N</u>)
						</NCButton>
					</NCTooltip>
				</div>
			</div>
		);
	}

	// 报表实现类名编辑事件
	inputChange = (value) => {
		this.setState({
			providerClazz: value
		});
	};

	//模块编码编辑事件
	selectChange = (value) => {
		this.setState({
			providerModule: value
		});
	};

	// 页签切换
	onTabChange = (key) => {
		this.setState({
			activeKey: key
		});
		if (key == 'tab-meta') {
			// 元数据页签，渲染数据
			let metaRows = [];
			if (!this.resData) {
				// 双击、修改，切换页签需要重新查询数据
				ajax({
					url: '/nccloud/scmpub/smart/scmProviderDesign.do',
					async: false,
					data: {
						selectModule: this.state.providerModule,
						clazz: this.state.providerClazz,
						dsName: this.dsName
					},
					success: (res) => {
						if (res.success) {
							this.resData = res.data;
						}
					}
				});
			}

			if (this.resData && this.resData.fieldParam) {
				this.getMetaRows(metaRows);
			}
			this.props.editTable.setTableData('head', { rows: metaRows }, false);
		}
	};

	// 构造元数据页签数据
	getMetaRows(metaRows) {
		Object.keys(this.resData.fieldParam).forEach((key, index) => {
			let row = {
				values: {
					fieldname: { value: this.resData.fieldParam[key].m_fldcode },
					multilangtext: { value: this.resData.fieldParam[key].name },
					datatype: { value: this.getDataTypeName(this.resData.fieldParam[key].dataType) },
					precision: { value: this.resData.fieldParam[key].precision },
					scale: { value: this.resData.fieldParam[key].scale }
				}
			};
			metaRows.push(row);
		});
	}

	// dataType翻译
	getDataTypeName(dataTypeCode) {
		switch (dataTypeCode) {
			case '11':
				return getLangByResId(this, '4001SMARTPROVIDER-000004') /* 国际化处理： 逻辑型*/;
			case '2':
				return getLangByResId(this, '4001SMARTPROVIDER-000005') /* 国际化处理： 字节型*/;
			case '10':
				return getLangByResId(this, '4001SMARTPROVIDER-000006') /* 国际化处理： 数值型*/;
			case '18':
				return getLangByResId(this, '4001SMARTPROVIDER-000007') /* 国际化处理： 字节型数组*/;
			case '13':
				return getLangByResId(this, '4001SMARTPROVIDER-000008') /* 国际化处理： 日期型*/;
			case '7':
				return getLangByResId(this, '4001SMARTPROVIDER-000009') /* 国际化处理： 浮点双精度*/;
			case '6':
				return getLangByResId(this, '4001SMARTPROVIDER-000010') /* 国际化处理： 浮点单精度*/;
			case '4':
				return getLangByResId(this, '4001SMARTPROVIDER-000011') /* 国际化处理： 整型*/;
			case '5':
				return getLangByResId(this, '4001SMARTPROVIDER-000012') /* 国际化处理： 长整型*/;
			case '1':
				return getLangByResId(this, '4001SMARTPROVIDER-000013') /* 国际化处理： 空类型*/;
			case '17':
				return getLangByResId(this, '4001SMARTPROVIDER-000014') /* 国际化处理： 对象类型*/;
			case '3':
				return getLangByResId(this, '4001SMARTPROVIDER-000015') /* 国际化处理： 短整型*/;
			case '14':
				return getLangByResId(this, '4001SMARTPROVIDER-000016') /* 国际化处理： 时间型*/;
			case '16':
				return getLangByResId(this, '4001SMARTPROVIDER-000017') /* 国际化处理： 字符串型*/;
			case '15':
				return getLangByResId(this, '4001SMARTPROVIDER-000018') /* 国际化处理： 时间戳*/;
		}
	}
}

ScmProvider = createPage({})(ScmProvider);
export default ScmProvider;
