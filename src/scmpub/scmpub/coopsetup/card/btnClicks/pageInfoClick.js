/*
 * @Author: heyfn
 * @PageInfo: 卡片态翻页
 * @Date: 2022-05-10 10:44:37
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-12 15:49:28
 */
import { ajax } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController';
import { getCacheDataByPk } from '../../../../scmpub/pub/cache/cacheDataManager';
import { updateCacheData } from '../../../../scmpub/pub/cache/cacheDataManager';

export default function(props, pk) { 
	//pk值不存在或则没有定义时,清空变淡数据
	if (pk == undefined || !pk) {
		// 设置表头表体区域为空
		this.props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);
		this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, { rows: [] });
		this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, { rows: [] });
		this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, { rows: [] });
		this.props.setUrlParam({ status: 'browse', id: '' });
		buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
		return;
	}
	let cacheData = getCacheDataByPk(props, COOPSETUP_CONST.dataSource, pk);
	//有缓存时
	if (cacheData) {
		props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);
		if(cacheData.head && cacheData.head[COOPSETUP_CONST.FORMID] ){
			this.props.form.setAllFormValue({ [COOPSETUP_CONST.FORMID]: cacheData.head[COOPSETUP_CONST.FORMID] });
		} else {
			this.props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);
		}
		if(cacheData.salepurchasecoop && cacheData.salepurchasecoop[COOPSETUP_CONST.CARD_TABLEID1] ){
			this.props.cardTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, cacheData.salepurchasecoop[COOPSETUP_CONST.CARD_TABLEID1], null, true, true);
		} else {
			this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, { rows: [] });
		} 
		if(cacheData.boundcoop && cacheData.boundcoop[COOPSETUP_CONST.CARD_TABLEID2] ){
			this.props.cardTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, cacheData.boundcoop[COOPSETUP_CONST.CARD_TABLEID2], null, true, true);
		} else {
			this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, { rows: [] });
		} 
		if(cacheData.invoicecoop && cacheData.invoicecoop[COOPSETUP_CONST.CARD_TABLEID3] ){
			this.props.cardTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, cacheData.invoicecoop[COOPSETUP_CONST.CARD_TABLEID3], null, true, true);
		} else {
			this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, { rows: [] });
		} 
		props.setUrlParam({ status: 'browse', id: pk });
		buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
		return;
	}

	let data = {
		pk: pk,
		pageId: COOPSETUP_CONST.PAGEID_CARD
	};

	ajax({
		url: COOPSETUP_CONST.QUERYCARDURL,
		data: data,
		success: (res) => {
            if(res.success) {
                // 效率优化开启
				props.beforeUpdatePage();
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
                buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
                updateCacheData(props, COOPSETUP_CONST.pk_coopsetup, pk, res.data, COOPSETUP_CONST.FORMID, COOPSETUP_CONST.dataSource);
                // 效率优化关闭
                props.updatePage(COOPSETUP_CONST.FORMID, [ COOPSETUP_CONST.CARD_TABLEID1, COOPSETUP_CONST.CARD_TABLEID2, COOPSETUP_CONST.CARD_TABLEID3 ]);
            }
		}
	});
}
