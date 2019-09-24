# 后台管理系统

## 项目介绍
- 项目由 `create-react-app` 创建。参考文档见 `create-react-app.md`
- 修改了默认的配置，添加了 `.babelrc` 与 `eslintrc`
- eslint 采用 `eslint-config-umi`

## 项目开发

```bash
# 安装依赖
cnpm i

# 本地开发
npm run start

# 项目构建
npm run build
```

## 参考链接

- [react](https://facebook.github.io/react/docs/react-api.html)
- [redux](cn.redux.js.org/index.html)
- [react-router](https://reacttraining.com/react-router/web/example/basic)

## 注意

ant.design 的中的 Sider 组件会引起 Layout 组件的多次渲染，相关 issues [参考链接](https://github.com/ant-design/ant-design/issues/8347),为避免
**route** 的在初次加载时的多次渲染，把组件作为 route 的 component，而不要使用 route 的 render 函数。


## TODO
- webpack-dev-server hot update


后台管理系统地址：http://pneuma-admin.com/pneuma-manager/ index.html

api请求地址：http://pneuma-admin.com/pneuma-api/               
 管理后台请求地址：http://pneuma-admin.com/pneuma-manager/     
