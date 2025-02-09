import styles from "./index.module.css";
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
      {!!level.screenshots.length && (
        <div className={styles.thumbnailsWrapper}>
          <MediumThumbnails
            useBackgroundBlur={true}
            displayMode={DisplayMode.Contain}
            files={level.screenshots
              .filter((screenshot) => !!screenshot.file)
              .map((screenshot) => screenshot.file as UploadedFile)}
            links={showcaseLinks}
          />
        </div>
      )}

      <Markdown allowColors={false}>
        {level.description || "This level has no description yet."}
      </Markdown>
    </>
  );
};

export { LevelOverviewTab };
