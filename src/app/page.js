'use client';

import { useRouter } from 'next/navigation';
import indexData from '../api/indexs/indexData';
import MainBanner from '../components/main/mainBanner/MainBanner';
import Top100List from '../components/top100/Top100List';
import NewsList from '../components/news/NewsList';

export default function Page() {
    const router = useRouter();
    const indexs = indexData;

    return (
        <main>
            <MainBanner indexs={indexs} />
            <Top100List limit={20} />
            <div className="section-wrapper">
                <button className="btn-more" onClick={() => router.push('/top100')}>
                    급등주 더보기 +
                </button>
            </div>
            <NewsList />
            <div className="section-wrapper">
                <button className="btn-more" onClick={() => router.push('/news')}>
                    최신뉴스 더보기 +
                </button>
            </div>
        </main>
    );
}
