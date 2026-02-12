import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TaskListPage from "../../components/task/task-list/TaskListPage";

export default function TaskList() {
  return (
    <>
      <PageMeta
        title="React.js Task List Dashboard | Unity Financial Network"
        description="This is React.js Task List Dashboard page for Unity Financial Network"
      />
      <PageBreadcrumb pageTitle="Task List" />
      <TaskListPage />
    </>
  );
}
