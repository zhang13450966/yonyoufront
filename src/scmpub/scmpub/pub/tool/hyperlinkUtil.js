/*
 * @Author: chaiwx 
 * @PageInfo: 超链接工具
 * @Date: 2022-04-14 15:22:57 
 * @Last Modified by: chaiwx 
 * @Last Modified time: 2022-04-14 15:22:57 
 */

/**
 * 给simpletable字段设置超链接
 * @param {*} props 
 * @param {*} meta meta
 * @param {*} config 跳转参数
 * @returns 
 */
function setHyperlinkForSimpleTableField(props, meta, config) {
	let {
		moduleId, // 区域编码
		linkField, // 超链接字段
		billtype, // 单据类型
		billtypeField, // 单据类型字段，针对表格数据有多种单据类型，有单据类型字段
		pkField, // 超链接目标单据主键
		sence = 4 // 联查场景，一般超链接走单据联查，单据联查为4
	} = config;

	meta[moduleId].items.map((item, key) => {
		if (item.attrcode == linkField) {
			item.renderStatus = 'browse';
			item.render = (text, record, index) => {
				let billid = record[pkField].value;
				billtype = billtype ? billtype : record[billtypeField].value;

				if (billtype && billid) {
					return (
						<span
							className="code-detail-link"
							onClick={(e) => {
								e.stopPropagation();
								props.openTo(null, {
									billtype: billtype,
									sence: sence,
									status: 'browse',
									id: billid
								});
							}}
						>
							{!record[linkField].display ? record[linkField].value : record[linkField].display}
						</span>
					);
				} else {
					return !record[linkField].display ? record[linkField].value : record[linkField].display;
				}
			};
		}
	});
}

/**
 * 给edittable字段设置超链接
 * @param {*} props 
 * @param {*} meta meta
 * @param {*} config 跳转参数
 * @returns 
 */
function setHyperlinkForEditTableField(props, meta, config) {
	let {
		moduleId, // 区域编码
		linkField, // 超链接字段
		billtype, // 单据类型
		billtypeField, // 单据类型字段，针对表格数据有多种单据类型，有单据类型字段
		pkField, // 超链接目标单据主键
		sence = 4 // 联查场景，一般超链接走单据联查，单据联查为4
	} = config;

	meta[moduleId].items.map((item, key) => {
		if (item.attrcode == linkField) {
			item.renderStatus = 'browse';
			item.render = (text, record, index) => {
				let billid = record.values[pkField].value;
				billtype = billtype ? billtype : record.values[billtypeField].value;

				if (billtype && billid) {
					return (
						<span
							className="code-detail-link"
							onClick={(e) => {
								e.stopPropagation();
								props.openTo(null, {
									billtype: billtype,
									sence: sence,
									status: 'browse',
									id: billid
								});
							}}
						>
							{!record.values[linkField].display ? (
								record.values[linkField].value
							) : (
								record.values[linkField].display
							)}
						</span>
					);
				} else {
					return !record.values[linkField].display
						? record.values[linkField].value
						: record.values[linkField].display;
				}
			};
		}
	});
}
export { setHyperlinkForSimpleTableField, setHyperlinkForEditTableField };
