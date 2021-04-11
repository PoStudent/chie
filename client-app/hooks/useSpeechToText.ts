import { useQuery, UseQueryResult } from 'react-query';
import speechsdk, { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { getSpeechToken } from '../services/agent';

const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
  localStorage.getItem('speechToken') ?? '',
  localStorage.getItem('speechRegion') ?? '',
);
speechConfig.speechRecognitionLanguage = 'ja-JP';

const fetchTextFromMic = async (setDisplayText: (params: string) => void) => {
  const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
  setDisplayText('Speak into your microphone...');

  recognizer.recognizeOnceAsync((result) => {
    let displayText;
    if (result.reason === ResultReason.RecognizedSpeech) {
      displayText = `RECOGNIZED: Text=${result.text}`;
    } else {
      displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
    }

    setDisplayText(displayText);
  });
};

const fetchTextFromFile = async (setDisplayText: (params: string) => void, audioFile: File) => {
  const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync((result) => {
    let displayText;
    if (result.reason === ResultReason.RecognizedSpeech) {
      displayText = `RECOGNIZED: Text=${result.text}`;
    } else {
      displayText = 'ERROR: Speech was cancelled or could not be recognized.';
    }

    setDisplayText(displayText);
  });
};

const useSpeechToText = (
  setDisplayText: (params: string) => void,
  audioFile?: File,
): UseQueryResult<string[], Error> => useQuery('speechToText',
  () => {
    if (audioFile) return fetchTextFromFile(setDisplayText, audioFile);
    return fetchTextFromMic(setDisplayText);
  },
  {
    onError: getSpeechToken,
    enabled: false,
  });

export default useSpeechToText;
