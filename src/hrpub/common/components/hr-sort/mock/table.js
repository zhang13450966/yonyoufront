/**
 * Created by wanghongxiang on 2019/2/21.
 */
export default  {
    data: {
        savedItem: [
            {
                field_name: "部门编码",
                field_code: "org_dept_v.code",
                ascend_flag: true
            },
            {
                field_name: "员工号",
                field_code: "hi_psnjob.clerkcode",
                ascend_flag: true
            }
        ],
        selectedItem: [
            {
                field_name: "部门编码",
                field_code: "org_dept_v.code"
            },
            {
                field_name: "部门顺序号",
                field_code: "org_dept_v.displayorder"
            },
            {
                field_name: "人员顺序号",
                field_code: "hi_psnjob.showorder"
            },
            {
                field_code: "hi_psnjob.clerkcode",
                field_name: "员工号"
            },
            {
                field_code: "bd_psndoc.name",
                field_name: "姓名"
            },
            {
                field_code: "bd_psncl.name",
                field_name: "人员类别"
            },
            {
                field_code: "org_orgs_v.name",
                field_name: "任职组织"
            },
            {
                field_code: "org_dept_v.name",
                field_name: "部门"
            }
        ]
    },
    success: true
}