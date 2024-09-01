import {getBusinessInfo, cacheTools} from 'nc-lightapp-front';

let businessInfo = getBusinessInfo() || {};

export default class FormAction {
    constructor(comp) {
        this.comp = comp;
    }
    formConfig = {
        area: 'trip',
        formCode: 'trip_approve_card'
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
            billId = formValue.rows[0].values['pk_trip'].value;
            let tripday = form.getFormItemsValue(this.formConfig.formCode, 'tripday').value;
            let minunit = form.getFormItemsValue(this.formConfig.formCode, 'minunit').display;
            form.setFormItemsValue(this.formConfig.formCode, {
                tripday: {
                    display: tripday + minunit,
                    value: tripday
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
    getOneBillData = async (pk_trip) => {
        const {props} = this.comp;
        const {dispatch, trip} = props;
        try {
            let res = await dispatch({
                type: 'trip/getBillDetail',
                payload: {
                    pk_trip
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