// 首页
const api = require('../../utils/api.js');

Page({
  data: {
    projectCount: 0
  },

  onLoad(query) {
    console.log('首页加载', query);
    this.loadProjectCount();
  },

  onShow() {
    // 每次显示时刷新项目数量
    this.loadProjectCount();
  },

  // 加载项目数量
  async loadProjectCount() {
    try {
      const projects = await api.getProjects();
      this.setData({
        projectCount: projects.length || 0
      });
    } catch (error) {
      console.error('加载项目数量失败', error);
    }
  },

  // 前往创建页面
  goToCreate() {
    my.switchTab({
      url: '/pages/create/create'
    });
  },

  // 前往项目列表页面
  goToProjects() {
    my.switchTab({
      url: '/pages/projects/projects'
    });
  },

  // 打开 GitHub
  openGitHub() {
    my.confirm({
      title: '提示',
      content: '即将打开 GitHub 页面',
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 支付宝小程序无法直接打开外部链接
          // 可以复制链接到剪贴板
          my.setClipboard({
            text: 'https://github.com/chittyking-sudo/storylineback1',
            success: () => {
              my.showToast({
                content: 'GitHub 链接已复制',
                type: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 检查服务健康状态
  async checkHealth() {
    try {
      my.showLoading({ content: '检查中...' });
      const result = await api.healthCheck();
      my.hideLoading();
      
      my.alert({
        title: '服务状态',
        content: `服务运行正常\n状态: ${result.status || 'ok'}`,
        buttonText: '确定'
      });
    } catch (error) {
      my.hideLoading();
      my.alert({
        title: '服务异常',
        content: '无法连接到服务器，请稍后重试',
        buttonText: '确定'
      });
    }
  },

  onPullDownRefresh() {
    this.loadProjectCount();
    my.stopPullDownRefresh();
  }
});
