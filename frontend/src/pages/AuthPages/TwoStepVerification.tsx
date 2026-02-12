import OtpForm from "../../components/auth/OtpForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function TwoStepVerification() {
  return (
    <>
      <PageMeta
        title="React.js Two Step Verification Dashboard | Unity Financial Network"
        description="This is React.js Two Step Verification Tables Dashboard page for Unity Financial Network"
      />
      <AuthLayout>
        <OtpForm />
      </AuthLayout>
    </>
  );
}
