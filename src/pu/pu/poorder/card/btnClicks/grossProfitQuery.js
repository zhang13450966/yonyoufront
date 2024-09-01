/*
 * @Author: zhaochyu
 * @PageInfo: 毛利预估
 * @Date: 2019-04-15 14:28:11
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-16 09:30:16
 */
import { toast } from 'nc-lightapp-front';
import { PAGECODE, GROSSPROFITQUEYR } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function grossProfitQuery(props) {
    let selectedRow = this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
    if (selectedRow == null || selectedRow.length == 0) {
        toast({
            color: 'warning',
            content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
        });
        return;
    }
    let headvo = {};
    let bodyvo = [];
    let rowparam = [];
    let map = new Map();
    let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_order').value;
    let vbillcode = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'vbillcode').value;
    let dbilldate = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'dbilldate').value;
    let corigcurrencyid = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid').value;
    headvo.pk_order = pk_order;
    headvo.vbillcode = vbillcode;
    headvo.dbilldate = dbilldate;
    headvo.corigcurrencyid = corigcurrencyid;
    // let frontHeadData = {};
    // let frontBodyData = {};
    // let frontdata = {
    //     head: { grossprofit_head: { areacode: 'grossprofit_head', rows: [{ status: '0', values: {} }] } },
    //     body: { grossprofit_body: { areacode: 'grossprofit_body', rows: [{ status: '0', values: {} }] } }
    // };
    // if (pk_order == null) {
    //     frontHeadData.dbilldate = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'dbilldate');
    //     frontHeadData.vbillcode = {};
    //     selectedRow.map(item => {
    //         if (item.data.values.pk_material.value) {
    //             frontBodyData.cunitid = item.data.values.cunitid;
    //             frontBodyData.ngrossprofit = item.data.values.ngrossprofit;
    //             frontBodyData.ngrossprofitrate = item.data.values.ngrossprofitrate;
    //             frontBodyData.nitemdiscountrate = item.data.values.nitemdiscountrate;
    //             frontBodyData.norigmny = item.data.values.norigmny;
    //             frontBodyData.norignetprice = item.data.values.norignetprice;
    //             frontBodyData.norigprice = item.data.values.norigprice;
    //             frontBodyData.nsalemny = item.data.values.nsalemny;
    //             frontBodyData.nsaleprice = item.data.values.nsaleprice;
    //             frontBodyData.pk_material = item.data.values.pk_material;
    //             frontBodyData.matname = { display: item.data.values['pk_material.name'].display };
    //             frontBodyData.matspec = { display: item.data.values['pk_material.materialspec'].display };
    //             frontBodyData.mattype = { display: item.data.values['pk_material.materialtype'].display };
    //             frontBodyData.pk_order = {};
    //             frontBodyData.pk_order_b = {};
    //             frontBodyData.pk_material = item.data.values.pk_material;
    //             frontBodyData.nnum = item.data.values.nnum;
    //         }
    //     });
    //     frontdata.head.grossprofit_head.rows[0].values = frontHeadData;
    //     frontdata.body.grossprofit_body.rows[0].values = frontBodyData;
    //     this.setState({
    //         showGrossProfitQuery: true,
    //         grossflag: true,
    //         grossprofitdata: frontdata
    //     });
    // } else
    // {
    selectedRow.map((item, index) => {
        index = index + '';
        if (item.data.values.pk_material.value) {
            if (!item.data.values.blargess.value) {
                let rowid = item.data.rowid;
                let pk_material = item.data.values.pk_material.value;
                let pk_order_b = item.data.values.pk_order_b.value;
                rowparam.push(pk_material);
                let data = {
                    matname: item.data.values['pk_material.name'].display,
                    matspec: item.data.values['pk_material.materialspec'].display,
                    mattype: item.data.values['pk_material.materialtype'].display
                };
                map.set(rowid, data);
                let body = {
                    pk_order: pk_order,
                    pk_order_b: pk_order_b,
                    pk_psfinanceorg: item.data.values.pk_psfinanceorg.value,
                    pk_material: pk_material,
                    crowno: item.data.values.crowno.value,
                    ccurrencyid: item.data.values.ccurrencyid.value,
                    cunitid: item.data.values.cunitid.value,
                    nitemdiscountrate: item.data.values.nitemdiscountrate.value,
                    nnum: item.data.values.nnum.value,
                    nmny: item.data.values.nmny.value,
                    nnetprice: item.data.values.nnetprice.value,
                    nprice: item.data.values.nprice.value,
                    rowid: rowid
                };
                bodyvo.push(body);
            }
        }
    });
    let grossprofitdata = {
        grosshead: headvo,
        grossitems: bodyvo,
        pk_material: rowparam,
        materialinfo: map,
        pagecode: GROSSPROFITQUEYR.PAGECODE
    };
    if (rowparam.length == 0) {
        this.setState({
            showGrossProfitQuery: false,
            grossprofitdata: grossprofitdata
        });
    } else {
        this.setState({
            showGrossProfitQuery: true,
            grossprofitdata: grossprofitdata
        });
    }
}
