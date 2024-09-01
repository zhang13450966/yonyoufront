import { MappingType } from './const';
// 获取三种类型的分析参数
export function getFilterParamArr(associated_object = []) {
	this.constantArr = [];
	this.fieldArr = [];
	this.conditionArr = [];
	associated_object.forEach((item) => {
		if (item.mappingType === MappingType['constant'] && item.paramValue) {
			this.constantArr.push(item);
		}
		if (item.mappingType === MappingType['condition']) {
			this.conditionArr.push(item);
		}
		if (item.mappingType === MappingType['field']) {
			this.fieldArr.push(item);
		}
	});
}

/**
 * 单据页面更新逻辑
 * @param {*} type 操作类型，点击查询 or 手动更新
 * @param {*} searchInfo 查询区的条件
 * @returns
 */
export function handleBillUpdateLogic(type, searchInfo) {
	// 手动点击更新数据按钮
	if (type === 'manualUpdate') {
		let pkcodeArr = []; // 单据列表选中的pkcode，送给后端去处理
		const { headId, pkname, _this } = this.props;
		let res = _this.props.table.getCheckedRows(headId);
		if (Array.isArray(res)) {
			pkcodeArr = res.map((item) => {
				let { data } = item;
				if (data.values) {
					let { value } = data.values[pkname] || {};
					return value;
				} else {
					return data.pk;
				}
			});
		}
        this.setState({
            searchParams: {},
            analysisParams: {},
			refreshKey: Date.now(),
			pkcode: pkcodeArr,
			isLoadGraphic: true
		});
	} else {
		let constantAnalysisParams = {}; // 根据常量分析参数，将常量放到analysisParams对象中
		// 点击查询区查询按钮
		// 常量处理
		this.constantArr.forEach((item) => {
			constantAnalysisParams[item.paramName] = item.paramValue;
		});
		// 查询条件处理
		// @_@first
		// @_@second
		let filterConditionArr = this.conditionArr.map((item) => {
			let flagIndex1 = item.paramValue.indexOf('@_@first')
			if (flagIndex1 !== -1) {
				return item.paramValue.slice(0, flagIndex1)
			}
			let flagIndex2 = item.paramValue.indexOf('@_@second')
			if (flagIndex2 !== -1) {
				return item.paramValue.slice(0, flagIndex2)
			}
			return item.paramValue

		});
		searchInfo.querycondition.conditions = searchInfo.querycondition.conditions.filter((item) =>
			filterConditionArr.includes(item.field)
		);
		this.setState({
			refreshKey: Date.now(),
			pkcode: [],
			analysisParams: constantAnalysisParams,
			searchParams: { ...searchInfo },
			isLoadGraphic: true,
			showLoading: !this.state.isLoadGraphic // 只有当首次查询的时候，出现loading
		});
	}
}

/**
 * 卡片页面更新逻辑
 * @param {*} type  操作类型，上一页下一页 or 手动更新
 * @param {*} formData  主表数据
 */
export function handleCardUpdateLogic(type, formData) {
	const analysisParams = {};
	// 1.常量处理
	this.constantArr.forEach((item) => {
		analysisParams[item.paramName] = item.paramValue;
	});
	// 2. 字段处理
	const resultMap = {};
	this.fieldArr.map((item) => {
		resultMap[item.paramValue] = {
			paramName: item.paramName,
			data: []
		};
	});
	// 2.1 首先把主表中映射的字段筛选出来
	for (const [ key, data ] of Object.entries(formData)) {
		if (resultMap[key]) {
			resultMap[key].data.push(data.value);
		}
	}
	// 2.2 如果手动更新，把子表的映射的字段筛选出来
	if (type === 'manualUpdate') {
		const { bodyId, _this } = this.props;
		let selectedData = [];
		bodyId.forEach((itemId) => {
			let res = _this.props.cardTable.getCheckedRows(itemId);
			selectedData = selectedData.concat(res);
		});
		// 从用户选择的表格中筛选字段分析参数对应的值
		selectedData.forEach((itemData) => {
			let { data: { values } } = itemData;
			Object.entries(values).forEach(([ key, data ]) => {
				if (resultMap[key] && data.value) {
					resultMap[key].data.push(data.value);
				}
			});
		});
	}

	// 最后把每个字段分析参数对应的数组转为都逗号分隔的字符串
	for (const [ key, {paramName, data} ] of Object.entries(resultMap)) {
		if (data.length > 0) {
			analysisParams[paramName] = data.join(',');
		}
	}

	// 字段处理，从主表中筛选中字段对应的值
	this.setState({
		refreshKey: Date.now(),
		analysisParams,
		isLoadGraphic: true,
		showLoading: !this.state.isLoadGraphic // 只有当首次查询的时候，出现loading
	});
}
