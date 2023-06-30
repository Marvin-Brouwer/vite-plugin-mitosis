import React, { useStore } from '@builder.io/mitosis';

type Props = {
  message?: string;
};

export default function MyBasicComponent({ message }: Props) {
  const state = useStore({
    name: 'Foo',
  });

  return (
    <div>
      {message || 'Hello'} {state.name}! I can run in React, Vue, Solid or Svelte!
    </div>
  );
}