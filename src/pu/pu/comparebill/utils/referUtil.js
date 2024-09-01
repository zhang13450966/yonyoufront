/**
 * 设置参照显示业务单元
 * @param {*} props 
 * @param {*} area 区域编码 
 * @param {*} fields 参照字段 为空，认为区域内全参照字段
 * @param {*} isShow 显示还是隐藏
 * @returns meta
 */
function setReferMultiUnitShow(meta, area, fields = [], isShow = true) {
	meta[area].items.map((item) => {
		let fieldcode = item.attrcode;
		if (fields.length > 0) {
			if (fields.includes(fieldcode)) {
				item.isShowUnit = isShow;
			}
		} else {
			if (item.itemtype === 'refer') {
				item.isShowUnit = isShow;
			}
		}
	});
	return meta;
}

/**
 * 设置参照显示业务单元（按照单个Item）
 * @param {*} item 
 * @param {*} fields 
 * @param {*} isShow 
 */
function setReferMultiUnitShowByItem(item, fields = [], isShow = true) {
	let fieldcode = item.attrcode;
	if (fields.includes(fieldcode)) {
		item.isShowUnit = isShow;
	}
}

/**
 * 设置主组织权限-默认是表格型的，存货核算大部分都是成本域
 * @param {*} item 
 * @param {*} type
 */
function setRefMainOrgPermissonByItem(item, type) {
	if (type && type === MAINORG_TYPE.TREE) {
		item.queryCondition = () => {
			return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
		};
	} else {
		item.queryCondition = () => {
			return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
		};
	}
}

/**
 * 设置主组织权限-默认是表格型的，存货核算大部分都是成本域
 * @param {*} item 
 * @param {*} type
 */
function setRefMainOrgPermisson(meta, area, field, type) {
	meta[area].items.map((item) => {
		if (item.attrcode === field) {
			if (type && type === MAINORG_TYPE.TREE) {
				item.queryCondition = () => {
					return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
				};
			} else {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
				};
			}
		}
	});
	return meta;
}

/**
 * 设置主组织权限(VID字段)
 * @param {*} item 
 */
function setRefMainOrgVIDPermissonByItem(item, type) {
	if (type && type === MAINORG_TYPE.TREE) {
		item.queryCondition = () => {
			return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
		};
	} else {
		item.queryCondition = () => {
			return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
		};
	}
}

/**
 * 初始化业务单元多选
 * @param {*} meta meta
 * @param {*} searchAreaID 区域id
 * @param {*} fields 字段
 * @param {*} defPrefix 自定义项前缀
 * @param {*} freePrefix 自由辅助属性前缀
 */
function initMultiSelect(meta, searchAreaID, fields, defPrefix, freePrefix) {
	let searchItems = meta[searchAreaID].items;
	if (!Array.isArray(fields)) {
		fields = [ fields ];
	}

	if (!defPrefix) {
		defPrefix = [];
	} else if (!Array.isArray(defPrefix)) {
		defPrefix = [ defPrefix ];
	}

	if (!freePrefix) {
		freePrefix = [];
	} else if (!Array.isArray(freePrefix)) {
		freePrefix = [ freePrefix ];
	}

	searchItems.map((item) => {
		if (fields.includes(item.attrcode)) {
			item.isShowUnit = true;
		}
		for (let i = 0; i < freePrefix.length; i++) {
			if (item.attrcode.indexOf(freePrefix[i]) == 0) {
				item.isShowUnit = true;
			}
		}
		for (let i = 0; i < defPrefix.length; i++) {
			if (item.attrcode.indexOf(defPrefix[i]) == 0) {
				item.isShowUnit = true;
			}
		}
	});
}

/**
 * 查询组织多选处理
 * @param {*} props 
 * @param {*} searchAreaID 查询区ID
 * @param {*} orgField 组织字段
 * @param {*} relationFields 关联字段
 * @param {*} defPrefix 自定义项前缀 可空
 * @param {*} freePrefix 自由辅助属性前缀 可空
 */
function orgMultiSelectHandler(props, searchAreaID, orgField, relationFields, defPrefix, freePrefix) {
	let meta = props.meta.getMeta();
	let searchItems = meta[searchAreaID].items;

	if (!Array.isArray(relationFields)) {
		relationFields = [ relationFields ];
	}

	if (!defPrefix) {
		defPrefix = [];
	} else if (!Array.isArray(defPrefix)) {
		defPrefix = [ defPrefix ];
	}

	if (!freePrefix) {
		freePrefix = [];
	} else if (!Array.isArray(freePrefix)) {
		freePrefix = [ freePrefix ];
	}

	//获取当前关联字段的值
	let fieldValue = props.search.getSearchValByField(searchAreaID, orgField);
	//判断当前值是否为空
	if (
		fieldValue &&
		fieldValue.value &&
		fieldValue.value.firstvalue &&
		fieldValue.value.firstvalue.indexOf(',') == -1
	) {
		searchItems.map((item) => {
			if (relationFields.includes(item.attrcode)) {
				item.isShowUnit = false;
			}
			for (let i = 0; i < freePrefix.length; i++) {
				if (item.attrcode.indexOf(freePrefix[i]) == 0) {
					item.isShowUnit = false;
				}
			}
			for (let i = 0; i < defPrefix.length; i++) {
				if (item.attrcode.indexOf(defPrefix[i]) == 0) {
					item.isShowUnit = false;
				}
			}
		});
	} else {
		searchItems.map((item) => {
			if (relationFields.includes(item.attrcode)) {
				item.isShowUnit = true;
			}
			for (let i = 0; i < freePrefix.length; i++) {
				if (item.attrcode.indexOf(freePrefix[i]) == 0) {
					item.isShowUnit = true;
				}
			}
			for (let i = 0; i < defPrefix.length; i++) {
				if (item.attrcode.indexOf(defPrefix[i]) == 0) {
					item.isShowUnit = true;
				}
			}
		});
	}
	props.meta.setMeta(meta);
}

/**
 * 主组织格式类型：Grid or Tree
 */
const MAINORG_TYPE = {
	GRID: 'grid',
	TREE: 'tree'
};

export {
	MAINORG_TYPE,
	setReferMultiUnitShow,
	setReferMultiUnitShowByItem,
	setRefMainOrgPermisson,
	setRefMainOrgPermissonByItem,
	setRefMainOrgVIDPermissonByItem,
	orgMultiSelectHandler,
	initMultiSelect
};
