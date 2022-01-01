const resizeToContent = (element, minHeight=32) => {

  const borderHeight = parseInt(window.getComputedStyle(element).borderTopWidth) + parseInt(window.getComputedStyle(element).borderBottomWidth)

  element.style.height = `${minHeight}px`
  element.style.height = `${element.scrollHeight + borderHeight}px`

}

export default resizeToContent