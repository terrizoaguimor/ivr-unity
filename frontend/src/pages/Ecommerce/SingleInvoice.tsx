import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import InvoiceMain from "../../components/invoice/InvoiceMain";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Single Invoice | Unity Financial Network"
        description="This is React.js E-commerce Single Invoice page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Single Invoice" />
      <InvoiceMain />
    </>
  );
}
