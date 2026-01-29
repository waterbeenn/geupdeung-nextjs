'use client';

const NewsItem = ({ link, title, description, pubDate }) => {
    return (
        <li className="news-item">
            <a href={link} target="_blank" rel="noopener noreferrer">
                {/* dangerouslySetInnerHTML는 네이버가 주는 <b>태그를 렌더링하기 위함 */}
                <h3 dangerouslySetInnerHTML={{ __html: title }} />
                <p dangerouslySetInnerHTML={{ __html: description }} />
                <span className="news-date">{new Date(pubDate).toLocaleDateString()}</span>
            </a>
        </li>
    );
};

export default NewsItem;
