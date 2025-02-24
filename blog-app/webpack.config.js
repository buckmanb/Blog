// const Dotenv = require('dotenv-webpack');

// const webpack = require('webpack');
// const { merge } = require('webpack-merge');
// const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;
// const path = require('path');
const Dotenv = require('dotenv-webpack')
   
module.exports = {
  plugins: [
    new Dotenv()
  ]
}
   
// module.exports = (config) => {
//   return merge(config, {
//     plugins: [
//       new webpack.DefinePlugin({
//         'process.env': JSON.stringify({
//           SOME_ENV_VARIABLE: 'your_value_here'
//         })
//       })
//     ]
//   });
// };