import { ajax, toast } from 'nc-lightapp-front';
export default function(props, constance) {
	return new Promise(function(resolve, reject) {
		let { key, formareaid, pk_org_key, billtype } = constance;
		let pk_org = props.form.getFormItemsValue(formareaid, pk_org_key);
		if (!pk_org || !pk_org.value) {
			resolve(false);
		} else {
			let data = {
				key: key,
				params: {
					pk_org: pk_org.value,
					billtype: billtype
				}
			};

			ajax({
				url: '/nccloud/pu/pricestlcard/before.do',
				data: data,
				success: (res) => {
					if (res.data) {
						let isedit = res.data.isedit;
						if (isedit) {
							resolve(isedit);
						} else if (res.data.message) {
							toast({
								color: 'warning',
								content: res.data.message
							});
						}
						resolve(false);
					}
				},
				error: (error) => {
					toast({
						color: 'warning',
						content: error.message
					});
					resolve(false);
				}
			});
		}
	});
}
