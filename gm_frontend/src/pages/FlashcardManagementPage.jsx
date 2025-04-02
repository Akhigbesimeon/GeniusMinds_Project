import { 
  BookOpen, 
  Plus,
  Edit,
  Trash,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Tag,
  Bookmark,
  Copy,
  Eye
} from 'lucide-react';
import React from 'react';
import Sidebar from '../components/SideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';

const FlashcardManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [expandedSet, setExpandedSet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Form states
  const [newSet, setNewSet] = useState({
    title: '',
    description: '',
    category: 'general',
    is_public: true
  });
  
  const [newFlashcard, setNewFlashcard] = useState({
    front_text: '',
    back_text: '',
    tags: ''
  });

  useEffect(() => {
    // Fetch flashcard sets from API
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcard-sets`, { 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };

  const handleAddSet = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flashcard-sets`, 
        newSet,
        { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        }
      );
      setShowAddSetModal(false);
      setNewSet({
        title: '',
        description: '',
        category: 'general',
        is_public: true
      });
      fetchFlashcardSets();
    } catch (error) {
      console.error('Error adding flashcard set:', error);
    }
  };

  const handleAddFlashcard = async () => {
    if (!selectedSet) return;
    
    const formattedTags = newFlashcard.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flashcard-sets/${selectedSet.id}/cards`, 
        {
          ...newFlashcard,
          tags: formattedTags
        },
        { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        }
      );
      setShowAddCardModal(false);
      setNewFlashcard({
        front_text: '',
        back_text: '',
        tags: ''
      });
      fetchFlashcardSets();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const handleDeleteSet = async (setId) => {
    if (window.confirm('Are you sure you want to delete this flashcard set? All flashcards in this set will also be deleted.')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/flashcard-sets/${setId}`, 
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
          }
        );
        fetchFlashcardSets();
      } catch (error) {
        console.error('Error deleting flashcard set:', error);
      }
    }
  };

  const handleDeleteFlashcard = async (setId, cardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/flashcard-sets/${setId}/cards/${cardId}`, 
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
          }
        );
        fetchFlashcardSets();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };

  const filteredFlashcardSets = flashcardSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || set.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch(category) {
      case 'language': return 'text-purple-600 bg-purple-100';
      case 'science': return 'text-blue-600 bg-blue-100';
      case 'math': return 'text-amber-600 bg-amber-100';
      case 'history': return 'text-red-600 bg-red-100';
      case 'arts': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'language', label: 'Language' },
    { value: 'science', label: 'Science' },
    { value: 'math', label: 'Math' },
    { value: 'history', label: 'History' },
    { value: 'arts', label: 'Arts' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <BookOpen className="h-6 w-6" />
                </button>
                <h1 className="ml-2 text-xl font-semibold text-gray-800">Flashcard Management</h1>
              </div>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="relative mx-4">
                  <input 
                    type="text" 
                    placeholder="Search flashcard sets..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-indigo-700 transition-colors"
                  onClick={() => setShowAddSetModal(true)}
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add New Set
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium mr-4">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat.value}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryFilter === cat.value 
                        ? cat.value === 'all'
                          ? 'bg-indigo-600 text-white'
                          : `${getCategoryColor(cat.value).replace('bg-', 'bg-').replace('text-', 'text-white')}`
                        : cat.value === 'all'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : `${getCategoryColor(cat.value)} hover:bg-opacity-80`
                    }`}
                    onClick={() => setCategoryFilter(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Flashcard Sets List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Your Flashcard Sets</h2>
                <p className="text-gray-500 mt-1">Manage your flashcard sets and cards</p>
              </div>
              
              {filteredFlashcardSets.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No flashcard sets found</h3>
                  <p className="mt-1 text-gray-500">
                    {searchQuery ? "Try adjusting your search or filter" : "Create your first flashcard set by clicking the 'Add New Set' button"}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredFlashcardSets.map((set) => (
                    <li key={set.id} className="hover:bg-gray-50">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => setExpandedSet(expandedSet === set.id ? null : set.id)}
                              className="mr-2 p-1 rounded-full hover:bg-gray-200"
                            >
                              {expandedSet === set.id ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{set.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{set.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(set.category)}`}>
                              {set.category.charAt(0).toUpperCase() + set.category.slice(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {set.flashcards ? set.flashcards.length : 0} cards
                            </span>
                            <span className="flex items-center text-gray-600 text-sm">
                              {set.is_public ? (
                                <Eye className="h-4 w-4 mr-1" />
                              ) : (
                                <Bookmark className="h-4 w-4 mr-1" />
                              )}
                              {set.is_public ? 'Public' : 'Private'}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedSet(set);
                                  setShowAddCardModal(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                                title="Add Card"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                              <button
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-full"
                                title="Edit Set"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSet(set.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                title="Delete Set"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded View - Flashcards */}
                        {expandedSet === set.id && (
                          <div className="mt-4 pl-8">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Flashcards:</h4>
                            {set.flashcards && set.flashcards.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {set.flashcards.map((card, index) => (
                                  <div key={card.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between mb-2">
                                      <span className="font-medium text-gray-600">Card {index + 1}</span>
                                      <div className="flex space-x-1">
                                        <button
                                          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                                          title="Edit Card"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteFlashcard(set.id, card.id)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                                          title="Delete Card"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="rounded-md bg-white p-3 mb-2 border border-gray-200 h-24 overflow-y-auto">
                                      <p className="text-gray-800">{card.front_text}</p>
                                    </div>
                                    
                                    <div className="rounded-md bg-indigo-50 p-3 border border-indigo-100 h-24 overflow-y-auto">
                                      <p className="text-gray-800">{card.back_text}</p>
                                    </div>
                                    
                                    {card.tags && card.tags.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {card.tags.split(",").map((tag, i) => (
                                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No flashcards added yet</p>
                            )}
                            <button
                              onClick={() => {
                                setSelectedSet(set);
                                setShowAddCardModal(true);
                              }}
                              className="mt-3 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add new flashcard
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Flashcard Set Modal */}
      {showAddSetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-200 opacity-85 transition-opacity" onClick={() => setShowAddSetModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Flashcard Set</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAddSetModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddSet();
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newSet.title}
                      onChange={(e) => setNewSet({...newSet, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newSet.description}
                      onChange={(e) => setNewSet({...newSet, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newSet.category}
                      onChange={(e) => setNewSet({...newSet, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="language">Language</option>
                      <option value="science">Science</option>
                      <option value="math">Math</option>
                      <option value="history">History</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_public"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={newSet.is_public}
                      onChange={(e) => setNewSet({...newSet, is_public: e.target.checked})}
                    />
                    <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                      Make this flashcard set public
                    </label>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={() => setShowAddSetModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Set
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Flashcard Modal */}
      {showAddCardModal && selectedSet && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-200 opacity-85 transition-opacity" onClick={() => setShowAddCardModal(false)}></div>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Flashcard to "{selectedSet.title}"</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAddCardModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddFlashcard();
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="front_text" className="block text-sm font-medium text-gray-700">Front Side</label>
                    <textarea
                      id="front_text"
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newFlashcard.front_text}
                      onChange={(e) => setNewFlashcard({...newFlashcard, front_text: e.target.value})}
                      placeholder="Enter the term, question, or prompt"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="back_text" className="block text-sm font-medium text-gray-700">Back Side</label>
                    <textarea
                      id="back_text"
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newFlashcard.back_text}
                      onChange={(e) => setNewFlashcard({...newFlashcard, back_text: e.target.value})}
                      placeholder="Enter the definition, answer, or explanation"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                      type="text"
                      id="tags"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newFlashcard.tags}
                      onChange={(e) => setNewFlashcard({...newFlashcard, tags: e.target.value})}
                      placeholder="vocabulary, grammar, chapter1"
                    />
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={() => setShowAddCardModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Flashcard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManagementPage;