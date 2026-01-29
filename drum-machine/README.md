# 🥁 Pro Drum Machine Studio

A professional-grade drum machine built with vanilla JavaScript, featuring multiple drum kits, sequencer, recording capabilities, and advanced audio controls.

![Drum Machine Preview](preview.png)

## 🎛️ Features

### 🥁 Core Features
- **4 Professional Drum Kits**: Heater, Smooth Piano, Electronic, Hip Hop
- **9 Drum Pads per Kit**: Fully playable with click or keyboard
- **Power Control**: Toggle power with visual feedback
- **Volume Control**: Master volume with percentage display
- **Metronome**: Built-in metronome with BPM control

### 🎵 Advanced Features
- **16-Step Sequencer**: Program complex drum patterns
- **Recording Studio**: Record, play, and save your drum sessions
- **Pattern Bank**: Save and load 8 custom patterns
- **Loop Mode**: Continuous playback option
- **Tempo Control**: Adjustable from 60 to 180 BPM
- **Effects**: Reverb, delay, and distortion controls

### 🎨 Professional Interface
- **Visual Feedback**: Active pads and visualizer
- **Real-time Display**: Shows current sound, status, and BPM
- **Transport Controls**: Play, stop, record, loop
- **Settings Panel**: Audio and interface customization
- **Responsive Design**: Works on desktop and tablet
- **Dark Theme**: Professional studio aesthetic

### 💾 Data Management
- **Local Storage**: Saves recordings and patterns
- **Export/Import**: Export recordings as JSON files
- **Pattern Management**: Save and load custom sequences
- **Recording Library**: Manage multiple recordings

## 🚀 How to Use

### 1. Basic Operation
1. **Turn on** the drum machine using the POWER switch
2. **Select a drum kit** from the 4 available options
3. **Play pads** by clicking or using keys Q,W,E,A,S,D,Z,X,C
4. **Adjust volume** with the master volume slider
5. **Set tempo** using the BPM slider (60-180 BPM)

### 2. Recording
1. Click **REC** to start recording
2. Play drums - all hits and timing will be recorded
3. Click **REC** again or **STOP** to end recording
4. Recordings appear in the Recordings panel
5. Click ▶ to play back a recording
6. Double-click name to rename
7. Click 🗑️ to delete

### 3. Sequencer
1. **Click cells** in the 16-step sequencer grid to activate steps
2. Each column represents a drum pad (9 pads)
3. Each row represents a 16th note step
4. Click **PLAY** to play the sequence
5. Enable **LOOP** for continuous playback
6. Use **CLEAR** to reset the sequencer
7. Use **RANDOM** to generate random patterns
8. Use **SAVE** to save pattern to pattern bank

### 4. Pattern Bank
1. **8 pattern slots** available (1-8)
2. Click a slot to load saved pattern
3. Save patterns using the SAVE button in sequencer
4. Patterns store: step data, drum kit, and BPM

### 5. Settings
1. Click **SETTINGS** button to open settings modal
2. Adjust audio latency and sample rate
3. Configure pad sensitivity
4. Adjust display brightness
5. **Save** or **Reset** settings

## ⌨️ Keyboard Shortcuts

| Key | Sound | Key | Sound |
|-----|-------|-----|-------|
| Q | Kick/Chord 1 | A | HH Open/Shaker |
| W | Snare/Chord 2 | S | HH Closed/HH Open |
| E | Clap/Chord 3 | D | Tom/HH Closed |
| Z | Perc 1/Kick | X | Perc 2/Stick |
| C | FX/Snare | Space | Play/Pause |

**Additional Controls:**
- `R` - Toggle recording
- `P` - Toggle playback
- `L` - Toggle loop
- `Esc` - Stop all playback

## 🛠️ Technical Features

### Audio Processing
- **Web Audio API**: High-quality audio playback
- **Sample-accurate timing**: Precise sequencing
- **Effects chain**: Reverb, delay, distortion
- **Volume normalization**: Consistent audio levels

### Performance
- **Optimized rendering**: 60fps visual feedback
- **Efficient storage**: Compressed pattern data
- **Memory management**: Automatic cleanup
- **CPU monitoring**: Real-time performance display

### Compatibility
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile/Tablet**: Responsive touch interface
- **Offline capable**: Works without internet
- **Keyboard/MIDI**: External controller support

## 💾 Data Structure

### Recording Format
```json
{
  "id": 123456789,
  "name": "Recording 1",
  "data": [
    {"key": "Q", "name": "KICK", "time": 100},
    {"key": "W", "name": "SNARE", "time": 500}
  ],
  "duration": 2000,
  "kit": "heater",
  "bpm": 120,
  "timestamp": "2024-01-30 14:30:00"
}