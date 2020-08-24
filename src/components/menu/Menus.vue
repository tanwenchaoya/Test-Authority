<template>
    <div>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-button type="primary" @click="dialogVisible=true">添加菜单</el-button>
                </el-col>
            </el-row>
            <!-- 用户信息填充表单-->
            <el-table :data="menuList" stripe style="width: 100%" row-key="permissionId" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}" >
                <el-table-column prop="permissionNote" label="菜单名称"></el-table-column>
                <el-table-column prop="permissionNote" label="菜单描述"></el-table-column>
                <el-table-column label="操作" style="width: 170px">
                    <template slot-scope="scope">
                        <el-button  icon="el-icon-edit" size="mini" @click="editRole(scope.row.permissionId)" v-show="scope.row.children!==null">添加</el-button>
                        <el-button  icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.permissionId)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--添加菜单界面-->
        <el-dialog
                title="添加角色"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form class="form" :model = 'addPermissionForm'  ref="roleFormRef">
                <el-form-item prop="roleName">
                    <el-input prefix-icon="iconfont icon-nickname" v-model="addPermissionForm.permissionName" placeholder="菜单名"></el-input>
                </el-form-item>
                <el-form-item prop="roleNote">
                    <el-input prefix-icon="el-icon-edit" v-model="addPermissionForm.permissionNote" placeholder="菜单描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="checkAddForm" style="width: 100%">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改菜单信息界面-->
        <el-dialog
                title="修改用户"
                :visible.sync="showEditVisible"
                width="50%"
        >
            <el-form :model="editForm"  ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="菜单名称" prop="permissionName">
                    <el-input v-model="editForm.permissionName"></el-input>
                </el-form-item>
                <el-form-item label="菜单描述" prop="permissionNote">
                    <el-input v-model="editForm.permissionNote"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="updateUserInfo" style="width: 100%">修改信息</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {addRole, getRoleList, deleteRole, alterCurRole, getCurRole,removeUserFromRole,getMenuList,addMenu,deletePermission} from '../../api/index'

    export default {
        name: "Menus",
        data() {
            return {
                //查询相关的信息
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                dialogVisible: false,
                showEditVisible:false,
                //添加角色信息
                addPermissionForm:{
                    permissionParentId:0,
                    permissionName:'',
                    permissionNote:''
                },
                editForm:{
                    permissionParentId:null,
                    permissionName:'',
                    permissionNote:''
                },
                roleData: [],
                menuList:[]
            }
        },
        async created() {
            await this.getRoles();
        },
        methods: {
            async getRoles() {
                const data = await getMenuList()
                if (data.status !== 200) return this.$message.error(data.meta.msg)
                this.menuList=data.data[0];
                console.log(this.menuList);
                /*let obj = data.data[0];

                console.log(data);
                obj.forEach((item)=>{
                    this.handleMenuList(item);
                })*/
             /*   this.menuList=obj;
                console.log(this.menuList);*/
            },
           /*async handleMenuList(obj){
                if (obj.children .length!==0){
                    obj.children = obj.children[0]
                }else {
                    return
                }
                obj.children.forEach(item=>{
                    this.handleMenuList(item);
                })
            },*/
            async checkAddForm(){
                let res = await addMenu(this.addPermissionForm);
                if (res.status !== 200) {
                    this.dialogVisible = false
                    return this.$message.error("添加菜单信息失败");
                }
                this.dialogVisible = false
                await this.getRoles();
                return this.$message.success("添加菜单信息成功");
            },
            async editRole(permissionParentId){
                this.showEditVisible = true;
                //通过id获取用户信息
                this.editForm.permissionParentId=permissionParentId;
            },
            async updateUserInfo(){
                //更新用户信息
                let res = await addMenu(this.editForm);
                if (res.status !== 200) {
                    return this.$message.error("添加菜单信息失败");
                }
                this.showEditVisible = false;
                this.$message.success('添加菜单信息成功');
                await this.getRoles();
            },
            deleteRole(permissionId){
                this.$confirm('此操作将移除此菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    let res = await deletePermission({permissionId});
                    if (res.status !== 200) {
                        return this.$message.error("删除菜单信息失败");
                    }
                    await this.getRoles();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async removeUser(role,userId){
                this.$confirm('此操作将移除此菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    let res = await removeUserFromRole({userId});
                    if (res.status !== 200) {
                        return this.$message.error("删除菜单信息失败");
                    }
                    // this.roleData = this.roleData===res?'':this.roleData;
                    await this.getRoles();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-dialog__body{
        .el-form{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .el-form-item{
                width: 60%;
            }
        }
    }
    .el-tag{
        margin: 5px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .el-row-1{
        display: flex;
        align-items: center;
    }
    .item-user{
        margin-right: 30px;
    }
    .operate{
        display: flex;
        justify-content: center;
    }
</style>