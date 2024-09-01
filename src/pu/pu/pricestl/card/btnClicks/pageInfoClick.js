import { URL, PAGECODE, FIELD, STATUS } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { togglePageShow } from '../afterEvents';
import { viewController } from '../viewController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props, pk) {
	if (pk) {
		changeUrlParam(this.props, { id: pk });
	}
	pk = this.props.getUrlParam(FIELD.id);
	if (pk) {
		// this.props.setUrlParam(pk);
		let conditionData = {
			pks: [ pk ],
			pageid: PAGECODE.cardcode,
			status: this.getPageParam(STATUS.status)
		};
		ajax({
			url: URL.getCard,
			data: conditionData,
			method: 'POST',
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data) {
					let data = res.data;
					if (data.head) {
						this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
						//订单状态
						let fbillstatus = data.head[PAGECODE.cardhead].rows[0].values.fbillstatus;
					}
					if (data.bodys) {
						let cards = data.bodys;
						if (cards[PAGECODE.cardbody]) {
							this.props.cardTable.setTableData(PAGECODE.cardbody, cards[PAGECODE.cardbody]);
							let row = cards[PAGECODE.cardbody].rows[0];
							this.state.dbaseprice = row.values.dbaseprice.value;
							this.state.vschemefrmlname = row.values.vschemefrmlname.value;
							this.state.nschemecalvalue = row.values.nschemecalvalue.value;
						}
						if (cards[PAGECODE.cardbodyano]) {
							this.props.cardTable.setTableData(PAGECODE.cardbodyano, cards[PAGECODE.cardbodyano]);
						}

						if (this.getPageParam(STATUS.status) == STATUS.edit) {
							// this.props.cardTable.setStatus(PAGECODE.cardbodyano, STATUS.edit);
							// this.props.cardTable.setStatus(PAGECODE.cardbody, STATUS.edit);
							this.props.form.setFormItemsDisabled(PAGECODE.cardhead, {
								pk_org: true,
								pk_storeorg: false,
								pk_supplier: false,
								pk_employee: false,
								pk_dept: false,
								// fbillstatus: true,
								dbilldate: true
							});
							// this.props.cardTable.setColEditableByKey(
							// 	PAGECODE.cardbody,
							// 	[
							// 		'pk_material',
							// 		'pk_material.materialtype',
							// 		'pk_material.materialspec',
							// 		'nastinnum',
							// 		'ntaxmny'
							// 	],
							// 	// 'ntaxprice',
							// 	true
							// );
						}
						// else {
						// 	this.props.cardTable.setStatus(PAGECODE.cardbodyano, STATUS.browse);
						// 	this.props.cardTable.setStatus(PAGECODE.cardbody, STATUS.browse);
						// 	this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
						// }
					}
					let billStatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
					billStatus = billStatus && billStatus.value;
					viewController.call(this, this.props, this.getPageParam(STATUS.status), billStatus);
					// togglePageShow.call(this, this.props, this.getPageParam(STATUS.status), billStatus);
				}
				// this.props.updatePage(PAGECODE.cardhead, [ PAGECODE.cardbody, PAGECODE.cardbodyano ]);
			}
		});
	}
}
// }
