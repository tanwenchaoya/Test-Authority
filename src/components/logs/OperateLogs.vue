<template>
    <div>
        <el-card class="box-card">
            <!-- 用户信息填充表单-->
            <el-table :data="operateData" stripe style="width: 100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="operationUserName" label="用户名" width="130px"></el-table-column>
                <el-table-column prop="operationType" label="操作类型"></el-table-column>
                <el-table-column prop="operationIp" label="ip地址"></el-table-column>
                <el-table-column prop="operationDate" label="操作时间"></el-table-column>
                <el-table-column prop="userAgent" label="浏览器类型"></el-table-column>
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
    </div>
</template>

<script>
    import {getOperationLogList} from '../../api/index'

    export default {
        name: "OperateLogs",
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
                operateData:[]
            }
        },
        created() {
            this.getUsers();
        },
        methods: {
            async getUsers() {
                let res = await getOperationLogList(this.queryInfo);
                console.log(res);
                if (res.status !== 200) {
                    return this.$message.error("获取用户信息失败");
                }
                this.operateData=res.data[0];
                this.total=res.data[1].total;
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