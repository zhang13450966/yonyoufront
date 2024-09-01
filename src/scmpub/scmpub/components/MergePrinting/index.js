/*
 * @Author: hufei 
 * @PageInfo: 合并打印组件
 * @Date: 2018-04-24 14:27:00 
 * @Last Modified by: chenggangk
 * @Last Modified time: 2022-04-15 15:41:45
 */
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;
import React, { Component } from 'react';
import { base, high, ajax, print, viewModel, getBusinessInfo } from 'nc-lightapp-front';
const { Transfer } = high;
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import M5xPrint from './card';
const { NCButton: Button, NCTabs: Tabs, NCSelect: Select, NCModal: Modal, NCHotKeys, NCTooltip } = base;
const TabPane = Tabs.NCTabPane;
const { Header, Body, Footer } = Modal;
const { setGlobalStorage, getGlobalStorage } = viewModel;
const mergePrintCacheStorage = 'localStorage'; // 缓存位置，现为全局缓存
const mergePrintCacheKey = 'retain-mergePrintCache'; // 缓存key，每次登陆都会清除缓存，现在有retain关键字的不会清除。

import './index.less';
export default class MergePrinting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transferDatas: [
				{
					tabTitle: null,
					dataSource: [],
					targetKeys: []
				},
				{
					tabTitle: null,
					dataSource: [],
					targetKeys: []
				},
				{
					tabTitle: null,
					dataSource: [],
					targetKeys: []
				},
				{
					tabTitle: null,
					dataSource: [],
					targetKeys: []
				}
			],
			selected: '0',
			showAdvanced: false,
			showPrintModal: false,
			billCard: null
		};
		this.transferDatas_bak = [];
		this.cacheKey = null;
	}

	componentDidMount() {
		let businessInfo = getBusinessInfo();
		let userId = businessInfo.userId;
		let appCode = this.props.jsonData.appcode;
		this.cacheKey = userId + '_' + appCode;
		initLang(this, [ '4001components' ], 'scmpub', () => {
			let cacheData = JSON.parse(getGlobalStorage(mergePrintCacheStorage, mergePrintCacheKey));
			let data = null;
			if (cacheData && cacheData[this.cacheKey] && cacheData[this.cacheKey].transferDatas) {
				this.setState({
					selected: cacheData[this.cacheKey].marLevel,
					showAdvanced: cacheData[this.cacheKey].showAdvanced
				});
				data = cacheData[this.cacheKey].transferDatas;
			} else {
				data = this.dataProcess();
			}

			this.setState(
				{
					transferDatas: data
				},
				() => {
					this.transferDatas_bak = JSON.parse(JSON.stringify(data));
				}
			);
		});
	}

	// 下拉
	onSelectChange = (value) => {
		this.setState({ selected: value });
	};

	// 穿梭值改变的回调
	onTargetKeysChange = (index, targetKeys) => {
		let { transferDatas } = this.state;
		transferDatas[index].targetKeys = targetKeys;
		this.setState({ transferDatas });
	};

	// 条件模态框的确定按钮
	onConditionModalConfirm = () => {
		let { transferDatas, selected, showAdvanced } = this.state;
		let data = {
			templateId: '',
			billPk: this.props.jsonData.billPk,
			marLevel: selected,
			numKey: this.props.jsonData.numKey,
			materialPKColumn: this.props.jsonData.materialPKColumn,
			materialClassification: this.props.jsonData.materialClassification,
			groupColumn: transferDatas[0].targetKeys,
			sumColumn: transferDatas[1].targetKeys,
			averageColumn: transferDatas[2].targetKeys,
			weightAverageColumn: transferDatas[3].targetKeys
		};

		let cacheData = JSON.parse(getGlobalStorage(mergePrintCacheStorage, mergePrintCacheKey));
		let cacheDataUser = {
			marLevel: selected,
			showAdvanced: showAdvanced,
			transferDatas: transferDatas
		};
		if (!cacheData) {
			cacheData = {};
		}
		cacheData[this.cacheKey] = cacheDataUser;

		//若存储对象，必须先转为字符串
		setGlobalStorage(mergePrintCacheStorage, mergePrintCacheKey, JSON.stringify(cacheData));

		ajax({
			url: this.props.jsonData.combineUrl,
			data: data,
			success: (res) => {
				this.props.toggleConditionModal();
				this.setState({
					showPrintModal: true,
					billCard: res.data
				});
			}
		});
	};

	// 打印模态框的确定按钮
	onPrintConfirm = () => {
		let pks = [];
		let userjsons = encodeURI(JSON.stringify(this.state.billCard));
		// 组装上送参数（这组参数和之前打印上送的参数是一样的，拿出来是为了添加审批中心时需要添加的属性）
		let printParams = {
			appcode: this.props.jsonData.appcode,
			nodekey: this.props.jsonData.nodekey,
			oids: pks,
			printType: true,
			realData: true,
			controlPrintNum: true,
			userjson: userjsons,
			billtype: this.props.jsonData.billtype
		};
		// 审批场景再传这个参数（transactiontype-交易类型编码， billtype-单据类型，这两个参数每次只能传一个）
		if ('approvesce' == this.props.jsonData.scene) {
			// 其他情况，需要根据单据类型找维护应用
			printParams.appcode = this.props.jsonData.funcode;
		}
		/**
		 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
		 * nodekey 模板节点标识
		 * oids 单据主键
		 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
		 * realData 传true表示打印真数据，传false表示打印假数据
		 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
		 * transactiontype 交易类型编码
		 * billtype 单据类型
		 */
		printPreview(this.props, this.props.jsonData.printUrl, printParams);
	};

	// 关闭打印模态框
	onPrintClose = () => {
		this.setState({
			showPrintModal: false
		});
	};

	// 从传过来的数据中提取页面4个页签需要的数据结构
	dataProcess = () => {
		let {
			groupColumn,
			sumColumn,
			averageColumn,
			weightAverageColumn,
			materialClassification
		} = this.props.jsonData;

		let transferDatas = [
			{
				tabTitle: null,
				dataSource: this.keyToObj(groupColumn.all),
				targetKeys: groupColumn.right
			},
			{
				tabTitle: getLangByResId(this, '4001COMPONENTS-000004') /* 国际化处理： 求和*/,
				dataSource: this.keyToObj(sumColumn.all),
				targetKeys: sumColumn.right
			},
			{
				tabTitle: getLangByResId(this, '4001COMPONENTS-000005') /* 国际化处理： 求平均*/,
				dataSource: this.keyToObj(averageColumn.all),
				targetKeys: averageColumn.right
			},
			{
				tabTitle: getLangByResId(this, '4001COMPONENTS-000006') /* 国际化处理： 求加权平均*/,
				dataSource: this.keyToObj(weightAverageColumn.all),
				targetKeys: weightAverageColumn.right
			}
		];

		if (materialClassification) {
			transferDatas[0].dataSource.push({
				key: 'marClassCode',
				title: getLangByResId(this, '4001COMPONENTS-000007') /* 国际化处理： 物料分类*/
			});
		}

		return transferDatas;
	};

	// 将穿梭的key转成带title和key的对象
	keyToObj = (keys) => {
		let { meta, columnArea } = this.props.jsonData;
		if (!meta || !meta[columnArea]) {
			console.error(`传过来的模板不正确或者在模板中不存在columnArea对应的属性${columnArea}`);
			return;
		}
		let items = meta[columnArea].items;
		let dataSource = [];
		for (let i = 0; i < keys.length; i++) {
			let matchedItem = items.find((ele) => ele.attrcode === keys[i]);
			if (matchedItem) {
				dataSource.push({
					key: matchedItem.attrcode,
					title: matchedItem.label
				});
			}
		}
		return dataSource;
	};

	closeConditionModal = () => {
		if (!getGlobalStorage(mergePrintCacheStorage, mergePrintCacheKey)) {
			this.setState({
				transferDatas: this.transferDatas_bak,
				selected: '0',
				showAdvanced: false,
				showPrintModal: false,
				billCard: null
			});
		}
		this.props.toggleConditionModal();
	};
	render() {
		const { transferDatas, showAdvanced, showPrintModal } = this.state;
		const { showConditionModal } = this.props;
		const transferProps = {
			showSearch: false, // 是否显示搜索框
			className: 'merge-transfer', // 自定义穿梭框的类名，用于写自己的样式
			showMoveBtn: true, //是否显示排序按钮，默认为 false
			lazy: { container: 'modal' } // 解决穿梭在模态框中不显示内容的bug
		};
		let main = JSON.parse(JSON.stringify(transferDatas)).splice(0, 1);
		let advanced = JSON.parse(JSON.stringify(transferDatas)).splice(1, transferDatas.length - 1);
		return [
			<Modal
				className="merge-print-modal"
				show={showConditionModal}
				fieldid="merge_print"
				height="auto"
				onHide={this.closeConditionModal}
			>
				<NCHotKeys
					keyMap={{
						confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
						cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
					}}
					handlers={{
						confirmBtnHandler: () => {
							// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							this.onConditionModalConfirm();
						},
						cancelBtnHandler: () => {
							// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							this.closeConditionModal();
						}
					}}
					className="simpleModal-hotkeys-wrapper"
					focused={true}
					attach={document.body}
					display="inline-block"
				/>
				<Header className="nc-theme-common-header-bgc" closeButton>
					<div className="title nc-theme-title-font-c" fieldid="mergePrinting">
						{getLangByResId(this, '4001COMPONENTS-000016') /* 国际化处理： 合并显示*/}
					</div>
					{/* <i
						className="iconfont icon-guanbi dnd-cancel nc-theme-title-font-c"
						onClick={}
					/> */}
				</Header>
				<Body>
					<div className="merge-printing">
						<Transfer
							dataSource={(main[0] && main[0].dataSource) || []}
							targetKeys={(main[0] && main[0].targetKeys) || []}
							onTargetKeysChange={(targetKeys) => {
								this.onTargetKeysChange(0, targetKeys);
							}}
							titles={[
								getLangByResId(this, '4001COMPONENTS-000008') /* 国际化处理： 可选栏目*/,
								getLangByResId(this, '4001COMPONENTS-000009') /* 国际化处理： 分组汇总栏目*/
							]}
							{...transferProps}
						/>
						<div className="footer">
							{this.props.children}
							<Select
								fieldid="materialClazz"
								data={[
									{
										label: getLangByResId(this, '4001COMPONENTS-000010') /* 国际化处理： 逐级汇总*/,
										value: '0'
									},
									{ label: '1', value: '1' },
									{ label: '2', value: '2' },
									{ label: '3', value: '3' },
									{ label: '4', value: '4' },
									{ label: '5', value: '5' },
									{
										label: getLangByResId(this, '4001COMPONENTS-000011') /* 国际化处理： 物料分类末级汇总*/,
										value: '6'
									}
								]}
								onChange={this.onSelectChange}
								value={this.state.selected}
								showClear={false}
							/>
							<Button
								fieldid="highOrNormal"
								className="btn-advanced"
								onClick={() => {
									this.setState({ showAdvanced: !showAdvanced });
								}}
							>
								{showAdvanced ? (
									getLangByResId(this, '4001COMPONENTS-000012') /* 国际化处理： 正常*/
								) : (
									getLangByResId(this, '4001COMPONENTS-000013') /* 国际化处理： 高级*/
								)}
							</Button>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4001COMPONENTS-000027')}  (${NCHotKeys.USUAL_KEYS
									.NC_MODAL_CONFIRM})`}
								trigger={[ 'hover', 'focus' ]}
								className="model-helper-overlay"
							>
								<Button
									fieldid="icmodal_sure_btn"
									className="button-primary"
									onClick={this.onConditionModalConfirm}
								>
									{getLangByResId(this, '4001COMPONENTS-000027') /*确定*/}(<u>Y</u>)
								</Button>
							</NCTooltip>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4001COMPONENTS-000028')}  (${NCHotKeys.USUAL_KEYS
									.NC_MODAL_CALCEL})`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<Button fieldid="icmodal_cancel_btn" onClick={this.closeConditionModal}>
									{getLangByResId(this, '4001COMPONENTS-000028') /*取消*/}(<u>N</u>)
								</Button>
							</NCTooltip>
						</div>
						{showAdvanced && (
							<Tabs>
								{advanced.map((item, index) => (
									<TabPane tab={item.tabTitle} key={index} className={'merge-printing-normal'}>
										<Transfer
											height="580px"
											dataSource={item.dataSource}
											targetKeys={item.targetKeys}
											onTargetKeysChange={(targetKeys) => {
												this.onTargetKeysChange(index + 1, targetKeys);
											}}
											titles={[
												getLangByResId(this, '4001COMPONENTS-000008') /* 国际化处理： 可选栏目*/,
												item.tabTitle +
													getLangByResId(this, '4001COMPONENTS-000014') /* 国际化处理： 栏目*/
											]}
											{...transferProps}
										/>
									</TabPane>
								))}
							</Tabs>
						)}
					</div>
				</Body>
			</Modal>,
			<Modal size="xlg" className="merge-print-modal" show={showPrintModal} onHide={this.onPrintClose}>
				<Header className="nc-theme-common-header-bgc" closeButton>
					<div className="title nc-theme-title-font-c">{this.props.jsonData.billTitle}</div>
					{/* <i className="iconfont icon-guanbi dnd-cancel nc-theme-title-font-c" onClick={} /> */}
				</Header>
				<Body>
					<M5xPrint
						groupKeys={this.state.transferDatas[0].targetKeys}
						printMeta={this.props.jsonData.meta}
						printUrl={this.props.jsonData.combineUrl}
						headCode={this.props.jsonData.headCode}
						bodyCode={this.props.jsonData.bodyCode}
						billCard={this.state.billCard}
						hideSwitch={this.props.jsonData.hideSwitch}
					/>
				</Body>
				<Footer>
					<Button className="button-primary btn-confirm" onClick={this.onPrintConfirm}>
						{getLangByResId(this, '4001COMPONENTS-000015') /* 国际化处理： 打印*/}
					</Button>
				</Footer>
			</Modal>
		];
	}
}
