## 基本使用

```

 <Transfer
                    leftData={this.state.dataSource}
                    leftTitle={'待选'}
                    rightTitle={'已选'}
                    single={true}
                    rightData={this.state.targetData}
                    onChange={this.onChange}
                    MultiInit={this.props.MultiInit}
                />

```

## 参数配置
- leftData    必传参数 左边的数据格式数组
- leftTitle    左边的标题头
- rightTitle    右边的标题头
- single    非必传参数 是否开启单选模式
- rightData   必传参数 右边的数据格式数组
- onChange    必传参数 每次点击穿梭按钮的回调
- MultiInit    必传参数 用于获取多语