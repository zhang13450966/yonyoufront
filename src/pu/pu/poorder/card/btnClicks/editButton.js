/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片编辑按钮
 * @Date: 2018-04-19 14:39:42
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-11 16:09:28
 */
import { FIELD, STATUS, URL, PAGECODE, TRANSFER, OrderCache, BUTTON } from '../../constance';
import { buttonController } from '../viewController/index';
import { getDefData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function editButton() {
    // 卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
    this.props.cardTable.selectAllRows(PAGECODE.head_payment, false);
    this.props.cardTable.selectAllRows(PAGECODE.cardbody, false);
    buttonController.materialPasteCancel.call(this, this.props);
    let transfer = this.props.getUrlParam(TRANSFER.transfer);
    if (transfer == null) {
        transfer = this.props.getUrlParam(TRANSFER.channelType);
    }
    if (transfer == null) {
        let pk_order = this.props.getUrlParam(FIELD.id);
        if (pk_order == null || pk_order == 'undefined') {
            pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
            pk_order = pk_order && pk_order.value;
        }
        if (getDefData(OrderCache.OrderCardCache, 'scene') == null) {
            //应用场景
            changeUrlParam(this.props, {
                status: STATUS.edit,
                id: pk_order,
                tempstatus: STATUS.edit
            });
        }
    } else {
        this.indexstatus[this.curindex] = 'edit';
    }
    this.setState({ status: STATUS.edit });
    this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
    buttonController.togglePageShow.call(this, this.props, STATUS.edit);
    //add by zhaochyu 暂存功能
    //this.props.button.setDisabled({ [BUTTON.TemporaryStorage]: true });
}
