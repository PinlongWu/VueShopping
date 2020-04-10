<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addUserDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border="" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '' ,'vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环   嵌套渲染二级权限 -->
                <el-row
                  :class="[ index2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyingRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDidlog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addUserDialogVisible" width="50%" @close="addUserClose">
      <el-form :model="addUserRuleForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addUserRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUserRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色弹出框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="modifyingRolesDialogVisible"
      width="50%"
      @close="modifyingRolesClose"
    >
      <el-form :model="rolesRuleForm" :rules="rolesRules" ref="rolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyingRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineModifyingRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      //   控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //   所有权限的数据
      rightslist: [],
      //   树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //   默认选中的节点 Id 值数组
      defKeys: [],
      //   当前即将分配权限的角色 Id
      roleId: "",
      // 控制添加角色弹出框的显示与隐藏
      addUserDialogVisible: false,
      // 添加角色的验证字段
      addUserRuleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 添加角色验证规则
      addUserRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      },
      // 控制修改角色弹出框的显示与隐藏
      modifyingRolesDialogVisible: false,
      // 查询到的修改角色
      rolesRuleForm: {},
      // 修改角色的验证规则
      rolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取所有列表角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get(
        "https://www.liulongbin.top:8888/api/private/v1/roles"
      );
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表数据失败!");
      }
      this.rolelist = res.data;
    },
    // 根据 Id  删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消了删除!");
      }
      const { data: res } = await this.$http.delete(
        `https://www.liulongbin.top:8888/api/private/v1/roles/${role}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败!");
      }
      role.children = res.data;
    },
    // 展示权限的对话框
    async showSetRightDidlog(role) {
      this.roleId = role.id;
      // 获取权限的数据
      const { data: res } = await this.$http.get(
        "https://www.liulongbin.top:8888/api/private/v1/rights/tree"
      );
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败!");
      }
      this.rightslist = res.data;
      //   递归获取三级节点的 Id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式,获取角色下所有的三级权限的 id ,并保存到 defKeys 数组中
    // node节点判断是否是三级节点
    getLeafKeys(node, arr) {
      // 如果当前 node 不包含 children 属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果 node 包含 children 属性,则不是三级节点,利用递归循环每个 children ,
      // 再调用 getLeafKeys 来判断是否还有 children ,如果循环没有 children , 则push
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `https://www.liulongbin.top:8888/api/private/v1/roles/${
          this.roleId
        }/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功!");
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
    // 添加角色
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "https://www.liulongbin.top:8888/api/private/v1/roles",
          this.addUserRuleForm
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功!");
        this.addUserDialogVisible = false;
        this.getRoleList();
      });
    },
    // 关闭添加角色事件
    addUserClose() {
      this.$refs.addUserRef.resetFields();
    },
    // 修改角色
    async modifyingRoles(id) {
      const { data: res } = await this.$http.get(
        "https://www.liulongbin.top:8888/api/private/v1/roles/" + id
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询信息失败!");
      }
      this.rolesRuleForm = res.data;
      this.modifyingRolesDialogVisible = true;
    },
    // 验证整体角色验证,确定提交修改的角色
    determineModifyingRoles() {
      this.$refs.rolesRef.validate(async vaild => {
        if (!vaild) return;
        // 发起用户修改请求
        const { data: res } = await this.$http.put(
          "https://www.liulongbin.top:8888/api/private/v1/roles/" +
            this.rolesRuleForm.roleId,
          {
            roleName: this.rolesRuleForm.roleName,
            roleDesc: this.rolesRuleForm.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色失败!");
        }
        this.modifyingRolesDialogVisible = false;
        this.getRoleList();
        this.$message.success("修改角色成功!");
      });
    },
    // 关闭修改角色事件
    modifyingRolesClose() {
      this.$refs.rolesRef.resetFields();
    },
    // 删除角色
    async deleteRoles(id) {
      // 弹框询问角色是否删除数据
      const confirmRoles = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果角色确认删除,则返回值为字符串 confirm
      // 如果角色取消删除,则返回值为字符串 cancel
      if (confirmRoles !== 'confirm') {
        return this.$message.info("已取消删除!");
      }
      // 确定删除并提交
      const { data: res } = await this.$http.delete(
        "https://www.liulongbin.top:8888/api/private/v1/roles/" + id
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败!");
      }
      this.$message.success("删除用户成功!");
      this.getRoleList()
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>


