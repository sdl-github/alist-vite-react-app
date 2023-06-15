
import request from '@/lib/request'
import { objState } from '@/store/obj'
import { serverApiState } from '@/store/server'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useSWR from 'swr'
import DPlayer, { DPlayerOptions } from 'dplayer';
import Hls from "hls.js"
import { Skeleton } from '@douyinfe/semi-ui'

export interface Meta {
    duration: number
    height: number
    width: number
}

export interface PreviewData {
    drive_id: string
    file_id: string
    video_preview_play_info: VideoPreviewPlayInfo
}

export interface VideoPreviewPlayInfo {
    category: string
    live_transcoding_task_list: LiveTranscodingTaskList[]
    meta: Meta
}

export interface LiveTranscodingTaskList {
    stage: string
    status: string
    template_height: number
    template_id: string
    template_name: string
    template_width: number
    url: string
}

const VideoPreview: React.FC = () => {
    const serverApi = useRecoilValue(serverApiState)
    const [params, setParams] = useState({
        password: '',
        method: "video_preview",
    })
    const state = useRecoilValue(objState)
    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/other/${state.path}` : null, (): Promise<PreviewData> => {
        return request.post(`${serverApi}/api/fs/other`, {
            ...params,
            path: state.path
        })
    })

    let player: DPlayer | null = null

    const option: DPlayerOptions = {
        container: null,
        autoplay: true
    }

    useEffect(() => {
        let list = [] as LiveTranscodingTaskList[]
        list = data?.video_preview_play_info.live_transcoding_task_list.filter(
            (l) => l.url
        ) || []
        if (list.length === 0) {
            console.log("No transcoding video found")
            return
        }
        const url = list[list.length - 1].url
        if (!player) {
            option.container = document.getElementById('dplayer')
            option.pic = state.obj?.thumb
            option.video = {
                url,
                type: 'customHls',
                customType: {
                    customHls: function (video: HTMLMediaElement, player: DPlayer) {
                        const hls = new Hls();
                        hls.loadSource(video.src);
                        hls.attachMedia(video);
                        if (!video.src) {
                            video.src = url
                        }
                    },
                },
            }
            player = new DPlayer(option);
        }

        return () => {
            player?.destroy()
            player = null
        }
    }, [data])
    
    const placeholder = (
        <div className="flex justify-center items-center flex-col mt-10">
            <Skeleton.Image className="rounded" style={{width:"100%", height: "30vh"}}/>
            <Skeleton.Title className='w-full mt-4' />
        </div>
    );
    return (
        <>
            <Skeleton placeholder={placeholder} active loading={isLoading}>
                <div id="dplayer"></div>
                <div className='my-4 font-bold'>
                    <div>{state.obj?.name}</div>
                </div>
            </Skeleton>
        </>
    )
}

export default VideoPreview