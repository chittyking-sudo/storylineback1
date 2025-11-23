// 创建页面
const api = require('../../utils/api.js');

Page({
  data: {
    // 表单数据
    formData: {
      name: '',
      game_type: '',
      content_type: '',
      description: '',
      ai_model: 'gemini'
    },
    
    // 游戏类型列表
    gameTypes: [
      { value: 'rpg', name: '角色扮演游戏 (RPG)' },
      { value: 'adventure', name: '冒险解谜' },
      { value: 'action', name: '动作游戏' },
      { value: 'strategy', name: '策略游戏' },
      { value: 'simulation', name: '模拟经营' },
      { value: 'horror', name: '恐怖惊悚' },
      { value: 'sci-fi', name: '科幻太空' },
      { value: 'fantasy', name: '奇幻魔法' },
      { value: 'mystery', name: '悬疑推理' },
      { value: 'romance', name: '恋爱养成' }
    ],
    gameTypeIndex: -1,
    
    // 内容类型列表
    contentTypes: [
      { value: 'worldview', name: '世界观设定' },
      { value: 'story', name: '主线剧情' },
      { value: 'quest', name: '支线任务' },
      { value: 'character', name: '角色设定' },
      { value: 'dialogue', name: '对话脚本' },
      { value: 'item', name: '道具装备' },
      { value: 'location', name: '场景地点' },
      { value: 'full', name: '完整内容(世界观+剧情+角色)' }
    ],
    contentTypeIndex: -1,
    
    // AI 模型列表
    aiModels: [
      { value: 'gemini', name: 'Google Gemini 2.0 Flash', desc: '推荐使用 - 免费且效果好' },
      { value: 'gpt4o-mini', name: 'OpenAI GPT-4o-mini', desc: '快速生成，质量稳定' },
      { value: 'gpt4o', name: 'OpenAI GPT-4o', desc: '最高质量，生成速度较慢' },
      { value: 'claude', name: 'Anthropic Claude', desc: '创意性强，适合故事创作' }
    ],
    aiModelIndex: 0, // 默认选中 Gemini
    
    // 状态
    loading: false,
    errorMessage: '',
    successMessage: ''
  },

  onLoad(query) {
    console.log('创建页面加载', query);
  },

  onShow() {
    // 清空上次的提示信息
    this.setData({
      errorMessage: '',
      successMessage: ''
    });
  },

  // 输入框变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 游戏类型选择
  onGameTypeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      gameTypeIndex: index,
      'formData.game_type': this.data.gameTypes[index].value
    });
  },

  // 内容类型选择
  onContentTypeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      contentTypeIndex: index,
      'formData.content_type': this.data.contentTypes[index].value
    });
  },

  // AI 模型选择
  onAIModelChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      aiModelIndex: index,
      'formData.ai_model': this.data.aiModels[index].value
    });
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data;
    
    if (!formData.name || formData.name.trim() === '') {
      return { valid: false, message: '请输入项目名称' };
    }

    if (formData.name.trim().length < 2) {
      return { valid: false, message: '项目名称至少需要2个字符' };
    }

    if (!formData.game_type) {
      return { valid: false, message: '请选择游戏类型' };
    }

    if (!formData.content_type) {
      return { valid: false, message: '请选择内容类型' };
    }

    if (!formData.ai_model) {
      return { valid: false, message: '请选择 AI 模型' };
    }

    return { valid: true };
  },

  // 表单提交
  async handleSubmit(e) {
    // 清空之前的提示
    this.setData({
      errorMessage: '',
      successMessage: ''
    });

    // 表单验证
    const validation = this.validateForm();
    if (!validation.valid) {
      this.setData({
        errorMessage: validation.message
      });
      my.showToast({
        content: validation.message,
        type: 'fail',
        duration: 2000
      });
      return;
    }

    // 确认提交
    const confirm = await this.showConfirm();
    if (!confirm) return;

    // 开始生成
    this.setData({ loading: true });

    try {
      // 准备提交数据
      const submitData = {
        name: this.data.formData.name.trim(),
        game_type: this.data.formData.game_type,
        content_type: this.data.formData.content_type,
        description: this.data.formData.description.trim(),
        ai_model: this.data.formData.ai_model
      };

      console.log('提交数据:', submitData);

      // 调用 API
      const result = await api.createProject(submitData);

      console.log('生成结果:', result);

      // 生成成功
      this.setData({
        loading: false,
        successMessage: '内容生成成功！正在跳转...'
      });

      my.showToast({
        content: '生成成功！',
        type: 'success',
        duration: 1500
      });

      // 跳转到详情页
      setTimeout(() => {
        if (result.project && result.project.id) {
          my.redirectTo({
            url: `/pages/detail/detail?id=${result.project.id}`
          });
        } else {
          // 如果没有返回 ID，跳转到项目列表
          my.switchTab({
            url: '/pages/projects/projects'
          });
        }
      }, 1500);

    } catch (error) {
      console.error('生成失败:', error);
      
      this.setData({
        loading: false,
        errorMessage: error.message || '生成失败，请重试'
      });

      my.showToast({
        content: '生成失败，请重试',
        type: 'fail',
        duration: 2000
      });
    }
  },

  // 显示确认对话框
  showConfirm() {
    return new Promise((resolve) => {
      my.confirm({
        title: '确认生成',
        content: `即将使用 ${this.data.aiModels[this.data.aiModelIndex].name} 生成内容，预计需要 30-60 秒，是否继续？`,
        confirmButtonText: '开始生成',
        cancelButtonText: '取消',
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  },

  // 重置表单
  resetForm() {
    this.setData({
      formData: {
        name: '',
        game_type: '',
        content_type: '',
        description: '',
        ai_model: 'gemini'
      },
      gameTypeIndex: -1,
      contentTypeIndex: -1,
      aiModelIndex: 0,
      errorMessage: '',
      successMessage: ''
    });
  }
});
