import { ajax } from 'nc-lightapp-front';
// 获取关联应用数据
export function getRelatedAppData(appcode, pagecode) {
	return new Promise((resolve) => {
		ajax({
			data: {
				appcode,
                pagecode
			},
			url: '/nccloud/report/graphic/associateQuery.do',
			success: (res) => {
				resolve(res.data);
			}
		});
	});
}
// 设置默认方案
export function setDefaultScheme(data) {
	return new Promise((resolve) => {
		ajax({
			data,
			url: '/nccloud/report/graphic/associateUpdatePresetScheme.do',
			success: (res) => {
				resolve(res);
			}
		});
	});
}