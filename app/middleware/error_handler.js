"use strict";

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const message = status === 500 && ctx.app.config.env === "prod"
        ? "Internal Server Error"
        : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.status = status;
      const body = {
        status: "fail",
        message
      };
      ctx.body = body;
      if (status === 422) {
        ctx.body.status = "fail";
        ctx.body.data = err.errors;
      }
      if (status === 500) {
        // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
        ctx.app.emit('error', err, this);
        ctx.app.emit("error", err, this);
        ctx.body.status = "error";
        // ctx.body.data = err.errors;
      }
    }
  };
};
