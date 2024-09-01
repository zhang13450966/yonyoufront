//导出树表界面结构布局
export class NcBillExtCard extends React.Component {
	static defaultProps = {
		pageConfig: {}
	};
	constructor(props) {
		super(props);
	}
	render() {
		const { pageConfig } = this.props;
		console.log('pageConfig', pageConfig);
		let { Form, Button, Table, BillHeader, cardPagination } = pageConfig;
		return (
			<div className="nc-bill-extCard">
				<div className="nc-bill-top-area">
					<div className="nc-bill-header-area">
						<span>{BillHeader instanceof Function ? BillHeader() : BillHeader}</span>
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{cardPagination instanceof Function ? cardPagination() : cardPagination}
						</div>
						<div className="header-button-area">{Button instanceof Function ? Button() : Button}</div>
					</div>
					<div className="nc-bill-form-area">{Form instanceof Function ? Form() : Form}</div>
				</div>

				<div className="nc-bill-bottom-area">
					<div className="nc-bill-tableTab-area">{Table instanceof Function ? Table() : Table}</div>
					<div className="nc-bill-tableTab-area">{Table instanceof Function ? Table() : Table}</div>
				</div>
			</div>
		);
	}
}
