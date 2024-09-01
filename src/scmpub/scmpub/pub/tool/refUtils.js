/*
 * @Author: wangceb
 * @PageInfo: 参照设置工具类
 * @Date: 2018-12-13 13:51:05
 * @Last Modified by: maopch
 * @Last Modified time: 2018-12-27 10:46:40
 */

/**
 * 设置人员参照是否显示离职人员
 * @param {*} item
 * @param {*} value
 */
function setPsndocShowLeavePower(item, value = true) {
	item.isShowDimission = value;
}

/**
 * 设置参照本身及上部业务单元框显示停用功能
 * @param {*} item 
 * @param {*} value 
 */
function setRefShowDisabledData(item, value = true) {
	item.isShowDisabledData = value;
	item.unitPropsExtend = {
		isShowDisabledData: value, // 显示停用
		isHasDisabledData: value // 是否有【显示停用】功能
	};
}

export { setPsndocShowLeavePower, setRefShowDisabledData };
