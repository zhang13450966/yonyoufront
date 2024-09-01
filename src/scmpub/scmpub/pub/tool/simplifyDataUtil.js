/*
 * @PageInfo: 简化数据处理类
 * @Author: guozhq
 * @Date: 2018-12-27 15:42:41
 * @Last Modified by: liulux
 * @Last Modified time: 2022-04-11 21:35:25
 */
/**
 *
 * @param {*} data 要处理的数据结构
 * @param {*} flag 是否简化scale的处理（默认是true）
 */
function simplifyData(data, flag = true) {
	if (data && Array.isArray(data.rows) && data.rows.length) {
		let newData = {
			...data,
			rows: []
		};
		data.rows.forEach((item) => {
			if (item && item.values) {
				let newValues = {};
				for (let pop in item.values) {
					if (item.values[pop]) {
						if (!isEmpty(item.values[pop].value)) {
							newValues[pop] = { value: item.values[pop].value };
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop].scale = item.values[pop].scale;
							}
						} else {
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop] = { scale: item.values[pop].scale };
							} else {
								// newValues[pop] = {};
							}
						}
					}
				}
				newData.rows.push({
					...item,
					values: newValues
				});
			}
		});
		return newData;
	}
	return data;
}
function simplifyDataByFields(data, flag = true, bodyFields, isInclude = true) {
	if (data && Array.isArray(data.rows) && data.rows.length) {
		let newData = {
			...data,
			rows: []
		};
		data.rows.forEach((item) => {
			if (item.values) {
				let newValues = {};
				for (let pop in item.values) {
					if (!bodyFields) {
						if (!isEmpty(item.values[pop].value)) {
							newValues[pop] = { value: item.values[pop].value };
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop].scale = item.values[pop].scale;
							}
						} else {
							if (!flag && item.values[pop].scale != -1) {
								newValues[pop] = { scale: item.values[pop].scale };
							}
						}
					} else {
						if (isInclude) {
							if (bodyFields.includes(pop)) {
								newValues[pop] = { value: item.values[pop].value };
							}
						} else {
							if (!bodyFields.includes(pop)) {
								newValues[pop] = { value: item.values[pop].value };
							}
						}
					}
				}
				newData.rows.push({
					...item,
					values: newValues
				});
			}
		});
		return newData;
	}
	return data;
}

// 判断第一个参数是否为空，后面可以传其他【认为是空值】的参数
function isEmpty(val, ...rest) {
	if (val === null || val === undefined || val === '' || rest.find((e) => e == val)) {
		return true;
	}
	return false;
}

export { simplifyData, simplifyDataByFields };
