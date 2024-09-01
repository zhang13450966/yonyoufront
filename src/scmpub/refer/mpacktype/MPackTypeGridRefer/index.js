/*
 * @Author: 王龙华 
 * @PageInfo: 包装箱类型参照
 * @Date: 2018-09-21 11:27:25 
 * @Last Modified by: zhngzh
 * @Last Modified time: 2019-05-07 14:56:00
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
		refName: 'REFER-000036' /* 国际化处理： 包装箱类型*/,
		refCode: 'nccloud.web.scmpub.ref.MPackTypeGridReferAction',
		queryGridUrl: '/nccloud/scmpub/refer/MPackTypeGridRefer.do',

		columnConfig: [
			{
				name: [ 'REFER-000037', 'REFER-000038' ] /* 国际化处理： 包装箱类型编码,包装箱类型名称*/,
				code: [ 'vcode', 'vname' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
