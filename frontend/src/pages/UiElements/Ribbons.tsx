import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RibbonExample from "../../components/ui/ribbons";
import PageMeta from "../../components/common/PageMeta";

export default function Ribbons() {
  return (
    <div>
      <PageMeta
        title="React.js List Ribbons | Unity Financial Network"
        description="This is React.js Ribbons page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Ribbons" />
      <RibbonExample />
    </div>
  );
}
