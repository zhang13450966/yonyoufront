/*
 * @Author: 王勇 
 * @PageInfo: 附件管理关闭功能 
 * @Date: 2020-02-14 12:31:44 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-04-09 09:39:52
 */
export default function onHideUploaderClick(){
    this.setState({
        showUploader: false,
        groupLists: []
    })
}