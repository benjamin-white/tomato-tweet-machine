import throttle        from 'lodash/throttle'
import processTweet    from '../lib/marketingLogic'
import resizeToContent from '../lib/resizeToContent'
import onViewChange    from '../lib/onViewChange'
import fit             from '../lib/fit'
import * as style      from './TweetifyForm.module.css'

const eventThrottle = 500

const handleInputChange = (input, output) => {

  resizeToContent(input)

  setTimeout(async () => {
    output.value = await processTweet(input.value)
    resizeToContent(output)
  }, fit(Math.random(), 0, .9, 500 - eventThrottle, 2500 - eventThrottle))

}

const createFormNode = (name, options, content) => {

  const node = document.createElement(name)

  Object.entries(options || {}).forEach(([ key, value ]) => {
    node.setAttribute(key, value)
  })

  content && (node.textContent = content)

  return node

}

const TweetifyForm = () => {

  const rootNode        = createFormNode('form')
  const inputLabel      = createFormNode('label', {for: 'input'}, 'Text to tweetify:')
  const inputArea       = createFormNode('textarea', {rows: 1, id: 'input'})
  const outputLabel     = createFormNode('label', {for: 'output'}, 'Tweetified text:')
  const outputArea      = createFormNode('textarea', {rows: 1, id: 'output', readonly: true})
  const heldInputChange = throttle(handleInputChange.bind(null, inputArea, outputArea), eventThrottle, {trailing: true})

  rootNode.className = style.form
  inputArea.addEventListener('input', heldInputChange);

  [
    inputLabel,
    inputArea,
    outputLabel,
    outputArea
  ].forEach(node => rootNode.appendChild(node))

  onViewChange(() => {
    resizeToContent(inputArea)
    resizeToContent(outputArea)
  })

  return rootNode

}

export default TweetifyForm