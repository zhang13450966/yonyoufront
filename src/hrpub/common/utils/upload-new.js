import {
    ajax
} from 'nc-lightapp-front';

let f = null;
let ifm = null;

export default function ({
                             action,
                             method,
                             name,
                             multiple,
                             onResult,
                             onChange,
                             webkitdirectory,
                             body = {}
                         }) {

    if (f) {
        document.body.removeChild(f);
    }
    if (ifm) {
        document.body.removeChild(ifm);
    }

    let oForm = document.createElement('form');
    let oIframe = document.createElement('iframe');
    let oInput = document.createElement('input');

    f = oForm;
    ifm = oIframe;

    oIframe.src = 'about:blank';
    oIframe.name = 'upload-target';
    oIframe.style.display = 'none';
    oIframe.onload = function () {
        let res = oIframe.contentWindow.document.body.innerText;

        if (res) {
            let resData = null;

            try {
                resData = JSON.parse(res);
                if (typeof resData === 'string') {
                    throw new Error();
                }
            } catch (e) {
                resData = unzip(res);
            }
            onResult && onResult(resData);
        }
    };
    document.body.appendChild(oIframe);

    oForm.action = action;
    oForm.method = method || 'post';
    oForm.enctype = 'multipart/form-data';
    oForm.style.display = 'none';
    oForm.target = 'upload-target';

    Object.keys(body).forEach((key) => {
        let oInput = document.createElement('input');

        oInput.type = 'hidden';
        oInput.name = key;
        oInput.value = body[key];

        oForm.appendChild(oInput);
    });

    oInput.name = name;
    oInput.style.display = 'none';
    oInput.onchange = function (value) {
        if (onChange) {
            if (onChange(value)) {
                doUpload();
            }
        } else {
            onChange && onChange(value);
        }
    };
    oInput.type = 'file';
    oInput.multiple = multiple ? 'multiple' : false;
    oInput.webkitdirectory = webkitdirectory ? 'webkitdirectory' : false;


    oForm.appendChild(oInput);
    document.body.appendChild(oForm);
    oInput.click();

    function doUpload() {
        const formData = new FormData(oForm);
        ajax({
            url: action,
            type: 'POST',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            success: function (data) {
                onResult && onResult(data);
            },
            error: function (data) {
                onResult && onResult(data);
            }
        });
    }

    return {
        submit: doUpload
    };
}