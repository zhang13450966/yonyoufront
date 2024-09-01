import {getBusinessInfo, cacheTools} from 'nc-lightapp-front';

let businessInfo = getBusinessInfo() || {};

export default class FormAction {
    constructor(comp) {
        this.comp = comp;
    }
    formConfig = {
        area: 'leaveoff',
        formCode: 'leaveoff_approve_card'
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
            this.initCardMeta(formValue)
            form.setAllFormValue({
                [this.formConfig.formCode]: formValue
            });
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
    getOneBillData = async (pk_leaveoff) => {
        const {props} = this.comp;
        const {dispatch, leaveoff} = props;
        try {
            let res = await dispatch({
                type: 'leaveoff/getBillDetail',
                payload: {
                    pk_leaveoff
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
    initCardMeta = (formValue) => {
        let values = formValue.rows[0].values
        let leaveday = values.leaveday.value;
        let leaveoffday = values.leaveoffday.value;
        let minunitDisplay = values.minunit.display;

        let halfDay = values.leave_start_day_type.value;
        let leaveshowbegindate = values.leaveshowbegindate.value||'';
        let leaveshowenddate = values.leaveshowenddate.value||'';
        let leaveoffshowbegindate = values.leaveoffshowbegindate.value||'';
        let leaveoffshowenddate = values.leaveoffshowenddate.value||'';
        let dr_flag = values.dr_flag.value;
        let breastfeedingleaveday = values.breastfeedingleaveday;
        let feedStatus = breastfeedingleaveday && breastfeedingleaveday.value || false
        let minunit = values.minunit.value;
        values.leaveday.display = leaveday + minunitDisplay;
        if (dr_flag === '1') {
            values.leaveoffday.display = 0 + minunitDisplay;
        } else {
            values.leaveoffday.display = leaveoffday + minunitDisplay;
        }

        let obj = {}
        let flag = minunit === '1'; // 小时
        let flag1 = minunit === '2' && !halfDay // 天
        let flag2 = minunit === '2' && halfDay // 半天
        if (!flag||feedStatus) {
            values.leaveshowbegindate.display =leaveshowbegindate.replace(/\s((?:\d|:)+)/, (a, b) => {
                return flag1||feedStatus ? '' : (b > '12:00:00' ? ' 下午' : ' 上午')
            })
            values.leaveshowenddate.display =leaveshowenddate.replace(/\s((?:\d|:)+)/, (a, b) => {
                return flag1||feedStatus ? '' : (b > '12:00:00' ? ' 下午' : ' 上午')
            })
            values.leaveoffshowbegindate.display =leaveoffshowbegindate.replace(/\s((?:\d|:)+)/, (a, b) => {
                return flag1||feedStatus ? '' : (b > '12:00:00' ? ' 下午' : ' 上午')
            })
            values.leaveoffshowenddate.display =leaveoffshowenddate.replace(/\s((?:\d|:)+)/, (a, b) => {
                return flag1||feedStatus ? '' : (b > '12:00:00' ? ' 下午' : ' 上午')
            })
        }
    }
}