const defaults = {
    name: "Seetha",
    sender: "Someone who wishes you happiness",
    letter:
        "Happy birthday!\n\nThere is something quietly wonderful about you. Your smile makes ordinary days feel a little brighter. I wanted to make this small surprise simply to celebrate you.\n\nMay this year bring you peaceful mornings, beautiful adventures, and everything you have been wishing for. You deserve happiness, today and always.\n\nNo expectations, just a little wish from someone who cares.",
    compliments:
        "You are wonderful|Your smile is beautiful|You deserve happiness|Keep shining",
    captions: "A beautiful smile|Little moments, big happiness|Keep being you",
};
export default function decorate(block) {
    const config = { ...defaults };
    const photos = [];
    [...block.children].forEach((row) => {
        const [key, value] = row.children;
        if (!value) return;
        const k = key.textContent.trim().toLowerCase();
        if (k === "photo") {
            const img = value.querySelector("img");
            if (img)
                photos.push({
                    src: img.src,
                    alt: img.alt || "A sweet memory",
                    caption: value.textContent.trim(),
                });
        } else if (k in config) config[k] = value.innerText.trim();
    });
    block.replaceChildren();
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = new URL('./birthday.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${css.getAttribute("href")}"]`))
        document.head.append(css);
    let step = 0,
        popped = new Set(),
        lit = true,
        opened = false,
        photo = 0;
    let audio = null,
        playing = false,
        timer;
    const el = (tag, cls, txt) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (txt !== undefined) n.textContent = txt;
        return n;
    };
    const button = (txt, fn, cls = "primary") => {
        const b = el("button", cls, txt);
        b.type = "button";
        b.addEventListener("click", fn);
        return b;
    };
    const go = (n) => {
        step = n;
        render();
    };
    function music() {
        if (playing) {
            playing = false;
            clearInterval(timer);
            audio?.suspend();
            render();
            return;
        }
        try {
            audio ??= new (window.AudioContext || window.webkitAudioContext)();
            audio.resume();
            playing = true;
            let i = 0;
            const notes = [261.63, 329.63, 392, 440, 392, 329.63, 293.66, 349.23];
            const note = () => {
                const o = audio.createOscillator(),
                    g = audio.createGain(),
                    t = audio.currentTime;
                o.type = "sine";
                o.frequency.value = notes[i++ % notes.length];
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.045, t + 0.08);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
                o.connect(g).connect(audio.destination);
                o.start(t);
                o.stop(t + 0.6);
            };
            note();
            timer = setInterval(note, 650);
            render();
        } catch {
            playing = false;
        }
    }
    function render() {
        block.replaceChildren();
        const shell = el("div", "birthday-shell");
        block.append(shell);
        const bg = el("div", "hearts");
        bg.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 18; i++) {
            const h = el("span", "", "♥");
            h.style.cssText = `left:${(i * 37) % 100}%;top:${(i * 23) % 100}%;animation-delay:${-i * 0.7}s;font-size:${12 + (i % 5) * 7}px`;
            bg.append(h);
        }
        shell.append(bg);
        const nav = el("div", "birthday-nav");
        nav.append(
            step
                ? button("‹ Back", () => go(step - 1), "pill")
                : el("span", "", "For you ♡"),
            el("span", "progress", `${step + 1} / 6`),
            button(playing ? "♫ On" : "♫ Off", music, "pill"),
        );
        shell.append(nav);
        const panel = el("section", "birthday-panel");
        shell.append(panel);
        const heading = (t) => panel.append(el("h1", "", t));
        const sub = (t) => panel.append(el("p", "subtitle", t));
        const next = (t = "Continue →") =>
            panel.append(button(t, () => go(step + 1)));
        if (step === 0) {
            heading(`Happy Birthday, ${config.name}!`);
            panel.append(el("div", "hero", "🧸🎂🐰"));
            sub("A little surprise, made just for you.");
            sub("Ready to see what’s next?");
            next("Yes, show me ♡");
            panel.append(
                button(
                    "Maybe later",
                    () => {
                        panel.querySelector(".subtitle").textContent =
                            "Whenever you are ready, this surprise is here for you.";
                    },
                    "secondary",
                ),
            );
        }
        if (step === 1) {
            heading("Pop all 4 balloons");
            sub("Each one holds a little thought for you.");
            const grid = el("div", "balloons");
            const words = config.compliments.split("|");
            for (let i = 0; i < 4; i++) {
                const b = button(
                    popped.has(i) ? words[i] || "You are special" : "🎈",
                    () => {
                        popped.add(i);
                        render();
                    },
                    popped.has(i) ? "popped" : "balloon",
                );
                b.setAttribute(
                    "aria-label",
                    popped.has(i) ? b.textContent : `Pop balloon ${i + 1}`,
                );
                grid.append(b);
            }
            panel.append(grid);
            if (popped.size === 4) next();
        }
        if (step === 2) {
            heading(`Make a wish, ${config.name}`);
            sub(
                lit
                    ? "Close your eyes & make a wish."
                    : "May your sweetest wish come true!",
            );
            const cake = el("div", "cake");
            cake.append(
                el("div", lit ? "flame" : "flame out", ""),
                el("div", "candle", ""),
                el("div", "icing", ""),
                el("div", "cake-base", "♡  ♡  ♡"),
            );
            panel.append(cake);
            if (lit)
                panel.append(
                    button("Blow out the candle", () => {
                        lit = false;
                        render();
                    }),
                );
            else next("Your next surprise →");
        }
        if (step === 3) {
            heading("Some sweet moments");
            sub("Swipe the cards or use the arrows.");
            const items = photos.length
                ? photos
                : config.captions
                    .split("|")
                    .map((caption, i) => ({
                        caption,
                        emoji: ["🌷", "🌙", "✨"][i % 3],
                    }));
            const item = items[photo % items.length];
            const card = el("div", "memory-card");
            if (item.src) {
                const img = el("img");
                img.src = item.src;
                img.alt = item.alt;
                card.append(img);
            } else card.append(el("div", "memory-placeholder", item.emoji));
            card.append(el("p", "", item.caption));
            let start = 0;
            card.addEventListener(
                "touchstart",
                (e) => (start = e.touches[0].clientX),
                { passive: true },
            );
            card.addEventListener(
                "touchend",
                (e) => {
                    const delta = e.changedTouches[0].clientX - start;
                    if (Math.abs(delta) > 35) {
                        photo = (photo + (delta < 0 ? 1 : items.length - 1)) % items.length;
                        render();
                    }
                },
                { passive: true },
            );
            panel.append(card);
            const controls = el("div", "photo-controls");
            controls.append(
                button(
                    "‹",
                    () => {
                        photo = (photo + items.length - 1) % items.length;
                        render();
                    },
                    "pill",
                ),
                el("span", "", `${photo + 1} / ${items.length}`),
                button(
                    "›",
                    () => {
                        photo = (photo + 1) % items.length;
                        render();
                    },
                    "pill",
                ),
            );
            panel.append(controls);
            next("A message for you →");
        }
        if (step === 4) {
            heading("A message from my heart");
            if (!opened) {
                panel.append(
                    button(
                        "💌",
                        () => {
                            opened = true;
                            render();
                        },
                        "envelope",
                    ),
                );
                sub("Tap to open your letter");
            } else {
                const letter = el("article", "letter");
                letter.append(
                    el("p", "", `Dear ${config.name},`),
                    el("p", "", config.letter),
                    el("p", "", `With warm wishes,\n${config.sender} ♡`),
                );
                panel.append(letter);
                next("One last surprise →");
            }
        }
        if (step === 5) {
            heading("Lots of happiness for you!");
            const conf = el("div", "confetti");
            conf.setAttribute("aria-hidden", "true");
            for (let i = 0; i < 35; i++) {
                const p = el("i");
                p.style.cssText = `left:${(i * 31) % 100}%;background:${["#e63b80", "#f9c65c", "#a98bea"][i % 3]};animation-delay:${(i % 9) * 0.16}s`;
                conf.append(p);
            }
            panel.append(conf, el("div", "hero", "🐰🎁🧸"));
            sub(`Once again, happy birthday, ${config.name}!`);
            sub("I hope this little surprise made you smile. ♡");
            panel.append(
                button("↻ Replay", () => {
                    popped.clear();
                    lit = true;
                    opened = false;
                    photo = 0;
                    go(0);
                }),
            );
        }
    }
    render();
}
