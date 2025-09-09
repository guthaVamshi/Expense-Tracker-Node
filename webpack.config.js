const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    clean: true
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: '14'
                }
              }]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false // Keep readable for debugging
  },
  plugins: []
};

