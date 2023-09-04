import React, {useEffect, useState} from 'react';
import {Button, Descriptions, Image, List, Message, Spin, Tag, Modal, Input } from '@arco-design/web-react';
import {
    IconHeart,
    IconMessage,
    IconStar,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconCopy, IconCloseCircle
} from '@arco-design/web-react/icon';

function IndexPage({navigate}) {
    const [mockData, setMockData] = useState([]);
    const [scrollLoading, setScrollLoading] = useState(<Spin loading={true}/>);
    const [loading, setLoading] = useState(false);

    const fetchData = (currentPage) => {
        if (currentPage > 5) {
            setScrollLoading('No more data');
        } else {
            // doc https://github.com/civitai/civitai/wiki/REST-API-Reference#get-apiv1images
            // NSFW: None, Soft, Mature, X
            fetch('https://civitai.com/api/v1/images?limit=10&nsfw=None&page=' + currentPage)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setMockData((mockData) => mockData.concat(...data.items));
                })
                .catch((error) => console.error(error));
        }
    };
    const onCopy = (item) => {
        // 复制到剪切板
        const prompt = item.meta?.prompt
        const negativePrompt = 'Negative prompt:' + item.meta?.negativePrompt
        const steps = 'Steps:' + item.meta?.steps
        const seed = 'Seed:' + item.meta?.seed
        const sampler = 'Sampler:' + item.meta?.sampler
        const cfgScale = 'CFG scale:' + item.meta?.cfgScale
        const model = 'Model:' + item.meta?.Model
        const width = 'width:' + item?.width
        const height = 'height:' + item?.height
        const copyData = prompt + '\n' + negativePrompt + '\n' + steps + '\n' + seed + '\n' + sampler + '\n' + cfgScale + '\n' + model + '\n' + width + '\n' + height

        navigator.clipboard.writeText(copyData).then(function () {
            console.log('Async: Copying to clipboard was successful!');
            Message.success('Copy success')
        })
    }

    const onDownload = async (item) => {
        const modalIns = Modal.info({
            title: 'fetch...',
            icon: <IconInfoCircleFill />,
            content: (
                <span>
                Retrieving download link... <Spin size={14} />
              </span>
            ),
            okText: 'Close',
        });
        if (item.hash === undefined){
            fetch('https://civitai.com/api/v1/models?query=' + item.name).then((res) => res.json()).then((data) => {
                if (data.metadata.totalItems>0){
                    modalIns.update({
                        icon: <IconCheckCircleFill />,
                        title: 'Success',
                        content: (<><div>Download URL:</div><Input label={'Download URL'} value={data.items[0].modelVersions[0].downloadUrl} suffix={<IconCopy onClick={(()=>{
                            navigator.clipboard.writeText(data.items[0].modelVersions[0].downloadUrl).then(function () {
                                console.log('Async: Copying to clipboard was successful!');
                                Message.success('Copy success')
                            })
                        })} />}/></>)
                    });
                } else {
                    modalIns.update({
                        icon: <IconCloseCircle />,
                        title: 'Error',
                        content: (<span>Not found model</span>)
                    });
                }
            })
        } else {
            fetch('https://civitai.com/api/v1/model-versions/by-hash/'+item.hash).then((res) => res.json()).then((data) => {
                console.log("data:",data)
                modalIns.update({
                    icon: <IconCheckCircleFill />,
                    title: 'Success',
                    content: (<><div>Download URL:</div><Input label={'Download URL'} value={data.downloadUrl} suffix={<IconCopy onClick={(()=>{
                        navigator.clipboard.writeText(data.downloadUrl).then(function () {
                            console.log('Async: Copying to clipboard was successful!');
                            Message.success('Copy success')
                        })
                    })} />}/></>)
                });
            })
        }
    }

    useEffect(() => {
        fetchData(1)
    }, []);
    return (
        <>
            <h2 style={{margin:'10px 0'}}>civiai.com images</h2>
        <List
            bordered={false}
            split={false}
            style={{width: 600, maxHeight: 960, textAlign: 'left'}}
            scrollLoading={scrollLoading}
            onReachBottom={(currentPage) => fetchData(currentPage)}
            dataSource={mockData}
            render={(item, index) => {
                let loraTags = []
                let modelTags = []
                item.meta?.resources?.map((k, v) => {
                    if (k.name === ''){
                        return
                    }
                    if (k.type === 'lora') {
                        loraTags.push(<Button size='small' type='outline' status='success' style={{marginRight: 8}}
                                              onClick={() => onDownload(k)}>{k.name}</Button>)
                    } else {
                        modelTags.push(<Button size='small' type='outline' status='success' style={{marginRight: 8}}
                                               onClick={() => onDownload(k)}>{k.name}</Button>)
                    }
                })

                const descData = [
                    {'label': 'From user', 'value': item.username},
                    {
                        'label': 'Star', 'value': (
                            <>
                            <span key={1}>
                                <IconHeart/>{item.stats?.likeCount}
                            </span>&nbsp;
                                <span key={2}>
                                <IconStar/>{item.stats?.heartCount}
                            </span>&nbsp;
                                <span key={3}>
                                <IconMessage/>
                                Reply
                            </span></>)
                    },
                    {'label': 'Prompt',
                        'value': (item.meta === null ? 'None' : <Button size='small' type='outline' status='success'
                                                                              onClick={() => onCopy(item)}>Copy</Button>),
                    },
                    {'label': 'lora', 'value': (<>{loraTags}</>)},
                    {'label': 'model', 'value': (<>{modelTags}</>)},
                ]
                return (
                    <List.Item key={index}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Image
                                src={item.url}
                                width={128}
                                alt='lamp'
                                lazyload={true}
                                key={index}
                            />
                            <Descriptions
                                column={1}
                                data={descData}
                                style={{marginBottom: 20, textAlign: 'left', width: 460, marginLeft: 20}}
                                labelStyle={{paddingRight: 36}}
                            />
                        </div>
                    </List.Item>
                )
            }}
        />
            <Spin loading={loading}/>
        </>
    );
}

export default IndexPage;
