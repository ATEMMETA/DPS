'use client';
import { useRouter } from 'next/router';
import GPTHelper from './gpt';
import GrokHelper from './grok';
import ServeoHelper from './serveo';
import GeminiHelper from './gemini';

export default function ChatUIPage() {
  const router = useRouter();
  const { page } = router.query;

  switch (page) {
    case 'gpt':
      return <GPTHelper />;
    case 'grok':
      return <GrokHelper />;
    case 'serveo':
      return <ServeoHelper />;
    case 'gemini':
      return <GeminiHelper />;
    default:
      return <div>404 - AI Helper Not Found</div>;
  }
}'use client';
import { useRouter } from 'next/router';
import GPTHelper from './gpt';
import GrokHelper from './grok';
import ServeoHelper from './serveo';
import GeminiHelper from './gemini';

export default function ChatUIPage() {
  const router = useRouter();
  const { page } = router.query;

  switch (page) {
    case 'gpt':
      return <GPTHelper />;
    case 'grok':
      return <GrokHelper />;
    case 'serveo':
      return <ServeoHelper />;
    case 'gemini':
      return <GeminiHelper />;
    default:
      return <div>404 - AI Helper Not Found</div>;
  }
}
