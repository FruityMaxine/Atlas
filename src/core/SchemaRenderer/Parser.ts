import JSON5 from 'json5';

export type ComponentType =
  | 'container'
  | 'group'
  | 'input'
  | 'button'
  | 'toggle'
  | 'slider'
  | 'select'
  | 'modal'
  | 'segmentedControl'
  | 'label'
  | 'text'
  | 'logViewer'
  | 'poller';

export interface SchemaMeta {
  density?: 'compact' | 'comfortable';
  tone?: 'default' | 'elevated';
  scrollbar?: 'default' | 'slim';
}

export interface ComponentSchema {
  id?: string;
  type: ComponentType;
  label?: string;
  props?: Record<string, any>;
  children?: ComponentSchema[];

  onClick?: string;
  hidden?: string | boolean;
  endpoint?: string;
  interval?: number;
}

export interface SchemaDocument {
  schema: ComponentSchema[];
  meta?: SchemaMeta;
}

export const parseSchema = (content: string): SchemaDocument => {
  try {
    const parsed = JSON5.parse(content);

    if (Array.isArray(parsed)) {
      return { schema: parsed };
    }

    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.schema)) {
      return {
        schema: parsed.schema,
        meta: parsed.meta,
      };
    }

    return { schema: [parsed] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Schema 解析失败：${message}`);
  }
};
