/*  zhy
* 打印输出参数说明
* oids: list:当前页凭证pk数组  card:当前pk数组
* type: vouvh_list,vouch_card    
* nodekey: list->'18300ATDV1_ufoc', card->'18300ADJV1_ufoc',
* '/nccloud/ufoc/print/vouchPrint.do':为凭证类打印公共接口；vouchUrl为其他打印接口
 */
// 打印
export function vouchPrint(type, nodekey, oids, appcode, vouchUrl) {
    //let page = $appRoot.props.table.getTablePageInfo('tableIds')
    let userjson = {
        type: type
    }
    userjson = JSON.stringify(userjson)
    $nccPlatform.print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        vouchUrl ? vouchUrl : '/nccloud/ufoc/print/vouchPrint.do', //后台服务url
        {
            appcode: appcode,
            funcode: appcode,
            nodekey: nodekey,
            oids: oids,
            userjson
        }
    )
}
// 输出
export function vouchOutput(type, nodekey, oids, appcode, vouchUrl) {
    let userjson = {
        type: type
    }
    userjson = JSON.stringify(userjson);
    $nccPlatform.output({
        url: vouchUrl ? vouchUrl : '/nccloud/ufoc/print/vouchPrint.do',
        data: {
            appcode: appcode,
            funcode: appcode,
            nodekey: nodekey,
            oids: oids,
            userjson,
            outputType: "output"
        },
    });
}