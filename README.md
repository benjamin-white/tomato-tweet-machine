# **_Tomato Tweet Machine_**

## **_Overview_**

The purpose of this project is to auto-append a **#Tomato** tag to and restrict the character length of a user's input. The component should also match the below requirements.

I took note of the mention regarding not changing the tech stack too much; as the example used `Parcel` and vanilla js I stuck with those. I wanted to have the option of writing tests where I felt relevant but haven't used `Parcel` before and have recently been using `React Testing Library`. The result was adding the ability to run tests did change the overall structure more than I expected.

## **_The Requirements_**

1. It should not be possible to type in the output text box.  
_For this I made the `#output` textarea `readonly` and added a basic test (as much for documentation)._
2. It should be possible to see an entire tweet in both text boxes without having to manually resize it.  
_I used Javascript to listen for input events on the textarea and resize events on the viewport and then dynamically resized the textarea based on its content's height. This invovles somewhat hijacking builtin browser behaviour but felt doing so gave the only satisfactory result. I did not add a test for this as it seemed particularly difficult to test for in a meaningful way._
3. The "tweetify" button should be removed. Instead, the output text should update as the user is typing.  
_For this I moved the event listener to the `#input` textarea and changed the event type to `input`. I did initially use the intuitive `keyup` event but this appears to fire a little too late to work **smoothly** with the resizing in the above point. I throttled the event to every 100ms though I'm not sure anyway would actually type that fast!_
4. There should be a randomised delay between input and output, so the system would appear to be "doing more" (client's words). The delay time should vary between 500 ms and 2500 ms.  
_With this requirement I randomly set a delay on the `processTweet` functionality through `setTimeout`. I used a helper function to remap the domain of `Math.random` to between 500 and 2500. I considered testing this, including at one point using a `MutationObserver`, but concluded it might be excessive to do so. Restructuring the component may make it easier to test without needing to infer the timing from DOM changes._
5. When the user's input text is already on-message (no hashtag is added), its length should still be truncated to fit in a tweet. Make sure not to cut off the hashtag!  
_I updated the code in `marketingLogic.js` creating a new function, `truncate`. I decided if there were multiple valid hashtags in the user's input only the first would be considered as accepting multiple, eg. **Lorem #Tomato ipsum #Tomato doler**, becomes distintly more involved and may have been out of spec to consider._
6. The Association is trying to expand its international reach; The tweetifier should accept #Tomate (French), #Pomodoro (Italian), #Tomaat (Dutch) and #Pomidor (Polish) as additional valid hashtags - and not add #Tomato after them.  
_For this I updated the regex used inside `processTweet` to recognise the addtional languages as valid._
7. 280-character, multilingual, and URL-containing tweets should be supported as they are on Twitter.com. (NOTE: The maximum length of a tweet changed in 2017, but the PO only got the budget to adapt their system recently.)  
_I hope that I understood this correctly by creating a function in `marketingLogic.js` called `getMaxLength` that detects if the input contains URLs and increases the maximum allowed length on the condition that the URL is long enough to be shortened by the t.co service. The current short URL length on t.co appears to be 20 characters but I believe this can change so querying Twitter and persisting the value on a daily basis could be an improvement for robustness. For brevity I used a package called `linkify` to assist in detecting URLs. I now think I could run [`twitter-text`](https://github.com/twitter/twitter-text) in the browser which if so would have been the better option for this._
8. In addition to the aforementioned international hashtags being accepted, the client would also like us to detect the language of a tweet and add the most appropriate available hashtag.  
_This proved more involved than I initially expected as I found no way to do this client side. For the task I used a language lookup API with reasonable rate limiting as I was concerned the textarea event could fire quite frequently. There are node and PHP packages based on Google's Compact Language Detection library that could be used to setup an endpoint for this and thereby avoid relying on a third party service._

## **_To Run Locally_**

````
git clone git@github.com:benjamin-white/tomato-tweet-machine.git
cd tomato-tweet-machine
npm i
npm run start
````

After running the above commands [localhost:1234](localhost:1234) should be open in your default browser and the project viewable there.

To run the test suite use `npm run test` in the project's root directory.

## **_Improvements and Future Features_**

As noted above using a custom service for language detection and leveraging a twitter package for tweet formatting would both improve the robustness. Restructuring the code could make isolated testing of functionality easier and I think `React` would be useful at this point.