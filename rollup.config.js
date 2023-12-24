const { nodeResolve } = require('@rollup/plugin-node-resolve')

module.exports = {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'es' }
  ],
  plugins: [nodeResolve()]
}
