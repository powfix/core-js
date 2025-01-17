module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          '@constants': './src/constants',
          '@interfaces': './src/interfaces',
          '@scripts': './src/scripts',
          '@services': './src/services',
          '@utils': './src/utils',
        },
      },
    ],
  ],
  overrides: [
    {
      test: fileName => !fileName.includes('node_modules'),
      plugins: [
        [require('@babel/plugin-proposal-class-properties'), { loose: true }],
        [require('@babel/plugin-proposal-private-methods'), { loose: true }],
      ],
    },
  ],
};
