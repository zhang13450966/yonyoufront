export default function afterEvent(props, moduleId, key, value, rows, i) {
	// 获取收款人
	let payer = props.form.getFormItemsValue(moduleId, 'payer').display;
	// 获取复核人
	let checker = props.form.getFormItemsValue(moduleId, 'checker').display;
	this.setGoldTaxPara(payer, checker);
}
