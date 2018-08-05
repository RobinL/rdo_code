export default {
    input: 'index.js',
    output: {
      file: 'build/rdo_code.js',
      format: 'umd',
      globals: {"lodash": "_"},
      name : "open-data",
    },

    external: ['d3-format', 'lodash'],

  };