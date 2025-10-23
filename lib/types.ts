interface MoveType {
  repr: string;
}

export interface MoveValue {
    type: MoveType;
    json: string;
}

export interface DataValue {
  end_epoch: string;
  file_blob: string;
  file_type: string;
  renewedAt: string;
  thumbnail_blob: string;
  uploadedAt: string;
}

// Generic parsed JSON type that can be extended
export type ParsedJson = DataValue // | Record<string, any>;

interface DynamicFieldValue {
  __typename: 'MoveValue' | 'MoveObject';
  type?: MoveType;
  json?: ParsedJson;
  contents?: MoveValue;
}

export interface DynamicFieldNode {
    name: MoveValue;
    value: DynamicFieldValue
}

export interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

export interface DynamicFieldsResponse {
    address: {
        dynamicFields: {
            pageInfo: PageInfo;
            nodes: DynamicFieldNode[];
        }
    }
}

export interface DynamicFieldsVariables {
    id: string;
    cursor?: string | null;
    limit?: number;
}