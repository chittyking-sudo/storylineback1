// Frontend JavaScript for Multi-Agent Game Generator

const API_BASE = '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  
  document.getElementById('generateForm').addEventListener('submit', handleGenerate);
});

/**
 * Handle form submission to generate new project
 */
async function handleGenerate(e) {
  e.preventDefault();
  
  const projectName = document.getElementById('projectName').value;
  const gameType = document.getElementById('gameType').value;
  const theme = document.getElementById('theme').value;
  const characterCount = parseInt(document.getElementById('characterCount').value);
  const generateDialogues = document.getElementById('generateDialogues').checked;
  
  // Show loading state
  document.getElementById('loadingState').classList.add('active');
  
  try {
    const response = await axios.post(`${API_BASE}/generate`, {
      projectName,
      gameType,
      theme,
      characterCount,
      generateDialogues
    });
    
    // Hide loading state
    document.getElementById('loadingState').classList.remove('active');
    
    if (response.data.success) {
      alert(`✅ 生成成功！\n\n项目 ID: ${response.data.projectId}\n耗时: ${(response.data.totalDuration / 1000).toFixed(2)}秒\nToken 消耗: ${response.data.totalTokens}`);
      
      // Reset form
      document.getElementById('generateForm').reset();
      
      // Reload projects list
      loadProjects();
      
      // Open project details
      setTimeout(() => {
        viewProject(response.data.projectId);
      }, 500);
    } else {
      alert('⚠️ 生成部分失败\n\n错误:\n' + response.data.errors.join('\n'));
      loadProjects();
    }
  } catch (error) {
    document.getElementById('loadingState').classList.remove('active');
    console.error('Generation error:', error);
    alert('❌ 生成失败: ' + (error.response?.data?.error || error.message));
  }
}

/**
 * Load and display projects list
 */
async function loadProjects() {
  try {
    const response = await axios.get(`${API_BASE}/projects`);
    const projects = response.data.projects;
    
    const container = document.getElementById('projectsList');
    
    if (projects.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-8">暂无项目，创建第一个项目吧！</p>';
      return;
    }
    
    container.innerHTML = projects.map(project => `
      <div class="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition cursor-pointer"
           onclick="viewProject(${project.id})">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-xl font-bold text-gray-800">${escapeHtml(project.name)}</h3>
            <p class="text-sm text-gray-500 mt-1">
              <i class="fas fa-gamepad mr-1"></i> ${escapeHtml(project.game_type || '未知类型')}
            </p>
          </div>
          <span class="status-${project.status} font-semibold text-sm px-3 py-1 rounded-full bg-gray-100">
            ${getStatusText(project.status)}
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-3">${escapeHtml(project.theme || '')}</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span><i class="far fa-clock mr-1"></i> ${formatDate(project.created_at)}</span>
          <div class="space-x-3">
            <button onclick="event.stopPropagation(); viewProject(${project.id})"
                    class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-eye"></i> 查看
            </button>
            <button onclick="event.stopPropagation(); exportProject(${project.id})"
                    class="text-green-600 hover:text-green-800">
              <i class="fas fa-download"></i> 导出
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Load projects error:', error);
    document.getElementById('projectsList').innerHTML = 
      '<p class="text-red-500 text-center py-8">加载失败</p>';
  }
}

/**
 * View project details in a modal
 */
async function viewProject(projectId) {
  try {
    const response = await axios.get(`${API_BASE}/projects/${projectId}`);
    const data = response.data;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    
    let content = `
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-3xl font-bold text-gray-800">${escapeHtml(data.project.name)}</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <p><strong>游戏类型:</strong> ${escapeHtml(data.project.game_type)}</p>
          <p><strong>主题:</strong> ${escapeHtml(data.project.theme)}</p>
          <p><strong>状态:</strong> <span class="status-${data.project.status}">${getStatusText(data.project.status)}</span></p>
        </div>
    `;
    
    // Worldview
    if (data.worldviews.length > 0) {
      const wv = data.worldviews[0];
      content += `
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-purple-600 mb-4">
            <i class="fas fa-globe mr-2"></i>世界观
          </h3>
          <div class="bg-purple-50 rounded-lg p-6 space-y-4">
            <h4 class="text-xl font-semibold">${escapeHtml(wv.title)}</h4>
            ${wv.history ? `<div><strong class="text-purple-700">历史:</strong><p class="mt-1">${escapeHtml(wv.history)}</p></div>` : ''}
            ${wv.geography ? `<div><strong class="text-purple-700">地理:</strong><p class="mt-1">${escapeHtml(wv.geography)}</p></div>` : ''}
            ${wv.culture ? `<div><strong class="text-purple-700">文化:</strong><p class="mt-1">${escapeHtml(wv.culture)}</p></div>` : ''}
            ${wv.lore ? `<div><strong class="text-purple-700">传说:</strong><p class="mt-1">${escapeHtml(wv.lore)}</p></div>` : ''}
          </div>
        </div>
      `;
    }
    
    // Storylines
    if (data.storylines.length > 0) {
      content += `
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-blue-600 mb-4">
            <i class="fas fa-book-open mr-2"></i>剧情
          </h3>
          ${data.storylines.map(sl => `
            <div class="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 class="text-xl font-semibold mb-2">${escapeHtml(sl.title)}</h4>
              ${sl.summary ? `<p class="mb-3"><strong class="text-blue-700">概要:</strong> ${escapeHtml(sl.summary)}</p>` : ''}
              ${sl.acts ? `<p class="mb-3"><strong class="text-blue-700">分幕:</strong> ${escapeHtml(sl.acts)}</p>` : ''}
              ${sl.conflicts ? `<p><strong class="text-blue-700">冲突:</strong> ${escapeHtml(sl.conflicts)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Characters
    if (data.characters.length > 0) {
      content += `
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-green-600 mb-4">
            <i class="fas fa-users mr-2"></i>角色 (${data.characters.length})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${data.characters.map(char => `
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold mb-2">${escapeHtml(char.name)} <span class="text-sm text-green-700">(${escapeHtml(char.role || '')})</span></h4>
                ${char.personality ? `<p class="text-sm mb-2"><strong>性格:</strong> ${escapeHtml(char.personality)}</p>` : ''}
                ${char.background ? `<p class="text-sm"><strong>背景:</strong> ${escapeHtml(char.background)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Dialogues
    if (data.dialogues.length > 0) {
      content += `
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-orange-600 mb-4">
            <i class="fas fa-comments mr-2"></i>对话示例
          </h3>
          ${data.dialogues.map(dlg => `
            <div class="bg-orange-50 rounded-lg p-4 mb-4">
              <h4 class="text-lg font-semibold mb-3">${escapeHtml(dlg.scene_name || '场景')}</h4>
              <div class="space-y-2">
                ${formatDialogues(dlg.content)}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    content += `
        <div class="flex justify-end space-x-4 mt-8">
          <button onclick="exportProject(${projectId}, 'json')"
                  class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-file-code mr-2"></i>导出 JSON
          </button>
          <button onclick="exportProject(${projectId}, 'markdown')"
                  class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            <i class="fas fa-file-alt mr-2"></i>导出 Markdown
          </button>
        </div>
      </div>
    `;
    
    modal.innerHTML = content;
    document.body.appendChild(modal);
  } catch (error) {
    console.error('View project error:', error);
    alert('加载项目详情失败: ' + error.message);
  }
}

/**
 * Export project
 */
async function exportProject(projectId, format = 'json') {
  try {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/export?format=${format}`, {
      responseType: format === 'json' ? 'json' : 'blob'
    });
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `project-${projectId}.json`);
    } else {
      downloadBlob(response.data, `project-${projectId}.md`);
    }
  } catch (error) {
    console.error('Export error:', error);
    alert('导出失败: ' + error.message);
  }
}

/**
 * Helper functions
 */
function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN');
}

function getStatusText(status) {
  const map = {
    'draft': '草稿',
    'generating': '生成中',
    'completed': '已完成',
    'failed': '失败',
    'partial': '部分完成'
  };
  return map[status] || status;
}

function formatDialogues(content) {
  try {
    const dialogues = JSON.parse(content);
    return dialogues.map(d => `
      <div class="border-l-4 border-orange-400 pl-4 py-2">
        <p class="text-gray-800">${escapeHtml(d.text)}</p>
        <p class="text-xs text-gray-500 mt-1">
          <span class="font-semibold">${escapeHtml(d.emotion || 'neutral')}</span>
          ${d.action ? ` • ${escapeHtml(d.action)}` : ''}
        </p>
      </div>
    `).join('');
  } catch (e) {
    return `<p class="text-gray-800">${escapeHtml(content)}</p>`;
  }
}
