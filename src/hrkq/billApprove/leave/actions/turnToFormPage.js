import { formatDate } from 'src/hrpub/common/utils/utils';
export default class FormAction {
    constructor(comp) {
        this.comp = comp;
    }
    formConfig = {
        area: 'leave',
        formCode: 'leave_approve_card'
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
            let leaveday = form.getFormItemsValue(this.formConfig.formCode, 'leaveday').value;
            let minunit = form.getFormItemsValue(this.formConfig.formCode, 'minunit').display;

            form.setFormItemsValue(this.formConfig.formCode, {
                leaveday: {
                    display: leaveday + minunit,
                    value: leaveday
                }
            })
            // 判断是否为哺乳假
            const breastfeedingleaveday = form.getFormItemsValue(this.formConfig.formCode, 'breastfeedingleaveday').value;
            const breastfeedingleaveway = form.getFormItemsValue(this.formConfig.formCode, 'breastfeedingleaveway').value;
            if (breastfeedingleaveday && breastfeedingleaveway) {
                form.setFormItemsValue(this.formConfig.formCode, {
                    begintime: {
                        value: form.getFormItemsValue(this.formConfig.formCode, 'begintime').value.split(" ")[0]
                    },
                    endtime: {
                        value: form.getFormItemsValue(this.formConfig.formCode, 'endtime').value.split(" ")[0]
                    }
                })
            }

            this.initCardMeta(this.formConfig.formCode)
            billId = formValue.rows[0].values['pk_leave'].value;
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
    initCardMeta = (formCode) => {
        const { form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setFormItemsVisible } = form;
        let halfDayBegin = getFormItemsValue(formCode, 'start_day_type').value;
        let halfDayEnd = getFormItemsValue(formCode, 'end_day_type').value;
        let begintime = getFormItemsValue(formCode, 'begintime').value;
        let endtime = getFormItemsValue(formCode, 'endtime').value;
        let showbegindate = getFormItemsValue(formCode, 'showbegindate').value;
        let showenddate = getFormItemsValue(formCode, 'showenddate').value;
        let breastfeedingleaveway = getFormItemsValue(formCode, 'breastfeedingleaveway').value;
        let minunit = form.getFormItemsValue(this.formConfig.formCode, 'minunit').value;
        let obj = {}
        let flag = minunit === '1'; // 小时
        let flag1 = minunit === '2' && !halfDayBegin // 天
        let flag2 = minunit === '2' && halfDayBegin // 半天
        let cardDefaultVisiable = {
            breastfeedingleaveway: !!breastfeedingleaveway,
            breastfeedingleaveday: !!breastfeedingleaveway,
            leaveday: !breastfeedingleaveway
        }
        setFormItemsVisible(formCode, cardDefaultVisiable);
        if (!flag || breastfeedingleaveway) {
            obj = {
                begintime: {
                    display: begintime.replace(/\s(\d|:)+/, (a, b) => {
                        return (flag1 || breastfeedingleaveway)? '' : getFormItemsValue(formCode, 'start_day_type').display
                    }),
                    value: begintime,
                },
                endtime: {
                    display: endtime.replace(/\s(\d|:)+/, (a, b) => {
                        return (flag1 || breastfeedingleaveway)? '' : getFormItemsValue(formCode, 'end_day_type').display
                    }),
                    value: endtime,
                },
                showbegindate: {
                    display: showbegindate.replace(/\s(\d|:)+/, (a, b) => {
                        return (flag1 || breastfeedingleaveway)? '' : getFormItemsValue(formCode, 'start_day_type').display
                    }),
                    value: begintime,
                },
                showenddate: {
                    display: showenddate.replace(/\s(\d|:)+/, (a, b) => {
                        return (flag1 || breastfeedingleaveway)? '' : getFormItemsValue(formCode, 'end_day_type').display
                    }),
                    value: endtime,
                },
            }
            setFormItemsValue(formCode, obj)
        }
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
    getOneBillData = async (pk_leave) => {
        const {props} = this.comp;
        const {dispatch} = props;
        try {
            let res = await dispatch({
                type: 'leave/getBillDetail',
                payload: {
                    pk_leave
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