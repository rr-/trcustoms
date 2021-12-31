import "./LevelListPage.css";
import { Formik } from "formik";
import { Form } from "formik";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import EnginesCheckboxes from "src/components/EnginesCheckboxes";
import GenresCheckboxes from "src/components/GenresCheckboxes";
import TagsCheckboxes from "src/components/TagsCheckboxes";
import type { LevelSearchQuery } from "src/services/level.service";
import LevelsTable from "src/shared/components/LevelsTable";
import { QueryPersister } from "src/shared/components/QueryPersister";
import { SearchBar } from "src/shared/components/SearchBar";
import TextFormField from "src/shared/components/TextFormField";
import { filterFalsyObjectValues } from "src/shared/utils";

const defaultSearchQuery: LevelSearchQuery = {
  page: null,
  sort: null,
  search: "",
  tags: [],
  genres: [],
  engines: [],
  authors: [],
};

const deserializeSearchQuery = (search: string): LevelSearchQuery => {
  const currentURL = new URL(search);
  const qp = Object.fromEntries(currentURL.searchParams);
  return {
    page: +qp.page || null,
    sort: qp.sort || "-created",
    search: qp.search || "",
    tags: (qp.tags?.split(/,/g) || []).map((item) => +item),
    genres: (qp.genres?.split(/,/g) || []).map((item) => +item),
    engines: (qp.engines?.split(/,/g) || []).map((item) => +item),
    authors: [],
  };
};

const serializeSearchQuery = (searchQuery: LevelSearchQuery) => {
  const qp = filterFalsyObjectValues({
    page: searchQuery.page,
    sort: searchQuery.sort,
    search: searchQuery.search,
    tags: searchQuery.tags.join(","),
    genres: searchQuery.genres.join(","),
    engines: searchQuery.engines.join(","),
  }) as any;
  return "?" + new URLSearchParams(qp).toString();
};

const convertSearchQueryToFormikValues = (searchQuery: LevelSearchQuery) => {
  return {
    search: searchQuery.search,
    tags: searchQuery.tags,
    genres: searchQuery.genres,
    engines: searchQuery.engines,
  };
};

const LevelListPage = () => {
  const [searchQuery, setSearchQuery] = useState<LevelSearchQuery>(
    deserializeSearchQuery(window.location.href)
  );
  const [formikValues, setFormikValues] = useState<any>(
    convertSearchQueryToFormikValues(searchQuery)
  );

  useEffect(
    () => setFormikValues(convertSearchQueryToFormikValues(searchQuery)),
    [searchQuery]
  );

  const searchClick = useCallback(
    // push changes to query on Formik submit
    async (values: any) => {
      setSearchQuery({
        ...searchQuery,
        page: null,
        search: values.search,
        tags: values.tags,
        genres: values.genres,
        engines: values.engines,
      });
    },
    [searchQuery, setSearchQuery]
  );

  const clearClick = useCallback(
    async (resetForm) => {
      setSearchQuery(defaultSearchQuery);
      resetForm();
    },
    [setSearchQuery]
  );

  return (
    <div id="LevelListPage">
      <QueryPersister
        serializeSearchQuery={serializeSearchQuery}
        deserializeSearchQuery={deserializeSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Formik
        enableReinitialize={true}
        initialValues={formikValues}
        onSubmit={searchClick}
      >
        {({ resetForm }: { resetForm: any }) => (
          <Form id="LevelListPage--container">
            <SearchBar id="LevelListPage--search">
              <TextFormField label="Search" name="search" />

              <div className="FormField">
                <button type="submit">Search</button>
              </div>

              <div className="FormField">
                <button onClick={clearClick.bind(null, resetForm)} type="reset">
                  Reset
                </button>
              </div>
            </SearchBar>

            <div id="LevelListPage--results">
              <LevelsTable
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            </div>

            <aside id="LevelListPage--sidebar">
              <TagsCheckboxes />
              <GenresCheckboxes />
              <EnginesCheckboxes />
            </aside>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LevelListPage;
