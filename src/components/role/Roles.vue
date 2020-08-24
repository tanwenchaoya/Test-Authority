<template>
    <div>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-button type="primary" @click="dialogVisible=true" v-show="userCheckAuth.includes('增加_角色')">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 用户信息填充表单-->
            <el-table :data="roleData" stripe style="width: 100%" border v-show="userCheckAuth.includes('查询_角色( 全部查询)')">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i===0?'bdtop':'']" v-for="(item1,i) in scope.row.children[0]" :key="item1.organizeId" class="el-row-1">
                            <el-col :span="5">
                                <el-tag>{{item1.organizeName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2===0?'':'bdtop']" v-for="(item2,i2) in item1.children[0]" :key="item2.organizeId" class="el-row-1">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.organizeName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children[0]" :key="item3.userId" type="warning" :closable="userCheckAuth.includes('删除指定用户的角色')" @close="removeUser(scope.row,item3.userId)" :class="['item-user']">{{item3.userName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column prop="roleNote" label="角色描述"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="medium" @click="editRole(scope.row.roleId)" v-show="userCheckAuth.includes('修改角色')">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteRole(scope.row.roleId)" v-show="userCheckAuth.includes('删除_角色')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页显示-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="queryInfo.pagesize"
                    layout="total,sizes,prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--添加角色界面-->
        <el-dialog
                title="添加角色"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form class="form" :model = 'addRoleForm'  ref="roleFormRef">
                <el-form-item prop="roleName">
                    <el-input prefix-icon="iconfont icon-nickname" v-model="addRoleForm.roleName" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item prop="roleNote">
                    <el-input prefix-icon="el-icon-edit" v-model="addRoleForm.roleNote" placeholder="角色描述"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="success" @click="checkAddForm" style="width: 100%">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改用户界面-->
        <el-dialog
                title="修改用户"
                :visible.sync="showEditVisible"
                width="50%"
        >
            <el-form :model="editForm"  ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色" prop="userName">
                    <el-input v-model="editForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleNote">
                    <el-input v-model="editForm.roleNote"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="updateUserInfo" style="width: 100%">修改信息</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {addRole, getRoleList, deleteRole, alterCurRole,
        getCurRole,removeUserFromRole,getPermissionsFromUser
    } from '../../api/index'

    export default {
        name: "Roles",
        data() {
            return {
                //查询相关的信息
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                //总条数
                total: 0,
                dialogVisible: false,
                showEditVisible:false,
                //添加角色信息
                addRoleForm:{
                    roleName:'',
                    roleNote:''
                },
                editForm:{
                    roleName:'',
                    roleNote:'',
                    roleId:''
                },
                roleData: [],
                //赋给角色的权限
                userCheckAuth:[]
            }
        },
        created() {
            this.getRoles();
        },
        methods: {
            async getRoles() {
                let res = await getRoleList(this.queryInfo);
                if (res.status !== 200) {
                    return this.$message.error("获取角色信息失败");
                }
                this.total = res.data[1].total;
                this.roleData = res.data[0];
                let userAuth = await getPermissionsFromUser({userId:window.sessionStorage.getItem('userId')});
                userAuth.data[0].forEach(item=>{
                    this.getCheckKeys(item,this.userCheckAuth);
                })
                console.log(this.userCheckAuth);
            },
            //递归获取用户的权限
            getCheckKeys(node,arr){
                if ((node.flag===1) && (node.children === null)){
                    return arr.push(node.permissionNote)
                }
                if(node.children!== null){
                    [].slice.call(node.children).forEach(item=>{
                        this.getCheckKeys(item,arr)
                    })
                }
            },
            async handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                await this.getRoles();
            },
            //页码值发生变化
            async handleCurrentChange(newPage) {
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                await this.getRoles();
            },
            async checkAddForm(){
                let res = await addRole(this.addRoleForm);
                if (res.status !== 200) {
                    this.dialogVisible = false
                    return this.$message.error("添加角色信息失败");
                }
                this.dialogVisible = false
                await this.getRoles();
                return this.$message.success("添加角色信息成功");
            },
            async editRole(roleId){
                this.showEditVisible = true;
                //通过id获取用户信息
                let res = await getCurRole({roleId});
                if (res.status !== 200) {
                    return this.$message.error("获取角色信息失败");
                }
                this.editForm = res.data[0];
            },
            async updateUserInfo(){
                //更新用户信息
                let res = await alterCurRole(this.editForm);
                if (res.status !== 200) {
                    return this.$message.error("更新角色信息失败");
                }
                this.showEditVisible = false;
                this.$message.success('修改信息成功');
                await this.getRoles();
            },
            deleteRole(roleId){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    console.log("删除用户");
                    let res = await deleteRole({roleId});
                    if (res.status !== 200) {
                        return this.$message.error("删除用户信息失败");
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
                this.$confirm('此操作将移除此角色下该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    let res = await removeUserFromRole({userId});
                    if (res.status !== 200) {
                        return this.$message.error("删除用户信息失败");
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
</style>