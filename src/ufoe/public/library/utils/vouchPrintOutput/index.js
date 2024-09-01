/*  zhy
* 打印输出参数说明
* oids: list:当前页凭证pk数组  card:当前pk数组
* type: vouvh_list,vouch_card    
* nodekey: list->'18300ATDV1_nccloud', card->'18300ADJV1_nccloud',
 */
// 打印
export function dataPrint(nodekey, oids, appcode,url) {
    $nccPlatform.print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        url, //后台服务url
        {
            appcode: appcode,
            funcode: appcode,
            nodekey: nodekey,
            oids: oids
        }, false, false
    )
}
// 输出
export function dataOutput(nodekey, oids, appcode,url) {
    // let userjson = {
    //     type: type
    // }
    // userjson = JSON.stringify(userjson);
    $nccPlatform.output({
        url: url,
        data: {
            appcode: appcode,
            funcode: appcode,
            nodekey: nodekey,
            oids: oids,
            // userjson,
            outputType: "output"
        },
    });
}