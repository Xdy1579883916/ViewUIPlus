import Modal from './confirm';
import {dropRight, last} from "lodash-es";

/**
 * 需要传入 vue 实例, 用于共享上下文
 * @param sharedApp
 */
export default function setupModal(sharedApp = {}) {
    let modalInstance = [];

    function getModalInstance(opt, resolve = null, reject = null) {
        let props = Object.assign({}, opt, {
            closable: false,
            maskClosable: false,
            footerHide: true, // 阻止Modal.vue 的默认展示底部
        });
        let newInstance = Modal.newInstance(sharedApp, props, resolve, reject);
        modalInstance.push(newInstance);
        // console.log('modalInstance newInstance',modalInstance)
        return last(modalInstance);
    }

    function confirm(options, resolve = null, reject = null) {
        let instance = getModalInstance(options, resolve, reject);

        options.onRemove = function () {
            // 删除最后一个弹窗实例
            modalInstance = dropRight(modalInstance) || [];
            // console.log('modalInstance onRemove',modalInstance)
        };

        instance.show(options);
    }

    // promise状态下没有办法重置 当前实例的 buttonLoading [加载中],因为点击按钮的时候已经promise已经回调结束了
    Modal.confirm = function ({
                                  width = 500, // modal 宽度
                                  marginTB = 20, // body内容的上下边距 5, 10, 15, 20, 24, 26, 28
                                  loading = false, // 点击确定按钮的时候是否显示加载中
                                  render = undefined, // 自定义组件内容 ---body
                                  content = null, // 自定义body HTML内容 ---body
                                  props = {}, // 自定义组件的props参数
                                  headTitle = '', // 弹窗标题
                                  headRender = undefined, // 自定义标题组件  --- headRender 优先于title
                                  footerRender = undefined, // 自定义底部组件  --- footerRender 优先于 footerShow、showCancel、showOk 未定义时显示默认页脚
                                  footerProps = {}, // 自定义底部组件的props参数
                                  footerShow = true, // 是否显示弹窗底部按钮, 不显示的时候可以自己在render组件内部 $emit('ok',{}) $emit('quit')
                                  lockScroll = true, // 默认锁定滚动条
                                  okType = 'primary', // ok 按钮的样式  footerShow true 时有效
                                  showOk = true, // 展示ok按钮
                                  showCancel = true, // 展示cancel按钮
                                  okText = null, // ok按钮文案
                                  cancelText = null, // cancel按钮文案
                                  closable = false, // 是否显示右上角关闭按钮
                                  fullscreen = false, // 全屏显示
                                  scrollable = false, // 是否可以滚动
                                  className = '', // 自定义类名
                                  styles = {}, // 自定义样式
                                  onOk = () => {
                                  },
                                  onCancel = () => {
                                  },
                                  zIndex = 1000,
                              }, isPromise = false) {
        let _props = {
            width,
            lockScroll,
            render,
            body: content,
            footerRender,
            footerShow: footerRender || footerShow,
            headRender,
            okType,
            headTitle,
            props,
            showOk,
            okText,
            cancelText,
            showCancel,
            loading: isPromise ? false : loading,
            onOk,
            onCancel,
            closable,
            fullscreen,
            scrollable,
            styles,
            className,
            marginTB,
            zIndex
        };
        if (isPromise) {
            return new Promise((resolve, reject) => {
                confirm(_props, resolve, reject);
            });
        } else {
            return confirm(_props);
        }
    };

    Modal.remove = function () {
        if (!last(modalInstance)) {
            // 在加载状态，取消后删除
            // console.log('模态实例',modalInstance)
            return false;
        }

        const instance = getModalInstance();

        instance.remove();
        // console.log('模态实例 已移除',modalInstance)
    };
    return Modal;
}
