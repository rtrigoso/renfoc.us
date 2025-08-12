'use client';

import { useState } from 'react';
import styles from './subharmonics.module.css';
import { Victor_Mono } from 'next/font/google';

const victorMono = Victor_Mono({
    subsets: ['latin-ext'],
    weight: '400'
});

const ET_FREQUENCIES = {
    "C3": 261.63,
    "B2": 246.94,
    "A#2": 233.08,
    "A2": 220.00,
    "G#2": 207.65,
    "G2": 196.00,
    "F#2": 185.00,
    "F2": 174.61,
    "E2": 164.81,
    "D#2": 155.56,
    "D2": 146.83,
    "C#2": 138.59,
    "C2": 130.81,
    "B1": 123.47,
    "A#1": 116.54,
    "A1": 110.00,
    "G#1": 103.83,
    "G1": 98.00,
    "F#1": 92.50,
    "F1": 87.31,
    "E1": 82.41,
    "D#1": 77.78,
    "D1": 73.42,
    "C#1": 69.30,
    "C1": 65.41,
    "B0": 61.74,
    "A#0": 58.27,
    "A0": 55.00,
    "G#0": 51.91,
    "G0": 49.00,
    "F#0": 46.25,
    "F0": 43.65,
    "E0": 41.20,
    "D#0": 38.89,
    "D0": 36.71,
    "C#0": 34.65,
    "C0": 32.70,
    "B-1": 30.87,
    "A#-1": 29.14,
    "A-1": 27.50,
    "G#-1": 25.96,
    "G-1": 24.50,
    "F#-1": 23.12,
    "F-1": 21.83,
    "E-1": 20.60,
    "D#-1": 19.45,
    "D-1": 18.35,
    "C#-1": 17.32,
    "C-1": 16.35,
    "B-2": 15.43,
    "A#-2": 14.57,
    "A-2": 13.75,
    "G#-2": 12.98,
    "G-2": 12.25,
    "F#-2": 11.56,
    "F-2": 10.91,
    "E-2": 10.30,
    "D#-2": 9.72,
    "D-2": 9.18,
    "C#-2": 8.66,
    "C-2": 8.18
};

const JI_FREQUENCIES = {
    "C3 (1/1)": 261.63,
    "B2 (15/16)": 245.27,
    "A#2 (16/18)": 235.00,
    "A2 (5/6)": 218.03,
    "G#2 (8/10)": 210.00,
    "G2 (3/4)": 196.22,
    "F#2 (25/36)": 186.25,
    "F2 (4/6)": 174.42,
    "E2 (5/8)": 163.52,
    "D#2 (6/10)": 157.50,
    "D2 (9/16)": 147.16,
    "C#2 (16/30)": 140.63,
    "C2 (1/2)": 130.81,
    "B1 (15/32)": 122.64,
    "A#1 (16/36)": 117.50,
    "A1 (5/12)": 109.01,
    "G#1 (8/20)": 105.00,
    "G1 (3/8)": 98.11,
    "F#1 (25/72)": 93.13,
    "F1 (4/12)": 87.21,
    "E1 (5/16)": 81.76,
    "D#1 (6/20)": 78.75,
    "D1 (9/32)": 73.58,
    "C#1 (16/60)": 70.31,
    "C1 (1/4)": 65.41,
    "B0 (15/64)": 61.32,
    "A#0 (16/72)": 58.75,
    "A0 (5/24)": 54.51,
    "G#0 (8/40)": 52.50,
    "G0 (3/16)": 49.05,
    "F#0 (25/144)": 46.56,
    "F0 (4/24)": 43.61,
    "E0 (5/32)": 40.88,
    "D#0 (6/40)": 39.38,
    "D0 (9/64)": 36.79,
    "C#0 (16/120)": 35.16,
    "C0 (1/8)": 32.70,
    "B-1 (15/128)": 30.66,
    "A#-1 (16/144)": 29.38,
    "A-1 (5/48)": 27.25,
    "G#-1 (8/80)": 26.25,
    "G-1 (3/32)": 24.53,
    "F#-1 (25/288)": 23.28,
    "F-1 (4/48)": 21.80,
    "E-1 (5/64)": 20.44,
    "D#-1 (6/80)": 19.69,
    "D-1 (9/128)": 18.40,
    "C#-1 (16/240)": 17.58,
    "C-1 (1/16)": 16.35,
    "B-2 (15/256)": 15.33,
    "A#-2 (16/288)": 14.69,
    "A-2 (5/96)": 13.63,
    "G#-2 (8/160)": 13.13,
    "G-2 (3/64)": 12.26,
    "F#-2 (25/576)": 11.64,
    "F-2 (4/96)": 10.90,
    "E-2 (5/128)": 10.22,
    "D#-2 (6/160)": 9.84,
    "D-2 (9/256)": 9.20,
    "C#-2 (16/480)": 8.79,
    "C-2 (1/32)": 8.18
};

interface DropdownOption {
    label: string;
    value: string;
}

type OnChangeCallback = (value: string) => void;

interface DropdownProps {
    id: string;
    label: string;
    options: DropdownOption[];
    onChange?: OnChangeCallback
}

function Dropdown({ id, options, label, onChange }: DropdownProps) {
    return (
        <>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <select id={id} onChange={e => onChange && onChange(e.target.value || '')} >
                {
                    options.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
            </select>
        </>
    );
}

interface ResultFrequency {
    frequency: number;
    name: string;
    originalFreq: number;
}


export default function Page() {
    const subharmonics_divisions: DropdownOption[] = [
        { label: '÷1 (Unison)', value: '1' },
        { label: '÷2 (Octave Down)', value: '2' },
        { label: '÷3 (Fifth Down)', value: '3' },
        { label: '÷4 (Two Octaves Down)', value: '4' },
        { label: '÷5 (Major Third Down)', value: '5' },
        { label: '÷6 (Fifth Down, Octave Lower)', value: '6' },
        { label: '÷7 (Minor Seventh Down)', value: '7' },
        { label: '÷8 (Three Octaves Down)', value: '8' },
        { label: '÷9', value: '9' },
        { label: '÷10', value: '10' },
        { label: '÷11', value: '11' },
        { label: '÷12', value: '12' },
        { label: '÷13', value: '13' },
        { label: '÷14', value: '14' },
        { label: '÷15', value: '15' },
        { label: '÷16', value: '16' },
    ];

    const quantization_options: DropdownOption[] = [
        { label: 'None (Pure Mathematical Division)', value: 'none' },
        { label: '12 Note Equal Temperament', value: '12-et' },
        { label: '12 Note Just Intonation', value: '12-ji' },
    ];

    const [result, setResult] = useState<ResultFrequency | null>(null);
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [subharmonicDivision, setSubharmonicDivision] = useState<string>(subharmonics_divisions[0].value);
    const [quantization, setQuantization] = useState<string>(quantization_options[0].value);
    const [playButtonLabel, setPlayButtonLabel] = useState<string>('play');
    const [frequencyDisplay, setFrequencyDisplay] = useState<string>('261.63 Hz ÷ 1 = 261.63 Hz (C3)');
    const [quantizationInfo, setQuantizationInfo] = useState<string>('No Quantization:\nPure mathematical division - frequencies may fall between standard scale notes');

    let audioContext: AudioContext;
    let gainNode: GainNode;

    const MIDDLE_C = 261.63;
    const ROOT_FREQ = MIDDLE_C;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.value = 0.3;
        }
    }

    function findClosestNote(frequency: number, scaleMap: { [key: string]: number }): ResultFrequency {
        const noteNames = Object.keys(scaleMap);
        const scale = Object.values(scaleMap);
        let closest = scale[0];
        let closestDiff = Math.abs(frequency - closest);
        let noteName = 'C3';

        for (let i = 0; i < scale.length; i++) {
            const diff = Math.abs(frequency - scale[i]);
            if (diff < closestDiff) {
                closest = scale[i];
                closestDiff = diff;
                noteName = noteNames[i];
            }
        }

        return { frequency: closest, name: noteName, originalFreq: frequency };
    }

    function updateDisplay() {
        const division = parseInt(subharmonicDivision);
        const targetFreq = ROOT_FREQ / division;
        let displayFreq = targetFreq;
        let quantInfo = '';
        let r: ResultFrequency | null = null;
        let noteName;

        switch (quantization) {
            case '12-et':
                r = findClosestNote(targetFreq, ET_FREQUENCIES);
                displayFreq = r.frequency;
                noteName = r.name;
                quantInfo = `Equal Temperament:\nClosest note is ${r.name} (${r.frequency.toFixed(2)} Hz)\nOriginal calculated: ${r.originalFreq.toFixed(2)} Hz`;
                break;
            case '12-ji':
                r = findClosestNote(targetFreq, JI_FREQUENCIES);
                displayFreq = r.frequency;
                noteName = r.name;
                quantInfo = `Just Intonation:\nClosest note is ${r.name} (${r.frequency.toFixed(2)} Hz)\nOriginal calculated: ${r.originalFreq.toFixed(2)} Hz`;
                break;
            default:
                quantInfo = 'No Quantization:\nPure mathematical division - frequencies may fall between standard scale notes';
        }

        setResult(r);
        setFrequencyDisplay(`${ROOT_FREQ} Hz ÷ ${division} = ${displayFreq.toFixed(2)} Hz ${noteName ? `(${noteName})` : ''}`);
        setQuantizationInfo(quantInfo);
    }

    function playTone() {
        if (isPlaying) {
            stopTone();
            setOscillator(null)
            return;
        }

        initAudio();
        const division = parseInt(subharmonicDivision);
        let frequency = ROOT_FREQ / division;

        if (quantization === '12-et') {
            const r = findClosestNote(frequency, ET_FREQUENCIES);
            frequency = r.frequency;
            setResult(result);
        } else if (quantization === '12-ji') {
            const r = findClosestNote(frequency, JI_FREQUENCIES);
            frequency = r.frequency;
            setResult(result);
        }
        const tmpOscillator = audioContext.createOscillator();
        tmpOscillator.type = 'sawtooth';
        tmpOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        tmpOscillator.connect(gainNode);
        tmpOscillator.start();
        setOscillator(tmpOscillator);
        setIsPlaying(isPlaying => !isPlaying);
        setPlayButtonLabel('stop');
    }

    function stopTone() {
        if (oscillator) {
            oscillator.stop();
        }
        setIsPlaying(isPlaying => !isPlaying);
        setPlayButtonLabel('play');
    }

    return (
        <>
            <noscript>
                <div role="alert" className="important_alert">
                    <p><strong>Important:</strong> javascript is required to interact with this tool.</p>
                </div>
            </noscript>
            <div className={`${styles.subharmonics} ${victorMono.className}`}>
                <h1 className={styles.h1}>Subharmonics</h1>
                <div className={styles.displayGroup}>
                    <ul>
                        {!result?.name || (<li>Note: ${result?.name}</li>)}
                        <li>{frequencyDisplay}</li>
                        <li>{quantizationInfo}</li>
                    </ul>
                </div>
                <div className={styles.controlGroup}>
                    <Dropdown
                        id='subharmonics_division'
                        label='Subharmonic Division (÷n):'
                        options={subharmonics_divisions}
                        onChange={value => setSubharmonicDivision(value)}
                    />
                </div>
                <div className={styles.controlGroup}>
                    <Dropdown
                        id='quantization_control'
                        label='Quantization control:'
                        options={quantization_options}
                        onChange={value => setQuantization(value)}
                    />
                </div>
                <div className={styles.controlGroup}>
                    <button className={styles.playButton} onClick={() => {
                        updateDisplay();
                        playTone();
                    }}>{playButtonLabel}</button>
                </div>
            </div>
            <article>
                <h3>About Subharmonics:</h3>
                <ul>
                    <li>
                        <strong>Root Note:</strong> Middle C (C3) at 261.63 Hz
                    </li>
                    <li>
                        <strong>Subharmonic Division:</strong> Root frequency ÷ integer value
                    </li>
                    <li>
                        <strong>Equal Temperament:</strong> Standard Western tuning (12 equal semitones per octave)
                    </li>
                </ul>
                <p>
                    Notice how higher divisions (÷7, ÷11, etc.) sound increasingly &quot;out of tune&quot; to Western ears
                </p>
            </article>
        </>
    );
}