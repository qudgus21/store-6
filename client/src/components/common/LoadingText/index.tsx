import { FC, useEffect, useState } from 'react';
import { getRandomIndex } from '~/utils/getRandomIndex';

import { LoadingTextWrapper, Text, TextArea } from './index.style';
import { PHRASES } from './phrases';

const LoadingText: FC<{ isFetching: boolean }> = ({ isFetching }) => {
  const [phrase, setPhrase] = useState(PHRASES[getRandomIndex(PHRASES.length)]);

  /**
   * Fetching이 끝날 경우, 다음 Fetching에 대비해 phrase를 미리 만들어 놓습니다.
   */
  useEffect(() => {
    if (!isFetching) {
      const idx = getRandomIndex(PHRASES.length);
      setPhrase(PHRASES[idx]);
    }
  }, [isFetching]);

  return (
    <LoadingTextWrapper>
      <TextArea isFetching={isFetching}>
        {phrase.map((ph) => (
          <Text key={ph}>{ph}</Text>
        ))}
      </TextArea>
    </LoadingTextWrapper>
  );
};

export default LoadingText;