import { FC } from 'react';

export type CounterProps = {
  /** カウント */
  count: number;
  /**
   * カウントが変わった時
   * @param newCount - 新しいカウント
   */
  onChangeCount: (newCount: number) => void;
};

export const Counter: FC<CounterProps> = ({ count, onChangeCount }) => {
  return (
    <div style={{ display: 'flex', fontSize: '18px' }}>
      <button
        onClick={() => {
          onChangeCount(count - 1);
        }}
      >
        -
      </button>
      <span style={{ padding: '0 5px' }}>{count}</span>
      <button
        onClick={() => {
          onChangeCount(count + 1);
        }}
      >
        +
      </button>
    </div>
  );
};
