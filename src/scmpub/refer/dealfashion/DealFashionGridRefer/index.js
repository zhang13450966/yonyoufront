/*
 * @Author: 王龙华 
 * @PageInfo: 处理方式参照 
 * @Date: 2018-06-06 14:47:25 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-09-29 20:59:09
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
		refName: 'REFER-000026' /* 国际化处理： 处理方式*/,
		refCode: 'scmpub.ref.DealFashionGridRefer',
		queryGridUrl: '/nccloud/scmpub/refer/DealFashionGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000027', 'REFER-000028' ] /* 国际化处理： 处理方式编码,处理方式名称*/,
				code: [ 'cdealfashcode', 'cdealfashname' ]
			}
		],
		isMultiSelectedEnabled: false,
		/**
		 * 参照添加新增按钮 begin
		 * hasAddButton  是否启用【新增】功能，true-启用，false-不启用
		 * addButtons 新增按钮列表，参数是数组
		 */
		hasAddButton: true,
		addButtons: [
			{
				name: 'REFER-000026' /* 国际化处理： 处理方式*/,
				appcode: '400101002',
				pagecode: '400101002_list'
			}
		]
		// 参照新增添加 end
	};

	return <Refer {...Object.assign(conf, props)} />;
}
