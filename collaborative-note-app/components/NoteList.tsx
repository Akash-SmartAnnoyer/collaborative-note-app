'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
  ScrollShadow,
  Spacer,
  Tooltip
} from '@nextui-org/react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { generateId } from '@/utils/idGenerator'
import { formatRelativeTime } from '@/utils/dateFormatter'

interface NoteListProps {
  hideTitle?: boolean
}

export function NoteList({ hideTitle = false }: NoteListProps) {
  const { notes, selectedNoteId, addNote, selectNote, deleteNote } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreateNote = () => {
    const newNote = {
      id: generateId(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: []
    }
    addNote(newNote)
  }

  const handleDeleteNote = (noteId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        deleteNote(noteId)
      } catch (error) {
        console.error('Error deleting note:', error)
        alert('Failed to delete note. Please try again.')
      }
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        {!hideTitle && (
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Notes
            </h1>
          </div>
        )}
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          size="sm"
          variant="bordered"
          classNames={{
            input: "text-sm sm:text-base"
          }}
        />
        <Spacer y={2} />
        <Button
          color="primary"
          variant="flat"
          onPress={handleCreateNote}
          startContent={<Plus className="w-4 h-4" />}
          className="w-full"
          size="md"
        >
          New Note
        </Button>
      </div>

      <ScrollShadow className="flex-1">
        <div className="p-2">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {searchQuery ? 'No notes found' : 'No notes yet. Create one!'}
            </div>
          ) : (
            sortedNotes.map((note) => (
              <Card
                key={note.id}
                isPressable
                onPress={() => {
                  selectNote(note.id)
                }}
                className={`mb-2 cursor-pointer transition-all touch-manipulation ${
                  selectedNoteId === note.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent active:bg-gray-100 dark:active:bg-gray-700'
                }`}
              >
                <CardBody className="p-2 sm:p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 overflow-hidden text-ellipsis">
                        {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 sm:mt-2 truncate">
                        {formatRelativeTime(note.updatedAt)}
                      </p>
                    </div>
                    <Tooltip content="Delete note">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDeleteNote(note.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </ScrollShadow>
    </div>
  )
}

