import styles from "./index.module.css";
import { useState } from "react";
import { ReviewDeleteButton } from "src/components/buttons/ReviewDeleteButton";
import { ReviewEditButton } from "src/components/buttons/ReviewEditButton";
import { BurgerMenu } from "src/components/common/BurgerMenu";
import { Link } from "src/components/common/Link";
import { PermissionGuard } from "src/components/common/PermissionGuard";
import { UserPicture } from "src/components/common/UserPicture";
import { LevelLink } from "src/components/links/LevelLink";
import { UserLink } from "src/components/links/UserLink";
import { Markdown } from "src/components/markdown/Markdown";
import type { ReviewListing } from "src/services/ReviewService";
import { UserPermission } from "src/services/UserService";
import { formatDate } from "src/utils/string";

const REVIEW_EXCERPT_CUTOFF = 1200;

interface ReviewsListItemProps {
  review: ReviewListing;
  showLevels: boolean;
  showExcerpts: boolean;
}

const ReviewsListItem = ({
  review,
  showLevels,
  showExcerpts,
}: ReviewsListItemProps) => {
  const [isExcerptExpanded, setIsExcerptExpanded] = useState(false);
  const classNames = [styles.wrapper];

  const handleReadMoreClick = () => {
    setIsExcerptExpanded((isExcerptExpanded) => !isExcerptExpanded);
  };

  const fullText = review.text ?? "No review text is available";
  const shortText =
    fullText.length >= REVIEW_EXCERPT_CUTOFF
      ? fullText.substr(0, fullText.lastIndexOf(" ", REVIEW_EXCERPT_CUTOFF)) +
        "…"
      : fullText;

  const header = (
    <header className={styles.header}>
      <div className={styles.info}>
        <div className={styles.userInfo}>
          <UserLink className={styles.userLink} user={review.author}>
            <div className={styles.userPic}>
              <UserPicture user={review.author} />
            </div>
          </UserLink>
          <div>
            <UserLink className={styles.userLink} user={review.author}>
              {review.author.username}
            </UserLink>
            <br />
            <small>Reviews posted: {review.author.reviewed_level_count}</small>
          </div>
        </div>
      </div>

      {review.last_user_content_updated ? (
        <small>
          Updated on: {formatDate(review.last_user_content_updated)}
        </small>
      ) : null}

      <small>Posted on: {formatDate(review.created)}</small>

      <BurgerMenu>
        <PermissionGuard
          require={UserPermission.editReviews}
          owningUsers={[review.author]}
        >
          <ReviewEditButton review={review} />
        </PermissionGuard>
        <PermissionGuard require={UserPermission.deleteReviews}>
          <ReviewDeleteButton review={review} />
        </PermissionGuard>
      </BurgerMenu>
    </header>
  );

  return (
    <div className={classNames.join(" ")}>
      {header}

      <div className={`${styles.content} ChildMarginClear`}>
        {showLevels ? (
          <p>
            Review on <LevelLink level={review.level} />
          </p>
        ) : null}

        {showExcerpts && shortText !== fullText ? (
          <>
            <Markdown allowColors={false}>
              {isExcerptExpanded ? fullText : shortText}
            </Markdown>
            <Link onClick={handleReadMoreClick}>
              ({isExcerptExpanded ? "Read less" : "Read more"})
            </Link>
          </>
        ) : (
          <Markdown allowColors={false}>
            {review.text || "No review text is available."}
          </Markdown>
        )}
      </div>
    </div>
  );
};

export { ReviewsListItem };
