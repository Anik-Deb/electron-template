import HardBreak from '@tiptap/extension-hard-break'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import Tiptap from '../tiptap/tiptap'

export default function Description({ height, field, placeholder, children, ...props }) {
  const [isClicked, setIsClicked] = React.useState(false)

  return !isClicked ? (
    <div
      {...props}
      onClick={() => setIsClicked((prev) => !prev)}
      className="cursor-default text-[13px] text-gray-400 border rounded-md hover:border-gray-600 px-3 py-2 min-h-14"
    >
      {field?.value ? (
        <span className="text-gray-600 text-xs" dangerouslySetInnerHTML={{ __html: field?.value }} />
      ) : (
        <span className="text-xs">{placeholder}</span>
      )}
    </div>
  ) : (
    <>
      {children ? (
        children
      ) : (
        <Tiptap
          height={height || '80'}
          className={`font-normal text-xs ${props?.className}`}
          description={field.value || ''}
          onChange={field.onChange}
          {...field}
        />
      )}
    </>
  )
}
