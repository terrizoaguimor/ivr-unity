import ImageGeneratorContent from "../../components/ai/ImageGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function ImageGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Image Generator  | Unity Financial Network"
        description="This is React.js Image Generator  page for Unity Financial Network"
      />
      <GeneratorLayout>
        <ImageGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
