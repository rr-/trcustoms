import { InfoMessage } from "src/components/common/InfoMessage";
import { InfoMessageType } from "src/components/common/InfoMessage";
import { MediumThumbnails } from "src/components/common/MediumThumbnails";
import { Markdown } from "src/components/markdown/Markdown";
import type { UploadedFile } from "src/services/FileService";
import type { LevelDetails } from "src/services/LevelService";
import { ExternalLinkType } from "src/services/LevelService";
import { DisplayMode } from "src/types";

interface LevelOverviewTabProps {
  level: LevelDetails;
}

const LevelOverviewTab = ({ level }: LevelOverviewTabProps) => {
  const showcaseLinks = level.external_links
    .filter((link) => link.link_type === ExternalLinkType.Showcase)
    .map((link) => link.url);

  return (
    <>
      {level.is_approved || (
        <InfoMessage type={InfoMessageType.Warning}>
          {level.rejection_reason ? (
            <>
              This level was rejected by staff. Reason: {level.rejection_reason}
            </>
          ) : (
            <>This level is currently pending approval.</>
          )}
        </InfoMessage>
      )}

      {!!level.screenshots.length && (
        <MediumThumbnails
          displayMode={DisplayMode.Contain}
          files={level.screenshots
            .filter((screenshot) => !!screenshot.file)
            .map((screenshot) => screenshot.file as UploadedFile)}
          links={showcaseLinks}
        />
      )}

      <hr />

      <Markdown>
        {level.description || "This level has no description yet."}
      </Markdown>
    </>
  );
};

export { LevelOverviewTab };
