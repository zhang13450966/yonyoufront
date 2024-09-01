/*
 * @Author: raoczh 
 * @PageInfo: 拉单界面单据号超链接
 * @Date: 2019-08-20 10:32:13 
 * @Last Modified by: zhengxinm
 * @Last Modified time: 2019-09-09 14:11:13
 */
/**
 * @param {*} props 
 * @param {*} item 
 * @param {object} config 跳转需要的参数
 * @param {true/false} isAllPage 是否是全部页签
 */
function transferSkipToSrcBillUtil(props, item, config, isAllPage = false) {
	if (isAllPage) {
		const { billtypefield, billcodefield = 'vbillcode', pkfield } = config;
		if (item.attrcode == billcodefield) {
			//取消固定宽度，不然保存列宽失效
			// item.width = 150;
			item.renderStatus = 'browse';
			item.render = (text, record, index) => {
				let id = pkfield ? record[pkfield].value : record.headKey;
				if (record[billtypefield] && record[billtypefield].value) {
					let billtype = record[billtypefield].value;
					return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={(e) => {
								e.stopPropagation();
								props.openTo(null, {
									billtype: billtype,
									//单据类型中的卡片联查
									sence: 4,
									status: 'browse',
									id: id
								});
							}}
						>
							{!record[billcodefield].display ? (
								record[billcodefield].value
							) : (
								record[billcodefield].display
							)}
						</a>
					);
				} else {
					return text.display || text.value;
				}
			};
			return item;
		}
	} else {
		const { billtype, billcodefield = 'vbillcode', pkfield } = config;
		if (item.attrcode == billcodefield) {
			item.width = 150;
			item.renderStatus = 'browse';
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={(e) => {
							if (billtype && record[pkfield]) {
								e.stopPropagation();
								props.openTo(null, {
									billtype: billtype,
									//单据类型中的卡片联查
									sence: 4,
									status: 'browse',
									id: record[pkfield].value
								});
							}
						}}
					>
						{!record[billcodefield].display ? record[billcodefield].value : record[billcodefield].display}
					</a>
				);
			};
			return item;
		}
	}
}
export { transferSkipToSrcBillUtil };
