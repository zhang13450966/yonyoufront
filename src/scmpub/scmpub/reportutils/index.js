import { ajax } from 'nc-lightapp-front';
/**
 * 报表联查到单据方法
 * @param {*} data 报表数据，报表平台提供
 * @param {*} pkCode 报表选中数据行上主键对应的code
 * @param {*} billTypeCode 支持可以传对象
 * @param {*} callback 请求成功的回调函数，用于对返回的url进行特殊操作的情况，可以不传
 */
export function drillToBill(props, transSaveObject, data, pkCode, billTypeCode, callback) {
	if (typeof billTypeCode == 'object') {
		data = {
			...data,
			transSaveObject,
			pkCode,
			...billTypeCode
		};
	} else {
		data = {
			...data,
			transSaveObject,
			pkCode,
			billTypeCode
		};
	}

	//默认回调
	let defaultCallBack = (res) => {
		if (res.success) {
			//下面是平台提供的方法，但现在不支持新页签打卡，所以先用window.open
			props.openTo(res.data.url, {
				...res.data,
				status: 'browse'
			});
		}
	};
	ajax({
		url: '/nccloud/scmpub/report/drillquery.do',
		data: data,
		method: 'post',
		success: callback || defaultCallBack
	});
}
