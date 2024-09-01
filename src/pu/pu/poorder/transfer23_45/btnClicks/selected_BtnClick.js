import translateData from '../utils/translateData';
import { PAGECODE, PAGEAREA, PK, URL, KEYMAP } from '../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function select(data) {
	let selectdata = this.props.transferTable.getTransferTableSelectedValue();
	// // 转换为全部模板需要的数据
	let destdatas = [];
	let m23extatt = {
		cbilltypeid: { value: '23', display: getLangByResId(this, '4004POORDER-000089') }
	}; /* 国际化处理： 退货单*/
	let dest23datas = translateData(
		selectdata[PAGEAREA.head23],
		PAGEAREA.head23,
		PAGEAREA.body23,
		PAGEAREA.headall,
		PAGEAREA.bodyall,
		KEYMAP.KEYMAP23TO21,
		m23extatt
	);
	destdatas.push(...dest23datas);
	let m45extatt = {
		cbilltypeid: { value: '45', display: getLangByResId(this, '4004POORDER-000090') }
	}; /* 国际化处理： 退库单*/
	let dest45datas = translateData(
		selectdata[PAGEAREA.head45],
		PAGEAREA.head45,
		PAGEAREA.body45,
		PAGEAREA.headall,
		PAGEAREA.bodyall,
		KEYMAP.KEYMAP45TO21,
		m45extatt
	);
	destdatas.push(...dest45datas);
	if (selectdata[PAGEAREA.headall] && Object.keys(selectdata[PAGEAREA.headall])) {
		destdatas.push(...selectdata[PAGEAREA.headall]);
	}
	// 点击已选列表的钩子函数
	// this.props.transferTable.setMultiSelectedValue(
	// 	PAGEAREA.headall,
	// 	PAGEAREA.bodyall,
	// 	destdatas,
	// 	[ PK.head23, PK.head45 ],
	// 	[ PK.body45, PK.body45 ]
	// );
}
