'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';
import { NEWS_CATEGORIES, DEFAULT_CATEGORY } from '../../api/news/categories';
import { NewsSkeletonList } from './NewsSkeleton';

const NewsList = ({ limit, initialDisplay = 12, isFullPage = false, forcedQuery = null }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
    const [error, setError] = useState(null);
    const [start, setStart] = useState(1);

    const fetchNews = useCallback(
        async (category, startPos, isAppend = false) => {
            isAppend ? setLoadingMore(true) : setLoading(true);
            const displayCount = isFullPage ? 20 : initialDisplay;
            setError(null);

            try {
                const res = await axios.get(`/api/news`, {
                    params: {
                        query: category.query,
                        display: displayCount,
                        start: startPos,
                        _t: Date.now(),
                    },
                });

                const items = res.data.items || [];

                const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '');

                let filtered = items;

                if (category.name !== '전체') {
                    filtered = items.filter((item) => {
                        const content = stripHtml(item.title + item.description);
                        const matchName = content.includes(category.name.replace('/', ''));
                        const matchQuery = category.query.split(' ').some((q) => {
                            const cleanQ = q.replace('+', '').trim();
                            return cleanQ.length > 0 && content.includes(cleanQ);
                        });
                        return matchName || matchQuery;
                    });
                }
                const cleanedItems = items.map((item) => ({
                    ...item,
                    title: item.title.replace(/<[^>]*>?/gm, ''),
                    description: item.description.replace(/<[^>]*>?/gm, ''),
                }));

                setNews((prev) => (isAppend ? [...prev, ...cleanedItems] : cleanedItems));
            } catch (err) {
                setError('뉴스를 불러오는 중에 문제가 발생했습니다.');
                console.error('뉴스 로드 실패:', err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [initialDisplay, isFullPage]
    );

    useEffect(() => {
        setStart(1); // 시작점 초기화
        const targetQuery = forcedQuery
            ? { name: forcedQuery, query: forcedQuery }
            : activeCategory;
        fetchNews(targetQuery, 1, false);
    }, [activeCategory, fetchNews, forcedQuery]);

    const handleLoadMore = () => {
        const displayCount = isFullPage ? 20 : initialDisplay;
        const nextStart = start + displayCount;
        setStart(nextStart);
        const targetCategory = forcedQuery
            ? { name: forcedQuery, query: forcedQuery }
            : activeCategory;

        fetchNews(targetCategory, nextStart, true);
    };

    const displayedNews = limit ? news.slice(0, limit) : news;

    return (
        <section className="news-section">
            {!forcedQuery && <h2>최신 경제 뉴스</h2>}
            {!limit && !forcedQuery && (
                <div className="news-tabs">
                    {NEWS_CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            className={`tab-btn ${activeCategory.name === cat.name ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="news-content-area">
                {error && <div className="error-message">{error}</div>}

                {loading && news.length === 0 ? (
                    <NewsSkeletonList count={isFullPage ? 8 : 4} />
                ) : (
                    <ul className={`news-list ${isFullPage ? 'full-view' : ''}`}>
                        {displayedNews.map((item) => (
                            <NewsItem key={item.link} {...item} />
                        ))}
                    </ul>
                )}
                {loadingMore && <NewsSkeletonList count={4} />}
                {isFullPage && !limit && (
                    <div className="load-more-container">
                        <button
                            className="load-more-btn"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore
                                ? '불러오는 중...'
                                : forcedQuery
                                    ? `'${forcedQuery}' 기사 더보기 +`
                                    : '뉴스 더보기 +'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsList;
