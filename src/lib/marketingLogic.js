import * as linkify from 'linkifyjs'

const detectLanguage = async (string) => {

  if (string.length < 5 ) return {data: null}

  const endpoint = 'https://ws.detectlanguage.com/0.2/detect'

  try {

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LANG_API_KEY}`
      },
      body: JSON.stringify({q: string})
    })

    if (!response.ok) {
      console.warn(`Unable to fetch from ${endpoint}`)
      return {data: null}
    }

    const data = await response.json()
    return data

  } catch (error) {

    console.error(error)
    return {data: null}

  }

}

const getMaxLength = (tweet) => {

  let maxLength        = 280
  const shortUrlLength = 20 // TODO: daily cached lookup of this value through the Twitter configuration endpoint
  const links          = linkify.find(tweet)

  links.forEach(link => {
    const linkLength = link.end - link.start
    if (linkLength > shortUrlLength) maxLength += linkLength - shortUrlLength
  })

  return maxLength

}

const truncate = (tweet, maxLength, tag) => {

  if (tweet.length <= maxLength) return tweet

  const tagPosEnd = tweet.toLowerCase().indexOf(tag.toLowerCase()) + tag.length

  return tagPosEnd > maxLength ? tweet.substr(0, maxLength - tag.length) + tag : tweet.substr(0, maxLength)

}

const addHashtag = (tweet, tag) => `${tweet}${tag}`

const processTweet = async (tweet) => {

  const tags = {
    en: ' #Tomato',
    fr: ' #Tomate',
    it: ' #Pomodoro',
    nl: ' #Tomaat',
    pl: ' #Pomidor'
  }

  const hasTag = tweet.match(/#Tomato|#Tomate|#Pomodoro|#Tomaat|#Pomidor/i)

  if (!hasTag) {

    const { data } = await detectLanguage(tweet)
    const tag      = data && Array.isArray(data.detections) ? tags[data.detections[0].language] || tags.en : tags.en

    return truncate(
      addHashtag(tweet, tag),
      getMaxLength(tweet),
      tag
    )

  }

  return truncate(
    tweet,
    getMaxLength(tweet),
    ` ${hasTag[0]}`
  )

}

export default processTweet