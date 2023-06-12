
import useScroll from "@/lib/hooks/use-scroll";
import { useRecoilValue } from "recoil";
import { useConnectServerModal } from "./connect-server-modal";
import { serverApiState } from "@/store/server";

export default function NavBar() {
  const { modal: ConnectServerModal, setShow } = useConnectServerModal();
  const scrolled = useScroll(50);
  const serverApi = useRecoilValue(serverApiState);
 
  return (
    <>
      <ConnectServerModal />
      <div
        className={`fixed top-0 w-full ${scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
          : "bg-white/0"
          } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <div className="flex items-center font-display text-2xl">
            <p className="mr-2 rounded-sm">🗂️</p>
            <p>FList</p>
          </div>
          <div>
            <button
              className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
              onClick={() => setShow(true)}
            >
              {serverApi ? serverApi : '新建服务器'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
