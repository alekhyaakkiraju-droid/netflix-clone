import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

// CRA-legacy components use JSX inside .js files; run esbuild ahead of
// vite:build-import-analysis so it never sees raw JSX syntax.
const treatJsAsJsx = {
  name: 'treat-js-files-as-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('node_modules')) return null;
    if (!id.match(/src\/.*\.js$/)) return null;
    return transformWithEsbuild(code, id, { loader: 'jsx', include: /.*/ });
  },
};

export default defineConfig({
  plugins: [treatJsAsJsx, react()],
  optimizeDeps: {
    // Needed for dep pre-bundling in dev mode
    force: true,
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'server', 'tests/e2e', 'dist'],
  },
});
