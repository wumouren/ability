const fs = require('fs');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin'); //html模板生成器
const copyWebpackPlugin = require('copy-webpack-plugin'); // 文件拷贝

const dirPath = path.join(__dirname, 'src');
const outputPath = path.join(dirPath, '..', 'dist/');

const config = {
  entry: getEntry(dirPath, 'js'),
  output: {
    path: outputPath,
    filename: '[name]/index.js'
  }, 
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader' , 'less-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: dirPath,
    historyApiFallback: true,
    inline: true,
    compress: true,
    port: 9000
  },
  plugins: [
    new copyWebpackPlugin(copy('img')),
  ]
}
function getEntry(dirPath, ext) {
  const dirs = fs.readdirSync(dirPath);
  const entries = {};
  dirs.forEach(dir => entries[dir] = path.join(dirPath, dir, `index.${ext}`));
  return entries;
}
function copy(copyName){
  const copys = [];
  const dirs = fs.readdirSync(dirPath);
  dirs.forEach(dir => {
    const from = path.join(dirPath, dir);
    if(from.indexOf(copyName) > -1){
      copys.push({
        from:  path.join(from, copyName),
        to: path.join('./', dir, copyName)
      })
    }
  })
  return copys;
}
;(function htmlPage(config){
  const htmls = getEntry(dirPath, 'html');
  for(let dir in htmls){
    const pluginOption = {
      filename: `${dir}/index.html`,
      template: htmls[dir], 
      inject: false, //允许插件修改哪些内容，包括head与body
      hash: false, //是否添加hash值
      minify: { //压缩HTML文件
        removeComments: true,//移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }
    config.plugins.push(new htmlWebpackPlugin(pluginOption));
  }
})(config);

module.exports = config;