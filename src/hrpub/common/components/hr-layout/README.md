## 基础

### 引入HrLayout

```
import HrLayout from 'src/hrpub/common/components/hr-layout'

```

- 显示参数
  - type 必输 代表几种内置固定布局 `list`、 `card` 、`tree-card` 、`single-table`
  - config 可选
- 隐式参数 (这个是根据显示type动态进行传入的)
  - HrHeader 参数有 `opt`,`btnApp`,`extralRight`,`extralLeft`,`staticHeader`
  - HrTable  参数有 `table`
  - HrForm  参数有 `form`

### 举个🌰

```
<HrLayout
    type="list"
    opt = {(
        <React.Fragment>
            <ReferSearch
                delay={false}
                orgVal={this.state.orgVal}
                getOrgData={this.getOrgData.bind(this)} />
            <NCBackBtn
                style={{ display: showMode === 'edit' ? '' : 'none', float: 'left' }}
                onClick={this.back.bind(this)}
                title={this.state.json['i6013-000495']}
            >
            </NCBackBtn>
        </React.Fragment>
    )}
    btnApp ={(
        <React.Fragment>
            {
                createButtonApp()
            }
        </React.Fragment>
    )}
    table = {
        createEditTable('taxreport')
    }
    pagination = {
        <Pagination
                total={this.state.pageInfo.total}
                pageSize={this.state.pageInfo.pageSize}
                showQuickJumper={true}
                showSizeChanger={true}
                // current = {state.pageInfo.pageIndex}
                onChange={this.paginationEve.bind(this)}
                onShowSizeChange={this.pageSizeSelect.bind(this)}
            /> 
        }
    />

```

## 高阶

> 一切皆是接口，配置啥的都可以重新制定