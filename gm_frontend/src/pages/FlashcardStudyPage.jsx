import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Shuffle,
  Bookmark,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Repeat,
  RefreshCw,
  Volume2,
  Menu,
  Layers,
  X,
  Settings
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import axios from 'axios';

const FlashcardStudyPage = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [cardsToStudy, setCardsToStudy] = useState([]);
  const [knownCards, setKnownCards] = useState([]);
  const [flaggedCards, setFlaggedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Study options
  const [randomize, setRandomize] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [reviewKnownCards, setReviewKnownCards] = useState(true);

  useEffect(() => {
    fetchFlashcardSet();
  }, [setId]);

  const fetchFlashcardSet = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcard-sets`, { 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });
      setFlashcardSet(response.data.filter((set) => set.id == setId)[0]);
      
      // Initialize cards to study
      let initialCards = response.data.filter((set) => set.id == setId)[0].flashcards || [];
      if (randomize) {
        initialCards = shuffleArray(initialCards);
      }
      setCardsToStudy(initialCards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffleCards = () => {
    setCardsToStudy(shuffleArray(cardsToStudy));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cardsToStudy.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnownCard = () => {
    const currentCardId = cardsToStudy[currentCardIndex].id;
    if (!knownCards.includes(currentCardId)) {
      setKnownCards([...knownCards, currentCardId]);
    }
    handleNextCard();
  };

  const handleUnknownCard = () => {
    const currentCardId = cardsToStudy[currentCardIndex].id;
    setKnownCards(knownCards.filter(id => id !== currentCardId));
    handleNextCard();
  };

  const toggleFlagCard = () => {
    const currentCardId = cardsToStudy[currentCardIndex].id;
    if (flaggedCards.includes(currentCardId)) {
      setFlaggedCards(flaggedCards.filter(id => id !== currentCardId));
    } else {
      setFlaggedCards([...flaggedCards, currentCardId]);
    }
  };

  const restartStudySession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    if (randomize) {
      handleShuffleCards();
    }
  };

    // Function to handle session completion
    const handleCompleteSession = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/flashcard-sets/${setId}/complete`,
            {
              cards_reviewed: cardsToStudy.length,
              mastered_count: knownCards.length,
              // Include subject_id if available (adjust based on your app's logic)
              // subject_id: flashcardSet.subject_id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
          navigate('/flashcards'); // Redirect after success
        } catch (error) {
          console.error('Error completing session:', error);
          alert('Failed to complete session. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };
    

  // Filter cards based on study options
  const updateStudyDeck = () => {
    if (flashcardSet) {
      let studyDeck = [...flashcardSet.flashcards];
      
      if (!reviewKnownCards) {
        studyDeck = studyDeck.filter(card => !knownCards.includes(card.id));
      }
      
      if (randomize) {
        studyDeck = shuffleArray(studyDeck);
      }
      
      setCardsToStudy(studyDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    updateStudyDeck();
  }, [reviewKnownCards, randomize]);

  // Calculate progress
  const studyProgress = flashcardSet && flashcardSet.flashcards 
    ? (knownCards.length / flashcardSet.flashcards.length) * 100 
    : 0;

  // Current card data
  const currentCard = cardsToStudy[currentCardIndex];


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Flashcard Set Not Found</h2>
          <p className="text-gray-600 mb-6">The flashcard set you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/flashcards" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
            Back to Flashcards
          </Link>
        </div>
      </div>
    );
  }

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
                
                <Link to="/flashcards" className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-800 truncate max-w-md">
                    {flashcardSet.title}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
                  className={`p-2 rounded-md ${
                    viewMode !== 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={viewMode === 'cards' ? 'View as list' : 'View as cards'}
                >
                  <Layers className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setShowOptionsPanel(!showOptionsPanel)}
                  className={`p-2 rounded-md ${
                    showOptionsPanel ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Study options"
                >
                  <Settings className="h-5 w-5" />
                </button>

                <Link to="/flashcards" className="p-2 rounded-md text-gray-500 hover:bg-gray-100" title="Close">
                  <X className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Options Panel */}
        {showOptionsPanel && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="randomize"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={randomize}
                      onChange={() => setRandomize(!randomize)}
                    />
                    <label htmlFor="randomize" className="ml-2 text-sm text-gray-700 flex items-center">
                      <Shuffle className="h-4 w-4 mr-1" />
                      Randomize
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="audio"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={autoPlayAudio}
                      onChange={() => setAutoPlayAudio(!autoPlayAudio)}
                    />
                    <label htmlFor="audio" className="ml-2 text-sm text-gray-700 flex items-center">
                      <Volume2 className="h-4 w-4 mr-1" />
                      Auto-play audio
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reviewKnown"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={reviewKnownCards}
                      onChange={() => setReviewKnownCards(!reviewKnownCards)}
                    />
                    <label htmlFor="reviewKnown" className="ml-2 text-sm text-gray-700 flex items-center">
                      <Repeat className="h-4 w-4 mr-1" />
                      Review known cards
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleShuffleCards}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Shuffle className="h-4 w-4 mr-1" />
                    Shuffle
                  </button>
                  
                  <button
                    onClick={restartStudySession}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-300" 
            style={{ width: `${studyProgress}%` }}
          ></div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'cards' ? (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              {/* Card count indicator */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    Card {currentCardIndex + 1} of {cardsToStudy.length}
                  </span>
                  {knownCards.includes(currentCard?.id) && (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
      <ThumbsUp className="h-3 w-3 mr-1" />
      Known
    </span>
  )}
  {flaggedCards.includes(currentCard?.id) && (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
      <Flag className="h-3 w-3 mr-1" />
      Flagged
    </span>
  )}
</div>

<div className="flex items-center">
  <span className="text-sm font-medium text-green-600 mr-3">
    {knownCards.length} of {cardsToStudy.length} known
  </span>
</div>
</div>

{/* Flashcard */}
<div 
      className="w-full aspect-[4/3] max-w-2xl mx-auto mb-6 perspective-1000"
      onClick={toggleCardFlip}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front side */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-md p-8 flex flex-col justify-center items-center backface-hidden">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {currentCard.front_text}
          </h3>
          {currentCard.front_image && (
            <img 
              src={currentCard.front_image} 
              alt="Card front" 
              className="max-w-full max-h-48 object-contain mb-4"
            />
          )}
          <p className="text-gray-500 text-sm mt-4">Click to flip</p>
        </div>
        
        {/* Back side */}
        <div className={`absolute w-full h-full bg-white rounded-xl shadow-md p-8 flex flex-col justify-center items-center ${isFlipped ? "" : "backface-hidden transition-all duration-500"} rotate-y-180`}>
          <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
            {currentCard.back_text}
          </h3>
          {currentCard.back_image && (
            <img 
              src={currentCard.back_image} 
              alt="Card back" 
              className="max-w-full max-h-48 object-contain mb-4"
            />
          )}
          <p className="text-gray-500 text-sm mt-4">Click to flip back</p>
        </div>
      </div>
    </div>


{/* Card navigation */}
<div className="flex justify-center items-center space-x-6 mb-6">
<button
  onClick={handlePreviousCard}
  disabled={currentCardIndex === 0}
  className={`p-2 rounded-full ${
    currentCardIndex === 0 
      ? 'text-gray-300 cursor-not-allowed' 
      : 'text-gray-600 hover:bg-gray-100'
  }`}
>
  <ChevronLeft className="h-8 w-8" />
</button>

<button
  onClick={toggleCardFlip}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
>
  Flip Card
</button>

<button
  onClick={handleNextCard}
  disabled={currentCardIndex === cardsToStudy.length - 1}
  className={`p-2 rounded-full ${
    currentCardIndex === cardsToStudy.length - 1 
      ? 'text-gray-300 cursor-not-allowed' 
      : 'text-gray-600 hover:bg-gray-100'
  }`}
>
  <ChevronRight className="h-8 w-8" />
</button>
</div>

{/* Card actions */}
<div className="flex justify-center items-center space-x-4">
<button
  onClick={toggleFlagCard}
  className={`p-2 rounded-full ${
    flaggedCards.includes(currentCard?.id) 
      ? 'text-red-500 bg-red-50' 
      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
  }`}
  title={flaggedCards.includes(currentCard?.id) ? "Unflag card" : "Flag card for review"}
>
  <Flag className="h-6 w-6" />
</button>

<button
  onClick={handleUnknownCard}
  title="I don't know this"
  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
>
  <ThumbsDown className="h-6 w-6" />
</button>

<button
  onClick={handleKnownCard}
  title="I know this"
  className="p-2 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50"
>
  <ThumbsUp className="h-6 w-6" />
</button>
</div>
<div className="flex justify-center mt-4">
      <button
        onClick={handleCompleteSession}
        disabled={isSubmitting}
        className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Finish Session'}
      </button>
    </div>

</div>
) : (
// List view mode
<div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
<div className="p-4 bg-gray-50 border-b border-gray-200">
  <h2 className="text-lg font-medium text-gray-800">All Cards</h2>
</div>

<div className="divide-y divide-gray-200">
  {cardsToStudy.map((card, index) => (
    <div 
      key={card.id} 
      className={`p-4 hover:bg-gray-50 cursor-pointer ${
        currentCardIndex === index ? 'bg-indigo-50' : ''
      }`}
      onClick={() => {
        setCurrentCardIndex(index);
        setViewMode('cards');
      }}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-800">{card.front}</p>
          <p className="text-gray-500 mt-1">{card.back}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {knownCards.includes(card.id) && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Known
            </span>
          )}
          {flaggedCards.includes(card.id) && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              <Flag className="h-3 w-3 mr-1" />
              Flagged
            </span>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
</div>
</div>
)}
</div>
</div>
</div>
);
};

export default FlashcardStudyPage;