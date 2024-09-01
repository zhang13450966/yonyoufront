/*
 * @Author: 王龙华 
 * @PageInfo: 促销类型参照 
 * @Date: 2018-06-06 22:49:12 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-22 19:45:15
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
		refName: 'REFER-000039' /* 国际化处理： 促销类型*/,
		refCode: 'scmf.ref.PromotTypeGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/PromotTypeGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000040', 'REFER-000041' ] /* 国际化处理： 促销类型编码,促销类型名称*/,
				code: [ 'vcode', 'vname' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
