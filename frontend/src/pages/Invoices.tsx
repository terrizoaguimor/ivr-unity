import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Invoice from "../components/invoice/Invoice";
import PageMeta from "../components/common/PageMeta";

export default function Invoices() {
  return (
    <div>
      <PageMeta
        title="React.js Invoices Dashboard | Unity Financial Network"
        description="This is React.js Invoices Dashboard page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Invoices" />
      <Invoice />
    </div>
  );
}
