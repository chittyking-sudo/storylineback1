// 游戏内容生成器 - 支付宝小程序
App({
  globalData: {
    // API 基础地址（部署后需修改为实际地址）
    apiBase: 'https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai',
    // 用户信息
    userInfo: null,
    // 项目列表缓存
    projectsCache: null,
    cacheTime: null
  },

  onLaunch(options) {
    console.log('小程序启动', options);
    
    // 获取系统信息
    my.getSystemInfo({
      success: (res) => {
        console.log('系统信息', res);
        this.globalData.systemInfo = res;
      }
    });

    // 检查更新
    this.checkUpdate();
  },

  onShow(options) {
    console.log('小程序显示', options);
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(error) {
    console.error('小程序错误', error);
    my.showToast({
      content: '程序出错，请重试',
      type: 'fail'
    });
  },

  // 检查小程序更新
  checkUpdate() {
    if (my.canIUse('getUpdateManager')) {
      const updateManager = my.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });

      updateManager.onUpdateReady(() => {
        my.confirm({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.log('新版本下载失败');
      });
    }
  },

  // 全局方法：显示加载提示
  showLoading(title = '加载中...') {
    my.showLoading({
      content: title,
      delay: 0
    });
  },

  // 全局方法：隐藏加载提示
  hideLoading() {
    my.hideLoading();
  },

  // 全局方法：显示消息提示
  showToast(content, type = 'none') {
    my.showToast({
      content: content,
      type: type,
      duration: 2000
    });
  },

  // 全局方法：显示确认对话框
  showConfirm(options) {
    return new Promise((resolve) => {
      my.confirm({
        title: options.title || '提示',
        content: options.content || '',
        confirmButtonText: options.confirmText || '确定',
        cancelButtonText: options.cancelText || '取消',
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  }
});
