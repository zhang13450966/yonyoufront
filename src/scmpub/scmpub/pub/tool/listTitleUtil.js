/*
 * @PageInfo: 列表标题包装类 
 * @Author: guozhq 
 * @Date: 2019-08-05 16:34:15 
 * @Last Modified by: guozhq
 * @Last Modified time: 2019-08-05 16:57:40
 */
function createListHeadInfo(_this, title) {
	let { BillHeadInfo } = _this.props;
	const { createBillHeadInfo } = BillHeadInfo;
	return createBillHeadInfo({
		title: title,
		initShowBackBtn: false
	});
}

export { createListHeadInfo };
