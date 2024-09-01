import React, { Component } from 'react';
import { createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';
import afterEvent from './afterEvent';
import { initLang } from '../../pub/tool/multiLangUtil';

class GoldTax extends Component {
	constructor(props) {
		super(props);
		this.formId = 'goldtaxhead';
		props.use.form(this.formId);
		this.props = props;
		initLang(this, [ '4001components' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentDidMount() {}
	setGoldTaxPara = (payer, checker) => {
		this.props.getGoldTaxPara(payer, checker);
	};
	// 主方法
	render() {
		let { form } = this.props;
		const { createForm } = form;
		return (
			<div>
				<div className="nc-bill-form-areas">
					{createForm(this.formId, {
						onAfterEvent: afterEvent.bind(this)
					})}
				</div>
			</div>
		);
	}
}
GoldTax = createPage({})(GoldTax);
export default GoldTax;
