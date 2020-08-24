<template>
    <div>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-button type="primary" @click="dialogVisible=true" v-show="userCheckAuth.includes('增加_父组')">添加分部</el-button>
                </el-col>
            </el-row>
            <!-- 用户信息填充表单-->
            <el-table :data="organizeData" stripe style="width: 100%" border v-show="userCheckAuth.includes('查询_组')">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i===0?'bdtop':'']" v-for="(item1,i) in scope.row.children[0]" :key="item1.organizeId" class="el-row-1">
                            <el-col :span="5">
                                <el-tag :closable="userCheckAuth.includes('删除_子组')" @close="removeOrganize(scope.row,item1.organizeId,scope.$index)">{{item1.organizeName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2===0?'':'bdtop']" v-for="(item2,i2) in item1.children[0]" :key="item2.roleId" class="el-row-1">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.roleName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children[0]" :key="item3.userId" type="warning" :closable="userCheckAuth.includes('删除指定用户的子组')" @close="removeUser(scope.row,item3.userId,scope.$index)" :class="['item-user']">{{item3.userName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="organizeName" label="部门"></el-table-column>
                <el-table-column prop="organizeNote" label="部门描述"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="medium" @click="setOrganize(scope.row.organizeId)" v-show="userCheckAuth.includes('增加_子组')">添加部门</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteBigOrganize(scope.row.organizeId)" v-show="userCheckAuth.includes('删除_父组')">删除分部</el-button>
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
                title="添加部门"
                :visible.sync="dialogVisible"
                width="50%">
            <el-form class="form" :model = 'addOrganizeForm'  ref="roleFormRef">
                <el-form-item prop="roleName">
                    <el-input prefix-icon="iconfont icon-nickname" v-model="addOrganizeForm.organizeName" placeholder="分部名称"></el-input>
                </el-form-item>
                <el-form-item prop="roleNote">
                    <el-input prefix-icon="el-icon-edit" v-model="addOrganizeForm.organizeNote" placeholder="分部描述"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="success" @click="checkAddForm" style="width: 100%">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--添加部门界面-->
        <el-dialog
                title="添加部门"
                :visible.sync="showEditVisible"
                width="50%"
        >
            <el-form :model="editOrganizeForm"  ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="部门名称" prop="userName">
                    <el-input v-model="editOrganizeForm.organizeName"></el-input>
                </el-form-item>
                <el-form-item label="部门描述" prop="roleNote">
                    <el-input v-model="editOrganizeForm.organizeNote"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addOrganize" style="width: 100%">添加部门信息</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getOrganizeList,
        addFatherOrganize,
        addSonOrganize,
        deleteFatherOrganize,
        deleteSonOrganize,
        removeUserFromOrganize,
        getPermissionsFromUser
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
                //添加分部
                addOrganizeForm:{
                    organizeName:'',
                    organizeNote:''
                },
                //添加部门
                editOrganizeForm:{
                    organizeName:'',
                    organizeNote:'',
                    parentId:null
                },
                organizeData: [],
                //赋给角色的权限
                userCheckAuth:[]
            }
        },
        created() {
            this.getOrganizes();
        },
        methods: {
            async getOrganizes() {
                let res = await getOrganizeList(this.queryInfo);
                console.log(res);
                if (res.status !== 200) {
                    return this.$message.error("获取角色信息失败");
                }
                this.total = res.data[1].total;
                this.organizeData = res.data[0];
                let userAuth = await getPermissionsFromUser({userId:window.sessionStorage.getItem('userId')});
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
                await this.getOrganizes();
            },
            //页码值发生变化
            async handleCurrentChange(newPage) {
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                await this.getOrganizes();
            },
            //添加分部
            async checkAddForm(){
                let res = await addFatherOrganize(this.addOrganizeForm);
                if (res.status !== 200) {
                    this.dialogVisible = false
                    return this.$message.error("添加分部失败");
                }
                this.dialogVisible = false
                await this.getOrganizes();
                return this.$message.success("添加分部成功");
            },
            setOrganize(id){
                this.editOrganizeForm.parentId=id;
                this.showEditVisible=true;
            },
            //添加部门
            async addOrganize(id){
                console.log(this.editOrganizeForm);
                let res = await addSonOrganize(this.editOrganizeForm)
                if (res.status !== 200) {
                    this.dialogVisible = false
                    return this.$message.error("添加部门信息失败");
                }
                this.showEditVisible= false
                await this.getOrganizes();
                return this.$message.success("添加部门信息成功");


            },
            async removeUser(role,userId,i){
                this.$confirm('此操作将移除此角色下该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.queryInfo.userId =userId
                    //根据id进行删除操作
                    console.log(userId);
                    let res = await removeUserFromOrganize(this.queryInfo);
                    delete this.queryInfo.userId;
                    console.log(res);
                    if (res.status !== 200) {
                        return this.$message.error("删除用户信息失败");
                    }
                    await this.getOrganizes();
                    role.children = res.data[0][i].children;
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
            //删除部门
            async removeOrganize(organize,organizeId,i){
                this.$confirm('此操作将移除此角色下该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //根据id进行删除操作
                    this.queryInfo.organizeId =organizeId
                    let res = await deleteSonOrganize(this.queryInfo);
                    delete this.queryInfo.organizeId;
                    if (res.status !== 200) {
                        return this.$message.error("删除部门信息失败");
                    }
                    organize.children = res.data[0][i].children;
                    this.$message.success("删除部门信息成功");
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
            async deleteBigOrganize(organizeId){
                let res = await deleteFatherOrganize({organizeId});
                if (res.status !== 200) {
                    return this.$message.error("删除分部信息失败");
                }
                await this.getOrganizes();
                return this.$message.success("删除分部信息成功");
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