import "./TagsTable.css";
import { useQuery } from "react-query";
import type { TagListing } from "src/services/tag.service";
import type { TagSearchQuery } from "src/services/tag.service";
import { TagService } from "src/services/tag.service";
import type { DataTableColumn } from "src/shared/components/DataTable";
import { DataTable } from "src/shared/components/DataTable";
import { Loader } from "src/shared/components/Loader";
import { PushButton } from "src/shared/components/PushButton";
import { TagLink } from "src/shared/components/links/TagLink";
import { formatDate } from "src/shared/utils";

interface TagsTableProps {
  searchQuery: TagSearchQuery;
  onSearchQueryChange?: ((searchQuery: TagSearchQuery) => void) | undefined;
}

interface TagsTableDetailsProps {
  tag: TagListing;
}

const TagsTableDetails = ({ tag }: TagsTableDetailsProps) => {
  const result = useQuery<TagListing[], Error>(
    ["tag", TagService.getStats, tag.id],
    async () => TagService.getStats(+tag.id)
  );

  if (result.isLoading || !result.data) {
    return <Loader />;
  }

  return (
    <>
      <p>
        <TagLink tag={tag}>{tag.level_count} levels</TagLink> use this tag.
      </p>
      {result.data.length > 0 ? (
        <>
          <p>Used with:</p>
          <ul>
            {result.data.map((tag) => (
              <li key={tag.id}>
                <TagLink tag={tag} />: {tag.level_count}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Not used with other tags.</p>
      )}
    </>
  );
};

const TagsTable = ({ searchQuery, onSearchQueryChange }: TagsTableProps) => {
  const columns: DataTableColumn<TagListing>[] = [
    {
      name: "name",
      sortKey: "name",
      label: "Name",
      itemElement: ({ item, toggleActive }) => (
        <PushButton isPlain={true} disableTimeout={true} onClick={toggleActive}>
          {item.name}
        </PushButton>
      ),
    },
    {
      name: "level-count",
      sortKey: "level_count",
      label: "Usages",
      itemElement: ({ item }) => `${item.level_count}`,
    },
    {
      name: "created",
      sortKey: "created",
      label: "Created",
      itemElement: ({ item }) => formatDate(item.created),
    },
    {
      name: "updated",
      sortKey: "last_updated",
      label: "Updated",
      itemElement: ({ item }) => formatDate(item.last_updated),
    },
  ];

  const itemKey = (tag: TagListing) => `${tag.id}`;

  return (
    <DataTable
      className="TagsTable"
      queryName="tags"
      columns={columns}
      itemKey={itemKey}
      detailsElement={(item) => <TagsTableDetails tag={item} />}
      searchQuery={searchQuery}
      searchFunc={TagService.searchTags}
      onSearchQueryChange={onSearchQueryChange}
    />
  );
};

export { TagsTable };
