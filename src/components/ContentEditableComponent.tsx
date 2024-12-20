import React, { useEffect, useRef } from 'react';
import { TContentEditableComponentProps } from './types';

const ContentEditableComponent: React.FC<TContentEditableComponentProps> = ({ sendDataToParent, content, setContent }) => {
  const divRef = useRef<HTMLDivElement>(null); // Create a ref for the contentEditable div
  // Handle content input and update the state
  // here we get the input entered by the user
  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
      const newContent = (event.target as HTMLDivElement).innerText;
      setContent(newContent); // Update the content in the state
  };

  // Manage placeholder visibility based on the content
  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    if (content.trim() === '') {
      // Add placeholder class when content is empty
      div.classList.add('placeholder');
      sendDataToParent(false);
    } else {
      // Remove placeholder class when content is present
      div.classList.remove('placeholder');
      sendDataToParent(true);
    }
    if (content !== div.innerText) {
      div.innerText = content;
    }
  }, [content, sendDataToParent]);

  return (
    <div
      ref={divRef}
      contentEditable
      className="text__input"
      onInput={handleInput}
      suppressContentEditableWarning={true}
      role="textbox"
      aria-placeholder="What can I help you with?"
    >
      {/* We no longer need to render the placeholder text inside the div directly */}
    </div>
  );
};

export default ContentEditableComponent;
