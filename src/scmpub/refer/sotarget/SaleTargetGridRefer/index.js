/*
 * @Author: gaoxqf
 * @PageInfo: 销售指标表参照  
 * @Date: 2019-05-28 19:12:15 
 * @Last Modified by: gaoxqf
 * @Last Modified time: 2020-02-18 15:35:16
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
		refName: 'REFER-000058' /* 国际化处理： 销售指标表*/,
		refCode: 'scmpub.ref.SaleTargetGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/SaleTargetGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000059', 'REFER-000060' ] /* 国际化处理： 指标表编码,指标表名称*/,
				code: [ 'vcode', 'vname' ]
			}
		],
		isMultiSelectedEnabled: false
	};
	return <Refer {...Object.assign(conf, props)} />;
}
