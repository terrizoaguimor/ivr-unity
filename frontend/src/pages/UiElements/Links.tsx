import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LinksExample from "../../components/links";
import PageMeta from "../../components/common/PageMeta";

export default function Links() {
  return (
    <>
      <PageMeta
        title="React.js Links Dashboard | Unity Financial Network"
        description="This is React.js Links page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Links" />
      <LinksExample />
    </>
  );
}
