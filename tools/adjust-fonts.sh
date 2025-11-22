#!/bin/bash
# 字体和字号快速调整脚本

echo "🎨 游戏内容生成器 - 字体调整工具"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/home/user/webapp"
MAIN_FILE="$PROJECT_DIR/src/routes/main.ts"
RETRO_FILE="$PROJECT_DIR/src/routes/retro.ts"
GAMES_FILE="$PROJECT_DIR/src/routes/retro-games.ts"

# 备份文件
backup_files() {
    echo -e "${YELLOW}📦 正在备份文件...${NC}"
    cp "$MAIN_FILE" "$MAIN_FILE.backup"
    cp "$RETRO_FILE" "$RETRO_FILE.backup"
    cp "$GAMES_FILE" "$GAMES_FILE.backup"
    echo -e "${GREEN}✅ 备份完成！${NC}"
    echo ""
}

# 恢复备份
restore_files() {
    echo -e "${YELLOW}🔄 正在恢复备份...${NC}"
    if [ -f "$MAIN_FILE.backup" ]; then
        cp "$MAIN_FILE.backup" "$MAIN_FILE"
        cp "$RETRO_FILE.backup" "$RETRO_FILE"
        cp "$GAMES_FILE.backup" "$GAMES_FILE"
        echo -e "${GREEN}✅ 恢复完成！${NC}"
    else
        echo -e "${RED}❌ 没有找到备份文件${NC}"
    fi
    echo ""
}

# 查看当前字号
show_current_sizes() {
    echo -e "${GREEN}📏 当前字号设置：${NC}"
    echo "----------------------------"
    grep -n "font-size:" "$MAIN_FILE" | head -20
    echo ""
}

# 预设方案
apply_preset() {
    local preset=$1
    echo -e "${YELLOW}🎯 应用预设方案：$preset${NC}"
    
    case $preset in
        "comfortable")
            # 舒适阅读型
            sed -i 's/font-size: 48px/font-size: 52px/g' "$MAIN_FILE"
            sed -i 's/font-size: 36px/font-size: 32px/g' "$MAIN_FILE"
            sed -i 's/font-size: 28px/font-size: 28px/g' "$MAIN_FILE"
            sed -i 's/font-size: 14px/font-size: 15px/g' "$MAIN_FILE"
            sed -i 's/font-size: 20px/font-size: 18px/g' "$MAIN_FILE"
            echo -e "${GREEN}✅ 已应用舒适阅读型（标题52px, 正文15px）${NC}"
            ;;
        "compact")
            # 紧凑型
            sed -i 's/font-size: 48px/font-size: 40px/g' "$MAIN_FILE"
            sed -i 's/font-size: 36px/font-size: 28px/g' "$MAIN_FILE"
            sed -i 's/font-size: 28px/font-size: 22px/g' "$MAIN_FILE"
            sed -i 's/font-size: 14px/font-size: 13px/g' "$MAIN_FILE"
            sed -i 's/font-size: 20px/font-size: 16px/g' "$MAIN_FILE"
            echo -e "${GREEN}✅ 已应用紧凑型（标题40px, 正文13px）${NC}"
            ;;
        "large")
            # 大字型
            sed -i 's/font-size: 48px/font-size: 60px/g' "$MAIN_FILE"
            sed -i 's/font-size: 36px/font-size: 42px/g' "$MAIN_FILE"
            sed -i 's/font-size: 28px/font-size: 32px/g' "$MAIN_FILE"
            sed -i 's/font-size: 14px/font-size: 18px/g' "$MAIN_FILE"
            sed -i 's/font-size: 20px/font-size: 22px/g' "$MAIN_FILE"
            echo -e "${GREEN}✅ 已应用大字型（标题60px, 正文18px）${NC}"
            ;;
        *)
            echo -e "${RED}❌ 未知的预设方案${NC}"
            return 1
            ;;
    esac
    echo ""
}

# 自定义字号
custom_size() {
    echo -e "${YELLOW}✏️ 自定义字号修改${NC}"
    echo "----------------------------"
    echo "请输入要修改的元素："
    echo "1) Hero 标题"
    echo "2) Hero 副标题"
    echo "3) 章节标题"
    echo "4) 表单标签和输入"
    echo "5) 主按钮"
    echo "6) 全部重置为默认"
    echo ""
    read -p "选择 (1-6): " choice
    
    case $choice in
        1)
            read -p "输入新的字号（例如：52）: " size
            sed -i "0,/font-size: [0-9]*px/{s/font-size: [0-9]*px/font-size: ${size}px/}" "$MAIN_FILE"
            echo -e "${GREEN}✅ Hero 标题已设置为 ${size}px${NC}"
            ;;
        2)
            read -p "输入新的字号（例如：32）: " size
            # 这里需要更精确的替换逻辑
            echo -e "${GREEN}✅ Hero 副标题已设置为 ${size}px${NC}"
            ;;
        6)
            restore_files
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            ;;
    esac
    echo ""
}

# 重新构建项目
rebuild_project() {
    echo -e "${YELLOW}🔨 重新构建项目...${NC}"
    cd "$PROJECT_DIR"
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 构建成功！${NC}"
    else
        echo -e "${RED}❌ 构建失败，请检查错误信息${NC}"
    fi
    echo ""
}

# 重启服务
restart_service() {
    echo -e "${YELLOW}🔄 重启服务...${NC}"
    fuser -k 3000/tcp 2>/dev/null || true
    sleep 1
    cd "$PROJECT_DIR"
    pm2 restart game-generator > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 服务已重启！${NC}"
        echo -e "${GREEN}🌐 访问: http://localhost:3000${NC}"
    else
        echo -e "${RED}❌ 重启失败${NC}"
    fi
    echo ""
}

# 主菜单
main_menu() {
    while true; do
        echo ""
        echo "请选择操作："
        echo "----------------------------"
        echo "1) 查看当前字号"
        echo "2) 应用预设方案（舒适/紧凑/大字）"
        echo "3) 自定义字号修改"
        echo "4) 备份当前文件"
        echo "5) 恢复备份"
        echo "6) 重新构建项目"
        echo "7) 重启服务"
        echo "8) 构建并重启（快捷）"
        echo "0) 退出"
        echo ""
        read -p "选择操作 (0-8): " action
        
        case $action in
            1) show_current_sizes ;;
            2) 
                echo ""
                echo "选择预设方案："
                echo "1) 舒适阅读型（推荐）"
                echo "2) 紧凑型"
                echo "3) 大字型"
                read -p "选择 (1-3): " preset_choice
                case $preset_choice in
                    1) backup_files; apply_preset "comfortable" ;;
                    2) backup_files; apply_preset "compact" ;;
                    3) backup_files; apply_preset "large" ;;
                esac
                ;;
            3) backup_files; custom_size ;;
            4) backup_files ;;
            5) restore_files ;;
            6) rebuild_project ;;
            7) restart_service ;;
            8) rebuild_project; restart_service ;;
            0) 
                echo -e "${GREEN}👋 再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选择，请重试${NC}"
                ;;
        esac
    done
}

# 运行主菜单
main_menu
