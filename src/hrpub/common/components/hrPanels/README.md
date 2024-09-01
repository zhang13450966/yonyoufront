- container  包含整个panel的外壳以及panel内容的父类
- list    各种弹框的实例  setModalValue(这个必须自己手动触发)和getChildComponent必须实现
- config 为各弹框引用map,业务调用会按照键值去索引


## 基本使用

```

this.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()

//hr-panel-modal 为自定义索引

```

## 参数配置
- classNameChild    hr-panel-child-component 的附属类名 用于覆盖默认类样式 ` div.hr-other-modal { width: 100%; }`
- header    modal header 名称
- searchParam  查询条件
- callback  回调