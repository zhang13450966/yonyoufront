/*
 * @Author: gaoxqf
 * @PageInfo: 销售指标期间参照  
 * @Date: 2019-05-28 19:12:15 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-03-02 15:57:42
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
		refName: 'REFER-000061' /* 国际化处理：指标周期列表*/,
		refCode: 'scmpub.ref.SaleTargetPeriodGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/SaleTargetPeriodGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000062', 'REFER-000063', 'REFER-000064' ] /* 国际化处理： 指标周期,开始日期,结束日期*/,
				code: [ 'vperiod', 'dprdbegindate', 'dprdenddate' ]
			}
		],
		isMultiSelectedEnabled: false
	};
	return <Refer {...Object.assign(conf, props)} />;
}
