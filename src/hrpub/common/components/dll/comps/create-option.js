let isBlackBg = false
// 动态拼接option
let initialOption = {
  tooltip: {
      trigger: 'item'
  },
  legend: {
      show: false,
      itemWidth: 6,
      itemHeight: 6,
      textStyle: {
          color: isBlackBg ? '#848A96' : '#0D1424',
          fontSize: 10
      },
      itemGap: 12
  },
  title: {
      text: '',
      textStyle: {
          color: isBlackBg ? '#848A96' : '#111111',
          fontSize: 12
      },
      padding: [10, 0, 0, 9]
  },
  xAxis: {
      data: [],
      axisLabel: {
          inside: false,
          textStyle: {
              color: isBlackBg ? '#848A96' : '#0D1424',
              fontSize: '10'
          },
          interval: 0,
          formatter: function (value, index) {
            let dealValue = value
            if (dealValue.length > 5) {
                dealValue = value.substr(0, 5) + '...'
            }
            return dealValue
          }
      },
      axisTick: {
          show: false
      },
      axisLine: {
          lineStyle: {
              color: isBlackBg ? '#fff' : '#E8E8E8',
              opacity: isBlackBg ? '0.05' : '1'
          }
      }
  },
  yAxis: {
      minInterval: 1,
      axisLine: {
          lineStyle: {
              color: isBlackBg ? '#fff' : '#E8E8E8',
              opacity: isBlackBg ? '0.05' : '1'
          }
      },
      axisTick: {
          show: false
      },
      axisLabel: {
          textStyle: {
              color: isBlackBg ? '#848A96' : '#0D1424',
              fontSize: '10'
          }
      },
      splitLine: {
          lineStyle: {
              color: isBlackBg ? '#fff' : '#F1F1F1',
              opacity: isBlackBg ? '0.05' : '1'
          }
      }
  },
  grid: {
      left: 40,
      top: 53,
      bottom: 25
  },
  dataZoom: [
      {
          type: 'inside'
      }
  ],
  series: [
      {
          type: 'bar',
          barWidth: 14,
          itemStyle: {
              color: '#3BA0FF'
          },
          label: {
              show: true,
              position: 'top',
              textStyle: {
                  color: '#555',
                  fontSize: 10
              }
          },
          data: []
      }
  ]
}
let deepObjectMerge = (FirstOBJ, SecondOBJ) => { // 深度合并对象
  for (var key in SecondOBJ) {
      FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
          deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
}
  return FirstOBJ;
}
let deepClone = (obj) => { // 深度克隆
    let newObj=Array.isArray(obj)?[]:{}

    if(obj&&typeof obj ==="object"){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                newObj[key]=(obj && typeof obj[key]==='object')?deepClone(obj[key]):obj[key];
            }
        }
    }
    return newObj
}
// 服务量数据处理
let serviceNumDeal = (data) => {
  let serviceNumOption = {
      title: {
          text: data.title
      },
      xAxis: {
          data: data.xAxisData
      },
      series: [
          {
              data: data.seriesData
          }
      ]
  }
  return serviceNumOption
}
// 人均服务量数据处理
let averageServiceNum = (data) => {
  let serviceNumOption = {
      title: {
          text: data.title
      },
      xAxis: {
          data: data.xAxisData
      },
      legend: {
          top: 5,
          right: 10,
          show: true
      },
      series: data.seriesData
  }
  return serviceNumOption
}
// 十日业务量走势数据处理
let tenDayNumDataDeal = (data) => {
  let tenDayNumOption = {
      title: {
          text: data.title
      },
      legend: {
        show: true,
        bottom: 0,
        icon: 'rect',
        type: 'scroll',
        orient: 'horizontal',
      },
      xAxis: {
          axisLabel: {
              rotate: 45
          },
          data: data.xAxisData
      },
      yAxis: {
          splitLine: {
              show: false
          }
      },
      grid: {
          bottom: 55
      },
      series: data.seriesData
  }
  return tenDayNumOption
}
// 业务类型占比
let businessStyleDataDeal = (data) => {
  let businessStyle = {
      tooltip: {
          formatter: "{b}:{d}%"
      },
      title: {
          text: data.title
      },
      xAxis: {show: false},
      yAxis: {show: false},
      legend: {
          orient: 'vertical',
          top: 50,
          type: 'scroll',
          right: 0,
          show: true
      },
      series: [
          {
              type: 'pie',
              radius: ['42%', '55%'],
              center: ['40%', '55%'],
              itemStyle:{
                  borderWidth:5, //设置border的宽度有多大
                  borderColor: isBlackBg ? '#1F2A40' : '#fff',
              },
              label: {
                  formatter: '{d}%'
              },
              data: data.seriesData
          }
      ]
  }
  return businessStyle
}
// 用户满意度数据处理
let userSatisfactionDataDeal = (data) => {
  var initData = data.initData
  let seriesArr=[], colors=[['#1890FF', '#455A64'],['#2FC25B', '#455A64'],['#FACC14', '#455A64']]
  initData.forEach(function(item, index){
      seriesArr.push(
          {
              name: item.name,
              type: 'pie',
              clockWise: false,
              radius: [33, 45],
              label: {
                  show: false
              },
              labelLine: {
                  show: false
              },
              itemStyle:  {
                  borderWidth:3, //设置border的宽度有多大
                  borderColor: isBlackBg ? '#1F2A40' : '#fff',
                  color: colors[index][0],
              },
              hoverAnimation: false,
              center: [index * 30 + 20 +'%', '50%'],
              data: [{
                  value: item.value,
                  label: {
                      normal: {
                          formatter: function(params){
                              return params.value+'%';
                          },
                          position: 'center',
                          show: true,
                          textStyle: {
                              fontSize: '16',
                              color: '#000'
                          }
                      }
                  },
              }, {
                  value: 100-item.value,
                  name: 'invisible',
                  itemStyle: {
                      color: '#F0F2F5',
                      emphasis: {
                          color: '#F0F2F5'
                      }
                  }
              }]
          }    
      )
  });
  let userSatisfaction = {
      title: {
          text: data.title
      },
      tooltip: {
          show: false
      },
      legend: {
          show: true,
          data: data.legendData,
          bottom: 15,
          itemGap: 30
      },
      xAxis: {show: false},
      yAxis: {show: false},
      series: seriesArr
  }
  return userSatisfaction
}
// 服务业务量top10数据处理
let serviceNumTop10 = (data) => {
  let serviceNumTop10Option = {
      title: {
          text: data.title
      },
      xAxis: {
          data: data.xAxisData
      },
      legend: {
          show: true,
          bottom: 0,
          type: 'scroll',
          orient: 'horizontal'
      },
      grid: {
          bottom: 18 * data.tableLen + 58,
          width: '90%',
          left: 60
      },
      series: data.seriesData
  }
  return serviceNumTop10Option
}
// 业务类型统计
let businessTypeStatistics = (data) => {
  let businessTypeStatistics = {
      title: {
        text: data.title
      },
      xAxis: {
          data: data.xAxisData
      },
      grid: {
        bottom: 45
      },
      legend: {
          show: true,
          bottom: 0,
          type: 'scroll',
          orient: 'horizontal'
      },
      series: data.seriesData
  }
  return businessTypeStatistics
}
// 业务状态统计
let businessStatusStatistics = (data) => {
  let businessStatusStatistics = {
    title: {
      text: data.title
    },
    xAxis: {
        data: data.xAxisData
    },
    legend: {
        show: true,
        right: 10,
        top: 60,
        orient: 'vertical'
    },
    grid: {
      right: 70
    },
    series: data.seriesData
  }
  return businessStatusStatistics
}
export const returnOption = (type, chartData, isBlackBgFlag) => {
  isBlackBg = isBlackBgFlag
  let option = {}
  if (JSON.stringify(chartData) !== '{}') {
    switch (type) {
        // 服务量
        case 'serviceVolume':
          option = serviceNumDeal(chartData.serviceVolume)
          break;
        // 人均服务量
        case 'perCapitaServiceVolume':
          option = averageServiceNum(chartData.perCapitaServiceVolume)
          break;
        // 10日业务量走势
        case 'tenDayBusinessVolumeTrend':
          option = tenDayNumDataDeal(chartData.tenDayBusinessVolumeTrend)
          break;
        // 业务类型占比
        case 'proportionOfBusinessTypes':
          option = businessStyleDataDeal(chartData.proportionOfBusinessTypes)
          break;
        // 服务业务量TOP10
        case 'serviceVolumeTOP10':
          option = serviceNumTop10(chartData.serviceVolumeTOP10)
          break;
        // 用户满意度
        case 'userSatisfaction':
          option = userSatisfactionDataDeal(chartData.userSatisfaction)
          break;
        // 业务类型统计
        case 'businessTypeStatistics':
          option = businessTypeStatistics(chartData.businessTypeStatistics)
          break;
        // 业务状态统计
        case 'businessStatusStatistics':
          option = businessStatusStatistics(chartData.businessStatusStatistics)
          break;
          default:break;
      }
  }
  return deepObjectMerge(deepClone(initialOption), option)
}