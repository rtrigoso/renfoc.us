'use client';

import { useState } from "react";
import CheckList from "@/composites/CheckList";
import styles from './page.module.css';

export default function Page() {
    const [clearKey, setClearKey] = useState(0);

    function handleClear() {
        Object.keys(localStorage)
            .filter(k => k.startsWith('checklist-'))
            .forEach(k => localStorage.removeItem(k));
        setClearKey(k => k + 1);
    }

    function cl(prefix: string, items: string[]) {
        return <CheckList key={`${clearKey}-${prefix}`} prefix={prefix} items={items} />;
    }

    return (
        <article className={styles.page}>
            <h2>Personal Exercise Plan</h2>

            <p>
                <strong>Goal:</strong> Get healthier, fitter, reduce belly width, improve mobility and balance<br />
                <strong>Equipment:</strong> 2 dip bars · Heavy kettlebell · Indoor cycling machine · Exercise bands<br />
                <strong>Notes:</strong> All workouts are indoor (pollen allergies). Weekday mornings use the Adderall focus window. Knee-safe and shoulder-safe progressions throughout.
            </p>

            <hr />

            <h3>Weekly Overview</h3>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Focus</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Monday</td><td>Cardio + Core</td><td>~50 min</td></tr>
                    <tr><td>Tuesday</td><td>Upper Body + Shoulder Mobility</td><td>~55 min</td></tr>
                    <tr><td>Wednesday</td><td>Balance + Flexibility + Light Cardio</td><td>~50 min</td></tr>
                    <tr><td>Thursday</td><td>Kettlebell + Intervals + Core</td><td>~60 min</td></tr>
                    <tr><td>Friday</td><td>Full Body Calisthenics + Cardio</td><td>~60 min</td></tr>
                    <tr><td>Saturday</td><td>Active Recovery + Mobility</td><td>~55 min</td></tr>
                    <tr><td>Sunday</td><td>Full Rest</td><td>—</td></tr>
                </tbody>
            </table>

            <hr />


            <h3>Monday — Cardio + Core</h3>
            <blockquote><strong>Adderall morning</strong> — use your focus window here.</blockquote>

            <h4>1. Indoor Cycling — 15–20 min</h4>
            {cl("mon-cycling", [
                "Low resistance, comfortable pace — no grinding",
                "Seat height: knee at ~10° bend at the bottom of the pedal stroke",
                "Goal: light sweat, elevated breathing, not gasping",
            ])}
            <p><em>Build toward 30 min over 4–6 weeks. Cycling is great for the knee — builds quad strength without joint impact.</em></p>

            <h4>2. Dip Bar Core Circuit — 3 rounds</h4>
            {cl("mon-dipbar", [
                "Hanging knee raises — 8–12 reps",
                "Support hold (body up, legs hanging) — 10–20 sec",
                "Slow knee tucks — 6–10 reps (progress toward L-sit over time)",
            ])}
            <p><em>Rest 60–90 sec between rounds. These build deep core strength that reduces belly width.</em></p>

            <h4>3. Floor Core — 10 min</h4>
            {cl("mon-floor", [
                "Dead bug — 3×8 each side (spine-safe, no knee stress)",
                "Forearm plank hold — 3×15–30 sec",
                "Glute bridge — 3×12 (builds hip stability, supports the knee)",
            ])}

            <h4>4. Band Cooldown — Shoulder & Hip — 5 min</h4>
            {cl("mon-band", [
                "Band pull-aparts — 2×15",
                "Band hip abduction — 2×15 each side (loop around knees, seated or lying)",
            ])}

            <p><strong>TV-time add-ons:</strong> Seated leg raises · Ankle circles · Calf raises while standing</p>

            <hr />


            <h3>Tuesday — Upper Body + Shoulder Mobility</h3>
            <blockquote><strong>Adderall morning</strong> — use your focus window here.</blockquote>

            <h4>1. Shoulder Mobility — Bands — 10 min <em>(do this first!)</em></h4>
            {cl("tue-shoulder", [
                "Band pull-aparts — 3×15 (hold band at shoulder width, pull apart)",
                "Band shoulder dislocates — 3×10 (wide grip, slow arc overhead)",
                "Band face pulls — 3×15 (anchor high, pull toward ears)",
            ])}
            <p><em>Always do these BEFORE any pushing work. Over weeks they open your shoulders and reduce injury risk with dips.</em></p>

            <h4>2. Dip Bar Pushing Circuit — 3 rounds</h4>
            {cl("tue-dipbar", [
                "Incline push-up on bars — 8–15 reps",
                "Assisted dips (feet lightly on floor) — 5–10 reps",
                "Band-assisted row (anchor band to bar, lean back and row) — 10–12 reps",
                "Hanging knee raises — 8 reps",
            ])}
            <p><em>Skip full dips until shoulder mobility improves. Feet on floor is the shoulder-safe regression.</em></p>

            <h4>3. Cycling Cooldown — 10 min easy</h4>
            {cl("tue-cycling", [
                "Minimal resistance — flush out muscle fatigue from the circuit",
                "Focus on slow, even breathing to bring heart rate down",
            ])}

            <h4>4. Chest & Shoulder Stretch — 5 min</h4>
            {cl("tue-stretch", [
                "Doorway chest stretch — 3×30 sec per side",
                "Cross-body shoulder stretch — 3×20 sec per side",
                "Cat-cow — 10 slow reps",
            ])}

            <p><strong>TV-time add-ons:</strong> Band pull-aparts · Shoulder rolls · Neck tilts</p>

            <hr />


            <h3>Wednesday — Balance + Flexibility + Light Cardio</h3>
            <blockquote><strong>Adderall morning</strong> — use your focus window here.</blockquote>

            <h4>1. Cycling Warmup — 10 min easy</h4>
            {cl("wed-cycling", [
                "Low resistance, just warming joints and getting blood moving",
                "This is a recovery/mobility day — don't push the pace",
            ])}

            <h4>2. Balance Training — 10 min <em>(use dip bar as safety rail)</em></h4>
            {cl("wed-balance", [
                "Single-leg stand — 3×20 sec each side (touch bar only if losing balance)",
                "Heel-to-toe walk — 3 lengths of the room, slow and controlled",
                "Weight shift side to side — 2×10 slow reps (builds ankle proprioception)",
                "Single-leg mini bend — 3×8 each side, very shallow (knee-safe balance challenge)",
            ])}
            <p><em>Goal over weeks: touch the bar less and less. Bad balance responds well to consistent daily practice.</em></p>

            <h4>3. Flexibility Flow — 20 min</h4>
            {cl("wed-flex", [
                "Couch hip flexor stretch — 2×45 sec each side",
                "Supine hamstring band stretch — 3×30 sec each leg",
                "Seated forward fold attempt — 3×30 sec (hinge at hips, back straight — reach only as far as comfortable)",
                "Figure-4 piriformis stretch — 2×30 sec each side",
                "Thoracic rotation — 10 reps per side",
                "Band shoulder dislocates — 2×10 (reinforce Tuesday's shoulder work)",
            ])}
            <p><em>Hip flexor work here also reduces belly prominence caused by anterior pelvic tilt — a common issue in people who sit all day.</em></p>

            <h4>4. Band Leg & Ankle Circuit — 10 min</h4>
            {cl("wed-band", [
                "Band clamshells — 2×15 each side (lying, loop around knees)",
                "Band standing hip abduction — 2×12 each side (hold dip bar for balance)",
                "Ankle alphabet — trace A–Z with each foot (improves ankle stability)",
            ])}

            <p><strong>TV-time add-ons:</strong> Hip circles (seated) · Foot rolls · Wrist circles</p>

            <hr />


            <h3>Thursday — Kettlebell + Intervals + Core</h3>
            <blockquote><strong>Adderall morning</strong> — use your focus window here.</blockquote>

            <h4>1. Kettlebell Circuit — 3–4 rounds</h4>
            {cl("thu-kb", [
                "Kettlebell deadlift — 8 reps (hip hinge, flat back, minimal knee bend)",
                "Kettlebell swing — 12–15 reps (explosive hip drive — top belly-burner in this plan)",
                "Goblet squat — 8 reps, shallow depth only (stop before knee discomfort)",
                "Farmer carry — 20 steps back and forth holding the bell",
            ])}
            <p><em>Master the deadlift hip hinge before swinging heavy. The swing is safe and powerful once your hinge pattern is solid.</em></p>

            <h4>2. Cycling Intervals — 20 min</h4>
            {cl("thu-cycling", [
                "5 min easy warmup",
                "6× [1 min moderate push / 1 min easy recovery]",
                "3 min easy cooldown",
            ])}
            <p><em>Intervals burn significantly more calories than steady-state riding. Build to 2 min pushes as fitness improves.</em></p>

            <h4>3. Dip Bar Core Finisher — 2–3 rounds</h4>
            {cl("thu-dipbar", [
                "Hanging knee raises — 10 reps",
                "Support hold — 15–20 sec",
                "Slow knee tucks — 8 reps",
            ])}
            <p><em>After a tough kettlebell and cycling block, keep reps at the lower end here.</em></p>

            <h4>4. Post-Session Stretch — 5–8 min</h4>
            {cl("thu-stretch", [
                "Glute bridge hold — 30 sec (decompresses the lower back after swings)",
                "Child's pose — 45 sec",
                "Hip flexor stretch — 30 sec each side",
            ])}

            <p><strong>TV-time add-ons:</strong> Glute squeezes · Band hip abductions · Seated posture holds</p>

            <hr />


            <h3>Friday — Full Body Calisthenics + Cardio</h3>
            <blockquote><strong>Adderall morning</strong> — use your focus window here.</blockquote>

            <h4>1. Cycling Warmup — 10 min easy</h4>
            {cl("fri-cycling", [
                "Steady, low resistance — warm the joints before calisthenics",
            ])}

            <h4>2. Shoulder Prep — Bands — 5 min <em>(never skip this on calisthenics days)</em></h4>
            {cl("fri-shoulder", [
                "Band pull-aparts — 2×15",
                "Band face pulls — 2×12",
            ])}

            <h4>3. Dip Bar Full Circuit — 4 rounds</h4>
            {cl("fri-dipbar", [
                "Push-ups on bars — 10–20 reps",
                "Hanging knee raises — 10–15 reps",
                "Assisted dips — 6–10 reps",
                "Support hold — 15–25 sec",
                "Step-back lunge (hold bar for balance) — 8 reps each leg",
            ])}
            <p><em>Step-back lunges are knee-safer than forward lunges. Use the bar for balance until confident doing them freestanding.</em></p>

            <h4>4. Light Kettlebell Finisher — 2 rounds</h4>
            {cl("fri-kb", [
                "Kettlebell swing — 10 reps",
                "Kettlebell deadlift — 6 reps",
            ])}

            <h4>5. Weekend Prep Stretch — 10 min</h4>
            {cl("fri-stretch", [
                "Full body light stretch — hips, chest, hamstrings, shoulders",
                "Hold each position 20–30 sec, breathe slowly",
            ])}

            <p><strong>TV-time add-ons:</strong> Couch leg holds · Deep breathing · Neck stretches</p>

            <hr />


            <h3>Saturday — Active Recovery + Mobility</h3>

            <h4>1. Optional Easy Cycling — 15–20 min</h4>
            {cl("sat-cycling", [
                "Very low resistance — only if you feel good, skip if fatigued",
                "Put on something you like — make it feel like leisure",
            ])}

            <h4>2. Full Mobility Session — 20–25 min</h4>
            {cl("sat-mobility", [
                "Cat-cow — 10 slow reps with full breathing",
                "Child's pose — 60 sec",
                "Hip 90/90 stretch — 45 sec each side",
                "Couch hip flexor stretch — 60 sec each side",
                "Band shoulder pass-throughs — 15 reps",
                "Supine hamstring band stretch — 45 sec each leg",
                "Thoracic rotation — 10 per side",
            ])}
            <p><em>Put on a show or podcast. Saturday mobility sessions compound into real flexibility gains over months.</em></p>

            <h4>3. Balance Practice — 10 min</h4>
            {cl("sat-balance", [
                "Single-leg stand — 3×20 sec each side (use dip bar as needed)",
                "Heel-to-toe walk — 3 lengths",
                "Eyes-closed single-leg stand — 3×10 sec (hold dip bar nearby — advanced)",
            ])}
            <p><em>Eyes-closed balance work dramatically accelerates proprioception gains.</em></p>

            <h4>4. Band Shoulder + Hip Session — 10 min</h4>
            {cl("sat-band", [
                "Band pull-aparts — 2×20",
                "Band face pulls — 2×15",
                "Band clamshells — 2×15 each side",
                "Ankle alphabet — each foot",
            ])}
            <p><em>Higher rep, zero intensity — this is pure joint health maintenance.</em></p>

            <p><strong>TV-time add-ons:</strong> Sit on floor instead of couch · Passive hip opener · Calf stretches</p>

            <hr />


            <h3>Sunday — Full Rest</h3>

            <h4>Rest & Sleep Focus</h4>
            {cl("sun-rest", [
                "Genuine rest — muscles rebuild on rest days, not workout days",
                "Use your CPAP every night — quality sleep is when fat is metabolized and muscle is built",
                "Hydrate throughout the day — even mild dehydration tanks energy and recovery",
            ])}
            <blockquote>Your sleep apnea is silently holding back your progress if untreated. Even this plan will feel much easier once you&apos;re getting real restorative sleep.</blockquote>

            <h4>Gaming / TV — Micro-moves</h4>
            {cl("sun-micro", [
                "Every 45–60 min of sitting: stand and do 10 calf raises",
                "Between game sessions: 5 shoulder rolls + 5 neck tilts",
                "Loading screens / ads = stand up and shift your weight",
            ])}
            <p><em>Breaking up sitting with tiny moves significantly reduces belly fat accumulation over time, even on rest days.</em></p>

            <hr />

            <button className={styles.clearButton} onClick={handleClear}>clear</button>


            <h3>Key Notes</h3>

            <p><strong>On your belly:</strong> Spot reduction isn&apos;t real — you can&apos;t choose where fat burns from. Kettlebell swings, cycling intervals, and dip bar core work together create the calorie deficit and muscle activation that shrinks waist size over time. Hip flexor stretching also reduces belly prominence from anterior pelvic tilt.</p>

            <p><strong>On your knee:</strong> Step-back lunges instead of forward lunges, shallow goblet squats, and cycling are all specifically knee-friendly. Never push through knee pain — reduce depth before reducing reps.</p>

            <p><strong>On your shoulders:</strong> Tuesday band work always comes first. Band pull-aparts and face pulls build rotator cuff stability. Full dips come later — assisted dips with feet partially on the floor are safer and still effective for now.</p>

            <p><strong>On your Adderall window:</strong> You have natural focus and energy Mon–Fri mornings. That&apos;s your best workout window. Weekends are gentler by design.</p>

            <p><strong>On sleep apnea:</strong> Low energy, slow recovery, higher cortisol (which directly causes belly fat storage), and poor motivation are all downstream effects. Consistent CPAP use will make this whole plan feel dramatically easier within a few weeks.</p>

            <p><strong>Starting out:</strong> Begin at the lower end of all rep ranges for the first two weeks. Building the habit matters far more than hitting any specific number right now.</p>
        </article>
    );
}
