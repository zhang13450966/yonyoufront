/*
 * @Author: lichaoah
 * @PageInfo: 销售指标项参照  
 * @Date: 2020-03-02 10:10:08 
 * @Last Modified by: yangls7
 * @Last Modified time: 2020-03-13 13:48:18
 */

import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props = {}) {
	var conf = {
		multiLang: {
			domainName: 'scmpub',
			currentLocale: 'zh-CN',
			moduleId: 'refer'
		},
		refType: 'grid',
		refName: 'REFER-000065' /* 国际化处理： 指标项*/,
		refCode: 'scmpub.refer.SaleTargetItemGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/SaleTargetItemGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000066', 'REFER-000067' ] /* 国际化处理： 指标项名称,指标项类别*/,
				code: [ 'vtargetname', 'fitemtypeflag' ]
			}
		],
		isMultiSelectedEnabled: false
	};
	return <Refer {...Object.assign(conf, props)} />;
}
