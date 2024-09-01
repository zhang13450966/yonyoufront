/*
 * @Author: lichaoah 
 * @Date: 2018-07-02 14:36:36 
 * @Last Modified by: zhaoypm
 * @Last Modified time: 2018-07-31 10:46:47
 * 
 * 设置是否可以使用可切换组织过滤：单选则不可切换组织，不选和多选可切换
 * @param {*} props 
 * @param {*} val 编辑后输入的值，用于判断编辑后输入个数
 * @param {*} searchAreaCode 查询区编码
 * @param {*} effectField 被影响的查询条件的code值,分为数组和单个字符串两种情况
 */
export default function(props, val, searchAreaCode, effectField) {
	let meta = props.meta.getMeta();
	let items = meta[searchAreaCode].items;
	//定义一个数字，用于记录设置的次数，如果所有都已经设置，则停止遍历
	let num = 0;
	//假如传入的是数组
	if (typeof effectField == 'object' && effectField.constructor == Array) {
		//选择一个
		if (val && (val.length == 1 || val.refpk)) {
			for (let i = 0; i < items.length; i++) {
				for (let j = 0, len = effectField.length; j < len; j++) {
					let item = items[i];
					if (item.attrcode == effectField[j]) {
						//如果本来就是false，直接返回
						if (item.isShowUnit && item.isShowUnit == false) {
							continue;
						} else {
							num++;
							item.isShowUnit = false;
							if (num == len) break;
						}
					}
				}
			}
		} else {
			for (let i = 0; i < items.length; i++) {
				for (let j = 0, len = effectField.length; j < len; j++) {
					let item = items[i];
					if (item.attrcode == effectField[j]) {
						//如果本来就是true，直接返回
						if (item.isShowUnit) {
							continue;
						} else {
							num++;
							item.isShowUnit = true;
							if (num == len) break;
						}
					}
				}
			}
		}
	} else if (typeof effectField == 'string' && effectField.constructor == String) {
		//假如传入的是单个code
		if (val && (val.length == 1 || val.refpk)) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (item.attrcode == effectField) {
					item.isShowUnit = false;
				}
			}
		} else {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (item.attrcode == effectField) {
					item.isShowUnit = true;
				}
			}
		}
	}
	props.meta.setMeta(meta);
}
/**
 * 多组织字段初始化 
 * @param {array} items 
 * @param {string,array} effectField 需要设置isShowUnit的字段
 */
export function multiCorpInit(items, effectField) {
	if (!items) {
		return;
	}
	//初始化所有字段的isShowUnit
	initIsShowUnit(items, effectField);
}
/**
 * 非指定字段设置为false,指定字段设置为true
 * @param {array} items 
 * @param {array} effectField 
 */
function initIsShowUnit(items, effectField) {
	//简单起见，先把所有的字段的isShowUnit属性全部设置为false，这也是最终平台默认的效果
	items.map((item) => {
		item.isShowUnit = false;
	});
	//再把指定字段设置为true
	setIsShowUnitTrue(items, effectField);
}
/**
 * 设置isShowUnit为false
 * @param {Array} items 
 * @param {string} attrcode 需要赋值的字段key,可以为字符串或者数组
 */
function setIsShowUnitTrue(items, attrcode) {
	setIsShowUnit(items, attrcode, true);
}
/**
 * 设置isShowUnit为true
 * @param {Array} items 
 * @param {string} attrcode 需要赋值的字段key
 */
function setIsShowUnitFasle(items, attrcode) {
	setIsShowUnit(items, attrcode, false);
}
/**
 * 给isShowUnit赋值
 * @param {Array} items 
 * @param {string} attrcode 需要赋值的字段key,可以为字符串或者数组
 * @param {Boolean} effective isShowUnit的值，true or false
 */
function setIsShowUnit(items, attrcode, effective) {
	if (typeof attrcode == 'object' && attrcode.constructor == Array) {
		items.map((item) => {
			if (attrcode.includes(item.attrcode)) {
				item.isShowUnit = effective;
			}
		});
	}
	if (typeof attrcode == 'string' && attrcode.constructor == String) {
		items.map((item) => {
			if (attrcode == item.attrcode) {
				item.isShowUnit = effective;
			}
		});
	}
}
