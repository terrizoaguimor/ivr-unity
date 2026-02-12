import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ButtonGroupExample from "../../components/ui/buttons-group";
import PageMeta from "../../components/common/PageMeta";

export default function ButtonsGroup() {
  return (
    <div>
      <PageMeta
        title="React.js Buttons Group Dashboard | Unity Financial Network"
        description="This is React.js Buttons Group Dashboard page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Buttons Group" />
      <ButtonGroupExample />
    </div>
  );
}
