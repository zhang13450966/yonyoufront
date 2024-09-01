
## 功能

> 上传方法

## 用法

```js

upload({
    action: '/upload.do', // 上传地址
    method: 'post', // 上传方式
    name: 'upload-target', // 可不填，自定义iframe的name
    multiple: 'multiple', // 是否允许多个文件同时长传
    onResult: (res) => {
        if(res.success) {
            alert('上传成功');
        }
    },
    onChange: (value) => {
        console.log('文件列表', value);
    },
    webkitdirectory: 'webkitdirectory',
    body = { // 上传的参数
        name: 'sss',
        age: 19
    }
});

```