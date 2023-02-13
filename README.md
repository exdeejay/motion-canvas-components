# motion-canvas-components

A component library including a Terminal and Polygons for [Motion Canvas](https://motion-canvas.github.io/) from [exdeejay](https://github.com/exdeejay). Feel free to fork and/or PR!

## Installation

```
git clone https://github.com/dct-LuLu/motion-canvas-components.git
cd motion-canvas-components
npm install
npm link
```

In your project, run:

```
npm link motion-canvas-components
```

Then, modify your project's `vite.config.ts` file:

```ts
export default defineConfig({
  plugins: [motionCanvas()],
  resolve: {
    alias: {
      '@motion-canvas/core': path.resolve('./node_modules/@motion-canvas/core'),
      '@motion-canvas/2d': path.resolve('./node_modules/@motion-canvas/2d'),
    }
  }
});
```
Don't forget that you may need to import the path module:

```ts
import * as path from 'path';
```

You may need to run the following command in order to use 'path':

```ts
npm install --save-dev @types/node
```
