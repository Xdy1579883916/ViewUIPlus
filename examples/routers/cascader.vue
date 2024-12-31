<template>
    <div style="margin: 100px;width: 200px;">
        <Cascader :data="data" v-model="value1"></Cascader>
        {{ value1 }}
        <Cascader complete :data="data" v-model="value2" @on-change="log"></Cascader>
        {{ value2 }}
    </div>
</template>
<script>
    export default {
        data () {
            return {
                value1: [],
                value2: [],
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                },
                    {
                        value: 'hubei',
                        label: '湖北',
                    }]
            }
        },
        methods: {
            log: console.log
        }
    }
</script>
