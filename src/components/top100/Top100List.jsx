import Top100Header from './Top100Header';
import TopItem from './TopItem';
import useAxios from './../../hooks/useAxios';
import { getTopGainers } from '../../api/top100/stockApi';
import { useMemo, useState } from 'react';
import Modal from '../common/Modal';
import NewsList from '../news/NewsList';
import { Top100SkeletonList } from './Top100Skeleton';

const Top100List = ({ limit = 100 }) => {
    const url = getTopGainers();
    const { state, loading, error } = useAxios(url);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState('');

    const handleStockClick = (name) => {
        setSelectedStock(name);
        setIsModalOpen(true);
    };

    const topGainers = useMemo(() => {
        const rawItems = state?.response?.body?.items?.item || [];
        if (rawItems.length === 0) return [];

        return [...rawItems]
            .sort((a, b) => parseFloat(b.fltRt) - parseFloat(a.fltRt)) // 등락률(fltRt) 내림차순 정렬
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

    if (error) return <div className="error-state">데이터 로드 실패: {error}</div>;

    return (
        <section id="top100" className="top100-section">
            <h2 className="section-title">오늘의 급등주 Top 100</h2>
            <div className="top100-list-container">
                <Top100Header />
                <ul className="top100-items">
                    {loading ? (
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
                    initialDisplay={5}
                    forcedQuery={selectedStock} // 종목명으로 뉴스 검색
                />
            </Modal>
        </section>
    );
};

export default Top100List;
