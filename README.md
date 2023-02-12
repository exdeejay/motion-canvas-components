# motion-canvas-components

A component library for [Motion Canvas](https://motion-canvas.github.io/). Feel free to fork and/or PR!

## Installation

```
git clone https://github.com/exdeejay/motion-canvas-components.git
cd motion-canvas-components
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
