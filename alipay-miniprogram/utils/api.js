// API 接口定义
const { get, post } = require('./request.js');

/**
 * 获取所有项目列表
 */
function getProjects() {
  return get('/api/projects');
}

/**
 * 获取项目详情
 * @param {Number} id - 项目 ID
 */
function getProjectDetail(id) {
  return get(`/api/projects/${id}`);
}

/**
 * 创建新项目并生成内容
 * @param {Object} data - 项目数据
 * @param {String} data.name - 项目名称
 * @param {String} data.game_type - 游戏类型
 * @param {String} data.content_type - 内容类型
 * @param {String} data.description - 详细描述
 * @param {String} data.ai_model - AI 模型
 */
function createProject(data) {
  return post('/api/generate', data, {
    showLoading: true,
    loadingText: 'AI 正在生成内容...'
  });
}

/**
 * 导出项目
 * @param {Number} id - 项目 ID
 * @param {String} format - 导出格式 (json/markdown)
 */
function exportProject(id, format = 'json') {
  return get(`/api/projects/${id}/export?format=${format}`);
}

/**
 * 健康检查
 */
function healthCheck() {
  return get('/api/health', {}, { showLoading: false });
}

module.exports = {
  getProjects,
  getProjectDetail,
  createProject,
  exportProject,
  healthCheck
};
