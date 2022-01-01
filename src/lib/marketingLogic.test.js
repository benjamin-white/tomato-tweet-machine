import processTweet from './marketingLogic';

describe('processTweet', () => {

  const maxLength = 280

  global.fetch = () => {}

  const jestFetch = (langValue, success=true) => 
    jest.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve({
        ok: success,
        json: () =>
          Promise.resolve({
            data: {
              detections: [{language: langValue}]
            }
          })
      })
    )

  beforeEach(() => {
    jestFetch('en')
  })

  it('should append a tag when no tag is already present', async () => {

    expect(await processTweet('Lorem')).toEqual('Lorem #Tomato')

  })

  it('should not append a tag when one is already present', async () => {

    expect(await processTweet('Lorem #Tomato')).toEqual('Lorem #Tomato')

  })

  it('truncates input length to the maximum allowed length', async () => {

    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex augue, scelerisque eget venenatis vel, tincidunt ac metus. Duis nunc velit, volutpat ac mollis eget, imperdiet sed nisi. Vivamus urna ipsum, euismod sed feugiat quis, laoreet pharetra metus. Donec dictum felis aic purus suscipit congue.'
    expect((await processTweet(longText)).length).toEqual(maxLength)

  })

  it('does not clip the hashtag when input is truncated', async () => {

    const longTextUserTag = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex augue, scelerisque eget venenatis vel, tincidunt ac metus. Duis nunc velit, volutpat ac mollis eget, imperdiet sed nisi. Vivamus urna ipsum, euismod sed feugiat quis, laoreet pharetra metus. Donec dictum felis aic purus suscipit #Tomato'
    const longTextSysTag  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex augue, scelerisque eget venenatis vel, tincidunt ac metus. Duis nunc velit, volutpat ac mollis eget, imperdiet sed nisi. Vivamus urna ipsum, euismod sed feugiat quis, laoreet pharetra metus. Donec dictum felis aic purus suscipit congue.'

    expect(await processTweet(longTextUserTag)).toMatch(/ #Tomato$/)
    expect(await processTweet(longTextSysTag)).toMatch(/ #Tomato$/)

  })

  it('adjusts maximum length for url shortening', async () => {

    const longURL  = 'https://nowhere.com/somewhere/elsewhere'
    const longText = `Lorem ipsum dolor sit amet, ${longURL} consectetur adipiscing elit. Sed ex augue, scelerisque eget venenatis vel, tincidunt ac metus. Duis nunc velit, volutpat ac mollis eget, imperdiet sed nisi. Vivamus urna ipsum, euismod sed feugiat quis, laoreet pharetra metus. Donec dictum felis aic purus suscipit congue.`
    const urlDiff  = longURL.length - 20

    expect((await processTweet(longText)).length).toEqual(maxLength + urlDiff)

  })

  it('recognises hashtags in different languages and does not auto-append', async () => {

    expect(await processTweet('Lorem #Tomate')).not.toEqual('Lorem #Tomate #Tomato')
    expect(await processTweet('Lorem #Pomodoro')).not.toEqual('Lorem #Pomodoro #Tomato')
    expect(await processTweet('Lorem #Tomaat')).not.toEqual('Lorem #Tomaat #Tomato')
    expect(await processTweet('Lorem #Pomidor')).not.toEqual('Lorem #Pomidor #Tomato')

  })

  it('adds the correct hashtag by detected language', async () => {

    expect(await processTweet('Text written in English')).toEqual('Text written in English #Tomato')

    jestFetch('fr')
    expect(await processTweet('Texte rédigé en français')).toEqual('Texte rédigé en français #Tomate')

    jestFetch('it')
    expect(await processTweet('Testo scritto in italiano')).toEqual('Testo scritto in italiano #Pomodoro')

    jestFetch('nl')
    expect(await processTweet('Tekst geschreven in het Nederlands')).toEqual('Tekst geschreven in het Nederlands #Tomaat')

    jestFetch('pl')
    expect(await processTweet('Tekst napisany w języku polskim')).toEqual('Tekst napisany w języku polskim #Pomidor')

  })

})