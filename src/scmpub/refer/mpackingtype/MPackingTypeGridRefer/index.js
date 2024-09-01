/*
 * @Author: zhngzh 
 * @Date: 2019-05-06 13:48:02 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-16 19:52:39
 */
import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function(props) {
	var conf = {
		multiLang: {
			domainName: 'scmpub',
			currentLocale: 'zh-CN',
			moduleId: 'refer'
		},
		refType: 'grid',
		refName: 'REFER-000055',
		refCode: 'nccloud.web.scmpub.ref.MPackingTypeGridReferAction',
		queryGridUrl: '/nccloud/scmpub/refer/MPackingTypeGridRefer.do',

		columnConfig: [
			{
				name: [ 'REFER-000056', 'REFER-000057' ] /**包装分类编码, 包装分类名称 */,
				code: [ 'vpackingtypecode', 'vpackingtypename' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
