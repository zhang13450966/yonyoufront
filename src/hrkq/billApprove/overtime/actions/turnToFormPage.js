import {getBusinessInfo, cacheTools} from 'nc-lightapp-front';

let businessInfo = getBusinessInfo() || {};

export default class FormAction {
    constructor(comp) {
        this.comp = comp;
    }
    formConfig = {
        area: 'overtime',
        formCode: 'overtime_approve_card'
    }
    // 表单进入浏览态
    toBrowseStatus = (formValue) => {
        const {props} = this.comp;
        const {form, button} = props;

        // 单据id
        let billId = '';

        // 表单进入编辑
        form.setFormStatus(this.formConfig.formCode, 'browse');
        // 填充表单的值
        if(formValue) {
            form.setAllFormValue({
                [this.formConfig.formCode]: formValue
            });
            billId = formValue.rows[0].values['pk_overtime'].value;
            let otapplylength = form.getFormItemsValue(this.formConfig.formCode, 'otapplylength').value;
            let isallnight = form.getFormItemsValue(this.formConfig.formCode, 'isallnight').value;
            let isoverday = form.getFormItemsValue(this.formConfig.formCode, 'isoverday').value;
            form.setItemsVisible(this.formConfig.formCode, {
                isallnight: !!isoverday
            })
            form.setFormItemsValue(this.formConfig.formCode, {
                otapplylength: {
                    display: otapplylength ? ((otapplylength - 0).toFixed(2) + '小时') : '',
                    value: otapplylength
                },
                isallnight: {
                    display: isallnight ? '是' : '否',
                    value: isallnight
                }
            })
        }

        // 按钮进入编辑的按钮
        this.update({
            addPageStatus: 'browse'
        })
        // 隐藏掉一些按钮
        button.setButtonVisible({
            print: true,
            batchadd: false
        });
    }

    // 直接进入预览页面
    toBrowsePage = async (id, formValue) => {
        try {
            let oneBillData = await this.getOneBillData(id);
            if (oneBillData) {
                this.toBrowseStatus(oneBillData.data[this.formConfig.area][this.formConfig.formCode]);
            } 
        }
        catch(e) {
        }
    }

    // 获取一条数据
    getOneBillData = async (pk_overtime) => {
        const {props} = this.comp;
        const {dispatch, overtime} = props;
        try {
            let res = await dispatch({
                type: 'overtime/getBillDetail',
                payload: {
                    pk_overtime
                }
            });

            if(res.success) {
                return res;
            }
        }
        catch(e) {
        }
        return false;
    }
}