import {createApp, getCurrentInstance, h} from 'vue';
import Modal from './modal.vue';
import Button from '../button/button.vue';
import Locale from '../../mixins/locale';
import {isClient} from '../../utils/index';
import ModalHeader from "./modal-header.vue";
import {pick} from "lodash-es";

const prefixCls = 'ivu-modal-confirm';
const modalPropsKeys = [
    "modelValue",
    "closable",
    "maskClosable",
    "title",
    "width",
    "okText",
    "cancelText",
    "loading",
    "styles",
    "className",
    "footerHide",
    "scrollable",
    "transitionNames",
    "transfer",
    "fullscreen",
    "mask",
    "draggable",
    "sticky",
    "stickyDistance",
    "resetDragPosition",
    "zIndex",
    "beforeClose",
    "render"
]
Modal.newInstance = (sharedApp, properties, resolve, reject) => {
    if (!isClient) return;
    const {
        render,
        props: _props,
        onOk,
        onCancel,
        ...data
    } = properties || {};

    const initData = {
        visible: false,
        width: 416,
        title: '',
        body: '',
        iconType: '',
        iconName: '',
        okText: undefined,
        cancelText: undefined,
        showCancel: false,
        loading: false,
        buttonLoading: false,
        scrollable: false,
        closable: false,
        closing: false, // 关闭有动画，期间使用此属性避免重复点击
        // -----------⬇️ 自定义改动的数据
        okType: 'primary',
        headTitle: '',
        headRender: undefined,
        footerRender: undefined,
        footerShow: true,
        props: {},
        footerProps: {},
        render: undefined,
        showOk: true,
        // zIndex: 1000
    };

    const container = document.createElement('div');
    document.body.appendChild(container);

    let _instance = null;

    const Instance = createApp({
        mixins: [Locale],
        data() {
            return Object.assign({}, initData, data);
        },
        render() {
            let {props = {}, on = {}, attrs = {}, domProps = {}, ...other } = _props || {};

            // render content
            let body_render;
            if (render) {
                if (typeof render === 'function') {
                    const vNode = render(h)
                    body_render = h('div', {
                        class: `${prefixCls}-body ${prefixCls}-body-render`
                    }, vNode);
                } else {
                    body_render = h('div', {
                        class: `${prefixCls}-body ${prefixCls}-body-render`
                    }, [
                        h(render, {
                            ...props,
                            ...on,
                            ...attrs,
                            ...domProps,
                            ...other,
                            onOk: this.ok,
                            onQuit: this.cancel
                        })
                    ]);
                }
            } else {
                body_render = h('div', {
                    class: `${prefixCls}-body`
                }, [
                    h('div', {
                        innerHTML: this.body
                    })
                ]);
            }

            // 当没有标题渲染时，隐藏头部 render 优先
            let head_render;
            if (this.headRender) {
                head_render = this.headRender(h);
            } else if (this.headTitle) {
                head_render = h(ModalHeader, {
                    title: this.headTitle
                });
            }

            let footer_render;
            if (this.footerRender) {
                footer_render = h(
                    'div',
                    {
                        // 直接设置 vue可以帮我们对class进行合并
                        class: `mt${this.marginTB}`,
                    },
                    () => h(this.footerRender, this.footerProps || {})
                );

            } else if (this.footerShow) {
                // render 底部导航 footer
                let footerVNodes = [];
                if (this.showCancel) {
                    footerVNodes.push(h(Button, {
                        type: 'default',
                        onClick: this.cancel
                    }, () => this.localeCancelText));
                }
                if (this.showOk) {
                    footerVNodes.push(h(Button, {
                        type: this.okType,
                        loading: this.buttonLoading,
                        onClick: this.ok
                    }, () => this.localeOkText));
                }
                footer_render = h(
                    'div',
                    {
                        class: `${prefixCls}-footer`
                    },
                    footerVNodes
                );
            }

            return h(
                Modal,
                {
                    ...pick(data, modalPropsKeys),
                    width: this.width,
                    scrollable: this.scrollable,
                    closable: this.closable,
                    ref: 'modal',
                    modelValue: this.visible,
                    'onUpdate:modelValue': (status) => this.visible = status,
                    'onOn-cancel': this.cancel
                },
                () => h('div', {
                    class: prefixCls,
                    style: {
                        padding: 0
                    },
                }, [
                    head_render,
                    body_render,
                    footer_render
                ])
            );
        },
        computed: {
            iconTypeCls() {
                return [
                    `${prefixCls}-head-icon`,
                    `${prefixCls}-head-icon-${this.iconType}`
                ];
            },
            iconNameCls() {
                return [
                    'ivu-icon',
                    `ivu-icon-${this.iconName}`
                ];
            },
            localeOkText() {
                if (this.okText) {
                    return this.okText;
                } else {
                    return this.t('i.modal.okText');
                }
            },
            localeCancelText() {
                if (this.cancelText) {
                    return this.cancelText;
                } else {
                    return this.t('i.modal.cancelText');
                }
            }
        },
        methods: {
            cancel(data = {}) {
                if (this.closing) return;
                this.$refs.modal.visible = false;
                this.buttonLoading = false;
                this.handleDiyCancel(data);
                this.remove();
            },
            ok(data = {}) {
                if (this.closing) return;
                if (this.loading) {
                    this.buttonLoading = true;
                } else {
                    this.$refs.modal.visible = false;
                    this.remove();
                }
                this.handleDiyOk(data);
            },
            remove() {
                this.closing = true;
                setTimeout(() => {
                    this.closing = false;
                    this.destroy();
                }, 300);
            },
            destroy() {
                Instance.unmount();
                document.body.removeChild(container);
                this.onRemove();
            },
            handleDiyOk(data) {
                const _data = Object.prototype.toString.call(data) !== '[object PointerEvent]' ? data : undefined;
                onOk && onOk(_data, this);
                resolve && resolve(_data);
            },
            handleDiyCancel(data) {
                const _data = Object.prototype.toString.call(data) !== '[object PointerEvent]' ? data : undefined;
                onCancel && onCancel(_data, this);
                reject && reject(_data);
            },
            onRemove() {
            }
        },
        created() {
            _instance = getCurrentInstance();
        }
    })
    Object.assign(Instance._context, sharedApp._context)
    Instance.mount(container)

    const modal = _instance.refs.modal;

    return {
        show(props) {
            Object.assign(modal.$parent, props);

            // notice when component destroy
            modal.$parent.onRemove = props.onRemove;

            modal.visible = true;
        },
        remove() {
            modal.visible = false;
            modal.$parent.buttonLoading = false;
            modal.$parent.remove();
        },
        component: modal
    };
};

export default Modal;
