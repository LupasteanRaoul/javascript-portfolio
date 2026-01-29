document.addEventListener('DOMContentLoaded', function() {
    // Algorithm Information Database
    const algorithms = {
        bubble: {
            name: "Bubble Sort",
            description: "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            stable: "Yes",
            bestCase: "O(n)",
            worstCase: "O(n²)"
        },
        selection: {
            name: "Selection Sort",
            description: "Divides the input list into two parts: sorted and unsorted. Repeatedly selects the smallest element from unsorted part and moves it to sorted part.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            stable: "No",
            bestCase: "O(n²)",
            worstCase: "O(n²)"
        },
        insertion: {
            name: "Insertion Sort",
            description: "Builds the final sorted array one item at a time by comparisons. Much like sorting playing cards in your hands.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            stable: "Yes",
            bestCase: "O(n)",
            worstCase: "O(n²)"
        },
        merge: {
            name: "Merge Sort",
            description: "A divide and conquer algorithm that divides input array into two halves, sorts them recursively, and then merges the sorted halves.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            stable: "Yes",
            bestCase: "O(n log n)",
            worstCase: "O(n log n)"
        },
        quick: {
            name: "Quick Sort",
            description: "Picks an element as pivot and partitions the array around the pivot. Recursively sorts the sub-arrays.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(log n)",
            stable: "No",
            bestCase: "O(n log n)",
            worstCase: "O(n²)"
        },
        heap: {
            name: "Heap Sort",
            description: "Creates a heap data structure from the array, then repeatedly extracts the maximum element from heap and reconstructs the heap.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)",
            stable: "No",
            bestCase: "O(n log n)",
            worstCase: "O(n log n)"
        },
        shell: {
            name: "Shell Sort",
            description: "An optimization of insertion sort that allows exchange of far apart elements by starting with widely spaced elements and progressively reducing the gap.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)",
            stable: "No",
            bestCase: "O(n log n)",
            worstCase: "O(n²)"
        },
        counting: {
            name: "Counting Sort",
            description: "Counts the number of occurrences of each distinct element. Uses arithmetic to calculate the position of each element in the sorted output.",
            timeComplexity: "O(n + k)",
            spaceComplexity: "O(n + k)",
            stable: "Yes",
            bestCase: "O(n + k)",
            worstCase: "O(n + k)"
        }
    };

    // Game State
    let array = [];
    let arraySize = 30;
    let speed = 50; // 1-100, higher is faster
    let isSorting = false;
    let isPaused = false;
    let currentAlgorithm = 'bubble';
    let arrayType = 'random';
    let comparisons = 0;
    let swaps = 0;
    let arrayAccess = 0;
    let iterations = 0;
    let startTime = 0;
    let timerInterval = null;
    let steps = [];
    let currentStep = 0;
    let sortingPromise = null;
    let abortController = null;

    // DOM Elements
    const arrayContainer = document.getElementById('array-container');
    const generateBtn = document.getElementById('generate-btn');
    const sortBtn = document.getElementById('sort-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const stepBtn = document.getElementById('step-btn');
    const skipBtn = document.getElementById('skip-btn');
    const compareBtn = document.getElementById('compare-btn');
    const clearStepsBtn = document.getElementById('clear-steps');
    const arraySizeSlider = document.getElementById('array-size-slider');
    const sizeValue = document.getElementById('size-value');
    const arraySizeDisplay = document.getElementById('array-size');
    const speedSlider = document.getElementById('speed-slider');
    const speedDisplay = document.getElementById('speed-display');
    const speedValue = document.getElementById('speed-value');
    const comparisonsDisplay = document.getElementById('comparisons');
    const swapsDisplay = document.getElementById('swaps');
    const timeDisplay = document.getElementById('time');
    const arrayAccessDisplay = document.getElementById('array-access');
    const iterationsDisplay = document.getElementById('iterations');
    const stepsList = document.getElementById('steps-list');
    const algorithmInfo = document.getElementById('algorithm-info');
    const currentAlgoDisplay = document.getElementById('current-algo');
    const algoDescription = document.getElementById('algo-description');
    const algoTime = document.getElementById('algo-time');
    const algoSpace = document.getElementById('algo-space');
    const algoStable = document.getElementById('algo-stable');
    const timeComplexityDisplay = document.getElementById('time-complexity');
    const spaceComplexityDisplay = document.getElementById('space-complexity');
    const algorithmButtons = document.querySelectorAll('.algorithm-btn');
    const arrayTypeButtons = document.querySelectorAll('.array-type-btn');
    const algoTabs = document.querySelectorAll('.algo-tab');
    const compareModal = document.getElementById('compare-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const runComparisonBtn = document.getElementById('run-comparison');
    const closeComparisonBtn = document.getElementById('close-comparison');
    const soundToggleBtn = document.getElementById('sound-toggle');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // Initialize
    initVisualizer();

    function initVisualizer() {
        generateArray();
        renderArray();
        updateAlgorithmInfo('bubble');
        setupEventListeners();
        updateStats();
        startTimer();
    }

    function setupEventListeners() {
        // Array generation
        generateBtn.addEventListener('click', generateAndRenderArray);
        
        // Sorting controls
        sortBtn.addEventListener('click', startSorting);
        pauseBtn.addEventListener('click', togglePause);
        resetBtn.addEventListener('click', resetVisualizer);
        stepBtn.addEventListener('click', stepForward);
        skipBtn.addEventListener('click', skipToEnd);
        compareBtn.addEventListener('click', openComparisonModal);
        
        // Configuration controls
        arraySizeSlider.addEventListener('input', updateArraySize);
        speedSlider.addEventListener('input', updateSpeed);
        
        // Algorithm selection
        algorithmButtons.forEach(btn => {
            btn.addEventListener('click', () => selectAlgorithm(btn.dataset.algo));
        });
        
        // Array type selection
        arrayTypeButtons.forEach(btn => {
            btn.addEventListener('click', () => selectArrayType(btn.dataset.type));
        });
        
        // Algorithm tabs
        algoTabs.forEach(tab => {
            tab.addEventListener('click', () => switchAlgorithmType(tab.dataset.type));
        });
        
        // Steps management
        clearStepsBtn.addEventListener('click', clearSteps);
        
        // Modal controls
        closeModalBtn.addEventListener('click', () => compareModal.classList.remove('active'));
        runComparisonBtn.addEventListener('click', runAlgorithmComparison);
        closeComparisonBtn.addEventListener('click', () => compareModal.classList.remove('active'));
        
        // Settings
        soundToggleBtn.addEventListener('click', toggleSound);
        themeToggleBtn.addEventListener('click', toggleTheme);
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Close modal on outside click
        compareModal.addEventListener('click', (e) => {
            if (e.target === compareModal) {
                compareModal.classList.remove('active');
            }
        });
    }

    function generateArray() {
        array = [];
        
        switch(arrayType) {
            case 'random':
                for (let i = 0; i < arraySize; i++) {
                    array.push(Math.floor(Math.random() * 100) + 1);
                }
                break;
                
            case 'nearly-sorted':
                for (let i = 1; i <= arraySize; i++) {
                    array.push(i * 3);
                }
                // Shuffle slightly
                for (let i = 0; i < arraySize / 5; i++) {
                    const idx1 = Math.floor(Math.random() * arraySize);
                    const idx2 = Math.floor(Math.random() * arraySize);
                    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
                }
                break;
                
            case 'reverse-sorted':
                for (let i = arraySize; i >= 1; i--) {
                    array.push(i * 3);
                }
                break;
                
            case 'few-unique':
                const uniqueValues = [10, 30, 50, 70, 90];
                for (let i = 0; i < arraySize; i++) {
                    array.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
                }
                break;
        }
        
        // Reset stats
        comparisons = 0;
        swaps = 0;
        arrayAccess = 0;
        iterations = 0;
        steps = [];
        currentStep = 0;
        updateStats();
        clearSteps();
    }

    function renderArray() {
        arrayContainer.innerHTML = '';
        const containerWidth = arrayContainer.clientWidth;
        const barWidth = Math.max(10, Math.min(30, (containerWidth / arraySize) - 2));
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar unsorted';
            bar.style.height = `${value * 3}px`;
            bar.style.width = `${barWidth}px`;
            bar.dataset.value = value;
            bar.dataset.index = index;
            arrayContainer.appendChild(bar);
        });
    }

    function generateAndRenderArray() {
        if (isSorting) return;
        generateArray();
        renderArray();
        resetVisualizer();
    }

    function updateArraySize() {
        if (isSorting) return;
        arraySize = parseInt(arraySizeSlider.value);
        sizeValue.textContent = arraySize;
        arraySizeDisplay.textContent = arraySize;
        generateAndRenderArray();
    }

    function updateSpeed() {
        speed = parseInt(speedSlider.value);
        const speedText = speed < 25 ? 'Slow' : speed < 75 ? 'Normal' : 'Fast';
        speedDisplay.textContent = speedText;
        speedValue.textContent = speedText;
    }

    function selectAlgorithm(algo) {
        if (isSorting || !algorithms[algo]) return;
        
        // Update active button
        algorithmButtons.forEach(btn => btn.classList.remove('active'));
        event.target.closest('.algorithm-btn').classList.add('active');
        
        currentAlgorithm = algo;
        updateAlgorithmInfo(algo);
    }

    function selectArrayType(type) {
        if (isSorting) return;
        
        // Update active button
        arrayTypeButtons.forEach(btn => btn.classList.remove('active'));
        event.target.closest('.array-type-btn').classList.add('active');
        
        arrayType = type;
        generateAndRenderArray();
    }

    function switchAlgorithmType(type) {
        // Update active tab
        algoTabs.forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        // Show/hide algorithm containers
        document.querySelectorAll('.algorithms-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${type}-algorithms`).classList.add('active');
    }

    function updateAlgorithmInfo(algo) {
        const info = algorithms[algo];
        currentAlgoDisplay.textContent = info.name;
        algoDescription.textContent = info.description;
        algoTime.textContent = info.timeComplexity;
        algoSpace.textContent = info.spaceComplexity;
        algoStable.textContent = info.stable;
        timeComplexityDisplay.textContent = info.timeComplexity;
        spaceComplexityDisplay.textContent = info.spaceComplexity;
    }

    async function startSorting() {
        if (isSorting) return;
        
        isSorting = true;
        isPaused = false;
        sortBtn.disabled = true;
        pauseBtn.disabled = false;
        stepBtn.disabled = false;
        skipBtn.disabled = false;
        generateBtn.disabled = true;
        arraySizeSlider.disabled = true;
        
        // Reset stats
        comparisons = 0;
        swaps = 0;
        arrayAccess = 0;
        iterations = 0;
        steps = [];
        currentStep = 0;
        updateStats();
        clearSteps();
        startTimer();
        
        // Create abort controller for cancellation
        abortController = new AbortController();
        
        try {
            switch(currentAlgorithm) {
                case 'bubble':
                    await bubbleSort();
                    break;
                case 'selection':
                    await selectionSort();
                    break;
                case 'insertion':
                    await insertionSort();
                    break;
                case 'merge':
                    await mergeSort(0, array.length - 1);
                    break;
                case 'quick':
                    await quickSort(0, array.length - 1);
                    break;
                case 'heap':
                    await heapSort();
                    break;
                case 'shell':
                    await shellSort();
                    break;
                case 'counting':
                    await countingSort();
                    break;
            }
            
            // Mark all bars as sorted
            markAllAsSorted();
            addStep("Sorting completed!", "complete");
            
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Sorting error:', error);
            }
        } finally {
            finishSorting();
        }
    }

    // Bubble Sort Implementation
    async function bubbleSort() {
        const n = array.length;
        let swapped;
        
        do {
            swapped = false;
            iterations++;
            
            for (let i = 0; i < n - 1; i++) {
                if (abortController.signal.aborted) throw new AbortError();
                
                // Highlight comparing bars
                highlightBars(i, i + 1, 'comparing');
                comparisons++;
                arrayAccess += 2;
                addStep(`Comparing ${array[i]} and ${array[i + 1]}`, 'compare', i, i + 1);
                
                await delay();
                
                if (array[i] > array[i + 1]) {
                    // Swap
                    highlightBars(i, i + 1, 'swapping');
                    addStep(`Swapping ${array[i]} and ${array[i + 1]}`, 'swap', i, i + 1);
                    
                    await delay();
                    
                    [array[i], array[i + 1]] = [array[i + 1], array[i]];
                    swaps++;
                    arrayAccess += 2;
                    
                    updateBar(i);
                    updateBar(i + 1);
                    swapped = true;
                    
                    await delay();
                }
                
                // Reset non-swapped bars
                resetBarState(i);
                resetBarState(i + 1);
            }
            
            // Mark last element as sorted
            markAsSorted(n - iterations);
            
        } while (swapped);
    }

    // Selection Sort Implementation
    async function selectionSort() {
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (abortController.signal.aborted) throw new AbortError();
            
            let minIndex = i;
            markAsMin(minIndex);
            iterations++;
            
            for (let j = i + 1; j < n; j++) {
                if (abortController.signal.aborted) throw new AbortError();
                
                // Highlight comparing bars
                highlightBars(minIndex, j, 'comparing');
                comparisons++;
                arrayAccess += 2;
                addStep(`Comparing ${array[minIndex]} and ${array[j]}`, 'compare', minIndex, j);
                
                await delay();
                
                if (array[j] < array[minIndex]) {
                    resetBarState(minIndex);
                    minIndex = j;
                    markAsMin(minIndex);
                }
                
                resetBarState(j);
            }
            
            if (minIndex !== i) {
                // Swap
                highlightBars(i, minIndex, 'swapping');
                addStep(`Swapping ${array[i]} and ${array[minIndex]}`, 'swap', i, minIndex);
                
                await delay();
                
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                swaps++;
                arrayAccess += 2;
                
                updateBar(i);
                updateBar(minIndex);
                
                await delay();
            }
            
            markAsSorted(i);
            resetBarState(minIndex);
        }
        
        markAsSorted(n - 1);
    }

    // Insertion Sort Implementation
    async function insertionSort() {
        const n = array.length;
        
        for (let i = 1; i < n; i++) {
            if (abortController.signal.aborted) throw new AbortError();
            
            const key = array[i];
            let j = i - 1;
            iterations++;
            
            // Highlight current element
            highlightBars(i, i, 'comparing');
            addStep(`Inserting ${key} into sorted portion`, 'move', i);
            
            await delay();
            
            while (j >= 0 && array[j] > key) {
                if (abortController.signal.aborted) throw new AbortError();
                
                // Highlight comparing bars
                highlightBars(j, j + 1, 'comparing');
                comparisons++;
                arrayAccess += 2;
                addStep(`Comparing ${array[j]} and ${key}`, 'compare', j, i);
                
                await delay();
                
                // Move element
                array[j + 1] = array[j];
                arrayAccess += 2;
                updateBar(j + 1);
                
                highlightBars(j, j + 1, 'swapping');
                addStep(`Moving ${array[j]} to position ${j + 1}`, 'move', j, j + 1);
                
                await delay();
                
                resetBarState(j);
                resetBarState(j + 1);
                j--;
            }
            
            array[j + 1] = key;
            updateBar(j + 1);
            markAsSorted(j + 1);
            
            resetBarState(i);
            await delay();
        }
        
        // Mark all as sorted
        for (let i = 0; i < n; i++) {
            markAsSorted(i);
        }
    }

    // Merge Sort Implementation
    async function mergeSort(left, right) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }

    async function merge(left, mid, right) {
        if (abortController.signal.aborted) throw new AbortError();
        
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        // Highlight merge section
        for (let idx = left; idx <= right; idx++) {
            highlightBar(idx, 'comparing');
        }
        
        addStep(`Merging subarrays [${left}, ${mid}] and [${mid + 1}, ${right}]`, 'merge', left, right);
        await delay();
        
        while (i < leftArray.length && j < rightArray.length) {
            if (abortController.signal.aborted) throw new AbortError();
            
            comparisons++;
            arrayAccess += 2;
            addStep(`Comparing ${leftArray[i]} and ${rightArray[j]}`, 'compare', left + i, mid + 1 + j);
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
                swaps++;
            }
            
            arrayAccess++;
            updateBar(k);
            highlightBar(k, 'swapping');
            
            await delay();
            resetBarState(k);
            k++;
        }
        
        while (i < leftArray.length) {
            if (abortController.signal.aborted) throw new AbortError();
            
            array[k] = leftArray[i];
            arrayAccess++;
            updateBar(k);
            highlightBar(k, 'swapping');
            
            await delay();
            resetBarState(k);
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            if (abortController.signal.aborted) throw new AbortError();
            
            array[k] = rightArray[j];
            arrayAccess++;
            updateBar(k);
            highlightBar(k, 'swapping');
            
            await delay();
            resetBarState(k);
            j++;
            k++;
        }
        
        // Mark merged section as sorted
        for (let idx = left; idx <= right; idx++) {
            markAsSorted(idx);
        }
    }

    // Quick Sort Implementation
    async function quickSort(low, high) {
        if (low < high) {
            const pivotIndex = await partition(low, high);
            await quickSort(low, pivotIndex - 1);
            await quickSort(pivotIndex + 1, high);
        } else if (low === high) {
            markAsSorted(low);
        }
    }

    async function partition(low, high) {
        if (abortController.signal.aborted) throw new AbortError();
        
        const pivot = array[high];
        let i = low - 1;
        
        // Highlight pivot
        highlightBar(high, 'pivot');
        addStep(`Pivot selected: ${pivot} at index ${high}`, 'pivot', high);
        await delay();
        
        for (let j = low; j < high; j++) {
            if (abortController.signal.aborted) throw new AbortError();
            
            // Highlight comparing bars
            highlightBars(j, high, 'comparing');
            comparisons++;
            arrayAccess += 2;
            addStep(`Comparing ${array[j]} with pivot ${pivot}`, 'compare', j, high);
            
            await delay();
            
            if (array[j] < pivot) {
                i++;
                
                if (i !== j) {
                    // Swap
                    highlightBars(i, j, 'swapping');
                    addStep(`Swapping ${array[i]} and ${array[j]}`, 'swap', i, j);
                    
                    await delay();
                    
                    [array[i], array[j]] = [array[j], array[i]];
                    swaps++;
                    arrayAccess += 2;
                    
                    updateBar(i);
                    updateBar(j);
                    
                    await delay();
                }
            }
            
            resetBarState(j);
        }
        
        // Swap pivot to correct position
        if (i + 1 !== high) {
            highlightBars(i + 1, high, 'swapping');
            addStep(`Placing pivot ${pivot} at position ${i + 1}`, 'swap', i + 1, high);
            
            await delay();
            
            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            swaps++;
            arrayAccess += 2;
            
            updateBar(i + 1);
            updateBar(high);
            
            await delay();
        }
        
        // Reset bars
        resetBarState(high);
        resetBarState(i + 1);
        
        // Mark pivot position as sorted
        markAsSorted(i + 1);
        
        return i + 1;
    }

    // Heap Sort Implementation
    async function heapSort() {
        const n = array.length;
        
        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if (abortController.signal.aborted) throw new AbortError();
            await heapify(n, i);
        }
        
        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            if (abortController.signal.aborted) throw new AbortError();
            
            // Move current root to end
            highlightBars(0, i, 'swapping');
            addStep(`Moving root ${array[0]} to position ${i}`, 'swap', 0, i);
            
            await delay();
            
            [array[0], array[i]] = [array[i], array[0]];
            swaps++;
            arrayAccess += 2;
            
            updateBar(0);
            updateBar(i);
            
            await delay();
            
            markAsSorted(i);
            resetBarState(0);
            resetBarState(i);
            
            // Heapify reduced heap
            await heapify(i, 0);
        }
        
        markAsSorted(0);
    }

    async function heapify(n, i) {
        if (abortController.signal.aborted) throw new AbortError();
        
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        // Highlight parent and children
        highlightBar(i, 'comparing');
        if (left < n) highlightBar(left, 'comparing');
        if (right < n) highlightBar(right, 'comparing');
        
        if (left < n) {
            comparisons++;
            arrayAccess += 2;
            if (array[left] > array[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            comparisons++;
            arrayAccess += 2;
            if (array[right] > array[largest]) {
                largest = right;
            }
        }
        
        addStep(`Heapifying: largest among indices ${i}, ${left}, ${right} is ${largest}`, 'compare', i, largest);
        await delay();
        
        if (largest !== i) {
            // Swap
            highlightBars(i, largest, 'swapping');
            addStep(`Swapping ${array[i]} and ${array[largest]} in heap`, 'swap', i, largest);
            
            await delay();
            
            [array[i], array[largest]] = [array[largest], array[i]];
            swaps++;
            arrayAccess += 2;
            
            updateBar(i);
            updateBar(largest);
            
            await delay();
            
            // Recursively heapify affected subtree
            await heapify(n, largest);
        }
        
        // Reset bars
        resetBarState(i);
        if (left < n) resetBarState(left);
        if (right < n) resetBarState(right);
    }

    // Shell Sort Implementation
    async function shellSort() {
        const n = array.length;
        
        // Start with large gap, reduce by half each iteration
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            if (abortController.signal.aborted) throw new AbortError();
            
            addStep(`Using gap size: ${gap}`, 'gap', gap);
            
            // Do insertion sort for this gap size
            for (let i = gap; i < n; i++) {
                if (abortController.signal.aborted) throw new AbortError();
                
                const temp = array[i];
                let j;
                
                // Highlight elements at gap distance
                highlightBar(i, 'comparing');
                if (i - gap >= 0) highlightBar(i - gap, 'comparing');
                
                for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                    if (abortController.signal.aborted) throw new AbortError();
                    
                    comparisons++;
                    arrayAccess += 2;
                    addStep(`Comparing ${array[j - gap]} and ${temp} with gap ${gap}`, 'compare', j - gap, i);
                    
                    await delay();
                    
                    array[j] = array[j - gap];
                    arrayAccess += 2;
                    updateBar(j);
                    
                    highlightBars(j, j - gap, 'swapping');
                    addStep(`Moving ${array[j - gap]} to position ${j}`, 'move', j - gap, j);
                    
                    await delay();
                    
                    resetBarState(j);
                    resetBarState(j - gap);
                }
                
                array[j] = temp;
                updateBar(j);
                markAsSorted(j);
                
                resetBarState(i);
                await delay();
            }
        }
        
        // Mark all as sorted
        for (let i = 0; i < n; i++) {
            markAsSorted(i);
        }
    }

    // Counting Sort Implementation
    async function countingSort() {
        const n = array.length;
        const max = Math.max(...array);
        const count = new Array(max + 1).fill(0);
        const output = new Array(n);
        
        // Store count of each element
        for (let i = 0; i < n; i++) {
            if (abortController.signal.aborted) throw new AbortError();
            
            count[array[i]]++;
            arrayAccess++;
            
            highlightBar(i, 'comparing');
            addStep(`Counting occurrence of ${array[i]}`, 'count', i);
            
            await delay();
            resetBarState(i);
        }
        
        // Change count[i] so it contains position of this element in output
        for (let i = 1; i <= max; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            if (abortController.signal.aborted) throw new AbortError();
            
            output[count[array[i]] - 1] = array[i];
            count[array[i]]--;
            arrayAccess += 2;
            
            highlightBar(i, 'swapping');
            addStep(`Placing ${array[i]} in output array`, 'move', i);
            
            await delay();
            resetBarState(i);
        }
        
        // Copy output to original array
        for (let i = 0; i < n; i++) {
            if (abortController.signal.aborted) throw new AbortError();
            
            array[i] = output[i];
            updateBar(i);
            markAsSorted(i);
            
            await delay();
        }
    }

    // Visualization Helper Functions
    function highlightBar(index, className) {
        const bars = arrayContainer.children;
        if (bars[index]) {
            bars[index].className = `array-bar ${className}`;
        }
    }

    function highlightBars(index1, index2, className) {
        highlightBar(index1, className);
        highlightBar(index2, className);
    }

    function resetBarState(index) {
        const bars = arrayContainer.children;
        if (bars[index] && !bars[index].classList.contains('sorted')) {
            bars[index].className = 'array-bar unsorted';
        }
    }

    function updateBar(index) {
        const bars = arrayContainer.children;
        if (bars[index]) {
            const value = array[index];
            bars[index].style.height = `${value * 3}px`;
            bars[index].dataset.value = value;
        }
    }

    function markAsSorted(index) {
        const bars = arrayContainer.children;
        if (bars[index]) {
            bars[index].className = 'array-bar sorted';
        }
    }

    function markAllAsSorted() {
        const bars = arrayContainer.children;
        for (let i = 0; i < bars.length; i++) {
            bars[i].className = 'array-bar sorted';
        }
    }

    function markAsMin(index) {
        const bars = arrayContainer.children;
        if (bars[index]) {
            bars[index].className = 'array-bar min';
        }
    }

    function delay() {
        if (isPaused) {
            return new Promise(resolve => {
                const checkPause = () => {
                    if (!isPaused) {
                        resolve();
                    } else {
                        setTimeout(checkPause, 100);
                    }
                };
                checkPause();
            });
        }
        
        const delayTime = 101 - speed; // Invert speed (1-100 to 100-1ms)
        return new Promise(resolve => setTimeout(resolve, delayTime));
    }

    function addStep(description, type, index1 = null, index2 = null) {
        const step = {
            number: steps.length + 1,
            description,
            type,
            index1,
            index2,
            comparisons,
            swaps,
            arrayAccess
        };
        
        steps.push(step);
        updateStepsDisplay();
    }

    function updateStepsDisplay() {
        stepsList.innerHTML = '';
        
        steps.slice(-20).forEach(step => {
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            
            stepItem.innerHTML = `
                <div class="step-number">${step.number}</div>
                <div class="step-description">${step.description}</div>
                <div class="step-indices">
                    ${step.index1 !== null ? `<span>i=${step.index1}</span>` : ''}
                    ${step.index2 !== null ? `<span>j=${step.index2}</span>` : ''}
                </div>
                <div class="step-action ${step.type}">${step.type.toUpperCase()}</div>
            `;
            
            stepsList.appendChild(stepItem);
        });
        
        // Scroll to bottom
        stepsList.scrollTop = stepsList.scrollHeight;
    }

    function clearSteps() {
        steps = [];
        stepsList.innerHTML = '';
    }

    function updateStats() {
        comparisonsDisplay.textContent = comparisons;
        swapsDisplay.textContent = swaps;
        arrayAccessDisplay.textContent = arrayAccess;
        iterationsDisplay.textContent = iterations;
    }

    function startTimer() {
        clearInterval(timerInterval);
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            timeDisplay.textContent = `${elapsed}ms`;
        }, 10);
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.innerHTML = isPaused 
            ? '<i class="fas fa-play"></i><span>Resume</span>' 
            : '<i class="fas fa-pause"></i><span>Pause</span>';
    }

    function stepForward() {
        // For now, just resume briefly
        if (isPaused) {
            togglePause();
            setTimeout(() => togglePause(), 100);
        }
    }

    function skipToEnd() {
        if (abortController) {
            abortController.abort();
        }
        finishSorting();
    }

    function finishSorting() {
        isSorting = false;
        isPaused = false;
        sortBtn.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
        skipBtn.disabled = true;
        generateBtn.disabled = false;
        arraySizeSlider.disabled = false;
        
        clearInterval(timerInterval);
    }

    function resetVisualizer() {
        if (abortController) {
            abortController.abort();
        }
        
        isSorting = false;
        isPaused = false;
        sortBtn.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
        skipBtn.disabled = true;
        generateBtn.disabled = false;
        arraySizeSlider.disabled = false;
        
        clearInterval(timerInterval);
        timeDisplay.textContent = '0ms';
        
        // Reset all bars to unsorted
        const bars = arrayContainer.children;
        for (let i = 0; i < bars.length; i++) {
            bars[i].className = 'array-bar unsorted';
        }
        
        clearSteps();
    }

    function openComparisonModal() {
        compareModal.classList.add('active');
    }

    async function runAlgorithmComparison() {
        const algorithmsToCompare = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
        const results = [];
        
        for (const algo of algorithmsToCompare) {
            // Save current state
            const originalArray = [...array];
            const originalAlgorithm = currentAlgorithm;
            
            // Set algorithm
            currentAlgorithm = algo;
            updateAlgorithmInfo(algo);
            
            // Run sort
            comparisons = 0;
            swaps = 0;
            arrayAccess = 0;
            iterations = 0;
            startTime = Date.now();
            
            try {
                switch(algo) {
                    case 'bubble': await bubbleSort(); break;
                    case 'selection': await selectionSort(); break;
                    case 'insertion': await insertionSort(); break;
                    case 'merge': await mergeSort(0, array.length - 1); break;
                    case 'quick': await quickSort(0, array.length - 1); break;
                }
                
                const time = Date.now() - startTime;
                
                results.push({
                    algorithm: algorithms[algo].name,
                    time,
                    comparisons,
                    swaps,
                    arrayAccess,
                    timeComplexity: algorithms[algo].timeComplexity
                });
                
            } catch (error) {
                console.error(`Error in ${algo}:`, error);
            }
            
            // Restore array
            array = [...originalArray];
            renderArray();
            
            // Small delay between algorithms
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Restore original algorithm
        currentAlgorithm = originalAlgorithm;
        updateAlgorithmInfo(originalAlgorithm);
        
        // Display results
        displayComparisonResults(results);
    }

    function displayComparisonResults(results) {
        const container = document.getElementById('comparison-results');
        container.innerHTML = '';
        
        // Create results table
        let html = `
            <h3>Algorithm Performance Comparison</h3>
            <div class="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Time (ms)</th>
                            <th>Comparisons</th>
                            <th>Swaps</th>
                            <th>Array Accesses</th>
                            <th>Time Complexity</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        results.forEach(result => {
            html += `
                <tr>
                    <td><strong>${result.algorithm}</strong></td>
                    <td>${result.time}</td>
                    <td>${result.comparisons}</td>
                    <td>${result.swaps}</td>
                    <td>${result.arrayAccess}</td>
                    <td>${result.timeComplexity}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }

    function toggleSound() {
        const isMuted = soundToggleBtn.classList.toggle('muted');
        soundToggleBtn.innerHTML = isMuted 
            ? '<i class="fas fa-volume-mute"></i> Sound' 
            : '<i class="fas fa-volume-up"></i> Sound';
    }

    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.innerHTML = document.body.classList.contains('light-theme')
            ? '<i class="fas fa-moon"></i> Theme'
            : '<i class="fas fa-sun"></i> Theme';
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Error class for aborting
    class AbortError extends Error {
        constructor() {
            super('Aborted');
            this.name = 'AbortError';
        }
    }
});