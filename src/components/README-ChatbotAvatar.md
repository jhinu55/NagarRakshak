# ChatbotAvatar Component

A 3D animated React component that renders a friendly humanoid avatar for chatbot interfaces using React Three Fiber.

## Features

- **3D Animated Avatar**: Friendly cartoon-style humanoid with idle animations
- **Real-time Speaking Animation**: Mouth animates when the chatbot is speaking
- **Mood System**: Three mood states (neutral, happy, thinking) with different expressions
- **Responsive Design**: Scales automatically within flex containers
- **Modular Architecture**: Easy to replace with GLTF models
- **Performance Optimized**: Uses React Three Fiber for efficient 3D rendering

## Installation

The component requires the following dependencies:

```bash
npm install @react-three/fiber @react-three/drei three @types/three
```

## Usage

### Basic Usage

```tsx
import { ChatbotAvatar } from './components/ChatbotAvatar';

function MyComponent() {
  return (
    <ChatbotAvatar
      speaking={false}
      mood="neutral"
      size="medium"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speaking` | `boolean` | - | Whether the avatar is currently speaking (animates mouth) |
| `mood` | `'neutral' \| 'happy' \| 'thinking'` | - | Current mood affecting facial expression and head tilt |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the avatar |
| `className` | `string` | `''` | Additional CSS classes |
| `enableControls` | `boolean` | `false` | Enable orbit controls for debugging |

### Integration with Chatbot Events

#### Speaking Animation
Connect the `speaking` prop to your chatbot's speech synthesis events:

```tsx
const [isSpeaking, setIsSpeaking] = useState(false);

// When chatbot starts speaking
const handleSpeechStart = () => {
  setIsSpeaking(true);
};

// When chatbot stops speaking
const handleSpeechEnd = () => {
  setIsSpeaking(false);
};

<ChatbotAvatar speaking={isSpeaking} />
```

#### Mood Updates
Update the mood based on conversation context:

```tsx
const [mood, setMood] = useState('neutral');

// Update mood based on conversation
const updateMood = (conversationContext) => {
  if (conversationContext.isPositive) {
    setMood('happy');
  } else if (conversationContext.isProcessing) {
    setMood('thinking');
  } else {
    setMood('neutral');
  }
};
```

### Responsive Sizing

The component automatically scales within flex containers:

```tsx
<div className="flex h-96 w-full">
  <ChatbotAvatar size="medium" />
</div>
```

## Architecture

### AvatarModel Component

The `AvatarModel` component contains the 3D geometry and animations. It's designed to be easily replaceable with GLTF models:

```tsx
// Current implementation uses basic geometries
<AvatarModel speaking={speaking} mood={mood} scale={scale} />

// To replace with GLTF model:
// 1. Import useGLTF from @react-three/drei
// 2. Replace geometry with <primitive object={gltf.scene} />
// 3. Apply same animations and materials
```

### Animations

- **Idle Breathing**: Subtle body scale animation
- **Blinking**: Random eye scale animation
- **Speaking**: Mouth scale animation when `speaking` is true
- **Mood Expressions**: Head tilt and eye shape changes based on mood

## Styling

The component uses a gradient background and can be styled with additional CSS classes:

```tsx
<ChatbotAvatar 
  className="my-custom-class"
  size="large"
/>
```

## Demo

Visit `/chatbot-demo` to see the component in action with interactive controls.

## Performance Considerations

- Uses `Suspense` for lazy loading
- Optimized with `useMemo` for expensive calculations
- Efficient animation loops with `useFrame`
- Responsive scaling prevents unnecessary re-renders

## Future Enhancements

- GLTF model support for more detailed avatars
- Additional mood states
- Gesture animations
- Voice-sync mouth movements
- Customizable colors and themes
