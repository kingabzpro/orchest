// @ts-check
import React from "react";
import { MDCDrawer } from "@material/drawer";
import { useOrchest } from "@/hooks/orchest";
import {
  getViewDrawerParentViewName,
  nameToComponent,
} from "../utils/webserver-utils";

export interface IMainDrawerProps {
  selectedElement: string;
}

type TMainDrawerItem = Record<"label" | "icon" | "view" | "href", string>;

const items: TMainDrawerItem[][] = [
  [
    {
      label: "Pipelines",
      icon: "device_hub",
      view: "PipelinesView",
      href: "/pipelines",
    },
    { label: "Jobs", icon: "pending_actions", view: "JobsView", href: "/jobs" },
    {
      label: "Environments",
      icon: "view_comfy",
      view: "EnvironmentsView",
      href: "/environments",
    },
  ],
  [
    {
      label: "Projects",
      icon: "format_list_bulleted",
      view: "ProjectsView",
      href: "/projects",
    },
    {
      label: "File manager",
      icon: "folder_open",
      view: "FileManagerView",
      href: "/file-manager",
    },
    {
      label: "Settings",
      icon: "settings",
      view: "SettingsView",
      href: "/settings",
    },
  ],
];

const MainDrawer: React.FC<IMainDrawerProps> = (props) => {
  const context = useOrchest();

  const drawerRef = React.useRef(null);
  const [drawer, setDrawer] = React.useState(null);
  const drawerIsMounted = drawerRef && drawer != null;

  const { orchest } = window;

  const setDrawerSelectedElement = (viewName) => {
    if (drawerIsMounted) {
      // resolve mapped parent view
      const rootViewName = getViewDrawerParentViewName(viewName);

      const selectedView = drawer?.list?.listElements
        ?.map((listElement, i) => ({
          index: i,
          view: listElement.attributes.getNamedItem("data-react-view")?.value,
        }))
        ?.find((listElement) => listElement.view === rootViewName);

      drawer.list.selectedIndex =
        typeof selectedView?.index === "number" ? selectedView.index : -1;
    }
  };

  React.useEffect(() => {
    setDrawerSelectedElement(props.selectedElement);
  }, [props?.selectedElement]);

  React.useEffect(() => {
    if (drawerIsMounted) {
      drawer.open = context.state.drawerIsOpen;

      if (
        context.state?.config?.CLOUD === true &&
        window.Intercom !== undefined
      ) {
        // show Intercom widget
        window.Intercom("update", {
          hide_default_launcher: !context.state?.drawerIsOpen,
        });
      }
    }
  }, [context.state.drawerIsOpen]);

  React.useEffect(() => {
    if (drawerRef.current) {
      const initMDCDrawer = new MDCDrawer(drawerRef.current);

      initMDCDrawer.open = context.state.drawerIsOpen;
      initMDCDrawer.list.singleSelection = true;

      initMDCDrawer.listen("MDCDrawer:opened", () => {
        document.body.focus();
      });

      setDrawer(initMDCDrawer);
    }
  }, []);

  return (
    <aside
      ref={drawerRef}
      data-test-id="main-drawer"
      className="mdc-drawer mdc-drawer--dismissible"
    >
      <div className="mdc-drawer__content">
        <nav className="mdc-list">
          {items
            .map((group) =>
              group.map((item) => {
                return (
                  <a
                    key={item.view}
                    data-test-id="main-drawer-item"
                    data-react-view={item.view}
                    className="mdc-list-item"
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      orchest.loadView(nameToComponent(item.view));
                    }}
                  >
                    <span className="mdc-list-item__ripple" />
                    <i
                      className="material-icons mdc-list-item__graphic"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </i>
                    <span className="mdc-list-item__text">{item.label}</span>
                  </a>
                );
              })
            )
            .reduce(
              (acc, cv, i) =>
                acc === null ? (
                  cv
                ) : (
                  <React.Fragment key={`mainDrawerGroup-${i}`}>
                    {acc}
                    <hr role="separator" className="mdc-list-divider" />
                    {cv}
                  </React.Fragment>
                ),
              null
            )}
        </nav>
      </div>
    </aside>
  );
};

export default MainDrawer;
