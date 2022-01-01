import TweetifyForm from './TweetifyForm'

describe('TweetifyForm', () => {

  const node = TweetifyForm()
  const inputArea  = node.querySelector('#input')
  const outputArea = node.querySelector('#output')

  it('should not allow typing into the output view', () => {

    expect(outputArea.getAttribute('readonly')).toBe('true')

  })
  
  it('should update the output area as the user types', () => {

    inputArea.value = 'Lorem ipsum dolor sit amet'

    setTimeout(() => {
      expect(outputArea.value).toEqual('Lorem ipsum dolor sit amet')
    }, 3000)

  })

})