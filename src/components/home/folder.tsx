import request from "@/lib/request"
import { Obj } from "@/lib/types/obj"
import { FsListResp } from "@/lib/types/resp"
import { formatDate, getFileSize } from "@/lib/utils"
import { serverApiState } from "@/store/server"
import { Table, Button } from "@douyinfe/semi-ui"
import { ColumnProps } from "@douyinfe/semi-ui/lib/es/table"
import { useEffect, useState } from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import useSWR from "swr"
import { file, folder } from "../shared/icons/base64-icon"
import { Type, objState } from "@/store/obj"
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../layout/breadcrumb"

export function Folder() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const serverApi = useRecoilValue(serverApiState)
    const [state, setState] = useRecoilState(objState)
    const [params, setParams] = useState({
        path: '/',
        password: '',
        page: 1,
        per_page: 0,
        refresh: false
    })

    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/list` : null, (): Promise<FsListResp> => {
        return request.post(`${serverApi}/api/fs/list`, {
            ...params,
            path: state.path
        })
    })

    useEffect(() => {
        async function query() {
            setLoading(true)
            await mutate()
            setLoading(false)
        }
        query()
    }, [serverApi, state.path])

    const columns: ColumnProps<Obj>[] = [
        {
            title: '标题',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <>
                        <div className="flex items-center">
                            <img src={record.is_dir ? folder : file} width={24} height={24} />
                            <div className="ml-2">{text}</div>
                        </div>
                    </>
                )
            }
        },
        {
            title: '大小',
            dataIndex: 'size',
            render: (text, record, index) => getFileSize(text)
        },
        {
            title: '更新时间',
            dataIndex: 'modified',
            render: (text, record, index) => formatDate(text)
        },
    ]

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    <div className="flex mb-2 items-center">
                        <Button loading={loading} onClick={() => mutate()}>刷新</Button>
                        <Breadcrumb />
                    </div>
                    <Table onRow={(record, index) => {
                        return {
                            onClick: event => {
                                const type = record?.is_dir ? Type.Folder : Type.File
                                const path = `${state.path}${!state.path.endsWith('/') && '/' || ''}${record?.name}`
                                console.log({ type });
                                console.log({ path });
                                navigate(`/?path=${path}&type=${type}`)
                            },
                        };
                    }} className="cursor-pointer" loading={isLoading || loading} columns={columns} dataSource={data?.content} pagination={false} />
                </div>
            </div>
        </>
    )
}