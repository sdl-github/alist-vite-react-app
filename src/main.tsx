import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import './index.css'
import RecoilRootProvider from './components/layout/recoil-root-provider.tsx'
import SwrProvider from './components/layout/swr-provider.tsx'
import router from './Router.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRootProvider>
      <SwrProvider>
        <RouterProvider router={router}/>
      </SwrProvider>
    </RecoilRootProvider>
  </React.StrictMode>,
)
