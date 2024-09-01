/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-04 17:18:24
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-05 10:29:22
 */

function headRowSelect(props, moduleId, record, index) {
	if (props.cardTable.getStatus(moduleId) !== 'browse') {
		props.cardTable.focusRowByIndex(moduleId, this.selectIndex);
		return false;
	} else {
		this.selectIndex = index;
		return true;
	}
}

export { headRowSelect };
