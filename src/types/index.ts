export interface LoginParams {
  username: string
  password: string
  expires7d: boolean
}

export interface UserParams {
  username: string
  password: string
  roleId: number
  name: string
  email: string
  phone: string
  remark: string
}

export interface UpdateUserParams {
  id: number
  username: string
  roleId: number
  name: string
  email: string
  phone: string
  remark: string
}

export interface pageParams {
  pageNo: number
  pageSize: number
}

export interface MenuBase {
  id: number
  name: string
  path: string
  component: string
  parentId: number
  sort: number
  meta: {
    icon: string
    title: string
    isLink: string
    isHide: number
    isFull: number
    isAffix: number
    isKeepAlive: number
  }
  createdAt: string
  updatedAt: string
}

export interface Menu extends MenuBase {
  children?: Menu[]
}
