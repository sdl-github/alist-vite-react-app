import { Type, objState } from "@/store/obj"
import { useRecoilState, useRecoilValue } from "recoil"
import { LoadingSpinner } from "../shared/icons"
import { serverApiState } from "@/store/server"
import { useEffect, useState } from "react"
import { useSearchParams } from 'react-router-dom';
import { Folder } from "./folder"
import { FilePreview } from "./file-preview"
import { HistoryRecord, useHistoryRecord } from "@/lib/hooks/use-history-record"
import { Notification, Typography } from '@douyinfe/semi-ui';
import { useNavigate } from "react-router-dom";

export function Index() {
    const navigate = useNavigate()
    const api = useRecoilValue(serverApiState)
    const [state, setState] = useRecoilState(objState)
    const [searchParams, setSearchParams] = useSearchParams();
    const { queryHistoryRecordDetail } = useHistoryRecord()
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        queryHistoryRecordDetail().then((res) => {
            res && show(res)
        })
    }, [api])

    useEffect(() => {
        console.log({ api });
        const path = searchParams.get('path') || '/'
        const type = (searchParams.get('type') || Type.Folder) as Type
        console.log({ path });
        console.log({ type });
        setState({
            ...state,
            path,
            type
        })
    }, [api, searchParams])

    const { Text } = Typography;

    function close() {
        const idsTmp = [...ids];
        Notification.close(idsTmp.shift() || '');
        setIds(idsTmp);
    }

    function show(record: HistoryRecord) {
        const opts = {
            title: '最近浏览',
            content: (
                <>
                    <div>{record.path} </div>
                    <div style={{ marginTop: 8 }}>
                        <Text onClick={() => {
                            close()
                            navigate(`/?path=${record.path}&type=${Type.File}&seeTime=${record.seeTime}`)
                        }} link>查看详情</Text>
                        <Text onClick={() => {
                            close()
                        }} link style={{ marginLeft: 20 }}>
                            一会再看
                        </Text>
                    </div>
                </>
            ),
            duration: 60,
        };
        const id = Notification.info(opts);
        setIds([...ids, id]);
    }

    return (
        <>
            {state.type === Type.Fetching &&
                <div className="flex min-h-screen w-full flex-col items-center justify-center py-32">
                    <LoadingSpinner />
                </div>
            }
            {state.type === Type.Folder && <Folder />}
            {state.type === Type.File && <FilePreview />}
        </>
    )
}