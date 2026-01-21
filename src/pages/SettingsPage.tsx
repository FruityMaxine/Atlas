/**
 * 设置页面组件 - 使用 UI 组件库
 */


import { Settings, Bell, Download, Save, Folder, FolderOpen, Hammer, RefreshCw, Plug, AlertCircle, XCircle, Info } from 'lucide-react';
import {
    Toggle,
    Input,
    Select,
    Button,
    Slider,
    SegmentedControl,
    SettingCard,
    SettingItem
} from '../components/ui';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../contexts/SettingsContext';  // 导入 useSettings Hook
import { useTranslation } from 'react-i18next';  // 导入 useTranslation Hook

export default function SettingsPage() {  // 不再需要 props
    // ===== 主题管理 =====
    const { theme, changeTheme } = useTheme();

    // ===== 设置管理（使用 Context，一次性获取所有设置） =====
    const {
        // 系统设置
        mouseAnimation, setMouseAnimation,
        language, setLanguage,
        autoStart, setAutoStart,
        silentStart, setSilentStart,
        // 基础设置 - 通知
        enableNotification, setEnableNotification,
        soundEnabled, setSoundEnabled,
        // 基础设置 - 下载
        downloadPath, setDownloadPath,
        maxConcurrent, setMaxConcurrent,
        // 基础设置 - 备份
        autoBackup, setAutoBackup,
        backupInterval, setBackupInterval,
        // 基础设置 - 清理
        autoClean, setAutoClean,
        cleanInterval, setCleanInterval,
        cleanSize, setCleanSize,
    } = useSettings();  // 只调用一次 useSettings()！

    // ===== 翻译 Hook =====
    const { t } = useTranslation();  // 获取翻译函数

    // ===== 分割线组件 =====


    return (
        <div style={{
            padding: '60px',
            maxWidth: '1400px',
            margin: '0 auto',
        }}>
            {/* ===== 页面标题 ===== */}
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{
                    fontSize: '48px',
                    marginBottom: '12px',
                    background: 'var(--text-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '700',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Settings size={48} />
                        {t('settings.title', '系统设置')}
                    </div>
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#9CA3AF',
                }}>
                    {t('settings.description', '自定义您的工作环境和偏好设置')}
                </p>
            </div>
            <div style={{
                columns: '350px 3',           // 两列
                columnGap: '12px',        // 列间距
            }}>

                {/* ===== 系统设置 ===== */}
                <SettingCard title={t('settings.systemSettings', '系统设置')} icon={Settings}>
                    <SegmentedControl
                        label={t('settings.themeSelect', '主题选择')}
                        value={theme}
                        onChange={(value) => changeTheme(value as 'light' | 'dark' | 'auto')}
                        options={[
                            { value: 'auto', label: t('settings.themeAuto', '跟随系统') },
                            { value: 'light', label: t('settings.themeLight', '浅色') },
                            { value: 'dark', label: t('settings.themeDark', '深色') },
                        ]}
                    />
                    <Select
                        label={t('settings.language', '语言/Language')}
                        value={language}
                        onChange={setLanguage}
                        options={[
                            { value: 'zh-CN', label: t('settings.languageZhCN', '简体中文') },
                            { value: 'en-US', label: t('settings.languageEnUS', 'English') },
                            { value: 'lol-US', label: t('settings.languageLolUS', 'LOLCAT') },
                            { value: 'en-UD', label: t('settings.languageEnUD', 'uʍo◖ ǝpısd∩') },
                            { value: 'tlh', label: t('settings.languageTlh', 'tlhIngan Hol') },
                        ]}
                    />
                    <Toggle
                        checked={mouseAnimation}
                        onChange={setMouseAnimation}
                        label={t('settings.mouseAnimation', '鼠标动画')}
                        description={t('settings.mouseAnimationDesc', '鼠标移动时的动画效果')}
                    />
                    <Toggle
                        checked={autoStart}
                        onChange={setAutoStart}
                        label={t('settings.autoStart', '开机自启')}
                    />
                    <Toggle
                        checked={silentStart}
                        onChange={setSilentStart}
                        disabled={!autoStart}
                        label={t('settings.silentStart', '静默启动')}
                        description={t('settings.silentStartDesc', '开机自启且不显示界面')}
                    />
                </SettingCard>

                {/* ===== 基础设置 ===== */}
                {/* <Divider label="基础设置" /> */}

                <SettingCard title={t('settings.BasicSettings', '基础设置')} icon={Bell}>
                    <Toggle
                        checked={enableNotification}
                        onChange={setEnableNotification}
                        label={t('settings.enableNotification', '启用通知')}
                        description={t('settings.enableNotificationDesc', '接收任务完成和系统提醒')}
                    />
                    <Toggle
                        checked={soundEnabled}
                        onChange={setSoundEnabled}
                        label={t('settings.soundEnabled', '声音提示')}
                        description={t('settings.soundEnabledDesc', '播放通知声音')}
                    />
                    <Input
                        label={t('settings.defaultDownloadPath', '默认下载路径')}
                        value={downloadPath}
                        onChange={setDownloadPath}
                        placeholder="./downloads"
                        description={t('settings.defaultDownloadPathDesc', '所有模块的默认下载目录')}
                    />
                    <Select
                        label={t('settings.maxConcurrent', '最大并发数')}
                        value={maxConcurrent}
                        onChange={setMaxConcurrent}
                        options={[
                            { value: '1', label: t('settings.oneConcurrent', '1 个任务') },
                            { value: '3', label: t('settings.threeConcurrent', '3 个任务（推荐）') },
                            { value: '5', label: t('settings.fiveConcurrent', '5 个任务') },
                            { value: '10', label: t('settings.tenConcurrent', '10 个任务') },
                        ]}
                        description={t('settings.maxConcurrentDesc', '同时下载的任务数量')}
                    />
                    <SettingItem
                        label={t('settings.TempFile', '临时文件')}
                        description={t('settings.fileManagementDesc', '点击查看更多配置选项')}
                        icon={Hammer}
                        modalTitle={t('settings.TempFileModalTitle', '临时文件')}
                    >
                        <div style={{ color: 'var(--text-primary)' }}>
                            <p style={{ marginBottom: '16px', color: '#9CA3AF' }}>
                                {t('settings.TempFileModalDesc', '设置临时文件清理策略')}
                            </p>
                            <Slider
                                label={t('settings.TempFileModalSliderLabel', '临时文件清理策略')}
                                value={cleanInterval}
                                onChange={setCleanInterval}
                                min={0}
                                max={14}
                                unit="天"
                            />
                            <Slider
                                label={t('settings.TempFileModalSliderLabel2', '缓存大小限制')}
                                value={cleanSize}
                                onChange={setCleanSize}
                                min={0}
                                max={10}
                                unit="GB"
                                mode="input"
                            />
                            <div style={{ marginTop: '24px' }}>
                                <Toggle
                                    label={t('settings.TempFileModalToggleLabel', '自动清理临时文件')}
                                    checked={autoClean}
                                    onChange={setAutoClean}
                                    description={t('settings.TempFileModalToggleDesc', '自动清理临时文件和缓存')}
                                />
                            </div>
                        </div>
                    </SettingItem>
                </SettingCard>

                {/* ===== 高级设置 ===== */}
                {/* <Divider label="高级设置" /> */}

                <SettingCard title={t('settings.backupSettings', '备份设置')} icon={Save}>
                    <Toggle
                        checked={autoBackup}
                        onChange={setAutoBackup}
                        label={t('settings.autoBackup', '自动备份')}
                        description={t('settings.autoBackupDesc', '定期备份配置和数据')}
                    />
                    <Select
                        label={t('settings.backupInterval', '备份频率')}
                        value={backupInterval}
                        onChange={setBackupInterval}
                        options={[
                            { value: 'daily', label: t('settings.backupDaily', '每天') },
                            { value: 'weekly', label: t('settings.backupWeekly', '每周') },
                            { value: 'monthly', label: t('settings.backupMonthly', '每月') },
                        ]}
                        description={t('settings.backupIntervalDesc', '自动备份的间隔时间')}
                    />
                    <div style={{ padding: '16px 20px' }}>
                        <Button
                            label={t('settings.backupNow', '立即备份')}
                            onClick={() => alert(t('settings.backupNow', '立即备份'))}
                            variant="primary"
                            icon={Save}
                            fullWidth
                        />
                    </div>
                </SettingCard>

                <SettingCard title={t('settings.configDirectory', '配置目录')} icon={Folder}>
                    <Input
                        label={t('settings.configPath', '配置文件路径')}
                        value="C:/Users/Atlas/config"
                        onChange={() => { }}
                        description={t('settings.configPathDesc', '存储所有配置文件的目录')}
                    />
                    <div style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <Button
                                label={t('settings.openDirectory', '打开目录')}
                                onClick={() => alert(t('settings.openDirectory', '打开目录'))}
                                variant="primary"
                                icon={FolderOpen}
                                fullWidth
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Button
                                label={t('settings.resetConfig', '重置配置')}
                                onClick={() => confirm(t('settings.resetConfig', '重置配置'))}
                                variant="danger"
                                icon={AlertCircle}
                                fullWidth
                            />
                        </div>
                    </div>
                </SettingCard>

                {/* ===== 独立按钮组 ===== */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                }}>
                    <Button
                        label={t('settings.developerTools', '开发者工具')}
                        onClick={() => alert(t('settings.developerTools', '开发者工具'))}
                        variant="primary"
                        icon={Hammer}
                    />
                    <Button
                        label={t('settings.checkUpdate', '检查更新')}
                        onClick={() => alert(t('settings.checkUpdate', '检查更新'))}
                        variant="primary"
                        icon={RefreshCw}
                    />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                }}>
                    <Button
                        label={t('settings.forceStopModules', '模块强制停止')}
                        onClick={() => confirm(t('settings.forceStopModules', '模块强制停止'))}
                        variant="danger"
                        icon={XCircle}
                    />
                    <Button
                        label={t('settings.reconnectModules', '模块重连')}
                        onClick={() => alert(t('settings.reconnectModules', '模块重连'))}
                        variant="primary"
                        icon={Plug}
                        disabled={true}
                    />
                </div>

                {/* ===== 底部保存按钮 ===== */}
                <div style={{ marginTop: '48px' }}>
                    <Button
                        label={t('settings.resetConfig', '重置配置')}
                        onClick={() => alert(t('settings.resetConfig', '重置配置'))}
                        icon={Save}
                        variant="danger"
                        fullWidth
                        size="large"
                        requireConfirm
                        confirmTitle="确认重置"
                        confirmMessage="确定要重置吗？此操作将覆盖原有数据。"
                        confirmButtonText="重置"
                        cancelButtonText="取消"
                    />
                </div>

                {/* ===== 底部关于信息 ===== */}
                {/* <Divider label="关于" /> */}
                <SettingItem
                    label="关于"
                    description="应用信息和版本号"
                    icon={Info}
                    showCloseButton={false}
                >
                    <div style={{ color: 'var(--text-primary)' }}>
                        <h3 style={{ marginBottom: '20px', textAlign: 'left' }}>Atlas</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>版本:  <a style={{ color: 'var(--text-primary)' }}>0.2.0</a></p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            许可证:  <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>GPL-3.0</a>
                        </p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            作者:  <a href="https://github.com/FruityMaxine" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>FrutyMaxine</a>
                        </p>
                        <div style={{ marginTop: '24px' }}>
                            <Button
                                label="检查更新"
                                onClick={() => alert('检查更新中...')}
                                variant="primary"
                            />
                        </div>
                    </div>
                </SettingItem>
            </div>
        </div>
    );
}
