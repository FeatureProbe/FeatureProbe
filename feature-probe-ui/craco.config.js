const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  plugins: [
    { plugin: require('@semantic-ui-react/craco-less') },
  ],
  webpack: {
    configure: {
      output: { filename: 'static/js/[name].[chunkhash:8].chunk.js' },
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            common: {
              name: 'common',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            echarts: {
              name: 'chart',
              test: /[\\/]node_modules[\\/](chart.js|chartjs-plugin-annotation|react-chartjs-2)[\\/]/,
              priority: 20,
            },
            highlight: {
              name: 'highlight',
              test: /[\\/]node_modules[\\/](highlight.js)[\\/]/,
              priority: 20,
            },
            codemirror: {
              name: 'codemirror',
              test: /[\\/]node_modules[\\/](codemirror)[\\/]/,
              priority: 20,
            },
            dnd: {
              name: 'dnd',
              test: /[\\/]node_modules[\\/](react-beautiful-dnd)[\\/]/,
              priority: 20,
            },
          }
        },
      },
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ],
    },
    plugins: [
      new FilterWarningsPlugin({
        exclude: /Conflicting order./,
      }),
    ],
  }
};
