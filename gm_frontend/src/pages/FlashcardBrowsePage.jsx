import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Clock,
  Eye,
  Tag,
  ArrowRight,
  BookmarkPlus,
  Users,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import axios from 'axios';

const FlashcardBrowsePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch public flashcard sets
    fetchPublicFlashcardSets();
  }, [categoryFilter, sortOption]);

  const fetchPublicFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcard-sets`, { 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });
      setFlashcardSets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public flashcard sets:', error);
      setLoading(false);
    }
  };

  const handleSaveSet = async (setId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saved-flashcard-sets`,
        { flashcard_set_id: setId },
        { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        }
      );
      // Update UI to reflect saved status
      setFlashcardSets(flashcardSets.map(set => 
        set.id === setId ? { ...set, saved: true } : set
      ));
    } catch (error) {
      console.error('Error saving flashcard set:', error);
    }
  };

  const filteredFlashcardSets = flashcardSets.filter(set => {
    return set.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           set.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'cards', label: 'Most Cards' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  // Mock data for featured sets
  const featuredSets = [
    {
      id: 1,
      title: "Essential Biology Terms",
      cards: 48,
      saves: 543,
      category: "science",
      image: "/api/placeholder/800/400",
    },
    {
      id: 2,
      title: "Spanish Vocabulary",
      cards: 120,
      saves: 872,
      category: "language",
      image: "/api/placeholder/800/400",
    },
    {
      id: 3,
      title: "Algebra Formulas",
      cards: 35,
      saves: 421,
      category: "math",
      image: "/api/placeholder/800/400",
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="ml-2 text-xl font-semibold text-gray-800">Flashcard Library</h1>
              </div>
              
              <div className="flex items-center">
                <div className="relative mx-4">
                  <input 
                    type="text" 
                    placeholder="Search flashcards..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                
                <button 
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
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
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map(option => (
                      <button 
                        key={option.value}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sortOption === option.value 
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setSortOption(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            
            {/* All Available Sets */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Browse All Flashcard Sets</h2>
                <p className="text-sm text-gray-500">{filteredFlashcardSets.length} sets available</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredFlashcardSets.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No flashcard sets found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFlashcardSets.map(set => (
                    <div key={set.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{set.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(set.category)}`}>
                            {set.category.charAt(0).toUpperCase() + set.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{set.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {set.tags && set.tags.split(',').map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {set.flashcards.length || 0} cards
                            </span>
                            {set.created_at && (
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(set.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveSet(set.id)}
                              className={`p-2 rounded-full ${
                                set.saved 
                                  ? 'text-amber-500 bg-amber-50' 
                                  : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                              }`}
                              title="Save to your library"
                            >
                              <BookmarkPlus className="h-5 w-5" />
                            </button>
                            
                            <Link 
                              to={`/flashcards/study/${set.id}`}
                              className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            >
                              Study
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardBrowsePage;