import { defineConfig } from 'vite';
import angular from '@angular-devkit/build-angular/vite-plugin';

export default defineConfig({
  plugins: [angular()],
  optimizeDeps: {
    include: ['quill'],
  },
});
