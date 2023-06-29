import "./index.css";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Loader } from "src/components/common/Loader";
import { PageGuard } from "src/components/common/PermissionGuard";
import { WalkthroughForm } from "src/components/common/WalkthroughForm";
import { PlainLayout } from "src/components/layouts/PlainLayout";
import { LevelLink } from "src/components/links/LevelLink";
import { usePageMetadata } from "src/contexts/PageMetadataContext";
import type { LevelDetails } from "src/services/LevelService";
import { LevelService } from "src/services/LevelService";
import { UserPermission } from "src/services/UserService";
import type { WalkthroughDetails } from "src/services/WalkthroughService";
import { WalkthroughService } from "src/services/WalkthroughService";

interface WalkthroughEditPageParams {
  levelId: string;
  walkthroughId: string;
}

const WalkthroughEditPage = () => {
  const {
    levelId,
    walkthroughId,
  } = (useParams() as unknown) as WalkthroughEditPageParams;

  const levelResult = useQuery<LevelDetails | undefined, Error>(
    ["level", LevelService.getLevelById, levelId],
    async () => (levelId ? LevelService.getLevelById(+levelId) : undefined)
  );

  const walkthroughResult = useQuery<WalkthroughDetails | undefined, Error>(
    ["walkthrough", WalkthroughService.getWalkthroughById, walkthroughId],
    async () =>
      walkthroughId
        ? WalkthroughService.getWalkthroughById(+walkthroughId)
        : undefined
  );

  usePageMetadata(
    () => ({
      ready: !levelResult.isLoading && !walkthroughResult.isLoading,
      title: levelResult?.data?.name
        ? `Walkthrough for ${levelResult.data.name}`
        : "Walkthrough",
    }),
    [walkthroughResult, levelResult]
  );

  if (levelResult.error) {
    return <p>{levelResult.error.message}</p>;
  }
  if (walkthroughResult.error) {
    return <p>{walkthroughResult.error.message}</p>;
  }

  if (levelResult.isLoading || walkthroughResult.isLoading) {
    return <Loader />;
  }

  const level = levelResult.data;
  const walkthrough = walkthroughResult?.data;

  if (!level && !walkthrough) {
    return <p>Invalid action.</p>;
  }

  return (
    <PageGuard
      require={
        walkthrough
          ? UserPermission.editWalkthroughs
          : UserPermission.postWalkthroughs
      }
      owningUserIds={walkthrough?.author ? [walkthrough.author.id] : []}
    >
      <PlainLayout>
        {level ? (
          <h1>
            {" "}
            Walkthrough for <LevelLink level={level} />
          </h1>
        ) : walkthrough?.level ? (
          <h1>
            {" "}
            Walkthrough for <LevelLink level={walkthrough.level} />
          </h1>
        ) : (
          <h1>Walkthrough</h1>
        )}

        <WalkthroughForm
          walkthrough={walkthrough || undefined}
          level={level || walkthrough?.level}
        />
      </PlainLayout>
    </PageGuard>
  );
};

export { WalkthroughEditPage };
