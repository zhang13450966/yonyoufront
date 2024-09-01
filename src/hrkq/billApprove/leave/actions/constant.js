export default class Constant {
    reqData = [{
        rqUrl: '/platform/templet/querypage.do',
        rqJson: `{\n  \"pagecode\": \"60656041nccloud\",\n  \"appcode\": \"60656041\"\n}`,
        rqCode: 'template'
    }, {
        rqUrl: '/platform/appregister/queryallbtns.do',
        rqJson: `{\n  \"pagecode\": \"60656041nccloud\",\n  \"appcode\": \"60656041\"\n}`,
        rqCode: 'button'
    }, {
        rqUrl: '/platform/appregister/queryappcontext.do',
        rqJson: `{\n  \"appcode\": \"60656041\"}`,
        rqCode: 'context'
    }];
};