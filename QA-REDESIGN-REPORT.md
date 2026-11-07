# Gameplay redesign: QA results (local build, emulated devices)

Mobile = 390px touch emulation, Desktop = 1440px. Chromium only; no physical iPhone/Android.

| Screen | Test | Mobile | Desktop |
|---|---|---|---|
| Question | Site header stays visible | Pass | Pass |
| Question | Back button + streak chip present | Pass | Pass |
| Question | Category art: 128px square sticker, white bg, black border, tilted, object-fit contain (never cropped) | Pass | Pass |
| Question | Art is /category-images/ and loads | Pass | Pass |
| Question | Progress "Fact 1 of 10" + bar | Pass | Pass |
| Question | Speech bubble label "REAL OR RUBBISH?" + fact text | Pass | Pass |
| Question | FAKE (white, "nice try") + FACT (yellow, "for real"), side by side | Pass | Pass |
| Question | Answer buttons ≥110px tall, 3px black border, hard shadow, dark text | Pass | Pass |
| Question | Navy #16162B background + halftone dots (#26264A 2px / 14px) | Pass | Pass |
| Question | Palette contrast ≥4.5:1 | Pass | Pass |
| Question | Visible focus state on keyboard Tab | Pass | Pass |
| Question | All tap targets ≥44px | Pass | Pass |
| Question | Real <button> elements, no div-buttons | Pass | Pass |
| Question | Mobile 390: no horizontal scroll, footer hidden | Pass | n/a |
| Question | axe WCAG A/AA: no violations | Pass | Pass |
| Question | Rapid double-tap answers once | Pass | Pass |
| Reveal | Wrong: needle points to the TRUE answer (FAKE → left) | Pass | Pass |
| Reveal | Wrong: headline + colour | Pass | Pass |
| Reveal | Wrong: subline format | Pass | Pass |
| Reveal | Wrong: streak chip dimmed | Pass | Pass |
| Reveal | Fake fact: struck-through statement + fantasy line | Pass | Pass |
| Reveal | BS-o-meter: FAKE half orange (left), FACT half yellow (right) | Pass | Pass |
| Reveal | Needle animates ~600ms ease-out with overshoot | Pass | Pass |
| Reveal | No "Tell me more" step; NEXT FACT button | Pass | Pass |
| Reveal | Correct: needle points to the TRUE answer (FACT → right) | Pass | Pass |
| Reveal | Correct: headline + colour | Pass | Pass |
| Reveal | Correct: subline format | Pass | Pass |
| Reveal | Correct: streak chip lime | Pass | Pass |
| Reveal | Real fact shows its explanation | Pass | Pass |
| Reveal | axe WCAG A/AA: no violations | Pass | Pass |
| Reveal | Shows instantly after answering (<400ms) | Pass | Pass |
| Reveal | prefers-reduced-motion: no animation, final needle shown | Pass | Pass |
| Summary | Score badge "3/10 FACTS SPOTTED" | Pass | n/a |
| Summary | Verdict title for 3/10 = "Professionally Fooled" | Pass | n/a |
| Summary | Stat chips Correct / Fooled you / Best streak | Pass | Pass |
| Summary | Best streak value is correct | Pass | Pass |
| Summary | Buttons: Challenge 1-on-1, Share score, Play again, Pick another category | Pass | Pass |
| Summary | Old "Challenge a friend" link button is kept (next to 1-on-1) | Pass | Pass |
| Summary | Logged-out first game: "Sign up now to join the leaderboard" prompt (lime card) | Pass | Pass |
| Summary | Old challenge creates a /battle/ link and shares/copies it | Pass | Pass |
| Summary | axe WCAG A/AA: no violations | Pass | Pass |
| Share sheet | Titled "Brag about it", 9:16 preview of the story card | Pass | Pass |
| Share sheet | Buttons: Instagram, TikTok, X, WhatsApp, Copy link + Save image | Pass | Pass |
| Share sheet | Fits the viewport (not cut off), dialog semantics | Pass | Pass |
| Share sheet | axe WCAG A/AA: no violations | Pass | Pass |
| Share sheet | Official platform icons (brand paths) rendered | Pass | Pass |
| Share: Instagram | Caption copied to clipboard (exact format + #SmartAssFacts) | Pass | Pass |
| Share: Instagram | Toast "Caption + link copied. Paste it in your post, or add it with the link sticker." | Pass | Pass |
| Share: Instagram | Web Share API called with the 1080×1920 PNG file | Pass | n/a |
| Share: TikTok | Caption copied + toast + share files | Pass | Pass |
| Share: X | Opens X intent with text + short link + utm_source=x&utm_medium=share | Pass | Pass |
| Share: WhatsApp | Opens wa.me with text + link + utm_source=whatsapp | Pass | Pass |
| Share: Copy link | Link copied with utm_source=copy + "Copied!" toast | Pass | Pass |
| Share: Save image | Mobile: image handed to the OS share sheet (Save Image) | Pass | n/a |
| Share: Story card | Generated image is 1080×1920 PNG | Pass | Pass |
| Share: Instagram | Clipboard fails → caption shown in a selectable box with a Copy button | Pass | Pass |
| Share sheet | Esc closes the sheet | Pass | Pass |
| Summary | "Challenge a friend 1-on-1" opens Party Mode with this category preselected | Pass | Pass |
| GA4 | game_start (category, source) | Pass | Pass |
| GA4 | answer fires for each of the 10 answers with correct true/false | Pass | Pass |
| GA4 | game_complete (score, category, mode) | Pass | Pass |
| GA4 | share (platform) for instagram, tiktok, x, whatsapp, copy, save | Pass | Pass |
| GA4 | caption_copied (platform) for instagram + tiktok | Pass | Pass |
| GA4 | challenge_created (old challenge link) | Pass | Pass |
| GA4 | challenge_click | Pass | Pass |
| Share sheet | 320×568: stays inside the screen, scrolls inside, Save image reachable, no sideways overflow | Pass | Pass |
| Summary | 320px: no horizontal overflow | Pass | Pass |
| Beat link | /beat/ page is noindex | Pass | Pass |
| Beat link | Short code is 4–6 chars, no 0/O/1/I/L | Pass | Pass |
| Beat link | Fresh browser: opens the SAME category game directly | Pass | Pass |
| Beat link | Banner: "Beat Gigi's 8/10 in Past Drama" | Pass | Pass |
| Beat link | Summary shows the verdict vs the friend | Pass | Pass |
| GA4 | challenge_link_opened (code, category) | Pass | Pass |
| GA4 | game_complete mode=beat | Pass | Pass |
| Beat link | Unknown code → friendly "LINK EXPIRED" + Play now | Pass | Pass |
| Sign-up prompt | Logged-out player: no leaderboard post yet | Pass | Pass |
| Sign-up prompt | Button opens the sign-up (register) form | Pass | Pass |
| Sign-up prompt | After signing up on the summary, THIS game is saved to the leaderboard | Pass | Pass |
| Sign-up prompt | Prompt disappears once signed in | Pass | Pass |
| Leaderboard | Header visible + "Hall of SmartAsses" + back button | Pass | Pass |
| Leaderboard | Tabs Today / This week / All time (This week default) | Pass | Pass |
| Leaderboard | Category filter dropdown | FAIL | Pass |
| Leaderboard | Podium: #2 left (white), #1 middle (yellow), #3 right (orange) | Pass | Pass |
| Leaderboard | Rows for rank 4+ | Pass | Pass |
| Leaderboard | Own rank pinned at the bottom in lime | Pass | Pass |
| Leaderboard | Tabs + category filter call the API with period & category | Pass | Pass |
| Leaderboard | axe WCAG A/AA: no violations | Pass | Pass |
| Leaderboard | CTA "Climb the board: play now" goes to play | Pass | Pass |
| Leaderboard | Finished game by a signed-in player is saved to the board | Pass | Pass |
| Party create | Header visible; name placeholder is "Gigi" | Pass | Pass |
| Party create | axe WCAG A/AA: no violations | Pass | Pass |
| Party lobby | Host creates room, share URL updated without remount | Pass | Pass |
| Party join | "YOU'RE INVITED!" + code card | Pass | Pass |
| Party question | Two scoreboard cards: yours yellow ("YOUR TURN"), other dimmed ("WAITING") | Pass | Pass |
| Party question | Bubble label "NO PEEKING…", round + timer shown, FAKE/FACT buttons | Pass | Pass |
| Party question | axe WCAG A/AA: no violations | Pass | Pass |
| Party reveal | Same BS-o-meter reveal, personal headline, standings | Pass | Pass |
| Party game over | Crowned mascot in yellow ring, winner/TIE headline, both scores side by side | Pass | Pass |
| Party game over | Buttons: Rematch same / new category, Share result, Home | Pass | Pass |
| Party game over | axe WCAG A/AA: no violations | Pass | Pass |
| Party game over | Guest sees "waiting for host" instead of rematch buttons | Pass | Pass |
| Party game over | Equal scores handled as a tie ("IT'S A TIE!") | Pass | Pass |
| Party game over | Share result opens the same custom share sheet | Pass | Pass |
| Party rematch | Same category: both players land in the same room lobby | Pass | Pass |
| Party rematch | Rematch game starts at round 1 | Pass | Pass |
| Party game over | Scores formatted like the leaderboard (thousands separator) | Pass | Pass |
| Party game over | Different answers → single winner headline "[NAME] WINS!" | Pass | Pass |
| Party rematch | New category: both stay in, lobby shows the new category | Pass | Pass |
| GA4 | rematch (same_category true / false) | Pass | Pass |
| GA4 | party events: room_created / game_start / game_complete | Pass | Pass |
| Party | No JS errors during the whole Party flow | Pass | Pass |
| Question | Desktop: centred column ≤520px with header AND footer | n/a | Pass |
| Summary | Score badge "6/10 FACTS SPOTTED" | n/a | Pass |
| Summary | Verdict title for 6/10 = "Suspiciously Average" | n/a | Pass |
| Share: Instagram | Desktop fallback: image is downloaded | n/a | Pass |
| Share: Save image | Desktop: PNG downloaded | n/a | Pass |