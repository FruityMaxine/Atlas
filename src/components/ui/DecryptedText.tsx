/**
 * DecryptedText 文字解密特效组件
 * 
 * 用途：为文字添加解密动画效果
 * 特性：支持悬停/滚动触发、多种解密方向、可自定义字符集
 * 设计理念：科技感的文字效果，适合标题和重要提示
 */

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

const styles = {
    wrapper: {
        display: 'inline-block',
        whiteSpace: 'pre-wrap' as const
    },
    srOnly: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        border: 0
    }
};

interface DecryptedTextProps extends HTMLMotionProps<'span'> {
    /** 要显示的文本内容 */
    text: string;
    /** 解密速度（毫秒），每隔多少毫秒刷新一次字符。默认：50ms */
    speed?: number;
    /** 最大迭代次数，非逐字模式下每个字符闪烁的次数。默认：10 */
    maxIterations?: number;
    /** 是否逐字解密。true=一个字一个字按顺序解密，false=所有字符同时闪烁。默认：false */
    sequential?: boolean;
    /** 解密方向。'start'=从左到右，'end'=从右到左，'center'=从中心向两边。默认：'start' */
    revealDirection?: 'start' | 'end' | 'center';
    /** 是否只使用原文本中的字符作为解密字符集。默认：false */
    useOriginalCharsOnly?: boolean;
    /** 解密过程中使用的随机字符集。默认：大小写字母+特殊符号 */
    characters?: string;
    /** 应用于已解密字符的 CSS 类名 */
    className?: string;
    /** 应用于组件外层容器的 CSS 类名 */
    parentClassName?: string;
    /** 应用于未解密（加密）字符的 CSS 类名 */
    encryptedClassName?: string;
    /** 动画触发方式。'view'=滚动进入视图时触发，'hover'=鼠标悬停时触发，'both'=两者都支持。默认：'hover' */
    animateOn?: 'view' | 'hover' | 'both';
    /** 延迟开始动画的毫秒数（仅对 view 模式有效）。默认：0（无延迟） */
    startDelay?: number;
}

export interface DecryptedTextHandle {
    /** 重新播放解密动画 */
    replay: () => void;
}

const DecryptedText = forwardRef<DecryptedTextHandle, DecryptedTextProps>(({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    startDelay = 0,  // 默认无延迟
    ...props
}, ref) => {
    const [displayText, setDisplayText] = useState<string>(text);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [isScrambling, setIsScrambling] = useState<boolean>(false);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [hasAnimated, setHasAnimated] = useState<boolean>(false);
    const [playKey, setPlayKey] = useState<number>(0); // 用于强制重新播放动画的 key
    const [, setCurrentCharIteration] = useState<number>(0); // 当前字符的迭代次数
    const containerRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
        replay: () => {
            setIsHovering(true);
            setHasAnimated(true); // 确保再次进入视野不会触发（如果是View模式），但这里是手动触发
            setIsScrambling(true);
            setRevealedIndices(new Set());
            setCurrentCharIteration(0);
            setPlayKey(prev => prev + 1); // 强制触发 useEffect
        }
    }));

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        let currentIteration = 0;

        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length;
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size;
                case 'end':
                    return textLength - 1 - revealedSet.size;
                case 'center': {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                        return nextIndex;
                    }

                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i;
                    }
                    return 0;
                }
                default:
                    return revealedSet.size;
            }
        };

        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
            : characters.split('');

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            if (useOriginalCharsOnly) {
                const positions = originalText.split('').map((char, i) => ({
                    char,
                    isSpace: char === ' ',
                    index: i,
                    isRevealed: currentRevealed.has(i)
                }));

                const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

                for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
                }

                let charIndex = 0;
                return positions
                    .map(p => {
                        if (p.isSpace) return ' ';
                        if (p.isRevealed) return originalText[p.index];
                        return nonSpaceChars[charIndex++];
                    })
                    .join('');
            } else {
                return originalText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (currentRevealed.has(i)) return originalText[i];
                        return availableChars[Math.floor(Math.random() * availableChars.length)];
                    })
                    .join('');
            }
        };

        if (isHovering) {
            setIsScrambling(true);
            // 立即更新显示文本，解决输入时的延迟问题
            setDisplayText(shuffleText(text, revealedIndices));

            interval = setInterval(() => {
                if (sequential) {
                    // 逐字解密模式：每个字符闪烁 maxIterations 次后再 reveal
                    setCurrentCharIteration(prev => {
                        const nextIteration = prev + 1;

                        setRevealedIndices(prevRevealed => {
                            // 如果当前字符已经闪烁够次数，reveal 它并重置计数器
                            if (nextIteration >= maxIterations) {
                                if (prevRevealed.size < text.length) {
                                    const nextIndex = getNextIndex(prevRevealed);
                                    const newRevealed = new Set(prevRevealed);
                                    newRevealed.add(nextIndex);
                                    setDisplayText(shuffleText(text, newRevealed));
                                    setCurrentCharIteration(0);  // 重置计数器，开始下一个字符
                                    return newRevealed;
                                } else {
                                    // 所有字符都已 reveal
                                    clearInterval(interval);
                                    setIsScrambling(false);
                                    return prevRevealed;
                                }
                            } else {
                                // 继续闪烁当前字符
                                setDisplayText(shuffleText(text, prevRevealed));
                                return prevRevealed;
                            }
                        });

                        return nextIteration >= maxIterations ? 0 : nextIteration;
                    });
                } else {
                    // 非逐字模式：所有字符同时闪烁
                    setRevealedIndices(prevRevealed => {
                        setDisplayText(shuffleText(text, prevRevealed));
                        currentIteration++;
                        if (currentIteration >= maxIterations) {
                            clearInterval(interval);
                            setIsScrambling(false);
                            setDisplayText(text);
                        }
                        return prevRevealed;
                    });
                }
            }, speed);
        } else {
            setDisplayText(text);
            setRevealedIndices(new Set());
            setIsScrambling(false);
            setCurrentCharIteration(0);  // 重置字符迭代计数器
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly, playKey]);

    useEffect(() => {
        if (animateOn !== 'view' && animateOn !== 'both') return;

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    // 添加延迟支持
                    if (startDelay > 0) {
                        setTimeout(() => {
                            setIsHovering(true);
                            setHasAnimated(true);
                        }, startDelay);
                    } else {
                        setIsHovering(true);
                        setHasAnimated(true);
                    }
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRef = containerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [animateOn, hasAnimated, startDelay]);

    const hoverProps =
        animateOn === 'hover' || animateOn === 'both'
            ? {
                onMouseEnter: () => setIsHovering(true),
                onMouseLeave: () => setIsHovering(false)
            }
            : {};

    return (
        <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...hoverProps} {...props}>
            <span style={styles.srOnly}>{displayText}</span>

            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;

                    return (
                        <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
                            {char}
                        </span>
                    );
                })}
            </span>
        </motion.span>
    );
});

export default DecryptedText;
