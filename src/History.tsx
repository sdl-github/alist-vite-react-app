import { useState } from "react"
import { HistoryRecord, useHistoryRecord } from "./lib/hooks/use-history-record"
import { useRecoilValue } from "recoil"
import useSWR from "swr"
import { serverApiState } from "./store/server"
import { Button, Skeleton, Timeline } from "@douyinfe/semi-ui"
import { formatDate, formatSecond, timeAgo } from "./lib/utils"
import { useNavigate } from "react-router-dom";
import { Type } from "./store/obj"



export function History() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const serverApi = useRecoilValue(serverApiState)
    const { getHistoryRecordPage } = useHistoryRecord()

    const { isLoading, data, error, mutate } = useSWR(serverApi ? `getHistoryRecordPage-${serverApi}` : null, () => {
        return getHistoryRecordPage(pageNo, pageSize)
    })


    const style = {
        display: 'flex',
        alignItems: 'flex-start',
    };
    const placeholder = (
        <div style={style}>
            <div>
                <Skeleton.Paragraph style={{ width: 600 }} rows={3} />
            </div>
        </div>
    );

    const handleClearAll = async () => {
        setLoading(true)
        await mutate()
        setLoading(false)
    }

    const goDetail = (item: HistoryRecord) => {
        navigate(`/?path=${item.path}&type=${Type.File}&seeTime=${item.seeTime}`)
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center py-32">
                <div className="z-10 w-full max-w-[900px] px-5 xl:px-0">
                    <Skeleton placeholder={placeholder} loading={isLoading} active>
                        <div className="text-xl font-bold mb-4 flex items-center">
                            <div>浏览历史</div>
                            <Button onClick={handleClearAll} loading={loading} theme='light' type='tertiary' style={{ marginLeft: "10px" }}>清空</Button>
                        </div>
                        {(Array.isArray(data?.items) && data?.items.length) ? 
                        <Timeline mode="left">
                            {data?.items.map(item => {
                                return (
                                    <>
                                        <Timeline.Item key={item.id} onClick={() => goDetail(item)} time={timeAgo(new Date(formatDate(item.updated || '')))} extra={item.path}>
                                            <div className="cursor-pointer hover:text-blue-500">
                                                <div>
                                                    {item.name}
                                                </div>
                                                <div>看到 {formatSecond(item.seeTime || 0)}</div>
                                            </div>
                                        </Timeline.Item>
                                    </>
                                )
                            })}
                        </Timeline> : <>空空如也</>}
                    </Skeleton>
                </div>
            </div>
        </>
    )
}