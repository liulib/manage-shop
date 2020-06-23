/**
 * api接口的统一出口
 */
import users from './users'
import operations from './operations'
import rights from './rights'
import goods from './goods'
import orders from './orders'

// 其他模块的接口……

// 导出接口
export default {
  users,
  operations,
  rights,
  goods,
  orders

  // ……
}
