import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ListExample from "../../components/list";

export default function Lists() {
  return (
    <>
      <PageMeta
        title="React.js List Dashboard | Unity Financial Network"
        description="This is React.js List page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Lists" />
      <ListExample />
    </>
  );
}
