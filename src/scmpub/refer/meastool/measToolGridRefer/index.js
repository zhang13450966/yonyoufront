/*
 * @Author: 王龙华 
 * @PageInfo: 计量器具参照 
 * @Date: 2018-06-21 15:46:30 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-22 19:35:08
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
		refName: 'REFER-000032' /* 国际化处理： 计量器具*/,
		refCode: 'scmpub.refer.measToolGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/measToolGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000033', 'REFER-000034', 'REFER-000035', 'REFER-000004' ] /* 国际化处理： 计量秤编码,计量秤名称,组号,备注*/,
				code: [ 'vmeastoolcode', 'vmeastoolname', 'vgroupnum', 'vnote' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
