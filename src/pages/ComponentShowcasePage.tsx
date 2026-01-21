/**
 * 组件演示页面
 * 
 * 用途：展示所有UI组件的使用效果
 */

import { useState, useRef } from 'react';
import { Palette, ToggleRight, ClipboardList, Sliders, Circle, Save, Trash2, Settings, Hammer, Globe, Info, Keyboard, Text, RefreshCw } from 'lucide-react';
import {
    Toggle,
    Input,
    Select,
    Button,
    Slider,
    SegmentedControl,
    SettingCard,
    SettingItem,
    DecryptedText
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
    const [decryptedText, setDecryptedText] = useState(''); // 解密文本
    const [decryptedTextByWordToggle, setDecryptedTextByWordToggle] = useState(true); // 解密文本切换
    const [decryptedTextSpeed, setDecryptedTextSpeed] = useState(20); // 解密文本速度
    const [decryptedTextIterations, setDecryptedTextIterations] = useState(15); // 解密文本迭代次数
    const [decryptedTextDelay, setDecryptedTextDelay] = useState(500); // 解密文本延迟
    const [themeSegment, setThemeSegment] = useState('dark'); // 主题选择

    // Modal 内组件的状态
    const [modalSlider, setModalSlider] = useState(70);
    const [modalToggle, setModalToggle] = useState(true);
    const [modalProxy, setModalProxy] = useState('');
    const [modalPort, setModalPort] = useState('');
    const [modalProxyEnabled, setModalProxyEnabled] = useState(false);

    // DecryptedText Ref
    const decryptedTextRef = useRef<any>(null);

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
                    <Slider
                        label="带输入框模式"
                        value={slider1}
                        onChange={setSlider1}
                        min={0}
                        max={100}
                        unit="%"
                        mode="input"
                        description="滑块 + 输入框组合，支持精确输入"
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

                {/* DecryptedText 演示 */}
                <SettingCard title="DecryptedText 解密文本" icon={Text}>
                    <p style={{
                        marginLeft: '20px',      // [布局] 左外边距
                        marginTop: '10px',       // [布局] 上外边距 (段前距)
                        marginBottom: '10px',    // [布局] 下外边距 (段后距)
                        textAlign: 'center',       // [排版] 对齐方式: left, center, right, justify
                        lineHeight: '1.8',       // [排版] 行高 (行间距), 建议 1.5 - 2.0
                        letterSpacing: '4px',    // [排版] 字间距 (每个字符之间的距离)
                        textIndent: '0em',       // [排版] 首行缩进 (2个字符宽度)
                        fontSize: '26px',        // [字体] 字体大小
                        fontWeight: '700',       // [字体] 字体粗细: 100-900, bold
                        color: 'var(--text-primary)', // [颜色] 字体颜色
                        textShadow: '0 0 10px rgba(255,255,255,0.1)', // [特效] 文字光晕
                        borderLeft: '4px solid var(--primary)', // [装饰] 左侧高亮条
                        paddingLeft: '12px',     // [布局] 左内边距 (配合borderLeft使用)
                    }}>
                        <DecryptedText
                            ref={decryptedTextRef}
                            text={decryptedText || 'Atlas'}
                            animateOn="view"
                            revealDirection="start"
                            sequential={decryptedTextByWordToggle}       // 改为逐字解密（更容易看清）
                            speed={decryptedTextSpeed}              // 每个字符间隔 80 毫秒（够慢了）
                            maxIterations={decryptedTextIterations}      // 每个字符闪烁 15 次再显示
                            startDelay={decryptedTextDelay}         // 延迟 1 秒后开始解密
                        />
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="文本输入"
                                value={decryptedText}
                                onChange={setDecryptedText}
                                placeholder="Atlas"
                            />
                        </div>
                        <div style={{ marginBottom: '16px', marginRight: '20px' }}>
                            <Button
                                label="重置动画"
                                onClick={() => decryptedTextRef.current?.replay()}
                                icon={RefreshCw}
                            />
                        </div>
                    </div>
                    <Toggle
                        label="逐字解密"
                        checked={decryptedTextByWordToggle}
                        onChange={setDecryptedTextByWordToggle}
                    />
                    <Slider
                        label="字符解密间隔"
                        value={decryptedTextSpeed}
                        onChange={setDecryptedTextSpeed}
                        min={1}
                        max={100}
                        mode="input"
                        unit="ms"
                    />
                    <Slider
                        label="字符解密闪烁次数"
                        value={decryptedTextIterations}
                        onChange={setDecryptedTextIterations}
                        min={0}
                        max={50}
                        mode="input"
                        unit="次"
                    />
                    <Slider
                        label="字符解密延迟"
                        value={decryptedTextDelay}
                        onChange={setDecryptedTextDelay}
                        min={0}
                        max={1000}
                        mode="input"
                        unit="ms"
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            <Button label="保存" onClick={() => { }} icon={Save} variant="primary" />
                            <Button label="删除" onClick={() => { }} icon={Trash2} variant="danger" />
                        </div>

                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '14px' }}>
                            二次确认功能 ⭐
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button
                                label="保存更改"
                                onClick={() => alert('已保存！')}
                                icon={Save}
                                variant="primary"
                                requireConfirm
                                confirmTitle="确认保存"
                                confirmMessage="确定要保存当前更改吗？此操作将覆盖原有数据。"
                                confirmButtonText="保存"
                                cancelButtonText="取消"
                            />
                            <Button
                                label="删除所有数据"
                                onClick={() => alert('已删除！')}
                                icon={Trash2}
                                variant="danger"
                                requireConfirm
                                confirmTitle="⚠️ 危险操作"
                                confirmMessage="您即将删除所有数据！此操作不可撤销，请谨慎操作。"
                                confirmButtonText="确认删除"
                                cancelButtonText="我再想想"
                            />
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
