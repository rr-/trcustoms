import "./ReviewsList.css";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbDownIcon } from "@heroicons/react/outline";
import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";
import { useQuery } from "react-query";
import type { ReviewListing } from "src/services/review.service";
import { ReviewService } from "src/services/review.service";
import type { ReviewSearchResult } from "src/services/review.service";
import type { ReviewSearchQuery } from "src/services/review.service";
import { UserPermission } from "src/services/user.service";
import { Loader } from "src/shared/components/Loader";
import { Markdown } from "src/shared/components/Markdown";
import { PermissionGuard } from "src/shared/components/PermissionGuard";
import { PushButton } from "src/shared/components/PushButton";
import { SectionHeader } from "src/shared/components/SectionHeader";
import { UserPicture } from "src/shared/components/UserPicture";
import { LevelLink } from "src/shared/components/links/LevelLink";
import { UserLink } from "src/shared/components/links/UserLink";
import { formatDate } from "src/shared/utils";

interface ReviewsListProps {
  showLevels: boolean;
  searchQuery: ReviewSearchQuery;
  onSearchQueryChange?: ((searchQuery: ReviewSearchQuery) => void) | undefined;
}

interface ReviewViewProps {
  review: ReviewListing;
  showLevels: boolean;
}

const ReviewView = ({ review, showLevels }: ReviewViewProps) => {
  const classNames = ["Review"];

  const position = review.rating_class?.position || 0;
  let badge: React.ReactNode;
  if (position > 0) {
    classNames.push("positive");
    badge = (
      <>
        <ThumbUpIcon className="icon" />
        Recommended
      </>
    );
  } else if (position < 0) {
    classNames.push("negative");
    badge = (
      <>
        <ThumbDownIcon className="icon" />
        Not recommended
      </>
    );
  } else {
    classNames.push("neutral");
    badge = (
      <>
        <DotsCircleHorizontalIcon className="icon" />
        Neutral
      </>
    );
  }

  return (
    <div className={classNames.join(" ")}>
      <div className="Review--badge">{badge}</div>

      <div className="Review--content">
        {showLevels ? (
          <p className="ReviewsList--level">
            Review on <LevelLink level={review.level} />
          </p>
        ) : null}

        <Markdown children={review.text || "No review text is available."} />
      </div>

      <footer className="Review--footer">
        <UserLink className="Review--userLink" user={review.author}>
          <>
            <UserPicture className="Review--userPic" user={review.author} />
            {review.author.username}
          </>
        </UserLink>

        <dl className="Review--userInfo">
          <dt>Reviews</dt>
          <dd className="Review--userInfoDefinition">
            {review.author.reviewed_level_count}
          </dd>

          <dt>Posted</dt>
          <dd className="Review--userInfoDefinition">
            {formatDate(review.created)}
          </dd>
        </dl>

        <PermissionGuard
          require={UserPermission.editReviews}
          owningUsers={[review.author]}
        >
          <PushButton
            to={`/levels/${review.level.id}/review/${review.id}/edit`}
          >
            Edit review
          </PushButton>
        </PermissionGuard>
      </footer>
    </div>
  );
};

const ReviewsList = ({
  showLevels,
  searchQuery,
  onSearchQueryChange,
}: ReviewsListProps) => {
  const result = useQuery<ReviewSearchResult, Error>(
    ["reviews", ReviewService.searchReviews, searchQuery],
    async () => ReviewService.searchReviews(searchQuery)
  );

  if (result.error) {
    return <p>{result.error.message}</p>;
  }

  if (result.isLoading || !result.data) {
    return <Loader />;
  }

  const reviews = result.data.results.filter((review) => !!review.text);

  return (
    <>
      <SectionHeader>Reviews</SectionHeader>
      {reviews.length ? (
        reviews.map((review) => (
          <ReviewView key={review.id} review={review} showLevels={showLevels} />
        ))
      ) : (
        <p>There are no result to show.</p>
      )}
    </>
  );
};

export { ReviewsList };
