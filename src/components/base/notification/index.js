import Notification from './notification.vue';
import { isClient } from '../../../utils/index';
import {createChildApp} from "@/utils/createChildApp";

Notification.newInstance = properties => {
    if (!isClient) return;
    const _props = properties || {};

    const container = document.createElement('div');

    const { expose } = createChildApp({
        app: {},
        component: Notification,
        props: _props,
        el: container
    })

    document.body.appendChild(container);

    return {
        notice (noticeProps) {
            expose.add(noticeProps);
        },
        remove (name) {
            expose.close(name);
        },
        component: expose,
        destroy (element) {
            expose.closeAll();
            isClient && setTimeout(function() {
                const [node] = document.getElementsByClassName(element) || []
                node && node.remove()
            }, 500);
        }
    };
};

export default Notification;
