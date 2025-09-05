"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { X, Minus, Maximize2, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSaveNote: (contactId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

interface Contact {
  id: string;
  name: string;
  notes: ContactNote[];
}

interface ContactNote {
  id: string;
  content: string;
  author: string;
  authorInitials: string;
  createdAt: string;
  canDelete: boolean; // true if current user created this note
}

export function ContactNotesPanel({
  isOpen,
  onClose,
  contact,
  onSaveNote,
  onDeleteNote,
}: ContactNotesPanelProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom-right when first opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = 400;
      const panelHeight = isCollapsed ? 60 : 600;

      setPosition({
        x: windowWidth - panelWidth - 24,
        y: windowHeight - panelHeight - 24,
      });
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, isCollapsed]);

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return;

    setIsDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep panel within viewport
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - (isCollapsed ? 60 : 600);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isCollapsed]);

  const handleClose = () => {
    setNewNoteContent("");
    onClose();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSaveNote = () => {
    if (!contact || !newNoteContent.trim()) return;

    onSaveNote(contact.id, newNoteContent.trim());
    setNewNoteContent("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!isOpen || !contact) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-80 h-16" : "w-96 h-[600px]",
        isDragging ? "cursor-grabbing" : ""
      )}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header - Always Visible */}
      <div
        ref={dragHandleRef}
        className={cn(
          "flex items-center justify-between p-4 border-b border-gray-200 cursor-grab active:cursor-grabbing rounded-t-lg select-none",
          isCollapsed && "border-b-0 rounded-b-lg"
        )}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            Notes: {contact.name}
          </span>
          {isCollapsed && contact.notes.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {contact.notes.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="flex flex-col h-[calc(100%-65px)]">
          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {contact.notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No notes yet</p>
                <p className="text-xs mt-1">Add a note below to get started</p>
              </div>
            ) : (
              contact.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-3 border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {note.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    {note.canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteNote(note.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Note Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Add a note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewNoteContent("")}
                  disabled={!newNoteContent.trim()}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNote}
                  disabled={!newNoteContent.trim()}
                >
                  Add note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
