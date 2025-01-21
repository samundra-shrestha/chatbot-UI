import { useEffect, useState, useRef } from 'react'
import './App.scss'
import { THistoryDetails } from './types';
import { ExpandableForm } from './components/expandable-form';
import { useMutation } from '@tanstack/react-query';
import { makeQuery } from './helper/helper';
import { URLData } from './helper/data';
import { TQueryData } from './helper/types';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function App() {
  // states
  const [load, setLoaded] = useState<boolean>(false);
  const [uniqueKey, setUniqueKey] = useState<string>('');
  console.log("🚀 ~ App ~ uniqueKey:", uniqueKey)
  const [expandText, setExpandText] = useState<boolean>(false);
  const [content, setContent] = useState<string>(''); // Store the content in React state
  const [history, setHistory] = useState<THistoryDetails[]>([]);
  const [tempQuestion, setTempQuestion] = useState('')
  const [url, setUrl] = useState<string>('')
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TQueryData) => makeQuery(data.url, data),
    mutationKey: ['make', 'query'],
    onSuccess: async (data) => {
      await setHistory([...history, { question: tempQuestion, message: data }])
      setTempQuestion('')
    },
    onError: () => {
      setContent(tempQuestion)
      console.log('error')
    }
  });



  // handlers

  function handleExpandOpen() {
    setExpandText(true)
    window.parent.postMessage('button-clicked', 'http://127.0.0.1:5500');
  }
  function handleExpandClose() {
    setContent("");
    setHistory([]);
    setExpandText(false);
    window.parent.postMessage('remove-clicked', 'http://127.0.0.1:5500');
  }

  async function handleSubmit() {
    // setHistory([...history, { question: content, message: '' }])
    setTempQuestion(content)
    mutateAsync({ url, query: content, unique_key: uniqueKey });
    setContent('');

  }

  // this section is for handling iframe communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message comes from the expected origin
      if (event.origin !== 'http://127.0.0.1:5500') return;
      setUniqueKey(event.data);
      console.log('Message received from parent', event.data);
      if (event.data == "Loaded") {
        setLoaded(!load);
      }
      // If you want to notify the parent (or trigger something in the parent)
      // Post a message back to the parent to manipulate the parent's document
      if (event.data === 'add-class-to-parent') {
        window.parent.postMessage('add-class', 'http://127.0.0.1:5500');
      }
    };
    // Listen for messages from the parent
    window.addEventListener('message', handleMessage);
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  // Scroll to the last message when history updates
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, tempQuestion]); // This will trigger every time history updates

  useEffect(() => {
    if (URLData.length > 0 && !url) {
      setUrl(URLData[0].url);
    }
  }, [URLData]);
  return (
    <>
      <div className={`options ${ expandText ? 'active' : ''}`}
      >
        {
          URLData.map((item) => {
            return (
              <button
                key={item.url}
                className={`chatbot__button ${item.url === url ? 'selected' : ''}`}
                // if you want to high light the selected button, you can add a class here
                // compare 'item.url' with the 'url' and add the class
                // example: className={item.url === url ? 'selected' : ''}
                type='button'
                onClick={() => {
                  setUrl(item.url)
                }}
              >
                {item.label}
              </button>
            )
          }
          )
        }
      </div>
      <div className={`chatbot__container ${expandText ? 'open' : 'close'}`}>

        <div className="chatbot__message" >
          <div className="message__container">
            {
              Array.isArray(history) && history.length <= 0 ?
                <div>
                  {
                    isPending ? tempQuestion &&
                      <p className='message question'>{tempQuestion}</p>
                      :
                      <p className='message'>Hello, I am a chatbot, how can I help you?</p>
                  }
                </div>
                :
                <>
                  {
                    Array.isArray(history) && history.map((item, index) => {
                      return (
                        <div key={index} className='message__item' >
                          <p className='message question'>{item.question}</p>
                          <div className='message answer'><Markdown remarkPlugins={[remarkGfm]}>{item.message}</Markdown></div>

                        </div>
                      )
                    })
                  }
                  {tempQuestion &&
                    <p className='message question'>{tempQuestion}</p>
                  }
                  {<div ref={lastMessageRef} />}
                </>
            }
          </div>
        </div>
        <div className="chatbot__outer"  >
          <div className="chatbot__input" >
            {/* <textarea placeholder='What can I Help me with' /> */}
            {/* <ContentEditableComponent sendDataToParent={handleInputFieldActive}
              content={content} setContent={setContent} /> */}
            <ExpandableForm
              // mutateAsync={mutateAsync}
              handleSubmit={handleSubmit}
              content={content}
              setContent={setContent}
              isPending={isPending}
            />
            <div className={`button__holder  `}>
              <button className='chatbot__button open__message' type='button'
                onClick={() => handleExpandOpen()}
              >
                <div className="bot__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16" />
                    <line x1="16" y1="16" x2="16" y2="16" />
                  </svg>
                </div>
              </button>
              <button
                className={`chatbot__button send__message`}
                type='submit'
                disabled={isPending}
                onClick={handleSubmit}
              >
                <div className="bot__icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 25.3327V6.66602" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.6665 15.9993L15.9998 6.66602L25.3332 15.9993" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <button className='close__btn' type='button' onClick={handleExpandClose}>X</button>
        </div>
      </div>
    </>
  )
}

export default App
