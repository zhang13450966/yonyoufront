/*
 * @Author: Hugo
 * @Date: 2022-04-21 09:37:02
 * @LastEditTime: 2022-04-26 17:20:43
 * @LastEditors: Please set LastEditors
 * @Description: 脚手架提供ESLintRC标准配置
 *               ESLint规则包括两大类，sonarjs和eslint
 *               我们会在sonarjs/recommended和eslint:recommended基础上进行规则定制
 * @FilePath: /low_code_designer_husky/config/ESLintConfig.js
 */
const ESLintConfig = {
    // 此目录为根目录，不再向上查找配置。
    root: true,
    // 解析器类型:
    parser: 'babel-eslint',
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:sonarjs/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
        'standard'
    ],
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: 'module',
        experimentalObjectRestSpread: true,
        experimentalDecorators: true
    },
    plugins: [
        'react',
        'sonarjs'
    ],

    /**
     * off 或 0 --关闭规则
     * warn 或 1 -- 开启规则，使用警告级别的错误：warn (不会导致程序退出),
     * error 或 2 -- 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    rules: {
        /* ===========sonarjs规则============ */
        'sonarjs/no-identical-functions': 1,
        'sonarjs/no-duplicate-string': 1,
        'sonarjs/cognitive-complexity': [1, 80],
        'sonarjs/no-duplicated-branches': 1,
        'sonarjs/no-collapsible-if': 1,

        'no-class-assign': 1,
        'no-console': [
            'error', { 'allow': ['log', 'warn', 'error'] }
        ],
        // 强制所有控制语句使用一致的括号风格
        'curly': [2, 'all'],
        // 不允许标签与变量同名
        'no-label-var': 2,
        // 禁用特定的全局变量
        'no-restricted-globals': 2,
        // 不允许在变量定义之前使用它们
        'no-use-before-define': 2,
        // 禁止直接调用Object.prototypes的内置属性
        'no-prototype-builtins': 0,
        // 强制函数中的变量在一起声明或分开声明
        'one-var': 0,

        /* ==============代码风格指南=============== */
        // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
        'array-bracket-spacing': [2, 'never'],
        // 禁止或强制在单行代码块中使用空格(禁用)
        'block-spacing': [1, 'never'],
        // 强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        // if while function 后面的{必须与if在同一行，java风格。
        'brace-style': [1, '1tbs', { 'allowSingleLine': true }],
        // 控制逗号前后的空格
        'comma-spacing': [2, {
            'before': false,
            'after': true
        }],
        // 要求或禁止使用拖尾逗号
        'comma-dangle': [2, 'only-multiline'],
        // 控制逗号在行尾出现还是在行首出现 (默认行尾)
        'comma-style': [2, 'last'],
        // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
        'computed-property-spacing': [2, 'never'],
        // 用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，应该没卵用了
        // e.g [0,"self"] 指定只能 var that = this. self不能指向其他任何值，this也不能赋值给self以外的其他值
        'consistent-this': [2, 'self', 'that', '_self', '_that', 'me', '_this'],
        // 强制使用命名的 function 表达式
        // 'func-names': 0,
        'func-names': [1, "always"],
        // 文件末尾强制换行
        'eol-last': 2,
        // "SwitchCase" (默认：0) 强制 switch 语句中的 case 子句的缩进水平
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1,
                'MemberExpression': 1
            }
        ],
        // 要求或禁止在函数标识符和其调用之间有空格
        'func-call-spacing': [2, 'never'],
        // 强制在对象字面量的属性中键和值之间使用一致的间距
        'key-spacing': [2, {
            'beforeColon': false,
            'afterColon': true
        }],
        // 要求在注释周围有空行 ( 要求在块级注释之前有一空行)
        'lines-around-comment': [
            1,
            {
                'beforeBlockComment': true,
                'afterBlockComment': false,
                'beforeLineComment': false,
                'afterLineComment': false
            }
        ],
        // 强制回调函数最大嵌套深度 5层
        'max-nested-callbacks': [2, 5],
        // 强制在 JSX 属性中一致地使用双引号或单引号
        'jsx-quotes': ['error', 'prefer-double'],
        // 强制在关键字前后使用一致的空格 (前后腰需要)
        'keyword-spacing': 2,
        // 强制一行的最大长度
        'max-len': [
            'warn',
            {
                'code': 120,
                'comments': 80,
                'ignoreUrls': true
            }
        ],
        // 强制最大行数
        'max-lines': 0,
        // 强制 function 定义中最多允许的参数数量
        'max-params': [1, 5],
        // 强制 function 块最多允许的的语句数量
        'max-statements': [1, 200],
        // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
        'new-cap': [2, {
            'newIsCap': true,
            'capIsNew': false
        }],
        // 要求调用无参构造函数时有圆括号
        'new-parens': 2,
        // 禁止使用 Array 构造函数
        'no-array-constructor': 2,
        // 禁止 if 作为唯一的语句出现在 else 语句中
        'no-lonely-if': 0,
        // 禁止混合使用不同的操作符
        'no-mixed-operators': 2,
        // 禁止空格和 tab 的混合缩进
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        // 不允许多个空行
        'no-multiple-empty-lines': [2, { 'max': 2 }],
        // 不允许否定的表达式
        'no-negated-condition': 0,
        // 不允许使用嵌套的三元表达式
        'no-nested-ternary': 0,
        // 禁止使用 Object 的构造函数
        'no-new-object': 2,
        // 禁止使用一元操作符 ++ 和 --
        'no-plusplus': 0,
        // 禁止 function 标识符和括号之间出现空格
        'no-spaced-func': 2,
        // 禁用行尾空格
        'no-trailing-spaces': 2,
        // 禁止可以在有更简单的可替代的表达式时使用三元操作符
        'no-unneeded-ternary': 2,
        // 禁止属性前有空白
        'no-whitespace-before-property': 2,
        // 强制操作符使用一致的换行符
        'operator-linebreak': [2, 'before', {
            'overrides': {
                '?': 'before',
                ':': 'before'
            }
        }],
        // 要求或禁止块内填充
        'padded-blocks': [
            'error',
            {
                'blocks': 'never',
                'classes': 'always',
                'switches': 'never'
            }
        ],
        'quote-props': [2, 'as-needed'],
        // 强制使用一致的反勾号、双引号或单引号
        'quotes': [2, 'single', 'avoid-escape'],
        // 要求使用 JSDoc 注释
        'require-jsdoc': 0,
        // TODO 目前暂时不做注释文档的强制要求
        // 'require-jsdoc': [
        //     'error',
        //     {
        //         require: {
        //             FunctionDeclaration: true,
        //             MethodDefinition: true,
        //             ClassDeclaration: true,
        //             ArrowFunctionExpression: true,
        //             FunctionExpression: true
        //         }
        //     }
        // ],
        // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
        'semi': [2, 'always'],
        // 强制分号之前和之后使用一致的空格
        'semi-spacing': 2,
        // 强制在块之前使用一致的空格
        'space-before-blocks': [2, 'always'],
        // 强制在 function的左括号之前使用一致的空格
        'space-before-function-paren': [2, 'never'],
        // 强制在圆括号内使用一致的空格
        'space-in-parens': [2, 'never'],
        // 要求操作符周围有空格
        'space-infix-ops': 2,
        // 强制在一元操作符前后使用一致的空格
        'space-unary-ops': [2, {
            'words': true,
            'nonwords': false
        }],
        // 强制在注释中 // 或 /* 使用一致的空格
        'spaced-comment': [
            2,
            'always',
            {
                'markers': [
                    'global', 'globals',
                    'eslint', 'eslint-disable',
                    '*package', '!'
                ]
            }
        ],
        // 要求或禁止 Unicode BOM
        'unicode-bom': 2,
        // 禁止词法声明 (let、const、function 和 class) 出现在 case或default 子句中
        'no-case-declarations': ['warn'],
        // 强制大括号内换行符的一致性
        'object-curly-newline': ['error', { 'multiline': true }],
        'object-curly-spacing': ['error', 'always'],
        // 强制驼峰
        'camelcase': 0,
        // 目前不做强制驼峰命名要求
        // 'camelcase': [
        //     'error',
        //     {
        //         'properities': 'never',
        //         'ignoreDestructuring': true,
        //         'ignoreImports': true,
        //         'ignoreGlobals': true
        //     }
        // ],

        /* ==============ES6相关=================== */
        // 要求箭头函数体使用大括号
        'arrow-body-style': ['error', 'as-needed'],
        // 要求箭头函数的参数使用圆括号
        'arrow-parens': ['error', 'as-needed'],
        // 该该规则规范化箭头函数的箭头(=>)之前或之后的空格风格
        'arrow-spacing': [2, {
            'before': true,
            'after': true
        }],
        // 强制 generator 函数中 * 号周围使用一致的空格
        'generator-star-spacing': [2, {
            'before': true,
            'after': true
        }],
        // 禁用不必要的构造函数
        'no-useless-constructor': 1,
        // 不允许箭头功能，在那里他们可以混淆的比较
        'no-confusing-arrow': 0,
        // 禁止修改 const 声明的变量
        'no-const-assign': 2,
        //  禁止类成员中出现重复的名称
        'no-dupe-class-members': 2,
        // 每个模块只能使用一个import
        'no-duplicate-imports': 2,
        // 禁止 Symbolnew 操作符和 new 一起使用
        'no-new-symbol': 2,
        // 允许指定模块加载时的进口
        'no-restricted-imports': 0,
        // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        'no-this-before-super': 2,
        // 禁止在对象中使用不必要的计算属性
        'no-useless-computed-key': 2,
        // 要求使用 let 或 const 而不是 var
        'no-var': 2,
        // 要求使用 const 声明那些声明后不再被修改的变量
        'prefer-const': 1,
        // 要求使用模板字面量而非字符串连接
        'prefer-template': 1,
        // Suggest using the rest parameters instead of arguments
        'prefer-rest-params': 1,
        // 要求generator 函数内有 yield
        'require-yield': 2,
        // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
        'template-curly-spacing': 1,
        // 强制在 yield* 表达式中 * 周围使用空格
        'yield-star-spacing': 2,

        // 强制使用一致的换行风格
        'linebreak-style': [2, 'unix'],
        // 禁止在return语句中使用赋值操作符
        'no-return-assign': ['error', 'always'],
        // 如果三元表达式跨多行，则强制三元表达式操作数之间的换行符
        'multiline-ternary': ['error', 'always-multiline'],

        /* ==============React相关=================== */
        // 在JSX中强制布尔属性符号
        'react/jsx-boolean-value': 2,
        // 在JSX中验证右括号位置
        'react/jsx-closing-bracket-location': 1,
        // 在JSX属性和表达式中加强或禁止大括号内的空格
        'react/jsx-curly-spacing': [2, {
            'when': 'never',
            'children': true
        }],
        // 在数组或迭代器中验证JSX具有key属性
        'react/jsx-key': ['error', { checkFragmentShorthand: true }],
        // 限制JSX中单行上的props的最大数量
        'react/jsx-max-props-per-line': [1, { 'maximum': 5 }],
        // 防止在JSX中重复的props
        'react/jsx-no-duplicate-props': 2,
        // 在JSX中禁止未声明的变量
        'react/jsx-no-undef': 2,
        // 为用户定义的JSX组件强制使用PascalCase命名
        'react/jsx-pascal-case': 2,
        // 防止反应被错误地标记为未使用
        'react/jsx-uses-react': 2,
        // 防止在JSX中使用的变量被错误地标记为未使用
        'react/jsx-uses-vars': 2,
        // 防止在componentDidMount中使用setState
        'react/no-did-mount-set-state': 1,
        // 防止在componentDidUpdate中使用setState
        'react/no-did-update-set-state': 1,
        // 防止使用未知的DOM属性
        'react/no-unknown-property': 2,
        // 为React组件强制执行ES5或ES6类
        'react/prefer-es6-class': 2,
        // 防止在React组件定义中丢失props验证
        'react/prop-types': 0,
        // 使用JSX时防止丢失React
        'react/react-in-jsx-scope': 2,
        // 防止没有children的组件的额外结束标签
        'react/self-closing-comp': 1,
        // 禁止不必要的bool转换
        'no-extra-boolean-cast': 1,
        // 防止在数组中遍历中使用数组key做索引
        'react/no-array-index-key': 1,
        // 不使用弃用的方法
        'react/no-deprecated': 2,
        // 在JSX属性中强制或禁止等号周围的空格
        'react/jsx-equals-spacing': 2,
        'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx'] }],
        // 暂时允许使用react-dom的findDOMNode方法
        'react/no-find-dom-node': 0
    }

};
module.exports = ESLintConfig;