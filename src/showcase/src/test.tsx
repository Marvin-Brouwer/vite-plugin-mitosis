import MyBasicComponent from './test-inner';

export default function MyBasicComponentWrapper() {

  return (
    <div>
      <MyBasicComponent message='hi' />
    </div>
  );
}