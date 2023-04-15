import path from 'path';
import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.NODE_ENV = 'production';

// -----------------------------------------------------------------------------

export default {
  mode: 'production',
  target: 'node',
  entry: {
    server: path.resolve(__dirname, 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].cjs',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
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
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  externals: {
    express: 'express',
  },
};
