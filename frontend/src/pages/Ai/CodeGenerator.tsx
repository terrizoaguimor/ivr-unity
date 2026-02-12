import CodeGeneratorContent from "../../components/ai/CodeGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function CodeGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Code Generator  | Unity Financial Network"
        description="This is React.js Code Generator  page for Unity Financial Network"
      />
      <GeneratorLayout>
        <CodeGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
