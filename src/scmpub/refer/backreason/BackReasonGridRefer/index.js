/*
 * @Author: 王龙华 
 * @PageInfo: 退货理由参照 
 * @Date: 2018-08-17 10:07:47 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-22 19:40:41
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
		refName: 'REFER-000000' /* 国际化处理： 退货理由设置*/,
		refCode: 'scmpub.ref.BackReasonGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/BackReasonGridRefer.do',

		columnConfig: [
			{
				name: [ 'REFER-000001', 'REFER-000002', 'REFER-000003', 'REFER-000004' ] /* 国际化处理： 编码,名称,失效日期,备注*/,
				code: [ 'vbackreasoncode', 'vbackreasonname', 'dinvalidate', 'vmemo' ]
			}
		],
		isMultiSelectedEnabled: false
	};

	return <Refer {...Object.assign(conf, props)} />;
}
