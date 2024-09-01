/*
 * @Author: zhangjyp 
 * @PageInfo: 传金税
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:23:04
 */
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function(props) {
	let formId = this.formId;
	let meta = {
		[formId]: {
			code: [ formId ],
			moduletype: 'form',
			items: [
				{
					itemtype: 'refer',
					col: '6',
					visible: true,
					label: getLangByResId(this, '4001COMPONENTS-000024') /*收款人*/,
					attrcode: 'payer',
					required: true,
					refcode: 'uapbd/refer/psninfo/PsndocTreeGridRef/index.js'
				},
				{
					itemtype: 'refer',
					col: '6',
					visible: true,
					label: getLangByResId(this, '4001COMPONENTS-000025') /*复核人*/,
					required: true,
					attrcode: 'checker',
					refcode: 'uapbd/refer/psninfo/PsndocTreeGridRef/index.js'
				}
			]
		}
	};
	refFilter(meta, props, formId);
	props.meta.setMeta(meta, () => {
		this.props.form.setFormStatus(this.formId, 'edit');
	});
}
function refFilter(meta, props, formId) {
	meta[formId].items.map((item) => {
		//收款人
		if (item.attrcode == 'payer') {
			item.queryCondition = () => {
				//业务人员来源支持全场景
				return { pk_org: props.pk_org, busifuncode: 'all' };
			};

			//审核人
		} else if (item.attrcode == 'checker') {
			item.queryCondition = () => {
				return {
					pk_org: props.pk_org,
					busifuncode: 'all'
				};
			};
		}
	});
}
