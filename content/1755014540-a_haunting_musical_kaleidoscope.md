###### 8-12-2025
# A Haunting Musical Kaleidoscope
Do you remember kaleidoscopes? 

A small twist of the tube, and the colored shapes inside would form a brand-new pattern. The pieces didn’t change — only their arrangement did — yet the results could be beautiful, strange, or chaotic.

Well, I took out my Moog Subharmonicon from storage and wow... this is a messy kaleidoscope of sound! 

The Subharmonicon is a difficult piece of audio that works in a similar way to kaleidoscope, but with sound instead of glass. It takes one note and splits it into other related notes, using math instead of mirrors. Then, just like twisting a kaleidoscope, you can turn knobs and change the patterns, creating music that’s always moving.

## What Are Subharmonics?
Just as the kaleidoscope's mirrors create visual harmonies and patterns through geometric relationships, subharmonics create sonic harmonies through mathematical frequency divisions. Both transform simple inputs into complex, mesmerizing outputs that feel both orderly and organic at the same time.

You have to learn how different subharmonic intervals interact with each other. Some divisor combinations create rich, consonant textures, while others clash in ways that might be theoretically fascinating but harsh to listen to. Then there's the challenge of the dual sequencers running at different speeds - you need to develop a sense of when those polyrhythmic cycles align in musically meaningful ways versus when they're just creating random-sounding chaos. 

But let's stay on track and talk about polyrhythms on another day.

If we start with A4 = 440 Hz:
```
Division	Frequency	Note Name	Sound Quality
÷2	220 Hz	A3	Perfect octave down ✅
÷3	146.67 Hz	Between D3 & D#3	Slightly flat, unusual
÷4	110 Hz	A2	Two octaves down ✅
÷6	73.33 Hz	Between D2 & D#2	Flat fifth, moody
```

I hope you notice the weird notes between the whole ones. These “in-between” notes create a unique, sometimes haunting sound. Quantization helps keep the main notes in tune. But the subharmonics are still pure math divisions — which means some will never match standard piano notes exactly. For those of us accustumed to western sounds, you will find these notes crashing with your reality.

Moog gives us a way to better deal with these "off-sounding" notes. The Subharmonicon has a QUANTIZE button that snaps the main oscillators to a specific scale:
- 12-ET – Standard 12-note equal temperament
- 8-ET – Equal-tempered diatonic scale
- 12-JI – 12-note just intonation
- 8-JI – Just intonation diatonic scale
- Off – Free tuning

## Perfect only goes so far
If you think the headaches are over, think again.

The farther you divide, the stranger the note will sound. For example, ÷7 or ÷11 will land in microtonal spaces between familiar notes. Your ear, trained to expect equal temperament, hears these as “out of tune.” 

```
C4     = On a key
÷2     = On a key
÷3     = Between keys
÷4     = On a key
÷5     = Between keys
÷6     = Between keys
```

Well, that haunting noice is a fundamental limitation of how subharmonic division works in practice! 

## The Mathematical Reality:
When you divide a frequency by larger integers, you get intervals that fall increasingly between the notes of standard scales - even just intonation scales. For example:
Starting with C4 (261.63Hz):

```
÷2 = C3 (perfect octave down) ✓
÷3 = F2 (slightly flat fifth down) ✓ mostly OK
÷4 = C2 (perfect two octaves down) ✓
÷5 = G#1 (very flat major third down) ❌ sounds "off"
÷6 = F1 (flat fifth, two octaves down) ⚠️
÷7 = Bb0 (very flat minor seventh down) ❌ sounds very wrong
÷8 = C1 (perfect three octaves down) ✓
```

### Why Quantization Can't Fix This:
The quantization affects your fundamental frequencies (the VCO FREQ knobs), but the subharmonic divisions are always pure mathematical ratios of whatever fundamental you set. Quantization doesn't change the division math - it just makes sure your starting pitches are in-tune.
The "Out of Tune" Effect Gets Worse Because:

Higher division numbers create intervals that have no equivalent in 12-tone scales
÷7, ÷11, ÷13, etc. create microtonal intervals that sound "wrong" to Western-trained ears
The beating between these "off" pitches and your expectations becomes more pronounced

This is actually why developing an ear for the Subharmonicon takes practice - you're learning to work with harmonic relationships that don't exist in conventional instruments!

Like turning a kaleidoscope, learning the Subharmonicon takes patience. You have to:
- Find combinations of subharmonics that sound good together
- Work with the natural beating and tension between notes
- Use the built-in polyrhythmic sequencers to make evolving patterns
- Accept that “weird” can be beautiful

## Final Thoughts
The Moog Subharmonicon isn’t about making safe, familiar music. It’s about exploring new sound worlds, where math, rhythm, and tone come together in unexpected ways. [I wrote a quick JS tool to demo these subharmonics](https://renfoc.us/tools/subharmonics). I hope it paints a better picture than a description.

Sometimes you’ll find a perfect, sweet spot. Other times you’ll stumble into strange, alien chords. Either way, this Moog might go back to storage if I can't find a pretty pattern soon. 