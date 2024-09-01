# HRChartTile 统计图磁贴

## 使用场景

**SSC**工作台小部件

## 支持的统计图类型

* 甜甜圈图 DonutChart （即空心饼图）

##用例

###引入

```javascript
import HRChartTile from 'src/hrpub/common/components/hr-ChartTile';
```

###JSX 使用

```javascript
<HRChartTile
      title='我是磁贴标题'
      chartData={{}} //统计图所渲染的数据对象，不同类型的图需要不同结构的数据对象
      onMoreClick={(instance)=>{}} //图例"更多"项点击事件回调（instance为图表实例）
      onRefreshClick={()=>{}} //"刷新"图标点击事件回调
      size={{col: 3, row: 2}} //磁贴预设尺寸方案，例如1✕2、 2✕3
/>
```



甜甜圈图的数据对象结构：

```javascript
{
  percentage: {
    "正式员工": 1,
    "实习生": 2,
    "外包人员": 3,
    "高级专家": 4,
    "集团总裁": 5,
    "more": { //折叠项。该属性叫法固定，不随多语环境而变
     	 "高管": 6,
       "高高管": 7,
       "高高高管": 8
    }
  },
    count: ‘9’
}
```