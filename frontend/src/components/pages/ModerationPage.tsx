import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import type { AuditLogSearchQuery } from "src/services/auditLog.service";
import { AuditLogTable } from "src/shared/components/AuditLogTable";
import { InfoMessage } from "src/shared/components/InfoMessage";
import { InfoMessageType } from "src/shared/components/InfoMessage";
import { SectionHeader } from "src/shared/components/Section";
import { TitleContext } from "src/shared/contexts/TitleContext";

const ModerationPage = () => {
  const { setTitle } = useContext(TitleContext);
  const [searchQuery, setSearchQuery] = useState<AuditLogSearchQuery>({
    isReviewed: false,
    page: null,
    sort: "-created",
    search: null,
  });

  useEffect(() => {
    setTitle("moderate");
  }, [setTitle]);

  return (
    <div id="ModerationPage">
      <InfoMessage type={InfoMessageType.Info}>
        The log contains recent changes made by all users. All these changes are
        already live.
        <br />
        Click "Mark as read" if the change doesn't need further action and can
        be hidden from everyone's audit log.
        <br />
        New levels can be approved on the individual level page.
      </InfoMessage>
      <SectionHeader>Recent actions</SectionHeader>
      <AuditLogTable
        showObjects={true}
        showApprovalButton={true}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </div>
  );
};

export { ModerationPage };
