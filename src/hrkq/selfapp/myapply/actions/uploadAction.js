export default class UploadAction {
    constructor(comp) {
        this.comp = comp;
    }
    
    getGroupList = () => {
        
    }
    hideUploader = (id) => {
        const { dispatch } = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                showUploader: false
            }
        })
    }
    
    /**
     * @desc: 此方法在上传前执行
     * @param {String} billId  单据id
     * @param {String} fullPath  当前选中分组path
     * @param {Blob} file  当前上传文件对象
     * @param {[Blob]} fileList  当前文件列表
     * @return {Boolean}  返回true继续上传，返回false那么终止上传事件
     */
    beforeUpload = (billId, fullPath, file, fileList) => {
    }
}