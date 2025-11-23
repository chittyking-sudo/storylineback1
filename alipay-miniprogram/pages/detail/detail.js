// 项目详情页面
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    project: null,
    loading: true,
    projectId: null
  },

  onLoad(query) {
    console.log('详情页加载', query);
    
    if (query.id) {
      this.setData({ projectId: query.id });
      this.loadProjectDetail(query.id);
    } else {
      this.setData({ loading: false });
      my.showToast({
        content: '项目ID缺失',
        type: 'fail'
      });
    }
  },

  // 加载项目详情
  async loadProjectDetail(id) {
    this.setData({ loading: true });

    try {
      const project = await api.getProjectDetail(id);
      
      // 处理项目数据
      const processedProject = {
        ...project,
        game_type_name: util.getGameTypeName(project.game_type || ''),
        content_type_name: util.getContentTypeName(project.content_type || ''),
        ai_model_name: util.getAIModelName(project.ai_model || ''),
        created_at: util.formatDate(project.created_at, 'YYYY-MM-DD HH:mm')
      };

      // 解析 JSON 字段
      if (typeof project.worldview === 'string') {
        try {
          processedProject.worldview = JSON.parse(project.worldview);
        } catch (e) {
          console.error('解析世界观数据失败', e);
        }
      }

      if (typeof project.characters === 'string') {
        try {
          processedProject.characters = JSON.parse(project.characters);
        } catch (e) {
          console.error('解析角色数据失败', e);
        }
      }

      this.setData({
        project: processedProject,
        loading: false
      });

    } catch (error) {
      console.error('加载项目详情失败', error);
      this.setData({ loading: false });
      
      my.showToast({
        content: '加载失败，请重试',
        type: 'fail',
        duration: 2000
      });
    }
  },

  // 复制主要内容
  copyContent() {
    const content = this.data.project?.content || 
                   this.data.project?.generated_content || '';
    
    if (!content) {
      my.showToast({
        content: '暂无内容',
        type: 'fail'
      });
      return;
    }

    my.setClipboard({
      text: content,
      success: () => {
        my.showToast({
          content: '已复制到剪贴板',
          type: 'success'
        });
      },
      fail: () => {
        my.showToast({
          content: '复制失败',
          type: 'fail'
        });
      }
    });
  },

  // 复制世界观
  copyWorldview() {
    const worldview = this.data.project?.worldview;
    
    if (!worldview) {
      my.showToast({
        content: '暂无世界观内容',
        type: 'fail'
      });
      return;
    }

    // 格式化世界观内容
    let text = `【世界观设定】\n\n`;
    text += `标题：${worldview.title || ''}\n\n`;
    if (worldview.history) text += `历史背景：\n${worldview.history}\n\n`;
    if (worldview.geography) text += `地理环境：\n${worldview.geography}\n\n`;
    if (worldview.culture) text += `文化体系：\n${worldview.culture}\n`;

    my.setClipboard({
      text: text,
      success: () => {
        my.showToast({
          content: '世界观已复制',
          type: 'success'
        });
      }
    });
  },

  // 分享项目
  shareProject() {
    const { project } = this.data;
    
    if (!project) return;

    // 准备分享内容
    const shareText = `【${project.name}】\n\n` +
                     `游戏类型：${project.game_type_name}\n` +
                     `内容类型：${project.content_type_name}\n\n` +
                     `使用「游戏内容生成器」小程序创建`;

    my.setClipboard({
      text: shareText,
      success: () => {
        my.showToast({
          content: '分享内容已复制，可粘贴发送给好友',
          type: 'success',
          duration: 2500
        });
      }
    });
  },

  // 导出项目
  async exportProject() {
    const { projectId } = this.data;
    
    if (!projectId) return;

    // 显示选择格式的对话框
    my.showActionSheet({
      title: '选择导出格式',
      items: ['JSON 格式', 'Markdown 格式'],
      success: async (res) => {
        const format = res.index === 0 ? 'json' : 'markdown';
        
        try {
          my.showLoading({ content: '导出中...' });
          
          const result = await api.exportProject(projectId, format);
          
          my.hideLoading();

          // 将导出内容复制到剪贴板
          let exportText = '';
          if (format === 'json') {
            exportText = JSON.stringify(result, null, 2);
          } else {
            exportText = result; // 后端已返回格式化的 markdown
          }

          my.setClipboard({
            text: exportText,
            success: () => {
              my.showToast({
                content: `已导出为 ${format.toUpperCase()} 格式并复制到剪贴板`,
                type: 'success',
                duration: 2500
              });
            }
          });

        } catch (error) {
          my.hideLoading();
          console.error('导出失败', error);
          my.showToast({
            content: '导出失败，请重试',
            type: 'fail'
          });
        }
      }
    });
  },

  // 返回列表
  goBack() {
    my.switchTab({
      url: '/pages/projects/projects'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.projectId) {
      this.loadProjectDetail(this.data.projectId);
    }
    my.stopPullDownRefresh();
  },

  // 分享到聊天
  onShareAppMessage() {
    const { project } = this.data;
    
    return {
      title: project ? `【${project.name}】游戏内容` : '游戏内容生成器',
      desc: project ? `${project.game_type_name} - ${project.content_type_name}` : '使用 AI 生成游戏内容',
      path: `/pages/detail/detail?id=${this.data.projectId}`
    };
  }
});
