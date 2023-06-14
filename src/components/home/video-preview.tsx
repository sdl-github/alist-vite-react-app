
import request from '@/lib/request'
import Hls from "hls.js"
import { objState } from '@/store/obj'
import { serverApiState } from '@/store/server'
import DPlayer from 'dplayer';
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import useSWR from 'swr'

const sources = {
    hd: {
        play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4',
    },
    sd: {
        play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_sd.mp4',
    },
}

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

    let dPlayer: any = null
    const serverApi = useRecoilValue(serverApiState)
    const [params, setParams] = useState({
        password: '',
        method: "video_preview",
    })
    const { isLoading, data, error, mutate } = useSWR(serverApi ? `${serverApi}/api/fs/other` : null, (): Promise<PreviewData> => {
        return request.post(`${serverApi}/api/fs/other`, {
            ...params,
            path: state.path
        })
    })
    const state = useRecoilValue(objState)


    useEffect(() => {
        const sources: any = {}
        data?.video_preview_play_info.live_transcoding_task_list.forEach(source => {
            const template = source.template_id.toLowerCase()
            sources[template] = {
                play_url: source.url
            }
        })
        console.log('video_preview is=>>', { data });
        console.log('sources is=>>', { sources });
        const dom = document.getElementById('player')
        console.log({ dom });
        if (dom && !dPlayer) {
            // hls.attachMedia(video)
            const dp = new DPlayer({
                container: dom,
                video: {
                    url: sources.fhd.play_url,
                    type: 'customHls',
                    customType: {
                        customHls: function (video, player) {
                            console.log('====>');
                            console.log(video);
                            console.log(player);
                            
                            
                            const hls = new Hls();
                            hls.loadSource(video.src);
                            hls.attachMedia(video);
                        },
                    },
                },
            });
            dPlayer = dp
        }
        console.log("dPlayer==>", { dPlayer });

    }, [data])

    return (
        <>
            {isLoading ? <div>loading</div> : (
                <>
                    <div className='w-full' id='player' />
                    <div className='my-4 font-bold'>
                        <div>{state.obj?.name}</div>
                    </div>
                </>
            )}

        </>
    )
}

export default VideoPreview