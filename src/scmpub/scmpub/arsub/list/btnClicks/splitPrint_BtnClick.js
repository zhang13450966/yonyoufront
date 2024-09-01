/*
 * @Author: wangshrc 
 * @PageInfo: 打印功能实现
 * @Date: 2018-04-10 09:37:25 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-28 18:46:48
 */

import React, { Component } from 'react';
import { print, base, ajax } from 'nc-lightapp-front';
import { ARSUB_CONST } from '../../const';
import getSelectedOperaDatas from './listPageData';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function btnClick(props) {
	let seldatas = getSelectedOperaDatas(props);

	if (seldatas == null || seldatas.index == undefined) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000026')); /* 国际化处理： 请选择要打印的订单！*/
		return;
	}
	let pks = [];
	let selrows = props.table.getAllTableData(ARSUB_CONST.formId).rows;

	seldatas.index.forEach((element) => {
		pks.push(selrows[element].values.corderhistoryid.value);
	});

	let pk_org = props.table.getCheckedRows(ARSUB_CONST.formId)[0].data.values.pk_org.value;
	let queryinfo = { pk_org: pk_org };
	ajax({
		url: '/nccloud/so/saleorder/querysplitparam.do',
		data: queryinfo,
		success: (res) => {
			if (res.success) {
				let splitData = {
					params: res.data,
					printType: 'pdf',
					printUrl: '/nccloud/so/saleorderrevise/splitprint.do',
					pks: pks
				};
				this.setState({ showSpilt: true, splitData: splitData });
			}
		}
	});
}
