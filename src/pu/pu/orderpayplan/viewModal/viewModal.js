/*
 * @Author: heyfn
 * @Description: 付款订单联查详情弹框组件
 * @Date: 2022-01-21 10:18:35
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-02-22 19:04:44
 */
import React, { Component } from 'react';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PAGECODE } from './../constance/index';
import ModalContent from './modalContent';
class ViewModal extends Component {
    constructor(props) {
        super(props);
        initLang(this, ['4004payplan'], 'pu');
    }
    componentDidMount() {
        //设置状态
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
    }

    render() {
        return this.props.modal.createModal('viewModal', {
            title: getLangByResId(this, '4004OPAYPLAN-000020'),
            content: <ModalContent {...this.props} />,
            noFooter: true,
            closeByClickBackDrop: false, //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
            size: 'xlg',
            showMaxButton: true,
            closeModalEve: () => {
                this.props.table.setAllTableData(PAGECODE.itemBodyCode, { rows: [] });
                this.props.table.setAllTableData(PAGECODE.itemConfirmBodyCode, { rows: [] });
                this.props.changeShowModal();
            }
        });
    }
}

export default ViewModal;
