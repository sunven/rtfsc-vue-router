/* @flow */

// fn 是 iterator
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      // 出口
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          // 下一个
          step(index + 1)
        })
      } else {
        // 下一个
        step(index + 1)
      }
    }
  }
  step(0)
}
