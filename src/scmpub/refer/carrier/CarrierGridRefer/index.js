/*
 * @Author: 王龙华 
 * @PageInfo: 承运商表格参照 
 * @Date: 2018-06-21 14:47:25 
 * @Last Modified by: cuijunjun
 * @Last Modified time: 2018-12-26 13:54:36
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
		refName: 'REFER-000020' /* 国际化处理： 承运商定义*/,
		refCode: 'scmpub.ref.CarrierGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/CarrierGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000021', 'REFER-000022' ] /* 国际化处理： 承运商编码,承运商名称*/,
				code: [ 'refcode', 'refname' ]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
