import { Block } from './block';
import { Collection } from './collection';
import { CollectionView, CollectionViewType } from './collection-view';
import { Decoration, ID, PropertyType, Role } from './core';
import { User } from './user';

// Aggregate map types
// ----------------------------------------------------------------------------

export interface NotionMap<T> {
    [key: string]: {
        role: Role;
        value: T;
    };
}

export type BlockMap = NotionMap<Block>;
export type UserMap = NotionMap<User>;
export type CollectionMap = NotionMap<Collection>;
export type CollectionViewMap = NotionMap<CollectionView>;

export interface PropertyMap {
    [key: string]: Decoration[];
}

// Aggregate API types
// ----------------------------------------------------------------------------

export interface RecordMap {
    block: BlockMap;
    collection?: CollectionMap;
    collection_view?: CollectionViewMap;
    notion_user?: UserMap;
}

export interface AggregationResult {
    type: PropertyType;
    value: any;
}

export interface PreviewImage {
    originalWidth: number;
    originalHeight: number;
    dataURIBase64: string;
}

export interface PreviewImageMap {
    [url: string]: PreviewImage | null;
}

export interface CollectionQueryResult {
    type: CollectionViewType;
    total: number;

    blockIds: ID[];
    aggregationResults: Array<AggregationResult>;

    // only used for board collection views
    groupResults?: Array<{
        value: AggregationResult;
        blockIds: ID[];
        total: number;
        aggregationResult: AggregationResult;
    }>;

    collection_group_results?: {
        type: string;
        blockIds: ID[];
        hasMore: boolean;
    };
}

// NOTE: This is not a native Notion type, but rather a convenience type that
// extends Notion's native RecordMap with data for collection instances.
export interface ExtendedRecordMap extends RecordMap {
    collection: CollectionMap;
    collection_view: CollectionViewMap;
    notion_user: UserMap;

    // added for convenience
    collection_query: {
        [collectionId: string]: {
            [collectionViewId: string]: CollectionQueryResult;
        };
    };

    // added for convenience
    signed_urls: {
        [blockId: string]: string;
    };

    // optional map of preview images
    preview_images?: PreviewImageMap;
}

export interface PageChunk {
    recordMap: RecordMap;
    cursor: {
        stack: any[];
    };
}

export interface CollectionInstance {
    recordMap: RecordMap;
    result: CollectionQueryResult;
}

// Misc
// ----------------------------------------------------------------------------

export interface PageMap {
    [pageId: string]: ExtendedRecordMap | null;
}
