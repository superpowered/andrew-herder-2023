import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------

export default {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  entry: './src/client/index',
  output: {
    path: path.resolve(__dirname, '../../dist/client'),
    filename: 'client.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/public/index.html',
      favicon: 'src/client/public/cropped-favi-192x192.jpg',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        resolve: {
          fullySpecified: false,
        }
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
