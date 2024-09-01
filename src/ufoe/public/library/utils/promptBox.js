/**
 * 提取常用配置 rest参数可以重新覆盖配置，使用之前的方式
 * color: 默认warning, 很少改变这个配置, 若有 reset改之
 * @example 期望使用方式
 * - await $namespace.promptBox('title', 'content'); //
 * - case beSureBtnClick do following // beSureBtnClick()
 * - else do nothing
 *
    async f() {
        await $namespace.promptBox('title', 'content');
        console.log('beSureBtnClick clicked')
    }
 * */
export function _promptBox(title, content, rest = {}) {
    $nccPlatform.promptBox({
        color: $nccConst.spell.warning,
        title, content, beSureBtnClick: () => _resolve(),
        ...rest,
    });

    let _resolve;
    return new Promise(resolve => _resolve = resolve);
}