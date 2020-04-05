<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png"/>
            </div>
            <!-- 登陆表单区域 -->
            <el-form class="login_from" :model="loginFrom" :rules="loginFromRules" ref="loginFromRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-ren"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginFrom.password" prefix-icon="iconfont icon-suo"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginFrom">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 这是from表单的数据绑定
            loginFrom:{
                username:'admin',
                password:'123456'
            },
            // 表单验证规则
            loginFromRules:{
                // 验证用户名规则
                 username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码规则
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 点击重置按钮，重置登陆表单
        resetLoginFrom(){
            this.$refs.loginFromRef.resetFields();
        },
        // 点击登陆，整体验证表单合法性
        login(){
            this.$refs.loginFromRef.validate(async valid => {
                if(!valid) return;
                const {data : res} = await this.$http.post('https://www.liulongbin.top:8888/api/private/v1/login',this.loginFrom)
                if(res.meta.status !== 200) return this.$message.error('登陆失败！请重新登陆')
                this.$message.success('登陆成功')
                window.sessionStorage.setItem("token", res.data.token)
                this.$router.push('/home')
            });
        }
    }
}
</script>
<style lang="less" scoped>
.login_container{
    background: #2b4b6b;
    height: 100%;
    .login_box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .login_from{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .avatar_box{
            width: 130px;
            height: 130px;
            border-radius: 50%;
            border: 1px solid #eee;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            background: #fff;
            transform: translate(-50%,-50%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
        .btns{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>