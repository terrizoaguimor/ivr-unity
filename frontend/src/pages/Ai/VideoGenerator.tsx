import VideoGeneratorContent from "../../components/ai/VideoGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function VideoGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Video Generator  | Unity Financial Network"
        description="This is React.js Video Generator  page for Unity Financial Network"
      />
      <GeneratorLayout>
        <VideoGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
