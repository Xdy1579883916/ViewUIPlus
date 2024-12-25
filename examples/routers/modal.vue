<template>
    <Button @click="instance('info')">Info</Button>
    <Button @click="instance('success')">Success</Button>
    <Button @click="instance('warning')">Warning</Button>
    <Button @click="instance('error')">Error</Button>
    <Divider></Divider>
    <Button @click="confirm">Normal</Button>
    <Button @click="custom">Custom button text</Button>
    <Button @click="async">Asynchronous closing</Button>
    <p>
        Name: {{ value }}
    </p>
    <p>
        <Button @click="handleRender">Custom content</Button>
        <Button @click="handleRender2">自定义render</Button>
    </p>
</template>
<script>
import {Input} from '../../src/index';
import RemarkModal from "../components/RemarkModal.vue";

export default {
    data () {
        return {
            value: ''
        }
    },
    methods: {
        instance (type) {
            const title = 'Title';
            const content = '<p>Content of dialog</p><p>Content of dialog</p>';
            switch (type) {
                case 'info':
                    this.$Modal.info({
                        title: title,
                        content: content,
                        onOk: () => {
                            this.$Message.info('Clicked ok');
                        },
                    });
                    break;
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'warning':
                    this.$Modal.warning({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                    break;
            }
        },
        confirm () {
            this.$Modal.confirm({
                title: 'Title',
                content: '<p>Content of dialog</p><p>Content of dialog</p>',
                onOk: () => {
                    this.$Message.info('Clicked ok');
                },
                onCancel: () => {
                    this.$Message.info('Clicked cancel');
                }
            });
        },
        custom () {
            this.$Modal.confirm({
                title: 'Title',
                content: '<p>Content of dialog</p><p>Content of dialog</p>',
                okText: 'OK',
                cancelText: 'Cancel'
            });
        },
        async () {
            this.$Modal.confirm({
                title: 'Title',
                content: '<p>The dialog box will be closed after 2 seconds</p>',
                loading: true,
                onOk: () => {
                    setTimeout(() => {
                        this.$Modal.remove();
                        this.$Message.info('Asynchronously close the dialog box');
                    }, 2000);
                }
            });
        },
        handleRender () {
            this.$Modal.confirm({
                render: (h) => {
                    return h(Input, {
                        modelValue: this.value,
                        autofocus: true,
                        placeholder: 'Please enter your name...',
                        'onUpdate:modelValue': (val) => this.value = val
                    })
                }
            })
        },
        handleRender2 () {
            this.$ModalPlus.confirm({
                headTitle: '备注',
                width: 1000,
                render: RemarkModal,
                props: {
                    props: {
                        open: this.handleRender2
                    }
                },
                footerShow: false,
                onOk: (data) => {
                    this.$Message.info(`点击了确定, ${JSON.stringify(data)}`);
                },
                onCancel: (data) => {
                    this.$Message.info(`点击了取消, ${JSON.stringify(data)}`);
                }
            });
        }
    }
}
</script>
