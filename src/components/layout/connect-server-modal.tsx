import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from "react";
import Modal from "@/components/shared/modal";
import { Form, Toast, Row, Col, TextArea, Button, Radio, RadioGroup } from '@douyinfe/semi-ui';
import request from '@/lib/request'
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { IconServer } from '@douyinfe/semi-icons';
import { setToken } from "@/lib/auth";
import { useRecoilState } from "recoil";
import { serverApiState } from "@/store/server";
import { useNavigate } from "react-router-dom";

type IProps = {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>;
}

type Server = {
    api: string
    username?: string
    token?: string
}

const ConnectServerModal: FC<IProps> = ({ show, setShow }) => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [type, setType] = useState(1)
    const [serverApi, setServerApi] = useRecoilState(serverApiState)
    const [serverList, setServerList] = useLocalStorage<Server[]>('serverList', [])

    const handleSubmit = (values: Record<string, any>) => {
        const { username, password, api } = values
        if (serverList.map(server => server.api).includes(api)) {
            Toast.info("服务器已存在")
            return
        }
        setLoading(true)
        if (!username && !password) {
            request({ url: `${api}/api/public/settings`, method: 'GET' }).then((res: any) => {
                if (res.version) {
                    setServerApi(api)
                    const newServer = { api }
                    setServerList([...serverList, newServer])
                    Toast.success("添加成功")
                    return
                }
                throw new Error()
            }).catch(() => {
                Toast.info('连接服务器错误')
            }).finally(() => {
                setLoading(false)
            })
            return
        }
        request({ url: `${api}/api/auth/login`, method: 'POST', data: { username, password } })
            .then((res: any) => {
                if (res.token) {
                    setToken(res.token)
                    setServerApi(api)
                    const newServer = { api, username, token: res.token }
                    setServerList([...serverList, newServer])
                    Toast.success("添加成功")
                    return
                }
                throw new Error()
            })
            .catch(() => {
                Toast.info('连接服务器错误')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleSelectServer = (server: Server) => {
        setServerApi(server.api)
        setToken(server.token || '')
        navigate('/')
    }

    const handleDel = (server: Server, index: number) => {
        if (serverApi === server.api) {
            setServerApi('')
        }
        const data = JSON.parse(JSON.stringify(serverList))
        data.splice(index, 1)
        setServerList(data)
    }

    return (
        <Modal showModal={show} setShowModal={setShow}>
            <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
                    <RadioGroup type='button' buttonSize='large' value={type} onChange={(e) => {
                        setType(e.target.value)
                    }}>
                        <Radio value={1}>服务器列表</Radio>
                        <Radio value={2}>新建服务器</Radio>
                    </RadioGroup>
                    {
                        type === 1 && (
                            <>
                                <h3 className="font-display text-2xl font-bold">服务器列表</h3>
                                <div className="w-full">
                                    {serverList?.map((server, index) => {
                                        return (
                                            <div key={server.api} onClick={() => handleSelectServer(server)} className="flex w-full items-center justify-between p-2 cursor-pointer">
                                                <div className="flex items-center">
                                                    <IconServer size="extra-large" />
                                                    <div className={`ml-4 p-2 rounded-[40px] transition-all ${serverApi === server.api ? "bg-green-400 text-white" : ""} `}>
                                                        <div className="font-bold mx-2">{server.api}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <Button type="danger" onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDel(server, index)
                                                    }}>删除</Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )
                    }
                    {
                        type === 2 && (
                            <>
                                <h3 className="font-display text-2xl font-bold">新建服务器</h3>
                                <p className="text-sm text-gray-500">
                                    服务器格式为：https://example.com
                                </p>
                                <Form
                                    onSubmit={handleSubmit}
                                    style={{ width: '100%' }}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Form.Input
                                                trigger='blur'
                                                initValue={"http://av.saybai.cn"}
                                                rules={[
                                                    { required: true, message: '请输入域名' },
                                                ]}
                                                noLabel={true} field='api' placeholder='域名' />
                                            <Form.Input initValue={"admin"} noLabel={true} field='username' placeholder='用户名' />
                                            <Form.Input initValue={"admin"} noLabel={true} field='password' placeholder='密码' />
                                        </Col>
                                    </Row>
                                    <Button loading={loading} style={{ width: '100%' }} type='primary' htmlType='submit'>提交</Button>
                                </Form>
                            </>
                        )
                    }
                </div>
            </div>
        </Modal>
    )
}

export function useConnectServerModal() {
    const [show, setShow] = useState(false);
    const modal = useCallback(() => {
        return (
            <ConnectServerModal
                show={show}
                setShow={setShow}
            />
        );
    }, [show, setShow]);

    return useMemo(
        () => ({ setShow, modal }),
        [setShow, modal],
    );
}