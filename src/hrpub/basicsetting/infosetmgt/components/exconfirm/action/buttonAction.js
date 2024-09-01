/**
 * Header actions
 * @constructor
 * @author neo   
*/
import ExchangeAction from 'src/hrpub/basicsetting/infosetmgt/actions/exchangeaction';
export default class buttonAction extends ExchangeAction {
	constructor(comp) {
		super(comp);
	}
	cancel = (event) => {
		const { dispatch } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				exconfirmShow: false
			}
		});
	};
	close = (event) => {
		const { dispatch } = this.comp.props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				exconfirmShow: false,
				bShowExchangeModal: false
			}
		});
	};
	saveClose = (event) => {
		const { dispatch, form, editTable, infosetmgt } = this.comp.props;
		let validateTable = editTable.getAllRows('sub').length
			? editTable.checkRequired('sub', editTable.getAllRows('sub'))
			: true;
		if (!form.isCheckNow('card') || !validateTable) {
			dispatch({
				type: 'infosetmgt/update',
				payload: {
					exconfirmShow: false
				}
			});
		} else {
			let postData = {
				card: form.getAllFormValue('card'),
				sub: {
					areacode: 'sub',
					rows: editTable.getAllRows('sub')
				},
				pk_org: infosetmgt.hrorgobj.refpk
			};

			dispatch({
				type: 'infosetmgt/exchangeSaveData',
				payload: {
					postData
				}
			}).then((res) => {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						exconfirmShow: false,
						bShowExchangeModal: false
					}
				});
			});
		}
	};
}
