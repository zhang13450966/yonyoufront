/*
 * @Author: chaiwx 
 * @PageInfo: 内部结算规则卡片页初始化  
 * @Date: 2018-04-10 12:23:59 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-09-18 11:18:33
 */

export default function(props) {
	modifierMeta(props, props.printMeta);
	props.meta.setMeta(props.printMeta);
}

function modifierMeta(props, meta) {
	// 分组字段，主要用于判断是否包含物料分类(物料分类需特殊处理)
	let groupKeys = props.groupKeys;

	// 声明物料分类字段
	let marClassCode = {
		label: '物料分类编码',
		itemtype: 'input',
		attrcode: 'marClassCode',
		visible: true
	};
	let marClassName = {
		label: '物料分类',
		itemtype: 'input',
		attrcode: 'marClassName',
		visible: true
	};

	// meta上是否已经存在物料分类相关字段
	let flag = false;

	// 所有与子表区域关联的区域
	meta.gridrelation[props.bodyCode].tabRelation.forEach((tab) => {
		// 设置分类字段显隐性
		meta[tab].items.map((item) => {
			if (item.attrcode == 'marClassCode' || item.attrcode == 'marClassName') {
				flag = true;
				item.visible = groupKeys.includes('marClassCode');
			}
		});

		// 如果通过物料分类合并、且meta中没有分类字段，增加
		if (!flag && groupKeys.includes('marClassCode')) {
			meta.gridrelation[props.bodyCode].tabRelation.forEach((tab) => {
				meta[tab].items.splice(1, 0, marClassName, marClassCode);
			});
		}
	});
}
