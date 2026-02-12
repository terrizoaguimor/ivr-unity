import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PaginationExample from "../../components/ui/pagination";
import PageMeta from "../../components/common/PageMeta";

export default function Pagination() {
  return (
    <div>
      <PageMeta
        title="React.js  Pagination | Unity Financial Network"
        description="This is React.js Pagination  page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Pagination" />
      <PaginationExample />
    </div>
  );
}
