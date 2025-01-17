import * as React from "react";
import type { TViewProps } from "@/types";
import { useOrchest } from "@/hooks/orchest";
import { Layout } from "@/components/Layout";
import JobList from "@/components/JobList";
import ProjectBasedView, {
  IProjectBasedViewProps,
} from "@/components/ProjectBasedView";

export interface IJobsViewProps extends TViewProps, IProjectBasedViewProps {}

const JobsView: React.FC<IJobsViewProps> = (props) => {
  const { dispatch } = useOrchest();

  React.useEffect(() => {
    dispatch({ type: "setView", payload: "jobs" });
    return () => dispatch({ type: "clearView" });
  }, []);

  return (
    <Layout>
      <ProjectBasedView project_uuid={props.project_uuid} childView={JobList} />
    </Layout>
  );
};

export default JobsView;
