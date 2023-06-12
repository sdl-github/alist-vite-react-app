import React from "react";
import { RecoilRoot } from "recoil";

function RecoilRootProvider({ children }: React.PropsWithChildren) {

  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
}

export default RecoilRootProvider;
