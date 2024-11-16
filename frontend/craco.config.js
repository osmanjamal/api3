const path = require('path');
const webpack = require('webpack');

module.exports = {
 webpack: {
   alias: {
     '@': path.resolve(__dirname, 'src'),
     '@components': path.resolve(__dirname, 'src/components'),
     '@pages': path.resolve(__dirname, 'src/pages'),
     '@services': path.resolve(__dirname, 'src/services'),
     '@utils': path.resolve(__dirname, 'src/utils'),
     '@hooks': path.resolve(__dirname, 'src/hooks'), 
     '@types': path.resolve(__dirname, 'src/types'),
     '@layouts': path.resolve(__dirname, 'src/layouts'),
     '@assets': path.resolve(__dirname, 'src/assets'),
     '@config': path.resolve(__dirname, 'src/config'),
     '@lib': path.resolve(__dirname, 'src/lib'),
     '@store': path.resolve(__dirname, 'src/store'),
     '@contexts': path.resolve(__dirname, 'src/contexts'),
     '@api': path.resolve(__dirname, 'src/api'),
     '@ui': path.resolve(__dirname, 'src/components/ui'),
     '@features': path.resolve(__dirname, 'src/features'),
     '@constants': path.resolve(__dirname, 'src/constants'),
     '@theme': path.resolve(__dirname, 'src/theme'),
     '@styles': path.resolve(__dirname, 'src/styles')
   },
   configure: (webpackConfig) => {
     // Add buffer fallback
     webpackConfig.resolve.fallback = {
       ...webpackConfig.resolve.fallback,
       buffer: require.resolve('buffer/'),
       stream: require.resolve('stream-browserify'),
       util: require.resolve('util/'),
       crypto: require.resolve('crypto-browserify'),
       path: require.resolve('path-browserify'),
       fs: false,
       os: require.resolve('os-browserify/browser'),
       http: require.resolve('stream-http'),
       https: require.resolve('https-browserify'),
       zlib: require.resolve('browserify-zlib'),
       assert: require.resolve('assert/'),
       url: require.resolve('url/'),
     };

     // Add plugins
     webpackConfig.plugins = [
       ...webpackConfig.plugins,
       new webpack.ProvidePlugin({
         Buffer: ['buffer', 'Buffer'],
         process: 'process/browser'
       }),
       new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
       })
     ];

     // Resolve ajv and other issues
     webpackConfig.resolve.alias = {
       ...webpackConfig.resolve.alias,
       'ajv$': path.resolve(__dirname, 'node_modules/ajv'),
       'react-dom$': '@hot-loader/react-dom'
     };

     // Add module rules for different file types
     webpackConfig.module.rules.push(
       {
         test: /\.(ts|tsx)$/,
         include: path.resolve(__dirname, 'src'),
         use: [
           {
             loader: 'babel-loader',
             options: {
               cacheDirectory: true,
               plugins: ['react-hot-loader/babel'],
             },
           },
         ],
       },
       {
         test: /\.svg$/,
         use: ['@svgr/webpack'],
       }
     );

     return webpackConfig;
   },
   plugins: {
     add: [
       new webpack.ProvidePlugin({
         process: 'process/browser'
       }),
       new webpack.HotModuleReplacementPlugin()
     ]
   }
 },
 style: {
   postcss: {
     plugins: [
       require('tailwindcss'),
       require('autoprefixer'),
       require('postcss-flexbugs-fixes'),
       require('postcss-preset-env')({
         autoprefixer: {
           flexbox: 'no-2009'
         },
         stage: 3
       })
     ]
   }
 },
 babel: {
   presets: [
     ['@babel/preset-env', { 
       targets: { 
         node: 'current' 
       } 
     }],
     '@babel/preset-react',
     '@babel/preset-typescript'
   ],
   plugins: [
     ['@babel/plugin-proposal-class-properties', { loose: true }],
     ['@babel/plugin-proposal-private-methods', { loose: true }],
     ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
     '@babel/plugin-transform-runtime',
     'react-hot-loader/babel'
   ],
   loaderOptions: {
     exclude: /node_modules/
   }
 },
 jest: {
   configure: {
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1',
       '^@components/(.*)$': '<rootDir>/src/components/$1',
       '^@pages/(.*)$': '<rootDir>/src/pages/$1',
       // ... الخ لكل alias
     }
   }
 }
};