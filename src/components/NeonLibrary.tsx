import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Save, Share2 } from 'lucide-react';

export const NeonLibrary = () => {
  // States
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  
  // Library ID for sharing
  const [libraryId] = useState(() => {
    const urlId = new URLSearchParams(window.location.search).get('id');
    if (urlId) return urlId;
    
    const storedId = localStorage.getItem('libraryId');
    if (storedId) return storedId;
    
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('libraryId', newId);
    return newId;
  });

  // Categories
  const categories = [
    'metas',
    'analisador',
    'dashboards',
    'prompts',
    'marketing',
    'operacional',
    'cs',
    'criativos'
  ];

  // New book form state
  const [newBook, setNewBook] = useState({
    title: '',
    url: '',
    description: '',
    color: '#9333EA',
    category: 'metas'
  });

  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem(`library-${libraryId}`);
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error('Error loading library:', e);
        setBooks([]);
      }
    }
  }, [libraryId]);

  // Save books to localStorage
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(`library-${libraryId}`, JSON.stringify(books));
    }
  }, [books, libraryId]);

  // Handlers
  const shareLibrary = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${libraryId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };

  const addBook = () => {
    if (newBook.title && newBook.url) {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setNewBook({
        title: '',
        url: '',
        description: '',
        color: '#9333EA',
        category: 'metas'
      });
      setShowAddForm(false);
    }
  };

  const removeBook = (id, e) => {
    e.stopPropagation();
    setBooks(books.filter(book => book.id !== id));
    if (selectedBook && selectedBook.id === id) {
      setShowDetails(false);
      setSelectedBook(null);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowDetails(true);
  };

  // Filter and group books
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedBooks = filteredBooks.reduce((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-purple-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Biblioteca Neon
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar site..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 p-2 pl-10 rounded border border-purple-500 bg-gray-800 text-purple-100 placeholder-purple-400"
              />
              <Search className="absolute left-3 top-2.5 text-purple-400" size={20} />
            </div>
            <button
              onClick={shareLibrary}
              className="p-2 bg-purple-900 text-purple-100 rounded border border-purple-500 hover:bg-purple-800 flex items-center gap-2"
            >
              <Share2 size={20} /> Compartilhar
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="p-2 bg-purple-900 text-purple-100 rounded border border-purple-500 hover:bg-purple-800 flex items-center gap-2"
            >
              <Plus size={20} /> Adicionar Site
            </button>
          </div>
        </div>
      </div>

      {/* Copy notification */}
      {showCopiedMessage && (
        <div className="fixed top-4 right-4 bg-purple-900 text-purple-100 p-4 rounded-lg border border-purple-500">
          Link copiado para a área de transferência!
        </div>
      )}

      {/* Add form modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-purple-500 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Adicionar Novo Site</h3>
              <button onClick={() => setShowAddForm(false)} className="text-purple-400 hover:text-purple-300">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Título do Site"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="p-2 rounded border border-purple-500 bg-gray-800"
              />
              <input
                type="text"
                placeholder="URL"
                value={newBook.url}
                onChange={(e) => setNewBook({ ...newBook, url: e.target.value })}
                className="p-2 rounded border border-purple-500 bg-gray-800"
              />
              <textarea
                placeholder="Descrição do Site"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="p-2 rounded border border-purple-500 bg-gray-800 h-24 resize-none"
              />
              <div className="flex gap-4">
                <input
                  type="color"
                  value={newBook.color}
                  onChange={(e) => setNewBook({ ...newBook, color: e.target.value })}
                  className="w-16 h-8"
                />
                <select
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="p-2 rounded border border-purple-500 bg-gray-800 flex-1"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={addBook}
                className="p-2 bg-purple-900 rounded border border-purple-500 hover:bg-purple-800 flex items-center justify-center gap-2"
              >
                <Save size={20} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {categories.map(category => {
          const categoryBooks = groupedBooks[category] || [];
          return (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="grid grid-cols-6 gap-4">
                {categoryBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="group relative h-40 w-24 cursor-pointer transition-transform hover:-translate-y-2"
                  >
                    <div
                      className="absolute inset-0 rounded shadow-lg"
                      style={{ 
                        backgroundColor: book.color,
                        boxShadow: `0 0 10px ${book.color}40`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <span className="text-white text-sm font-medium text-center">
                          {book.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => removeBook(book.id, e)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} className="text-white hover:text-purple-200" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details modal */}
      {showDetails && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-purple-500 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{selectedBook.title}</h3>
              <button onClick={() => setShowDetails(false)} className="text-purple-400 hover:text-purple-300">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.open(selectedBook.url, '_blank')}
                className="p-2 bg-purple-900 rounded border border-purple-500 hover:bg-purple-800"
              >
                Visitar Site
              </button>
              <div className="bg-gray-800 rounded p-4">
                <div className="mb-4">
                  <label className="text-sm font-medium text-purple-300">URL:</label>
                  <p className="text-purple-100 break-all">{selectedBook.url}</p>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-purple-300">Categoria:</label>
                  <p className="text-purple-100">
                    {selectedBook.category.charAt(0).toUpperCase() + selectedBook.category.slice(1)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-300">Descrição:</label>
                  <p className="text-purple-100 whitespace-pre-wrap">
                    {selectedBook.description || "Nenhuma descrição disponível."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};