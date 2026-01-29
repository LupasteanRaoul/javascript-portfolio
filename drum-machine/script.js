document.addEventListener('DOMContentLoaded', function() {
    // Drum Kit Definitions
    const drumKits = {
        heater: [
            { key: 'Q', name: 'KICK', url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
            { key: 'W', name: 'SNARE', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
            { key: 'E', name: 'CLAP', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
            { key: 'A', name: 'HH OPEN', url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
            { key: 'S', name: 'HH CLOSED', url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
            { key: 'D', name: 'TOM', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
            { key: 'Z', name: 'PERC 1', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
            { key: 'X', name: 'PERC 2', url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
            { key: 'C', name: 'FX', url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' }
        ],
        smooth: [
            { key: 'Q', name: 'CHORD 1', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3' },
            { key: 'W', name: 'CHORD 2', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3' },
            { key: 'E', name: 'CHORD 3', url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3' },
            { key: 'A', name: 'SHAKER', url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
            { key: 'S', name: 'HH OPEN', url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3' },
            { key: 'D', name: 'HH CLOSED', url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3' },
            { key: 'Z', name: 'KICK', url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3' },
            { key: 'X', name: 'STICK', url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3' },
            { key: 'C', name: 'SNARE', url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' }
        ],
        electronic: [
            { key: 'Q', name: '808 KICK', url: 'https://s3.amazonaws.com/freecodecamp/drums/808-Kick01.wav' },
            { key: 'W', name: '808 SNARE', url: 'https://s3.amazonaws.com/freecodecamp/drums/808-Snare01.wav' },
            { key: 'E', name: '808 CLAP', url: 'https://s3.amazonaws.com/freecodecamp/drums/808-Clap01.wav' },
            { key: 'A', name: 'SYNTH HAT', url: 'https://s3.amazonaws.com/freecodecamp/drums/Synth-Hat01.wav' },
            { key: 'S', name: 'CYMBAL', url: 'https://s3.amazonaws.com/freecodecamp/drums/Cymbal-Crash01.wav' },
            { key: 'D', name: 'TOM', url: 'https://s3.amazonaws.com/freecodecamp/drums/808-Tom01.wav' },
            { key: 'Z', name: 'PERC 1', url: 'https://s3.amazonaws.com/freecodecamp/drums/Percussion01.wav' },
            { key: 'X', name: 'PERC 2', url: 'https://s3.amazonaws.com/freecodecamp/drums/Percussion02.wav' },
            { key: 'C', name: 'FX', url: 'https://s3.amazonaws.com/freecodecamp/drums/Synth-FX01.wav' }
        ],
        hiphop: [
            { key: 'Q', name: 'BOOM KICK', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Kick01.wav' },
            { key: 'W', name: 'TRAP SNARE', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Snare01.wav' },
            { key: 'E', name: 'TRAP HAT', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Hat01.wav' },
            { key: 'A', name: 'CLAP', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Clap01.wav' },
            { key: 'S', name: 'RIMSHOT', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Rim01.wav' },
            { key: 'D', name: 'TOM', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Tom01.wav' },
            { key: 'Z', name: 'PERC', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Perc01.wav' },
            { key: 'X', name: 'VOCAL', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-Vox01.wav' },
            { key: 'C', name: 'FX', url: 'https://s3.amazonaws.com/freecodecamp/drums/HipHop-FX01.wav' }
        ]
    };

    // Global Variables
    let currentKit = 'heater';
    let power = false;
    let isRecording = false;
    let isPlaying = false;
    let isLooping = false;
    let bpm = 120;
    let currentRecord = [];
    let recordings = [];
    let sequencer = Array(16).fill().map(() => Array(9).fill(false));
    let currentStep = 0;
    let sequencerInterval = null;
    let recordStartTime = 0;
    let timerInterval = null;
    let playingTimeouts = [];
    let masterVolume = 0.7;
    let metronomeEnabled = false;
    let visualizerInterval = null;

    // DOM Elements
    const displayText = document.getElementById('display-text');
    const visualizer = document.getElementById('visualizer');
    const padsGrid = document.getElementById('pad-bank');
    const powerSwitch = document.getElementById('power-switch');
    const powerStatus = document.getElementById('power-status');
    const metronomeSwitch = document.getElementById('metronome-switch');
    const metronomeStatus = document.getElementById('metronome-status');
    const bpmSlider = document.getElementById('bpm-slider');
    const bpmDisplay = document.getElementById('bpm-display');
    const bpmValue = document.getElementById('bpm-value');
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoDisplay = document.getElementById('tempo-display');
    const masterVolumeSlider = document.getElementById('master-volume');
    const recordBtn = document.getElementById('record-btn');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const loopBtn = document.getElementById('loop-btn');
    const timer = document.getElementById('timer');
    const sequencerGrid = document.getElementById('sequencer');
    const recordingsList = document.getElementById('recordings');
    const kitButtons = document.querySelectorAll('.kit-btn');
    const clearSeqBtn = document.getElementById('clear-seq');
    const randomSeqBtn = document.getElementById('random-seq');
    const saveSeqBtn = document.getElementById('save-seq');
    const deleteAllBtn = document.getElementById('delete-all');
    const exportBtn = document.getElementById('export-btn');
    const patternBank = document.getElementById('pattern-bank');
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('settings-btn');
    const closeModal = document.querySelector('.close-modal');
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetSettingsBtn = document.getElementById('reset-settings');

    // Initialize
    loadKit(currentKit);
    createSequencer();
    createPatternBank();
    updateDisplay('READY');
    startVisualizer();
    setupEventListeners();
    updateTimer();
    loadFromLocalStorage();

    // Event Listeners Setup
    function setupEventListeners() {
        // Power Switch
        powerSwitch.addEventListener('click', togglePower);
        
        // Metronome Switch
        metronomeSwitch.addEventListener('click', toggleMetronome);
        
        // BPM Control
        bpmSlider.addEventListener('input', updateBPM);
        
        // Tempo Control
        tempoSlider.addEventListener('input', updateTempo);
        
        // Master Volume
        masterVolumeSlider.addEventListener('input', updateMasterVolume);
        
        // Transport Controls
        recordBtn.addEventListener('click', toggleRecording);
        playBtn.addEventListener('click', togglePlayback);
        stopBtn.addEventListener('click', stopPlayback);
        loopBtn.addEventListener('click', toggleLoop);
        
        // Kit Selection
        kitButtons.forEach(btn => {
            btn.addEventListener('click', () => switchKit(btn.dataset.kit));
        });
        
        // Sequencer Controls
        clearSeqBtn.addEventListener('click', clearSequencer);
        randomSeqBtn.addEventListener('click', randomizeSequencer);
        saveSeqBtn.addEventListener('click', saveSequence);
        
        // Recordings Controls
        deleteAllBtn.addEventListener('click', clearAllRecordings);
        exportBtn.addEventListener('click', exportRecordings);
        
        // Keyboard Support
        document.addEventListener('keydown', handleKeyDown);
        
        // Settings Modal
        settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
        closeModal.addEventListener('click', () => settingsModal.classList.remove('active'));
        saveSettingsBtn.addEventListener('click', saveSettings);
        resetSettingsBtn.addEventListener('click', resetSettings);
        
        // Close modal when clicking outside
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
    }

    // Load Drum Kit
    function loadKit(kitName) {
        currentKit = kitName;
        padsGrid.innerHTML = '';
        
        drumKits[kitName].forEach((pad, index) => {
            const padElement = document.createElement('div');
            padElement.className = 'drum-pad';
            padElement.dataset.key = pad.key;
            padElement.dataset.index = index;
            
            padElement.innerHTML = `
                <div class="pad-key">${pad.key}</div>
                <div class="pad-name">${pad.name}</div>
                <audio class="pad-audio" src="${pad.url}" data-key="${pad.key}"></audio>
            `;
            
            padElement.addEventListener('click', () => playPad(pad.key, pad.name));
            padsGrid.appendChild(padElement);
        });
        
        // Update active kit button
        kitButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.kit === kitName);
        });
        
        updateDisplay(`${kitName.toUpperCase()} KIT`);
    }

    // Play Drum Pad
    function playPad(key, name) {
        if (!power) return;
        
        const audio = document.querySelector(`audio[data-key="${key}"]`);
        if (!audio) return;
        
        // Apply effects
        const reverb = document.getElementById('reverb-slider').value / 100;
        const delay = document.getElementById('delay-slider').value / 100;
        const distortion = document.getElementById('distortion-slider').value / 100;
        
        // Set audio properties
        audio.volume = masterVolume;
        audio.currentTime = 0;
        
        // Apply effects (simplified for demo)
        if (distortion > 0) {
            audio.playbackRate = 1 + (distortion * 0.5);
        }
        
        audio.play();
        
        // Visual feedback
        const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
        if (pad) {
            pad.classList.add('active');
            setTimeout(() => pad.classList.remove('active'), 100);
        }
        
        // Update display
        updateDisplay(name);
        
        // Add to recording if recording
        if (isRecording) {
            const time = Date.now() - recordStartTime;
            currentRecord.push({ key, name, time });
        }
        
        // Update visualizer
        pulseVisualizer();
    }

    // Handle Keyboard Input
    function handleKeyDown(e) {
        if (!power) return;
        
        const key = e.key.toUpperCase();
        if ('QWEASDZXC'.includes(key)) {
            e.preventDefault();
            const pad = drumKits[currentKit].find(p => p.key === key);
            if (pad) {
                playPad(pad.key, pad.name);
            }
        }
    }

    // Toggle Power
    function togglePower() {
        power = !power;
        powerSwitch.classList.toggle('on', power);
        powerStatus.textContent = power ? 'ON' : 'OFF';
        powerStatus.style.color = power ? '#6c5ce7' : '#636e72';
        
        if (!power) {
            stopRecording();
            stopPlayback();
            updateDisplay('POWER OFF');
        } else {
            updateDisplay('READY');
        }
        
        // Enable/disable pads
        document.querySelectorAll('.drum-pad').forEach(pad => {
            pad.classList.toggle('disabled', !power);
        });
        
        // Enable/disable controls
        const controls = [recordBtn, playBtn, loopBtn];
        controls.forEach(btn => {
            btn.disabled = !power;
        });
    }

    // Toggle Metronome
    function toggleMetronome() {
        metronomeEnabled = !metronomeEnabled;
        metronomeSwitch.classList.toggle('on', metronomeEnabled);
        metronomeStatus.textContent = metronomeEnabled ? 'ON' : 'OFF';
        metronomeStatus.style.color = metronomeEnabled ? '#00cec9' : '#636e72';
        
        if (metronomeEnabled) {
            updateDisplay('METRONOME ON');
        } else {
            updateDisplay('METRONOME OFF');
        }
    }

    // Update BPM
    function updateBPM() {
        bpm = parseInt(bpmSlider.value);
        bpmDisplay.textContent = bpm;
        bpmValue.textContent = bpm;
        updateDisplay(`BPM: ${bpm}`);
        
        if (isPlaying) {
            stopSequencer();
            startSequencer();
        }
    }

    // Update Tempo
    function updateTempo() {
        const tempo = parseFloat(tempoSlider.value);
        tempoDisplay.textContent = tempo.toFixed(1) + 'x';
        updateDisplay(`TEMPO: ${tempo.toFixed(1)}x`);
    }

    // Update Master Volume
    function updateMasterVolume() {
        masterVolume = masterVolumeSlider.value / 100;
        updateDisplay(`VOL: ${Math.round(masterVolume * 100)}%`);
    }

    // Recording Functions
    function toggleRecording() {
        if (!power) return;
        
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    function startRecording() {
        isRecording = true;
        currentRecord = [];
        recordStartTime = Date.now();
        recordBtn.classList.add('recording');
        updateDisplay('RECORDING...');
        
        // Start timer
        timerInterval = setInterval(updateTimer, 100);
    }

    function stopRecording() {
        if (!isRecording) return;
        
        isRecording = false;
        recordBtn.classList.remove('recording');
        clearInterval(timerInterval);
        
        if (currentRecord.length > 0) {
            saveRecording();
        }
        
        updateDisplay('RECORDING STOPPED');
    }

    function saveRecording() {
        const recording = {
            id: Date.now(),
            name: `Recording ${recordings.length + 1}`,
            data: currentRecord,
            duration: Date.now() - recordStartTime,
            kit: currentKit,
            bpm: bpm,
            timestamp: new Date().toLocaleString()
        };
        
        recordings.push(recording);
        addRecordingToList(recording);
        saveToLocalStorage();
    }

    function addRecordingToList(recording) {
        const li = document.createElement('div');
        li.className = 'recording-item';
        li.dataset.id = recording.id;
        
        li.innerHTML = `
            <span class="recording-name">${recording.name}</span>
            <div class="recording-controls">
                <button class="recording-btn play" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="recording-btn rename" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="recording-btn delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        li.querySelector('.play').addEventListener('click', () => playRecording(recording, li));
        li.querySelector('.rename').addEventListener('click', () => renameRecording(recording, li));
        li.querySelector('.delete').addEventListener('click', () => deleteRecording(recording.id, li));
        
        recordingsList.appendChild(li);
    }

    function playRecording(recording, element) {
        stopAllPlaying();
        element.classList.add('playing');
        updateDisplay(`PLAYING: ${recording.name}`);
        
        recording.data.forEach(event => {
            const timeout = setTimeout(() => {
                playPad(event.key, event.name);
            }, event.time);
            playingTimeouts.push(timeout);
        });
        
        // Remove playing class after playback
        setTimeout(() => {
            element.classList.remove('playing');
        }, recording.duration);
    }

    function renameRecording(recording, element) {
        const newName = prompt('Enter new name for recording:', recording.name);
        if (newName && newName.trim() !== '') {
            recording.name = newName.trim();
            element.querySelector('.recording-name').textContent = recording.name;
            saveToLocalStorage();
        }
    }

    function deleteRecording(id, element) {
        if (confirm('Are you sure you want to delete this recording?')) {
            recordings = recordings.filter(r => r.id !== id);
            element.remove();
            saveToLocalStorage();
        }
    }

    function clearAllRecordings() {
        if (recordings.length === 0) return;
        
        if (confirm('Are you sure you want to delete ALL recordings?')) {
            recordings = [];
            recordingsList.innerHTML = '';
            saveToLocalStorage();
            updateDisplay('ALL RECORDINGS CLEARED');
        }
    }

    function exportRecordings() {
        if (recordings.length === 0) {
            alert('No recordings to export.');
            return;
        }
        
        const dataStr = JSON.stringify(recordings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `drum-recordings-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        updateDisplay('RECORDINGS EXPORTED');
    }

    // Sequencer Functions
    function createSequencer() {
        sequencerGrid.innerHTML = '';
        
        for (let step = 0; step < 16; step++) {
            for (let pad = 0; pad < 9; pad++) {
                const stepElement = document.createElement('div');
                stepElement.className = 'sequencer-step';
                stepElement.dataset.step = step;
                stepElement.dataset.pad = pad;
                
                stepElement.addEventListener('click', () => toggleSequencerStep(step, pad));
                
                sequencerGrid.appendChild(stepElement);
            }
        }
    }

    function toggleSequencerStep(step, pad) {
        if (!power) return;
        
        sequencer[step][pad] = !sequencer[step][pad];
        const stepElement = document.querySelector(`.sequencer-step[data-step="${step}"][data-pad="${pad}"]`);
        stepElement.classList.toggle('active', sequencer[step][pad]);
    }

    function clearSequencer() {
        sequencer = Array(16).fill().map(() => Array(9).fill(false));
        document.querySelectorAll('.sequencer-step').forEach(step => {
            step.classList.remove('active');
        });
        updateDisplay('SEQUENCER CLEARED');
    }

    function randomizeSequencer() {
        for (let step = 0; step < 16; step++) {
            for (let pad = 0; pad < 9; pad++) {
                sequencer[step][pad] = Math.random() > 0.7;
                const stepElement = document.querySelector(`.sequencer-step[data-step="${step}"][data-pad="${pad}"]`);
                stepElement.classList.toggle('active', sequencer[step][pad]);
            }
        }
        updateDisplay('SEQUENCER RANDOMIZED');
    }

    function saveSequence() {
        const pattern = {
            name: `Pattern ${document.querySelectorAll('.pattern-cell').length + 1}`,
            data: sequencer,
            kit: currentKit,
            bpm: bpm
        };
        
        savePattern(pattern);
        updateDisplay('PATTERN SAVED');
    }

    function startSequencer() {
        if (!power || isPlaying) return;
        
        isPlaying = true;
        playBtn.disabled = true;
        stopBtn.disabled = false;
        currentStep = 0;
        
        const stepDuration = (60000 / bpm) / 4; // 16th notes
        
        sequencerInterval = setInterval(() => {
            // Clear previous current step
            document.querySelectorAll('.sequencer-step.current').forEach(step => {
                step.classList.remove('current');
            });
            
            // Highlight current step
            for (let pad = 0; pad < 9; pad++) {
                const stepElement = document.querySelector(`.sequencer-step[data-step="${currentStep}"][data-pad="${pad}"]`);
                if (stepElement) {
                    stepElement.classList.add('current');
                    
                    // Play sound if step is active
                    if (sequencer[currentStep][pad]) {
                        const padKey = drumKits[currentKit][pad].key;
                        const padName = drumKits[currentKit][pad].name;
                        playPad(padKey, padName);
                    }
                }
            }
            
            // Move to next step
            currentStep = (currentStep + 1) % 16;
            
            // If not looping and reached end, stop
            if (!isLooping && currentStep === 0) {
                stopSequencer();
            }
        }, stepDuration);
        
        updateDisplay('SEQUENCER PLAYING');
    }

    function stopSequencer() {
        isPlaying = false;
        clearInterval(sequencerInterval);
        playBtn.disabled = false;
        stopBtn.disabled = true;
        
        // Clear current step highlighting
        document.querySelectorAll('.sequencer-step.current').forEach(step => {
            step.classList.remove('current');
        });
        
        updateDisplay('SEQUENCER STOPPED');
    }

    function togglePlayback() {
        if (isPlaying) {
            stopSequencer();
        } else {
            startSequencer();
        }
    }

    function stopPlayback() {
        stopAllPlaying();
        stopSequencer();
        updateDisplay('PLAYBACK STOPPED');
    }

    function toggleLoop() {
        isLooping = !isLooping;
        loopBtn.classList.toggle('active', isLooping);
        updateDisplay(isLooping ? 'LOOP ON' : 'LOOP OFF');
    }

    function stopAllPlaying() {
        playingTimeouts.forEach(timeout => clearTimeout(timeout));
        playingTimeouts = [];
        document.querySelectorAll('.recording-item.playing').forEach(item => {
            item.classList.remove('playing');
        });
    }

    // Pattern Bank Functions
    function createPatternBank() {
        patternBank.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            cell.dataset.index = i;
            cell.textContent = i + 1;
            
            cell.addEventListener('click', () => loadPattern(i));
            patternBank.appendChild(cell);
        }
    }

    function savePattern(pattern) {
        const patterns = JSON.parse(localStorage.getItem('drumPatterns') || '[]');
        patterns.push(pattern);
        localStorage.setItem('drumPatterns', JSON.stringify(patterns));
    }

    function loadPattern(index) {
        const patterns = JSON.parse(localStorage.getItem('drumPatterns') || '[]');
        if (patterns[index]) {
            const pattern = patterns[index];
            sequencer = pattern.data;
            currentKit = pattern.kit;
            bpm = pattern.bpm;
            
            // Update UI
            loadKit(currentKit);
            bpmSlider.value = bpm;
            bpmDisplay.textContent = bpm;
            bpmValue.textContent = bpm;
            
            // Update sequencer display
            for (let step = 0; step < 16; step++) {
                for (let pad = 0; pad < 9; pad++) {
                    const stepElement = document.querySelector(`.sequencer-step[data-step="${step}"][data-pad="${pad}"]`);
                    if (stepElement) {
                        stepElement.classList.toggle('active', sequencer[step][pad]);
                    }
                }
            }
            
            // Highlight pattern cell
            document.querySelectorAll('.pattern-cell').forEach(cell => {
                cell.classList.remove('active');
            });
            document.querySelector(`.pattern-cell[data-index="${index}"]`).classList.add('active');
            
            updateDisplay(`PATTERN ${index + 1} LOADED`);
        }
    }

    // Switch Kit
    function switchKit(kitName) {
        if (!power) return;
        
        loadKit(kitName);
        
        // Update sequencer for new kit
        if (isPlaying) {
            stopSequencer();
            startSequencer();
        }
    }

    // Update Display
    function updateDisplay(text) {
        displayText.textContent = text;
    }

    // Update Timer
    function updateTimer() {
        if (isRecording) {
            const elapsed = Date.now() - recordStartTime;
            const seconds = (elapsed / 1000).toFixed(1);
            timer.textContent = formatTime(elapsed);
            recordBtn.querySelector('i').textContent = seconds > 0 ? '⏺' : '●';
        } else {
            timer.textContent = formatTime(0);
        }
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    // Visualizer
    function startVisualizer() {
        visualizerInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                pulseVisualizer();
            }
        }, 300);
    }

    function pulseVisualizer() {
        visualizer.style.transform = 'scaleX(1.5)';
        visualizer.style.opacity = '1';
        
        setTimeout(() => {
            visualizer.style.transform = 'scaleX(1)';
            visualizer.style.opacity = '0.5';
        }, 100);
    }

    // Local Storage
    function saveToLocalStorage() {
        const data = {
            recordings: recordings,
            settings: {
                bpm: bpm,
                volume: masterVolume,
                kit: currentKit
            }
        };
        localStorage.setItem('drumMachineData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('drumMachineData'));
        if (data) {
            recordings = data.recordings || [];
            recordings.forEach(rec => addRecordingToList(rec));
            
            if (data.settings) {
                bpm = data.settings.bpm || 120;
                masterVolume = data.settings.volume || 0.7;
                currentKit = data.settings.kit || 'heater';
                
                // Update UI
                bpmSlider.value = bpm;
                bpmDisplay.textContent = bpm;
                bpmValue.textContent = bpm;
                masterVolumeSlider.value = masterVolume * 100;
                loadKit(currentKit);
            }
        }
    }

    // Settings Functions
    function saveSettings() {
        const latency = document.getElementById('latency-select').value;
        const sampleRate = document.getElementById('sample-rate-select').value;
        const sensitivity = document.getElementById('sensitivity-slider').value;
        const brightness = document.getElementById('brightness-slider').value;
        
        // In a real app, you would apply these settings
        updateDisplay('SETTINGS SAVED');
        settingsModal.classList.remove('active');
    }

    function resetSettings() {
        if (confirm('Reset all settings to default?')) {
            document.getElementById('latency-select').value = 'medium';
            document.getElementById('sample-rate-select').value = '48000';
            document.getElementById('sensitivity-slider').value = '5';
            document.getElementById('brightness-slider').value = '80';
            updateDisplay('SETTINGS RESET');
        }
    }

    // Initialize with default settings
    updateBPM();
    updateTempo();
    updateMasterVolume();
});