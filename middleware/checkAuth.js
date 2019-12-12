const { ROLES } = require('../constant/index')

/**
 * 允许的角色
 * @param roles {Object} {roleName: Boolean}
 */
function checkAuth (roles) {
  return async function checkAuthMiddleware (ctx, next) {
    if (!roles) {
      await next()
      return
    }

    // todo: 完成 user
    ctx.session = {
      user: {
        role: ROLES.user // admin
      }
    }

    if (!ctx.session.user) {
      ctx.res.unauthorized({
        message: 'Please login'
      })

      return
    }

    const user = ctx.session.user

    if (roles.some(role => role === user.role)) {
      await next()
      return
    }

    ctx.res.forbidden({
      message: 'No auth'
    })
  }
}

module.exports = checkAuth
