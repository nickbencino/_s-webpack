const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
// Test if in production
const isProduction = process.argv[2] === '--mode=production';

// Config needs to be a variable so we can use .push() on it
const config = {
  context: __dirname,
  entry: {
    frontend: ['./src/index.js', './src/sass/style.scss']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: false
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        test: /\.jsx$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../../style.css'
    }),
    new BrowserSyncPlugin({
      files: '**/*.php',
      injectChanges: true,
      proxy: 'http://localhost:8000/'
    })
  ]
};

/* eslint-disable */ 
// Checks if in production or development mode
if (isProduction) {
  // Image minification and copying only on build
  config.plugins.push(
    new CopyPlugin(
      { patterns: [
        { from: path.resolve(__dirname, 'src/imgs'), to: '../../public/imgs/' }] 
      }
    ), 
    new ImageminPlugin(
      { 
        test: /\.(jpe?g|png|gif|svg)$/i 
      }
    )
  );
} else {
  // Stuff to do in dev
}

module.exports = config;