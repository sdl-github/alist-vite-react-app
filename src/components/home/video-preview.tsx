
import request from '@/lib/request'
import { objState } from '@/store/obj'
import { serverApiState } from '@/store/server'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useSWRImmutable from 'swr/immutable'
import Hls from "hls.js"
import { Skeleton } from '@douyinfe/semi-ui'
import { useHistoryRecord } from '@/lib/hooks/use-history-record'
import Artplayer from "artplayer"
import { Option } from "artplayer/types/option"
import artplayerPluginControl from 'artplayer-plugin-control'

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
    const { queryHistoryRecordDetail, upsertHistoryRecord } = useHistoryRecord()
    const [params, setParams] = useState({
        password: '',
        method: "video_preview",
    })
    const state = useRecoilValue(objState)
    const { isLoading, data, error, mutate } = useSWRImmutable(serverApi ? `${serverApi}/api/fs/other/${state.path}` : null, (): Promise<PreviewData> => {
        return request.post(`${serverApi}/api/fs/other`, {
            ...params,
            path: state.path
        })
    })

    let player: Artplayer | null = null
    const option: Option = {
        id: "player",
        container: "#video-player",
        title: state.obj?.name,
        volume: 0.5,
        autoplay: true,
        autoSize: false,
        autoMini: true,
        loop: false,
        theme: '#23ade5',
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: false,
        playsInline: true,
        quality: [],
        plugins: [
            artplayerPluginControl()
        ],
        whitelist: [],
        moreVideoAttr: {
            "webkit-playsinline": true,
            playsInline: true,
        },
        type: "m3u8",
        customType: {
            m3u8: function (video: HTMLMediaElement, url: string) {
                const hls = new Hls()
                hls.loadSource(url)
                hls.attachMedia(video)
                if (!video.src) {
                    video.src = url
                }
            },
        },
        lang: "zh-cn",
        lock: true,
        fastForward: true,
        // autoPlayback: true,
        autoOrientation: true,
        airplay: true,
    }

    useEffect(() => {
        if (!data) {
            return
        }
        let list = [] as LiveTranscodingTaskList[]
        list = data.video_preview_play_info.live_transcoding_task_list.filter(
            (l) => l.url
        ) || []
        if (list.length === 0) {
            console.log("No transcoding video found")
            return
        }
        if (!player) {
            option.url = list[list.length - 1].url
            option.quality = list.map((item, i) => {
                return {
                    html: item.template_id,
                    url: item.url,
                    default: i === list.length - 1,
                }
            })
            player = new Artplayer(option)
            player.on('ready', () => {
                console.log('DPlayerEvents.loadeddata=>');
                queryHistoryRecordDetail(state.path).then(res => {
                    console.log(res);
                    if (res && res.seeTime) {
                        player!.seek = Number(res.seeTime)
                    }
                })
            })
        }

        return () => {
            console.log('destroy==>');
            if (state.obj && serverApi && state.path) {
                const { name, type, thumb } = state.obj
                upsertHistoryRecord({ name, type, thumb, serverApi, path: state.path, seeTime: player?.video.currentTime })
            }

            player?.destroy()
            player = null
        }
    }, [data])

    const placeholder = (
        <div className="flex justify-center items-center flex-col mt-10">
            <Skeleton.Image className="rounded" style={{ width: "100%", height: "60vh" }} />
            <Skeleton.Title className='w-full mt-4' />
        </div>
    );

    return (
        <>
            <Skeleton placeholder={placeholder} active loading={isLoading}>
                <div className='w-full h-60vh' id="video-player"></div>
                <div className='my-4 font-bold'>
                    <div>{state.obj?.name}</div>
                </div>
            </Skeleton>
        </>
    )
}

export default VideoPreview