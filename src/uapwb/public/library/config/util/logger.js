export class _Logger {
    static log(
        title,
        {b = 'red'} = {},
        ...info
    ) {
        // filter 筛选控制台用标志
        console.log(`%cFilter:${title}`, `color:white;background:${b};`, ...info);
    }

    static trace (title, ...info) {
        // filter 筛选控制台用标志
        console.trace(`%cFilter:${title}`, `color:#b4c9fc;`, ...info);
    }

    static blue(title, ...info) {
        this.log(title, {b: '#258ef0'}, ...info)
    }

    static red(title, ...info) {
        this.log(title, {b: '#f02525'}, ...info)
    }

    static green(title, ...info) {
        this.log(title, {b: '#21a40f'}, ...info)
    }

    static yellow(title, ...info) {
        this.log(title, {b: '#f0a725'}, ...info)
    }

    static black(title, ...info) {
        this.log(title, {b: 'black'}, ...info)
    }

    static info(title, ...info) {
        this.blue(title, ...info)
    }

    static error(title, ...info) {
        this.red(title, ...info)
    }

    static waring(title, ...info) {
        this.yellow(title, ...info)
    }

    static text(title, ...info) {
        this.black(title, ...info)
    }
}