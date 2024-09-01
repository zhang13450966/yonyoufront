


## 功能

> 同域下载方法

## 原理

> 通过form表单提交到一个iframe里，通过iframe的onload判断下载结果 

## 参数

  - url: 下载连接   body: 下载参数
  - onResult: 当iframe加载完毕时，返回iframe内的body对象，内容可能为空，自行判断内容是否是下载成功还是失败
  - onError: 当跨域，获取不到body的时候，会触发该函数
  - method: form表单提交的方式，默认是post
  - enctype: form表单的enctype 1 2 3 三个值，看代码便知

## 用法

```js
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
```