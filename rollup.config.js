export default {
    input: 'index.js',
    output: {
      file: 'build/open-data-munge.js',
      format: 'umd',
      globals: {"lodash": "_"},
      name : "open-data",
    },

    external: ['d3-format', 'lodash'],

  };