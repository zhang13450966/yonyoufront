import {base, ajax, toast, high} from 'nc-lightapp-front';
import React from 'react';
import FormControl from 'bee-form-control';


const {Refer} = high
const PopRefer = Refer.PopRefer
const { NCCheckbox,NCPopover } = base
const MultiLangWrapper = Refer.MultiLangWrapper
const GRID_TREE_SEARCH_INPUT = 'grid-input-for-tab-sequence';

class AdjPopRefer extends PopRefer{
    constructor(props) {
		super(props);
	}


    // renderPopoverBottomExtend = () => {
	// 	let { tableData, selectedKeys, isSearch, searchVal } = this.state;
	// 	const { refType, isPartFlag, rootNode } = this.props;
	// 	let _this = this;
	// 	//定调资人员参照是否显示兼职
	// 	return refType === 'gridTree' && isPartFlag && (
	// 		<NCCheckbox
	// 			onChange={(value) => {
	// 				let parm = {
	// 					pid: selectedKeys[0] === rootNode.refpk ? '' : selectedKeys[0] || '',
	// 					pageInfo: tableData[0].page,
	// 					keyword: isSearch ? searchVal : '',
	// 					queryCondition: {
	// 						isPartJob: value
	// 					}
	// 				}
	// 				_this.loadAndSetTableData(parm, false)
	// 				_this.setState({
	// 					isPartJob : value
	// 				})
	// 			}}
	// 		>
	// 			{_this.props.btnName || ''}
	// 		</NCCheckbox>
	// 	)
	// }


	// 渲染：【搜索grid的搜索框】
	renderSearchTableInput = () => {
		let { searchVal, columnConfig ,tableData, selectedKeys, isSearch } = this.state;
		let { code: codes, search = {} } = columnConfig[0];
		let _this = this;
		const {
			refType,
			refName,
			refName_db, // 后台要加的
			isShowTableSearch,
			allowSearchConfig,
			isPartFlag,
			rootNode
		} = this.props;
		return (
			<div>
				<div style={{float: 'left'}}>
					{refType !== 'tree' && isShowTableSearch && (
						<div className="refer-search-table-input" key="2">
							<FormControl
								className={`search-input ${GRID_TREE_SEARCH_INPUT}`}
								style={{ paddingRight: allowSearchConfig && 64 }}
								// 搜索
								placeholder={`${this.state.jsonInsideRefer['containers-refer-0016']}${refName_db || refName}`}
								value={searchVal}
								onChange={v => {
									this.interval = new Date().getTime();

									let s = setTimeout(() => {
										// 停止输入0.5s后执行
										if (new Date().getTime() - this.interval >= 500) {
											this.popSearchTable(v);
										}
										clearTimeout(s);
									}, 500);
									this.setState({
										searchVal: v
									});
								}}
								tabIndex={this.getTabIndex(this.hotKeyElement.tableSearchInput)}
								onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.tableSearchInput)}
								ref={dom => {
									this.searchTableInput = ReactDOM.findDOMNode(dom);
								}}
							/>
							<i className="refer-search-i iconfont icon-sousuo" />
							{searchVal && (
								<i
									className="refer-del-i iconfont icon-qingkong"
									style={{
										marginRight: allowSearchConfig && 20
									}}
									onClick={() => {
										this.popSearchTable('');
										this.setState({
											searchVal: ''
										});
									}}
								/>
							)}
							{/* 搜索设置 */}
							{/* {false && ( */}
							{allowSearchConfig && (
								<NCPopover
									container={document.body}
									className="popover-in-refer popover-for-search-config"
									trigger="click"
									placement="bottom"
									content={
										<div className="refer-popover-container search-config">
											<ul className="search-config-ul">
												{columnConfig[0].name.map((e, i) => {
													let code = codes[i];
													return (
														<li className="refer-search-config-item" title={e}>
															<NCCheckbox
																tabIndex="-1"
																checked={
																	code === 'refname' ||
																	code == 'refcode' ||
																	(search || {})[code] === true
																}
																value={code}
																onClick={evt => {
																	evt.stopPropagation();
																	search[code] = !(search[code] === true);
																	columnConfig[0].search = search;
																	this.setState(
																		{
																			columnConfig
																		},
																		() => {
																			this.pushToColumnConfig();
																		}
																	);
																}}
																disabled={code === 'refname' || code == 'refcode'}
															>
																{e}
															</NCCheckbox>
														</li>
													);
												})}
											</ul>
											<div className="refer-dnd-bottom">
												<span className="to-default" onClick={this.resetColumnConfig}>
													{/* 恢复默认 */}
													{this.state.jsonInsideRefer['containers-refer-0005']}
												</span>
											</div>
										</div>
									}
								>
									<i className="search-setting iconfont icon-shezhi" style={{ display: 'block' }} />
								</NCPopover>
							)}
						</div>
					)
					}
				</div>
				<div style={{float: 'left',padding: '5px 0 0 10px'}}>
					{refType === 'gridTree' && isPartFlag && (
						<NCCheckbox
							onChange={(value) => {
								let parm = {
									pid: selectedKeys[0] === rootNode.refpk ? '' : selectedKeys[0] || '',
									pageInfo: tableData[0].page,
									keyword: isSearch ? searchVal : '',
									queryCondition: {
										isPartJob: value
									}
								}
								_this.loadAndSetTableData(parm, false)
								_this.setState({
									isPartJob : value
								})
							}}
						>
							{_this.props.btnName || ''}
						</NCCheckbox>)}
				</div>	
			</div>	
		);
	};
	
	// 获取请求参数
	__getParam = (param = {}) => {
		let {
			queryCondition,
			pageSize,
			refType,
			isShowUnit,
			isShowDisabledData,
			isHasDisabledData,
			pk_defdoclist,
			dataPowerOperationCode,
			isDataPowerEnable,
			unitProps,
			pk_org
		} = this.props,
			{ isShow } = this.state,
			{ keyword = '', pid = '', pageInfo = {}, searchPks } = param;
		pageInfo = {
			pageSize: pageInfo.pageSize || pageSize,
			pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
		};
		if (pageInfo.pageSize == -1) {
			pageInfo.pageIndex = -1;
		}
		let extraCondition = {};
		unitProps &&
			isShowUnit &&
			(extraCondition[unitProps.key || 'unitPks'] =
				Array.isArray(this.state.unit) && this.state.unit.length
					? this.state.unit.map(e => e.refpk).join(',')
					: (this.state.unit || {}).refpk);
		isHasDisabledData && isShowDisabledData && (extraCondition.isShowDisabledData = this.state.isShowDisabledData);
		!isShow && keyword && (extraCondition.searchFlag = true);
		extraCondition.isShowUnit = !!isShowUnit;
		// 模板上会返回下面几个属性
		pk_defdoclist !== undefined && (extraCondition.pk_defdoclist = pk_defdoclist);
		dataPowerOperationCode !== undefined && (extraCondition.DataPowerOperationCode = dataPowerOperationCode);
		isDataPowerEnable !== undefined && (extraCondition.isDataPowerEnable = isDataPowerEnable);

		let final = {
			...param,
			pid, // 对应的树节点
			keyword,
			defineItems: this.getSearchConfigCodes(), // 搜索设置字段
			pk_org,
			queryCondition: {
				...(typeof queryCondition === 'function'
					? queryCondition(this.props)
					: typeof queryCondition === 'object' ? queryCondition : {})
			},
			pageInfo,
			...this.getParam(param || {})
		};

		final.queryCondition = { ...extraCondition, ...final.queryCondition, ...param.queryCondition };
		if (Array.isArray(searchPks) && searchPks.length) {
			final.searchPks = searchPks;
			final.pageInfo.pageSize = searchPks.length;
		}
		return final;
	};
	// 刷新
	refresh = (clearCache = true) => {
		let { pageSize, rootNode, refType, idKey } = this.props,
			{ selectedKeys } = this.state;
		// state数据清空
		let { isPartJob } = this.state
		let _this =this
		let defaultState = {
			tableData: [
				{
					rows: [],
					page: {
						pageIndex: 0,
						pageSize,
						totalPage: 1
					}
				}
			], // 参照的数据
			treeData: [
				rootNode
			] // 左树的值
		};
		// 缓存数据清空
		this.clearCache();
		// 树表时清除左树选中
		if (refType === 'gridTree') {
			selectedKeys = [];
		}
		// 清空搜索框
		let newState = {
			...defaultState,
			selectedKeys,
			searchVal: '',
			treeSearchVal: '',
			isTreeSearch: false,
			isSearch: false,
			expandedKeys: [
				rootNode[idKey]
			],
			isPartJob: isPartJob || false
		};
		clearCache && (newState.selectedValues = new Map(JSON.parse(JSON.stringify(this._value)))); // 已选恢复到点开时
		this.setState(newState, () => {
			// 查全部数据
			_this.show(true);
		});
	};

		// 复写原型方法：点击参照三个点的事件
	show = (lazyRefresh = false) => {
			this.focusFlag = false;
			let { disabled, isTreelazyLoad, idKey,pk_org } = this.props,
				{
					selectedValues,
					selectedKeys,
					expandedKeys,
					includeChildren,
					activeKey,
					isExpandLeftArea,
					max,
					isPartJob
				} = this.state;
	
			if (disabled) {
				return false;
			}
	
			this._expandedKeys = expandedKeys;
			!this.hasOwnProperty('prevOverFlow') && (this.prevOverFlow = document.body.style.overflow);
			document.body.style.overflow = 'hidden';
	
			let { refType, rootNode, pageSize, isMultiSelectedEnabled } = this.props,
				{ tableData } = this.state,
				param;
	
			// 先查常用，常用没有的话再查全部
			(cb => {
				// lazyRefresh：只刷新当前页面
				// lazyRefresh可能是e
				if (lazyRefresh === true) {
					activeKey === '2'
						? cb()
						: this.loadAndSetTableData(
								{
									pageInfo: {
										pageIndex: -1,
										pageSize
									}
								},
								false
							);
				} else {
					this.checkUsual(cb);
				}
			})(() => {
				// 没常用，查全部
				if (refType === 'grid') {
					param = this.__getParam({
						pageInfo: tableData[0].page
					});
					this.loadAndSetTableData(param);
				} else {
					param = this.__getParam({
						pid: isTreelazyLoad ? rootNode.refpk : '',
						pageInfo: {
							pageSize,
							pageIndex: -1
						},
						queryCondition : {
							pk_org : pk_org
						}
					});
					this.loadTreeData(param).then(data => {
						this.setTreeData('treeData', rootNode, data);
						if (refType === 'gridTree') {
							let { treeDataWithChildren, keyMap } = this.state,
								firstSelectedKeys = selectedKeys[0];
							if (keyMap[firstSelectedKeys]) {
								// 选中的节点是真实存在的
								firstSelectedKeys = keyMap[firstSelectedKeys].refpk;
							} else {
								firstSelectedKeys = '';
							}
							try {
								// 默认第一个节点
								let firstTreeNode = treeDataWithChildren[0].children[0];
								!firstSelectedKeys && (firstSelectedKeys = firstTreeNode.refpk || firstTreeNode[idKey]);
							} catch (e) {}
							if (firstSelectedKeys) {
								// 查右表
								param = this.__getParam({
									pid: firstSelectedKeys,
									queryCondition: {
										isPartJob: isPartJob || false
									}
								});
								this.loadAndSetTableData(param);
								this.setState({
									selectedKeys: [
										firstSelectedKeys
									]
								});
							} else {
								// 重置左树和右表
								selectedKeys = [];
								tableData[0].rows = [];
								this.setState({
									tableData,
									selectedKeys
								});
							}
						}
					});
				}
				this.setState({
					activeKey: '2'
				});
			});
			if (refType === 'tree' && !isMultiSelectedEnabled) {
				selectedKeys = [
					...this._value.values()
				]
					.slice(0, 1)
					.map(e => e[idKey]);
			}
			this.runWithChildren = !!this.state.runWithChildren;
			this.setState(
				{
					isShow: true,
					isFirstShow: false,
					dropDownShow: false,
					isSelectedShow: false,
					searchVal: '',
					treeSearchVal: '',
					selectedShow: false,
					max: lazyRefresh === true ? max : false,
					isExpandLeftArea: lazyRefresh === true ? isExpandLeftArea : false,
					selectedKeys,
					isMultiSelectMode: !(
						[
							...selectedValues.keys()
						].length <= 1 && !includeChildren
					),
					selectedRowIndex: -1
				},
				() => {
					this.referInput && this.referInput.blur();
					// 防止焦点丢失
					this.popWindow && !this.popWindow.contains(document.activeElement) && this.popWindow.focus();
				}
			);
	};

		// 左树的点击事件：左树右表时查右表数据, 树时选中节点
	onTreeNodeSelect = (_selectedKeys, { node }) => {
		// console.log('点击树：', _selectedKeys, { selected, selectedNodes, node, event });
		let keyPressFlag = false;
		if (
			window.event &&
			[
				'keyCode',
				'charCode',
				'which'
			].find(e => window.event[e])
		) {
			keyPressFlag = true;
		}
		let { refType, rootNode, idKey, pageSize } = this.props,
			pid = node.props.treeNodeData[idKey],
			{ searchVal, isExpandLeftArea, isMultiSelectMode, selectedValues, selectedKeys, expandedKeys,isPartJob } = this.state;

		// 单击展开并选中
		!keyPressFlag &&
			(expandedKeys = [
				...new Set([
					...expandedKeys,
					pid
				])
			]);
		selectedKeys = [
			pid
		];

		// 查下级
		!keyPressFlag && this.loadTreeChildrenDataIfNeeded(node);

		if (refType === 'gridTree') {
			// 左树右表
			if (node.props.treeNodeData[idKey] === rootNode[idKey]) return;
			if (!node.props.disableCheckbox) {
				if (!isExpandLeftArea) {
					// 查右表数据
					this.loadAndSetTableData({
						pid: node.props.treeNodeData.refpk,
						pageInfo: {
							pageIndex: 0,
							pageSize
						},
						keyword: searchVal,
						queryCondition : {
							isPartJob : isPartJob || false
						}
					});
				}
			}
		} else if (refType === 'tree') {
			// 树
			if (!isMultiSelectMode) {
				// 单选模式
				({ selectedValues } = this.treeSelect(node));
				this.setState({
					selectedValues
				});
			}
		}
		this.setState({
			expandedKeys,
			selectedKeys
		});
	};

	onPageChange = newPage => {
		let { tableData, selectedKeys, isSearch, searchVal,isPartJob } = this.state,
			{ rootNode } = this.props;
			// tableData[0].page = {...tableData[0].page,...{pageIndex:newPage.pageIndex-1}};
			newPage.pageIndex&&(tableData[0].page.pageIndex = newPage.pageIndex-1)
			newPage.pageSize&&(tableData[0].page.pageSize = newPage.pageSize)
			newPage.totalPage&&(tableData[0].page.totalPage = newPage.totalPage)
			newPage.total&&(tableData[0].page.total = newPage.total)
		// 根据页码重新查数据
		this.setState(
			{
				tableData
			},
			() => {
				this.referTable && (this.referTable.querySelector('.wui-table-body').scrollTop = 0);
				this.loadAndSetTableData({
					pid: selectedKeys[0] === rootNode.refpk ? '' : selectedKeys[0] || '',
					pageInfo: tableData[0].page,
					keyword: isSearch ? searchVal : '',
					queryCondition : {
							isPartJob : isPartJob || false
					}
				});
			}
		);
	};


}
AdjPopRefer = MultiLangWrapper(AdjPopRefer);
export default  AdjPopRefer