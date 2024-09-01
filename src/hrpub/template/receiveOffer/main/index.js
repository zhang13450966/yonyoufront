
import './index.less';

function postData() {
    let data = {};
    let param = window.top.location.search.substring(1);

    param = param.split('&');
    param.map((item) => {
        item = item.split('=');
        data[item[0]] = item[1]
    });

    post({
        url: '/nccloud/hrzz/entry/AcceptOfferAction.do',
        method: 'post',
        data: {
            busiParamJson: JSON.stringify(data)
        },
        success: function(res) {
            res = JSON.parse(res);
            if(res.success) {
                let sMsg = document.querySelector('.zt');
                let sPic = document.querySelector('.bg-pic');
                
                sMsg.style.display = 'block';
                sPic.style.display = 'inline-block';
            }
            else {
                let eMsg = document.querySelector('.errMsg');
                eMsg.innerHTML = res.error.message;
            }
        }
    });
}   

function post(opt) {
    let xhr = new XMLHttpRequest();

    let postStr = Object.keys(opt.data).map((key) => {
        return `${key}=${opt.data[key]}`;
    });

    
 
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            　　if (xhr.status === 200) {
                    opt.success && opt.success(xhr.responseText);
            　　} else {
                    opt.error && opt.error(xhr.responseText);
        　　    }
        　}
    }

    xhr.open('POST', opt.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(opt.data));
}


postData();