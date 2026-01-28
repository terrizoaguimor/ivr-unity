import { Header } from "@/components/dashboard/header";
import { TranscriptsList } from "@/components/transcripts/transcripts-list";

export default function TranscriptsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Header
        title="Transcripciones"
        subtitle="Historial de conversaciones con el agente AI"
      />

      <div className="p-6">
        <TranscriptsList />
      </div>
    </div>
  );
}
