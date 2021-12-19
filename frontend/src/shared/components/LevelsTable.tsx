import "./LevelsTable.css";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Pager from "src/components/Pager";
import { ILevelList } from "src/services/level.service";
import { ILevelQuery } from "src/services/level.service";
import { LevelService } from "src/services/level.service";
import Loader from "src/shared/components/Loader";
import SortLink from "src/shared/components/SortLink";
import { formatDate } from "src/shared/utils";
import { formatFileSize } from "src/shared/utils";
import { EMPTY_INPUT_PLACEHOLDER } from "src/shared/utils";

const LevelsTable = ({ query }: { query: ILevelQuery | null }) => {
  const levelsQuery = useQuery<ILevelList, Error>(["levels", query], async () =>
    LevelService.getLevels(query)
  );

  if (levelsQuery.error) {
    return <p>{levelsQuery.error.message}</p>;
  }

  if (levelsQuery.isLoading || !levelsQuery.data) {
    return <Loader />;
  }

  return (
    <>
      <table className="LevelsTable borderless">
        <thead>
          <tr>
            <th className="LevelsTable--name">
              <SortLink sort={"name"}>Name</SortLink>
            </th>
            <th>Genres</th>
            <th className="LevelsTable--genres">Author(s)</th>
            <th className="LevelsTable--engine">
              <SortLink sort={"engine_name"}>Engine</SortLink>
            </th>
            <th className="LevelsTable--created">
              <SortLink sort={"created"}>Created</SortLink>
            </th>
            <th
              className="LevelsTable--updated"
              title="Date of last file upload"
            >
              <SortLink sort={"last_file_created"}>Last updated</SortLink>
            </th>
            <th className="LevelsTable--size">
              <SortLink sort={"last_file_size"}>Size</SortLink>
            </th>
            <th className="LevelsTable--download">Download</th>
          </tr>
        </thead>
        <tbody>
          {levelsQuery.data.results.map((level) => (
            <tr key={level.id}>
              <td className="LevelsTable--name">{level.name}</td>
              <td className="LevelsTable--genres">
                {level.genres.map((tag) => tag.name).join(", ") || "N/A"}
              </td>
              <td
                className="LevelsTable--author"
                title={
                  level.authors.length > 1
                    ? level.authors.map((author) => author.username).join(", ")
                    : null
                }
              >
                {(level.authors.length > 1
                  ? "Multiple authors"
                  : level.authors[0]?.username) || EMPTY_INPUT_PLACEHOLDER}
              </td>
              <td className="LevelsTable--engine">{level.engine.name}</td>
              <td className="LevelsTable--created">
                {formatDate(level.created)}
              </td>
              <td className="LevelsTable--updated">
                {formatDate(level.last_file_created)}
              </td>
              <td className="LevelsTable--size">
                {formatFileSize(level.last_file_size)}
              </td>
              <td className="LevelsTable--download">
                {level.last_file_id ? (
                  <Link
                    target="_blank"
                    to={`/api/level_files/${level.last_file_id}/download`}
                  >
                    Download
                  </Link>
                ) : (
                  <>{EMPTY_INPUT_PLACEHOLDER}</>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="LevelList--pager">
        <Pager pagedResponse={levelsQuery.data} />
      </div>
    </>
  );
};

export default LevelsTable;
