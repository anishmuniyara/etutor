# English Learning Application — Content and JSON Architecture

## 1. Objective

The application is intended to help users learn and practically use English, especially users who may not have strong English-language knowledge.

The primary principle is:

> **Teach users what something means, when they should use it, and how people actually use it.**

The application should therefore focus less on dictionary-style definitions and more on:

* Simple explanations
* Practical usage
* Real-world examples
* Context
* Common mistakes or things to remember
* Conversations where applicable

The content should be presented primarily through **compact cards** optimized for mobile usage.

---

# 2. Content Categories

The application should initially contain the following categories:

1. Tenses
2. Vocabulary
3. Phrases
4. Idioms
5. Daily Expressions
6. Business English
7. Situational English
8. Conversation Starters
9. Polite English
10. Informal English / Slang
11. Confusing Words
12. Short Conversations
13. Synonyms & Alternatives

These categories should not automatically result in 13 different UI templates.

Instead, categories should be grouped based on their **content structure and user experience**.

---

# 3. UI Template Strategy

There should initially be **four primary reusable card templates**.

## Template A — Explanation Card

Used for:

* Vocabulary
* Phrases
* Idioms
* Daily Expressions
* Business English
* Polite English
* Informal English / Slang

The basic layout is:

```text
Term
Metadata

Meaning

When do people use it?

Examples

Remember
```

The data changes between categories, but the UI structure remains largely the same.

---

## Template B — Grammar Card

Used for:

* Tenses

Potential future usage:

* Articles
* Prepositions
* Active vs Passive Voice
* Conditionals
* Reported Speech
* Modal Verbs

Basic layout:

```text
Grammar Topic
Level

What does it mean?

When do we use it?

Formula

Examples

Remember
```

---

## Template C — Comparison Card

Used for:

* Confusing Words
* Synonyms & Alternatives

Basic layout:

```text
Topic

Word / Concept A
Word / Concept B

Difference

When should I use each?

Examples

Remember
```

---

## Template D — Conversation Card

Used for:

* Situational English
* Conversation Starters
* Short Conversations

Basic layout:

```text
Topic
Level

Situation / Goal

Conversation

Key Expressions

Remember
```

---

# 4. General Data Principles

The following principles should apply to all JSON files.

## 4.1 One file per category

Each category should have its own JSON file.

Example:

```text
content/
├── tenses.json
├── vocabulary.json
├── phrases.json
├── idioms.json
├── daily_expressions.json
├── business_english.json
├── situations.json
├── conversation_starters.json
├── polite_english.json
├── slang.json
├── confusing_words.json
├── short_conversations.json
└── synonyms.json
```

The category is therefore determined by the **file itself**.

There is no need to repeat:

```json
"category": "vocabulary"
```

inside every vocabulary object.

---

# 5. Common Fields

Where practical, common fields should have the same names across categories.

Recommended common fields:

```text
id
term
level
meaning
usage
examples
remember
```

This makes frontend rendering much easier.

For example:

```json
{
  "id": "opportunity",
  "term": "Opportunity",
  "level": "A2",
  "meaning": "...",
  "usage": "...",
  "examples": [],
  "remember": []
}
```

The same structure can be used for a phrase:

```json
{
  "id": "piece-of-cake",
  "term": "Piece of cake",
  "level": "B1",
  "meaning": "...",
  "usage": "...",
  "examples": [],
  "remember": []
}
```

The frontend does not need to know that one is a word and the other is a phrase to render the card.

---

# 6. Category Details

## 6.1 Tenses

### Purpose

Teach users how English tenses work and, more importantly, **when to use each tense**.

### Required fields

```text
id
term
level
definition
usage
formula
examples
remember
```

### Example

```json
{
  "id": "present-perfect",
  "term": "Present Perfect",
  "level": "B1",
  "definition": "Used for actions that are connected to the present.",
  "usage": "Use it for experiences, recent actions, and situations that continue until now.",
  "formula": "Subject + has/have + past participle",
  "examples": [
    {
      "context": "Experience",
      "sentence": "I have visited London."
    },
    {
      "context": "Recent action",
      "sentence": "She has finished her work."
    }
  ],
  "remember": [
    "Do not normally use a finished past time such as 'yesterday' with the present perfect."
  ]
}
```

### UI

Grammar Card.

---

# 6.2 Vocabulary

### Purpose

Teach individual words with enough context for users to confidently use them.

### Required fields

```text
id
term
partOfSpeech
level
meaning
usage
examples
remember
```

### Example

```json
{
  "id": "opportunity",
  "term": "Opportunity",
  "partOfSpeech": "Noun",
  "level": "A2",
  "meaning": "A good chance to do something.",
  "usage": "Use this word when talking about a positive chance in work, education, business, or everyday life.",
  "examples": [
    {
      "context": "Career",
      "sentence": "I got an opportunity to work abroad."
    },
    {
      "context": "Education",
      "sentence": "She had an opportunity to study in Canada."
    },
    {
      "context": "Business",
      "sentence": "This is a great business opportunity."
    }
  ],
  "remember": [
    "Opportunity usually refers to a positive or beneficial chance."
  ]
}
```

### Important design principle

The examples should have **different contexts**, rather than five variations of exactly the same sentence.

This creates the "usage radius" discussed earlier.

For example:

```text
Career
Education
Business
Daily Life
Sports
```

The goal is for the user to understand where the word naturally appears.

### UI

Explanation Card.

---

# 6.3 Phrases

### Purpose

Teach commonly used multi-word expressions and help users understand when native speakers naturally use them.

### Required fields

```text
id
term
level
meaning
usage
examples
remember
```

### Example

```json
{
  "id": "piece-of-cake",
  "term": "Piece of cake",
  "level": "B1",
  "meaning": "Something that is very easy to do.",
  "usage": "People use this phrase when they want to say that something is very easy.",
  "examples": [
    {
      "context": "School",
      "sentence": "The exam was a piece of cake."
    },
    {
      "context": "Work",
      "sentence": "This task is a piece of cake."
    },
    {
      "context": "Daily Life",
      "sentence": "Fixing the chair was a piece of cake."
    }
  ],
  "remember": [
    "This is an informal expression commonly used in everyday conversation."
  ]
}
```

### UI

Explanation Card.

---

# 6.4 Idioms

### Purpose

Teach expressions where the literal words do not directly represent the actual meaning.

### Required fields

```text
id
term
level
meaning
usage
examples
remember
```

### Example

```json
{
  "id": "break-the-ice",
  "term": "Break the ice",
  "level": "B1",
  "meaning": "To make people feel more comfortable and start interacting.",
  "usage": "Use this expression when talking about starting a conversation or making people feel relaxed in a new situation.",
  "examples": [
    {
      "context": "Meeting",
      "sentence": "He told a joke to break the ice."
    },
    {
      "context": "Social Event",
      "sentence": "Games can help break the ice at a party."
    }
  ],
  "remember": [
    "The phrase is not about actual ice."
  ]
}
```

### UI

Explanation Card.

---

# 6.5 Daily Expressions

### Purpose

Teach expressions users can immediately use in everyday English.

Examples:

* How's it going?
* Sounds good.
* No worries.
* That makes sense.
* I'm just kidding.

### Fields

```text
id
term
level
meaning
usage
examples
remember
```

### Example

```json
{
  "id": "sounds-good",
  "term": "Sounds good",
  "level": "A1",
  "meaning": "That sounds like a good idea or plan.",
  "usage": "Use it when you agree with someone's suggestion or plan.",
  "examples": [
    {
      "context": "Friends",
      "sentence": "A: Let's meet at 7. B: Sounds good."
    },
    {
      "context": "Work",
      "sentence": "A: I'll send the report today. B: Sounds good."
    }
  ],
  "remember": [
    "This expression is informal and very common in spoken English."
  ]
}
```

### UI

Explanation Card.

---

# 6.6 Business English

### Purpose

Teach English commonly used in professional environments.

Examples:

* Follow up
* Circle back
* Deadline
* Escalate
* Keep me posted

### Fields

```text
id
term
level
businessCategory
meaning
usage
examples
remember
```

### `businessCategory`

Possible values:

```text
meetings
email
presentations
project_management
communication
negotiation
feedback
leadership
```

### Example

```json
{
  "id": "follow-up",
  "term": "Follow up",
  "level": "B1",
  "businessCategory": "Communication",
  "meaning": "To contact someone again about something previously discussed.",
  "usage": "Commonly used in business communication, meetings, and email.",
  "examples": [
    {
      "context": "Email",
      "sentence": "I'm following up on my previous email."
    },
    {
      "context": "Meeting",
      "sentence": "I'll follow up with the team tomorrow."
    }
  ],
  "remember": [
    "Very common in professional communication."
  ]
}
```

### UI

Explanation Card.

---

# 6.7 Situational English

### Purpose

Teach English for a specific real-life situation.

Examples:

* Airport
* Restaurant
* Hotel
* Shopping
* Job Interview
* Office Meeting

Unlike vocabulary, this category is **situation-driven**.

### Fields

```text
id
term
level
goal
conversation
keyExpressions
remember
```

### Example

```json
{
  "id": "airport-check-in",
  "term": "Airport Check-in",
  "level": "A2",
  "goal": "Learn how to communicate at an airport check-in counter.",
  "conversation": [
    {
      "speaker": "Passenger",
      "text": "I'd like to check in for my flight."
    },
    {
      "speaker": "Agent",
      "text": "May I see your passport, please?"
    }
  ],
  "keyExpressions": [
    "I'd like to check in.",
    "Where is the departure gate?",
    "Can I check this bag?"
  ],
  "remember": [
    "Use polite expressions when speaking with airport staff."
  ]
}
```

### UI

Conversation Card.

---

# 6.8 Conversation Starters

### Purpose

Help users start conversations naturally.

Examples:

* Nice to meet you.
* Where are you from?
* What do you do?
* How was your weekend?

### Fields

```text
id
term
level
purpose
examples
remember
```

For consistency with the conversation template, the data can also include a small conversation.

### Example

```json
{
  "id": "what-do-you-do",
  "term": "What do you do?",
  "level": "A1",
  "purpose": "A common way to ask someone about their job or profession.",
  "examples": [
    {
      "context": "Meeting Someone",
      "sentence": "Hi, I'm Alex. What do you do?"
    }
  ],
  "remember": [
    "In most everyday contexts, this question is asking about someone's work."
  ]
}
```

### UI

Conversation Card.

---

# 6.9 Polite English

### Purpose

Teach users how to make requests, responses, and interactions sound more respectful.

Examples:

* Could you...?
* Would you mind...?
* I appreciate it.
* Thanks for your time.

### Fields

```text
id
term
level
meaning
usage
examples
remember
```

### Example

```json
{
  "id": "would-you-mind",
  "term": "Would you mind...?",
  "level": "B1",
  "meaning": "A polite way to ask someone to do something.",
  "usage": "Use this when making a polite request.",
  "examples": [
    {
      "context": "Office",
      "sentence": "Would you mind sending me the file?"
    },
    {
      "context": "Daily Life",
      "sentence": "Would you mind opening the window?"
    }
  ],
  "remember": [
    "Use a verb ending in -ing after 'Would you mind'."
  ]
}
```

### UI

Explanation Card.

---

# 6.10 Informal English / Slang

### Purpose

Teach casual language that users may encounter in conversations, social media, movies, and informal communication.

Examples:

* Hang out
* Chill
* Awesome
* No big deal
* My bad

### Fields

```text
id
term
level
meaning
usage
examples
remember
```

Optional:

```text
avoidIn
```

This can tell the user where the expression should not be used.

### Example

```json
{
  "id": "my-bad",
  "term": "My bad",
  "level": "A2",
  "meaning": "An informal way to say that you made a mistake.",
  "usage": "Used in casual conversations when admitting a small mistake.",
  "examples": [
    {
      "context": "Friends",
      "sentence": "My bad, I forgot to call you."
    }
  ],
  "remember": [
    "This is informal. Avoid it in formal business communication."
  ]
}
```

### UI

Explanation Card.

---

# 6.11 Confusing Words

### Purpose

Teach users the difference between words that look or sound similar.

Examples:

* Borrow vs Lend
* Say vs Tell
* Look vs See vs Watch
* Affect vs Effect

### Fields

```text
id
term
level
items
difference
examples
remember
```

### Example

```json
{
  "id": "borrow-vs-lend",
  "term": "Borrow vs Lend",
  "level": "A2",
  "items": [
    {
      "term": "Borrow",
      "meaning": "To receive something temporarily."
    },
    {
      "term": "Lend",
      "meaning": "To give something temporarily."
    }
  ],
  "difference": "Borrow means receive. Lend means give.",
  "examples": [
    {
      "context": "Borrow",
      "sentence": "Can I borrow your pen?"
    },
    {
      "context": "Lend",
      "sentence": "Can you lend me your pen?"
    }
  ],
  "remember": [
    "Borrow = receive. Lend = give."
  ]
}
```

### UI

Comparison Card.

---

# 6.12 Short Conversations

### Purpose

Teach complete conversational flows rather than individual expressions.

### Fields

```text
id
term
level
situation
conversation
keyExpressions
remember
```

### Example

```json
{
  "id": "meeting-a-new-person",
  "term": "Meeting Someone New",
  "level": "A1",
  "situation": "Two people meet for the first time.",
  "conversation": [
    {
      "speaker": "A",
      "text": "Hi, I'm John. Nice to meet you."
    },
    {
      "speaker": "B",
      "text": "Nice to meet you too."
    },
    {
      "speaker": "A",
      "text": "Where are you from?"
    },
    {
      "speaker": "B",
      "text": "I'm from India."
    }
  ],
  "keyExpressions": [
    "Nice to meet you.",
    "Where are you from?"
  ],
  "remember": [
    "These expressions are commonly used when meeting someone for the first time."
  ]
}
```

### UI

Conversation Card.

---

# 6.13 Synonyms & Alternatives

### Purpose

Help users expand their vocabulary by showing different words that express similar ideas, while explaining the differences in usage.

This should not simply become a dictionary of synonyms.

The important part is explaining **when one alternative is better than another**.

### Fields

```text
id
term
level
meaning
alternatives
remember
```

### Example

```json
{
  "id": "happy",
  "term": "Happy",
  "level": "A2",
  "meaning": "Feeling good or pleased.",
  "alternatives": [
    {
      "term": "Glad",
      "usage": "Common in everyday conversation."
    },
    {
      "term": "Delighted",
      "usage": "Stronger than happy and often used for very positive feelings."
    },
    {
      "term": "Pleased",
      "usage": "Often sounds more formal."
    }
  ],
  "remember": [
    "Similar words do not always work in exactly the same situations."
  ]
}
```

### UI

Comparison Card.

---

# 7. JSON File Format

Every category file should contain an **array**.

Example:

```json
[
  {
    "id": "opportunity",
    "term": "Opportunity",
    "partOfSpeech": "Noun",
    "level": "A2",
    "meaning": "...",
    "usage": "...",
    "examples": [],
    "remember": []
  },
  {
    "id": "appreciate",
    "term": "Appreciate",
    "partOfSpeech": "Verb",
    "level": "B1",
    "meaning": "...",
    "usage": "...",
    "examples": [],
    "remember": []
  }
]
```

This allows the application to:

1. Load a category file.
2. Display the list of available content.
3. Select an item by `id`.
4. Pass the object to the appropriate card component.

---

# 8. Recommended ID Strategy

Every item should have a unique, stable ID.

Prefer readable IDs rather than generated numeric IDs where practical.

Examples:

```text
opportunity
break-the-ice
piece-of-cake
present-perfect
borrow-vs-lend
airport-check-in
```

IDs should be:

* Unique within the application
* Stable over time
* URL-safe
* Independent of display text changes

The display `term` can change without requiring a new ID.

---

# 9. Level

Use a consistent level model across content.

Recommended:

```text
A1
A2
B1
B2
C1
C2
```

The frontend can translate these into friendly labels:

```text
A1 → Beginner
A2 → Elementary
B1 → Intermediate
B2 → Upper Intermediate
C1 → Advanced
C2 → Proficient
```

The JSON should preferably store the standardized value (`A1`, `A2`, etc.), while the UI decides how to present it.

---

# 10. Examples Structure

Examples are particularly important for this application.

Instead of:

```json
"examples": [
  "Example 1",
  "Example 2",
  "Example 3"
]
```

use:

```json
"examples": [
  {
    "context": "Career",
    "sentence": "I got an opportunity to work abroad."
  },
  {
    "context": "Education",
    "sentence": "She got an opportunity to study overseas."
  }
]
```

This allows the UI to show:

```text
💼 Career
I got an opportunity to work abroad.

🎓 Education
She got an opportunity to study overseas.
```

This is especially valuable because the application is intended to teach **context and usage**, not only definitions.

---

# 11. Content Quality Rules

The JSON schema is only part of the implementation. The content itself should follow consistent rules.

## Meaning

Meanings should be:

* Short
* Simple
* Easy for beginners
* Written in plain English
* Free from unnecessarily complex dictionary wording

Prefer:

```text
A good chance to do something.
```

Instead of:

```text
A favorable combination of circumstances providing a possibility for advancement.
```

---

## Usage

The usage section should answer:

> "When would a normal English speaker use this?"

It should not simply repeat the meaning.

Bad:

```text
usage: "It means a good chance."
```

Better:

```text
usage: "Use this when talking about a positive chance in work, education, business, or daily life."
```

---

## Examples

Examples should represent different contexts.

For example:

```text
Career
Education
Business
Daily Life
Travel
Social
```

The exact contexts should depend on the content.

Avoid creating examples that are grammatically correct but unnatural.

---

## Remember

The `remember` section should contain one or two genuinely useful takeaways.

Examples:

```text
Common mistake
Usage restriction
Formal/informal distinction
Grammar note
Meaning nuance
```

Avoid filling it with generic statements.

---

# 12. Optional Metadata

The application can support optional metadata where a category benefits from it.

For example:

```json
{
  "metadata": {
    "partOfSpeech": "Noun",
    "businessCategory": "Meetings",
    "tone": "Informal"
  }
}
```

However, do not add a generic metadata object everywhere just for the sake of consistency.

Use explicit fields when the information is important to rendering or filtering.

For example:

```json
"partOfSpeech": "Noun"
```

is preferable for vocabulary because the UI may display it prominently and filter by it.

---

# 13. Frontend Architecture

A possible React structure:

```text
src/
├── components/
│   ├── cards/
│   │   ├── ExplanationCard.tsx
│   │   ├── GrammarCard.tsx
│   │   ├── ComparisonCard.tsx
│   │   └── ConversationCard.tsx
│   │
│   └── sections/
│       ├── CardHeader.tsx
│       ├── MeaningSection.tsx
│       ├── UsageSection.tsx
│       ├── ExamplesSection.tsx
│       ├── FormulaSection.tsx
│       ├── DifferenceSection.tsx
│       ├── ConversationSection.tsx
│       ├── RememberSection.tsx
│       └── Metadata.tsx
│
├── data/
│   ├── vocabulary.json
│   ├── phrases.json
│   ├── idioms.json
│   ├── daily_expressions.json
│   ├── business_english.json
│   ├── polite_english.json
│   ├── slang.json
│   ├── tenses.json
│   ├── confusing_words.json
│   ├── synonyms.json
│   ├── situations.json
│   ├── conversation_starters.json
│   └── short_conversations.json
│
└── pages/
    ├── CategoryPage.tsx
    └── ContentDetailPage.tsx
```

---

# 14. Rendering Architecture

The frontend should determine the template based on the selected category.

Conceptually:

```text
Category
   ↓
Category configuration
   ↓
Template type
   ↓
Card component
   ↓
Content data
```

Example configuration:

```json
{
  "vocabulary": {
    "template": "explanation"
  },
  "phrases": {
    "template": "explanation"
  },
  "idioms": {
    "template": "explanation"
  },
  "daily_expressions": {
    "template": "explanation"
  },
  "business_english": {
    "template": "explanation"
  },
  "polite_english": {
    "template": "explanation"
  },
  "slang": {
    "template": "explanation"
  },
  "tenses": {
    "template": "grammar"
  },
  "confusing_words": {
    "template": "comparison"
  },
  "synonyms": {
    "template": "comparison"
  },
  "situations": {
    "template": "conversation"
  },
  "conversation_starters": {
    "template": "conversation"
  },
  "short_conversations": {
    "template": "conversation"
  }
}
```

This provides a clean separation between:

```text
Content Category
```

and

```text
UI Template
```

That separation is important.

---

# 15. Why Category and Template Should Be Separate

A category answers:

> "What kind of content is this?"

A template answers:

> "How should this content be displayed?"

For example:

```text
Vocabulary
Phrases
Idioms
Daily Expressions
Business English
```

are different content categories.

But they can all use:

```text
ExplanationCard
```

Similarly:

```text
Confusing Words
Synonyms
```

can use:

```text
ComparisonCard
```

This prevents unnecessary frontend duplication.

---

# 16. Recommended Final Mapping

```text
EXPLANATION TEMPLATE
│
├── Vocabulary
├── Phrases
├── Idioms
├── Daily Expressions
├── Business English
├── Polite English
└── Informal English / Slang


GRAMMAR TEMPLATE
│
└── Tenses


COMPARISON TEMPLATE
│
├── Confusing Words
└── Synonyms & Alternatives


CONVERSATION TEMPLATE
│
├── Situational English
├── Conversation Starters
└── Short Conversations
```

So the application can have many categories while maintaining only **four primary card templates**.

---

# 17. Suggested Initial Scope

For the first implementation, I would prioritize:

### Content categories

```text
Tenses
Vocabulary
Phrases
Idioms
Daily Expressions
Business English
Situational English
Conversation Starters
Polite English
Informal English / Slang
Confusing Words
Short Conversations
Synonyms & Alternatives
```

### Templates

```text
ExplanationCard
GrammarCard
ComparisonCard
ConversationCard
```

### Common reusable sections

```text
Header
Metadata
Meaning
Usage
Examples
Formula
Difference
Conversation
Remember
```

The application should be designed so that adding a new category later generally requires **new JSON data and configuration**, rather than a new frontend component.

---

# 18. Core Engineering Principle

The most important architectural decision is:

> **Do not design one UI template per category. Design reusable templates around the structure of the content.**

For example, adding a future category called:

```text
Phrasal Verbs
```

should ideally require:

```text
phrasal_verbs.json
```

and a category configuration pointing to:

```text
ExplanationCard
```

rather than requiring:

```text
PhrasalVerbCard.tsx
```

unless the content genuinely requires a different interaction or layout.

The same principle applies to future categories such as pronunciation, interview English, email English, travel English, or common mistakes.

---

# 19. Final Architecture at a Glance

```text
                    ENGLISH LEARNING APP
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
      CONTENT           CONFIGURATION        UI
          │                 │                 │
     JSON Files        Category → Template   Cards
          │                 │                 │
          │                 ├── Explanation ───┤
          │                 ├── Grammar ───────┤
          │                 ├── Comparison ────┤
          │                 └── Conversation ──┤
          │                                   │
          └────────────── Data ───────────────┘
```

The result is a content-driven architecture where **JSON controls the learning material and reusable React components control the presentation**. This is simple to maintain, easy to extend, and well suited to a mobile-first learning application.
