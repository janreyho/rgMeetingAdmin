<template>
  <div class="sip-device-page">
    <!-- 1. 协议标签（SIP/H323/RTSP/GB28181） -->
    <el-tabs v-model="currentProtocol" type="card" style="margin-bottom: 20px; width: 100%; overflow-x: auto; white-space: nowrap;">
      <el-tab-pane label="SIP" name="sip" />
      <el-tab-pane label="H323" name="h323" />
      <el-tab-pane label="RTSP" name="rtsp" />
      <el-tab-pane label="GB28181" name="gb28181" />
    </el-tabs>

    <!-- 2. 子标签（SIP/H323显示：IP直连/终端注册） -->
    <!-- SIP子标签 -->
    <el-tabs 
      v-if="currentProtocol === 'sip'" 
      v-model="currentSubTab" 
      type="border-card" 
      style="margin-bottom: 20px;"
    >
      <el-tab-pane label="IP直连" name="ip-direct" />
      <el-tab-pane label="终端注册" name="terminal-register" />
    </el-tabs>
    <!-- H323子标签 -->
    <el-tabs 
      v-if="currentProtocol === 'h323'" 
      v-model="h323SubTab" 
      type="border-card" 
      style="margin-bottom: 20px;"
    >
      <el-tab-pane label="IP直连" name="h323-ip-direct" />
      <el-tab-pane label="终端注册" name="h323-terminal-register" />
    </el-tabs>

    <!-- 3. 协议对应的界面：条件渲染 -->
    <!-- 3.1 SIP协议界面 -->
    <div v-if="currentProtocol === 'sip'">
      <!-- SIP-IP直连 -->
      <div v-if="currentSubTab === 'ip-direct'">
        <el-form :inline="true" :model="searchForm" class="mb-4">
          <el-form-item label="搜索关键词">
            <el-input v-model="searchForm.keyword" placeholder="请输入显示名称/IP地址搜索"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 100px;">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="在线" value="在线"></el-option>
              <el-option label="离线" value="离线"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDeviceList()">搜索</el-button>
            <el-button @click="resetSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="openAddDeviceDialog()">添加设备</el-button>
        <el-table :data="deviceList" border stripe style="width: 100%; margin-top: 10px">
          <el-table-column prop="name" label="显示名称"></el-table-column>
          <el-table-column prop="ipPort" label="IP地址和端口号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="openEditDeviceDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteDevice(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- SIP-终端注册 -->
      <div v-else-if="currentSubTab === 'terminal-register'">
        <el-form :inline="true" :model="accountSearchForm" class="mb-4">
          <el-form-item label="搜索关键词">
            <el-input v-model="accountSearchForm.keyword" placeholder="请输入显示名称/用户名搜索"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="accountSearchForm.status" placeholder="请选择状态" style="width: 100px;">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAccountList()">搜索</el-button>
            <el-button @click="resetAccountSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="openAddAccountDialog()">添加账号</el-button>
        <el-table :data="accountList" border stripe style="width: 100%; margin-top: 10px">
          <el-table-column prop="displayName" label="显示名称"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="openEditAccountDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteAccount(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 3.2 H323协议界面 -->
    <div v-else-if="currentProtocol === 'h323'">
      <!-- H323-IP直连 -->
      <div v-if="h323SubTab === 'h323-ip-direct'">
        <el-form :inline="true" :model="h323IpSearchForm" class="mb-4">
          <el-form-item label="搜索关键词">
            <el-input v-model="h323IpSearchForm.keyword" placeholder="请输入显示名称/IP地址搜索"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="h323IpSearchForm.status" placeholder="请选择状态" style="width: 100px;">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getH323IpList()">搜索</el-button>
            <el-button @click="resetH323IpSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="openAddH323IpDialog()">添加设备</el-button>
        <el-table :data="h323IpList" border stripe style="width: 100%; margin-top: 10px">
          <el-table-column prop="name" label="显示名称"></el-table-column>
          <el-table-column prop="ipPort" label="IP地址和端口号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="openEditH323IpDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteH323Ip(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- H323-终端注册 -->
      <div v-else-if="h323SubTab === 'h323-terminal-register'">
        <el-form :inline="true" :model="h323AccountSearchForm" class="mb-4">
          <el-form-item label="搜索关键词">
            <el-input v-model="h323AccountSearchForm.keyword" placeholder="请输入显示名称/用户名搜索"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="h323AccountSearchForm.status" placeholder="请选择状态" style="width: 100px;">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getH323AccountList()">搜索</el-button>
            <el-button @click="resetH323AccountSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="openAddH323AccountDialog()">添加账号</el-button>
        <el-table :data="h323AccountList" border stripe style="width: 100%; margin-top: 10px">
          <el-table-column prop="displayName" label="显示名称"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="openEditH323AccountDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteH323Account(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 3.3 RTSP协议界面 -->
    <div v-else-if="currentProtocol === 'rtsp'">
      <el-form :inline="true" :model="rtspSearchForm" class="mb-4">
        <el-form-item label="搜索关键词">
          <el-input v-model="rtspSearchForm.keyword" placeholder="请输入显示名称/RTSP流地址搜索"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="rtspSearchForm.status" placeholder="请选择状态" style="width: 100px;">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRtspList()">搜索</el-button>
          <el-button @click="resetRtspSearch()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="openAddRtspDialog()">添加账号</el-button>
      <el-table :data="rtspList" border stripe style="width: 100%; margin-top: 10px">
        <el-table-column prop="displayName" label="显示名称"></el-table-column>
        <el-table-column prop="streamUrl" label="RTSP流地址"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditRtspDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRtsp(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 3.4 GB28181协议界面（修复分页冲突） -->
    <div v-else-if="currentProtocol === 'gb28181'">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="gbSearchForm" class="mb-4">
        <el-form-item label="搜索关键词">
          <el-input 
            v-model="gbSearchForm.keyword" 
            placeholder="请输入设备名称/设备id搜索"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getGbDeviceList()">搜索</el-button>
          <el-button @click="resetGbSearch()">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 功能按钮 -->
      <div class="gb-btn-group" style="margin-bottom: 16px;">
        <el-button type="primary" @click="openPlatformInfoDialog()" style="margin-right: 10px;">
          平台信息
        </el-button>
        <el-button type="primary" @click="openAddGbDialog()">
          添加设备
        </el-button>
      </div>

      <!-- 设备列表（带展开折叠） -->
<el-table 
  :data="gbDeviceList" 
  border 
  stripe 
  style="width: 100%;"
  @expand-change="handleDeviceExpand"
>
  <!-- 1. 自定义展开列（加号/减号）【标准标签写法】 -->
  <el-table-column width="50">
    <template #default="scope">
      <div class="expand-icon" @click.stop="toggleExpand(scope.row)">
        <i class="el-icon-plus" v-if="!scope.row.expanded"></i>
        <i class="el-icon-minus" v-else></i>
      </div>
    </template>
  </el-table-column>

  <!-- 2. 设备基础列 -->
  <el-table-column prop="deviceName" label="设备名称" width="180"></el-table-column>
  <el-table-column prop="deviceId" label="设备id" width="220"></el-table-column>
  <el-table-column prop="gatewayId" label="设备网关id" width="180"></el-table-column>
  <el-table-column prop="status" label="状态" width="120">
    <template #default="scope">
      <el-tag type="danger">{{ scope.row.status || '离线' }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="操作" width="200" fixed="right">
    <template #default="scope">
      <el-button type="primary" size="small" @click="openEditGbDialog(scope.row)">编辑</el-button>
      <el-button type="danger" size="small" @click="deleteGbDevice(scope.row.id)">删除</el-button>
    </template>
  </el-table-column>

  <!-- 3. 展开行内容（通道列表+添加通道） -->
  <el-table-column type="expand">
    <template #default="scope">
      <div class="channel-container">
        <!-- 添加通道按钮 -->
        <el-button 
          type="primary" 
          size="small" 
          @click="openAddChannelDialog(scope.row)"
          style="margin-bottom: 10px;"
        >
          添加通道
        </el-button>

        <!-- 通道列表表格 -->
        <el-table :data="scope.row.channels" border stripe style="width: 100%;">
          <el-table-column prop="channelName" label="通道名称" width="180"></el-table-column>
          <el-table-column prop="channelId" label="通道id" width="220"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="channelScope">
              <el-button type="primary" size="small" @click="openEditChannelDialog(scope.row, channelScope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteChannel(scope.row, channelScope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </el-table-column>
</el-table>
    <!-- 新增：GB28181-添加/编辑通道弹窗 -->
    <el-dialog
      v-model="channelDialogVisible"
      :title="isEditChannel ? '编辑通道' : '添加通道'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="channelForm" 
        :rules="channelFormRules" 
        label-width="120px" 
        ref="channelFormRef"
      >
        <el-form-item label="*通道名称" prop="channelName">
          <el-input 
            v-model="channelForm.channelName" 
            placeholder="请输入通道名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="*通道id" prop="channelId">
          <el-input 
            v-model="channelForm.channelId" 
            placeholder="请输入20位通道ID"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="channelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChannel">确定</el-button>
      </template>
    </el-dialog>
</div>
    <!-- 新增：GB28181-平台信息弹窗 -->
    <el-dialog
      v-model="platformInfoVisible"
      title="平台信息"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="platform-info">
        <p><span class="label">网关id:</span> {{ platformInfo.gatewayId }}</p>
        <p><span class="label">SIP服务器ID:</span> {{ platformInfo.sipServerId }}</p>
        <p><span class="label">SIP服务器:</span> {{ platformInfo.sipServer }}</p>
        <p><span class="label">SIP服务器地址:</span> {{ platformInfo.sipServerAddr }}</p>
        <p><span class="label">SIP服务器端口:</span> {{ platformInfo.sipServerPort }}</p>
      </div>
      <template #footer>
        <el-button @click="platformInfoVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 新增：GB28181-添加/编辑设备弹窗 -->
    <el-dialog
      v-model="addGbVisible"
      :title="isEditGb ? '编辑GB28181设备' : '添加GB28181设备'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="gbForm" 
        :rules="gbFormRules" 
        label-width="120px" 
        ref="gbFormRef"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input 
            v-model="gbForm.deviceName" 
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备id" prop="deviceId">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input 
                v-model="gbForm.deviceId" 
                placeholder="请输入20位设备ID"
                readonly
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" plain @click="generateGbDeviceId">自动生成</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="设备密码" prop="devicePwd">
          <el-input 
            v-model="gbForm.devicePwd" 
            type="password" 
            placeholder="请输入设备密码"
            :show-password="showGbPwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gatewayId">
          <el-select 
            v-model="gbForm.gatewayId" 
            placeholder="请选择设备网关"
          >
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addGbVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGbDevice">确定</el-button>
      </template>
    </el-dialog>

    <!-- 4. 通用分页（仅保留1个） -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.perPage"
      :total="pagination.total"
      layout="prev, pager, next, jumper, ->, total"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
      style="margin-top: 10px; text-align: right"
    ></el-pagination>

    <!-- 5. 弹窗部分 -->
    <!-- SIP-IP直连弹窗 -->
    <el-dialog
      v-model="deviceDialogVisible"
      :title="isEditDevice ? '编辑SIP设备' : '添加SIP设备'"
      width="500px"
    >
      <el-form :model="deviceForm" :rules="deviceFormRules" label-width="120px" ref="deviceFormRef">
        <el-form-item label="IP地址和端口号" prop="ipPort">
          <el-input v-model="deviceForm.ipPort" placeholder="请输入IP地址和端口号"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="deviceForm.name" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-select v-model="deviceForm.gateway" placeholder="请选择设备网关">
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deviceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDevice">确定</el-button>
      </template>
    </el-dialog>

    <!-- SIP-终端注册弹窗 -->
    <el-dialog
      v-model="accountDialogVisible"
      :title="isEditAccount ? '编辑SIP账号' : '添加SIP账号'"
      width="500px"
    >
      <el-form :model="accountForm" :rules="accountFormRules" label-width="120px" ref="accountFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="accountForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="accountForm.password"
            type="password"
            placeholder="请输入密码"
            :show-password="showAccountPwd"
          />
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="accountForm.displayName" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-select v-model="accountForm.gateway" placeholder="请选择设备网关">
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="accountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAccount">确定</el-button>
      </template>
    </el-dialog>

    <!-- RTSP弹窗 -->
    <el-dialog
      v-model="rtspDialogVisible"
      :title="isEditRtsp ? '编辑RTSP账号' : '添加RTSP账号'"
      width="500px"
    >
      <el-form :model="rtspForm" :rules="rtspFormRules" label-width="120px" ref="rtspFormRef">
        <el-form-item label="传输类型" prop="transportType">
          <el-radio-group v-model="rtspForm.transportType">
            <el-radio label="UDP">UDP</el-radio>
            <el-radio label="TCP">TCP</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流地址" prop="streamUrl">
          <el-input v-model="rtspForm.streamUrl" placeholder="请输入流地址"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="rtspForm.displayName" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-select v-model="rtspForm.gateway" placeholder="请选择设备网关">
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rtspDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRtsp">确定</el-button>
      </template>
    </el-dialog>

    <!-- H323-IP直连弹窗 -->
    <el-dialog
      v-model="h323IpDialogVisible"
      :title="isEditH323Ip ? '编辑H323设备' : '添加H323设备'"
      width="500px"
    >
      <el-form :model="h323IpForm" :rules="h323IpFormRules" label-width="120px" ref="h323IpFormRef">
        <el-form-item label="IP地址和端口号" prop="ipPort">
          <el-input v-model="h323IpForm.ipPort" placeholder="请输入IP地址和端口号"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="h323IpForm.name" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-select v-model="h323IpForm.gateway" placeholder="请选择设备网关">
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="h323IpDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitH323Ip">确定</el-button>
      </template>
    </el-dialog>

    <!-- H323-终端注册弹窗 -->
    <el-dialog
      v-model="h323AccountDialogVisible"
      :title="isEditH323Account ? '编辑H323账号' : '添加H323账号'"
      width="500px"
    >
      <el-form :model="h323AccountForm" :rules="h323AccountFormRules" label-width="120px" ref="h323AccountFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="h323AccountForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="h323AccountForm.password"
            type="password"
            placeholder="请输入密码"
            :show-password="true"
          />
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="h323AccountForm.displayName" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="设备网关" prop="gateway">
          <el-select v-model="h323AccountForm.gateway" placeholder="请选择设备网关">
            <el-option v-for="item in gatewayOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="h323AccountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitH323Account">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessageBox, ElMessage, ElForm } from 'element-plus'

// 接口导入（避免重复声明）
import { 
  getSipDeviceList, addSipDevice, editSipDevice, deleteSipDevice,
  getSipAccountList, addSipAccount, editSipAccount, deleteSipAccount,
  getH323IpListApi, addH323DeviceApi, editH323DeviceApi, deleteH323DeviceApi,
  getH323AccountApi, addH323AccountApi, editH323AccountApi, deleteH323AccountApi,
  getRtspList as apiGetRtspList, addRtsp as apiAddRtsp, editRtsp as apiEditRtsp, deleteRtsp as apiDeleteRtsp,
  getGb28181List as apiGetGb28181List,
  addGb28181Device as apiAddGb28181Device,
  editGb28181Device as apiEditGb28181Device,
  deleteGb28181Device as apiDeleteGb28181Device,
  addGb28181Channel, editGb28181Channel, deleteGb28181Channel
} from '@/api/sipDevice'

// 全局变量
const currentProtocol = ref('sip')
const currentSubTab = ref('ip-direct')
const h323SubTab = ref('h323-ip-direct')
// 替换原来的protocolTypeMap定义
const getProtocolType = (protocol, subTab) => {
  // 嵌套映射：主协议 -> 子标签 -> 对应类型值
  const typeMap = {
    sip: {
      'ip-direct': 'ipsip',         // SIP-IP直连对应ipsip
      'terminal-register': 'regsip' // SIP-终端注册对应regsip
    },
    h323: {
      'h323-ip-direct': 'iph323',       // H323-IP直连对应iph323
      'h323-terminal-register': 'regh323' // H323-终端注册对应regh323
    },
    rtsp: 'rtsp',                   // RTSP保持不变
    gb28181: 'gb28181'              // GB28181保持不变
  };
  // 根据主协议和子标签返回对应类型（SIP/H323需要子标签，其他协议直接返回）
  return protocol === 'sip' || protocol === 'h323' 
    ? typeMap[protocol][subTab] 
    : typeMap[protocol];
};

// 通用配置
const statusOptions = ref([
  { label: '全部', value: '全部' },
  { label: '在线', value: '在线' },
  { label: '离线', value: '离线' }
])
// 适配GB28181模拟数据的网关选项
const gatewayOptions = ref([
  { label: 'devgate-1', value: 'devgate-1' },
  { label: '网关1', value: 'gateway1' },
  { label: '网关2', value: 'gateway2' }
])

// 分页配置（仅定义1次）
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0
})

// -------------------------- SIP-IP直连相关 --------------------------
const searchForm = ref({ keyword: '', status: '全部' }) // 初始化status为“全部”
const deviceList = ref([])
const deviceDialogVisible = ref(false)
const isEditDevice = ref(false)
const deviceForm = ref({ id: '', ipPort: '', name: '', gateway: '' })
const deviceFormRef = ref(null)
const deviceFormRules = ref({
  ipPort: [{ required: true, message: '请输入IP地址和端口号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  gateway: [{ required: true, message: '请选择设备网关', trigger: 'change' }]
})

const getDeviceList = async () => {
  try {
    const statusMap = {
      '全部': '', 
      '在线': 1,   
      '离线': 0    
    };

    const requestParams = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      keyword: searchForm.value.keyword.trim(),
      type: getProtocolType(currentProtocol.value, currentSubTab.value),
      status: statusMap[searchForm.value.status]
    };

    // 调用API后，response直接是后端的响应体：{code:0, data:[...], _meta:{...}}
    const res = await getSipDeviceList(requestParams); 

    // 1. 校验res是否存在（兜底）
    if (!res) {
      ElMessage.error('接口未返回有效数据');
      deviceList.value = [];
      pagination.value.total = 0;
      return;
    }

    // 2. 恢复接口业务状态校验（兜底，防止拦截器逻辑变更）
    if (res.code !== 0) {
      ElMessage.error(`获取设备列表失败：${res.msg || '接口返回异常'}`);
      deviceList.value = [];
      pagination.value.total = 0;
      return;
    }

    // 3. 字段映射（res.data是后端返回的设备数组，item字段与后端完全匹配）
    const formatDeviceList = res.data.map(item => ({
      id: item.id,                          // 后端item.id → 表格唯一标识
      name: item.name || '未命名设备',        // 后端item.name → 表格“显示名称”
      ipPort: item.contact || '无IP端口',    // 后端item.contact → 表格“IP地址和端口号”
      status: item.status === 0 ? '离线' : '在线', // 后端item.status(0/1) → 文字状态
      gateway: item.gw || '未选择网关',      // 后端item.gw → 表格“设备网关”
      heartbeatAt: item.heartbeat_at || 0,   // 后端item.heartbeat_at → 心跳时间（可选展示）
      remark: item.remark || ''              // 后端item.remark → 备注（可选展示）
    }));

    // 4. 赋值列表和分页（res._meta是后端返回的分页信息）
    deviceList.value = formatDeviceList;
    pagination.value = {
      page: res._meta?.currentPage || 1,    
      perPage: res._meta?.perPage || 10,   
      total: res._meta?.totalCount || 0    
    };

    console.log('设备列表数据：', deviceList.value); // 验证数据是否正确

  } catch (err) {
    console.error('获取设备列表失败，错误详情：', err);
    ElMessage.error(`获取设备列表失败：${err.message || '网络/接口异常'}`);
    deviceList.value = [];
    pagination.value.total = 0;
  }
};

// -------------------------- SIP-终端注册相关 --------------------------
const accountSearchForm = ref({ keyword: '', status: '全部' })
const accountList = ref([])
const accountDialogVisible = ref(false)
const isEditAccount = ref(false)
const accountForm = ref({ id: '', username: '', password: '', displayName: '', gateway: '' })
const showAccountPwd = ref(false)
const accountFormRef = ref(null)
const accountFormRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  gateway: [{ required: true, message: '请选择设备网关', trigger: 'change' }]
})

// 第一步：定义状态格式化函数（适配响应数据的status值）
const formatAccountStatus = (status) => {
  const statusMap = {
    1: '在线',   // 响应数据中status=1 → 在线
    2: '离线',   // 响应数据中status=2 → 离线
    0: '未激活'  // 兜底：若有其他状态值
  };
  return statusMap[status] || '未知状态';
};

// 第二步：重构 getAccountList 方法
const getAccountList = async () => {
  try {
    // 1. 构造请求参数（动态获取SIP子类型）
    const requestParams = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      keyword: accountSearchForm.value.keyword.trim(),
      // 动态取SIP子类型：若当前协议是sip，取选中的子类型；否则取原协议值
      type: getProtocolType(currentProtocol.value, currentSubTab.value),
      // 状态参数转换：适配响应数据的status值（1=在线，2=离线）
      status: accountSearchForm.value.status === '全部' 
        ? '' 
        : accountSearchForm.value.status === '在线' ? 1 : 2
    };

    // 2. 调用接口
    const res = await getSipAccountList(requestParams);

    // 3. 接口成功校验
    if (res.code !== 0) {
      ElMessage.error(`获取账号列表失败：${res.msg || '接口返回异常'}`);
      accountList.value = [];
      pagination.value.total = 0;
      return;
    }

    // 4. 字段映射（适配响应数据，处理conn_params为null的情况）
    accountList.value = res.data.map(item => ({
      id: item.id, // 主键ID
      username: item.contact || '', // 账号（接口contact字段）
      displayName: item.name || '未命名账号', // 显示名称（接口name字段）
      // 密码：处理conn_params为null的边界情况，避免报错
      password: item.conn_params?.auth_pwd || '', 
      status: formatAccountStatus(item.status), // 状态格式化（1→在线，2→离线）
      gateway: item.gw || '未绑定网关', // 网关ID（兜底）
      // 心跳时间：转换为可读格式（0→无心跳）
      heartbeatAt: item.heartbeat_at === 0 
        ? '无心跳' 
        : new Date(item.heartbeat_at * 1000).toLocaleString(), // 秒转毫秒
      remark: item.remark || '' // 备注（兜底）
    }));

    // 5. 分页信息适配
    pagination.value = {
      ...pagination.value,
      total: res._meta?.totalCount || 0,
      currentPage: res._meta?.currentPage || 1,
      perPage: res._meta?.perPage || 10
    };

  } catch (err) {
    console.error('获取账号列表失败：', err);
    ElMessage.error('获取账号列表失败，请检查网络或重试');
    accountList.value = [];
    pagination.value.total = 0;
  }
};

// -------------------------- H323相关 --------------------------
const h323IpSearchForm = ref({ keyword: '', status: '全部' })
const h323IpList = ref([])
const h323IpDialogVisible = ref(false)
const isEditH323Ip = ref(false)
const h323IpForm = ref({ id: '', ipPort: '', name: '', gateway: '' })
const h323IpFormRef = ref(null)
const h323IpFormRules = ref({
  ipPort: [{ required: true, message: '请输入IP地址和端口号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  gateway: [{ required: true, message: '请选择设备网关', trigger: 'change' }]
})

// 第一步：定义H323状态格式化函数（适配响应中status=0的场景）
const formatH323Status = (status) => {
  const statusMap = {
    0: '离线',   // 响应数据中status=0 → 离线（可根据业务调整文字）
    1: '在线',   // 若后续有在线状态，提前兼容
    2: '异常'    // 兜底状态
  };
  return statusMap[status] || '未知状态';
};

// 第二步：重构getH323IpList方法
const getH323IpList = async () => {
  try {
    const statusMap = { '全部': '', '在线': 1, '离线': 0 }; 
    const requestParams = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      keyword: h323IpSearchForm.value.keyword.trim(),
      type: getProtocolType(currentProtocol.value, h323SubTab.value), 
      status: statusMap[h323IpSearchForm.value.status]
    };

    // 调用接口（替换为实际API函数）
    const res = await getH323IpListApi(requestParams);

    // 1. 接口成功校验（非0均为失败）
    if (res.code !== 0) {
      ElMessage.error(`获取H323-IP设备列表失败：${res.msg || '接口返回异常'}`);
      h323IpList.value = []; // 清空列表
      pagination.value.total = 0; // 重置分页总数
      return;
    }

    // 2. 字段映射（适配H323响应数据结构）
    h323IpList.value = res.data.map(item => ({
      id: item.id, // 主键ID（操作列用）
      name: item.name || '未命名H323设备', // 设备名称（兜底）
      ipPort: item.contact || '无IP端口', // IP+端口（接口contact字段）
      type: item.type || '未知类型', // 设备类型（接口type=3，可保留数字或转文字）
      status: formatH323Status(item.status), // 状态格式化（0→离线）
      gateway: item.gw || '未绑定网关', // 网关ID（兜底）
      // 心跳时间：0→无心跳，非0转可读时间（秒转毫秒）
      heartbeatAt: item.heartbeat_at === 0 
        ? '无心跳' 
        : new Date(item.heartbeat_at * 1000).toLocaleString(),
      remark: item.remark || '' // 备注（兜底）
    }));

    // 3. 分页信息适配（从_meta提取，替换原来的res.data.total）
    pagination.value = {
      ...pagination.value, // 保留当前页/每页条数
      total: res._meta?.totalCount || 0, // 总条数（关键：从_meta取）
      currentPage: res._meta?.currentPage || 1, // 当前页
      perPage: res._meta?.perPage || 10 // 每页条数
    };

  } catch (err) {
    // 网络错误/接口异常捕获
    console.error('获取H323-IP设备列表失败：', err);
    ElMessage.error('获取H323-IP设备列表失败，请检查网络或重试');
    h323IpList.value = [];
    pagination.value.total = 0;
  }
};

const h323AccountSearchForm = ref({ keyword: '', status: '全部' })
const h323AccountList = ref([])
const h323AccountDialogVisible = ref(false)
const isEditH323Account = ref(false)
const h323AccountForm = ref({ id: '', username: '', password: '', displayName: '', gateway: '' })
const h323AccountFormRef = ref(null)
const h323AccountFormRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  gateway: [{ required: true, message: '请选择设备网关', trigger: 'change' }]
})

// 第一步：定义H323账号状态格式化函数（适配响应中status=2的场景）
const formatH323AccountStatus = (status) => {
  const statusMap = {
    2: '离线',   // 响应数据中status=2 → 离线（按业务规则调整文字）
    1: '在线',   // 提前兼容在线状态
    0: '未激活', // 兜底状态
    // 可扩展其他状态值
  };
  return statusMap[status] || '未知状态';
};

// 第二步：重构getH323AccountList方法
const getH323AccountList = async () => {
  try {
    const statusMap = { '全部': '', '在线': 1, '离线': 2 }; // 关键：status=2对应离线，需和后端匹配
    const requestParams = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      keyword: h323AccountSearchForm.value.keyword.trim(),
      type: getProtocolType(currentProtocol.value, h323SubTab.value), 
      status: statusMap[h323AccountSearchForm.value.status] // 适配status=2的筛选
    };

    // 调用接口（替换为实际API函数）
    const res = await getH323AccountApi(requestParams);

    // 1. 接口成功校验（非0均为失败）
    if (res.code !== 0) {
      ElMessage.error(`获取H323账号列表失败：${res.msg || '接口返回异常'}`);
      h323AccountList.value = []; // 清空列表
      pagination.value.total = 0; // 重置分页总数
      return;
    }

    // 2. 字段映射（适配H323账号响应结构）
    h323AccountList.value = res.data.map(item => ({
      id: item.id, // 主键ID（编辑/删除操作用）
      username: item.contact || '', // 账号（接口contact字段）
      displayName: item.name || '未命名H323账号', // 显示名称（兜底）
      // 密码：处理conn_params可能为null的边界情况（可选链+兜底）
      password: item.conn_params?.auth_pwd || '', 
      type: item.type || '未知类型', // 设备类型（type=3，可保留或转文字）
      status: formatH323AccountStatus(item.status), // 状态格式化（2→离线）
      gateway: item.gw || '未绑定网关', // 网关ID（兜底）
      // 心跳时间：0→无心跳，非0转可读时间（秒转毫秒）
      heartbeatAt: item.heartbeat_at === 0 
        ? '无心跳' 
        : new Date(item.heartbeat_at * 1000).toLocaleString(),
      remark: item.remark || '' // 备注（兜底）
    }));

    // 3. 分页信息适配（从_meta提取，修正原错误的res.data.total）
    pagination.value = {
      ...pagination.value, // 保留当前页/每页条数
      total: res._meta?.totalCount || 0, // 总条数（关键：从_meta取）
      currentPage: res._meta?.currentPage || 1, // 当前页
      perPage: res._meta?.perPage || 10 // 每页条数
    };

  } catch (err) {
    // 网络错误/接口异常捕获（补充友好提示）
    console.error('获取H323账号列表失败：', err);
    ElMessage.error('获取H323账号列表失败，请检查网络或重试');
    h323AccountList.value = [];
    pagination.value.total = 0;
  }
};

// -------------------------- RTSP相关 --------------------------
const rtspSearchForm = ref({ keyword: '', status: '全部' })
const rtspList = ref([])
const rtspDialogVisible = ref(false)
const isEditRtsp = ref(false)
const rtspForm = ref({ id: '', transportType: 'UDP', streamUrl: '', displayName: '', gateway: '' })
const rtspFormRef = ref(null)
const rtspFormRules = ref({
  transportType: [{ required: true, message: '请选择传输类型', trigger: 'change' }],
  streamUrl: [{ required: true, message: '请输入流地址', trigger: 'blur' }],
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  gateway: [{ required: true, message: '请选择设备网关', trigger: 'change' }]
})

// 第一步：定义RTSP状态格式化函数（适配响应中status=0的场景）
const formatRtspStatus = (status) => {
  const statusMap = {
    0: '离线',   // 响应中status=0 → 离线（可按业务调整）
    1: '在线',   // 提前兼容在线状态
    2: '异常'    // 兜底状态
  };
  return statusMap[status] || '未知状态';
};

// 第二步：重构getRtspList方法
const getRtspList = async () => {
  try {
    // 构造请求参数（补充status映射，避免传文字给后端）
    const statusMap = { '全部': '', '在线': 1, '离线': 0 };
    const requestParams = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      keyword: rtspSearchForm.value.keyword?.trim() || '', // 去除空格+兜底
      type: getProtocolType(currentProtocol.value, currentSubTab.value),
      status: statusMap[rtspSearchForm.value.status] || '' // 文字转数字/空
    };

    // 调用接口
    const res = await apiGetRtspList(requestParams);

    // 1. 接口成功校验（非0均为失败）
    if (res.code !== 0) {
      ElMessage.error(`获取RTSP列表失败：${res.msg || '接口返回异常'}`);
      rtspList.value = []; // 清空列表
      pagination.value.total = 0; // 重置分页总数
      return;
    }

    // 2. 字段映射（适配RTSP响应结构，处理边界值）
    rtspList.value = res.data.map(item => ({
      id: item.id, // 主键ID（操作列用）
      displayName: item.name || '未命名RTSP设备', // 设备名称（兜底）
      streamUrl: item.contact || '无RTSP地址', // RTSP地址（接口contact字段）
      transportType: item.conn_params?.transport_type || '默认', // 传输类型（UDP/TCP）
      type: item.type || '未知类型', // 设备类型（type=5，可保留或转文字）
      status: formatRtspStatus(item.status), // 状态格式化（0→离线）
      gateway: item.gw || '未绑定网关', // 网关ID（兜底）
      // 心跳时间：0→无心跳，非0转可读时间（秒转毫秒）
      heartbeatAt: item.heartbeat_at === 0 
        ? '无心跳' 
        : new Date(item.heartbeat_at * 1000).toLocaleString(),
      remark: item.remark || '' // 备注（兜底）
    }));

    // 3. 分页信息适配（从_meta提取，修正原错误的res.data.total）
    pagination.value = {
      ...pagination.value, // 保留当前页/每页条数
      total: res._meta?.totalCount || 0, // 总条数（关键：从_meta取）
      currentPage: res._meta?.currentPage || 1, // 当前页
      perPage: res._meta?.perPage || 10 // 每页条数
    };

  } catch (err) {
    // 网络错误/接口异常捕获（补充友好提示）
    console.error('获取RTSP列表失败：', err);
    ElMessage.error('获取RTSP列表失败，请检查网络或重试');
    rtspList.value = [];
    pagination.value.total = 0;
  }
};

// -------------------------- GB28181相关 --------------------------
const gbSearchForm = ref({ keyword: '' })
// 设备列表：新增expanded（展开状态）、channels（通道列表）属性
const gbDeviceList = ref([])

const platformInfoVisible = ref(false)
const platformInfo = ref({
  gatewayId: 'devgate-1',
  sipServerId: '37070000082000000001',
  sipServer: '3707000008',
  sipServerAddr: '39.107.250.156',
  sipServerPort: '25171'
})
const addGbVisible = ref(false)
const isEditGb = ref(false)
const gbFormRef = ref(null)
const showGbPwd = ref(false)
const gbForm = ref({
  id: '',
  deviceName: '',
  deviceId: '',
  devicePwd: '',
  gatewayId: ''
})
const gbFormRules = ref({
  deviceName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '设备名称长度2-50字符', trigger: 'blur' }
  ],
  deviceId: [
    { required: true, message: '请生成或输入设备ID', trigger: 'blur' },
    { len: 20, message: '设备ID必须为20位', trigger: 'blur' },
    { pattern: /^\d+$/, message: '设备ID仅支持数字', trigger: 'blur' }
  ],
  devicePwd: [
    { required: true, message: '请输入设备密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度6-32字符', trigger: 'blur' }
  ],
  gatewayId: [
    { required: true, message: '请选择设备网关', trigger: 'change' }
  ]
})

// -------------------------- 新增：通道管理相关 --------------------------
const channelDialogVisible = ref(false)
const isEditChannel = ref(false)
const currentDevice = ref(null) // 当前操作的设备
const channelFormRef = ref(null)
const channelForm = ref({
  id: '',
  channelName: '',
  channelId: ''
})
const channelFormRules = ref({
  channelName: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
  channelId: [
    { required: true, message: '请输入通道id', trigger: 'blur' },
    { len: 20, message: '通道id必须为20位', trigger: 'blur' },
    { pattern: /^\d+$/, message: '通道id仅支持数字', trigger: 'blur' }
  ]
})

// 1. 切换设备展开/折叠（加号变减号）
const toggleExpand = (row) => {
  row.expanded = !row.expanded; // 切换展开状态（加号↔减号）
  // 首次展开加载通道数据（确保通道列表显示正确）
  if (row.expanded && row.channels.length === 0) {
    // 真实场景替换为接口请求：await getGb28181Channels(row.id)
    row.channels = [
      { id: Date.now() - 100, channelName: `${row.deviceName}-通道1`, channelId: row.deviceId.slice(0, 10) + Math.random().toString().slice(2, 12) },
      { id: Date.now() - 200, channelName: `${row.deviceName}-通道2`, channelId: row.deviceId.slice(0, 10) + Math.random().toString().slice(2, 12) }
    ];
  }
};

// 2. 同步表格展开状态（与自定义图标对齐）
const handleDeviceExpand = (row, expanded) => {
  row.expanded = expanded
}

// 3. 打开添加通道弹窗
const openAddChannelDialog = (device) => {
  currentDevice.value = device
  isEditChannel.value = false
  channelForm.value = { id: '', channelName: '', channelId: '' }
  channelDialogVisible.value = true
}

// 4. 打开编辑通道弹窗
const openEditChannelDialog = (device, channel) => {
  currentDevice.value = device
  isEditChannel.value = true
  channelForm.value = { ...channel }
  channelDialogVisible.value = true
}

// 5. 提交通道（添加/编辑）
const submitChannel = async () => {
  if (!channelFormRef.value || !currentDevice.value) return
  try {
    await channelFormRef.value.validate()
    const channelData = { ...channelForm.value }

    if (isEditChannel.value) {
      // 编辑通道：更新数组中的对应项
      const index = currentDevice.value.channels.findIndex(c => c.id === channelData.id)
      if (index !== -1) currentDevice.value.channels[index] = channelData
      ElMessage.success('编辑通道成功')
    } else {
      // 添加通道：生成ID并添加到数组
      channelData.id = Date.now()
      currentDevice.value.channels.push(channelData)
      ElMessage.success('添加通道成功')
    }
    channelDialogVisible.value = false
  } catch (err) {
    console.error('通道提交失败：', err)
    return
  }
}

// 6. 删除通道
const deleteChannel = (device, channelId) => {
  ElMessageBox.confirm('确定要删除该通道吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    device.channels = device.channels.filter(c => c.id !== channelId)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// -------------------------- 其他方法 --------------------------
// 生成GB28181设备ID
const generateGbDeviceId = () => {
  // 生成20位数字的设备ID（示例逻辑）
  const prefix = '3402000000'
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
  gbForm.value.deviceId = prefix + random
}

// 提交GB28181设备
const submitGbDevice = async () => {
  if (!gbFormRef.value) return

  try {
    // 第一步：表单校验
    await gbFormRef.value.validate()

    // 第二步：映射前端表单字段 → 后端接口字段（关键！）
    // 参考后端响应结构：name=设备名、contact=设备ID、conn_params.auth_pwd=密码、gw=网关ID、type=4（GB28181固定）
    const requestData = {
      display_name: gbForm.value.deviceName,        // 前端deviceName → 后端name
      type: getProtocolType(currentProtocol.value, currentSubTab.value),                              // GB28181设备固定类型（参考后端响应的type:4）
      sip_no: gbForm.value.deviceId,       // 前端deviceId → 后端contact
      auth_pwd: gbForm.value.devicePwd,   // 前端devicePwd → 后端conn_params.auth_pwd
      gw: gbForm.value.gatewayId,           // 前端gatewayId → 后端gw
      remark: ''                            // 备注（可选，无则传空）
    }

    let res
    if (isEditGb.value) {
      // 编辑设备：追加设备ID到请求参数（后端需要ID定位编辑对象）
      res = await apiEditGb28181Device({
        id: gbForm.value.id, // 编辑必须传ID（前端表单已回显）
        ...requestData
      })
    } else {
      // 添加设备：直接传参数
      res = await apiAddGb28181Device(requestData)
    }

    // 第三步：处理接口响应
    if (res.code === 0) {
      ElMessage.success(isEditGb.value ? '编辑设备成功' : '添加设备成功')
      addGbVisible.value = false // 关闭弹窗
      getGbDeviceList() // 刷新设备列表（关键！保证数据和后端一致）
    } else {
      ElMessage.error(res.msg || (isEditGb.value ? '编辑设备失败' : '添加设备失败'))
    }
  } catch (err) {
    // 表单校验失败 或 接口调用失败 都提示
    console.error('提交GB28181设备失败：', err)
    ElMessage.error('操作失败，请检查参数或网络后重试')
  }
}

// 打开添加GB28181设备弹窗
const openAddGbDialog = () => {
  isEditGb.value = false
  gbForm.value = { id: '', deviceName: '', deviceId: '', devicePwd: '', gatewayId: '' }
  addGbVisible.value = true
}

// 打开编辑GB28181设备弹窗
const openEditGbDialog = (row) => {
  isEditGb.value = true
  // 后端字段 → 前端表单字段映射（关键！保证回显正确）
  gbForm.value = {
    id: row.id, // 设备ID（后端返回的id）
    deviceName: row.deviceName || row.name, // 优先取前端映射后的deviceName，无则取后端name
    deviceId: row.deviceId || row.contact, // 后端contact是设备ID，映射到前端deviceId
    devicePwd: row.conn_params?.auth_pwd || '', // 后端conn_params.auth_pwd是密码，映射到前端devicePwd
    gatewayId: row.gatewayId || row.gw // 后端gw是网关ID，映射到前端gatewayId
  }
  addGbVisible.value = true
}

// 删除GB28181设备
const deleteGbDevice = async (id) => {
  try {
    // 第一步：确认删除
    await ElMessageBox.confirm(
      '确定要删除该GB28181设备吗？删除后不可恢复',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 第二步：调用删除接口（传入设备ID）
    const res = await apiDeleteGb28181Device(id)

    // 第三步：处理响应
    if (res.code === 0) {
      ElMessage.success('删除设备成功')
      getGbDeviceList() // 刷新列表（关键！）
    } else {
      ElMessage.error(res.msg || '删除设备失败')
    }
  } catch (err) {
    // 取消删除不提示错误，其他错误提示
    if (err !== 'cancel') {
      console.error('删除GB28181设备失败：', err)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 打开平台信息弹窗
const openPlatformInfoDialog = () => {
  platformInfoVisible.value = true
}

// 获取GB28181设备列表
const getGbDeviceList = async () => {
  // 状态映射：后端status=0→离线，1→在线（和后端对齐）
  const statusMap = { '全部': '', '在线': 1, '离线': 0 }; 
  try {
    // -------------------------- 步骤1：构造正确的请求参数 --------------------------
    const requestParams = {
      page: pagination.value.page,       
      'per-page': pagination.value.perPage, // 关键：改为接口要求的per-page（连字符）
      type: getProtocolType(currentProtocol.value, currentSubTab.value), // 确保返回gb28181
      keyword: gbSearchForm.value.keyword?.trim() || '',  
      status: statusMap[gbSearchForm.value.status] || '' 
    };

    // -------------------------- 步骤2：调用接口 --------------------------
    const res = await apiGetGb28181List(requestParams);

    // -------------------------- 步骤3：处理接口响应 --------------------------
    if (res.code === 0) {
      // 核心：字段映射（后端字段 → 前端表格prop）
      gbDeviceList.value = res.data.map(item => ({
        id: item.id, // 设备ID（操作列用）
        deviceName: item.name || '未命名设备', // 后端name → 前端deviceName（表格prop）
        deviceId: item.contact ? item.contact.trim() : '无设备ID', // 后端contact → 前端deviceId（表格prop）
        gatewayId: item.gw ? item.gw.trim() : '未绑定网关', // 后端gw → 前端gatewayId（表格prop）
        status: item.status === 1 ? '在线' : '离线', // 数字状态转文字（0=离线，1=在线）
        expanded: false, // 表格展开状态（前端自用）
        channels: item.channels || [], // 通道列表（后端无返回则为空）
        remark: item.remark || '' // 备注（兜底）
      }));

      // 分页信息必须从 _meta 提取，确保分页正确
      pagination.value = {
        page: res._meta?.currentPage || 1,
        perPage: res._meta?.perPage || 10,
        total: res._meta?.totalCount || 0 // 确保总条数正确，避免列表显示异常
      };
    } else {
      // 接口返回失败提示
      ElMessage.error(`获取GB28181设备列表失败：${res.msg || '接口返回异常'}`);
      gbDeviceList.value = [];
      pagination.value.total = 0;
    }
  } catch (err) {
    // 网络/接口异常捕获
    console.error('获取GB28181设备列表失败：', err);
    ElMessage.error('获取设备列表失败，请检查网络或重试');
    gbDeviceList.value = [];
    pagination.value.total = 0;
  }
};

// 重置GB28181搜索
const resetGbSearch = () => {
  gbSearchForm.value.keyword = '' // 清空搜索关键词
  pagination.value.page = 1       // 重置页码为第1页
  getGbDeviceList()               // 重新获取列表
}

// 分页变化处理
const handlePageChange = (val) => {
  pagination.value.page = val
  // 根据当前协议和子标签加载对应列表
  if (currentProtocol.value === 'sip') {
    if (currentSubTab.value === 'ip-direct') {
      getDeviceList()
    } else {
      getAccountList()
    }
  } else if (currentProtocol.value === 'h323') {
    if (h323SubTab.value === 'h323-ip-direct') {
      getH323IpList()
    } else {
      getH323AccountList()
    }
  } else if (currentProtocol.value === 'rtsp') {
    getRtspList()
  } else if (currentProtocol.value === 'gb28181') {
    getGbDeviceList()
  }
}

// 重置SIP-IP直连搜索
const resetSearch = () => {
  searchForm.value = { keyword: '', status: '全部' }
  getDeviceList()
}

// 打开添加SIP设备弹窗
const openAddDeviceDialog = () => {
  isEditDevice.value = false
  deviceForm.value = { id: '', ipPort: '', name: '', gateway: '' }
  deviceDialogVisible.value = true
}

// 提交设备表单（新增/编辑通用）
const submitDevice = async () => {
  // 表单验证
  const valid = await deviceFormRef.value.validate()
  if (!valid) return

  try {
    if (!isEditDevice.value) {
      // 新增设备：调用addSipDevice API
      const res = await addSipDevice({
        uri: deviceForm.value.ipPort, // 对应后端的contact字段（IP+端口）
        display_name: deviceForm.value.name,
        gw: deviceForm.value.gateway,
        type: getProtocolType(currentProtocol.value, currentSubTab.value) // 类型：ipsip
      })

      if (res.code === 0) {
        ElMessage.success('添加设备成功')
        deviceDialogVisible.value = false // 关闭弹窗
        getDeviceList() // 刷新列表
      } else {
        ElMessage.error(`添加失败：${res.msg || '未知错误'}`)
      }
    } else {
      // 编辑设备：调用editSipDevice API
      const res = await editSipDevice({
        id: deviceForm.value.id, // 必须传入设备ID
        uri: deviceForm.value.ipPort,
        display_name: deviceForm.value.name,
        gw: deviceForm.value.gateway,
        type: getProtocolType(currentProtocol.value, currentSubTab.value)
      })

      if (res.code === 0) {
        ElMessage.success('编辑设备成功')
        deviceDialogVisible.value = false
        getDeviceList() // 刷新列表
      } else {
        ElMessage.error(`编辑失败：${res.msg || '未知错误'}`)
      }
    }
  } catch (err) {
    if (!isEditDevice.value) {
    console.error('添加设备失败：', err)
    ElMessage.error('添加设备失败，请重试')
    }
    else{
      console.error('设备操作失败：', err)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 打开编辑SIP设备弹窗
const openEditDeviceDialog = (row) => {
  // 填充表单数据（从选中行获取）
  deviceForm.value = {
    id: row.id,
    ipPort: row.ipPort,
    name: row.name,
    gateway: row.gateway
  }
  isEditDevice.value = true // 标记为编辑
  deviceDialogVisible.value = true // 显示弹窗
}

// 删除SIP设备
const deleteDevice = async (id) => {
  // 显示确认弹窗
  const confirm = await ElMessageBox.confirm(
    '确定要删除该设备吗？删除后不可恢复',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch(() => false) // 取消时返回false

  if (!confirm) return // 取消删除

  try {
    // 调用deleteSipDevice API
    const res = await deleteSipDevice(id)
    if (res.code === 0) {
      ElMessage.success('删除设备成功')
      getDeviceList() // 刷新列表
    } else {
      ElMessage.error(`删除失败：${res.msg || '未知错误'}`)
    }
  } catch (err) {
    console.error('删除设备失败：', err)
    ElMessage.error('删除失败，请重试')
  }
}

// 重置SIP账号搜索
const resetAccountSearch = () => {
  accountSearchForm.value = { keyword: '', status: '全部' }
  getAccountList()
}

// 打开添加SIP账号弹窗
const openAddAccountDialog = () => {
  isEditAccount.value = false
  accountForm.value = { id: '', username: '', password: '', displayName: '', gateway: '' }
  accountDialogVisible.value = true
}

// 打开编辑SIP账号弹窗
const openEditAccountDialog = (row) => {
  isEditAccount.value = true
  accountForm.value = { ...row }
  accountDialogVisible.value = true
}

// SIP-终端注册提交处理
const submitAccount = async () => {
  // 表单验证
  const valid = await accountFormRef.value.validate();
  if (!valid) return;

  try {
    if (!isEditAccount.value) {
      // 调用添加账号API
      const res = await addSipAccount({
        username: accountForm.value.username, // 用户名（接口通常用contact字段）
        display_name: accountForm.value.displayName, // 显示名称
        gw: accountForm.value.gateway,       // 设备网关
        auth_pwd: accountForm.value.password, // 密码（通常嵌套在conn_params中）
        type: getProtocolType(currentProtocol.value, currentSubTab.value)
      });

      if (res.code === 0) {
        ElMessage.success('添加账号成功');
        accountDialogVisible.value = false;
        getAccountList(); // 刷新列表
      } else {
        ElMessage.error(`添加失败：${res.msg}`);
      }
    } else {
      // 调用编辑账号API
      const res = await editSipAccount({
        id: accountForm.value.id,
        username: accountForm.value.username,
        display_name: accountForm.value.displayName,
        gw: accountForm.value.gateway,
        auth_pwd: accountForm.value.password, // 密码（通常嵌套在conn_params中）
        type: getProtocolType(currentProtocol.value, currentSubTab.value)
      });

      if (res.code === 0) {
        ElMessage.success('编辑账号成功');
        accountDialogVisible.value = false;
        getAccountList(); // 刷新列表
        isEditAccount.value = false; // 重置编辑状态
      } else {
        ElMessage.error(`编辑失败：${res.msg}`);
      }
    }
  } catch (err) {
    if (!isEditAccount.value) {
      console.error('添加账号失败：', err);
      ElMessage.error('添加账号失败，请重试');
    }
    else{
        console.error('账号操作失败：', err);
    ElMessage.error('操作失败，请重试');
    }
  }
};

// 删除SIP账号（修复async + 缩进 + 错误处理）
const deleteAccount = async (id) => { // 核心：添加async关键字
  try {
    // 显示确认弹窗
    const confirm = await ElMessageBox.confirm(
      '确定要删除该账号吗？删除后不可恢复',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => false); // 取消时返回false

    if (!confirm) return; // 取消删除，直接返回

    // 调用删除账号API
    const res = await deleteSipAccount(id);
    if (res.code === 0) {
      ElMessage.success('删除成功');
      getAccountList(); // 刷新列表
    } else {
      ElMessage.error(`删除失败：${res.msg || '未知错误'}`);
    }
  } catch (err) {
    // 仅捕获API调用的错误（取消弹窗的错误已被catch(()=>false)处理）
    console.error('删除账号失败：', err);
    ElMessage.error('删除失败，请重试');
  }
};

// 重置RTSP搜索
const resetRtspSearch = () => {
  rtspSearchForm.value = { keyword: '', status: '全部' }
  getRtspList()
}

// 打开添加RTSP弹窗
const openAddRtspDialog = () => {
  isEditRtsp.value = false
  rtspForm.value = { id: '', transportType: 'UDP', streamUrl: '', displayName: '', gateway: '' }
  // nextTick(() => {
  //   rtspFormRef.value?.resetFields()
  // })
  rtspDialogVisible.value = true
}

// 打开编辑RTSP弹窗
const openEditRtspDialog = (row) => {
  isEditRtsp.value = true
  rtspForm.value = {
    id: row.id, // 存储编辑ID
    transportType: row.transportType || 'UDP', // 回显传输类型（确保勾选）
    streamUrl: row.streamUrl, // 回显流地址
    displayName: row.displayName, // 回显显示名称
    gateway: row.gateway // 回显网关
  }
  // 重置校验状态
  // nextTick(() => {
  //   rtspFormRef.value?.resetFields()
  // })
  rtspDialogVisible.value = true
}

// 提交RTSP
const submitRtsp = async () => {
  // 第一步：表单校验
  const valid = await rtspFormRef.value.validate().catch(() => false)
  if (!valid) return

  // 第二步：构造API参数（适配后端字段）
  const params = {
    display_name: rtspForm.value.displayName, // 显示名称对应后端name
    uri: rtspForm.value.streamUrl, // 流地址对应后端contact
    gw: rtspForm.value.gateway, // 网关对应后端gw
    type: 'rtsp', // RTSP固定类型
    transport_type: rtspForm.value.transportType // 传输类型嵌套在conn_params
  }

  try {
    let res
    if (isEditRtsp.value) {
      // 编辑：追加ID参数
      res = await apiEditRtsp({ ...params, id: rtspForm.value.id })
    } else {
      // 添加：直接传参
      res = await apiAddRtsp(params)
    }

    // 第三步：处理响应
    if (res.code === 0) {
      ElMessage.success(isEditRtsp.value ? '编辑RTSP账号成功' : '添加RTSP账号成功')
      rtspDialogVisible.value = false // 关闭弹窗
      getRtspList() // 刷新列表
    } else {
      ElMessage.error(res.msg || (isEditRtsp.value ? '编辑失败' : '添加失败'))
    }
  } catch (err) {
    console.error(isEditRtsp.value ? '编辑RTSP失败' : '添加RTSP失败', err)
    ElMessage.error('操作失败，请重试')
  }
}

// 删除RTSP
const deleteRtsp = async (id) => {
  // 第一步：确认删除
  const confirm = await ElMessageBox.confirm(
    '确定要删除该RTSP账号吗？删除后不可恢复',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch(() => false)

  if (!confirm) return // 取消删除

  // 第二步：调用删除API
  try {
    const res = await apiDeleteRtsp(id)
    if (res.code === 0) {
      ElMessage.success('删除RTSP账号成功')
      getRtspList() // 刷新列表
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (err) {
    console.error('删除RTSP失败', err)
    ElMessage.error('删除失败，请重试')
  }
}

// H323-IP相关方法
const resetH323IpSearch = () => {
  h323IpSearchForm.value = { keyword: '', status: '全部' }
  getH323IpList()
}

const openAddH323IpDialog = () => {
  isEditH323Ip.value = false
  h323IpForm.value = { id: '', ipPort: '', name: '', gateway: '' }
  h323IpDialogVisible.value = true
  nextTick(() => {
    h323IpFormRef.value?.resetFields();
  });
}

const openEditH323IpDialog = (row) => {
  isEditH323Ip.value = true
  h323IpForm.value = {
    id: row.id,
    ipPort: row.ipPort,
    name: row.name,
    gateway: row.gateway
  };
  h323IpDialogVisible.value = true
  // 重置表单验证
  nextTick(() => {
    h323IpFormRef.value?.resetFields();
  });
}

const submitH323Ip = async () => {
  try {
    // 表单验证
    await h323IpFormRef.value.validate();
    
    // 构造请求参数
    const params = {
      uri: h323IpForm.value.ipPort, // IP地址和端口号对应后端contact字段
      display_name: h323IpForm.value.name,
      gw: h323IpForm.value.gateway,
      type: getProtocolType(currentProtocol.value, h323SubTab.value) // 获取当前类型
    };
    
    let res;
    if (isEditH323Ip.value) {
      // 编辑操作，添加id
      params.id = h323IpForm.value.id;
      res = await editH323DeviceApi(params);
    } else {
      // 添加操作
      res = await addH323DeviceApi(params);
    }
    
    // 处理响应
    if (res.code === 0) {
      ElMessage.success(isEditH323Ip.value ? '编辑成功' : '添加成功');
      h323IpDialogVisible.value = false;
      // 重新获取列表数据
      getH323IpList();
    } else {
      ElMessage.error(res.msg || (isEditH323Ip.value ? '编辑失败' : '添加失败'));
    }
  } catch (err) {
    // 表单验证失败不处理，已由element-plus提示
    if (err.name !== 'ValidationError') {
      console.error(isEditH323Ip.value ? '编辑H323-IP设备失败' : '添加H323-IP设备失败', err);
      ElMessage.error('操作失败，请重试');
    }
  }
};

const deleteH323Ip = async(id) => {
   try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const res = await deleteH323DeviceApi(id);
    
    if (res.code === 0) {
      ElMessage.success('删除成功');
      getH323IpList(); // 重新获取列表
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (err) {
    // 取消删除不提示
    if (err.toString() !== 'Cancel') {
      console.error('删除H323-IP设备失败', err);
      ElMessage.error('删除失败，请重试');
    }
  }
};

// H323-账号相关方法
const resetH323AccountSearch = () => {
  h323AccountSearchForm.value = { keyword: '', status: '全部' }
  getH323AccountList()
}

const openAddH323AccountDialog = () => {
  isEditH323Account.value = false
  h323AccountForm.value = { id: '', username: '', password: '', displayName: '', gateway: '' }
  h323AccountDialogVisible.value = true
  nextTick(() => {
    h323AccountFormRef.value?.resetFields();
  });
}

const openEditH323AccountDialog = (row) => {
  isEditH323Account.value = true
  h323AccountForm.value = {
    id: row.id,
    username: row.username,
    password: row.password,
    displayName: row.displayName,
    gateway: row.gateway
  };
  h323AccountDialogVisible.value = true
  nextTick(() => {
    h323AccountFormRef.value?.resetFields();
  });
}

const submitH323Account = async () => {
  try {
    await h323AccountFormRef.value.validate();
    
    const params = {
      username: h323AccountForm.value.username,
      display_name: h323AccountForm.value.displayName,
      gw: h323AccountForm.value.gateway,
      type: getProtocolType(currentProtocol.value, h323SubTab.value),
      auth_pwd: h323AccountForm.value.password
    };
    
    let res;
    if (isEditH323Account.value) {
      params.id = h323AccountForm.value.id;
      res = await editH323AccountApi(params);
    } else {
      res = await addH323AccountApi(params);
    }
    
    if (res.code === 0) {
      ElMessage.success(isEditH323Account.value ? '编辑成功' : '添加成功');
      h323AccountDialogVisible.value = false;
      getH323AccountList();
    } else {
      ElMessage.error(res.msg || (isEditH323Account.value ? '编辑失败' : '添加失败'));
    }
  } catch (err) {
    if (err.name !== 'ValidationError') {
      console.error(isEditH323Account.value ? '编辑H323账号失败' : '添加H323账号失败', err);
      ElMessage.error('操作失败，请重试');
    }
  }
};

const deleteH323Account = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该账号吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const res = await deleteH323AccountApi(id);
    
    if (res.code === 0) {
      ElMessage.success('删除成功');
      getH323AccountList();
    } else {
      ElMessage.error(res.msg || '删除失败');
    }
  } catch (err) {
    if (err.toString() !== 'Cancel') {
      console.error('删除H323账号失败', err);
      ElMessage.error('删除失败，请重试');
    }
  }
};

// 页面挂载时加载数据
onMounted(() => {
  console.log('页面挂载，加载SIP-IP直连数据')
  getDeviceList()
})

// 监听协议切换，加载对应数据
watch(currentProtocol, (newVal) => {
  pagination.value.page = 1
  if (newVal === 'sip') {
    getDeviceList()
  } else if (newVal === 'h323') {
    getH323IpList()
  } else if (newVal === 'rtsp') {
    getRtspList()
  } else if (newVal === 'gb28181') {
    getGbDeviceList()
  }
})

// 监听SIP子标签切换
watch(currentSubTab, (newVal) => {
  pagination.value.page = 1
  if (newVal === 'ip-direct') {
    console.log('切换到IP直连，加载数据')
    getDeviceList()
  } else {
    getAccountList()
  }
})

// 监听H323子标签切换
watch(h323SubTab, (newVal) => {
  pagination.value.page = 1
  if (newVal === 'h323-ip-direct') {
    getH323IpList()
  } else {
    getH323AccountList()
  }
})
</script>

<style scoped>
/* 1. 隐藏默认展开箭头 */
:deep(.el-table__expand-column) {
  padding: 0 !important;
}
:deep(.el-table__expand-column .cell) {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 40px !important;
}
:deep(.el-table__expand-column .el-icon) {
  display: none !important;
}

/* 2. 修复固定列样式 */
:deep(.el-table__fixed-right) {
  height: 100% !important;
  box-shadow: none !important;
}

/* 3. 表格主体布局 */
:deep(.el-table__body-wrapper) {
  overflow-x: visible !important;
}

/* 自定义加号样式（不变） */
.expand-icon {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  font-size: 16px !important;
  color: #409eff !important;
}
</style>