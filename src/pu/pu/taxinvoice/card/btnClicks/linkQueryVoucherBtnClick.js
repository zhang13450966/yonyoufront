/*
 * @Author: chaiwx 
 * @PageInfo: 联查凭证
 * @Date: 2018-06-25 09:56:26 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-13 11:10:51
 */
import { FIELDS, REQUESTURL, AREA } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let pk_group = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_group).value;
	let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org).value;
	let pk_taxinvoice = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value;
	let vtrantypecode = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.vtrantypecode).value;
	let fstatusflag = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.fstatusflag).value;

	let data = {
		conditions: {
			pk_group: pk_group,
			pk_org: pk_org,
			pk_taxinvoice: pk_taxinvoice,
			vtrantypecode: vtrantypecode,
			fstatusflag: fstatusflag
		}
	};
	ajax({
		url: REQUESTURL.linkQueryVoucher,
		data: data,
		success: (res) => {
			if (res.data) {
				let srcCode = res.data.src;
				if ('_LinkVouchar2019' == srcCode) {
					//走联查
					if (res.data.des) {
						//跳转到凭证界面
						if (res.data.pklist) {
							if (res.data.pklist.length == 1) {
								//单笔联查
								props.openTo(res.data.url, {
									status: 'browse',
									appcode: res.data.appcode,
									pagecode: res.data.pagecode,
									id: res.data.pklist[0],
									n: getLangByResId(this, '4004Taxinvoice-000016'), //'联查凭证'
									// pagekey: 'link',
									backflag: 'noback'
								});
								return;
							}
						}
					}
				} else {
					showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000017')); //'没有关联的单据！'
				}
			}
		}
	});
}
