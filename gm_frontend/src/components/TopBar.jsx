import { 
    BookOpen, 
    Brain, 
    Award, 
    BarChart, 
    Clock, 
    Star, 
    Trophy, 
    LogOut,
    Search,
    Bell,
    MessageSquare,
    Home,
    BookText,
    Layers,
    Settings,
    HelpCircle,
    Menu,
    X
  } from 'lucide-react';  

export const TopBar = (sidebarOpen, setSidebarOpen) => {
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="relative mx-4">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mx-2">
                <MessageSquare className="h-6 w-6" />
              </button>
              
              <div className="ml-3 relative lg:hidden">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  LK
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
}