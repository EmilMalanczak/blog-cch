import { GetStaticProps } from 'next';
import * as React from 'react';

import { NotionPage } from '@/components/NotionPage';
import { domain, isDev } from '@/lib/config';
import { getSiteMap } from '@/lib/get-site-map';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { ExtendedRecordMap, PageProps, Params } from '@/lib/types';

export const getStaticProps: GetStaticProps<PageProps, Params> = async (context) => {
    const rawPageId = context?.params?.pageId as string;

    try {
        const props = await resolveNotionPage(domain, rawPageId);

        // @ts-ignore
        const block = props?.recordMap?.block;
        console.log(
            'PAGE BLOCK',
            Object.values(block as ExtendedRecordMap).filter((b) => b.value.type === 'page')
        );

        return { props, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, rawPageId, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

export async function getStaticPaths() {
    if (isDev) {
        return {
            paths: [],
            fallback: true
        };
    }

    const siteMap = await getSiteMap();

    const staticPaths = {
        paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
            params: {
                pageId
            }
        })),
        // paths: [],
        fallback: true
    };

    console.log(staticPaths.paths);
    return staticPaths;
}

const NotionDomainDynamicPage = (props: any) => <NotionPage {...props} />;

export default NotionDomainDynamicPage;
