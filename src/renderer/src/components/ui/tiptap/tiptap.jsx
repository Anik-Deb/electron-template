/*Version 1*/
import React, { forwardRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'
import Toolbar from './toolbar'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/utils'

// Use `HTMLDivElement` type for the ref
const Tiptap = forwardRef(({ height, description, onChange, className }, ref) => {
  /* version 1*/
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          `min-h-[${height}px] max-h-[150px] text-xs w-full rounded-md rounded-br-none rounded-bl-none bg-white px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto`
      }
    },
    extensions: [
      StarterKit.configure({
        // orderedList: {
        //   HTMLAttributes: {
        //     class: 'list-decimal pl-4'
        //   }
        // },
        // bulletList: {
        //   HTMLAttributes: {
        //     class: 'list-disc pl-4'
        //   }
        // }
      }),
      Placeholder.configure({
        placeholder: 'Enter something'
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak()
          }
        }
      })
    ],
    content: `<div>${description}</div>`, // Set the initial content with the provided value
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()) // Call the onChange callback with the updated HTML content
    },
    immediatelyRender: false
  })

  return (
    <div
      ref={ref}
      className={`flex min-h-fit flex-col justify-stretch overflow-hidden rounded-lg border ${className}`}
    >
      <Toolbar editor={editor} className={''} />
      <EditorContent editor={editor} className="text-gray-600 bg-white border-none text-xs" />
    </div>
  )
})

Tiptap.displayName = 'Tiptap'

export default Tiptap
