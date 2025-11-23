// 通用工具函数

/**
 * 格式化日期时间
 * @param {Date|String|Number} date - 日期对象
 * @param {String} format - 格式化模板
 * @returns {String}
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {Number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
function throttle(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {Number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
function debounce(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 深拷贝
 * @param {*} obj - 要拷贝的对象
 * @returns {*}
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 获取游戏类型显示名称
 * @param {String} type - 游戏类型代码
 * @returns {String}
 */
function getGameTypeName(type) {
  const types = {
    'rpg': '角色扮演游戏 (RPG)',
    'adventure': '冒险解谜',
    'action': '动作游戏',
    'strategy': '策略游戏',
    'simulation': '模拟经营',
    'horror': '恐怖惊悚',
    'sci-fi': '科幻太空',
    'fantasy': '奇幻魔法',
    'mystery': '悬疑推理',
    'romance': '恋爱养成'
  };
  return types[type] || type;
}

/**
 * 获取内容类型显示名称
 * @param {String} type - 内容类型代码
 * @returns {String}
 */
function getContentTypeName(type) {
  const types = {
    'worldview': '世界观设定',
    'story': '主线剧情',
    'quest': '支线任务',
    'character': '角色设定',
    'dialogue': '对话脚本',
    'item': '道具装备',
    'location': '场景地点',
    'full': '完整内容'
  };
  return types[type] || type;
}

/**
 * 获取 AI 模型显示名称
 * @param {String} model - AI 模型代码
 * @returns {String}
 */
function getAIModelName(model) {
  const models = {
    'gemini': 'Google Gemini 2.0 Flash',
    'gpt4o-mini': 'OpenAI GPT-4o-mini',
    'gpt4o': 'OpenAI GPT-4o',
    'claude': 'Anthropic Claude'
  };
  return models[model] || model;
}

/**
 * 截取字符串
 * @param {String} str - 原字符串
 * @param {Number} maxLength - 最大长度
 * @param {String} suffix - 后缀
 * @returns {String}
 */
function truncate(str, maxLength = 50, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + suffix;
}

/**
 * 验证表单
 * @param {Object} data - 表单数据
 * @param {Object} rules - 验证规则
 * @returns {Object} { valid: Boolean, message: String }
 */
function validateForm(data, rules) {
  for (let field in rules) {
    const rule = rules[field];
    const value = data[field];

    // 必填验证
    if (rule.required && (!value || value.trim() === '')) {
      return {
        valid: false,
        message: rule.message || `${field} 不能为空`
      };
    }

    // 最小长度验证
    if (rule.minLength && value && value.length < rule.minLength) {
      return {
        valid: false,
        message: rule.message || `${field} 长度不能少于 ${rule.minLength} 个字符`
      };
    }

    // 最大长度验证
    if (rule.maxLength && value && value.length > rule.maxLength) {
      return {
        valid: false,
        message: rule.message || `${field} 长度不能超过 ${rule.maxLength} 个字符`
      };
    }

    // 自定义验证函数
    if (rule.validator && typeof rule.validator === 'function') {
      const result = rule.validator(value);
      if (!result.valid) {
        return result;
      }
    }
  }

  return { valid: true };
}

module.exports = {
  formatDate,
  throttle,
  debounce,
  deepClone,
  getGameTypeName,
  getContentTypeName,
  getAIModelName,
  truncate,
  validateForm
};
