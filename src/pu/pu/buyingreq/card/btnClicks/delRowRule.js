/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-22 16:29:27
 */
import { base } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
const { NCMessage } = base;
let tableId = BUYINGREQ_CARD.tableId;
export default function delRowRule(props, indexs) {
	let errorMessage = '';
	for (let i = 0; i < indexs.length; i++) {
		let crowno = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.crowno).value;
		//来源单据类型
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.csourcetypecode).value;
		if ('1001Z91000000001U0LZ' == csourcetypecode) {
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILL-000016') +
				crowno +
				getLangByResId(this, '4004PRAYBILL-000017'); /* 国际化处理： 第,行来源于资产配置申请, 不能删除\n*/
		}
		//行关闭
		let browclose = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.browclose).value;
		if (browclose) {
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILL-000016') +
				crowno +
				getLangByResId(this, '4004PRAYBILL-000018'); /* 国际化处理： 第,行已经关闭\n*/
		}
		//累计订货数量
		let naccumulatenum = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.naccumulatenum).value;
		//生成合同次数
		let ngenct = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.ngenct).value;
		//生成价格审批单次数
		let npriceauditbill = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.npriceauditbill).value;
		//生成询报价单次数
		let nquotebill = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.nquotebill).value;
		//发布到电子商务
		let bpublishtoec = props.cardTable.getValByKeyAndIndex(tableId, indexs[i], ATTRCODES.bpublishtoec).value;
		if (naccumulatenum > 0 || ngenct > 0 || npriceauditbill > 0 || nquotebill > 0 || bpublishtoec) {
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILL-000016') +
				crowno +
				getLangByResId(this, '4004PRAYBILL-000019'); /* 国际化处理： 第,行已经有后续单据\n*/
		}
	}
	return errorMessage;
}
