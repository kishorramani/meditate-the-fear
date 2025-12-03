import { useState, useEffect, useRef } from 'react'

const App = () => {
  const [selectedDuration, setSelectedDuration] = useState(300) // Default 5 minutes
  const [time, setTime] = useState(300)
  const [isActive, setIsActive] = useState(false)
  const [horrorMode, setHorrorMode] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [message, setMessage] = useState('Breathe deeply...')
  const [showCompletion, setShowCompletion] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [showSoundSelection, setShowSoundSelection] = useState(false)
  const [showDifficultySelection, setShowDifficultySelection] = useState(false)
  const [selectedSound, setSelectedSound] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal')
  const [horrorImage, setHorrorImage] = useState(null)
  const [showCustomTimer, setShowCustomTimer] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [customSeconds, setCustomSeconds] = useState('')
  
  // Session stats
  const [horrorEventsCount, setHorrorEventsCount] = useState(0)
  const [longestCalmStreak, setLongestCalmStreak] = useState(0)
  const [currentCalmStreak, setCurrentCalmStreak] = useState(0)
  const [pauseCount, setPauseCount] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState(null)
  
  const intervalRef = useRef(null)
  const calmAudioRef = useRef(null)
  const currentCalmSoundRef = useRef(null)
  const currentHorrorAudioRef = useRef(null)
  const nextHorrorTimeRef = useRef(null)
  const horrorFadeIntervalRef = useRef(null)
  const breathingIntervalRef = useRef(null)
  const horrorTimeoutRef = useRef(null)
  const glitchTimeoutRef = useRef(null)

  // Difficulty settings
  const difficultySettings = {
    peaceful: { startDelay: 30, minInterval: 15, maxInterval: 30, label: '😌 Peaceful', desc: 'Gentle scares' },
    normal: { startDelay: 10, minInterval: 5, maxInterval: 15, label: '😰 Normal', desc: 'Balanced fear' },
    nightmare: { startDelay: 5, minInterval: 3, maxInterval: 8, label: '😱 Nightmare', desc: 'Frequent terror' },
    hell: { startDelay: 3, minInterval: 1, maxInterval: 3, label: '💀 Hell Mode', desc: 'Constant horror' }
  }

  // Halloween horror images - use relative paths that work on any device
  const horrorImages = [
    './images/horror1.jpg',
    './images/horror2.jpg',
    './images/horror3.jpg',
    './images/horror4.jpg',
    './images/horror5.jpg',
    './images/horror6.jpg',
    './images/horror7.jpg',
    './images/horror8.jpg',
    './images/horror9.jpg',
    './images/horror10.jpg',
    './images/horror11.jpg',
    './images/horror12.jpg',
    './images/horror13.jpg',
    './images/horror14.jpg',
    './images/horror15.jpg',
    './images/horror16.jpg',
    './images/horror17.jpg',
    './images/horror18.jpg'
  ]

  const durations = [
    { label: '1 min', value: 60 },
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: 'Custom', value: 'custom' }
  ]

  const horrorMessages = [
    'NO ESCAPE',
    'THEY WATCH',
    'EYES CLOSED',
    'IT KNOWS',
    'BEHIND YOU',
    'TIME RUNS OUT',
    'NOT ALONE',
    'STOP BREATHING',
    'LOOK BACK',
    'TOO LATE',
    'STILL HERE?',
    'CLOSE EYES',
    'SOMETHING WRONG',
    'FEEL IT?',
    'THEY KNOW',
    'DON\'T TURN',
    'GETTING CLOSER',
    'LEAVE NOW',
    'LISTEN',
    'HEAR THAT?',
    'IN THE ROOM',
    'RUN',
    'NO ESCAPE',
    'FEAR FEEDS IT',
    'WAKE UP',
    'NOT REAL',
    'OR IS IT?'
  ]

  const calmMessages = [
    'Breathe deeply...',
    'Find your center...',
    'Peace within...',
    'Let go...',
    'Relax...',
    'Feel the calm...',
    'You are safe...',
    'Release worry...',
    'Be still...',
    'Clear your mind...',
    'Feel serenity...',
    'Be present...',
    'Inner peace...',
    'Stay calm...',
    'Find light...',
    'Breathe in calm...',
    'You are at peace...',
    'Gentle energy...'
  ]

  // All meditation sounds with labels
  const meditationSounds = [
    { label: 'Thunder', icon: '⛈️', file: '/sounds/meditation_thunder.mp3' },
    { label: 'Bird Chanting', icon: '🐦', file: '/sounds/meditation_beautiful-morning-with-birds-chanting.mp3' },
    { label: 'Bell', icon: '🔔', file: '/sounds/meditation_bell.mp3' },
    { label: 'Raindrops', icon: '💧', file: '/sounds/meditation_relax_relaxation_rain_raindrops_medium_water.mp3' },
    { label: 'Bowls', icon: '🎵', file: '/sounds/meditations_bowls.mp3' },
    { label: 'Calm', icon: '🧘', file: '/sounds/meditations_calm.mp3' }
  ]

  // All horror sounds
  const horrorSounds = [
    '/sounds/horror1_screams.mp3',
    '/sounds/horror1_screams2.mp3',
    '/sounds/horror1_screams3.mp3',
    '/sounds/horror1_screams4.mp3',
    '/sounds/horror1_screams5.mp3',
    '/sounds/horror2_whispers.mp3',
    '/sounds/horror2_whispers2.mp3',
    '/sounds/horror2_whispers3.mp3',
    '/sounds/horror2_whispers4.mp3',
    '/sounds/horror3_ambient.mp3',
    '/sounds/horror3_ambient2.mp3',
    '/sounds/horror3_ambient3.mp3',
    '/sounds/horror3_ambient4.mp3',
    '/sounds/horror4_creaking.mp3',
    '/sounds/horror4_creaking2.mp3',
    '/sounds/horror4_creaking3.mp3',
    '/sounds/horror4_creaking4.mp3',
    '/sounds/horror5_static.mp3',
    '/sounds/horror5_static2.mp3',
    '/sounds/horror5_static3.mp3',
    '/sounds/horror5_static4.mp3',
    '/sounds/horror5_static5.mp3',
    '/sounds/horror6_glitch.mp3',
    '/sounds/horror6_glitch2.mp3',
    '/sounds/horror6_glitch3.mp3',
    '/sounds/horror6_glitch4.mp3',
    '/sounds/horror7_deep_drones.mp3',
    '/sounds/horror7_deep_drones2.mp3',
    '/sounds/horror7_deep_drones3.mp3',
    '/sounds/horror7_deep_drones4.mp3',
    '/sounds/horror7_deep_drones5.mp3'
  ]

  const playRandomCalmSound = () => {
    // Stop current calm sound if playing
    if (calmAudioRef.current) {
      calmAudioRef.current.pause()
      calmAudioRef.current.currentTime = 0
      calmAudioRef.current.onended = null
    }

    // Use selected sound or pick random
    const soundFile = selectedSound 
      ? selectedSound 
      : meditationSounds[Math.floor(Math.random() * meditationSounds.length)].file
    
    currentCalmSoundRef.current = soundFile
    
    calmAudioRef.current = new Audio(soundFile)
    calmAudioRef.current.volume = 0.5
    calmAudioRef.current.loop = true // Loop the same track continuously
    
    calmAudioRef.current.play().catch(err => console.log('Calm audio play failed:', err))
  }

  // Preload horror images on mount
  useEffect(() => {
    console.log('Preloading horror images...')
    horrorImages.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => console.log('Loaded:', src)
      img.onerror = () => console.error('Failed to load:', src)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (calmAudioRef.current) {
        calmAudioRef.current.pause()
        calmAudioRef.current.currentTime = 0
        calmAudioRef.current.onended = null
      }
      if (currentHorrorAudioRef.current) {
        currentHorrorAudioRef.current.pause()
        currentHorrorAudioRef.current.currentTime = 0
      }
      if (horrorFadeIntervalRef.current) {
        clearInterval(horrorFadeIntervalRef.current)
      }
      if (horrorTimeoutRef.current) {
        clearTimeout(horrorTimeoutRef.current)
      }
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev - 1
          const elapsed = selectedDuration - newTime
          
          const difficulty = difficultySettings[selectedDifficulty]
          
          // Track calm streak
          if (!horrorMode) {
            setCurrentCalmStreak(prev => {
              const newStreak = prev + 1
              setLongestCalmStreak(current => Math.max(current, newStreak))
              return newStreak
            })
            
            // Change calm message every 8 seconds (not every second)
            if (elapsed % 8 === 0) {
              setMessage(calmMessages[Math.floor(Math.random() * calmMessages.length)])
            }
          }
          
          // Check if should trigger horror based on difficulty
          if (elapsed < difficulty.startDelay) {
            setHorrorMode(false)
          } else {
            if (!nextHorrorTimeRef.current || elapsed >= nextHorrorTimeRef.current) {
              triggerHorrorEvent()
              // Next horror event based on difficulty
              const interval = Math.floor(Math.random() * (difficulty.maxInterval - difficulty.minInterval)) + difficulty.minInterval
              nextHorrorTimeRef.current = elapsed + interval
            }
          }
          
          return newTime
        })
      }, 1000)
    } else if (time === 0 && !showCompletion) {
      setIsActive(false)
      setShowCompletion(true)
      
      // Stop all audio when timer finishes
      if (calmAudioRef.current) {
        calmAudioRef.current.pause()
        calmAudioRef.current.currentTime = 0
      }
      if (currentHorrorAudioRef.current) {
        currentHorrorAudioRef.current.pause()
        currentHorrorAudioRef.current.currentTime = 0
      }
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current)
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, time, selectedDuration, showCompletion, selectedDifficulty, horrorMode])

  const fadeOutHorrorSound = () => {
    if (!currentHorrorAudioRef.current) return
    
    // Clear any existing fade interval
    if (horrorFadeIntervalRef.current) {
      clearInterval(horrorFadeIntervalRef.current)
    }
    
    // Fade out over 500ms
    const fadeSteps = 10
    const fadeInterval = 50
    const volumeStep = currentHorrorAudioRef.current.volume / fadeSteps
    
    horrorFadeIntervalRef.current = setInterval(() => {
      if (currentHorrorAudioRef.current && currentHorrorAudioRef.current.volume > 0.05) {
        currentHorrorAudioRef.current.volume = Math.max(0, currentHorrorAudioRef.current.volume - volumeStep)
      } else {
        if (currentHorrorAudioRef.current) {
          currentHorrorAudioRef.current.pause()
          currentHorrorAudioRef.current.currentTime = 0
        }
        clearInterval(horrorFadeIntervalRef.current)
      }
    }, fadeInterval)
  }

  const triggerHorrorEvent = () => {
    // Clear any existing timeouts
    if (horrorTimeoutRef.current) clearTimeout(horrorTimeoutRef.current)
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    
    setHorrorMode(true)
    setGlitchActive(true)
    
    // Set horror message immediately
    const horrorMsg = horrorMessages[Math.floor(Math.random() * horrorMessages.length)]
    setMessage(horrorMsg)
    
    // Track stats
    setHorrorEventsCount(prev => prev + 1)
    setCurrentCalmStreak(0) // Reset calm streak
    
    // Show random horror image
    const randomImage = horrorImages[Math.floor(Math.random() * horrorImages.length)]
    console.log('Loading horror image:', randomImage) // Debug log
    setHorrorImage(randomImage)
    
    // Vibrate on horror event (mobile only)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200])
    }
    
    // Lower calm audio volume and play random horror sound
    if (calmAudioRef.current) {
      calmAudioRef.current.volume = 0.1
    }
    playHorrorSound()
    
    // Glitch effect duration
    glitchTimeoutRef.current = setTimeout(() => setGlitchActive(false), 300)
    
    // Return to calm after 3-6 seconds (longer to see image)
    const calmDelay = Math.random() * 3000 + 3000
    horrorTimeoutRef.current = setTimeout(() => {
      setHorrorMode(false)
      setHorrorImage(null)
      setMessage(calmMessages[Math.floor(Math.random() * calmMessages.length)])
      
      // Fade out horror sound when screen returns to calm
      fadeOutHorrorSound()
      
      // Restore calm audio volume
      if (calmAudioRef.current) {
        calmAudioRef.current.volume = 0.5
      }
    }, calmDelay)
  }

  const playHorrorSound = () => {
    // Stop previous horror sound if still playing
    if (currentHorrorAudioRef.current) {
      currentHorrorAudioRef.current.pause()
      currentHorrorAudioRef.current.currentTime = 0
    }
    
    // Pick a random horror sound
    const randomSound = horrorSounds[Math.floor(Math.random() * horrorSounds.length)]
    currentHorrorAudioRef.current = new Audio(randomSound)
    currentHorrorAudioRef.current.volume = 0.8
    currentHorrorAudioRef.current.loop = true // Loop horror sound during horror event
    currentHorrorAudioRef.current.play().catch(err => console.log('Horror audio play failed:', err))
  }

  const goToSoundSelection = () => {
    setShowSettings(false)
    setShowDifficultySelection(true)
  }

  const goToSoundFromDifficulty = () => {
    setShowDifficultySelection(false)
    setShowSoundSelection(true)
  }

  // Breathing guide cycle
  const startBreathingGuide = () => {
    let phase = 0
    const phases = [
      { text: 'Breathe in...', duration: 4000 },
      { text: 'Hold...', duration: 4000 },
      { text: 'Breathe out...', duration: 4000 },
      { text: 'Rest...', duration: 2000 }
    ]
    
    const cycleBreathing = () => {
      if (!horrorMode && isActive) {
        setBreathingPhase(phases[phase].text)
        phase = (phase + 1) % phases.length
      }
    }
    
    breathingIntervalRef.current = setInterval(cycleBreathing, 4000)
    cycleBreathing()
  }

  const startMeditation = () => {
    setShowSettings(false)
    setShowSoundSelection(false)
    setShowDifficultySelection(false)
    setTime(selectedDuration)
    nextHorrorTimeRef.current = null
    setHorrorMode(false)
    setMessage('Breathe deeply...')
    setIsActive(true)
    playRandomCalmSound()
    startBreathingGuide()
  }

  const toggleTimer = () => {
    if (!isActive) {
      nextHorrorTimeRef.current = null
      playRandomCalmSound()
    } else {
      setPauseCount(prev => prev + 1) // Track pauses
      
      // Stop all audio when pausing (but keep visual state)
      if (calmAudioRef.current) {
        calmAudioRef.current.pause()
      }
      if (currentHorrorAudioRef.current) {
        currentHorrorAudioRef.current.pause()
      }
      
      // Clear horror timeouts to freeze the screen
      if (horrorTimeoutRef.current) {
        clearTimeout(horrorTimeoutRef.current)
        horrorTimeoutRef.current = null
      }
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
        glitchTimeoutRef.current = null
      }
      
      // Keep the screen frozen (don't change horrorMode or horrorImage)
      setGlitchActive(false) // Stop glitch animation only
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(selectedDuration)
    setHorrorMode(false)
    setGlitchActive(false)
    setMessage('Breathe deeply...')
    setShowCompletion(false)
    setShowSettings(true)
    setShowSoundSelection(false)
    setShowDifficultySelection(false)
    nextHorrorTimeRef.current = null
    setHorrorImage(null)
    
    // Reset stats
    setHorrorEventsCount(0)
    setLongestCalmStreak(0)
    setCurrentCalmStreak(0)
    setPauseCount(0)
    setBreathingPhase(null)
    
    // Clear all timeouts
    if (horrorTimeoutRef.current) {
      clearTimeout(horrorTimeoutRef.current)
      horrorTimeoutRef.current = null
    }
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current)
      glitchTimeoutRef.current = null
    }
    
    // Stop all audio
    if (calmAudioRef.current) {
      calmAudioRef.current.pause()
      calmAudioRef.current.currentTime = 0
      calmAudioRef.current.onended = null
    }
    if (currentHorrorAudioRef.current) {
      currentHorrorAudioRef.current.pause()
      currentHorrorAudioRef.current.currentTime = 0
    }
    if (horrorFadeIntervalRef.current) {
      clearInterval(horrorFadeIntervalRef.current)
    }
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const bgClass = horrorMode 
    ? 'bg-gradient-to-b from-red-950 via-black to-red-950' 
    : 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black'
  
  const cardClass = horrorMode
    ? 'bg-gradient-to-br from-red-950/30 to-black/40 border-2 border-red-500/60 shadow-2xl shadow-red-900/50 backdrop-blur-sm'
    : 'bg-gradient-to-br from-orange-900/40 to-purple-900/40 backdrop-blur-md border-2 border-orange-400 shadow-2xl shadow-orange-500/50'
  
  const timerClass = horrorMode
    ? 'bg-gradient-to-br from-red-700/60 via-red-800/70 to-red-950/80 shadow-2xl shadow-red-600/50 border-2 border-red-400/60'
    : 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 shadow-2xl shadow-orange-500/60 border-2 border-orange-300'
  
  const textClass = horrorMode
    ? 'text-red-400 font-black drop-shadow-lg'
    : 'text-orange-300 drop-shadow-md'
  
  const buttonClass = horrorMode
    ? 'bg-gradient-to-r from-red-700/70 to-red-800/80 hover:from-red-800/80 hover:to-red-900/90 text-white shadow-lg shadow-red-600/50 border border-red-500/60'
    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg shadow-orange-500/60 border border-orange-400'

  // Completion Dialog with Stats
  if (showCompletion) {
    const totalMinutes = Math.floor(selectedDuration / 60)
    const fearScore = Math.min(10, Math.floor(horrorEventsCount / 2))
    const isZenMaster = pauseCount === 0
    const shareText = `I meditated through ${totalMinutes} minutes of fear! 🎃 ${horrorEventsCount} scares faced, Fear Score: ${fearScore}/10. Can you meditate the fear? #MeditateTheFear`
    
    return (
      <div className="min-h-screen h-screen bg-gradient-to-br from-orange-900 via-purple-950 via-black to-red-950 flex items-center justify-center p-3 sm:p-4 overflow-y-auto relative">
        {/* Halloween Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-orange-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,0,255,0.1),transparent_50%)]"></div>
        <div className="w-full max-w-md px-2 my-auto">
          <div className="bg-gradient-to-br from-orange-900/40 to-purple-900/40 backdrop-blur-sm border-2 border-orange-500 rounded-3xl shadow-2xl shadow-orange-500/30 p-4 sm:p-6 md:p-8 text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-bounce">🎃</div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400 mb-2 sm:mb-3">
              You Survived!
            </h1>
            
            {/* Session Stats */}
            <div className="bg-black/60 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-left border-2 border-orange-600/50">
              <h2 className="text-base sm:text-lg font-bold text-orange-400 mb-2 sm:mb-3 text-center">🎃 Session Stats 🎃</h2>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>⏱️ Duration:</span>
                  <span className="font-semibold text-white">{totalMinutes}:00</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>👻 Scares Survived:</span>
                  <span className="font-semibold text-white">{horrorEventsCount}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>😱 Fear Score:</span>
                  <span className="font-semibold text-red-400">{fearScore}/10</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>🧘 Longest Calm:</span>
                  <span className="font-semibold text-white">{longestCalmStreak}s</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>⏸️ Pauses:</span>
                  <span className="font-semibold text-white">{pauseCount}</span>
                </div>
              </div>
              
              {/* Achievements */}
              {(isZenMaster || totalMinutes >= 15 || selectedDifficulty === 'hell') && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-600/50">
                  <h3 className="text-xs sm:text-sm font-bold text-orange-400 mb-2">🏆 Achievements</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
                    {isZenMaster && (
                      <span className="bg-orange-600 text-white px-2 py-1 rounded-full shadow-lg shadow-orange-500/50">🧘 Zen Master</span>
                    )}
                    {totalMinutes >= 15 && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full shadow-lg shadow-purple-500/50">👻 Fearless</span>
                    )}
                    {selectedDifficulty === 'hell' && (
                      <span className="bg-black text-orange-400 px-2 py-1 rounded-full border-2 border-orange-600 shadow-lg shadow-orange-600/50">💀 Hell Survivor</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: shareText }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(shareText)
                  alert('Stats copied to clipboard!')
                }
              }}
              className="w-full py-2 sm:py-3 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm sm:text-base font-semibold rounded-full transition-all shadow-lg shadow-purple-500/50 active:scale-95 mb-2 sm:mb-3"
            >
              📤 Share Results
            </button>
            
            <button
              onClick={resetTimer}
              className="w-full py-3 sm:py-4 px-6 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-base sm:text-lg font-semibold rounded-full transition-all shadow-lg shadow-orange-500/50 active:scale-95"
            >
              🎃 Meditate Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Difficulty Selection Screen
  if (showDifficultySelection) {
    return (
      <div className="min-h-screen h-screen bg-gradient-to-b from-orange-950 via-black to-red-950 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="w-full max-w-md px-2">
          <div className="bg-gradient-to-br from-red-900/40 to-black/80 backdrop-blur-sm border-2 border-red-600 rounded-3xl shadow-2xl shadow-red-600/50 p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-orange-400 mb-2">
              💀 Choose Difficulty 💀
            </h1>
            <p className="text-center text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">
              How much horror can you handle?
            </p>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {Object.entries(difficultySettings).map(([key, diff]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDifficulty(key)}
                  className={`w-full py-3 sm:py-4 px-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all flex items-center justify-between ${
                    selectedDifficulty === key
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 active:scale-95'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{diff.label.split(' ')[0]}</span>
                  <div className="text-left flex-1 ml-3">
                    <div className="font-bold">{diff.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-xs opacity-75">{diff.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={goToSoundFromDifficulty}
                className="w-full py-3 sm:py-4 px-6 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-base sm:text-lg font-semibold rounded-full transition-all shadow-lg shadow-orange-500/50 active:scale-95"
              >
                Continue 🎃
              </button>
              
              <button
                onClick={() => {
                  setShowDifficultySelection(false)
                  setShowSettings(true)
                }}
                className="w-full py-2 sm:py-3 px-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-300 text-sm sm:text-base font-semibold rounded-full transition-all border border-gray-600 active:scale-95"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sound Selection Screen
  if (showSoundSelection) {
    return (
      <div className="min-h-screen h-screen bg-gradient-to-b from-orange-950 via-purple-950 to-black flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-md px-2 my-auto">
          <div className="bg-gradient-to-br from-purple-900/40 to-orange-900/40 backdrop-blur-sm border-2 border-purple-500 rounded-3xl shadow-2xl shadow-purple-500/30 p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-orange-400 mb-2">
              🎵 Choose Your Sound 🎵
            </h1>
            <p className="text-center text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">
              Select a meditation sound for your session
            </p>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {meditationSounds.map((sound) => (
                <button
                  key={sound.file}
                  onClick={() => setSelectedSound(sound.file)}
                  className={`py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 sm:gap-2 ${
                    selectedSound === sound.file
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 active:scale-95'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{sound.icon}</span>
                  <span className="text-xs sm:text-sm leading-tight">{sound.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={startMeditation}
                disabled={!selectedSound}
                className={`w-full py-3 sm:py-4 px-6 text-base sm:text-lg font-semibold rounded-full transition-all shadow-lg ${
                  selectedSound
                    ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-orange-500/50 active:scale-95'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Begin Meditation 🎃
              </button>
              
              <button
                onClick={() => {
                  setShowSoundSelection(false)
                  setShowSettings(true)
                }}
                className="w-full py-3 sm:py-4 px-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-300 text-sm sm:text-base font-semibold rounded-full transition-all border border-gray-600 active:scale-95"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Duration Selection Screen
  if (showSettings) {
    return (
      <div className="min-h-screen h-screen bg-gradient-to-b from-orange-950 via-black to-purple-950 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="w-full max-w-md px-2">
          <div className="bg-gradient-to-br from-orange-900/30 to-purple-900/30 backdrop-blur-sm border-2 border-orange-500 rounded-3xl shadow-2xl shadow-orange-500/30 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl">🎃</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-purple-400 mb-1 sm:mb-2">
              Meditate the Fear
            </h1>
            <p className="text-center text-orange-400 text-xs sm:text-sm mb-3 sm:mb-4 font-semibold">
              Face Your Fears Through Meditation
            </p>
            <p className="text-center text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">
              Choose your meditation duration... if you dare
            </p>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => {
                    if (duration.value === 'custom') {
                      setShowCustomTimer(true)
                    } else {
                      setSelectedDuration(duration.value)
                    }
                  }}
                  className={`py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all ${
                    selectedDuration === duration.value || (duration.value === 'custom' && showCustomTimer)
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 active:scale-95'
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>

            {/* Custom Timer Input */}
            {showCustomTimer && (
              <div className="mb-4 sm:mb-6 p-4 bg-black/40 rounded-2xl border border-purple-500/50">
                <h3 className="text-center text-purple-400 font-semibold mb-3 text-sm sm:text-base">⏰ Custom Timer</h3>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="0"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-gray-800 text-white border-2 border-orange-500 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 mt-1">min</span>
                  </div>
                  <span className="text-2xl text-purple-400 font-bold">:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="0"
                      value={customSeconds}
                      onChange={(e) => setCustomSeconds(e.target.value)}
                      className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-gray-800 text-white border-2 border-orange-500 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 mt-1">sec</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      const totalSeconds = (parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0)
                      if (totalSeconds > 0) {
                        setSelectedDuration(totalSeconds)
                        setShowCustomTimer(false)
                      }
                    }}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Set Timer
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomTimer(false)
                      setCustomMinutes('')
                      setCustomSeconds('')
                    }}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={goToSoundSelection}
              disabled={selectedDuration === 'custom' || (showCustomTimer && !selectedDuration)}
              className={`w-full py-3 sm:py-4 px-6 text-base sm:text-lg font-semibold rounded-full transition-all shadow-lg ${
                selectedDuration === 'custom' || (showCustomTimer && !selectedDuration)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-orange-500/50 active:scale-95'
              }`}
            >
              🎃 Enter the Darkness 🎃
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Meditation Screen
  return (
    <div className={`min-h-screen h-screen ${bgClass} flex items-center justify-center p-3 sm:p-4 transition-all duration-500 ${glitchActive ? 'animate-pulse' : ''} relative overflow-hidden`}>
      {/* Halloween Scene Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Night Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
          {/* Twinkling Stars */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-80" style={{ animation: 'twinkle 3s ease-in-out infinite' }}></div>
          <div className="absolute top-20 right-20 w-0.5 h-0.5 bg-white rounded-full opacity-60" style={{ animation: 'twinkle 2s ease-in-out infinite reverse' }}></div>
          <div className="absolute top-32 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-70" style={{ animation: 'twinkle 4s ease-in-out infinite' }}></div>
          <div className="absolute top-16 right-1/3 w-1 h-1 bg-white rounded-full opacity-90" style={{ animation: 'twinkle 2.5s ease-in-out infinite reverse' }}></div>
          <div className="absolute top-24 left-2/3 w-0.5 h-0.5 bg-white rounded-full opacity-50" style={{ animation: 'twinkle 3.5s ease-in-out infinite' }}></div>
        </div>
        
        {/* Haunted House - Background */}
        <img 
          src="./images/07haunted house, spooky house.png" 
          alt="haunted house"
          className="absolute top-16 right-4 w-32 h-40 sm:w-40 sm:h-52 opacity-60 object-contain"
          style={{ animation: 'sway 8s ease-in-out infinite' }}
        />
        
        {/* Spooky Trees */}
        <img 
          src="./images/10Spooky Halloween Tree.png" 
          alt="spooky tree"
          className="absolute bottom-0 left-0 w-40 h-56 sm:w-52 sm:h-72 opacity-80 object-contain"
          style={{ animation: 'sway 12s ease-in-out infinite reverse' }}
        />
        
        <img 
          src="./images/06Halloween Pumpkins with Spooky Tree Silhouette.png" 
          alt="tree with pumpkins"
          className="absolute bottom-0 right-4 w-48 h-64 sm:w-60 sm:h-80 opacity-70 object-contain"
          style={{ animation: 'sway 10s ease-in-out infinite' }}
        />
        
        {/* Flying Witch */}
        <img 
          src="./images/12witch, flying witch, halloween.png" 
          alt="flying witch"
          className="absolute top-20 left-1/4 w-20 h-16 sm:w-28 sm:h-20 opacity-60 object-contain"
          style={{ animation: 'fly 15s ease-in-out infinite, float 3s ease-in-out infinite' }}
        />
        
        {/* Jack-o'-lanterns with Flickering Glow */}
        <img 
          src="./images/01Cartoon Jack O' Lantern.png" 
          alt="jack-o-lantern"
          className="absolute bottom-8 left-16 w-16 h-16 sm:w-24 sm:h-24 object-contain"
          style={{ animation: 'flicker 2s ease-in-out infinite, bob 4s ease-in-out infinite' }}
        />
        
        <img 
          src="./images/02Cartoon Jack-o'-lanterns.png" 
          alt="jack-o-lanterns"
          className="absolute bottom-4 right-20 w-20 h-16 sm:w-28 sm:h-20 object-contain"
          style={{ animation: 'flicker 2.5s ease-in-out infinite reverse, bob 3s ease-in-out infinite' }}
        />
        
        {/* Halloween Bat - Flying */}
        <img 
          src="./images/08Retro Cartoon Bat Halloween.png" 
          alt="halloween bat"
          className="absolute top-28 right-1/4 w-12 h-10 sm:w-16 sm:h-12 opacity-70 object-contain"
          style={{ animation: 'fly 8s linear infinite reverse, float 2s ease-in-out infinite' }}
        />
        
        {/* Floating Ghost */}
        <img 
          src="./images/04Halloween cartoon ghost.png" 
          alt="ghost"
          className="absolute top-36 left-1/3 w-14 h-16 sm:w-20 sm:h-24 opacity-50 object-contain"
          style={{ animation: 'float 6s ease-in-out infinite, sway 4s ease-in-out infinite' }}
        />
        
        {/* Dangling Spider */}
        <img 
          src="./images/09Retro Cartoon Spider.png" 
          alt="spider"
          className="absolute top-12 left-12 w-10 h-10 sm:w-14 sm:h-14 opacity-60 object-contain"
          style={{ animation: 'spiderMove 3s ease-in-out infinite' }}
        />
        
        {/* Drifting Ground Fog */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900/60 via-gray-800/30 to-transparent" style={{ animation: 'fogDrift 20s ease-in-out infinite' }}></div>
        
        {/* Floating Magic Particles */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-orange-300/40 rounded-full blur-sm" style={{ animation: 'float 4s ease-in-out infinite, twinkle 2s ease-in-out infinite' }}></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-300/50 rounded-full" style={{ animation: 'float 6s ease-in-out infinite reverse, twinkle 3s ease-in-out infinite' }}></div>
        <div className="absolute top-2/5 left-1/2 w-1 h-1 bg-yellow-300/40 rounded-full" style={{ animation: 'float 5s ease-in-out infinite, twinkle 2.5s ease-in-out infinite reverse' }}></div>
        <div className="absolute top-1/6 left-3/4 w-1.5 h-1.5 bg-green-300/30 rounded-full blur-sm" style={{ animation: 'float 7s ease-in-out infinite, twinkle 4s ease-in-out infinite' }}></div>
      </div>
      
      {/* Horror Image Overlay */}
      {horrorImage && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <img 
            src={horrorImage} 
            alt="horror" 
            className={`w-full h-full object-cover ${glitchActive ? 'animate-pulse' : ''}`}
            style={{ 
              opacity: 0.7,
              mixBlendMode: 'lighten'
            }}
            onError={(e) => {
              console.error('Image failed to load:', horrorImage)
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <div className="w-full max-w-md relative z-20 px-2">
        <div className={`${cardClass} rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 transition-all duration-500 ${horrorImage ? 'backdrop-blur-sm bg-opacity-80' : ''}`}>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center ${textClass} mb-6 sm:mb-8 transition-all duration-300 ${glitchActive ? 'blur-sm' : ''}`}>
            {horrorMode ? 'M̴̢̛E̷D̸I̴T̷A̸T̴I̷O̸N̴' : 'Meditation'}
          </h1>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className={`w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full ${timerClass} flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all duration-500 ${glitchActive ? 'scale-110' : ''}`}>
                <span className={`text-4xl sm:text-5xl md:text-6xl font-light text-white ${glitchActive ? 'blur-md' : ''}`}>
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-16 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 px-2">
            <p className={`text-center text-sm sm:text-base md:text-lg leading-tight ${horrorMode ? 'text-red-400 font-bold tracking-wider' : 'text-gray-300'} transition-all duration-300 line-clamp-2`}>
              {message}
            </p>
          </div>

          {/* Breathing Guide - only show when calm */}
          {!horrorMode && breathingPhase && (
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-block bg-orange-900/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-orange-500/50 shadow-lg shadow-orange-500/30">
                <p className="text-orange-300 text-sm sm:text-base font-medium">
                  {breathingPhase}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={toggleTimer}
              className={`w-full py-3 sm:py-4 px-6 ${buttonClass} text-lg sm:text-xl font-semibold rounded-full transition-all shadow-lg active:scale-95 ${glitchActive ? 'animate-bounce' : ''}`}
            >
              {isActive ? 'Pause' : 'Resume'}
            </button>
            
            <button
              onClick={resetTimer}
              className={`w-full py-3 sm:py-4 px-6 ${horrorMode ? 'bg-gray-900 hover:bg-gray-800 text-red-400 border border-red-600' : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'} text-lg sm:text-xl font-semibold rounded-full transition-all active:scale-95`}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
