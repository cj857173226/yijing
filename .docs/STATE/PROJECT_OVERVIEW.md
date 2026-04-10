# 项目概览：易经 (yijing)

## 技术栈
- **前端框架**: Vue 3.5.13 (Composition API)
- **编程语言**: TypeScript 5.7
- **构建工具**: Vite 6.1
- **样式处理**: SCSS (sass-embedded) + Vanilla CSS
- **运行环境**: Node v24.13.0, NPM v11.6.2

## 开发环境配置
- **路径别名**: `@` -> `src/`
- **全局 SCSS**: 已自动注入 `@/styles/variables.scss` 变量到所有 Vue 组件。
- **Linting**: 继承自 `@vue/tsconfig/tsconfig.dom.json`。

## 核心数据
- **64卦数据**: `src/data/hexagrams.ts` (包含名称、拼音、卦象、爻位)。

## 基础设计系统
- **主色调**: `#6366f1` (Indigo)
- **背景**: `#020617` (Deep Dark)
- **样式目录**: `src/styles/`
