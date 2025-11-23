// 项目列表页面
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    projects: [],
    loading: true
  },

  onLoad() {
    this.loadProjects();
  },

  onShow() {
    // 每次显示时刷新列表
    this.loadProjects();
  },

  // 加载项目列表
  async loadProjects() {
    this.setData({ loading: true });
    
    try {
      const projects = await api.getProjects();
      
      // 处理项目数据
      const processedProjects = projects.map(project => ({
        ...project,
        game_type_name: util.getGameTypeName(project.game_type || ''),
        content_type_name: util.getContentTypeName(project.content_type || ''),
        created_at: util.formatDate(project.created_at, 'YYYY-MM-DD HH:mm')
      }));

      this.setData({
        projects: processedProjects,
        loading: false
      });
    } catch (error) {
      console.error('加载项目失败', error);
      this.setData({ loading: false });
      my.showToast({
        content: '加载失败，请重试',
        type: 'fail'
      });
    }
  },

  // 查看详情
  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    my.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 前往创建页面
  goToCreate() {
    my.switchTab({
      url: '/pages/create/create'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadProjects();
    my.stopPullDownRefresh();
  }
});
