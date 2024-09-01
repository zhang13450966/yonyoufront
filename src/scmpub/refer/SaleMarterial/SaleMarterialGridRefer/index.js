/*
 * @Author: zhangchqf 
 * @PageInfo: 销售指标物料期间参照 
 * @Date: 2020-03-09 11:21:27 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-03-12 17:34:41
 */

import React, { Component } from 'react';
import { ajax } from 'nc-lightapp-front';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props = {}) {
	//cmarbaseclassid 物料基本分类，cmarsaleclassid 物料销售分类, cmaterialid 物料
	var conf = {
		multiLang: {
			domainName: 'scmpub',
			currentLocale: 'zh-CN',
			moduleId: 'refer'
		},
		columnConfig: [
			{
				name: [
					'REFER-000069',
					'REFER-000070',
					'REFER-000071',
					'REFER-000072'
				] /* 国际化处理： 行号，产品线，品牌,返利计算排除物料组合*/,
				code: [ 'cmarrowno', 'cprodlineid', 'cbrandid', 'crmvmarcomid' ]
			}
		],
		refType: 'grid',
		refName: 'REFER-000068' /* 国际化处理：物料范围*/,
		refCode: 'scmpub.ref.SaleMarGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/SaleMarGridRefer.do',
		isMultiSelectedEnabled: false
	};
	return <Refer {...Object.assign(conf, props)} />;
}
