/**
 * 组件演示页面
 * 
 * 用途：展示所有UI组件的使用效果
 */

import { useState } from 'react';
import { Palette, ToggleRight, ClipboardList, Sliders, Circle, Save, Trash2, Settings, Hammer, Globe, Info, Keyboard } from 'lucide-react';
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

function ComponentShowcasePage() {
    // 状态
    const [toggle1, setToggle1] = useState(false);
    const [input1, setInput1] = useState('');
    const [password1, setPassword1] = useState(''); // 密码输入框状态
    const [select1, setSelect1] = useState('option1');
    const [slider1, setSlider1] = useState(50);
    const [volumeSlider, setVolumeSlider] = useState(75); // 音量滑块
    const [segment1, setSegment1] = useState('a');
    const [themeSegment, setThemeSegment] = useState('dark'); // 主题选择

    // Modal 内组件的状态
    const [modalSlider, setModalSlider] = useState(70);
    const [modalToggle, setModalToggle] = useState(true);
    const [modalProxy, setModalProxy] = useState('');
    const [modalPort, setModalPort] = useState('');
    const [modalProxyEnabled, setModalProxyEnabled] = useState(false);

    return (
        <div style={{
            padding: '60px',
            maxWidth: '1400px',  // 增加最大宽度以容纳两列
            margin: '0 auto',
        }}>
            <h1 style={{
                fontSize: '48px',
                marginBottom: '16px',
                background: 'var(--text-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Palette size={48} />
                    组件演示
                </div>
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#9CA3AF',
                marginBottom: '40px',
            }}>
                查看所有可用的UI组件
            </p>

            {/* 瀑布流布局 - 左右两列互不干扰 */}
            <div style={{
                columns: '350px 3',           // 两列
                columnGap: '24px',        // 列间距
            }}>

                {/* Toggle 演示 */}
                <SettingCard title="Toggle 开关" icon={ToggleRight}>
                    <Toggle
                        checked={toggle1}
                        onChange={setToggle1}
                        label="开关示例"
                        description="点击切换开关状态"
                    />
                    <Toggle
                        checked={true}
                        onChange={() => { }}
                        label="禁用状态"
                        description="这是一个被禁用的开关"
                        disabled
                    />
                </SettingCard>

                {/* Input 演示 */}
                <SettingCard title="Input 输入框" icon={Keyboard}>
                    <Input
                        label="文本输入"
                        value={input1}
                        onChange={setInput1}
                        placeholder="请输入内容"
                        description="这是一个文本输入框"
                    />
                    <Input
                        label="密码输入"
                        value={password1}
                        onChange={setPassword1}
                        type="password"
                        placeholder="请输入密码"
                        description="支持点击眼睛图标切换显示/隐藏"
                    />
                </SettingCard>

                {/* Select 演示 */}
                <SettingCard title="Select 下拉框" icon={ClipboardList}>
                    <Select
                        label="单选下拉"
                        value={select1}
                        onChange={setSelect1}
                        options={[
                            { value: 'option1', label: '选项 1' },
                            { value: 'option2', label: '选项 2' },
                            { value: 'option3', label: '选项 3' },
                        ]}
                        description="从列表中选择一项"
                    />
                </SettingCard>

                {/* Slider 演示 */}
                <SettingCard title="Slider 滑块" icon={Sliders}>
                    <Slider
                        label="数值滑块"
                        value={slider1}
                        onChange={setSlider1}
                        min={0}
                        max={100}
                        unit="%"
                        description="拖动滑块调整数值"
                    />
                    <Slider
                        label="音量控制"
                        value={volumeSlider}
                        onChange={setVolumeSlider}
                        min={0}
                        max={100}
                        step={5}
                        unit="%"
                    />
                </SettingCard>

                {/* SegmentedControl 演示 */}
                <SettingCard title="SegmentedControl 分段控制器" icon={Circle}>
                    <SegmentedControl
                        label="三段选择"
                        value={segment1}
                        onChange={setSegment1}
                        options={[
                            { value: 'a', label: '选项 A', icon: '🅰️' },
                            { value: 'b', label: '选项 B', icon: '🅱️' },
                            { value: 'c', label: '选项 C', icon: '©️' },
                        ]}
                        description="选择其中一项"
                    />
                    <SegmentedControl
                        label="主题选择"
                        value={themeSegment}
                        onChange={setThemeSegment}
                        options={[
                            { value: 'light', label: '浅色' },
                            { value: 'dark', label: '深色' },
                            { value: 'auto', label: '自动' },
                        ]}
                    />
                </SettingCard>

                {/* Button 演示 */}
                <SettingCard title="Button 按钮" icon={Circle}>
                    <div style={{ padding: '16px 20px' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>
                            按钮类型
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            <Button label="主要操作" onClick={() => alert('Primary')} variant="primary" />
                            <Button label="危险操作" onClick={() => alert('Danger')} variant="danger" />
                        </div>

                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>
                            尺寸
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                            <Button label="小" onClick={() => { }} size="small" />
                            <Button label="中" onClick={() => { }} size="medium" />
                            <Button label="大" onClick={() => { }} size="large" />
                        </div>

                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>
                            带图标
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Button label="保存" onClick={() => { }} icon={Save} variant="primary" />
                            <Button label="删除" onClick={() => { }} icon={Trash2} variant="danger" />
                        </div>
                    </div>
                </SettingCard>

                {/* SettingItem with Modal 演示 */}
                <SettingCard title="SettingItem 设置项" icon={Settings}>
                    <SettingItem
                        label="高级配置"
                        description="点击查看更多配置选项"
                        icon={Hammer}
                        modalTitle="高级配置设置"
                    >
                        <div style={{ color: 'var(--text-primary)' }}>
                            <p style={{ marginBottom: '16px', color: '#9CA3AF' }}>
                                这是一个 Modal 弹窗示例，可以在这里放任何组件！
                            </p>
                            <Slider
                                label="音量"
                                value={modalSlider}
                                onChange={setModalSlider}
                                min={0}
                                max={100}
                                unit="%"
                            />
                            <Toggle
                                checked={modalToggle}
                                onChange={setModalToggle}
                                label="自动保存"
                                description="更改后自动保存设置"
                            />
                            <div style={{ marginTop: '24px' }}>
                                <Button
                                    label="保存设置"
                                    onClick={() => alert(`已保存！音量: ${modalSlider}%, 自动保存: ${modalToggle ? '开启' : '关闭'}`)}
                                    variant="primary"
                                    fullWidth
                                />
                            </div>
                        </div>
                    </SettingItem>

                    <SettingItem
                        label="网络设置"
                        description="配置代理和连接选项"
                        icon={Globe}
                    >
                        <div style={{ color: 'var(--text-primary)' }}>
                            <Input
                                label="代理地址"
                                value={modalProxy}
                                onChange={setModalProxy}
                                placeholder="http://proxy.example.com:8080"
                            />
                            <Input
                                label="端口"
                                value={modalPort}
                                onChange={setModalPort}
                                placeholder="8080"
                                type="number"
                            />
                            <Toggle
                                checked={modalProxyEnabled}
                                onChange={setModalProxyEnabled}
                                label="启用代理"
                            />
                        </div>
                    </SettingItem>

                    <SettingItem
                        label="关于"
                        description="应用信息和版本号"
                        icon={Info}
                        showCloseButton={false}
                    >
                        <div style={{ color: 'var(--text-primary)' }}>
                            <h3 style={{ marginBottom: '20px', textAlign: 'left' }}>Atlas</h3>
                            <p style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>版本:  <a style={{ color: 'var(--text-primary)' }}>0.2.0</a></p>
                            <p style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                                许可证:  <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>GPL-3.0</a>
                            </p>
                            <p style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
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
                </SettingCard>
            </div>
        </div>
    );
}

export default ComponentShowcasePage;
