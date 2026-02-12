import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TransactionList from "../../components/ecommerce/TransactionList";

export default function Transactions() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Single Invoice | Unity Financial Network"
        description="This is E-commerce React.js Single Invoice  page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Transactions" />
      <TransactionList />
    </>
  );
}
