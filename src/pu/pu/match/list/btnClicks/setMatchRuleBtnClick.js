/*
 * @Author: xiahui 
 * @PageInfo: 设置匹配规则
 * @Date: 2019-05-16 09:25:27 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:45:04
 */
import { ajax } from 'nc-lightapp-front';
import { MatchRuleSetDlg } from '../init/MatchRuleSetDlg';
import { URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	// 获取当前匹配规则;
	ajax({
		url: URL.ruleQuery,
		success: (res) => {
			if (res.success && res.data) {
				this.matchRule = res.data;
				showMatchRuleDlg.call(this, props);
			}
		}
	});
}

/**
 * 显示匹配规则对话框
 * @param {*} props 
 */
function showMatchRuleDlg(props) {
	props.modal.show('MatchRuleSetDlg', {
		size: 'lg',
		title: getLangByResId(this, '4004MATCH-000006') /* 国际化处理： 匹配规则设置*/,
		hasCloseBtn: true,
		userControl: true,
		className: 'senior',
		content: <MatchRuleSetDlg setMatchRule={this.setMatchRule.bind(this)} matchRule={this.matchRule} />,
		beSureBtnClick: () => {
			updateMatchRule.call(this, props);
		},
		cancelBtnClick: () => {
			props.modal.close('MatchRuleSetDlg');
		}
	});
}

/**
 * 更新匹配规则
 * @param {*} props 
 */
function updateMatchRule(props) {
	ajax({
		url: URL.ruleSave,
		data: this.matchRule,
		success: (res) => {
			if (res.success) {
				props.modal.close('MatchRuleSetDlg');
			}
		}
	});
}
