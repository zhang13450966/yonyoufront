

import {promptBox} from 'nc-lightapp-front';

export default class ButtonAction {
    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props)
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
}