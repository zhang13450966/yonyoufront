/*
 * @Author: heyfn
 * @PageInfo: 刷新按钮
 * @Date: 2022-05-11 14:48:13
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-11 16:20:18
 */
import { ajax } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import buttonController from '../viewController/buttonController';
import { updateCacheData } from '../../../../scmpub/pub/cache/cacheDataManager';
export default function(props) {
	let data = {
		pk: (props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, COOPSETUP_CONST.pk_coopsetup) || {}).value,
		pageId: COOPSETUP_CONST.PAGEID_CARD
	};
	ajax({
		url: COOPSETUP_CONST.QUERYCARDURL,
		data: data,
		success: (res) => {
            if(res.success) {
                // 效率优化开启
				props.beforeUpdatePage();
                showRefreshInfo();
                // 设置表头数据
                if (res.data.head) {
                    this.props.form.setAllFormValue({ head: res.data.head.head });
                }
                // 设置表体两个页签数据
                if (res.data && res.data.salepurchasecoop) {
                    let rows =
                        res.data.salepurchasecoop.salepurchasecoop &&
                        res.data.salepurchasecoop.salepurchasecoop.rows;
                    let meta = this.props.meta.getMeta();
                    for (let i = 0; i < rows.length; i++) {
                        let datatype = rows[i].values.datatype.value;
                        let reftype = rows[i].values.reftype.value;
                        if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
                            let item = meta[COOPSETUP_CONST.CARD_TABLEID1].items.find(
                                (item) => item.attrcode == 'vvalueref'
                            );
                            item.datatype = '204';
                            item.itemtype = 'refer';
                        }
                    }
                    this.props.meta.setMeta(meta, () => {
                        // 向“购销协同”页签设置数据
                        this.props.editTable.setTableData(
                            COOPSETUP_CONST.CARD_TABLEID1,
                            res.data.salepurchasecoop.salepurchasecoop
                        );
                    });
                } else {
                    this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, { rows: [] });
                }
                if (res.data && res.data.boundcoop) {
                    // 向“出入库协同”页签设置数据
                    let rows = res.data.boundcoop.boundcoop && res.data.boundcoop.boundcoop.rows;
                    let meta = this.props.meta.getMeta();
                    for (let i = 0; i < rows.length; i++) {
                        let datatype = rows[i].values.datatype.value;
                        let reftype = rows[i].values.reftype.value;
                        if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
                            let item = meta[COOPSETUP_CONST.CARD_TABLEID2].items.find(
                                (item) => item.attrcode == 'vvalueref'
                            );
                            item.datatype = '204';
                            item.itemtype = 'refer';
                        }
                    }
                    this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.boundcoop);
                } else {
                    this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, { rows: [] });
                }
                if (res.data && res.data.invoicecoop) {
                    // 向“发票协同”页签设置数据
                    let rows = res.data.invoicecoop.invoicecoop && res.data.invoicecoop.invoicecoop.rows;
                    let meta = this.props.meta.getMeta();
                    for (let i = 0; i < rows.length; i++) {
                        let datatype = rows[i].values.datatype.value;
                        let reftype = rows[i].values.reftype.value;
                        if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
                            let item = meta[COOPSETUP_CONST.CARD_TABLEID3].items.find(
                                (item) => item.attrcode == 'vvalueref'
                            );
                            item.datatype = '204';
                            item.itemtype = 'refer';
                        }
                    }
                    this.props.editTable.setTableData(
                        COOPSETUP_CONST.CARD_TABLEID3,
                        res.data.invoicecoop.invoicecoop
                    );
                } else {
                    this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, { rows: [] });
                }
                // 设置按钮权限
                let pk_coopsetup = (props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, COOPSETUP_CONST.pk_coopsetup)) || {}.value;
                buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
                updateCacheData(props, COOPSETUP_CONST.pk_coopsetup, pk_coopsetup, res.data, COOPSETUP_CONST.FORMID, COOPSETUP_CONST.dataSource);
                // 效率优化关闭
                props.updatePage(COOPSETUP_CONST.FORMID, [ COOPSETUP_CONST.CARD_TABLEID1, COOPSETUP_CONST.CARD_TABLEID2, COOPSETUP_CONST.CARD_TABLEID3 ]);
            }
		}
	});
}
