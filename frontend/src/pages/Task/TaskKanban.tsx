import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TaskHeader from "../../components/task/TaskHeader";
import KanbanBoard from "../../components/task/kanban/KanbanBoard";
import PageMeta from "../../components/common/PageMeta";

export default function TaskKanban() {
  return (
    <div>
      <PageMeta
        title="React.js Task Kanban Dashboard | Unity Financial Network"
        description="This is React.js Task Kanban Dashboard page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Kanban" />
      <div className="glass-card rounded-2xl">
        <TaskHeader />
        <KanbanBoard />
      </div>
    </div>
  );
}
