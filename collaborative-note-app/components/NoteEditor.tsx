'use client'

import { useState, useEffect } from 'react'
import { Input, Card, CardBody, Button } from '@nextui-org/react'
import { Save, Check } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { Note } from '@/types'
import { RichTextEditor } from './RichTextEditor'

interface NoteEditorProps {
  note: Note
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote } = useNotesStore()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setHasChanges(false)
    setIsSaved(false)
  }, [note.id, note.title, note.content])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setHasChanges(value !== note.title || content !== note.content)
    setIsSaved(false)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasChanges(title !== note.title || value !== note.content)
    setIsSaved(false)
  }

  const handleSave = () => {
    if (!hasChanges) return
    
    setIsSaving(true)
    updateNote(note.id, title, content)
    
    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)
      setHasChanges(false)
      setTimeout(() => setIsSaved(false), 2000)
    }, 300)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note title..."
              variant="flat"
              size="lg"
              classNames={{
                input: 'text-2xl font-bold',
                inputWrapper: 'bg-transparent shadow-none'
              }}
            />
          </div>
          <Button
            color="primary"
            onPress={handleSave}
            isDisabled={!hasChanges || isSaving}
            isLoading={isSaving}
            startContent={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        {hasChanges && !isSaving && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">You have unsaved changes</p>
        )}
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <Card className="h-full">
          <CardBody className="p-0 h-full">
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your note..."
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

