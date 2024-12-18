// vue.config.js

module.exports = {
  // 配置开发服务器
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // 后端服务器地址，请确保这个地址正确
        changeOrigin: true,  // 修改请求头中的 Origin 字段，以避免跨域问题
        /*pathRewrite: {
          //'^/api': '',  // 代理路径，去掉 /api 前缀，后端 API 可能不需要它
        },*/
        logLevel: 'debug', // 添加日志，调试代理过程
      },
    },
    port: 8080,  // 前端开发服务器端口
  },
  transpileDependencies: true,  // 根据需要转译依赖
};
