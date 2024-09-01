import {ajax} from 'nc-lightapp-front';

import Toast from 'antd-mobile/lib/toast';

export default function({
    success,
    error,
    ...others
}) {

    return new Promise((resolve, reject) => {

        ajax({
            success: (res) => {
                typeof success === 'function' && success(res);
                resolve(res);
            },
            error: (e) => {
                if(typeof error === 'function') {
                    error(e);
                }
                else {
                    Toast.fail(e.toString(), 3, null, false);
                }
                reject(e);
            },
            ...others
        });

    });

}