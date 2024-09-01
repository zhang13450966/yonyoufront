/*
 * @Author: zhy
 * @Description: Modify here please
 * @Date: 2021-07-29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-17 13:38:04
 */
import React, {
    Component
} from "react";
class ModalCom extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    // 取消按钮事件
    cancel = async () => {
        $appRoot.props.modal.close(modalPage.tzListModal);
    }
    render() {
        const { modalPage } = this.props
        console.log(modalPage, '========modalPage===========')
        const getModalContent = () => {
            return (
                <div className='auditProgram-modal-form flex-container' style={{height:'100%'}}>
                    {
                        $appRoot.props.table.createSimpleTable(modalPage.tzListTable, {
                            showIndex: true,
                            selectedChange: this.selectedChange
                        })
                    }
                </div>
            )
        }
        return (
            <div className='auditProgram-modal'>
                {
                    this.props.modal.createModal(modalPage.tzListModal, {
                        title: '投资列表', // 弹框表头信息
                        content: getModalContent(), //弹框内容，可以是字符串或dom
                        // beSureBtnClick: this.beSureBtnClick,
                        noFooter: true,// 杨晓琳要求去掉底部
                        hasCloseBtn: false,
                        hideRightBtn: true,
                        hotKeyboard: true, // 模态框按钮，不绑定快捷键
                        size:'xlg',
                        height:'600px',
                        
                    })

                }
            </div>
        )
    }

}

export default ModalCom