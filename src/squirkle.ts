const maskContainerId = 'squircle-masks-container'

function createMaskContainer(): SVGElement {
  const el = (document.getElementById(maskContainerId) as unknown) as SVGElement

  if (el) {
    return el
  }

  const svg = `
    <svg height="0" width="0" xmlns="http://www.w3.org/2000/svg">
      <defs id=${maskContainerId}></defs>
    </svg>
  `

  document.body.insertAdjacentHTML('beforeend', svg)

  return (document.getElementById(maskContainerId) as unknown) as SVGElement
}

function createMask(width: number, height: number, radius: number) {
  const maskId = `squircle-mask-${width}-${height}-${radius}`
  const el = document.getElementById(maskId)

  if (el) {
    return maskId
  }

  const m = 0.25
  const mr = 0.35
  const largestSide = width > height ? width : height
  const indent =
    radius * (1 + mr) < largestSide * 2 ? radius * (1 + mr) : largestSide * 2

  const indentW = indent / width
  const indentH = indent / height

  const clipPath = `
    <clipPath id=${maskId} clipPathUnits="objectBoundingBox">
      <path fill="#000" stroke="#ccc" d="
        M ${indentW},0
        L ${1 - indentW},0
        C ${1 - indentW * m},0 1,${indentH * m} 1,${indentH}
        L 1,${1 - indentH}
        C 1,${1 - indentH * m} ${1 - indentW * m},1 ${1 - indentW},1
        L ${indentW},1
        C ${indentW * m},1 0,${1 - indentH * m} 0,${1 - indentH}
        L 0, ${indentH}
        C 0,${indentH * m} ${indentW * m},0  ${indentW},0
      "/>
    </clipPath>
  `

  createMaskContainer().insertAdjacentHTML('beforeend', clipPath)

  return maskId
}

const resizeObserver = new ResizeObserver((entries) => {
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i]
    console.log(entry)
  }
})

export function squirklify(elms: HTMLElement | HTMLElement[]) {
  if (!elms) return

  const targets = Array.isArray(elms) ? elms : [elms]

  for (let i = 0; i < targets.length; i += 1) {
    const elm = targets[i]

    const borderRadius = parseInt(
      window.getComputedStyle(elm).getPropertyValue('border-radius'),
      10
    )

    const { clientWidth: w, clientHeight: h } = elm
    const maskId = createMask(w, h, borderRadius)
    elm.style.clipPath = `url(#${maskId})`
    ;(elm.style as any).WebkitClipPath = `url(#${maskId})`

    resizeObserver.observe(elm)
  }
}
