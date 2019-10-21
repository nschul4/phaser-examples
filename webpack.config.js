var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

// const nameOfTheGame = 'clickshapes';
// const nameOfTheGame = 'gridrunner';
const nameOfTheGame = 'hauler'; 
// const nameOfTheGame = 'lander';
// const nameOfTheGame = 'logger';
// const nameOfTheGame = 'orbiter';
// const nameOfTheGame = 'pointerevents';
// const nameOfTheGame = 'polygondrop';
// const nameOfTheGame = 'rocketcar';
// const nameOfTheGame = 'rocketenginetest';
// const nameOfTheGame = 'scaler';
// const nameOfTheGame = 'soundpad';
// const nameOfTheGame = 'spaceship';
// const nameOfTheGame = 'spriterunner';
// const nameOfTheGame = 'vortex';
// const nameOfTheGame = 'vortex2';

const distdir = nameOfTheGame + '_dist';

module.exports = {
  entry: './src/games/' + nameOfTheGame + '/game.ts',
  output: {
    path: path.resolve(__dirname, distdir),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './' + distdir + "/"),
    publicPath: '/',
    host: '192.168.1.102',
    port: 8080,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  },
  context: path.join(__dirname, './'),
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
    new CopyWebpackPlugin([
      {
        from: './index.html',
        to: './index.html'
      },
      {
        from: './src/games/' + nameOfTheGame + '/assets/',
        to: './src/games/' + nameOfTheGame + '/assets/'
      }
    ]),
  ]
};
