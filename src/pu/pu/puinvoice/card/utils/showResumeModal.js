import React from 'react';
import './index.less';
import { promptBox } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function showReumeModal(props, dlgcode, skipCodes, expinfo, okBtnClick, deletClick, ...args) {
	if (expinfo.showStyle === 'simple') {
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: expinfo.title,
			content: getShowContent(props, expinfo),
			noFooter: false,
			noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
			beSureBtnName: getLangByResId(this, '4004PUINVOICE-000081'), // 确定按钮名称, 默认为"确定",非必输
			cancelBtnName: getLangByResId(this, '4004PUINVOICE-000082'), //国际化：取消
			hasCloseBtn: true, //显示“X”按钮，默认不显示，不显示是false，显示是true
			beSureBtnClick: beSureBtnClick.bind(
				this,
				props,
				skipCodes,
				expinfo.exceptionType,
				expinfo.isStrict,
				okBtnClick,
				...args
			), //点击确定按钮事件
			closeModalEve: '',
			cancelBtnClick: cancelBtnClick.bind(
				this,
				props,
				skipCodes,
				expinfo.exceptionType,
				expinfo.isStrict,
				deletClick,
				...args
			)
		});
	}
}

function getShowContent(props, expinfo) {
	if (expinfo.showStyle === 'simple') {
		return expinfo.message;
	}
	window.location.hash = window.location.hash + `?c=${props.getSearchParam('c')}`;
	return <iframe src={expinfo.url} style={{ width: '100%' }} id="iframe" />;
}

function beSureBtnClick(props, skipCodes, exceptionType, isStrict, okBtnClick, ...args) {
	if (okBtnClick && !isStrict) {
		skipCodes ? skipCodes.push(exceptionType + '=Y') : (skipCodes = [ exceptionType + '=Y' ]);
		// skipCodes[exceptionType] = 'Y';
		okBtnClick.call(this, ...args, skipCodes);
	}
}

function cancelBtnClick(props, skipCodes, exceptionType, isStrict, deletClick, ...args) {
	if (deletClick && !isStrict) {
		skipCodes ? skipCodes.push(exceptionType + '=N') : (skipCodes = [ exceptionType + '=N' ]);
		// skipCodes[exceptionType] = 'N';
		deletClick.call(this, ...args, skipCodes);
	}
}
