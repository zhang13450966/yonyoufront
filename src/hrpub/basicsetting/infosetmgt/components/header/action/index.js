/**
 * Header actions
 * @constructor
 * @author neo   
*/
import { cacheTools, promptBox, toast } from 'nc-lightapp-front';
export default class HeaderAction {
	constructor(comp) {
		this.comp = comp;
	}
	toList = () => {
		const { props } = this.comp;
		const { dispatch } = props;
		dispatch({
			type: 'infosetmgt/update',
			payload: {
				showMode: 'list-browse'
			}
		});
		this.pubSub.publish('setMainTableData');
	};
	queryCondition = () => {
		return {
			controlType: 1
		};
	};
	handleButtonClick = (props, event) => {
		console.log(event);
		this[event].call(this, props, event);
	};
	save = (props, event) => {
		console.log(this.comp);
	};
	cancel = (props, event) => {
		const { infosetmgt, dispatch } = props;
		promptBox({
			color: 'warning',
			title: infosetmgt.lang['hrpub-000089'] /* 国际化处理 '提示' */,
			content: infosetmgt.lang['hrpub-000088'] /* 国际化处理 '是否确认要取消？' */,
			beSureBtnClick: () => {
				dispatch({
					type: 'infosetmgt/update',
					payload: {
						showMode: 'card-browse'
					}
				});
				this.pubSub.publish('setFormData');
			},
			cancelBtnClick: () => {}
		});
	};
	edit = (props, event) => {
		const { editTable, infosetmgt } = props;
		console.log(infosetmgt.rowpk);
		// const selectedRow = editTable.getClickRowIndex('infosetgrid');
		if (infosetmgt.rowpk !== null) {
			this.pubSub.publish('setFormData', event);
		}
	};
	delete = (props, event) => {
		console.log('delete');
	};
	handlePageInfoChange = (prop, flag, status = 1) => {
		const { pubSub } = this;
		const { props } = this.comp;
		const { dispatch } = props;
		if (flag) {
			props.cardPagination.setCardPaginationId({ id: flag, status: status });
		} else {
			return props.form.EmptyAllFormValue(this.props.areaCode.card);
		}
		if (status === 3) {
			return false;
		}
		var allpks = cacheTools.get('allpks');
		if (!allpks.length) {
			props.form.EmptyAllFormValue('infosetform');
			props.editTable.setTableData('infosetitemgrid', []);
		} else {
			allpks.forEach((item, index) => {
				if (item === flag) {
					dispatch({
						type: 'infosetmgt/update',
						payload: {
							rowpk: item,
							rowindex: index
						}
					});
					setTimeout(() => {
						pubSub.publish('setFormData');
					}, 100);
				}
			});
		}
	};
}
