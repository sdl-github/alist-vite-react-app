import request from "@/lib/request"
import { FsListResp } from "@/lib/types/resp"
import { objState } from "@/store/obj"
import { serverApiState } from "@/store/server"
import { useState } from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import useSWR from "swr"

export function FilePreview() {
    const [params, setParams] = useState({
        password: '',
    })
    const [state, setState] = useRecoilState(objState)
    const serverApi = useRecoilValue(serverApiState)
    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/get` : null, (): Promise<FsListResp> => {
        return request.post(`${serverApi}/api/fs/get`, {
            ...params,
            path: state.path
        })
    })

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    FilePreview
                </div>
            </div>
        </>
    )
}