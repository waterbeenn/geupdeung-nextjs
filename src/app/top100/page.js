'use client';

import { useEffect } from 'react';
import Top100List from './../../components/top100/Top100List';

export default function Page() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <main>
            <Top100List limit={100} />
        </main>
    );
}
