/*
 * @Author: Hugo
 * @Date: 2022-04-22 09:17:05
 * @LastEditTime: 2022-04-22 09:19:39
 * @LastEditors: Please set LastEditors
 * @Description: 脚手架提供CZ的标准配置
 *               结合目前整体现状精简提交格式模板，
 *               目前只提供三步配置：type选择，scope选择，suject填写
 * @FilePath: /low_code_designer_husky/config/CZConfig.js
 */
/**
 * 配置commitizen自定义格式样板
 * 社区标准提交中需要回答：type，scope，suject，body，breaking等问题，
 * 目前考虑现实情况，我们只需要开放type，scope，suject问题
 */
const CZConfig = {
    types: [
        { value: 'feat', name: 'feat:    增加新功能' },
        { value: 'fix', name: 'fix:    修复bug' },
        { value: 'refactor', name: 'refactor:    代码重构（非新功能及修复bug）' },
        { value: 'style', name: 'style:    样式修改不影响逻辑' },
        { value: 'perf', name: 'perf:    性能优化' },
        { value: 'chore', name: 'chore:    更改配置文件' },
        { value: 'docs', name: 'docs:    文档变更' },
        { value: 'test', name: 'test:    增加测试' },
        { value: 'revert', name: 'revert:    版本回退' },
        { value: 'del', name: 'del:    删除代码/文件' },
        { value: 'init', name: 'init:    初始提交' }
    ],
    // scope 类型，针对 React 项目
    scopes: [
        ['empty', '不需要设置scope'],
        ['components', '组件相关'],
        ['hooks', 'hook 相关'],
        ['hoc', 'HOC'],
        ['utils', 'utils 相关'],
        ['api', 'api 相关'],
        ['tinper', '对tinper的调整'],
        ['platform', '对platform的调整'],
        ['styles', '样式相关'],
        ['other', '其他相关'],
        ['custom', '以上都不符合？我要自定义']
    ].map(([value, description]) => {
        return {
            value,
            name: `${value.padEnd(30)} (${description})`
        };
    }),
    // 可以设置scope的类型跟随type类型匹配项，例如：fix
    // scopeOverrides: {

    // }
    messages: {
        type: '请确保你的提交遵循原子提交规范!\n请选择你要提交的类型:\n',
        scope: '请选择一个scope更改的范围(可选):\n',
        // 选择 scope: custom时会出现下面提示
        customScope: '请输入自定义的scope:\n',
        subject: '请对本次提交写一个简练的描述:\n',
        body: '添加一个详细描述（可选），\n可以附上新功能的描述或bug链接、截图链接等，\n使用”|“换行:\n',
        breaking: '列举非兼容性重大变更(可选):\n',
        footer: '请列举出所有变更的 ISSUES CLOSED(可选). Eg.: #31, #34:\n',
        confirmCommit: '确认提交?'
    },
    skip: ['body', 'footer'],
    // 是否允许自定义填写 scope ，设置为 true ，会自动添加两个 scope 类型 [{ name: 'empty', value: false },{ name: 'custom', value: 'custom' }]
    allowCustomScopes: false,
    allowBreakingChanges: ['feat', 'fix'],
    // 跳过你想要跳过的任何问题
    skipQuestions: ['body', 'breaking', 'footer'],
    // 本次提交简练描述的字数限制
    subjectLimit: 100,
    // 支持body和footer
    breaklineChar: '|',
    // 脚注前缀
    footerPrefix: 'ISSUES CLOSED:'
    // askForBreakingChangeFirst : true,
};
module.exports = CZConfig;