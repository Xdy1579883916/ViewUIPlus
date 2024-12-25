<template>
    <div class="ivu-modal-header" style="padding: 0 0 14px 0; border-bottom: none; margin-bottom: 0 !important;">
        <slot>
            <div
                class="ivu-modal-header-inner"
                style="font-weight: 600;"
                v-html="title"
            />
        </slot>
    </div>
</template>
<script>
export default {
    name: 'ModalHeader',
    props: ['title'],
};
</script>
