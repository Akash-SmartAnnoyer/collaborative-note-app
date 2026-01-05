'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [editorValue, setEditorValue] = useState(value)
  const isInternalChange = useRef(false)

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sync external value changes to editor (only when value changes externally)
  useEffect(() => {
    if (!isInternalChange.current && value !== editorValue) {
      setEditorValue(value)
    }
    isInternalChange.current = false
  }, [value, editorValue])

  const modules = useMemo(
    () => ({
      toolbar: isMobile
        ? [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
          ]
        : [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            [{ color: [] }, { background: [] }],
            ['clean']
          ]
    }),
    [isMobile]
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
    'color',
    'background'
  ]

  return (
    <>
      <style jsx global>{`
        .rich-text-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .rich-text-editor .ql-container .ql-editor-container {
          position: relative;
          flex: 1;
        }
        .rich-text-editor .ql-editor {
          flex: 1;
          min-height: 200px;
          padding: 12px 15px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .rich-text-editor .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          z-index: 10;
        }
        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 8px;
          display: inline-flex;
        }
        .rich-text-editor .ql-toolbar button {
          width: 28px;
          height: 28px;
          padding: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .rich-text-editor .ql-container {
          border: none;
        }
        .dark .rich-text-editor .ql-toolbar {
          border-bottom-color: #374151;
        }
        .dark .rich-text-editor .ql-toolbar button:hover,
        .dark .rich-text-editor .ql-toolbar button.ql-active {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .dark .rich-text-editor .ql-editor {
          color: #f3f4f6;
        }
        @media (max-width: 640px) {
          .rich-text-editor .ql-toolbar {
            padding: 8px 6px;
            flex-wrap: wrap;
            gap: 4px;
          }
          .rich-text-editor .ql-toolbar .ql-formats {
            margin-right: 4px;
            margin-bottom: 4px;
          }
          .rich-text-editor .ql-toolbar button {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
            touch-action: manipulation;
          }
          .rich-text-editor .ql-editor {
            min-height: 300px;
            padding: 12px 15px;
            font-size: 16px !important; /* Prevents zoom on iOS */
            -webkit-user-select: text;
            user-select: text;
            -webkit-tap-highlight-color: transparent;
          }
          .rich-text-editor .ql-editor:focus {
            outline: none;
          }
          .rich-text-editor .ql-container {
            height: auto;
            min-height: 300px;
            position: relative;
          }
          .rich-text-editor .ql-editor {
            position: relative;
            z-index: 1;
          }
          .rich-text-editor .ql-toolbar {
            position: relative;
            z-index: 2;
          }
        }
      `}</style>
      <div className="rich-text-editor h-full">
        {isMounted && (
          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={(newValue) => {
              isInternalChange.current = true
              setEditorValue(newValue)
              onChange(newValue)
            }}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            bounds=".rich-text-editor"
            preserveWhitespace={true}
          />
        )}
      </div>
    </>
  )
}

