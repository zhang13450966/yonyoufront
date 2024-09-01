/*
 * @Author: CongKe 
 * @PageInfo: 采购订单编辑前
 * @Date: 2018-06-11 20:53:36 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-25 15:16:32
 */
import { toast } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import effRateMnyBeforeEvent from './effRateMnyBeforeEvent';

export default async function beforeEdit(props, moduleId, item, value, index, record) {
	let key = item.attrcode;
	let flag = true;
	if (moduleId == PAGECODE.tableId) {
		if (key == 'iitermdays' || key == 'bpreflag' || key == 'crowno') {
			//起算日期 ,账期到期日 ,账期天数 ,原币金额 ,比率 ,预付款 ,行号
			let naccumpayapporgmny = record.values.naccumpayapporgmny && record.values.naccumpayapporgmny.value;
			let naccumpayorgmny = record.values.naccumpayorgmny && record.values.naccumpayorgmny.value;
			naccumpayapporgmny = naccumpayapporgmny == null ? 0 : naccumpayapporgmny;
			naccumpayorgmny = naccumpayorgmny == null ? 0 : naccumpayorgmny;
			if (naccumpayapporgmny > 0 || naccumpayorgmny > 0) {
				// 只允许编辑原币金额，账期到期日
				if (!('norigmny' == key || 'denddate' == key)) {
					flag = false;
					toast({
						color: 'warning',
						content: getLangByResId(this, '4004OPAYPLAN-000006') /* 国际化处理： 已生成付款申请或付款单，只允许编辑原币金额，账期到期日字段*/
					});
					//return false add by zhaoypm @2018-09-14 for jira NCCLOUD-60518
					return false;
				}
			}
			flag = true;
		} else if (key == FIELD.feffdatetype || key == FIELD.NORIGMNY || key == FIELD.NRATE) {
			if (key == FIELD.feffdatetype) {
				let dbegindate = record.values.dbegindate.value;
				if (dbegindate) {
					return false;
				}
			}
			// 起算依据、金额、比率编辑前
			// 累计付款申请金额
			let naccumpayapporgmny = record.values.naccumpayapporgmny && record.values.naccumpayapporgmny.value;
			// 累计付款金额
			let naccumpayorgmny = record.values.naccumpayorgmny && record.values.naccumpayorgmny.value;
			naccumpayapporgmny = naccumpayapporgmny == null ? 0 : naccumpayapporgmny;
			naccumpayorgmny = naccumpayorgmny == null ? 0 : naccumpayorgmny;
			if (naccumpayapporgmny > 0 || naccumpayorgmny > 0) {
				// 累计付款申请金额或者累计付款金额有值时，不允许起算依据、金额、比率
				return false;
			}
			// 孙表有累计应付金额时，不允许编辑起算依据、金额、比率
			let hid = record.values[FIELD.hid] ? record.values[FIELD.hid].value : null;
			let pk_order = record.values[FIELD.pk_order] ? record.values[FIELD.pk_order].value : null;
			let params = { hid, key, pk_order };
			return await effRateMnyBeforeEvent.call(this, params);
		} else if (key == FIELD.DBEGINDATE || key == FIELD.DENDDATE) {
			// 里程碑采购
			let bismilepost = record.values[FIELD.bismilepost].value;
			// 起算依据
			let feffdatetype = record.values[FIELD.feffdatetype].value;
			/**
			 * 预置的付款时点 
			 * 1001Z01000000000F04J - 采购合同生效日期
			 * 1001Z01000000000F04K - 采购订单审核日期
			 * 1001Z01000000000F04L - 采购发票日期
			 * 1001Z01000000000F04M - 采购发票审核日期
			 * 1001Z01000000000F04N - 到货审核日期
			 * 1001Z01000000000F04O - 入库日期
			 * 1001Z01000000000F04P - 入库签字日期
			 */
			let pk_payperiods = [
				'1001Z01000000000F04J',
				'1001Z01000000000F04K',
				'1001Z01000000000F04L',
				'1001Z01000000000F04M',
				'1001Z01000000000F04N',
				'1001Z01000000000F04O',
				'1001Z01000000000F04P',
				'1001Z01000000000F04Q',
				'1001Z01000000000F04R',
				'1001Z01000000000F04S',
				'1001Z01000000000F04T',
				'1001Z01000000000F04U',
				'1001Z01000000000F04V',
				'1001Z01000000000F04W',
				'1001Z01000000000F04X',
				'1001Z01000000000F04Y',
				'1001Z01000000000F04Z',
				'1001Z01000000000F050',
				'1001Z01000000000F051',
				'1001Z01000000000F052'
			];
			if (bismilepost) {
				// 里程碑采购不允许编辑起算日期和账期到账日
				return false;
			} else {
				// 非里程碑采购，系统预置的起算依据，起算日期和账期到账日不允许编辑
				if (pk_payperiods.includes(feffdatetype)) {
					return false;
				} else {
					return true;
				}
			}
		} else {
			return false;
		}
		return true;
	}
}
