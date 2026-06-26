'use client';

import { useState } from 'react';
import styles from './subharmonics.module.css';
import { Victor_Mono } from 'next/font/google';
import Dropdown, { DropdownOption } from './Dropdown';
import { findClosestNote, ET_FREQUENCIES, JI_FREQUENCIES, ResultFrequency } from './utils';

const victorMono = Victor_Mono({
    subsets: ['latin-ext'],
    weight: '400'
});

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

const ROOT_FREQ = 261.63;

export default function Page() {
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

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.value = 0.3;
        }
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
            setResult(r);
        } else if (quantization === '12-ji') {
            const r = findClosestNote(frequency, JI_FREQUENCIES);
            frequency = r.frequency;
            setResult(r);
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
