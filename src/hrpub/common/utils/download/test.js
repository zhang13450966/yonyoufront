
import download from './download';

let btn = document.getElementById('down');


btn.addEventListener('click', function (e) {
    
    download({
        url: '/nccloud/hrwa/bankoffer/ExportAction.do',
        method: 'post',
        body: {},
        success: function(res) {
            // console.log(this.state.json['hrpub-000034'], res);/* 国际化处理： 成功了*/
        },
        fail: function(err) {
            // console.log(this.state.json['hrpub-000035'], err);/* 国际化处理： 出错了*/
        }
    });

});

