/* eslint-disable no-undef */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: '/src/client/index.ts',
  resolve: {
    extensions: ['.ts', '.js' ],
    symlinks: false,
  },
  optimization: {
    runtimeChunk: true,
  },
  output: {
    filename: 'js/[name]-[contenthash].js',
    path: path.resolve(__dirname, './dist')
  },
  devtool: "eval-cheap-source-map",
  devServer: {
    open: true,
    contentBase: './dist',
    // port: 5001,
    port: 9999,
    compress: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png|svg|gif|jpeg)$/,
        use: 'file-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ["@babel/preset-env", { useBuiltIns: 'usage', corejs: "2.0.0" }]
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties"
          ]
        }
      },
    ]
  },
  
  plugins: [
    //DefinePlugin allows you to create global constants which can be configured at compile time.
    //I need it to provide the public path to HtmlWebpackPlugin!
    new webpack.DefinePlugin({
      // PRODUCTION: JSON.stringify(true),
      // VERSION: JSON.stringify('5fa3b9'),
      // BROWSER_SUPPORTS_HTML5: true,
      // TWO: '1+1',
      // 'typeof window': JSON.stringify('object'),
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__webpack_base_uri__': 'htmlWebpackPluginPublicPath',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: __dirname + "/templates/template.html",
        title: "nowa aplikacja", //not injecting variables into template yet 
        minify: {
        // collapseWhitespace: true
        collapseWhitespace: false,
      },
    }),
  ],  
 };
