
Create a single-page web application using the **Vue.js framework**.
The app will be hosted on **GitHub Pages**, so **all data must be stored locally in the browser using JSON and LocalStorage** (no backend, no external database).

---

## User Profile & Phases

The application is built around a **two-phase fitness plan for 2026**:

### Phase 1 – Cut

* Duration: **January 1, 2026 → June 30, 2026**
* Starting weight: **100 kg**
* Starting body fat: **~30%**
* Height: **183 cm**
* Target weight: **80–82 kg**
* Target body fat: **10–12%**

### Phase 2 – Lean Bulk

* Duration: **July 1, 2026 → December 31, 2026**
* Target weight: **90–92 kg**
* Target body fat: **12–14%**

---

## Phase-Aware UI Requirements

* Automatically detect the current phase (Cut or Lean Bulk) based on date.
* Display:

  * **“Day X of Y”** for the current phase.
  * Target weight range for the phase.
* Create a **weight progress bar**:

  * Progress is calculated from phase start weight → target weight range.
* Create a **workout progress bar**:

  * Based on a configurable target number of workouts per phase.
* Progress bars should visually update as data is logged.

---

## Core Feature: Weight Tracking

* Log daily body weight.
* Store all entries in LocalStorage.
* Use weight data to update phase progress automatically.

---

## Nutrition Tracker (Diet View)

Meals per day:

* Breakfast
* Pre-workout
* Post-workout
* Dinner
* Other

For each meal entry, store:

* Item description (text)
* Calories
* Protein (grams)

Automatically calculate:

* Total daily calories
* Total daily protein

### Diet View Subviews

1. **Calories & Protein Database**

   * Show calories and protein values for each food item.
   * Data is extracted from the `Database.md` file.

2. **Meal Examples**

   * Show example meals composed of multiple food items.
   * All examples and food data come from the `Database.md` file.

---

## Workout Log

For each day, log:

* Training day type:

  * Push 1, Push 2
  * Pull 1, Pull 2
  * Leg 1, Leg 2
  * Rest
* Conditioning workout:

  * Yes / No
  * Conditioning type (text note)
* Neck workout (text field)
* Steps walked
* Hours slept

---

## Strength Tracking (Weekly)

Each week, allow logging of:

* Weight and repetitions for:

  * Deadlift
  * Back Squat
  * Pull-ups
  * Curls
  * Rows
* Weekly notes

---

## Views & Navigation Structure

### Main Views

1. **Workout View**
2. **Diet View**
3. **Statistics View**

### Workout View Subviews

* Conditioning workouts
* Main training split

### Statistics Pages

Create statistics and visualizations including (but not limited to):

* Weight change over time
* Phase progress (cut vs bulk)
* Workout consistency
* Strength progression
* Average calories and protein intake
* Sleep and steps trends

Let the AI design meaningful charts, summaries, and insights based on available data.

---

## Data Source

* The provided **database.md file** contain all reference data for:

  * Workout programming
  * Food items
  * Meal examples
* Extract, structure, and store this data in JSON format for use across the app.

---

## Technical Notes

* Use Vue components and clean state management.
* All persistence must use **LocalStorage**.
* No backend, no authentication.
* Optimize for clarity, usability, and long-term tracking across the full year of 2026.
