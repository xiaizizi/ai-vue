# AI-Vue 项目说明

## 项目介绍

这是一个基于 Vue 3 和 Vite 的AI对话项目，提供了友好的用户界面和智能对话功能。

[在线体验](https://ai.xiaizizi.cn/)

## 开发环境

### 推荐的IDE配置

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 请禁用Vetur插件以避免冲突

### TypeScript支持

由于TypeScript默认不能处理`.vue`文件的类型信息，我们使用`vue-tsc`代替`tsc`命令来进行类型检查。在编辑器中，需要安装[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)插件来支持`.vue`文件的类型识别。

## 项目配置

如需自定义配置，请参考[Vite配置文档](https://vite.dev/config/)。

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

## 测试

### 单元测试

使用[Vitest](https://vitest.dev/)进行单元测试：

```bash
npm run test:unit
```

### 端到端测试

使用[Cypress](https://www.cypress.io/)进行端到端测试：

开发环境测试：
```bash
npm run test:e2e:dev
```

生产环境测试：
```bash
npm run build
npm run test:e2e
```

### 代码检查

使用[ESLint](https://eslint.org/)进行代码检查：

```bash
npm run lint
```

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vitest
- Cypress
- ESLint

## 项目特点

- 现代化的Vue 3开发体验
- 完整的TypeScript支持
- 快速的开发环境配置
- 完善的测试工具链
- 规范的代码风格检查
