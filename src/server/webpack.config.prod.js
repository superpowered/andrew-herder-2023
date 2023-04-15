import path from 'path';
import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
process.env.NODE_ENV = 'production';

// -----------------------------------------------------------------------------

export default {
  mode: 'production',
  target: 'node',
  entry: {
    server: path.resolve(dirname, 'index.js'),
  },
  output: {
    path: path.resolve(dirname, '../../dist'),
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
