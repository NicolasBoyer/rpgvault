//import terser from '@rollup/plugin-terser'
//import babel from '@rollup/plugin-babel'


import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
//import dts from 'rollup-plugin-dts'

//export default {
//    input: 'src/front/javascript/app.js',
//    output: {
//        file: 'src/front/dist/app.min.js',
//        plugins: [terser()],
//        format: 'es'
//    },
//    plugins: [babel({
//        babelHelpers: 'bundled'
//    })]
//}

const config = [
    {
        input: 'src/front/javascript/app.ts',
        output: [
            {
                file: 'src/front/dist/app.js',
                format: 'es',
                sourcemap: true,
            }
        ],
        plugins: [
            resolve(),
            typescript({
                tsconfig: './tsconfig.json'
            })
        ]
    }
    //{
    //    input: "src/index.ts",
    //    output: [{ file: "lib/index.d.ts", format: "es" }],
    //    plugins: [dts()]
    //}
]
export default config
