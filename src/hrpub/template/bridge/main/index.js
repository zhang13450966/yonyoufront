import {ajax} from 'nc-lightapp-front';
import {getUrlParam} from '../../login/actions/tool';
import './index.less';

let encrypturl = getUrlParam('encrypturl');



class ThirdLogin {
    constructor() {
        this.loginSubmit = this.loginSubmit.bind(this);
    }

    loginSubmit(data) {
        ajax({
            url: '/nccloud/hr/login/HRPageJump4ThirdSys.do',
            data: data,
            success: (res) => {
                if(res.success) {
                    let {url, userId} = res.data;
                    window.location.href = `${url}?userId=${userId}&tenantId=00000000`
                }
            }
        });
    }

    init() {
        this.loginSubmit({
            encrypturl: encrypturl
        });
    }
}


let tl = new ThirdLogin();

tl.init();