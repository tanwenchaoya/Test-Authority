import network from './network'
export const login = (data) => network.post('login', data)
export const logout = (data) => network.post('logout', data)
//获取全部菜单
export const getMenuList = () => network.post('permission/queryAllPermission')
//获取用户的菜单
export const getUserMenuList = (data) => network.post('permission/getSomeonePermission',data)
//获取所有的用户
export const getUserList = (data)=>network.get('user/queryUser',data)
//获取要修改的当前用户
export const getCurUser = (data)=>network.post('user/getCurUser',data)
export const alterCurUser = (data)=>network.post('user/alterCurUser',data)
export const addUser = (data)=>network.post('user/addUser',data)
export const deleteUser = (data)=>network.post('user/deleteUser',data)
export const queryOrganizesForUser = (data)=>network.post('user/queryOrganizesForUser',data)
//获取指定用户的权限
export const getPermissionsFromUser = (data)=>network.post('user/getPermissionsFromUser',data)
//给用户添加权限
export const setPermissionsOfUser = (data)=>network.post('user/setPermissionsOfUser',data)
//角色相关
export const addRole = (data)=>network.post('role/addRole',data)
export const getRoleList = (data)=>network.post('role/queryRole',data)
export const deleteRole= (data)=>network.post('role/deleteRole',data)
export const alterCurRole = (data)=>network.post('role/alterCurRole',data)
export const getCurRole = (data)=>network.get('role/getCurRole',data)
export const removeUserFromRole = (data)=>network.get('role/removeUserFromRole',data)
//查询指定角色的权限
export const getPermissionsFromRole = (data)=>network.post('role/getPermissionsFromRole',data)
//给角色添加权限
export const setPermissionsOfRole = (data)=>network.post('role/setPermissionsOfRole',data)
//部门相关
export const getOrganizeList = (data)=>network.post('organize/queryOrganize',data)
//添加分部
export const addFatherOrganize = (data)=>network.post('organize/addFatherOrganize',data)
//添加部门
export const addSonOrganize = (data)=>network.post('organize/addSonOrganize',data)
//删除分部
export const deleteFatherOrganize = (data)=>network.post('organize/deleteFatherOrganize',data)
//删除部门
export const deleteSonOrganize = (data)=>network.post('organize/deleteSonOrganize',data)
//删除用户
export const removeUserFromOrganize = (data)=>network.post('organize/removeUserFromOrganize',data)
//获取指定用户的权限
export const getPermissionsFromOrganize = (data)=>network.post('organize/getPermissionsFromOrganize',data)
//给用户添加权限
export const setPermissionsOfOrganize = (data)=>network.post('organize/setPermissionsOfOrganize',data)

//菜单相关
export const addMenu = (data) => network.get('permission/addPermission',data)
export const deletePermission = (data)=>network.post('permission/deletePermission',data)

//日志
export const getLoginLogList = (data)=>network.post('log/queryLoginLog',data)
export const getOperationLogList = (data)=>network.post('log/queryOperationLog',data)