import { Context, Next } from 'koa'

import roleService from '../service/role.service'
import { ERROR_TYPES } from '../constant'
import { RoleParams } from '../types'
import Joi from 'joi'
import userService from '../service/user.service'

const verifyRole = async (ctx: Context, next: Next) => {
  // 1.获取值
  const roleParam = ctx.request.body as RoleParams

  // 2.验证必要参数
  const schema = Joi.object({
    role: Joi.string().required(),
    roleName: Joi.string().required(),
    isSuper: Joi.number().required(),
    remark: Joi.string().empty(''),
  })
  try {
    await schema.validateAsync(roleParam)
  } catch (error) {
    return ctx.app.emit('error', error, ctx)
  }

  // 3.先验证登录用户是否为管理员
  // verifyAuth   ctx.user = {"id": 1,"userName": "admin_test","iat": 1718075827, "exp": 1718162227 }
  const userinfo = await userService.getUserInfoById(ctx.user.id)
  if (userinfo instanceof Error) {
    return ctx.app.emit('error', userinfo, ctx)
  }
  // 非管理员isSuper无效  isSuper直接设为0
  if (userinfo.isSuper === 0) {
    roleParam.isSuper = 0
  }

  // 4.判断用户名不能重复
  const old_role = await roleService.getRoleByName(roleParam.role)
  // 错误处理
  if (old_role instanceof Error) {
    return ctx.app.emit('error', old_role, ctx)
  }
  if (old_role) {
    const error = new Error(ERROR_TYPES.ROLE_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 5. 传入 roleParam
  ctx.roleParam = roleParam

  await next()
}

export { verifyRole }
