export default function(datas, srchead, srcbody, head, body, itemmap, extatt) {
	let destdatas = [];
	if (!datas) return destdatas;

	for (let data of datas) {
		let destdata = {};
		// 转换表头
		let headrows = data.head[srchead].rows;
		let headmap = itemmap[head];

		let destHeadData = translate(head, headrows, headmap, extatt);

		destdata.head = destHeadData;
		// 转换表体
		let bodyrows = data.body[srcbody].rows;
		let bodydmap = itemmap[body];
		let destBodyData = translate(body, bodyrows, bodydmap);

		destdata.body = destBodyData;
		destdatas.push(destdata);
	}

	return destdatas;
}
export function translate(tab, tabrows, tabmap, extatt) {
	let rows = [];
	for (let row of tabrows) {
		let values = {};
		for (let destkey of Object.keys(tabmap)) {
			let srcValue = row.values[tabmap[destkey]];
			values[destkey] = srcValue;
		}
		if (extatt) {
			for (let extkey of Object.keys(extatt)) {
				values[extkey] = extatt[extkey];
			}
		}
		rows.push({ values: values });
	}
	let desttabdata = {
		[tab]: { rows: rows }
	};
	return desttabdata;
}
