import Top100Header from './Top100Header';
import TopItem from './TopItem';
import useAxios from './../../hooks/useAxios';
import Modal from '../common/Modal';
import NewsList from '../news/NewsList';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTopGainers } from '../../api/top100/stockApi';
import { Top100SkeletonList } from './Top100Skeleton';
import { getLatestTradingDay } from '../../util/dateHelper';

const Top100List = ({ limit = 100 }) => {
    const router = useRouter();
    const [apiUrl, setApiUrl] = useState('');
    const { state, loading, error } = useAxios(apiUrl);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState('');

    useEffect(() => {
        const initTradingDay = async () => {
            const day = await getLatestTradingDay();
            setApiUrl(getTopGainers(day)); // 날짜가 확정되면 그때 API URL을 생성
        };
        initTradingDay();
    }, []);

    const handleStockClick = (name) => {
        setSelectedStock(name);
        setIsModalOpen(true);
    };

    const topGainers = useMemo(() => {
        const rawItems = state?.response?.body?.items?.item || [];
        if (rawItems.length === 0) return [];

        return [...rawItems]
            .sort((a, b) => parseFloat(b.fltRt) - parseFloat(a.fltRt))
            .slice(0, limit) // 100위까지만 자르기
            .map((item, index) => {
                const rawPercent = Number(item.fltRt);
                const formattedPercent = rawPercent.toFixed(2);
                return {
                    rank: index + 1,
                    name: item.itmsNm,
                    code: item.srtnCd,
                    price: parseInt(item.clpr).toLocaleString(),
                    change: parseInt(item.vs).toLocaleString(),
                    percent: String(formattedPercent),
                    isUp: parseFloat(item.fltRt) > 0,
                };
            });
    }, [state, limit]);

    const isLoading = !apiUrl || loading;

    if (error) return <div className="error-state">데이터 로드 실패: {error}</div>;

    return (
        <section id="top100" className="top100-section">
            <h2 className="section-title">오늘의 급등주 Top 100</h2>
            <div className="top100-list-container">
                <Top100Header />
                <ul className="top100-items">
                    {isLoading ? (
                        <Top100SkeletonList count={limit > 20 ? 15 : limit} />
                    ) : (
                        topGainers.map((stock) => (
                            <TopItem key={stock.code} {...stock} onItemClick={handleStockClick} />
                        ))
                    )}
                </ul>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedStock}>
                <NewsList
                    isFullPage={false}
                    initialDisplay={10}
                    forcedQuery={selectedStock}
                />
                {/* 모달 전용 더보기 버튼 추가 */}
                <div
                    className="modal-more-wrapper"
                    style={{ textAlign: 'center', marginTop: '1.5rem' }}
                >
                    <button
                        className="load-more-btn"
                        onClick={() => router.push(`/news?q=${encodeURIComponent(selectedStock)}`)}
                    >
                        '{selectedStock}' 뉴스 전체보기 →
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default Top100List;
