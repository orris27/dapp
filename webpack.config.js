const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    // new CopyWebpackPlugin([
    //   { from: './app/index.html', to: 'admin.html' }
    // ]),
    new CopyWebpackPlugin([
      { from: './app/student.html', to: 'student.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/admin.html', to: 'index.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/admin_login.html', to: 'admin_login.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/admin_login.html', to: 'admin.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/student_login.html', to: 'student_login.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/student_signup.html', to: 'student_signup.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/cook_signup.html', to: 'cook_signup.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/cook_login.html', to: 'cook_login.html' }
    ]),
    new CopyWebpackPlugin([
      { from: './app/cook.html', to: 'cook.html' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
