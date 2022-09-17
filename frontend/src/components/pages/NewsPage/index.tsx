import styles from "./index.module.css";
import { useContext } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Box } from "src/components/Box";
import { Loader } from "src/components/Loader";
import { PermissionGuard } from "src/components/PermissionGuard";
import { PushButton } from "src/components/PushButton";
import { SectionHeader } from "src/components/Section";
import { UserPicture } from "src/components/UserPicture";
import { UserLink } from "src/components/links/UserLink";
import { Markdown } from "src/components/markdown/Markdown";
import { TitleContext } from "src/contexts/TitleContext";
import type { NewsDetails } from "src/services/NewsService";
import { NewsService } from "src/services/NewsService";
import { UserPermission } from "src/services/UserService";
import { formatDate } from "src/utils/string";

interface NewsPageParams {
  newsId: string;
}

const NewsPage = () => {
  const { newsId } = (useParams() as unknown) as NewsPageParams;
  const { setTitle } = useContext(TitleContext);

  const newsResult = useQuery<NewsDetails, Error>(
    ["news", NewsService.getNewsById, newsId],
    async () => NewsService.getNewsById(+newsId)
  );

  useEffect(() => {
    setTitle(newsResult?.data?.subject || "");
  }, [setTitle, newsResult]);

  if (newsResult.error) {
    return <p>{newsResult.error.message}</p>;
  }

  if (newsResult.isLoading || !newsResult.data) {
    return <Loader />;
  }

  const news: NewsDetails = newsResult.data;

  return (
    <Box>
      {news.subject && (
        <SectionHeader>
          <Markdown>{news.subject}</Markdown>
        </SectionHeader>
      )}

      <div className={styles.header}>
        <span className={styles.date}>
          Posted on {formatDate(news.created)} by{" "}
        </span>
        <span className={styles.authors}>
          {news.authors.map((author) => (
            <UserLink key={author.id} className={styles.userLink} user={author}>
              <>
                <UserPicture className={styles.userPic} user={author} />
                {author.username}
              </>
            </UserLink>
          ))}
        </span>
      </div>

      <div className={styles.content}>
        <Markdown>{news.text || "No news text is available."}</Markdown>
      </div>

      <PermissionGuard require={UserPermission.editNews}>
        <footer className={styles.footer}>
          <PushButton to={`/news/${newsId}/edit`}>Edit news</PushButton>
        </footer>
      </PermissionGuard>
    </Box>
  );
};

export { NewsPage };
