import { useQueryClient } from "react-query";
import { PushButton } from "src/components/PushButton";
import { IconCheck } from "src/components/icons";
import { UserService } from "src/services/UserService";
import type { UserBasic } from "src/services/UserService";
import { showAlertOnError } from "src/utils";
import { resetQueries } from "src/utils";

interface UserActivatePushButtonProps {
  user: UserBasic;
}

const UserActivatePushButton = ({ user }: UserActivatePushButtonProps) => {
  const queryClient = useQueryClient();

  const handleActivateButtonClick = () => {
    if (!window.confirm("Are you sure you want to activate this user?")) {
      return;
    }
    showAlertOnError(async () => {
      await UserService.activate(user.id);
      resetQueries(queryClient, ["user", "users", "auditLogs"]);
    });
  };

  return (
    <PushButton icon={<IconCheck />} onClick={handleActivateButtonClick}>
      Activate
    </PushButton>
  );
};

export { UserActivatePushButton };
