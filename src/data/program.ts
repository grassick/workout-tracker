export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  imageUrl?: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'cardio';
};

export type WorkoutDay = {
  id: string;
  title: string;
  focus: string;
  exercises: Exercise[];
};

export const PROGRAM: WorkoutDay[] = [
  {
    id: 'day-1',
    title: 'Day 1 – Upper A',
    focus: 'Horizontal Push/Pull',
    exercises: [
      {
        id: 'db-bench',
        name: 'DB Bench Press',
        sets: 3,
        reps: '10-12',
        notes: '35-40lb start. Keep elbows at 45 degrees.',
        category: 'push',
      },
      {
        id: 'chest-supported-row',
        name: 'Chest-Supported Row',
        sets: 3,
        reps: '10-12',
        notes: 'Stretch chest between sets. Focus on squeezing shoulder blades.',
        category: 'pull',
      },
      {
        id: 'cable-fly',
        name: 'Cable Fly or Pec Deck',
        sets: 3,
        reps: '12-15',
        notes: 'Stretch emphasis at bottom. Keep slight bend in elbows.',
        category: 'push',
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row',
        sets: 3,
        reps: '10-12',
        notes: 'Keep torso upright, drive elbows back.',
        category: 'pull',
      },
      {
        id: 'tricep-pushdown',
        name: 'Tricep Pushdown',
        sets: 3,
        reps: '12-15',
        notes: 'Keep elbows pinned to sides.',
        category: 'push',
      },
      {
        id: 'barbell-curl',
        name: 'Barbell Curl',
        sets: 2,
        reps: '12-15',
        notes: 'Control the eccentric (lowering) phase.',
        category: 'pull',
      },
      {
        id: 'cardio-stair',
        name: 'Cardio: Stair Master',
        sets: 1,
        reps: '8-10 min',
        notes: '30s hard / 30s recover. Flat foot contact to protect plantar plate.',
        category: 'cardio',
      },
    ],
  },
  {
    id: 'day-2',
    title: 'Day 2 – Lower A',
    focus: 'Legs (Quad/Hamstring)',
    exercises: [
      {
        id: 'leg-press',
        name: 'Leg Press',
        sets: 2,
        reps: '10-12',
        notes: 'High foot placement for glutes/hams. Controlled. Hamstring stretch between sets.',
        category: 'legs',
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        sets: 3,
        reps: '15',
        notes: 'Light weight, slow eccentric. Protect knees.',
        category: 'legs',
      },
      {
        id: 'lying-leg-curl',
        name: 'Lying Leg Curl',
        sets: 3,
        reps: '12-15',
        notes: 'Hamstring stretch between sets. Keep hips down.',
        category: 'legs',
      },
      {
        id: 'seated-calf-raise',
        name: 'Seated Calf Raise',
        sets: 3,
        reps: '15',
        notes: 'Calf stretch between sets. Full range of motion.',
        category: 'legs',
      },
      {
        id: 'hip-adductor',
        name: 'Hip Adductor',
        sets: 2,
        reps: '15',
        notes: 'Inner thigh machine. Control the weight.',
        category: 'legs',
      },
      {
        id: 'cardio-rowing',
        name: 'Cardio: Rowing Intervals',
        sets: 1,
        reps: '8-10 min',
        notes: '30s hard / 30s recover. Watch back posture.',
        category: 'cardio',
      },
    ],
  },
  {
    id: 'day-3',
    title: 'Day 3 – Upper B',
    focus: 'Vertical Push/Pull',
    exercises: [
      {
        id: 'shoulder-press',
        name: 'Shoulder Press Machine',
        sets: 3,
        reps: '10-12',
        notes: 'Front-to-overhead version. Keep core tight.',
        category: 'push',
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        sets: 3,
        reps: '10-12',
        notes: '120-130lb target. Pull to upper chest.',
        category: 'pull',
      },
      {
        id: 'lateral-raise',
        name: 'Lateral Raise',
        sets: 3,
        reps: '12-15',
        notes: 'DB or Cable. Lead with elbows.',
        category: 'push',
      },
      {
        id: 'face-pull',
        name: 'Cable Face Pull',
        sets: 3,
        reps: '15',
        notes: 'Squeeze at contraction – CRITICAL for posture work.',
        category: 'pull',
      },
      {
        id: 'overhead-tricep',
        name: 'Overhead Tricep Extension',
        sets: 3,
        reps: '12-15',
        notes: 'Cable or DB. Stretch triceps at bottom.',
        category: 'push',
      },
      {
        id: 'hammer-curl',
        name: 'Hammer Curl',
        sets: 2,
        reps: '12-15',
        notes: 'Neutral grip. Good for forearms.',
        category: 'pull',
      },
      {
        id: 'cardio-bike',
        name: 'Cardio: Bike/Stair Master',
        sets: 1,
        reps: '8-10 min',
        notes: '30s hard / 30s recover.',
        category: 'cardio',
      },
    ],
  },
  {
    id: 'day-4',
    title: 'Day 4 – Lower B',
    focus: 'Legs (Squat/Hinge)',
    exercises: [
      {
        id: 'hack-squat',
        name: 'Hack Squat or Belt Squat',
        sets: 2,
        reps: '10-12',
        notes: 'Rotate based on knee feel. If knees flare, swap for Leg Curl volume. Hamstring stretch between sets.',
        category: 'legs',
      },
      {
        id: 'rdl',
        name: 'Dumbbell RDL',
        sets: 3,
        reps: '10-12',
        notes: 'Romanian Deadlifts. Hinge at hips, slight knee bend. Protect back.',
        category: 'legs',
      },
      {
        id: 'seated-leg-curl',
        name: 'Seated Leg Curl',
        sets: 3,
        reps: '12-15',
        notes: 'Hamstring stretch between sets.',
        category: 'legs',
      },
      {
        id: 'standing-calf-raise',
        name: 'Standing Calf Raise',
        sets: 3,
        reps: '12-15',
        notes: 'Calf stretch between sets.',
        category: 'legs',
      },
      {
        id: 'hip-abductor',
        name: 'Hip Abductor',
        sets: 2,
        reps: '15',
        notes: 'Outer thigh machine.',
        category: 'legs',
      },
      {
        id: 'cardio-stair-2',
        name: 'Cardio: Stair Master',
        sets: 1,
        reps: '8-10 min',
        notes: '30s hard / 30s recover.',
        category: 'cardio',
      },
    ],
  },
];

export const STRETCHES = [
  { name: 'Hamstring (foot on bench)', when: 'Hack squat & leg curl rest', duration: '30-45s/side' },
  { name: 'Calf (wall stretch)', when: 'Calf raise rest', duration: '30s/side' },
  { name: 'Chest (doorway/cable)', when: 'Row rest periods', duration: '30s/side' },
];
