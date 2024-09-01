

import {promptBox} from 'nc-lightapp-front';

export default class ButtonAction {
    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props);
    }

    buttons = ['auth', 'refresh', 'save', 'cancel']

    // 初始化页面的按钮状态
    initPageButton = () => {
        this.button.setButtonDisabled({
            auth: false,
            refresh: false,
            save: false,
            cancel: false
        });
        this.button.setButtonsVisible({
            auth: true,
            refresh: true,
            save: false,
            cancel: false
        });
    }

    // 进入到主表页面的按钮状态
    toMainPageStatus() {
        this.button.setButtonDisabled({
            auth: false,
            refresh: false,
            save: false,
            cancel: false
        });
        this.button.setButtonsVisible({
            auth: true,
            refresh: true,
            save: false,
            cancel: false
        });
    }

    // 进入分配的按钮状态
    toAssignmentStatus() {
        this.button.setButtonDisabled({
            auth: false,
            refresh: false,
            save: false,
            cancel: false
        });
        this.button.setButtonsVisible({
            auth: false,
            refresh: false,
            save: true,
            cancel: true
        });
    }



    onClickButton = (props, btnCode) => {
        const {
            language,
            currentTreeData
        } = this.comp.props.reportAss;
        if(btnCode === 'auth') {
            this.comp.action.ReportQuery.toAssignmentStatus()
                .then(() => {
                    this.toAssignmentStatus();
                });
        }
        else if(btnCode === 'cancel') {
            promptBox({
                color: 'warning',
                title: language['hrpub-000115'], // 确认取消
                content: language['hrpub-000088'], // 是否确认要取消吗
                beSureBtnClick: () => {
                    this.comp.action.ReportQuery.toMainPageStatus()
                        .then(() => {
                            this.toMainPageStatus();
                        });
                }
            });
        }
        else if(btnCode === 'refresh') {
            this.comp.action.ReportQuery.getMainTableData(currentTreeData);
        }
        else if(btnCode === 'save') {
            this.comp.action.ReportQuery.saveChange();
        }
    }
}