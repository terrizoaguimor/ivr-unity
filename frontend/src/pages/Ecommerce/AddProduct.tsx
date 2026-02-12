import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddProductForm from "../../components/ecommerce/AddProductForm";

export default function AddProduct() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Add Product Dashboard | Unity Financial Network"
        description="This is React.js E-commerce Add Product Dashboard page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Add Product" />
      <AddProductForm />
    </>
  );
}
