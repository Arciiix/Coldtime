import { useEffect, useState } from "react";

interface ITypingTextAnim {
  texts: string[];
}

export default function TypingTextAnim({ texts }: ITypingTextAnim) {
  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[textIndex];

      if (isDeleting) {
        setText(currentText.substring(0, text.length - 1));
      } else {
        setText(currentText.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentText) {
        setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(50);
        }, 1000);
      } else if (isDeleting && text.length <= 2) {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % texts.length);
        setTypingSpeed(100);
      }
    };

    const typingInterval = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingInterval);
  }, [text, textIndex, isDeleting, typingSpeed]);

  return <span>{text}</span>;
}
