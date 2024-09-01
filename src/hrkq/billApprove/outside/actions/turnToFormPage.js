export default class FormAction {
    constructor(comp) {
        this.comp = comp;
    }
    formConfig = {
        area: 'outside',
        formCode: 'outside_approve_card'
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
            billId = formValue.rows[0].values['pk_outside'].value;
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
    getOneBillData = async (pk_outside) => {
        const {props} = this.comp;
        const {dispatch, outside} = props;
        try {
            let res = await dispatch({
                type: 'outside/getBillDetail',
                payload: {
                    pk_outside
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