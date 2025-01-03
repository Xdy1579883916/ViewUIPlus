import { createApp, h } from "vue"

export function createChildApp({ app, component, props, el }) {
  let expose = null
  const childApp = createApp({
    render: () => expose = h(component, props),
  })
  Object.assign(childApp._context, app._context)
  childApp.mount(el)
  return {
    app: childApp,
    expose: expose.component.exposed,
  }
}
