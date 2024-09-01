/**
 * 物料自由辅助属性编辑前处理，需要物料的固定辅助属性库存状态启用
 * 这类方法必须有返回值，返回true为可编辑，false为不可编辑
 */
import { ajax, toast } from 'nc-lightapp-front';

export default function(props, constance) {
	return new Promise(function(resolve, reject) {
		let pk_org = constance && constance.params && constance.params.pk_org;
		let materialvid = constance && constance.params && constance.params.materialvid;
		if (pk_org != null && materialvid != null) {
			let data = {
				key: constance.key,
				params: constance.params
			};
			ajax({
				url: '/nccloud/pu/pub/beforeevent.do',
				data: data,
				success: (res) => {
					if (res.data) {
						let isedit = res.data.isedit;
						if (isedit) {
							resolve(isedit);
						} else {
							if (res.data.message) {
								toast({
									color: 'warning',
									content: res.data.message
								});
							}
							resolve(false);
						}
					}
				},
				error: (error) => {
					toast({
						color: 'warning',
						content: error.message
					});
					resolve(false);
				}
			});
		} else {
			resolve(false);
		}
	});
}
