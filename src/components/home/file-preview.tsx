import request from "@/lib/request"
import { FsGetResp } from "@/lib/types/resp"
import { objState } from "@/store/obj"
import { serverApiState } from "@/store/server"
import { Component, useEffect, useState } from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import useSWR from "swr"
import { Breadcrumb } from "../layout/breadcrumb"
import FileIcon from '@/assets/file.png'
import { allPreviewFileFormat, fileFormatState } from "@/store/preview"
import { Obj, ObjType } from "@/lib/types/obj"
import VideoPreview from "./video-preview"
import { Skeleton } from "@douyinfe/semi-ui"
import { NotPreview } from "./not-preview"
import LoadingSpinner from "../shared/icons/loading-spinner"
import { supabase } from "@/lib/supabase-client"


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

    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/get/${state.path}` : null, (): Promise<FsGetResp> => {
        return request.post(`${serverApi}/api/fs/get/${state.path}`, {
            ...params,
            path: state.path
        })
    })

    useEffect(() => {
        if (data && data.path) {
            setState({
                ...state,
                obj: data
            })
            supabase.from('record').upsert({
                name: data?.name,
                path: data?.path,
                cover: data?.thumb,
                type: data?.type
            })
                .eq(
                    "path", data?.path
                )
                .then((res) => {
                    console.log(res);
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