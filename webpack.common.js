'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const routeDataMapper = require('webpack-route-data-mapper');
const readConfig = require('read-config');
const path = require('path');

// base config
const constants = readConfig('./constants.yml');

const {
  SRC,
  DEST,
  BASE_DIR,
  PUBLIC_PATH
} = constants;

// page/**/*.pug -> dist/**/*.html
const htmlTemplates = routeDataMapper({
  baseDir: `${SRC}/pug/page`,
  src: '**/[!_]*.pug',
  locals: Object.assign({},
    constants, {
      meta: readConfig(`${SRC}/pug/meta.yml`)
    }
  )
})

module.exports = {
  // エントリーファイル
  entry: {
    'js/script.js': `${SRC}/ts/script.ts`,
    'css/style.css': `${SRC}/scss/style.scss`,
  },
  // 出力するディレクトリ・ファイル名などの設定
  output: {
    path: path.resolve(__dirname, DEST + BASE_DIR),
    filename: '[name]',
    publicPath: PUBLIC_PATH,
  },
  module: {
    // 各ファイル形式ごとのビルド設定
    rules: [{
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /(node_modules)/
      },
      {
        test: /\.pug$/,
        use: [{
          loader: 'pug-loader',
          options: {
            root: path.resolve(`${SRC}/pug/`),
            pretty: true,
          }
        }],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [`${SRC}/scss`],
                },
              },
            }
          ]
        })
      }
    ]
  },
  // キャシュ有効化
  cache: true,
  // 拡張子省略時のpath解決
  resolve: {
    extensions: ['.js', '.json', '.ts', '*'],
    alias: {
      '~': path.join(__dirname, SRC, 'ts'),
    }
  },

  plugins: [
    // 複数のHTMLファイルを出力する
    ...htmlTemplates,
    // style.cssを出力
    new ExtractTextPlugin('[name]')
  ],
}