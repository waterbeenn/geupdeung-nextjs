'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsList from '../../components/news/NewsList';

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <main>
            {query && (
                <div className="search-query-header">
                    <h2><span>'{query}'</span> 관련 기사</h2>
                </div>
            )}
            <NewsList isFullPage={true} initialDisplay={20} forcedQuery={query} />
        </main>
    );
}
