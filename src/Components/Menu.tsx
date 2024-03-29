import * as React from "react";
import { InView } from "react-intersection-observer";

export const MenuContext = React.createContext({
  sections: {},
  setSectionInView: function (sectionId: string, inView: boolean) {}
});

export const useIsSectionActive = (id: string) => {
  const activeSection = useActiveSectionId();
  return id === activeSection;
};

export const useActiveSectionId = () => {
  const { sections } = React.useContext(MenuContext);
  return Object.keys(sections).find((sectionId) => {
    return sections[sectionId];
  });
};
export const MenuWrapper = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = React.useState({});

  function setSectionInView(sectionId: string, inView: boolean) {
    setSections({
      ...sections,
      [sectionId]: inView
    });
  }
  return (
    <MenuContext.Provider value={{ sections, setSectionInView }}>
      {children}
    </MenuContext.Provider>
  );
};

type NavItemProps = {
  children: React.ReactNode;
  isActive?: boolean;
  id: string;
  onClick?: () => void;
};

const NavItem = ({ isActive, children, onClick, id }: NavItemProps) => {
  const bgColor = isActive ? "red" : "white";

  return (
    <li style={{ backgroundColor: bgColor }} onClick={onClick}>
      <a href={`#${id}`}>{children}</a>
    </li>
  );
};

type MenuItemProps = {
  children: React.ReactNode;
  id: string;
};

export const MenuItem = ({ children, id }: MenuItemProps) => {
  const isActive = useIsSectionActive(id);

  return (
    <NavItem id={id} isActive={isActive}>
      {children}
    </NavItem>
  );
};

type SectionProps = {
  children?: React.ReactNode;
  id: string;
};

export const Section = ({ id, children }: SectionProps) => {
  const { setSectionInView } = React.useContext(MenuContext);
  const isSectionActive = useIsSectionActive(id);

  const bgColor = isSectionActive ? "red" : "black";
  // it seems like a margin of 1px is required for the section to become active on url change
  return (
    <InView
      id={id}
      as="section"
      className="Section"
      threshold={0}
      onChange={(inView, entry) => {
        console.log(`${id} is ${inView ? "" : "not"} inView`);
        setSectionInView(id, inView);
      }}
      style={{ color: bgColor, margin: "1px 0" }}
    >
      <h1>{id}</h1>
      {children}
    </InView>
  );
};
