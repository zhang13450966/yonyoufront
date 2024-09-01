/*
 * @Author: chaiwx 
 * @PageInfo: 联查凭证
 * @Date: 2018-06-25 09:56:26 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-13 13:25:48
 */
import { FIELDS, REQUESTURL, AREA } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
		return;
	}

	checkArr[0].data.values[FIELDS.pk_taxinvoice].value;

	let pk_group = checkArr[0].data.values[FIELDS.pk_group].value;
	let pk_org = checkArr[0].data.values[FIELDS.pk_org].value;
	let pk_taxinvoice = checkArr[0].data.values[FIELDS.pk_taxinvoice].value;
	let vtrantypecode = checkArr[0].data.values[FIELDS.vtrantypecode].value;
	let fstatusflag = checkArr[0].data.values[FIELDS.fstatusflag].value;

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
