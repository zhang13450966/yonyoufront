/*
 * @Author: CongKe 
 * @PageInfo: 编辑前ajax远程读取编辑性
 * @Date: 2018-08-04 11:02:42 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-04 11:21:22
 */
import { ajax, toast } from 'nc-lightapp-front';
export default function remoteRequest(url, constance) {
	return new Promise(function(resolve, reject) {
		let data = {
			key: constance.key,
			params: constance.params
		};
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data) {
					let editFlag = res.data.isedit;
					if (editFlag) {
						resolve(editFlag);
					} else if (res.data.message) {
						toast({
							color: 'warning',
							content: res.data.message
						});
					}
					resolve(false);
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
	});
}
