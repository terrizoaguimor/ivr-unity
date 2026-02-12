import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProductListTable from "../../components/ecommerce/ProductListTable";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Products | Unity Financial Network"
        description="This is React.js E-commerce Products  page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Product List" />
      <ProductListTable />
    </>
  );
}
