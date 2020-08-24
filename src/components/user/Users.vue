<template>
    <div>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers" v-show="userCheckAuth.includes('查询_用户( 全部查询+条件查询)')" >
                        <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="getRole" v-show="userCheckAuth.includes('增加_用户')">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户信息填充表单-->
            <el-table :data="tableData" stripe style="width: 100%" border v-show="userCheckAuth.includes('查询_用户( 全部查询+条件查询)')">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="userName" label="姓名" width="180px">
                </el-table-column>
                <el-table-column prop="sex" label="性别">
                </el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column prop="organizeName" label="部门"></el-table-column>
                <el-table-column label="操作" width="210px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="medium" @click="editUser(scope.row.userId)" v-show="userCheckAuth.includes('修改_用户')">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteUser(scope.row.userId)" v-show="userCheckAuth.includes('删除_用户')">删除</el-button>
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
        <!--添加用户界面-->
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form class="form" :model = 'addUserForm'  ref="loginFormRef">
                <el-form-item prop="name">
                    <el-input prefix-icon="iconfont icon-nickname" v-model="addUserForm.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-locking" v-model="addUserForm.password" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="addUserForm.sex" label="男">男</el-radio>
                    <el-radio v-model="addUserForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input prefix-icon="el-icon-phone" v-model="addUserForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-select v-model="selectRoleName" placeholder="请选择添加角色">
                    <el-option
                            v-for="item in roleData"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleName">
                    </el-option>
                </el-select>

                    <el-select v-model="selectFatherOrganizeId" placeholder="请选择添加分部" @change="getCurFatherOrganize">
                        <el-option
                                v-for="item in selectOrganizeData"
                                :key="item.organizeId"
                                :label="item.organizeName"
                                :value="item.organizeId">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectSonOrganizeId" placeholder="请选择添加部门">
                        <el-option
                                v-for="item in selectSonOrganizeData"
                                :key="item.organizeId"
                                :label="item.organizeName"
                                :value="item.organizeId">
                        </el-option>
                    </el-select>

             <!--   <el-form-item prop="roleName">
                    <el-input prefix-icon="el-icon-s-custom" v-model="addUserForm.roleName" placeholder="角色"></el-input>
                </el-form-item>
                <el-form-item prop="groupName">
                    <el-input prefix-icon="el-icon-house" v-model="addUserForm.organizeName" placeholder="部门"></el-input>
                </el-form-item>-->

                <el-form-item>
                    <el-button type="success" @click="checkAddForm" style="width: 100%">添加</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户界面-->
        <el-dialog
                title="修改用户"
                :visible.sync="showEditVisible"
                width="50%"
                >
            <el-form :model="editForm"  ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="editForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="organizeName">
                    <el-input v-model="editForm.organizeName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="updateUserInfo" style="width: 100%">修改信息</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {getUserList, getCurUser, alterCurUser, addUser,
        deleteUser, getRoleList,queryOrganizesForUser,getUserMenuList,
        getPermissionsFromUser
    } from '../../api/index'

    export default {
        name: "Users",
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
                //添加用户信息
                addUserForm:{
                    userName:'',
                    password:'',
                    sex:'',
                    phone:'',
                    roleName:'',
                    organizeSonId:null,
                    organizeFatherId:null
                },
                //用户信息
                tableData: [],
                editForm:{},
                roleData:[],
                selectRoleName:'',
                selectOrganizeData:[],
                selectSonOrganizeData:[],
                selectFatherOrganizeId:null,
                selectSonOrganizeId:null,
                //赋给用户的权限
                userCheckAuth:[]
            }
        },
        created() {
            this.getUsers();
        },
        methods: {
            async getUsers() {
                let res = await getUserList(this.queryInfo);
                console.log(res);
                let res2= await getUserMenuList({userName:window.sessionStorage.getItem('userName')});
                if (res.status !== 200) {
                    return this.$message.error("获取用户信息失败");
                }
                this.total = res.data[1].total-1;
                this.tableData = res.data[0];
                let userAuth = await getPermissionsFromUser({userId:window.sessionStorage.getItem('userId')});
                console.log(userAuth);
                userAuth.data[0].forEach(item=>{
                    this.getCheckKeys(item,this.userCheckAuth);
                })
                console.log(this.userCheckAuth);
            },
            //递归获取用户的权限
            getCheckKeys(node,arr){
                console.log(node);
                if ((node.flag===1) && (node.children === null)){
                    console.log(node.permissionNote);
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
                await this.getUsers();
            },
            //页码值发生变化
            async handleCurrentChange(newPage) {
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                await this.getUsers();
            },
            async checkAddForm(){
                this.addUserForm.organizeSonId=this.selectSonOrganizeId;
                this.addUserForm.organizeFatherId=this.selectFatherOrganizeId;
                this.addUserForm.roleName = this.selectRoleName;
                let res=await addUser(this.addUserForm)
                console.log(res);
                if (res.status !== 200) {
                    return this.$message.error("添加用户信息失败");
                }
                this.dialogVisible = false
                return this.$message.success("添加用户信息成功");
            },
            getCurFatherOrganize(){
                this.selectOrganizeData.forEach(item=>{
                    if (item.organizeId === this.selectFatherOrganizeId){
                        //
                        this.selectSonOrganizeData = item.children[0];
                        console.log(this.selectSonOrganizeData);
                    }
                })
            },
            //查询角色和部门相关的信息
            async getRole(){
                this.dialogVisible = true
                let res = await getRoleList(this.queryInfo);
                let res2 = await queryOrganizesForUser();
                if (res.status !== 200) {
                    return this.$message.error("获取角色信息失败");
                }
                this.selectOrganizeData = res2.data[0];
                console.log(this.selectOrganizeData);
                this.roleData = res.data[0];
            },
            async editUser(userId){
                this.showEditVisible = true;
                //通过id获取用户信息
                let res = await getCurUser({userId});
                if (res.status !== 200) {
                    return this.$message.error("获取用户信息失败");
                }
                this.editForm = res.data[0];
            },
            async updateUserInfo(){
                //更新用户信息
                let res = await alterCurUser(this.editForm);
                if (res.status !== 200) {
                    return this.$message.error("更新用户信息失败");
                }
                this.showEditVisible = false;
                this.$message.success('修改信息成功');
                await this.getUsers();
            },
            async deleteUser(userId){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    console.log("删除用户");
                    let res = await deleteUser({userId});
                    if (res.status !== 200) {
                        return this.$message.error("删除用户信息失败");
                    }
                    await this.getUsers();
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
            .el-select{
                width: 60%;
                margin-bottom: 30px;
            }
        }
    }


</style>