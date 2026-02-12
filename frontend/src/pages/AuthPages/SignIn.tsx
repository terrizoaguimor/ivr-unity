import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | Unity Financial Network"
        description="This is React.js SignIn Tables Dashboard page for Unity Financial Network"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
