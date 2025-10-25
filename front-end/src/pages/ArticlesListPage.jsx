import articles from "../article-content";
import ArticlesList from "../ArticlesList";
export default function ArticlesListPage() {
    return (
        <>
            <ArticlesList articles={articles} />
        </>
    );
}