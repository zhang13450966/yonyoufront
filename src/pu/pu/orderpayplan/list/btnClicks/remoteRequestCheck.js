/*
 * @Author: CongKe 
 * @PageInfo: 付款申请、付款
 * @Date: 2018-09-03 09:55:03 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-03-01 14:29:49
 */
import { ajax, toast, cacheTools } from 'nc-lightapp-front';
import { PAYPLANDATASOURCE, URL } from '../../constance';

export default function remoteRequestCheck(props, url, data, pay, pks) {
	if (url && data) {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.success && res.error == null) {
					let pushdata = res.data[0];
					let srcbilltype = '21';
					let cachekey = null;
					let pushUrl = null;
					//pay:21TO36D1Pks、21TO36D1Pks
					if (PAYPLANDATASOURCE.paykey == pay) {
						pushUrl = '/nccloud/resources/arap/paybill/paybill/main/index.html#/card';
						cachekey = PAYPLANDATASOURCE.paykey;
						cacheTools.set(cachekey, pks);
						props.openTo(pushUrl, {
							srcbilltype: srcbilltype,
							pagecode: pushdata.pagecode,
							appcode: pushdata.appcode,
							status: 'add',
							type: 'transfer'
						});
					} else {
						pushUrl = '/nccloud/resources/cmp/apply/apply/main/index.html#/ref22';
						cachekey = PAYPLANDATASOURCE.payreqkey;
						cacheTools.set(cachekey, pks);
						props.openTo(pushUrl, {
							srcbilltype: srcbilltype,
							//pagecode: pushdata.pagecode,
							appcode: pushdata.appcode,
							status: 'add'
						});
					}
				}
			},
			error: (error) => {
				toast({
					color: 'warning',
					content: error.message
				});
			}
		});
	}
}
