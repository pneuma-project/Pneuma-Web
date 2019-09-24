/** @format */

const webpack = require('webpack')
const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const createRewireDll = require('react-app-rewire-dll')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const rewireEslint = require('react-app-rewire-eslint')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function override(config, env) {
  const ENV = process.env.NODE_ENV
  const CUSTOM_ENV = process.env.REACT_APP_ENV // 自定义环境变量

  switch (ENV) {
    case 'production':
      // if (CUSTOM_ENV === 'preview') {
      config.output.publicPath = '' // 测试环境
      // } else {
      //   config.output.publicPath = '' // 生产环境
      // }

      /**
       * add auto dll plugin
       */
      const dllConfig = {
        inject: true, // will inject the DLL bundles to index.html
        debug: false,
        filename: '[name]_[hash].js',
        entry: {
          vendor: [
            'react',
            'react-dom',
            'react-redux',
            'react-router-dom',
            'axios',
            'antd'
          ]
        },
        path: './static/'
      }
      config = createRewireDll(dllConfig)(config, env)

      config.plugins.push(
        // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
          cacheDir: './buildCache/',
          uglifyJS: {
            compress: {
              // 删除所有的 `console` 语句，可以兼容ie浏览器
              warnings: false,
              comparisons: false,
              // 在UglifyJs删除没有用到的代码时不输出警告
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true
            },
            output: {
              comments: false,
              ascii_only: true
            },
            sourceMap: false
          }
        })
      )
      break

    default:
      config.output.publicPath = '/'
      break
  }

  /**
   * loader antd less style if neccessary
   */
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd', style: true }],
    config
  )

  // open eslint
  config = rewireEslint(config, env, (options) => {
    options.eslintPath = require.resolve('eslint')
  })

  // set antd primary color
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#0A4DAA'
    }
  })(config, env)

  // open react hot loader
  config = rewireReactHotLoader(config, env)

  // add decorators legacy
  config = injectBabelPlugin(['transform-decorators-legacy'], config)

  /**
   * add externals
   */
  config.externals = /^(jquery)$/i

  return config
}
