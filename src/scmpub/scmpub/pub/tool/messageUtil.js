/*
 * 消息提示工具类
 * @Author: guozhq 
 * @Date: 2018-07-17 12:27:47 
 * @Last Modified by: chenggangk
 * @Last Modified time: 2022-06-17 13:37:42
>>>>>>> refs/heads/develop-ncc1.01
 */
import { toast, promptBox, getMultiLang } from 'nc-lightapp-front';

/**
 *  处理消息提示的多语问题，定义的提示多语容器（ES6语法支持面向对象类）
 */
class LangContainer {
	constructor() {
		this.lang = null;
		this.inlt = null;
		console.log('LangContainer初始化');
		// 初始化提示多语信息
		getMultiLang({
			moduleId: '4001pubmessage',
			domainName: 'scmpub',
			callback: this.init.bind(this),
			needInlt: true
		});
	}

	init(lang, status, inlt) {
		if (status) {
			this.lang = lang;
			this.inlt = inlt;
		}
	}

	getLangByResId(resid, param) {
		let str = resid;
		if (param) {
			str = this.inlt.get(resid, param);
			return str ? str : resid;
		} else {
			// 如果还没有加载回来，则返回空，避免页面显示多语字符串
			if (this.lang) {
				str = this.lang[resid];
				return str ? str : resid;
			} else {
				return resid;
			}
		}
	}
}

/**
 * 实例化多语容器
 */
const lang = new LangContainer();

/**
 * 显示操作成功信息
 * @param {*} title 非必输 默认：已成功
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showSuccessInfo(title, content, duration) {
	showInfo(title, content, duration);
}

/**
 * 显示警告信息
 * @param {*} title 非必输 默认：请注意
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showWarningInfo(title, content, duration) {
	showInfo(title, content, duration, 'warning');
}

/**
 * 显示显示帮助信息信息
 * @param {*} title 非必输 默认：帮助信息
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showInfoInfo(title, content, duration) {
	showInfo(title, content, duration, 'info');
}

/**
 * 显示失败信息
 * @param {*} title 非必输 默认：出错啦
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showErrorInfo(title, content, duration = 'infinity') {
	showInfo(title, content, duration, 'danger');
}

/**
 * 批量操作错误提示(修改成红框,之前是黄框)
 * @param {*} title
 * @param {*} content
 * @param {*} detailMsg
 * @param {*} param
 */
function showBatchOperateInfo(title, content, detailMsg, param = {}) {
	showInfo(
		title,
		content,
		'infinity',
		'danger',
		true,
		[
			lang.getLangByResId('4001PUBMESSAGE-000000'),
			lang.getLangByResId('4001PUBMESSAGE-000001'),
			lang.getLangByResId('4001PUBMESSAGE-000002')
		] /* 国际化处理： 展开,收起,我知道了*/,
		detailMsg,
		param.onExpand,
		param.onClose
	);
}

function showInfo(title, content, duration, color, groupOperation, TextArr, groupOperationMsg, onExpand, onClose) {
	toast({
		duration: duration, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
		color: color, // 提示类别，默认是 "success",非必输
		title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
		content: content, // 提示内容,非必输
		groupOperation: groupOperation, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		TextArr: TextArr, //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输
		groupOperationMsg: groupOperationMsg, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
		onExpand: onExpand, // 点击展开按钮的回调函数,非必输
		onClose: onClose // 关闭按钮的回调函数,非必输
	});
}

/**
 * 显示成功Dialog
 * @param {*} title 标题  非必输 默认：已成功
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showSuccessDialog(title, content, param = {}) {
	showMessageDialog(title, content, param);
}

/**
 * 显示警告Dialog
 * @param {*} title 标题  非必输 默认：请注意
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showWarningDialog(title, content, param = {}) {
	showMessageDialog(title, content, param, 'warning');
}

/**
 * 显示帮助Dialog
 * @param {*} title 标题  非必输 默认：帮助信息
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showInfoDialog(title, content, param = {}) {
	showMessageDialog(title, content, param, 'info');
}

/**
 * 显示错误Dialog
 * @param {*} title 标题  非必输 默认：出错啦 请注意 帮助信息 已成功
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showErrorDialog(title, content, param = {}) {
	showMessageDialog(title, content, param, 'danger');
}

function showMessageDialog(title, content, param = {}, color) {
	promptBox({
		color: color, // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
		title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
		content: content, // 提示内容,非必输
		noFooter: param.noFooter, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
		noCancelBtn: param.noCancelBtn, // 是否显示取消按钮,，默认显示(false),非必输
		beSureBtnName: param.beSureBtnName, // 确定按钮名称, 默认为"确定",非必输
		cancelBtnName: param.cancelBtnName, // 取消按钮名称, 默认为"取消",非必输
		beSureBtnClick: param.beSureBtnClick, // 确定按钮点击调用函数,非必输
		cancelBtnClick: param.cancelBtnClick, // 取消按钮点击调用函数,非必输
		closeBtnClick: param.closeBtnClick, //关闭按钮点击调用函数，非必输
		closeByClickBackDrop: param.closeByClickBackDrop //点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false
	});
}
// add by wangceb 批量消息提示框
function showBatchOprMessage(
	title = lang.getLangByResId('4001PUBMESSAGE-000003'),
	messageInfo,
	param = {},
	btnname = ''
) {
	/* 国际化处理： 提示*/
	let failedNum = messageInfo.failedNum;
	let sucessNum = messageInfo.sucessNum;
	// 全部成功，提示即可
	if (failedNum == 0) {
		showSuccessInfo(
			lang.getLangByResId('4001PUBMESSAGE-000018', { 0: btnname }),
			lang.getLangByResId('4001PUBMESSAGE-000022', { 0: messageInfo.sucessNum })
		); /* 国际化处理： 处理成功{0}条！*/
	} else if (sucessNum == 0) {
		title = lang.getLangByResId('4001PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('4001PUBMESSAGE-000020', {
			0: messageInfo.failedNum,
			1: messageInfo.failedNum
		});
		/* 国际化处理：共处理{0}条，失败{1}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('4001PUBMESSAGE-000000'),
				lang.getLangByResId('4001PUBMESSAGE-000001'),
				lang.getLangByResId('4001PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose // 关闭按钮的回调函数,非必输
		});
	} else {
		title = lang.getLangByResId('4001PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('4001PUBMESSAGE-000021', {
			0: Number(messageInfo.sucessNum) + Number(messageInfo.failedNum),
			1: messageInfo.sucessNum,
			2: messageInfo.failedNum
		}); /* 国际化处理： 共处理{0}条，成功{1}条，失败{2}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('4001PUBMESSAGE-000000'),
				lang.getLangByResId('4001PUBMESSAGE-000001'),
				lang.getLangByResId('4001PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose // 关闭按钮的回调函数,非必输
		});
	}
}

/**
 * 显示提示取消对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showCancelDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000007'),
		lang.getLangByResId('4001PUBMESSAGE-000008'),
		param
	); /* 国际化处理： 取消,确定要取消吗?*/
}

/**
 * 显示提示卡片单个删除对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showSingleDeleteDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000009'),
		lang.getLangByResId('4001PUBMESSAGE-000010'),
		param
	); /* 国际化处理： 删除,确定要删除吗?*/
}

/**
 * 显示提示列表多个删除对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showDeleteDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000009'),
		lang.getLangByResId('4001PUBMESSAGE-000011'),
		param
	); /* 国际化处理： 删除,确定要删除所选数据吗?*/
}

/**
 * 显示提示列表多个启用对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showEnableDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000031'),
		lang.getLangByResId('4001PUBMESSAGE-000032'),
		param
	); /* 国际化处理： 启用,确定要启用所选数据吗?*/
}

/**
 * 显示提示列表多个停用对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showDisableDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000033'),
		lang.getLangByResId('4001PUBMESSAGE-000034'),
		param
	); /* 国际化处理： 停用,确定要停用所选数据吗?*/
}

/**
 * 显示提示修改主组织对话框
 * @param {*} param 参数(对象) 必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick  closeBtnClick closeByClickBackDrop
 */
function showChangeOrgDialog(param = {}) {
	showWarningDialog(
		lang.getLangByResId('4001PUBMESSAGE-000012'),
		lang.getLangByResId('4001PUBMESSAGE-000013'),
		param
	); /* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息?*/
}

/**
 * 查询结果提示消息
 * @param {*} successNum 可不传
 */
function showHasQueryResultInfo(successNum) {
	if (successNum) {
		showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000015', { 1: successNum })); /**国际化处理：查询成功，共{0}条 */
	} else {
		showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000014') /**查询成功 */);
	}
}

/**
 * 转单或者不分页签的查询结果提示消息
 * @param {*} successNum 可不传
 */
function showQueryResultInfoForNoPage(successNum) {
	if (successNum) {
		showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000015', { 1: successNum })); /**国际化处理：查询成功，共{0}条 */
	} else {
		showNoQueryResultInfo();
	}
}

/**
 * 没有查询结果提示消息
 */
function showNoQueryResultInfo() {
	showWarningInfo(null, lang.getLangByResId('4001PUBMESSAGE-000016')); /**国际化处理：未查询出符合条件的数据 */
}

/**
 * 请选择数据！ 
 * 适配打印次数按钮添加 add by yinl 20200822 
 */
function showCheckDataWarningInfo() {
	showWarningInfo(null, lang.getLangByResId('4001PUBMESSAGE-000030')); /**国际化处理：请选择数据! */
}

/**
 * 刷新成功提示消息
 */
function showRefreshInfo() {
	showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000017')); /**国际化处理：刷新成功 */
}

/**
 * 保存成功提示消息
 */
function showSaveInfo() {
	showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000023')); /**国际化处理：保存成功 */
}

// add by CongKe 返回批量消息内容并弹出提示
function showBatchOprReturnMessage(
	title = lang.getLangByResId('4001PUBMESSAGE-000003'),
	messageInfo,
	param = {},
	btnname = ''
) {
	let msgcontent = '';
	/* 国际化处理： 提示*/
	let failedNum = messageInfo.failedNum;
	let sucessNum = messageInfo.sucessNum;
	// 全部成功，提示即可
	if (failedNum == 0) {
		showSuccessInfo(
			lang.getLangByResId('4001PUBMESSAGE-000018', { 0: btnname }),
			lang.getLangByResId('4001PUBMESSAGE-000022', { 0: messageInfo.sucessNum })
		); /* 国际化处理： 处理成功{0}条！*/
		msgcontent = lang.getLangByResId('4001PUBMESSAGE-000022', { 0: messageInfo.sucessNum });
	} else if (sucessNum == 0) {
		title = lang.getLangByResId('4001PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('4001PUBMESSAGE-000020', {
			0: messageInfo.failedNum,
			1: messageInfo.failedNum
		});
		/* 国际化处理：共处理{0}条，失败{1}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('4001PUBMESSAGE-000000'),
				lang.getLangByResId('4001PUBMESSAGE-000001'),
				lang.getLangByResId('4001PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose, // 关闭按钮的回调函数,非必输
			customBtn: param.customBtn // JSX结构,有批量消息时，并且是展开状态显示，按钮放在原有按钮后面。如果传入span标签，样式会跟原有的按钮样式保持一致，特殊样式请自己实现
		});
		messageInfo.errorMessages.forEach((e) => {
			msgcontent += e;
		});
		// msgcontent += messageInfo.errorMessages;
	} else {
		title = lang.getLangByResId('4001PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('4001PUBMESSAGE-000021', {
			0: Number(messageInfo.sucessNum) + Number(messageInfo.failedNum),
			1: messageInfo.sucessNum,
			2: messageInfo.failedNum
		}); /* 国际化处理： 共处理{0}条，成功{1}条，失败{2}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('4001PUBMESSAGE-000000'),
				lang.getLangByResId('4001PUBMESSAGE-000001'),
				lang.getLangByResId('4001PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose, // 关闭按钮的回调函数,非必输
			customBtn: param.customBtn // JSX结构,有批量消息时，并且是展开状态显示，按钮放在原有按钮后面。如果传入span标签，样式会跟原有的按钮样式保持一致，特殊样式请自己实现
		});
		messageInfo.errorMessages.forEach((e) => {
			msgcontent += e;
		});
		// msgcontent += messageInfo.errorMessages;
	}
	return msgcontent;
}

/**
 * 点击卡片界面返回按钮显示警告Dialog
 * @param {*} title 标题  非必输 默认：请注意
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showBackWarningDialog(param = {}) {
	showMessageDialog(
		lang.getLangByResId('4001PUBMESSAGE-000024'), // 返回
		lang.getLangByResId('4001PUBMESSAGE-000025'), // 有未保存的单据，确定要返回吗?
		param,
		'warning'
	);
}

/**
 * 点击卡片界面退出转单按钮显示警告Dialog
 * @param {*} title 标题  非必输 默认：请注意
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showQuitTransferWarningDialog(param = {}) {
	showMessageDialog(
		lang.getLangByResId('4001PUBMESSAGE-000026'), // 退出转单
		lang.getLangByResId('4001PUBMESSAGE-000027'), // 有未保存的单据，确定要退出转单吗?
		param,
		'warning'
	);
}

/**
 * 保存提交成功-多语提示
 */
function showSaveAndCommitInfo() {
	showSuccessInfo(lang.getLangByResId('4001PUBMESSAGE-000028')); /**国际化处理：保存提交成功 */
}

/**
 * 查询成功
 */
function showQuerySuccess() {
	showSuccessInfo(null, lang.getLangByResId('4001PUBMESSAGE-000014') /**查询成功 */);
}

export {
	showSuccessInfo,
	showWarningInfo,
	showErrorInfo,
	showInfoInfo,
	showSuccessDialog,
	showInfoDialog,
	showErrorDialog,
	showWarningDialog,
	showBatchOprMessage,
	showBatchOperateInfo,
	showCancelDialog,
	showSingleDeleteDialog,
	showDeleteDialog,
	showChangeOrgDialog,
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo,
	showSaveInfo,
	showQueryResultInfoForNoPage,
	showBatchOprReturnMessage,
	showBackWarningDialog,
	showQuitTransferWarningDialog,
	showSaveAndCommitInfo,
	showQuerySuccess,
	showCheckDataWarningInfo,
	showEnableDialog,
	showDisableDialog
};
