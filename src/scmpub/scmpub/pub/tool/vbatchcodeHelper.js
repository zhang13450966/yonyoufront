import { ajax } from 'nc-lightapp-front';
/**
 * 
 * @param {*} onhandDimParams 存量参数
 * @param {*} billParams 本单据的参数
 * @param {*} url 后台接口
 * @param {*} canInsert 是否可以新增(true时，查不到批次号时把输入值不清空，false时清空)
 * @param {*} callback 回调，用于处理vo合并，并更新表体行
 * @param {*} value 返回的数据
 */
function onBlur(onhandDimParams, billParams, url, canInsert, callback, value) {
	if (!value) {
		return;
	}
	let data = {
		onhandDimAppcode: onhandDimParams.appcode,
		onhandDimPagecode: onhandDimParams.pagecode,
		onhandDimVOGrid: {
			head: {
				areaType: 'table',
				rows: [ onhandDimParams.headRows.rows[0] ]
			},
			pageid: onhandDimParams.pagecode
		},
		appcode: billParams.appcode,
		pagecode: billParams.pagecode,
		bodyarea: billParams.bodyarea,
		currGrid: { [billParams.bodyarea]: { rows: [ billParams.record ] } },
		batchcode: value,
		canInsert
	};
	ajax({
		url: url,
		data: data,
		mode: 'normal',
		success: (res) => {
			if (callback) {
				callback.call(this, billParams.bodyarea, billParams.index, res.data);
			}
		}
	});
}
export default { onBlur };
