import React from "react";
import { SWRConfig } from 'swr'

function SwrProvider({ children }: React.PropsWithChildren) {

  return (
    <SWRConfig>
      {children}
    </SWRConfig>
  );
}

export default SwrProvider;
