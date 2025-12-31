import request from '@/utils/request'


/**
 * 获取SIP设备列表
 * @param {Object} params - 分页+筛选参数（page/perPage/keyword/status/type）
 */
export function getSipDeviceList(params) {
  return request({
    url: '/admin-api/agent/list',
    method: 'GET',
    // 修复：传递所有前端参数，而非手动固定
    params: {
      type: params.type || 'ipsip', // 保留默认值，同时支持前端传type覆盖
      page: params.page,
      'per-page': params.perPage, // 后端需要的per-page（axios会自动处理参数名）
      keyword: params.keyword,    // 补充：传递搜索关键词
      status: params.status       // 补充：传递状态筛选参数
    }
  })
}

/**
 * 添加SIP设备
 * @param {Object} data - 设备信息
 */
export function addSipDevice(data) {
  return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'ipsip' },
    data: data
  })
}

/**
 * 编辑SIP设备
 * @param {Object} data - 设备信息（含ID）
 */
export function editSipDevice(data) {
  return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'ipsip' },
    data: data
  })
}

/**
 * 删除SIP设备
 * @param {string/number} id - 设备ID
 */
export function deleteSipDevice(id) {
  return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: {
      type: 'ipsip',
      id: id
    }
  })
}

// SIP终端注册接口
export function getSipAccountList(params) {
  return request({ url: '/admin-api/agent/list', method: 'GET', params })
}
export function addSipAccount(data) {
  return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'regsip' },
    data: data
  })
}
export function editSipAccount(data) {
  return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'regsip' },
    data: data
  })
}
export function deleteSipAccount(id) {
  return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: {
      type: 'regsip',
      id: id
    }
  })
}

// H323IP直连接口
export function getH323IpListApi(params) {
  return request({ url: '/admin-api/agent/list', method: 'GET', params })
}
export function addH323DeviceApi(data) {
  return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'iph323' },
    data: data
  })
}
export function editH323DeviceApi(data) {
  return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'iph323' },
    data: data
  })
}

// 修复后：POST请求用data传参（参数放在请求体，而非URL）
export function deleteH323DeviceApi(id) { // 参数名改为id（更语义化）
  return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: { // 用data替代params，参数放在请求体
      type: 'iph323',
      id: id // 确保id是字符串
    }
  })
}

// H323终端注册接口
export function getH323AccountApi(params) {
  return request({ url: '/admin-api/agent/list', method: 'GET', params })
}
export function addH323AccountApi(data) {
    return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'regh323' },
    data: data
  })
}
export function editH323AccountApi(data) {
    return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'regh323' },
    data: data
  })
}
export function deleteH323AccountApi(id) {
    return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: {
      type: 'regh323',
      id: id
    }
  })
}

// RTSP接口
export function getRtspList(params) {
  return request({ url: '/admin-api/agent/list', method: 'GET', params })
}
export function addRtsp(data) {
      return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'rtsp' },
    data: data
  })
}
export function editRtsp(data) {
      return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'rtsp' },
    data: data
  })
}
export function deleteRtsp(id) {
  return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: {
      type: 'rtsp',
      id: id
    }
  })
}


// GB28181接口
export function getGb28181List(params) {
  return request({ url: '/admin-api/agent/list', method: 'GET', params })
}
export function getPlatformInfo() {
  return request({ url: '/admin-api/agent/platform-info', method: 'GET' })
}
export function addGb28181Device(data) {
        return request({
    url: '/admin-api/agent/create',
    method: 'POST',
    params: { type: 'gb28181' },
    data: data
  })
  return request({ url: '/admin-api/agent/create', method: 'POST', data })
}
export function editGb28181Device(data) {
        return request({
    url: '/admin-api/agent/update',
    method: 'POST',
    params: { type: 'gb28181' },
    data: data
  })
}
export function deleteGb28181Device(id) {
    return request({
    url: '/admin-api/agent/delete',
    method: 'POST',
    params: {
      type: 'gb28181',
      id: id
    }
  })
}

// GB28181通道

export function addGb28181Channel(data) {
  return request({ url: '/admin-api/agent/set-gb28181-subject', method: 'POST', data })
}
export function editGb28181Channel(data) {
  return request({ url: '/admin-api/agent/set-gb28181-subject', method: 'POST', data })
}
export function deleteGb28181Channel (data) {
  return request({ url: '/admin-api/agent/del-gb28181-subject', method: 'POST', data })
}