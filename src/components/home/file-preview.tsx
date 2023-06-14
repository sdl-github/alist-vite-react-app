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


    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/get` : null, (): Promise<FsGetResp> => {
        return request.post(`${serverApi}/api/fs/get`, {
            ...params,
            path: state.path
        })
    })

    useEffect(() => {
        setState({
            ...state,
            obj: data
        })
    }, [data])


    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    <div className="flex mb-2 items-center">
                        <Breadcrumb />
                    </div>
                    {
                        data && getPreviewComp(data) ? getPreviewComp(data) : (
                            <>
                                <div className="flex justify-center items-center flex-col mt-10">
                                    <div className="w-[200px] h-[200px] rounded">
                                        <img src={FileIcon} width={200} height={200} />
                                    </div>
                                    <div className="my-4 font-bold text-xl">{data?.name}</div>
                                    <div className="flex">
                                        <a
                                            className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
                                        >
                                            <p className="text-sm font-semibold text-[#1d9bf0] cursor-pointer">
                                                复制链接
                                            </p>
                                        </a>
                                        <a
                                            className="ml-4 mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
                                        >
                                            <p className="text-sm font-semibold text-[#1d9bf0] cursor-pointer">
                                                下载
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    )
}