module.exports = {
    "root": true,
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 6,
        "sourceType": 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    "extends": [
        "eslint:recommended",
        'plugin:vue/essential',
    ],
    // required to lint *.vue files
    "plugins": [

    ],
    // add your custom rules here
    "rules": {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 4 space indentation
        'indent': ['error', 4],
        // Allow extra semicolons
        'semi': 0
    }
};
