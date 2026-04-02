'use client';

import { useState } from 'react';
import styles from './automusicology.module.css';

type TabId = 'bo' | 'jb' | 'tc' | 'syn' | 'gl';

const tabs: { id: TabId; label: string }[] = [
    { id: 'bo', label: 'Blood Orange' },
    { id: 'jb', label: 'James Blake' },
    { id: 'tc', label: 'Thundercat' },
    { id: 'syn', label: 'Making your own' },
    { id: 'gl', label: 'Glossary' },
];

function BloodOrangePanel() {
    return (
        <>
            <p className={styles.albumTitle}>Blood Orange — Cupid Deluxe (2013)</p>
            <p className={styles.albumSub}>Genre: indie R&B / neo-soul</p>
            <div className={styles.sec}>What this album is built from</div>
            <p className={styles.body}>Every element below is a deliberate choice. The table shows what the album does, what effect it produces on the listener, and what a standard pop song would do instead.</p>
            <div className={styles.defTable}>
                <table>
                    <tbody>
                        <tr>
                            <th>Element</th>
                            <th>What this album does</th>
                            <th>Standard pop does instead</th>
                        </tr>
                        <tr>
                            <td>Chord type</td>
                            <td>Uses 4-note chords (maj7, min7). A 4-note chord is a standard 3-note chord plus one additional note stacked on top. This additional note adds warmth and complexity to the sound.</td>
                            <td className={styles.typ}>Uses 3-note chords (major or minor triads). These sound brighter and simpler.</td>
                        </tr>
                        <tr>
                            <td>Chord progression length</td>
                            <td>Repeats 2 chords for 8 bars or more without changing. The listener hears the same 2 chords loop continuously.</td>
                            <td className={styles.typ}>Moves through 4 chords per 4-bar section, completing a full cycle before repeating.</td>
                        </tr>
                        <tr>
                            <td>Chord resolution</td>
                            <td>
                                The progression does not return to the home chord for at least 8 bars at a time.<br /><br />
                                <strong>How to identify the home chord of a song:</strong> The home chord (also called chord I or the tonic chord) is the chord built on the first note of the key the song is in. To find it: (1) identify the key of the song — this is usually stated in the DAW or can be found by ear as the note where the song feels most &ldquo;settled&rdquo; or complete; (2) build a chord starting on that note. For example, if the song is in the key of D minor, the home chord is Dm (or Dm7). If the song is in C major, the home chord is C (or Cmaj7). Every other chord in the song is measured by how far it is from this home chord. The listener&rsquo;s ear expects the home chord to arrive every 4 bars. This album withholds it for 8+ bars, creating continuous tension.
                            </td>
                            <td className={styles.typ}>The progression ends on the home chord every 4 bars, giving a sense of arrival and rest.</td>
                        </tr>
                        <tr>
                            <td>Melody pitch</td>
                            <td>The sung notes are tuned 10–20 cents below the exact pitch center. One cent = 1/100th of a semitone. The notes are recognisably correct but sit at the lower edge of each pitch. This is a deliberate production choice, not a performance error.</td>
                            <td className={styles.typ}>Vocals are tuned to the exact center of each pitch (0 cents deviation).</td>
                        </tr>
                        <tr>
                            <td>Melody range</td>
                            <td>
                                The melody moves within a span of 5–7 semitones total across the whole song.<br /><br />
                                <strong>Role of octaves:</strong> An octave is a span of 12 semitones. Two notes that are 1 octave apart have the same letter name (e.g. both called C) but one vibrates exactly twice as fast as the other, so they sound like &ldquo;the same note at a different height.&rdquo; A melody range of 5–7 semitones means the melody stays well within a single octave — it never reaches the same-named note at a higher or lower register. Pop melodies that span 12–18 semitones cross at least one full octave and sometimes more, giving them a more dramatic up-and-down shape. Using less than one octave keeps the melody narrow and close together, which contributes to the album&rsquo;s quiet, contained feeling.
                            </td>
                            <td className={styles.typ}>Pop melodies span 12–18 semitones, crossing at least one full octave, which allows for more dramatic high and low points.</td>
                        </tr>
                        <tr>
                            <td>Number of simultaneous layers</td>
                            <td>Maximum 3 layers playing at once (e.g. bass, chord pad, drums). Large portions of the arrangement contain only 1 layer or complete silence.</td>
                            <td className={styles.typ}>Pop productions typically layer 8–15 elements simultaneously: lead vocal, backing vocals, lead synth, pad, bass, kick, snare, hi-hat, percussion, FX, etc.</td>
                        </tr>
                        <tr>
                            <td>Drum sound</td>
                            <td>Uses a drum machine with light harmonic saturation added (see Glossary: Saturation). The kick and snare are quiet relative to the other elements in the mix.</td>
                            <td className={styles.typ}>Drums are mixed loud and bright, often the loudest element in the track.</td>
                        </tr>
                        <tr>
                            <td>Vocal production</td>
                            <td>A second vocal track playing a spoken or murmured version of the lyric is placed underneath the main sung vocal at a volume 15–20 dB below it. It is audible but not clearly intelligible.</td>
                            <td className={styles.typ}>One lead vocal track only. Backing vocals are sung harmonies, not spoken.</td>
                        </tr>
                        <tr>
                            <td>Chord inner voices</td>
                            <td>
                                When moving from one chord to the next, individual notes inside the chord each move by exactly 1 semitone — either 1 semitone up or 1 semitone down — to reach their new position in the next chord. This applies to each individual note separately, not to all notes as a group.<br /><br />
                                To be precise: a 4-note chord has 4 individual notes. In chromatic voice leading, each of those 4 notes moves independently by exactly 1 semitone to become a note in the next chord. Not all 4 notes have to move — some can stay on the same pitch if that pitch also exists in the next chord. The constraint is that any note that does move, moves by exactly 1 semitone, not 2 or more. The key of the chord itself is not what moves by 1 semitone — the individual notes inside it do.
                            </td>
                            <td className={styles.typ}>When chords change, notes jump to their new positions by whatever interval is needed, regardless of how many semitones that spans.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function JamesBlakePanel() {
    return (
        <>
            <p className={styles.albumTitle}>James Blake — Overgrown (2013)</p>
            <p className={styles.albumSub}>Genre: post-dubstep / electronic soul</p>
            <div className={styles.sec}>What this album is built from</div>
            <p className={styles.body}>James Blake trained as a jazz pianist. This album applies jazz harmony to electronic production. The central technique is contrast: very long silences followed by moments where many notes sound simultaneously.</p>
            <div className={styles.defTable}>
                <table>
                    <tbody>
                        <tr>
                            <th>Element</th>
                            <th>What this album does</th>
                            <th>Standard pop does instead</th>
                        </tr>
                        <tr>
                            <td>Chord type</td>
                            <td>
                                Uses suspended chords (sus2, sus4) as the primary chord type throughout the album.<br /><br />
                                <strong>Where in a song suspended chords appear:</strong> In a standard song structure, there are verses, choruses, bridges, and intros/outros. James Blake uses suspended chords at all of these positions — they are not limited to transitions or special moments. They are the default chord type for the entire song. In standard pop, a suspended chord might appear once per song as a brief variation before resolving back to a major or minor chord. In this album, the suspended chord is never resolved — the song begins on a suspended chord and ends on one. The effect is that the song never establishes a clear major or minor emotional quality at any point.
                            </td>
                            <td className={styles.typ}>Major or minor chords appear at all structural positions. Suspended chords are rare, brief, and always resolve back to a major or minor chord within 1–2 beats.</td>
                        </tr>
                        <tr>
                            <td>Chord progression</td>
                            <td>Chords move from one to the next without ever arriving at the home chord. The progression loops indefinitely. The listener&rsquo;s ear expects the home chord to arrive every 4 bars; it does not appear within any 8-bar window.</td>
                            <td className={styles.typ}>The home chord appears at the end of every 4-bar phrase.</td>
                        </tr>
                        <tr>
                            <td>Scale / mode used</td>
                            <td>Uses Dorian mode and Mixolydian mode instead of standard major or minor scale. These modes share most notes with major/minor but differ in 1 note each. The difference causes the harmony to sound ambiguous rather than clearly happy or sad. See Glossary: Mode.</td>
                            <td className={styles.typ}>Uses the standard major scale (happy) or natural minor scale (sad).</td>
                        </tr>
                        <tr>
                            <td>Drum placement</td>
                            <td>The kick drum is placed on beats 1 and 3. The snare is placed on beat 3 only. This creates a half-time feel: the music moves at half the pace of the underlying tempo. The listener&rsquo;s foot taps at half the speed they would expect.</td>
                            <td className={styles.typ}>Kick on beats 1 and 3, snare on beats 2 and 4 — the standard pop/rock pattern.</td>
                        </tr>
                        <tr>
                            <td>Silence duration</td>
                            <td>
                                Sections of complete silence (all audio at 0 dB) last 2–4 full bars between musical events. One bar = 4 beats at the song&rsquo;s tempo.<br /><br />
                                A musical event is any moment where at least one audio layer becomes active: a note played, a chord sounding, a drum hit. A moment is &ldquo;dense&rdquo; when many notes or layers become active simultaneously after a period of silence — for example, a full chord on the piano plus bass plus drums all starting at the same beat after 3 bars of silence. The contrast between 3 bars of silence and 3 simultaneous sounds starting at once is what makes the moment perceptible as dense.
                            </td>
                            <td className={styles.typ}>Silence in pop is used only for brief pauses under 1 beat. The arrangement is continuously filled with active layers.</td>
                        </tr>
                        <tr>
                            <td>Bass frequency range</td>
                            <td>Bass notes exist at frequencies below 80 Hz only. These frequencies are felt as physical vibration in the chest and are not clearly audible as pitched notes. There are no bass notes in the 80–300 Hz range where bass is usually heard as a pitched melodic element.</td>
                            <td className={styles.typ}>Bass plays in the 80–300 Hz range, where the pitch of each note is clearly audible.</td>
                        </tr>
                        <tr>
                            <td>Vocal processing</td>
                            <td>
                                Pitch correction software (Autotune) is applied at a setting that changes the tonal quality of the voice.<br /><br />
                                <strong>What tonal quality (sound character) means:</strong> Every sound source has a tonal quality — a set of properties that make it identifiable as that source. For a human voice, tonal quality includes: the thickness of the sound (whether it sounds full or thin), the breathiness (whether air is audible), and the resonance (where in the body it seems to come from). These properties are determined by the formant frequencies of the vocal tract (see Glossary: Formant). Autotune, when applied at a setting that shifts the formant up by 2–3 semitones, makes the voice sound thinner and less resonant — the notes are still sung at the correct pitch, but the voice no longer sounds like a normal human voice. It sounds like a voice that has been processed, which is the intended effect.
                            </td>
                            <td className={styles.typ}>Autotune is applied transparently to correct pitch errors without altering any other property of the voice.</td>
                        </tr>
                        <tr>
                            <td>Chord motion (parallel motion)</td>
                            <td>
                                <strong>Clarification — are all chords different?</strong> No. In this context, &ldquo;different chords&rdquo; means chords built on different root notes, not chords with different internal structures. For example, Cmaj7 and Dmaj7 are different chords — they are both major 7th chords but built on C and D respectively. They share the same internal structure (root + 3rd + 5th + 7th) but all 4 notes are at different pitches.<br /><br />
                                <strong>Direction in a chord progression:</strong> Each note in a chord has a specific pitch measured in Hz or as a note name. When a chord changes, each individual note must move to a new pitch. &ldquo;Direction&rdquo; refers to whether each note moves to a higher pitch (upward) or a lower pitch (downward). In parallel motion, all notes in the chord move in the same direction — all upward or all downward — and all by the same number of semitones. Example: Cmaj7 (C4 + E4 + G4 + B4) moves to Dmaj7 (D4 + F#4 + A4 + C#5) — every note moved up by exactly 2 semitones. In standard chord movement (contrary or oblique motion), different notes move in different directions or by different amounts.<br /><br />
                                <strong>What the result sounds like:</strong> In parallel motion, the internal distance between all notes stays constant throughout the move. The chord does not change shape — it slides as a fixed block to a new pitch level. This produces a smooth, continuous movement with no note pulling against another, which is described as a floating quality. In standard chord movement, individual notes pull in different directions, which creates the sense that the harmony is actively changing rather than relocating.
                            </td>
                            <td className={styles.typ}>Individual notes in a chord move independently to their new positions when the chord changes, pulling in different directions by different amounts.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function ThundercatPanel() {
    return (
        <>
            <p className={styles.albumTitle}>Thundercat — Drunk (2017)</p>
            <p className={styles.albumSub}>Genre: jazz-funk / lo-fi soul</p>
            <div className={styles.sec}>What this album is built from</div>
            <p className={styles.body}>Stephen Bruner (Thundercat) is a professional session bassist trained in jazz. The album uses the most technically complex chord structures of the three, combined with production techniques that make it sound casual and low-effort.</p>
            <div className={styles.defTable}>
                <table>
                    <tbody>
                        <tr>
                            <th>Element</th>
                            <th>What this album does</th>
                            <th>Standard pop does instead</th>
                        </tr>
                        <tr>
                            <td>Chord extensions</td>
                            <td>Uses chords with 5, 6, or 7 notes: 9th chords, 11th chords, 13th chords. These are built by stacking additional notes above a standard 4-note chord at intervals of a 3rd. A 13th chord contains every note in the 7-note scale playing simultaneously, producing maximum harmonic density.</td>
                            <td className={styles.typ}>Uses 3-note chords (triads) or 4-note chords (7th chords). More notes than this are rare in pop.</td>
                        </tr>
                        <tr>
                            <td>Dominant chord alteration</td>
                            <td>
                                The V chord (the chord that signals the home chord is about to arrive — standard expectation: V is always followed by the home chord I within 1 bar) is given extra notes that clash with each other.<br /><br />
                                <strong>What clashing notes are:</strong> Two notes clash when their frequencies interact in a way that produces a rough, unstable sound. This happens when the frequency ratio between two notes is not a simple whole-number ratio. For example, a note at 440 Hz and a note at 880 Hz have a 1:2 ratio — they sound stable together (this is an octave). A note at 440 Hz and a note at 466 Hz have a ratio close to 15:16 — this is a minor 2nd interval, and the two frequencies interfere with each other rapidly enough to create an audible roughness or beating effect. Two notes that clash when played together are described as dissonant. Adding dissonant notes to the V chord makes the tension before the home chord more intense. The specific added notes are the raised 11th (the standard 11th raised by 1 semitone) and the flattened 9th (the standard 9th lowered by 1 semitone). Both of these sit 1 semitone away from other notes already in the chord, creating dissonance.
                            </td>
                            <td className={styles.typ}>The V chord contains its standard notes only (root, 3rd, 5th, 7th), which create tension without dissonance.</td>
                        </tr>
                        <tr>
                            <td>Tritone substitution</td>
                            <td>Instead of playing the V chord before resolving to I, the chord whose root is 6 semitones away from V is played instead. Both chords share 2 of their 4 notes, so the substitution sounds smooth rather than jarring. The listener&rsquo;s ear expects the V chord (e.g. G7) before the home chord (e.g. C); instead it hears Db7 moving to C.</td>
                            <td className={styles.typ}>The V chord is played directly before the home chord, with no substitution.</td>
                        </tr>
                        <tr>
                            <td>Bass note density</td>
                            <td>The bass plays 16 notes per bar (16th notes) continuously. The bass line also plays notes that are not the root note of the chord — it plays the 3rd, 7th, or 9th of the chord, and chromatic passing notes (notes 1 semitone below the next target note, played briefly in transit).</td>
                            <td className={styles.typ}>Bass plays 1–2 notes per beat (4–8 per bar), landing mostly on the root note of each chord.</td>
                        </tr>
                        <tr>
                            <td>Phrase length</td>
                            <td>Musical phrases are 5 or 7 bars long rather than the standard 4 or 8. The listener&rsquo;s ear expects a resolution or repeat at bar 4 or bar 8; instead it arrives 1–3 bars later than expected.</td>
                            <td className={styles.typ}>Phrases are exactly 4 or 8 bars long, which is the most common structure in Western popular music.</td>
                        </tr>
                        <tr>
                            <td>Polyrhythm</td>
                            <td>
                                The bass and drums divide the bar into different-sized groups simultaneously.<br /><br />
                                <strong>What rhythmic groupings are:</strong> In standard 4/4 time, a bar contains 12 evenly spaced 16th-note positions (if you subdivide each beat into 3) or 16 positions (if you subdivide each beat into 4). A rhythmic grouping is a decision about how many of those positions form one repeating unit before the pattern starts over.<br /><br />
                                Example at 12 positions per bar: if the bass groups positions into sets of 3, it accents positions 1, 4, 7, 10 — that is 4 accents per bar, evenly spaced. If the drums simultaneously group positions into sets of 4, they accent positions 1, 5, 9 — that is 3 accents per bar. Both instruments play over the same 12 positions in the same bar, but their accents land on different positions because their grouping sizes differ. The two patterns align on position 1 (the downbeat) every bar. At all other positions within the bar, one instrument&rsquo;s accent falls where the other has no accent. This is polyrhythm: two different groupings operating simultaneously over the same time span.
                            </td>
                            <td className={styles.typ}>Bass and drums use the same grouping size so their accents land on the same positions simultaneously.</td>
                        </tr>
                        <tr>
                            <td>Song duration</td>
                            <td>Most tracks are 60–120 seconds long. A musical idea is introduced, developed for 1–2 sections, then the track ends. There is no second verse, chorus, or bridge.</td>
                            <td className={styles.typ}>Pop songs are typically 3–4 minutes with verse, pre-chorus, chorus, bridge structure.</td>
                        </tr>
                        <tr>
                            <td>Production quality</td>
                            <td>The production uses low-resolution audio samples, vinyl surface noise (audible crackling from analogue playback), and minimal processing on the mix. The technical complexity of the playing contrasts with the low-fidelity production aesthetic. This is deliberate.</td>
                            <td className={styles.typ}>Production is high-fidelity: clean samples, no noise, heavy processing and polishing on every element.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function SynthesisPanel() {
    return (
        <>
            <p className={styles.albumTitle}>Making music that combines all three</p>
            <p className={styles.albumSub}>A step-by-step specification you can follow</p>

            <div className={styles.sec}>Shared properties across all three albums</div>
            <p className={styles.body}>These five properties appear in all three albums. Replicating all five is the minimum requirement to produce music that sounds like a blend of these artists.</p>

            <div className={styles.dnaRow}><div className={styles.dot} /><div><strong>4-note chords minimum.</strong> Every chord must have at least 4 notes (a 7th chord). 3-note chords are not used. Standard pop uses triads as its default.</div></div>
            <div className={styles.dnaRow}><div className={styles.dot} /><div><strong>No home chord within an 8-bar window.</strong> The home chord does not appear for at least 8 bars at a time. The listener&rsquo;s ear expects it every 4 bars; withholding it for 8+ bars creates persistent tension.</div></div>
            <div className={styles.dnaRow}><div className={styles.dot} /><div><strong>Maximum 3 simultaneous audio layers.</strong> At no point do more than 3 layers play at the same time. Standard pop uses 8–15 simultaneous layers.</div></div>
            <div className={styles.dnaRow}><div className={styles.dot} /><div><strong>Slow attack on all sustained sounds.</strong> Pads, bass, and any sustained instrument use an attack time of 80–200 ms. Standard pop uses 0–10 ms attacks on most elements.</div></div>
            <div className={styles.dnaRow}><div className={styles.dot} /><div><strong>At least 1 bar of silence per 8-bar section.</strong> Remove all audio from at least 1 complete bar in every 8-bar phrase. Standard pop fills every bar continuously.</div></div>

            <hr className={styles.divider} />
            <div className={styles.sec}>Step-by-step build instructions</div>

            <ol className={styles.stepList}>
                <li><div><strong>Set tempo.</strong> Set your DAW tempo to 80–95 BPM. All three albums operate in this range. Standard pop is typically 100–140 BPM.</div></li>
                <li><div><strong>Choose a key and build your base chord.</strong> Pick any key. Build a min7 chord on the 2nd degree of that key. Example in C major: 2nd degree = D, so Dm7 = D + F + A + C.</div></li>
                <li><div><strong>Add a second chord.</strong> Build a min7 chord on the 6th degree. Example in C major: Am7 = A + C + E + G. Loop Dm7 → Am7 for 8 bars. Do not add the home chord yet.</div></li>
                <li><div><strong>Add a bass line.</strong> Play the root note of each chord on beat 1. Add the 7th of the chord on beat 3. Play nothing on beats 2 and 4. Standard pop bass plays on every beat; this plays on only 2 of 4 beats.</div></li>
                <li><div><strong>Program a drum pattern.</strong> Kick on beat 1 only. Snare on beat 3 only. Hi-hat 16th notes (4 per beat) but remove hi-hat on beats 1 and 3. Apply swing at 58% in your DAW. Standard pop places snare on both beats 2 and 4.</div></li>
                <li><div><strong>Remove all audio from bar 7 of every 8-bar loop.</strong> Set all track volumes to 0 dB on bar 7. Nothing plays. Resume on bar 8.</div></li>
                <li><div><strong>Add a pad.</strong> Trigger your 2-chord vamp as a pad with attack time 120 ms and release time 800 ms. Volume: 6–8 dB below the bass level.</div></li>
                <li><div><strong>Write a melody.</strong> Restrict melody notes to the 3rd, 5th, or 7th of the current chord. Do not use the root note as a landing note. Keep the total pitch span under 8 semitones (less than one octave). Standard pop melodies frequently land on the root note and cross 12–18 semitones.</div></li>
                <li><div><strong>Apply light saturation to the drum bus.</strong> Drive setting: 10–15%. Standard pop uses clean, unprocessed drum sounds.</div></li>
                <li>
                    <div>
                        <strong>Adding a Thundercat-style 16th-note bass section.</strong> To include a section where the bass plays 16 notes per bar continuously (like Thundercat), structure it as a distinct section of the arrangement rather than replacing the sparse bass throughout. Here is how to construct it:
                        <br />(a) Choose a 4-bar or 8-bar section — for example, the second half of a verse or a dedicated instrumental break.
                        <br />(b) In this section, replace the sparse bass pattern (root on beat 1, 7th on beat 3) with a continuous 16th note pattern. At 80 BPM, one 16th note = 0.1875 seconds. You are placing a bass note at each of these 16 positions per bar.
                        <br />(c) Build the 16th note pattern for one bar of Dm7 using this rule: beat 1 = D (root). Beats 2–4 of that first beat group = choose notes from the chord (F, A, or C) or chromatic passing notes (one note that is 1 semitone below the next target note, held for exactly one 16th note duration before the target). Continue filling all 16 positions. The pattern does not need to be melodically complex — Thundercat often repeats a 2–4 note motif within the bar.
                        <br />(d) At the end of the Thundercat-style section, return to the sparse bass pattern. The contrast between the dense 16th note section and the sparse sections on either side is part of the effect. Thundercat uses this contrast within the same track — dense sections last 4–8 bars, then the arrangement pulls back.
                    </div>
                </li>
                <li><div><strong>Add the 9th to each chord (optional — Thundercat direction).</strong> Add the 9th of each chord to your pad voicing. The 9th = the same note as the 2nd degree of the scale, played one octave higher than the root. Example: in Dm7, the 9th is E (one octave above the E that is the 2nd of the D scale).</div></li>
            </ol>

            <div className={styles.sec}>Parameter reference table</div>
            <div className={styles.defTable}>
                <table>
                    <tbody>
                        <tr>
                            <th>Parameter</th>
                            <th>Target value for this blend</th>
                            <th>Standard pop value</th>
                        </tr>
                        <tr><td>Tempo</td><td>80–95 BPM</td><td className={styles.typ}>100–140 BPM</td></tr>
                        <tr><td>Minimum notes per chord</td><td>4 (7th chord)</td><td className={styles.typ}>3 (triad)</td></tr>
                        <tr><td>Bars before home chord appears</td><td>8+ bars</td><td className={styles.typ}>4 bars</td></tr>
                        <tr><td>Max simultaneous layers</td><td>3</td><td className={styles.typ}>8–15</td></tr>
                        <tr><td>Pad attack time</td><td>80–200 ms</td><td className={styles.typ}>0–10 ms</td></tr>
                        <tr><td>Silence per 8-bar phrase</td><td>1 full bar</td><td className={styles.typ}>0 bars</td></tr>
                        <tr><td>Drum swing</td><td>55–65%</td><td className={styles.typ}>50% (straight)</td></tr>
                        <tr><td>Snare placement</td><td>Beat 3 only (half-time)</td><td className={styles.typ}>Beats 2 and 4</td></tr>
                        <tr><td>Bass notes per bar</td><td>2 (beats 1 and 3)</td><td className={styles.typ}>4–8</td></tr>
                        <tr><td>Melody pitch span</td><td>Under 8 semitones (under 1 octave)</td><td className={styles.typ}>12–18 semitones (1–1.5 octaves)</td></tr>
                        <tr><td>Drum bus saturation drive</td><td>10–15%</td><td className={styles.typ}>0%</td></tr>
                        <tr><td>Vocal pitch offset</td><td>10–20 cents flat</td><td className={styles.typ}>0 cents (exact pitch)</td></tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function GlossaryPanel() {
    const terms = [
        { term: 'Semitone', def: 'The smallest pitch step in Western music. On a piano: the distance between any two adjacent keys including black keys. On a guitar: the distance between two adjacent frets.', eg: 'C to C# = 1 semitone. C to D = 2 semitones.' },
        { term: 'Cent', def: '1/100th of a semitone. Used to measure small deviations from exact pitch. A note at −20 cents is 20/100 of a semitone below the exact pitch center.' },
        { term: 'Octave', def: 'A span of exactly 12 semitones. Two notes an octave apart share the same letter name but one vibrates exactly twice as fast as the other. They are perceived as the same pitch at different heights.', eg: 'C3 = 261 Hz, C4 = 522 Hz — these are 1 octave apart.' },
        { term: 'Triad', def: 'A 3-note chord built by stacking notes from the scale separated by intervals of a 3rd. The default chord type in pop music.', eg: 'C major triad = C + E + G.' },
        { term: '7th chord (min7, maj7)', def: 'A 4-note chord — a triad plus the 7th degree of the scale above the root.', eg: 'Cmaj7 = C + E + G + B. Dm7 = D + F + A + C.' },
        { term: '9th / 11th / 13th chord', def: 'Extended chords built by adding more notes above a 7th chord. The 9th is 2 semitones above the octave of the root. The 11th is 2 semitones above the 9th. The 13th is 2 semitones above the 11th. A 13th chord has 7 notes total.' },
        { term: 'Root note', def: 'The note a chord is named after. The first and lowest note of a chord in its standard position.', eg: 'In Dm7, D is the root.' },
        { term: 'Home chord (chord I / tonic)', def: 'The chord built on the 1st note of the key the song is in. This is the most stable chord in the key. To identify it: find the key of the song (stated in DAW, or the note where the song sounds most settled), then build a chord starting on that note. All other chords in the song create tension relative to this chord.', eg: 'Key of C major → home chord = C (or Cmaj7). Key of D minor → home chord = Dm (or Dm7).' },
        { term: 'Chord V (dominant)', def: 'The chord built on the 5th degree of the key. Creates strong tension. Standard expectation: chord V is always followed by the home chord I within 1 bar.', eg: 'In C major: chord V = G7.' },
        { term: 'Resolution', def: 'When a chord progression arrives at the home chord (chord I), releasing accumulated tension. Standard pop resolves every 4 bars.' },
        { term: 'Dissonance (clashing notes)', def: 'Two notes are dissonant when their frequencies interact to produce a rough, unstable sound. This occurs when the frequency ratio between the two notes is not a simple whole-number ratio. Notes that are 1 semitone apart are maximally dissonant. Notes that are 7 semitones apart (a 5th) are maximally consonant (stable).', eg: 'C + C# = dissonant (1 semitone apart, ratio ≈ 15:16). C + G = consonant (7 semitones apart, ratio = 2:3).' },
        { term: 'Suspended chord (sus2, sus4)', def: 'A chord where the 3rd is replaced. In sus2, the 3rd is replaced by a note 2 semitones above the root. In sus4, the 3rd is replaced by a note 5 semitones above the root. Without the 3rd, the chord has no major or minor quality.', eg: 'Csus2 = C + D + G. Csus4 = C + F + G.' },
        { term: 'Parallel motion', def: 'When all notes in a chord move to the next chord by the same number of semitones in the same direction (all up or all down). The internal structure of the chord does not change — it relocates as a fixed block.', eg: 'Cmaj7 → Dmaj7 = all 4 notes move up 2 semitones. This is parallel motion.' },
        { term: 'Chromatic voice leading', def: 'A technique where each individual note in a chord moves by exactly 1 semitone (up or down) to reach its new position in the next chord. Each note moves independently. Notes that exist in both chords can stay on the same pitch (0 movement). No note moves by more than 1 semitone.' },
        { term: 'Rhythmic grouping', def: 'The number of evenly-spaced time positions that form one repeating unit in a rhythm before the accent pattern restarts. In a bar of 12 positions: grouping of 3 = accents on positions 1, 4, 7, 10. Grouping of 4 = accents on positions 1, 5, 9. Two instruments using different grouping sizes over the same bar produce polyrhythm.' },
        { term: 'Polyrhythm', def: 'Two instruments simultaneously using different rhythmic groupings over the same bar. Their accents land on different positions within the bar. They re-align on the first beat of the bar (the downbeat).', eg: 'Bass groups in 3, drums group in 4, over 12 positions: bass accents 1,4,7,10 — drums accent 1,5,9. They share only position 1.' },
        { term: 'Vamp', def: 'A short chord progression (1–2 chords) that repeats continuously for many bars without changing. The harmonic foundation of a section.' },
        { term: 'Half-time feel', def: 'A drum pattern where the snare is placed on beat 3 only instead of beats 2 and 4. Makes the music feel as if it moves at half the speed of the actual tempo.' },
        { term: 'Swing (rhythmic)', def: 'A DAW setting that delays every other 16th note slightly behind its exact grid position. 50% = no swing (all notes on the grid). 58% = moderate swing. 66% = maximum swing. Values above 50% make the rhythm feel looser and more human.' },
        { term: 'Attack time', def: 'The time in milliseconds it takes for a sound to go from silence (0 dB) to its full volume after being triggered. 0–10 ms = sharp, immediate onset. 80–200 ms = gradual fade-in over roughly 0.1–0.2 seconds.' },
        { term: 'Saturation', def: 'An audio processing effect that adds harmonic distortion at low levels. Produces warmth and density without audible distortion. Controlled by a drive parameter: 10–15% adds warmth; above 30% introduces audible distortion.' },
        { term: 'Formant', def: 'The resonant frequency peaks of the vocal tract that define the tonal quality of vowel sounds. Shifting the formant up by 2–3 semitones (while keeping the pitch the same) makes the voice sound thinner, less resonant, and less like a natural human voice. This is the processing James Blake applies.' },
        { term: 'Tonal quality (sound character)', def: 'The set of measurable properties that make a sound identifiable as a particular source: its frequency spectrum (which frequencies are present and at what levels), its harmonic content (which overtones are present), and its dynamic envelope (how the volume changes over time). Changing the formant of a voice changes its tonal quality without changing its pitch.' },
        { term: 'Mode (Dorian / Mixolydian)', def: 'A 7-note scale derived from the major scale by starting on a different degree. Dorian: start on the 2nd degree of the major scale — sounds like minor with a raised 6th. Mixolydian: start on the 5th degree — sounds like major with a lowered 7th. Both produce ambiguous harmony that is neither clearly happy nor clearly sad.' },
        { term: 'Tritone substitution', def: 'Replacing the V chord with the chord whose root is 6 semitones away from V. Both chords share the same 3rd and 7th notes (swapped). The substitution resolves smoothly to the home chord because the shared notes create continuity. Standard expectation: V chord precedes the home chord. The tritone substitute replaces V while still resolving to I.' },
        { term: 'DAW', def: 'Digital Audio Workstation. Software used to record, arrange, and produce music.', eg: 'Examples: Ableton Live, Logic Pro, FL Studio, GarageBand.' },
        { term: 'dB (decibel)', def: 'The unit of measurement for audio volume. 0 dB = the maximum level before distortion in digital audio. Each reduction of 6 dB halves the perceived loudness.' },
        { term: 'BPM', def: 'Beats Per Minute. The tempo of a song.', eg: '80 BPM = 80 beats in 60 seconds.' },
        { term: '16th notes', def: 'A rhythmic subdivision. In standard 4/4 time there are 4 beats per bar. Each beat subdivides into 4 equal 16th notes, giving 16 total per bar.' },
        { term: 'Musical event', def: 'Any moment in a song where at least one audio layer becomes active: a note played, a chord sounding, a drum hit. A dense musical event is a moment where multiple layers become active simultaneously, especially after a period of silence.' },
    ];

    return (
        <>
            <p className={styles.albumTitle}>Glossary</p>
            <p className={styles.albumSub}>Definitions for every term used in this guide</p>
            <div className={styles.glosGrid}>
                {terms.map(({ term, def, eg }) => (
                    <div key={term} className={styles.gcard}>
                        <p className={styles.gcardTerm}>{term}</p>
                        <p className={styles.gcardDef}>{def}</p>
                        {eg && <p className={styles.gcardEg}>{eg}</p>}
                    </div>
                ))}
            </div>
        </>
    );
}

const panels: Record<TabId, React.ReactNode> = {
    bo: <BloodOrangePanel />,
    jb: <JamesBlakePanel />,
    tc: <ThundercatPanel />,
    syn: <SynthesisPanel />,
    gl: <GlossaryPanel />,
};

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabId>('bo');

    return (
        <div className={styles.wrap}>
            <h1>Automusicology</h1>
            <div className={styles.tabs}>
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        className={`${styles.tab} ${activeTab === id ? styles.active : ''}`}
                        onClick={() => setActiveTab(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {panels[activeTab]}
        </div>
    );
}
