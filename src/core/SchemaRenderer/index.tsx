import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LogViewer from '../../components/ui/LogViewer/LogViewer';
import { SettingItem } from '../../components/ui/Modal/Modal';
import SegmentedControl from '../../components/ui/SegmentedControl/SegmentedControl';
import Select from '../../components/ui/Select/Select';
import SettingCard from '../../components/ui/SettingCard/SettingCard';
import Slider from '../../components/ui/Slider/Slider';
import TextBlock from '../../components/ui/TextBlock/TextBlock';
import Toggle from '../../components/ui/Toggle/Toggle';
import { useToast } from '../../contexts/ToastContext';
import { ModuleContext } from '../ModuleLoader';
import { ComponentSchema, SchemaMeta } from './Parser';
import { useSchemaStore } from './SchemaStore';
import './SchemaRenderer.css';

interface SchemaRendererProps {
  schema: ComponentSchema[];
  meta?: SchemaMeta;
}

interface ActionButtonNodeProps {
  node: ComponentSchema;
  onAction: (action: string) => Promise<void>;
}

interface PollerNodeProps {
  endpoint: string;
  interval: number;
  onPoll: (endpoint: string) => Promise<void>;
}

interface SchemaNodeProps {
  node: ComponentSchema;
  values: Record<string, any>;
  setValue: (id: string, value: any) => void;
  onAction: (action: string) => Promise<void>;
  onPoll: (endpoint: string) => Promise<void>;
  meta?: SchemaMeta;
}

const getIcon = (name?: string): LucideIcon | undefined => {
  if (!name) {
    return undefined;
  }
  return (Icons as unknown as Record<string, LucideIcon | undefined>)[name];
};

const resolveHidden = (hidden: ComponentSchema['hidden'], values: Record<string, any>): boolean => {
  if (typeof hidden === 'boolean') {
    return hidden;
  }

  if (typeof hidden !== 'string') {
    return false;
  }

  const expression = hidden.trim();
  if (!expression) {
    return false;
  }

  if (expression.startsWith('!$')) {
    const key = expression.slice(2);
    return !Boolean(values[key]);
  }

  if (expression.startsWith('$')) {
    const key = expression.slice(1);
    return Boolean(values[key]);
  }

  return false;
};

const resolveTextValue = (node: ComponentSchema, storeValue: unknown): string => {
  if (storeValue !== undefined && storeValue !== null) {
    return String(storeValue);
  }
  if (typeof node.label === 'string') {
    return node.label;
  }
  if (typeof node.props?.text === 'string') {
    return node.props.text;
  }
  return '';
};

const ActionButtonNode: React.FC<ActionButtonNodeProps> = ({ node, onAction }) => {
  const [loading, setLoading] = useState(false);
  const action = (node.onClick ?? node.props?.onClick) as string | undefined;

  const handleClick = async () => {
    if (!action) {
      if (typeof node.props?.onClick === 'function') {
        node.props.onClick();
      }
      return;
    }

    setLoading(true);
    try {
      await onAction(action);
    } finally {
      setLoading(false);
    }
  };

  return <Button {...node.props} label={node.label || '按钮'} isLoading={loading} onClick={handleClick} />;
};

const PollerNode: React.FC<PollerNodeProps> = ({ endpoint, interval, onPoll }) => {
  useEffect(() => {
    if (!endpoint) {
      return;
    }

    const safeInterval = Math.max(1200, interval);
    let inFlight = false;
    let disposed = false;

    const runPoll = async () => {
      if (inFlight || disposed) {
        return;
      }

      inFlight = true;
      try {
        await onPoll(endpoint);
      } catch {
        // 轮询失败静默处理，避免频繁弹错。
      } finally {
        inFlight = false;
      }
    };

    void runPoll();
    const timer = setInterval(() => {
      void runPoll();
    }, safeInterval);

    return () => {
      disposed = true;
      clearInterval(timer);
    };
  }, [endpoint, interval, onPoll]);

  return null;
};

const SchemaNode: React.FC<SchemaNodeProps> = ({ node, values, setValue, onAction, onPoll, meta }) => {
  if (resolveHidden(node.hidden, values)) {
    return null;
  }

  const storeValue = node.id ? values[node.id] : undefined;
  const handleChange = (nextValue: any) => {
    if (node.id) {
      setValue(node.id, nextValue);
    }
    if (typeof node.props?.onChange === 'function') {
      node.props.onChange(nextValue);
    }
  };

  switch (node.type) {
    case 'container':
      return (
        <SettingCard {...node.props} title={node.label || '未命名容器'} icon={getIcon(node.props?.icon)}>
          {node.children ? <SchemaRenderer schema={node.children} meta={meta} /> : null}
        </SettingCard>
      );

    case 'group':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: (node.props?.direction as React.CSSProperties['flexDirection']) || 'column',
            gap: node.props?.gap ?? '8px',
            alignItems: node.props?.align ?? 'stretch',
            flexWrap: node.props?.wrap ? 'wrap' : 'nowrap',
            ...(node.props?.style || {}),
          }}
        >
          {node.children?.map((child, index) => (
            <SchemaNode
              key={child.id || `child-${index}`}
              node={child}
              values={values}
              setValue={setValue}
              onAction={onAction}
              onPoll={onPoll}
              meta={meta}
            />
          ))}
        </div>
      );

    case 'button':
      return <ActionButtonNode node={node} onAction={onAction} />;

    case 'input':
      return (
        <Input
          {...node.props}
          label={node.label}
          value={
            storeValue !== undefined
              ? String(storeValue)
              : String(node.props?.defaultValue ?? node.props?.value ?? '')
          }
          onChange={handleChange}
          description={node.props?.description ?? node.props?.hint}
        />
      );

    case 'toggle':
      return (
        <Toggle
          {...node.props}
          label={node.label || '开关'}
          checked={
            storeValue !== undefined
              ? Boolean(storeValue)
              : Boolean(node.props?.defaultChecked ?? node.props?.checked ?? false)
          }
          onChange={handleChange}
          description={node.props?.description ?? node.props?.hint}
        />
      );

    case 'slider':
      return (
        <Slider
          {...node.props}
          label={node.label}
          value={
            storeValue !== undefined
              ? Number(storeValue)
              : Number(node.props?.defaultValue ?? node.props?.value ?? 0)
          }
          onChange={handleChange}
          description={node.props?.description ?? node.props?.hint}
        />
      );

    case 'select':
      return (
        <Select
          {...node.props}
          label={node.label}
          options={node.props?.options || []}
          value={
            storeValue !== undefined
              ? String(storeValue)
              : String(node.props?.defaultValue ?? node.props?.value ?? '')
          }
          onChange={handleChange}
          description={node.props?.description ?? node.props?.hint}
        />
      );

    case 'modal':
      return (
        <SettingItem {...node.props} label={node.label || '详细信息'}>
          {node.children ? <SchemaRenderer schema={node.children} meta={meta} /> : null}
        </SettingItem>
      );

    case 'segmentedControl':
      return (
        <SegmentedControl
          {...node.props}
          label={node.label}
          options={node.props?.options || []}
          value={
            storeValue !== undefined
              ? String(storeValue)
              : String(node.props?.defaultValue ?? node.props?.value ?? '')
          }
          onChange={handleChange}
          description={node.props?.description ?? node.props?.hint}
        />
      );

    case 'label':
      return (
        <div
          className="text-secondary"
          style={{
            fontSize: '14px',
            padding: '4px 0',
            ...(node.props?.style || {}),
          }}
        >
          {resolveTextValue(node, storeValue)}
        </div>
      );

    case 'text':
      return (
        <TextBlock
          text={resolveTextValue(node, storeValue)}
          variant={node.props?.variant}
          align={node.props?.align}
          style={node.props?.style}
          className={node.props?.className}
        />
      );

    case 'logViewer': {
      const value =
        storeValue !== undefined
          ? String(storeValue)
          : String(node.props?.value ?? node.props?.defaultValue ?? '');

      return (
        <LogViewer
          {...node.props}
          label={node.label}
          value={value}
          rows={Number(node.props?.rows ?? 10)}
        />
      );
    }

    case 'poller': {
      const endpoint = node.endpoint || node.props?.endpoint;
      const interval = Number(node.interval || node.props?.interval || 1000);
      if (!endpoint) {
        return null;
      }
      return <PollerNode endpoint={endpoint} interval={interval} onPoll={onPoll} />;
    }

    default:
      return <div style={{ color: 'red' }}>未知组件类型：{node.type}</div>;
  }
};

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({ schema, meta }) => {
  const moduleContext = useContext(ModuleContext);
  const { showToast } = useToast();
  const { values, setValue } = useSchemaStore();

  const stableValues = useMemo(() => values, [values]);

  const mergeResponseData = useCallback(
    (payload: any) => {
      if (!payload || typeof payload !== 'object') {
        return;
      }

      Object.entries(payload).forEach(([key, value]) => {
        setValue(key, value);
      });
    },
    [setValue],
  );

  const handleAction = useCallback(
    async (action: string) => {
      if (!moduleContext) {
        showToast('模块上下文不可用，无法执行操作。', 'error');
        return;
      }

      try {
        const response = await moduleContext.apiClient.post(`/api/${action}`, stableValues);
        if (response?.success === false) {
          showToast(response.error || '操作失败', 'error');
          return;
        }

        if (response?.message) {
          showToast(response.message, 'success');
        }
        mergeResponseData(response?.data ?? response);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showToast(`操作失败：${message}`, 'error');
      }
    },
    [mergeResponseData, moduleContext, showToast, stableValues],
  );

  const handlePoll = useCallback(
    async (endpoint: string) => {
      if (!moduleContext) {
        return;
      }

      const response = await moduleContext.apiClient.get(`/api/${endpoint}`);
      mergeResponseData(response?.data ?? response);
    },
    [mergeResponseData, moduleContext],
  );

  const rootClassName = useMemo(() => {
    const densityClass = meta?.density ? `atlas-schema-density-${meta.density}` : '';
    const toneClass = meta?.tone ? `atlas-schema-tone-${meta.tone}` : '';
    const scrollbarClass = meta?.scrollbar ? `atlas-schema-scrollbar-${meta.scrollbar}` : '';
    return ['atlas-schema-root', densityClass, toneClass, scrollbarClass].filter(Boolean).join(' ');
  }, [meta?.density, meta?.scrollbar, meta?.tone]);

  if (!schema || schema.length === 0) {
    return null;
  }

  return (
    <div className={rootClassName}>
      {schema.map((node, index) => (
        <SchemaNode
          key={node.id || `node-${index}`}
          node={node}
          values={values}
          setValue={setValue}
          onAction={handleAction}
          onPoll={handlePoll}
          meta={meta}
        />
      ))}
    </div>
  );
};
