/*
 * @Author: chengya
 * @Description: Modify here please
 * @Date: 2020-11-05 10:18:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-20 16:26:56
 */
import './index';
export class NcBillCard extends React.Component {
	static defaultProps = {
		pageConfig: {},
		mounted: () => {}
	};
	constructor(props) {
		super(props);
	}
	componentDidMount () {
		this.props.mounted()
	}
	render() {
		const { pageConfig } = this.props;
		let { needIcon, title, Button, Form, TableOne, BillHeader, cardPagination, refResh, modals} = pageConfig;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<div className="nc-bill-header-area" fieldid='card_head_area'>
						<div className="header-title-search-area">
							{BillHeader instanceof Function ? BillHeader() : BillHeader}
							<h2 className="title-search-detail">{title}</h2>
						</div>
						<div className="header-button-area">{Button instanceof Function ? Button() : Button}</div>
						<div className="refBtn" >
								{refResh instanceof Function ? refResh() : refResh}
							</div>
						<div className="header-cardPagination-area" >
							{cardPagination instanceof Function ? cardPagination() : cardPagination}
						</div>
					</div>
					<div className="nc-bill-form-area">{Form instanceof Function ? Form() : Form}</div>
				</div>

				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">{TableOne instanceof Function ? TableOne() : TableOne}</div>
				</div>
				{modals instanceof Function ? modals() : modals}
			</div>
		);
	}
}
