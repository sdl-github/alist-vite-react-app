import { useRecoilValue } from 'recoil'
import { Breadcrumb as SemiBreadcrumb } from '@douyinfe/semi-ui';
import { IconHome } from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import { Type, objState } from '@/store/obj';
import { useNavigate } from "react-router-dom";

export function Breadcrumb() {

    const navigate = useNavigate()
    const state = useRecoilValue(objState)
    const [crumbs, setCrumbs] = useState<string[]>([])

    useEffect(() => {
        const path = state.path
        console.log('path===>', path);
        const arr = path.split('/').filter(item => !!item)
        setCrumbs(arr)
    }, [state, state.path])

    return (
        <>
            <div className="mx-2">
                <SemiBreadcrumb 
                onClick={(e) => {
                    if(e.name === 'Home') {
                        navigate('/')
                    }
                    const index = crumbs.findIndex(crumb => crumb === e.name)
                    const data = crumbs.slice(0, index + 1)
                    const path = data.join('/') 
                    console.log(crumbs);
                    console.log(index);
                    console.log(data);
                    console.log(path);
                    navigate(`/?path=${path}&type=${Type.Folder}`)
                }} compact={false}>
                    <SemiBreadcrumb.Item name={'/'} icon={<IconHome size="small" />}>Home</SemiBreadcrumb.Item>
                    {
                        crumbs?.map(crumb => {
                            return <SemiBreadcrumb.Item key={crumb}>{crumb}</SemiBreadcrumb.Item>
                        })
                    }
                </SemiBreadcrumb>
            </div>
        </>
    )
}