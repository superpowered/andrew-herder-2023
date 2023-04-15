import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// -----------------------------------------------------------------------------

export default {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  entry: './src/client/index',
  output: {
    path: path.resolve(dirname, '../../dist/client'),
    filename: 'client.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/public/index.html',
      favicon: 'src/client/public/cropped-favi-192x192.jpg',
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ico|svg|jpg|png)$/,
        exclude: /node_modules/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
};
