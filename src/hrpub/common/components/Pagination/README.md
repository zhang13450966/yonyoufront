## 分页器



| 名字 | 类型 | 默认值 | 描述 |
|-----|------|-------|-----|
| current | number | - | 当前页值，从1开始，当设置此值时代表组件为受控组件 |
| defaultCurrent | number | 1 | 默认当前页码 |
| defaultPageSize | number | 10 | 默认每页条数 |
| hideOnSinglePage | bool | false | 只有一页的时候是否隐藏分页器 |
| pageSize | number | 10 | 每页条数 |
| pageSizeOptions | Array | [10,20,30,40] | 指定每页显示多少条 |
| showQuickJumper | bool | false | 是否显示快速跳转 |
| showSizeChanger | bool | false | 是否可以改变pageSize |
| total | number | - | 数据总条数 |
| onChange | function | - | 页码改变回调函数 |
| onShowSizeChange | function | - | pageSize改变回调 |
| showSizeInput | function | 展示pagesize修改输入框，按下回车触发onShowSizeChange函数，与showSizeChanger互斥|
