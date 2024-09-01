import { ajax, base, toast } from 'nc-lightapp-front';
import { URL, COMMON, AREA, PAGECODE } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(val) {
	if (this.state.current == 'invoice') {
		let searchVal = this.props.search.getAllSearchData(AREA.invoiceSearchArea);
		this.state.invoiceSearchData = searchVal;
		let pk_org = this.props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org');

		if (pk_org && pk_org.value.firstvalue) {
			if (this.state.pk_financeorg != pk_org.value.firstvalue) {
				this.setState({
					current: 'invoice'
				});
				this.state.isSettle = false;
				this.state.isSuccess = false;
				this.state.btnName = '';
				this.state.invoicePriceOverOder = false;
				this.state.settleType = '';
				this.state.title = '';
				this.state.pk_financeorg = pk_org.value.firstvalue;
				this.state.currentModal = 0;
				this.state.RBInvoiceOptionableVO = {};
				this.state.RBStockOptionableVO = {};
				this.state.InvoiceStockOptionableVO = {};
				this.state.m_bAllowStockBeyondInvoice = false;
				this.state.hasFeeDistribute = false;
				this.state.hasInoviceDistribute = false;
				this.state.settleBillVOs = {};
				this.state.invoice = null;
				this.state.selectedInvoice = null;
				this.state.discount = null;
				this.state.selectedDiscount = null;
				this.state.fee = null;
				this.state.selectedFee = null;
				this.state.stock = null;
				this.state.selectedStock = null;
				this.state.matchmaterial = null;
			}
		}
		let queryInfo = this.props.search.getQueryInfo(AREA.invoiceSearchArea);
		if (!queryInfo.querycondition) {
			return;
		}
		let materialSet = new Set();
		let bmarinclude = this.props.search.getSearchValByField(AREA.invoiceSearchArea, 'bmarinclude');
		if (bmarinclude && (bmarinclude.value.firstvalue || bmarinclude.value.firstvalue == 'Y')) {
			if (this.state.stock && this.state.stock.length > 0) {
				this.state.stock.map((row) => {
					materialSet.add(row.values.pk_material.value);
				});
			}
		}
		let firstvalue = Array.from(materialSet).join(',');
		let data = {
			queryInfo: {
				querycondition: searchVal ? searchVal : { logic: 'and' }, //查询条件
				pageInfo: null, //分页信息
				custcondition: {
					conditions: [
						{
							field: 'pk_material',
							oprtype: '=',
							value: {
								firstvalue: firstvalue,
								secondvalue: ''
							}
						},
						{
							field: 'po_invoice_query_for_settle_type',
							oprtype: '=',
							value: {
								firstvalue: 'qry_type_vmi',
								secondvalue: ''
							}
						}
					]
				},
				queryAreaCode: AREA.invoiceSearchArea, //查询区编码
				oid: queryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			},
			pageCode: PAGECODE.invoice //页面编码
		};
		//得到数据渲染到页面
		ajax({
			url: URL.queryInvoice,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.data && res.data.gridMap.all) {
					if (res.data.gridMap.invoice && res.data.gridMap.invoice[AREA.invoiceView]) {
						this.state.invoice = res.data.gridMap.invoice[AREA.invoiceView].rows;
					}
					if (res.data.gridMap.discount && res.data.gridMap.discount[AREA.feeView]) {
						this.state.discount = res.data.gridMap.discount[AREA.feeView].rows;
					}
					if (res.data.gridMap.fee && res.data.gridMap.fee[AREA.feeView]) {
						this.state.fee = res.data.gridMap.fee[AREA.feeView].rows;
					}
					if (res.data.count > 500) {
						toast({content: getLangByResId(this, '4004SETTLEMENT-000064'), color:'warning'});/* 国际化处理： 查询结果大于1000条，请缩小条件再试！*/
					} else {
						toast({ content: getLangByResId(this, '4004SETTLEMENT-000071', {i: res.data.count}), color: 'success' });
					}
					this.props.editTable.setTableData(AREA.invoiceView, res.data.gridMap.all[AREA.invoiceView]);
					setTimeout(() => {
						//this.props.editTable.setCheckboxFix(AREA.stockInVIew, true);
						if (this.state.invoiceFull) {
							this.props.editTable.setCheckboxFix(AREA.invoiceView, false);
						} else {
							this.props.editTable.setCheckboxFix(AREA.invoiceView, true);
						}
						
					},0);
				} else {
					this.state.invoice = null;
					this.state.discount = null;
					this.state.fee = null;
					this.props.editTable.setTableData(AREA.invoiceView, { rows: [] });
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000070'), color: 'warning' });/* 国际化处理： 查询结果为空*/
				}
			}
		});
	} else {
		let searchVal = this.props.search.getAllSearchData(AREA.stockInSearchArea);
		this.state.stockInSearchData = searchVal;
		let pk_org = this.props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_financeorg');

		if (pk_org && pk_org.value.firstvalue) {
			if (this.state.pk_financeorg != pk_org.value.firstvalue) {
				this.setState({
					current: 'vim'
				});
				this.state.isSettle = false;
				this.state.isSuccess = false; 
				this.state.btnName = '';
				this.state.invoicePriceOverOder = false;
				this.state.settleType = '';
				this.state.title = '';
				this.state.pk_financeorg = pk_org.value.firstvalue;
				this.state.currentModal = 0;
				this.state.m_bAllowStockBeyondInvoice = false;
				this.state.RBInvoiceOptionableVO = {};
				this.state.RBStockOptionableVO = {};
				this.state.InvoiceStockOptionableVO = {};
				this.state.hasFeeDistribute = false;
				this.state.hasInoviceDistribute = false;
				this.state.settleBillVOs = {};
				this.state.invoice = null;
				this.state.selectedInvoice = null;
				this.state.discount = null;
				this.state.selectedDiscount = null;
				this.state.fee = null;
				this.state.selectedFee = null;
				this.state.stock = null;
				this.state.selectedStock = null;
				this.state.matchmaterial = null;
			}
		}
		let queryInfo = this.props.search.getQueryInfo(AREA.stockInSearchArea);
		if (!queryInfo.querycondition) {
			return;
		}
		let materialSet = new Set();
		let bmarinclude = this.props.search.getSearchValByField(AREA.stockInSearchArea, 'bmarinclude');
		if (bmarinclude && (bmarinclude.value.firstvalue || bmarinclude.value.firstvalue == 'Y')) {
			if (this.state.invoice && this.state.invoice.length > 0) {
				this.state.invoice.map((row) => {
					materialSet.add(row.values.pk_material.value);
				});
			}
		}
		let firstvalue = Array.from(materialSet).join(',');

		let data = {
			queryInfo: {
				querycondition: searchVal ? searchVal : { logic: 'and' }, //查询条件
				pageInfo: null, //分页信息
				custcondition: {
					conditions: [
						{
							field: 'pk_material',
							oprtype: '=',
							value: {
								firstvalue: firstvalue,
								secondvalue: ''
							}
						}
					]
				},
				queryAreaCode: AREA.stockInSearchArea, //查询区编码
				oid: queryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			},
			pageCode: PAGECODE.vim //页面编码
		};
		//得到数据渲染到页面
		ajax({
			url: URL.queryVim,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.data.grid) {
					if (res.data.count > 500) {
						toast({content: getLangByResId(this, '4004SETTLEMENT-000064'), color:'warning'});/* 国际化处理： 查询结果大于1000条，请缩小条件再试！*/
					} else {
						toast({ content: getLangByResId(this, '4004SETTLEMENT-000071', {i: res.data.count}), color: 'success' });
					}
					this.props.editTable.setTableData(AREA.stockInVIew, res.data.grid[AREA.stockInVIew]);
					setTimeout(() => {
						if (this.state.stockFull) {
							this.props.editTable.setCheckboxFix(AREA.stockInVIew, false);
						} else {
							this.props.editTable.setCheckboxFix(AREA.stockInVIew, true);
						}
						
						//this.props.editTable.setCheckboxFix(AREA.invoiceView, true);
					},0);
					if (res.data.grid[AREA.stockInVIew]) this.state.stock = res.data.grid[AREA.stockInVIew].rows;
				} else {
					this.props.editTable.setTableData(AREA.stockInVIew, { rows: [] });
					this.state.stock = null;
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000070'), color: 'warning' });/* 国际化处理： 查询结果为空*/
				}
			}
		});
	}
}
