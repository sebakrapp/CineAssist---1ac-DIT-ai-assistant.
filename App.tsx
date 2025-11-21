import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, CameraPreset, CameraSetup } from './types';
import { sendMessageStream, resetSession, initChatSession } from './services/geminiService';
import { POPULAR_CAMERAS, SUGGESTED_QUERIES } from './constants';
import MessageBubble from './components/MessageBubble';
import SetupManager from './components/SetupManager';
import { SendIcon, TrashIcon, ChevronRight, InfoIcon, CameraIcon, WrenchIcon, ApertureIcon, BookIcon, ImageIcon, FileTextIcon, HomeIcon, ClockIcon } from './components/Icons';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSetupManagerOpen, setIsSetupManagerOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat on mount
  useEffect(() => {
    initChatSession();
    const savedHistory = localStorage.getItem('cineassist_history');
    if (savedHistory) {
        try {
            setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to parse history");
        }
    }
  }, []);

  const updateHistory = (query: string) => {
      if (!query) return;
      const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 15); // Limit to 15 items
      setHistory(newHistory);
      localStorage.setItem('cineassist_history', JSON.stringify(newHistory));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    // Update history if it's a text query
    if (textToSend.trim()) {
        updateHistory(textToSend.trim());
    }

    // Determine effective text to display (if image only, add placeholder text for user)
    const displayContent = textToSend.trim() || "Analyzed provided image.";

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: displayContent,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    // Placeholder for model response
    const modelMessageId = uuidv4();
    const initialModelMessage: Message = {
      id: modelMessageId,
      role: 'model',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, initialModelMessage]);

    try {
      const stream = sendMessageStream(textToSend, userMessage.image);
      let fullText = '';
      let accumulatedSources: Array<{uri: string, title: string}> = [];

      for await (const chunk of stream) {
        fullText += chunk.text;
        if (chunk.sources) {
            accumulatedSources = [...accumulatedSources, ...chunk.sources];
        }
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === modelMessageId 
              ? { ...msg, content: fullText, sources: accumulatedSources } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === modelMessageId 
            ? { ...msg, content: "I'm sorry, I encountered an error retrieving that information. Please try again.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      // Focus input after send (desktop)
      if (window.innerWidth > 768) {
          inputRef.current?.focus();
      }
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Reset current session?')) {
      setMessages([]);
      resetSession();
    }
  };

  const handleHome = () => {
    setMessages([]);
    resetSession();
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePresetClick = (preset: CameraPreset) => {
    setInput(`How do I change the FPS on the ${preset.name}?`);
    inputRef.current?.focus();
    setIsSidebarOpen(false);
  };

  const handleToolClick = (type: 'troubleshoot' | 'lenses' | 'glossary') => {
    let text = '';
    switch(type) {
        case 'troubleshoot': text = "I have a camera issue. What are some common problems you can help with?"; break;
        case 'lenses': text = "List some popular cinema lenses you have data on."; break;
        case 'glossary': text = "Explain some common cinematography terms."; break;
    }
    handleSend(text);
    setIsSidebarOpen(false);
  };

  const handleHistoryClick = (query: string) => {
      handleSend(query);
      setIsSidebarOpen(false);
  };

  const handleApplySetup = (setup: CameraSetup) => {
      setIsSetupManagerOpen(false);
      const prompt = `Guide me step-by-step to configure a ${setup.camera} with these settings:
- FPS: ${setup.fps}
- Shutter: ${setup.shutter}
- ISO/EI: ${setup.iso}
- White Balance: ${setup.wb}
- Resolution: ${setup.resolution}
- Codec: ${setup.codec}
${setup.lens ? `- Lens: ${setup.lens}` : ''}
${setup.notes ? `Note: ${setup.notes}` : ''}
`;
      handleSend(prompt);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cinema-black text-gray-200 font-sans selection:bg-cinema-accent selection:text-white">
      
      {/* Setup Manager Modal */}
      {isSetupManagerOpen && (
        <SetupManager 
            onClose={() => setIsSetupManagerOpen(false)} 
            onApplySetup={handleApplySetup} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop: Static, Mobile: Drawer) */}
      <aside className={`
        fixed md:relative z-50 w-72 h-full bg-cinema-dark border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-cinema-accent w-8 h-8 rounded flex items-center justify-center text-white">
                    <CameraIcon width={20} height={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">CineAssist <span className="text-cinema-accent">AI</span></h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
                <ChevronRight className="rotate-180" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* About */}
            <div className="bg-cinema-panel p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2 text-cinema-arri">
                    <InfoIcon width={16} height={16} />
                    <span className="text-sm font-semibold uppercase tracking-wider">Assistant Mode</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Navigating menus, troubleshooting errors, and providing lens specs for professional filmmaking.
                </p>
            </div>

            {/* Toolkit Section */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Toolkit</h3>
                <div className="space-y-1">
                     <button onClick={() => { setIsSetupManagerOpen(true); setIsSidebarOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white flex items-center gap-3">
                        <FileTextIcon width={16} height={16} className="text-white" />
                        My Setups
                    </button>
                    <button onClick={() => handleToolClick('troubleshoot')} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white flex items-center gap-3">
                        <WrenchIcon width={16} height={16} className="text-cinema-accent" />
                        Troubleshooting
                    </button>
                    <button onClick={() => handleToolClick('lenses')} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white flex items-center gap-3">
                        <ApertureIcon width={16} height={16} className="text-cinema-arri" />
                        Lens Database
                    </button>
                    <button onClick={() => handleToolClick('glossary')} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white flex items-center gap-3">
                        <BookIcon width={16} height={16} className="text-gray-400" />
                        Glossary
                    </button>
                </div>
            </div>
            
            {/* History Section */}
            {history.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Recent History</h3>
                    <div className="space-y-1">
                        {history.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleHistoryClick(item)}
                                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-400 hover:text-white flex items-center gap-3 overflow-hidden"
                            >
                                <ClockIcon width={14} height={14} className="flex-shrink-0" />
                                <span className="truncate">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Camera Presets */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Quick Select</h3>
                <div className="space-y-1">
                    {POPULAR_CAMERAS.map((cam) => (
                        <button
                            key={cam.id}
                            onClick={() => handlePresetClick(cam)}
                            className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition-colors group flex items-center justify-between"
                        >
                            <span className="text-sm text-gray-300 group-hover:text-white">{cam.name}</span>
                            <div className="w-2 h-2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: cam.color }}></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-800">
            <button 
                onClick={handleClearChat}
                className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
                <TrashIcon width={16} height={16} />
                Reset Session
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Home Button (Desktop) - Absolute positioning top right */}
        <div className="hidden md:block absolute top-4 right-6 z-30">
            <button 
                onClick={handleHome} 
                className="p-2 rounded-full bg-gray-900/50 hover:bg-cinema-accent hover:text-white text-gray-400 border border-gray-800 hover:border-cinema-accent transition-all"
                title="Back to Home / Clear"
            >
                <HomeIcon width={20} height={20} />
            </button>
        </div>

        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-cinema-black/90 backdrop-blur z-30 sticky top-0">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300">
                <div className="space-y-1.5">
                    <span className="block w-6 h-0.5 bg-current"></span>
                    <span className="block w-6 h-0.5 bg-current"></span>
                    <span className="block w-6 h-0.5 bg-current"></span>
                </div>
            </button>
            <span className="font-bold text-white">CineAssist AI</span>
            <button onClick={handleHome} className="text-gray-300 p-1">
                <HomeIcon width={20} height={20} />
            </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-3xl mx-auto">
                {messages.length === 0 ? (
                    <div className="mt-12 md:mt-20 flex flex-col items-center text-center animate-fade-in">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 text-cinema-accent shadow-[0_0_30px_rgba(229,9,20,0.15)]">
                            <CameraIcon width={40} height={40} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">1st AC & DIT Assistant</h2>
                        <p className="text-gray-500 max-w-md mb-8">
                            Ask about camera menus, lens specs, or troubleshoot errors on set.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                            {SUGGESTED_QUERIES.map((q, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleSend(q)}
                                    className="text-sm text-left p-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-300 transition-all hover:border-gray-700 flex items-center justify-between group"
                                >
                                    <span>"{q}"</span>
                                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-cinema-arri" width={14} height={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-6 animate-pulse">
                                <div className="flex gap-3 items-center">
                                     <div className="w-8 h-8 bg-cinema-accent rounded-full flex items-center justify-center">
                                         <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                     </div>
                                     <span className="text-gray-500 text-sm font-mono">Accessing technical database...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-cinema-black border-t border-gray-800">
            <div className="max-w-3xl mx-auto relative">
                
                {/* Image Preview */}
                {selectedImage && (
                    <div className="absolute bottom-full mb-4 left-0">
                        <div className="relative">
                            <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-700 shadow-lg" />
                            <button 
                                onClick={() => {
                                    setSelectedImage(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <TrashIcon width={12} height={12} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative flex items-center">
                    {/* File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleImageSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute left-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Upload or Take Photo"
                    >
                        <ImageIcon width={20} height={20} />
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedImage ? "Ask about this image..." : "Describe an issue, ask for specs, or find a menu item..."}
                        disabled={isLoading}
                        className="w-full bg-cinema-panel border border-gray-700 text-white placeholder-gray-500 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-cinema-arri/50 focus:border-cinema-arri transition-all shadow-inner"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="absolute right-2 p-2 bg-cinema-accent hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-cinema-accent text-white rounded-lg transition-colors"
                    >
                        <SendIcon width={20} height={20} />
                    </button>
                </div>
                <div className="text-center mt-2">
                     <p className="text-[10px] text-gray-600">
                        Always verify critical specs and settings with the official manufacturer manual.
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;