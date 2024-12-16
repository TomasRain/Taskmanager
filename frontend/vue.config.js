// vue.config.js

module.exports = {
  // 配置开发服务器
  devServer: {
    proxy: {
      // 将所有以 /api 开头的请求代理到后端服务器
      '/api': {
        target: 'http://localhost:8000', // 后端服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api', // 保持路径不变
        },
      },
    },
    port: 8080, // 前端开发服务器端口
  },
  transpileDependencies: true, // 根据需要转译依赖
};
