---
title: 'Aligning Card Buttons with CSS Flexbox'
author: 'Lenny Peters'
date: '2026-03-29'
excerpt: 'How a single flex: 1 declaration on the right element solves the misaligned button problem in card grid layouts.'
tags: ['CSS', 'Flexbox', 'Layout', 'SCSS']
image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Laptop screen showing code on a dark desk setup'
---

## The Problem

You have a grid of cards. Each card has a title, an excerpt, some tags, and a "Read Article" button at the bottom. Everything looks fine — until you populate the cards with real content. One title wraps to three lines while another fits on one. One excerpt is a sentence; another is two. Suddenly the buttons at the bottom of each card sit at wildly different vertical positions, and your clean grid looks broken.

I've seen this problem in virtually every card-based UI I've built, and I've watched teams reach for JavaScript-based equal-height solutions, `position: absolute` hacks, or hardcoded `min-height` values to fix it. None of those are necessary. The fix is pure CSS, it's three lines, and it's been available since flexbox shipped in every browser.

## How Cards Break

Consider a straightforward article card component rendered inside a CSS Grid:

```tsx
<article className={styles.card}>
  <div className={styles.topBar}>
    <span className={styles.slug}>ARTICLE_SLUG</span>
    <time className={styles.date}>29 March 2026</time>
  </div>
  <div className={styles.body}>
    <h2 className={styles.title}>
      <a href="/articles/my-article">Some Title Here</a>
    </h2>
    <p className={styles.excerpt}>A short description of the article.</p>
    <ul className={styles.tags}>
      <li>React</li>
      <li>CSS</li>
    </ul>
    <a href="/articles/my-article" className={styles.btn}>
      Read Article
  </div>
</article>
```

The parent grid ensures every card in a row stretches to the same height — CSS Grid does that by default with `align-items: stretch` [1]. But the _internal_ layout of each card is still regular block flow. Block-level elements stack top to bottom and stop where their content ends. If Card A's content is shorter than Card B's, Card A's button floats somewhere in the middle of the card while Card B's sits near the bottom.
author: 'Lenny Peters'
The grid made the cards equal height. It didn't make their _contents_ fill that height.

## The Flexbox Fix

The solution is a two-part flexbox pattern that MDN documents as "card layout pushing footer down" [2]:

**Step 1: Make the card a flex column container.**

```scss
.card {
  display: flex;
  flex-direction: column;
}
```

This switches the card's internal layout from block flow to a flex column. Children now participate in the flex formatting context, which means we can control how they grow to fill available space.

**Step 2: Make the body grow to fill the card.**

```scss
.body {
  display: flex;
  flex-direction: column;
  flex: 1;
}
```

The `.body` wrapper contains the title, excerpt, tags, and button. Setting `flex: 1` (shorthand for `flex: 1 1 0`) tells it to absorb all remaining vertical space in the card. Since the card's height is dictated by the grid row (which matches the tallest card), the body now stretches to fill the full card height regardless of its own content length.

**Step 3: Make the excerpt absorb variable space.**

```scss
.excerpt {
  flex: 1;
}
```

This is the key insight. Inside the `.body` flex column, the excerpt is the element whose length varies most between cards. By giving it `flex: 1`, it expands to consume whatever leftover space exists between the title above and the tags/button below. The tags and button are pushed flush to the bottom, and they align perfectly across every card in the row.

## The Complete Pattern

Here's the full SCSS for a card that always pins its button to the bottom:

```scss
.card {
  display: flex;
  flex-direction: column;
  background-color: #1c1b1b;
  border: 1px solid rgba(#00f0ff, 0.15);
  overflow: hidden;
}

.body {
  padding: 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 24px;
}

.excerpt {
  font-size: 0.85rem;
  line-height: 1.65;
  margin-bottom: 32px;
  flex: 1;
}

.tags {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  padding: 8px 32px;
  border: 2px solid rgba(#00f0ff, 0.5);
  text-decoration: none;
}
```

That's it. No JavaScript. No hardcoded heights. No absolute positioning. The flex column cascade — card grows the body, body grows the excerpt — guarantees that everything after the excerpt sits at the bottom.

## Why `margin-top: auto` Is the Wrong Tool Here

You'll sometimes see advice to use `margin-top: auto` on the button itself instead of `flex: 1` on the excerpt [3]. This works when you have a button and nothing else below the variable-height content. But it fails the moment you have _multiple_ elements that should stick to the bottom together — like tags _and_ a button.

With `margin-top: auto` on the button, the tags stay glued to the excerpt and only the button drops. Now your tags are misaligned across cards too. By putting `flex: 1` on the excerpt instead, _everything_ below it — tags, button, any future element — moves as a unit to the bottom of the card.

```scss
// Don't do this if you have multiple bottom elements
.btn {
  margin-top: auto; // only pushes the button down, not the tags above it
}

// Do this instead
.excerpt {
  flex: 1; // pushes tags AND button down together
}
```

> The `margin-top: auto` approach is fine for simpler cards with a single action at the bottom. But `flex: 1` on the variable-content element is the more robust pattern.

## A Common Gotcha: Forgetting the Intermediate Flex Container

I've debugged this for other engineers more times than I can count. They set the card to `display: flex; flex-direction: column` and then put `flex: 1` directly on the excerpt — but the excerpt isn't a direct child of the card. It's nested inside a `.body` wrapper.

Flex properties only apply to _direct children_ of a flex container [1]. If your card has a wrapper div between the card and the excerpt, you need that wrapper to _also_ be a flex column with `flex: 1`. The chain must be unbroken:

```
.card (flex column)
  └── .topBar (auto — takes its natural height)
  └── .body (flex: 1, flex column)  ← must also be a flex column
        └── .title (auto)
        └── .excerpt (flex: 1)      ← absorbs variable space
        └── .tags (auto)
        └── .btn (auto)
```

Break any link in this chain and the button floats back up.

## Grid Does the Outer Work, Flexbox Does the Inner Work

It's worth calling out the relationship between the grid and flexbox here. CSS Grid handles the _macro_ layout — arranging cards in rows and columns, making cards in the same row equal height. Flexbox handles the _micro_ layout — distributing space inside each card so the internal elements land in the right place [4].

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
```

Grid's default `align-items: stretch` is what makes all cards in a row the same height. Without it, each card would shrink to fit its own content and the entire alignment trick would be moot. This isn't something you need to explicitly set — it's the default behavior — but it's important to understand _why_ the pattern works.

## Conclusion

The misaligned button problem comes down to a single missing concept: flexbox growth. When cards live in a grid, they're stretched to equal heights, but their _contents_ don't automatically fill that height. The fix is a three-step flex column cascade:

1. The card is a flex column container
2. The body wrapper gets `flex: 1` to fill the card
3. The variable-content element (usually the excerpt) gets `flex: 1` to push everything below it to the bottom

This pattern is stable, requires zero JavaScript, handles any amount of content variation, and works in every browser shipped since 2015. I use it on every card grid I build, and I've never needed to reach for anything more complex.

## References

1. [MDN — CSS Flexible Box Layout: Aligning Items](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container)
2. [MDN — Typical Use Cases of Flexbox: Card Layout Pushing Footer Down](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Typical_use_cases_of_flexbox#card_layout_pushing_footer_down)
3. [MDN — Using Auto Margins for Main Axis Alignment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container#using_auto_margins_for_main_axis_alignment)
4. [CSS-Tricks — How to Use CSS Grid for Sticky Headers and Footers](https://css-tricks.com/how-to-use-css-grid-for-sticky-headers-and-footers/)
