import ApiKeyTable from "../../components/api-keys/ApiKeyTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ApiKeys() {
  return (
    <div>
      <PageMeta
        title="React.js API Keys Page | Unity Financial Network"
        description="This is React.js  API Keys page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="API Keys" />
      <ApiKeyTable />
    </div>
  );
}
