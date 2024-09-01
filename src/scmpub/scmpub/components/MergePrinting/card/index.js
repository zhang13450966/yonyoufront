//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';

class M5xPrint extends Component {
	constructor(props) {
		super(props);
		props.use.form(props.headCode);
		props.use.cardTable(props.bodyCode);
		this.state = {
			headCode: props.headCode,
			bodyCode: props.bodyCode
		};
		//子表是否显示展开按钮，只有明确不显示时才不显示（props.hideSwitch == false）
		this.hideSwitch = props.hideSwitch == false ? false : true;
		initTemplate.call(this, props);
	}

	componentDidMount() {
		setTimeout(() => {
			this.props.form.setAllFormValue({ [this.state.headCode]: this.props.billCard.head[this.state.headCode] });
			if (this.props.billCard.bodys) {
				this.props.cardTable.setTableData(this.state.bodyCode, this.props.billCard.bodys[this.state.bodyCode]);
			} else {
				this.props.cardTable.setTableData(this.state.bodyCode, this.props.billCard.body[this.state.bodyCode]);
			}
		}, 100);
	}

	render() {
		let { cardTable, form } = this.props;
		let { createForm } = form;
		let { createCardTable } = cardTable;

		return (
			<div className="nc-bill-card" id="scm-to-transin-card">
				<div className="nc-bill-form-area">{createForm(this.state.headCode, {})}</div>
				<div className="nc-bill-table-area scm-to-extent-btn">
					{createCardTable(this.state.bodyCode, {
						showIndex: true,
						adaptionHeight: true,
						hideSwitch: () => {
							return this.hideSwitch;
						}
					})}
				</div>
			</div>
		);
	}
}

M5xPrint = createPage({})(M5xPrint);
export default M5xPrint;
