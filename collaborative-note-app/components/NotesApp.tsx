'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody, Drawer, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, Button } from '@nextui-org/react'
import { Menu, X } from 'lucide-react'
import { useNotesStore } from '@/store/notesStore'
import { collaborationManager } from '@/utils/collaboration'
import { NoteList } from './NoteList'
import { NoteEditor } from './NoteEditor'
import { VersionHistory } from './VersionHistory'

export function NotesApp() {
  const { notes, selectedNoteId, addNote, setNotes, updateNote, deleteNote, isInitialized } = useNotesStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMobile, setIsMobile] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Load notes from localStorage only once on initial mount
    if (hasLoaded) return
    
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
        // Set all notes at once instead of adding one by one
        setNotes(notesWithDates)
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }
    
    setHasLoaded(true)

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

  // Save notes to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (hasLoaded && notes.length >= 0) {
      collaborationManager.saveNotes(notes)
    }
  }, [notes, hasLoaded])

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  // Close drawer when note is selected on mobile
  useEffect(() => {
    if (selectedNote && isMobile) {
      onClose()
    }
  }, [selectedNoteId, isMobile, onClose])

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <NoteList />
      </div>

      {/* Mobile Menu Button - Always visible on mobile */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            isIconOnly
            variant="flat"
            onPress={onOpen}
            className="bg-white dark:bg-gray-800 shadow-lg"
            size="md"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        size="sm"
        hideCloseButton={true}
        classNames={{
          base: "md:hidden",
          wrapper: "md:hidden"
        }}
      >
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              size="sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </DrawerHeader>
          <DrawerBody className="p-0">
            <NoteList hideTitle={true} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {selectedNote ? (
          <>
            <div className="flex-1 overflow-hidden">
              <NoteEditor note={selectedNote} onMenuClick={isMobile ? onOpen : undefined} isMobile={isMobile} />
            </div>
            {/* Version History - Always visible, but collapsible on mobile */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 md:h-64">
              <VersionHistory note={selectedNote} isMobile={isMobile} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardBody>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {isMobile ? (
                    <>Tap the menu button to view notes or create a new one</>
                  ) : (
                    <>Select a note from the sidebar or create a new one to get started</>
                  )}
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

