import PageMeta from "../../components/common/PageMeta";
import TextGeneratorContent from "../../components/ai/TextGeneratorContent";
import GeneratorLayout from "./GeneratorLayout";

export default function TextGeneratorPage() {
  return (
    <>
      <PageMeta
        title="React.js AI Text Generator  | Unity Financial Network"
        description="This is React.js Text Generator  page for Unity Financial Network"
      />
      <GeneratorLayout>
        <TextGeneratorContent />
      </GeneratorLayout>
    </>
  );
}
