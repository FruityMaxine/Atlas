/**
 * 侧边栏组件。
 *
 * 结构：
 * - 顶部 Logo 区
 * - 主导航（首页、组件演示、系统设置）
 * - 模块导航（动态模块 + 调试页面）
 * - 底部版权信息
 */

import { Home, Palette, Settings, Zap, Rocket, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../contexts/SettingsContext';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { useModuleRegistry } from '../../../core/ModuleRegistry';
import { getIcon } from '../../../utils/iconMapper';
import './Sidebar.css';

interface SidebarProps {
  currentPage: string;
  onNavigate: (pageId: string) => void;
}

interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
  color?: string;
}

const NavButton = ({
  item,
  isSelected,
  onClick,
  isModule = false,
}: {
  item: NavItem;
  isSelected: boolean;
  onClick: () => void;
  isModule?: boolean;
}) => {
  const IconComponent = item.icon;

  const dynamicStyle = isSelected && isModule && item.color ? { borderColor: item.color } : {};

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        opacity: { duration: 0.3 },
        x: { duration: 0.3 },
        layout: { duration: 0.3, ease: 'easeInOut' },
      }}
      className={`atlas-sidebar-nav-btn cursor-target ${isSelected ? 'active' : ''} ${
        isModule ? 'module-active' : ''
      }`}
      onClick={onClick}
      style={dynamicStyle}
    >
      <IconComponent size={20} />
      <span className="atlas-sidebar-nav-text">{item.name}</span>
    </motion.div>
  );
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const { enableComponentPage } = useSettings();
  const { modules } = useModuleRegistry();

  const sortedModules = [...modules].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="atlas-sidebar">
      <div className="atlas-sidebar-logo-container">
        <h1 className="atlas-sidebar-logo">
          <Zap size={28} />
          Atlas
        </h1>
        <p className="atlas-sidebar-version">{t('sidebar.version', '工作台 v1.1')}</p>
      </div>

      <LayoutGroup>
        <motion.div layout="position" className="atlas-sidebar-nav-group">
          <NavButton
            key="home"
            item={{ id: 'home', name: t('sidebar.home', '首页'), icon: Home }}
            isSelected={currentPage === 'home'}
            onClick={() => onNavigate('home')}
          />

          <AnimatePresence mode="popLayout">
            {enableComponentPage && (
              <NavButton
                key="components"
                item={{ id: 'components', name: t('sidebar.components', '组件演示'), icon: Palette }}
                isSelected={currentPage === 'components'}
                onClick={() => onNavigate('components')}
              />
            )}
          </AnimatePresence>

          <NavButton
            key="settings"
            item={{ id: 'settings', name: t('sidebar.settings', '系统设置'), icon: Settings }}
            isSelected={currentPage === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </motion.div>

        <motion.div
          layout="position"
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
          className="atlas-sidebar-divider"
        />

        <motion.p
          layout="position"
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
          className="atlas-sidebar-module-title"
        >
          {t('sidebar.modules', '模块')}
        </motion.p>

        <motion.div
          layout="position"
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
          className="atlas-sidebar-nav-group"
        >
          {sortedModules.map((module) => {
            const Icon = getIcon(module.icon) || Zap;
            const moduleId = `module-${module.id}`;
            const colorMap: Record<string, string> = {
              'crawler-example': '#3B82F6',
              FapelloDownloader: '#8B5CF6',
            };
            const color = colorMap[module.id] || '#10B981';

            return (
              <NavButton
                key={module.id}
                item={{ id: moduleId, name: module.name, icon: Icon, color }}
                isModule={true}
                isSelected={currentPage === moduleId}
                onClick={() => onNavigate(moduleId)}
              />
            );
          })}

          <NavButton
            key="moduleTest"
            item={{ id: 'moduleTest', name: '模块测试中心', icon: Rocket, color: '#F59E0B' }}
            isModule={true}
            isSelected={currentPage === 'moduleTest'}
            onClick={() => onNavigate('moduleTest')}
          />
        </motion.div>

        <motion.div
          layout="position"
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
          className="atlas-sidebar-footer"
        >
          <p className="atlas-sidebar-copyright">
            {t('sidebar.copyright', '© 2026 Atlas')}
            <br />
            {t('sidebar.allRightsReserved', '保留所有权利')}
          </p>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}

export default Sidebar;
