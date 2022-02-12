import { Formik } from "formik";
import { Form } from "formik";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import type { AuditLogSearchQuery } from "src/services/auditLog.service";
import { AuditLogTable } from "src/shared/components/AuditLogTable";
import { InfoMessage } from "src/shared/components/InfoMessage";
import { InfoMessageType } from "src/shared/components/InfoMessage";
import { QueryPersister } from "src/shared/components/QueryPersister";
import { deserializeGenericSearchQuery } from "src/shared/components/QueryPersister";
import { serializeGenericSearchQuery } from "src/shared/components/QueryPersister";
import { SearchBar } from "src/shared/components/SearchBar";
import { SectionHeader } from "src/shared/components/Section";
import { TextFormField } from "src/shared/components/formfields/TextFormField";
import { TitleContext } from "src/shared/contexts/TitleContext";
import { getCurrentSearchParams } from "src/shared/utils";

const defaultSearchQuery: AuditLogSearchQuery = {
  isReviewed: false,
  page: null,
  sort: "-created",
  search: null,
};

const deserializeSearchQuery = (qp: {
  [key: string]: string;
}): AuditLogSearchQuery =>
  deserializeGenericSearchQuery(qp, defaultSearchQuery);

const serializeSearchQuery = (
  searchQuery: AuditLogSearchQuery
): { [key: string]: any } =>
  serializeGenericSearchQuery(searchQuery, defaultSearchQuery);

const convertSearchQueryToFormikValues = (searchQuery: AuditLogSearchQuery) => {
  return { search: searchQuery.search || "" };
};

const ModerationPage = () => {
  const { setTitle } = useContext(TitleContext);
  const [searchQuery, setSearchQuery] = useState<AuditLogSearchQuery>(
    deserializeSearchQuery(getCurrentSearchParams())
  );
  const [formikValues, setFormikValues] = useState<any>(
    convertSearchQueryToFormikValues(searchQuery)
  );

  useEffect(() => {
    setTitle("Moderate");
  }, [setTitle]);

  useEffect(
    () => setFormikValues(convertSearchQueryToFormikValues(searchQuery)),
    [searchQuery]
  );

  const handleSubmit = useCallback(
    // push changes to query on Formik submit
    async (values: any) => {
      setSearchQuery({
        ...searchQuery,
        page: null,
        search: values.search || null,
      });
    },
    [searchQuery, setSearchQuery]
  );

  const handleReset = useCallback(
    async (resetForm) => {
      setSearchQuery(defaultSearchQuery);
      resetForm();
    },
    [setSearchQuery]
  );

  return (
    <div id="ModerationPage">
      <QueryPersister
        serializeSearchQuery={serializeSearchQuery}
        deserializeSearchQuery={deserializeSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Formik
        enableReinitialize={true}
        initialValues={formikValues}
        onSubmit={handleSubmit}
      >
        {({ resetForm }: { resetForm: any }) => (
          <Form id="ModerationPage--container">
            <InfoMessage type={InfoMessageType.Info}>
              The log contains recent changes made by all users. All these
              changes are already live.
              <br />
              New levels and users can be approved on their individual pages.
            </InfoMessage>

            <SearchBar id="ModerationPage--search">
              <TextFormField label="Search" name="search" />

              <div className="FormField">
                <button type="submit">Search</button>
              </div>

              <div className="FormField">
                <button
                  onClick={handleReset.bind(null, resetForm)}
                  type="reset"
                >
                  Reset
                </button>
              </div>
            </SearchBar>

            <div id="ModerationPage--results">
              <SectionHeader>Recent actions</SectionHeader>
              <AuditLogTable
                showObjects={true}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export { ModerationPage };
