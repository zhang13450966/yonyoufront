
import React, { useState, useEffect, useRef } from 'react';
const NCButton = $nccPlatform.base.NCButton;
const NCCheckbox = $nccPlatform.base.NCCheckbox;
import './Transfer.less';
const NCRadio = $nccPlatform.base.NCRadio;
const LeftTreeId = 'LeftTreeId'
const RightTreeId = 'RightTreeId'
// 包含获取树形数据所有下级，直接下级，末级等方法
let leftTreeMapping = null;
// 左侧树数据列表
let leftTreeList = []
let lefTreeDataMap = {}
let nodeOpenMap = {} // 记录节点是否已展开
export default function Transfer(props) {
	let { props: { syncTree: { createSyncTree, getTreeData, setSyncTreeData, setNodeDisable, delNodeSuceess,addNodeSuccess, getCheckedKeys, setNodeChecked, openNodeByPk,closeNodeByPk,getTreeToList } } } = $appRoot
	// 组件传参
	let {
		dataSource = [],
		targetKeys = [],
		titles = ['', ''],
		rowKey = 'key', // 和默认值相同时可以不指定
		rowTitle = 'title',
		rowChildren = 'children',
		// treeType =true,
		onTargetKeysChange = () => { },
		checkStrictly = true,
		HBOrgStructTree = false,
		hideRightDataInLeft = true,
		selectedValue = 'getCurrent' // getCurrent | getDeepLower | getLower | getLeaf
		// checkable = true,
		// className ='my-transfer-demo',
		// showMoveBtn = true,
		// defaultExpandAll = true,
		// listRender =({ key, title }) => title
	} = props
	// 多语
	const [json, jsonSet] = useState({})
	useEffect(() => {
		$nccPlatform.getMultiLang({
			domainName: 'ufoc', moduleId: 'public_lang', callback: (res) => {
				jsonSet(res)
			}
		})
	}, []);
	// 按钮置灰状态
	const [btnDisabled, btnDisabledSet] = useState({
		['>']: true,
		['>>']: false,
		['<']: true,
		['<<']: true,
	})
	// 左侧全选复选框
	const [leftTreeCheckAll, leftTreeCheckAllSet] = useState(false)
	const [indeterminateLeft, indeterminateLeftSet] = useState(false)
	// 左侧选中数量
	const [leftTreeSelectCount, leftTreeSelectCountSet] = useState(0)
	window.leftTreeSelectCountSet = leftTreeSelectCountSet
	// 左侧总数量
	const [leftTreeCount, leftTreeCountSet] = useState(0)
	// 左侧树数据
	const [treeData, treeDataSet] = useState([])
	// 左侧树全选
	const leftTreeCheckAllFn = (val) => {
		leftTreeCheckAllSet(val)
		let checkedKeyArr = val ? leftTreeList.filter(ele => !ele.disabled).map(item => item[rowKey]) : []
		setNodeChecked(LeftTreeId, checkedKeyArr)
		leftTreeSelectCountSetFn(checkedKeyArr)
	}
	// 修改左侧选中数量
	const leftTreeSelectCountSetFn = (checkedKeyArr) => {
		leftTreeSelectCountSet(checkedKeyArr.length)
		leftTreeCheckAllSet(checkedKeyArr.length === leftTreeCount)
		indeterminateLeftSet(checkedKeyArr.length > 0 && checkedKeyArr.length < leftTreeCount)
	}
	useEffect(() => {
		btnDisabled['>'] = leftTreeSelectCount > 0 ? false : true
		btnDisabledSet({ ...btnDisabled })
	}, [leftTreeSelectCount]);
	useEffect(() => {
		btnDisabled['>>'] = leftTreeCount > 0 ? false : true
		btnDisabledSet({ ...btnDisabled })
	}, [leftTreeCount]);

	// 设置左侧树数据
	useEffect(() => {

		setSyncTreeData(LeftTreeId, treeData);
		setNodeChecked(LeftTreeId, [])
		leftTreeMapping = $nccUtil.getTeeHandler(treeData);
		if (treeData.length) {
			// 有数据就展开根节点
			openNodeByPk(LeftTreeId, treeData[0][rowKey]);
		}
	}, [treeData]);
	// 监听dataSource变化,组件初始化
	useEffect(() => {
		if (!Array.isArray(dataSource)) {
			dataSource = []
		}
		if (dataSource[0]) {
			// 根节点有pid的值影响树的搜索功能
			delete dataSource[0].pid
		}
		if (HBOrgStructTree) {
			editKey(dataSource)
		}
		let dataSourceCopy = _.cloneDeep(dataSource)
		leftTreeList = []
		tree2Array(dataSourceCopy, (node) => {
			leftTreeList.push(node)
			lefTreeDataMap[node.key] = node
			nodeOpenMap[node.key] = false
		});		
		// setSyncTreeData(RightTreeId, treeData);
		leftTreeCountSet(leftTreeList.filter(ele => !ele.disabled).length)		
		treeDataSet(dataSourceCopy)
	}, [dataSource]);
	// 回显右移数据
	useEffect(() => {
		let rightTreeData = leftTreeList.filter(item => targetKeys.includes(item[rowKey]))
		rightTreeData = rightTreeData.map(item => {
			let newItem = {...item}
			delete newItem.pid
			return newItem
		})
		setSyncTreeData(RightTreeId, rightTreeData);
		rightTreeCountSet(rightTreeData.length)
		if (hideRightDataInLeft) {
			// let leftData = getTreeToList(LeftTreeId)
			treeDataSet(_.cloneDeep(dataSource)) // 有可能左侧树已空，从右侧穿回来一个叶子节点数据，此时需要在左侧树恢复树结构
			// 穿梭到右侧的数据从左侧树上移除
			// let rightKeys = rightTreeData.map(item => item.key)
			let deleteKeys = canDeleteKeys(_.cloneDeep(dataSource),[...targetKeys].reduce((total,cur)=>{
				total[cur] = true
				return total
			},{}))
			// 等待左侧树渲染完才能删除节点和展开节点
			setTimeout(() => {
				deleteKeys.forEach(key => {
					delNodeSuceess(LeftTreeId, key)
				})
				openNodeByPk(LeftTreeId,targetKeys)
				let leftLength = getTreeToList(LeftTreeId).length - leftTreeList.filter(ele => ele.disabled).length
				console.warn(leftLength)
				leftTreeCountSet(leftLength >= 0 ? leftLength : 0)			
			}, 100);
		}	
	}, [targetKeys]);
	// 整合要放到右侧树的数据
	const getFormatTreeData = (isAll = false) => {
		let checkedKeys = isAll
			? leftTreeList.filter(item => !item.disabled).map(item => item.key)
			: getCheckedKeys(LeftTreeId);
		let rightTreeChecked = 	getTreeData(RightTreeId)
		// if (hideRightDataInLeft) {
		// 	// 穿梭到右侧的数据从左侧树上移除
		// 	let rightKeys = rightTreeChecked.map(item => item.key)
		// 	let deleteKeys = canDeleteKeys(getTreeData(LeftTreeId),[...rightKeys,...checkedKeys].reduce((total,cur)=>{
		// 		total[cur] = true
		// 		return total
		// 	},{}))
		// 	deleteKeys.forEach(key => {
		// 		delNodeSuceess(LeftTreeId, key)
		// 	})
		// }	
		let rightData = [...rightTreeChecked,...leftTreeMapping[selectedValue](checkedKeys)];
		return rightData
	};


	// 右侧全选复选框
	const [rightTreeCheckAll, rightTreeCheckAllSet] = useState(false)
	const [indeterminateRight, indeterminateRightSet] = useState(false)
	// 右侧选中数量
	const [rightTreeSelectCount, rightTreeSelectCountSet] = useState(0)
	// 右侧总数量
	const [rightTreeCount, rightTreeCountSet] = useState(0)
	// 右侧树数据
	const [rightTreeData, rightTreeDataSet] = useState([])
	// 右侧树全选
	const rightTreeCheckAllFn = (val) => {
		rightTreeCheckAllSet(val)
		setNodeChecked(RightTreeId, val ? getTreeData(RightTreeId).map((it) => it[rowKey]) : [])
		rightTreeSelectCountSetFn()
	}
	// 修改右侧选中数量
	const rightTreeSelectCountSetFn = () => {
		let checkedKeyarr = getCheckedKeys(RightTreeId);
		rightTreeSelectCountSet(checkedKeyarr.length)
		rightTreeCheckAllSet(checkedKeyarr.length === rightTreeCount)
		indeterminateRightSet(checkedKeyarr.length > 0 && checkedKeyarr.length < rightTreeCount)
	}
	useEffect(() => {
		btnDisabled['<'] = rightTreeSelectCount > 0 ? false : true
		btnDisabledSet({ ...btnDisabled })
	}, [rightTreeSelectCount]);
	useEffect(() => {
		btnDisabled['<<'] = rightTreeCount > 0 ? false : true
		btnDisabledSet({ ...btnDisabled })
	}, [rightTreeCount]);
	// 重置左右树勾选情况
	const afterTransfer = (rightTreeData = []) => {
		// 过滤掉不能右移的数据
		setNodeChecked(LeftTreeId, []);
		leftTreeSelectCountSet(0)
		leftTreeCheckAllSet(false)
		setNodeChecked(RightTreeId, []);
		rightTreeCheckAllSet(false)
		rightTreeSelectCountSet(0)
		indeterminateLeftSet(false)
		indeterminateRightSet(false)
		// console.warn(rightTreeData)
		rightTreeData = rightTreeData.filter(item => item.disabled != true)
		rightTreeCountSet(rightTreeData.length)
		// 传递右移数据
		let rightTargetKeys = rightTreeData.map((it) => it[rowKey])
		onTargetKeysChange(rightTargetKeys, rightTreeData)
	}
	// 定义的模拟穿梭框穿梭数据的方法
	const handleBtnClick = {
		['>']() {
			afterTransfer(getFormatTreeData())
		},
		['>>']() {
			afterTransfer(getFormatTreeData(true))
			// storeRightKeysData(rightTreeData);
		},
		['<<']() {
			treeDataSet(_.cloneDeep(dataSource))
			afterTransfer([])
		},
		['<']() {
			let checkedKeys = getCheckedKeys(RightTreeId);
			for (let key of checkedKeys) {
				// 效率 ？ delNode 不支持数组?
				delNodeSuceess(RightTreeId, key);
			}
			let rightTreeData = getTreeData(RightTreeId)
			afterTransfer(rightTreeData)
			
			// this.storeRightKeysData(rightTreeData);
		}
	}
	return (
		<div id="steps_approval">
			<div className={'steps_approval'}>
				<div className={'step_transfer_approval'}>
					<div className={'step_common step_left'}>
						<div className={'tree_topDiv'}>
							<div className={'tree_topCount'}>
								<NCCheckbox
									colors="info"
									onChange={leftTreeCheckAllFn}
									checked={leftTreeCheckAll}
									indeterminate={indeterminateLeft}
								/>
								<span>{json['public_lang-000293']}（{leftTreeSelectCount}/{leftTreeCount}）</span>
							</div>
						</div>
						{
							createSyncTree({
								treeId: LeftTreeId, // 组件id
								needSearch: true, //是否需要查询框，默认为true,显示。false: 不显示
								showModal: true, //是否使用弹出式编辑
								needEdit: false, //是否使用弹出式编辑
								checkStrictly,
								checkable: true, //复选框
								searchType: 'filtration', //树的过滤
								// checkStrictly:false,
								noCheckWhenSelect: true,
								alwaysSelect:true, // 可以让onSelectEve在重复单选节点时重复触发
								onCheckEve(props, checkedKeys, { checked, checkedNodes, node, event }) { //选中复选框回调
									// 过滤掉disabled的节点
									leftTreeSelectCountSetFn(checkedNodes.filter(item => !item.props.disabled).map(item => item.key))
								},
								onSelectEve(refpk, item, isChange, node) { //选择节点回调方法
									// let checkedKeyArr = 
									// leftTreeSelectCountSetFn()
									// console.warn(refpk)
									// console.warn(refpk, item, isChange, node)
									if (nodeOpenMap[refpk]) {
										setTimeout(() => {
											closeNodeByPk(LeftTreeId, refpk)	
										}, 200);
										nodeOpenMap[refpk] = false
									} else {
										openNodeByPk(LeftTreeId, refpk)	
										nodeOpenMap[refpk] = true
									}
								}
							})
						}
					</div>
					<div className={'step_btn_wrapper'}>
						<div className={'step_btn'}>
							<NCButton disabled={btnDisabled['>']} onClick={handleBtnClick[">"]}><i class="iconfont icon-chuansuo-you"></i></NCButton>
							<NCButton disabled={btnDisabled['>>']} onClick={handleBtnClick[">>"]}><i class="iconfont icon-chuansuo-quanbuyou"></i></NCButton>
							<NCButton disabled={btnDisabled['<']} onClick={handleBtnClick["<"]}><i class="iconfont icon-chuansuo-you zuo"></i></NCButton>
							<NCButton disabled={btnDisabled['<<']} onClick={handleBtnClick["<<"]}><i class="iconfont icon-chuansuo-quanbuyou zuo"></i></NCButton>
						</div>
					</div>
					<div className={'step_common step_right'}>
						<div className={'tree_topDiv'}>
							<div className={'tree_topCount'}>
								<NCCheckbox
									colors="info"
									onChange={rightTreeCheckAllFn}
									checked={rightTreeCheckAll}
									indeterminate={indeterminateRight}
								/>
								<span>{json['public_lang-000294']}（{rightTreeSelectCount}/{rightTreeCount}）</span>
							</div>
						</div>
						{
							createSyncTree({
								searchType: 'filtration',
								treeId: RightTreeId, // 组件id
								needSearch: true, //是否需要查询框，默认为true,显示。false: 不显示
								showModal: true, //是否使用弹出式编辑
								needEdit: false, //是否使用弹出式编辑
								checkable: true, //复选框
								onSelectEve(refpk, item, isChange, node) {
									rightTreeSelectCountSetFn()
									// openNodeByPk(RightTreeId, refpk)

								},
								onCheckEve() {
									rightTreeSelectCountSetFn()
								},
								getSearchVal(val) {
									// setSyncTreeData(RightTreeId)
									// rightTreeSelectCountSetFn()
								}
							})
						}
					</div>
				</div>
			</div>
		</div>
	)
}
// 修改节点key值
function editKey(treeData) {
	treeData.forEach(node => {
		if (node.nodeData.pk_org) {
			node.key = node.nodeData.pk_org
			node.refpk = node.nodeData.pk_org
			node.id = node.nodeData.pk_org
		}
		if (node.children && node.children.length > 0) {
			editKey(node.children)
		}
	});
}
// 树转数组
function tree2Array(root, fVisit = () => { }) {
	let queue = Array.isArray(root) ? [...root] : [root];
	while (queue.length) {
		let node = queue.shift();

		let cloneNode = { ...node }
		delete cloneNode.children
		// delete cloneNode.pid
		fVisit(cloneNode);
		if (!node) {
			return
		}
		if (node.children) {
			Array.prototype.push.apply(queue, node.children)
		}
	}
};

/**
 * @description 根据树形数据返回对象形式的数据，key为树节点的key,值是树节点本身
 * @param {*} treeData
 */
function getTreeObjData(treeData) {
	let treeObj = {}
	let fn = (data) => {
		data.forEach(item => {
			treeObj[item.key] = item
			if (item.children && item.children.length > 0) {
				fn(item.children)
			}
		})
	}
	fn(treeData)
	// 去掉children树形
	Object.keys(treeObj).forEach(item => {
		delete item.children
	})
	return treeObj
}

/**
 * @description 根据key数组过滤树的数据
 * @param {*} treeData
 * @param {*} targetKeysMap
 */
function filterTreeData (treeData,targetKeysMap) {
	[...treeData].forEach((node,index) => {
		if (targetKeysMap[node.key]) {
			if (!node.children || node.children.length === 0) {
				treeData.splice(index,1)
			} else {
				// 获取当前节点的所有下级的key值,判断是否都在targetKeysMap中
				let flag = true
				tree2Array(node.children,(node) => {
					if (!targetKeysMap[node.key]) {
						flag = false
					}
				})
				if (flag) {
					treeData.splice(index,1)
				} else {
					filterTreeData(node.children,targetKeysMap)
				}
			}
		} else {
			if (node.children && node.children.length > 0) {
				filterTreeData(node.children,targetKeysMap)
			}
		}
	})
	return treeData
}
/**
 * @description 根据key数组过滤树的数据
 * @param {*} treeData
 * @param {*} targetKeysMap
 */
function canDeleteKeys (treeData,targetKeysMap,arr = []) {
	[...treeData].forEach((node,index) => {
		if (targetKeysMap[node.key]) {
			if (!node.children || node.children.length === 0) {
				// treeData.splice(index,1)
				arr.push(node.key)
			} else {
				// 获取当前节点的所有下级的key值,判断是否都在targetKeysMap中
				let flag = true
				tree2Array(node.children,(node) => {
					if (!targetKeysMap[node.key]) {
						flag = false
					}
				})
				if (flag) {
					// treeData.splice(index,1)
					arr.push(node.key)
				} else {
					canDeleteKeys(node.children,targetKeysMap,arr)
				}
			}
		} else {
			if (node.children && node.children.length > 0) {
				canDeleteKeys(node.children,targetKeysMap,arr)
			}
		}
	})
	return arr
}

