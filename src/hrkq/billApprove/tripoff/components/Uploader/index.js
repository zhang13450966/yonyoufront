import React, {Component} from 'react';
import './index.less';
// import {high} from 'nc-lightapp-front';

// const {NCUploader} = high;
import NCUploader from 'uap/common/components/NCUploader';
class Uploader extends Component {
    constructor(props) {
        super(props);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.getGroupList = this.getGroupList.bind(this);
        this.onHideUploader = this.onHideUploader.bind(this);
        this.getBillId = this.getBillId.bind(this);
    }

    getBillId() {
        const {billId, table, clickRow: clickRowProps} = this.props;
        if (billId) return billId;
        const clickRow = table.getClickRowIndex('ncc600704list') || clickRowProps;

        return clickRow && clickRow.record.values.pk_psndoc.value;
    }

    onHideUploader() {
        this.props.onClose && this.props.onClose();
    }

    //获取当前附件列表
    getGroupList(list) {
    }

    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            alert(this.props.language['gx6008-000117'])/* 国际化处理： 上传大小小于2M*/
        }
        return isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    render() {
        return (
            <div className='uploader'>
                <NCUploader
                    billId={this.props.billId}
                    //getGroupList={this.getGroupList}
                    onHide={this.onHideUploader} // 关闭功能
                    //beforeUpload={this.beforeUpload}
                />
            </div>
        );
    }
}

export default Uploader;
