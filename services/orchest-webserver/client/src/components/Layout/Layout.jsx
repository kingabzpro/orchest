// @ts-check
import React from "react";
import { OnboardingDialog } from "@/components/OnboardingDialog";

/** @type React.FC<{}> */
export const Layout = (props) => {
  return (
    <React.Fragment>
      <OnboardingDialog />
      {props.children}
    </React.Fragment>
  );
};