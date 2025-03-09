# ai-vue 项目说明

# ai-vue

[在线连接](https://ai.xiaizizi.cn/) // 项目的在线访问链接
This template should help get you started developing with Vue 3 in Vite. // 此模板用于帮助你开始在Vite中使用Vue 3进行开发

## Recommended IDE Setup // 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur). // 推荐使用VSCode并安装Volar扩展，同时禁用Vetur

## Type Support for `.vue` Imports in TS // 对TypeScript中`.vue`导入的类型支持

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types. // TypeScript默认无法处理`.vue`导入的类型信息，因此我们使用`vue-tsc`替换`tsc`进行类型检查。在编辑器中，我们需要Volar来让TypeScript语言服务识别`.vue`类型

## Customize configuration // 自定义配置

See [Vite Configuration Reference](https://vite.dev/config/). // 查看Vite配置参考文档

## Project Setup // 项目设置

```sh
npm install // 安装项目依赖
```

### Compile and Hot-Reload for Development // 开发环境下的编译和热重载

```sh
npm run dev // 启动开发服务器
```

### Type-Check, Compile and Minify for Production // 生产环境下的类型检查、编译和压缩

```sh
npm run build // 构建生产版本
```

### Run Unit Tests with [Vitest](https://vitest.dev/) // 使用Vitest运行单元测试

```sh
npm run test:unit // 运行单元测试
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/) // 使用Cypress运行端到端测试

```sh
npm run test:e2e:dev // 在开发服务器上运行端到端测试
```

This runs the end-to-end tests against the Vite development server. // 这将在Vite开发服务器上运行端到端测试
It is much faster than the production build. // 这比生产版本的构建要快得多

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments): // 但在部署之前（例如在CI环境中），仍然建议使用`test:e2e`测试生产版本

```sh
npm run build // 构建生产版本
npm run test:e2e // 运行生产版本的端到端测试
```

### Lint with [ESLint](https://eslint.org/) // 使用ESLint进行代码检查

```sh
npm run lint // 运行代码检查
```
