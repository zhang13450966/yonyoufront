/*
 * @Author: zhangchqf 
 * @PageInfo: 控制物料范围的列显示值 
 * @Date: 2020-03-12 17:38:24 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-03-24 09:32:20
 */

export default function(props, val, searchAreaCode, effectField) {
	let meta = props.meta.getMeta();
	let items = meta[searchAreaCode].items;
	//选择一个
	if (val && (val.length == 1 || val.values)) {
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.attrcode == effectField) {
				//如果本来就是false，直接返回
				let fmarsetflag = val.values.fmarsetflag.value;
				let columnConfig = [
					{
						name: [
							'REFER-000069',
							'REFER-000070',
							'REFER-000071',
							'REFER-000072'
						] /* 国际化处理： 行号，产品线，品牌,返利计算排除物料组合*/,
						code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'crmvmarcomid' ]
					}
				];
				if (fmarsetflag == 6) {
					columnConfig = [
						{
							name: [
								'REFER-000069',
								'REFER-000070',
								'REFER-000071',
								'REFER-000074',
								'REFER-000072'
							] /* 国际化处理： 行号，产品线，品牌,物料组合,返利计算排除物料组合*/,
							code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'cmarcombineid', 'crmvmarcomid' ]
						}
					];
				} else if (fmarsetflag == 4) {
					columnConfig = [
						{
							name: [
								'REFER-000069',
								'REFER-000070',
								'REFER-000071',
								'REFER-000076',
								'REFER-000072'
							] /* 国际化处理： 行号，产品线，品牌,物料销售分类,返利计算排除物料组合*/,
							code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'cmarsaleclassid', 'crmvmarcomid' ]
						}
					];
				} else if (fmarsetflag == 3) {
					columnConfig = [
						{
							name: [
								'REFER-000069',
								'REFER-000070',
								'REFER-000071',
								'REFER-000075',
								'REFER-000072'
							] /* 国际化处理： 行号，产品线，品牌,物料基本分类,返利计算排除物料组合*/,
							code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'cmarbaseclassid', 'crmvmarcomid' ]
						}
					];
				} else if (fmarsetflag == 5) {
					columnConfig = [
						{
							name: [
								'REFER-000069',
								'REFER-000070',
								'REFER-000071',
								'REFER-000077',
								'REFER-000072'
							] /* 国际化处理： 行号，产品线，品牌,物料,返利计算排除物料组合*/,
							code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'cmaterialid', 'crmvmarcomid' ]
						}
					];
				}
				item.columnConfig = columnConfig;
				break;
			}
		}
	}
	props.meta.setMeta(meta);
}
