'use client';

import { useEffect } from 'react';
import NewsList from '../../components/news/NewsList';

export default function Page() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <main>
            <NewsList isFullPage={true} initialDisplay={20} />
        </main>
    );
}
