// API 请求工具 - 封装 my.request
const app = getApp();

/**
 * HTTP 请求封装
 * @param {Object} options - 请求配置
 * @returns {Promise}
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      showLoading = true,
      loadingText = '加载中...'
    } = options;

    // 拼接完整 URL
    const fullUrl = url.startsWith('http') ? url : `${app.globalData.apiBase}${url}`;

    // 显示加载提示
    if (showLoading) {
      my.showLoading({
        content: loadingText,
        delay: 0
      });
    }

    my.request({
      url: fullUrl,
      method: method,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        ...header
      },
      dataType: 'json',
      success: (res) => {
        if (showLoading) {
          my.hideLoading();
        }

        // 检查 HTTP 状态码
        if (res.status === 200 || res.status === 201) {
          resolve(res.data);
        } else {
          const error = new Error(`HTTP ${res.status}: ${res.statusText || '请求失败'}`);
          error.statusCode = res.status;
          reject(error);
        }
      },
      fail: (err) => {
        if (showLoading) {
          my.hideLoading();
        }

        console.error('请求失败', err);
        
        // 显示错误提示
        my.showToast({
          content: '网络请求失败，请检查网络连接',
          type: 'fail',
          duration: 2000
        });

        reject(err);
      }
    });
  });
}

/**
 * GET 请求
 */
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

/**
 * POST 请求
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * PUT 请求
 */
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

/**
 * DELETE 请求
 */
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  del
};
