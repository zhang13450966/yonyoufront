/*
 * @Author: zhangshqb 
 * @PageInfo: 工具类
 * @Date: 2018-12-26 11:03:03 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-15 17:41:29
 */

function getDataByIndex(props, modelid, index) {
	let datas = [];
	let allDatas = props.editTable.getAllRows(modelid);
	for (let i = 0; i < allDatas.length; i++) {
		if (index.includes(i)) {
			let data = {
				key: allDatas[i].rowid,
				values: allDatas[i].values,
				status: 0,
				selected: allDatas[i].selected
			};

			datas.push(data);
		}
	}
	return datas;
}

export { getDataByIndex };
