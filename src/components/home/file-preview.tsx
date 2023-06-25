import request from "@/lib/request"
import { FsGetResp } from "@/lib/types/resp"
import { objState } from "@/store/obj"
import { serverApiState } from "@/store/server"
import { useEffect, useState } from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import useSWR from "swr"
import { Breadcrumb } from "../layout/breadcrumb"
import { Obj, ObjType } from "@/lib/types/obj"
import VideoPreview from "./video-preview"
import { NotPreview } from "./not-preview"
import LoadingSpinner from "../shared/icons/loading-spinner"
import { useHistoryRecord } from "@/lib/hooks/use-history-record"
import ImagePreview from "./image-preview"



export interface Preview {
    name: string
    type?: ObjType
    exts?: string[] | "*"
    provider?: RegExp
    component?: JSX.Element
}

export type PreviewComponent = Pick<Preview, "name" | "component">

const previews: Preview[] = [
    {
        name: "Aliyun Video Previewer",
        type: ObjType.VIDEO,
        provider: /^Aliyundrive(Open)?$/,
        component: <VideoPreview />
    },
    {
        name: "Markdown",
        type: ObjType.TEXT,
    },
    {
        name: "Markdown with word wrap",
        type: ObjType.TEXT,
    },
    {
        name: "Text Editor",
        type: ObjType.TEXT,
    },
    {
        name: "HTML render",
        exts: ["html"],
    },
    {
        name: "Image",
        type: ObjType.IMAGE,
        component: <ImagePreview />
    },
    {
        name: "Video",
        type: ObjType.VIDEO,
    },
    {
        name: "Audio",
        type: ObjType.AUDIO,
    },
    {
        name: "Ipa",
        exts: ["ipa", "tipa"],
    },
    {
        name: "Plist",
        exts: ["plist"],
    },
    {
        name: "Aliyun Office Previewer",
        exts: ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"],
        provider: /^Aliyundrive(Share)?$/,
    },
    {
        name: '*',
        exts: "*",
        component: <NotPreview />
    }
]

const ext = (path: string): string => {
    return path.split(".").pop() ?? ""
}

function getPreviewComp(file: Obj & { provider: string }) {
    const comp = previews.find(preview => {
        if (
            preview.type === file.type ||
            preview.exts === "*" ||
            preview.exts?.includes(ext(file.name).toLowerCase())
        ) {
            return true
        }
    })
    return comp?.component
}

export function FilePreview() {
    const [params, setParams] = useState({
        password: '',
    })
    const [state, setState] = useRecoilState(objState)
    const serverApi = useRecoilValue(serverApiState)
    const { upsertHistoryRecord } = useHistoryRecord()

    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/get/${state.path}` : null, (): Promise<FsGetResp> => {
        return request.post(`${serverApi}/api/fs/get`, {
            ...params,
            path: state.path
        })
    })

    useEffect(() => {
        if (serverApi && data && state.path) {
            const { name, type, thumb } = data
            upsertHistoryRecord({ name, type, thumb, serverApi, path: state.path })
            setState({
                ...state,
                obj: data
            })
        }
    }, [data])

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    <div className="flex mb-2 items-center">
                        <Breadcrumb />
                    </div>
                    {isLoading ?
                        (
                            <>
                                <div className="flex w-full flex-col items-center justify-center py-32">
                                    <LoadingSpinner />
                                </div>
                            </>
                        )
                        :
                        (
                            <>
                                {
                                    data && getPreviewComp(data)
                                }
                            </>
                        )}
                </div>
            </div>
        </>
    )
}