<template>
    <div>
        <el-card class="box-card">
            <!-- 用户信息填充表单-->
           <el-table :data="organizeData" stripe style="width: 100%" border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom',i===0?'bdtop':'']" v-for="(item1,i) in scope.row.children[0]" :key="item1.organizeId" class="el-row-1">
                        <el-col :span="10">
                            <el-tag >{{item1.organizeName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="14">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showOrganizeAuth(item1.organizeId)">设置权限</el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="organizeName" label="组名"></el-table-column>
                <el-table-column label="组描述" prop="organizeNote">
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
            <el-dialog
                    title="提示"
                    :visible.sync="treeVisible"
                    width="50%"
                    @close="closeDiaglog"
            >
                <el-tree :data="organizeAuth" :props="defaultProps" show-checkbox node-key="permissionId" default-expand-all
                         ref="treeRef"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="treeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setRoleAuth">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {getOrganizeList,  getMenuList, setPermissionsOfOrganize,getPermissionsFromOrganize
    } from '../../api/index'

    export default {
        name: "OrganizesAuth",
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
                treeVisible:false,
                //添加角色信息
                organizeAuth: [],
                organizeData:[],
                defaultProps: {
                    children: 'children',
                    label: 'permissionNote'
                },
                //默认选择的节点
                defKeys:[],
                organizeId:null
            }
        },
        created() {
            this.getRoles();
        },
        methods: {
            async getRoles() {
                let res = await getOrganizeList(this.queryInfo);
                let res2 = await getMenuList();
                if (res.status !== 200) {
                    return this.$message.error("获取角色信息失败");
                }
                this.total = res.data[1].total;
                this.organizeAuth = res2.data[0];
                this.organizeData=res.data[0];
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
            async showOrganizeAuth(organizeId){
                this.defKeys=[]
                let res = await getPermissionsFromOrganize({organizeId})
                console.log(res);
                res.data[0].forEach(item=>{
                    this.getCheckKeys(item,this.defKeys);
                })
                this.treeVisible = true;
                this.$refs.treeRef.setCheckedKeys(this.defKeys)
                this.organizeId=organizeId;
            },
            handleNodeClick(){},
            getCheckKeys(node,arr){
                if ((node.flag===1) && (node.children === null)){
                    return arr.push(node.permissionId)
                }
                if(node.children!== null){
                    [].slice.call(node.children).forEach(item=>{
                        this.getCheckKeys(item,arr)
                    })
                }
            },
            async closeDiaglog(){
                this.defKeys=[]
                // await this.getUsers()
                this.treeVisible = false;

            },
            async setRoleAuth(){
                let permissionsIds = []
                permissionsIds=this.$refs.treeRef.getCheckedKeys(permissionsIds,true);
                permissionsIds = permissionsIds.join(',')
                await setPermissionsOfOrganize({
                    organizeId:this.organizeId,
                    permissionsIds:permissionsIds
                })
                this.defKeys=[];
                this.treeVisible = false;

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

</style>