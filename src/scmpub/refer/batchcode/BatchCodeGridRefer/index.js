/*
 * @Author: 王龙华 
 * @PageInfo: 批次号档案参照 
 * @Date: 2018-06-22 10:02:55 
 * @Last Modified by: caoaa7
 * @Last Modified time: 2022-06-15 15:57:22
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
		placeholder: 'REFER-000005' /* 国际化处理： 批次档案*/,
		refName: 'REFER-000006' /* 国际化处理： 批次参照*/,
		refCode: 'scmpub.ref.BatchCodeDefaultGridRefer',
		refType: 'grid',
		showCodeWhenFocus: false,
		queryGridUrl: '/nccloud/scmpub/refer/BatchCodeGridRefer.do',
		columnConfig: [
			{
				name: [ 'REFER-000007', 'REFER-000008' ] /* 国际化处理： 物料名称,批次号*/,
				code: [ 'refcode', 'refname' ]
			}
		],
		//参照获取焦点时显示名称
		isMultiSelectedEnabled: false,
		unitProps: {
			multiLang: {
				domainName: 'scmpub',
				currentLocale: 'zh-CN',
				moduleId: 'refer'
			},
			refType: 'gridTree',
			refName: 'REFER-000009' /* 国际化处理： 物料参照*/,
			placeholder: 'REFER-000009' /* 国际化处理： 物料参照*/,
			refCode: 'uapbd.ref.MaterialClassTreeGridRef',
			queryTreeUrl: '/nccloud/uapbd/ref/MaterialClassTreeRef.do',
			queryGridUrl: '/nccloud/uapbd/ref/MaterialGridRef.do',
			rootNode: { refname: 'REFER-000010', refpk: 'root' } /* 国际化处理： 物料基本分类*/,
			isShowUnit: true,
			queryCondition: {
				GridRefActionExt: 'nccloud.web.scmpub.ref.MaterialoidRefFilterUtils',
				scm_wholemanaflag: 'Y'
			},
			key: 'pk_material',
			fieldid: 'pk_material',
			unitProps: {
				multiLang: {
					domainName: 'scmpub',
					currentLocale: 'zh-CN',
					moduleId: 'refer'
				},
				refType: 'tree',
				refName: 'REFER-000011' /* 国际化处理： 业务单元*/,
				refCode: 'uapbd.refer.org.BusinessUnitTreeRef',
				rootNode: { refname: 'REFER-000011', refpk: 'root' } /* 国际化处理： 业务单元*/,
				placeholder: 'REFER-000011' /* 国际化处理： 业务单元*/,
				queryTreeUrl: '/nccloud/uapbd/org/BusinessUnitTreeRef.do',
				treeConfig: {
					name: [ 'REFER-000001', 'REFER-000002' ],
					code: [ 'refcode', 'refname' ]
				} /* 国际化处理： 编码,名称*/,
				isMultiSelectedEnabled: false,
				fieldid: 'pk_org'
			},
			columnConfig: [
				{
					name: [
						'REFER-000012',
						'REFER-000013',
						'REFER-000007',
						'REFER-000014',
						'REFER-000015',
						'REFER-000016',
						'REFER-000017',
						'REFER-000018',
						'REFER-000019'
					] /* 国际化处理： 所属组织,物料编码,物料名称,规格,型号,物料简称,助记码,图号,主计量单位*/,
					code: [
						'org_name',
						'refcode',
						'refname',
						'materialspec',
						'materialtype',
						'materialshortname',
						'materialmnecode',
						'graphid',
						'measdoc_name'
					],
					checked: {
						graphid: false,
						measdoc_name: false
					}
				}
			]
		}
	};

	return <Refer {...Object.assign(conf, props)} />;
}
