import React, { FunctionComponent, PropsWithChildren } from "react";

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default PrivateLayout;
