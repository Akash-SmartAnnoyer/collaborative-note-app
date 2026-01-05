'use client'

import { useEffect } from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useNotesStore } from '@/store/notesStore'
import { collaborationManager } from '@/utils/collaboration'
import { NoteList } from './NoteList'
import { NoteEditor } from './NoteEditor'
import { VersionHistory } from './VersionHistory'

export function NotesApp() {
  const { notes, selectedNoteId, addNote, updateNote, deleteNote } = useNotesStore()

  useEffect(() => {
    // Load notes from localStorage on mount
    const stored = localStorage.getItem('collaborative_notes')
    if (stored) {
      try {
        const parsedNotes = JSON.parse(stored)
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          versions: (note.versions || []).map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp)
          }))
        }))
        // Sync notes to store
        notesWithDates.forEach((note: any) => {
          if (!notes.find(n => n.id === note.id)) {
            addNote(note)
          }
        })
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }

    // Initialize collaboration manager
    collaborationManager.start((syncedNotes) => {
      // In a real app, this would merge changes intelligently
      // For now, we'll just sync from localStorage
    })

    return () => {
      collaborationManager.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      collaborationManager.saveNotes(notes)
    }
  }, [notes])

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <NoteList />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="flex-1 overflow-hidden">
              <NoteEditor note={selectedNote} />
            </div>
            <div className="h-64 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <VersionHistory note={selectedNote} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardBody>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Select a note from the sidebar or create a new one to get started
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

