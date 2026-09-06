import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

import styles from './styles.module.css';

/**
 * Floating "AI Documentation Assistant" button, mounted globally via
 * src/theme/Root.js so it's present on every page (doc pages, homepage,
 * search, etc.) -- not just the ones with a DocBreadcrumbs/MarkdownButton.
 *
 * No LLM backend of our own: this reuses the same mechanism as
 * MarkdownButton's "Open in ChatGPT/Claude/Perplexity" -- hand the
 * question plus the current page's URL to the reader's assistant of
 * choice via its own chat-with-query-param entry point. A real
 * integrated chat (answering from our own docs corpus) would need an
 * actual LLM API + backend, a materially bigger scope than this.
 */
const EXAMPLE_PROMPTS = [
  'Summarize this page',
  'How do I get started with this?',
  'Show me a code example from this page',
];

type Assistant = 'chatgpt' | 'claude' | 'perplexity';

const ASSISTANT_LABELS: Record<Assistant, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  perplexity: 'Perplexity',
};

function buildAssistantUrl(assistant: Assistant, prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  switch (assistant) {
    case 'chatgpt':
      return `https://chat.openai.com/?q=${encoded}`;
    case 'claude':
      return `https://claude.ai/new?q=${encoded}`;
    case 'perplexity':
      return `https://www.perplexity.ai/?q=${encoded}`;
  }
}

function AssistantIcon(): ReactNode {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74L12 2z" />
      <path d="M19 15l.7 2.1 2.1.7-2.1.7L19 20.5l-.7-2.1-2.1-.7 2.1-.7L19 15z" />
    </svg>
  );
}

function CloseIcon(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Small "choose an assistant" row shown once a prompt (example or custom) is picked. */
function AssistantChooser({ prompt, onDone }: { prompt: string; onDone: () => void }): ReactNode {
  return (
    <div className={styles.chooser}>
      <p className={styles.chooserLabel}>Open with:</p>
      <div className={styles.chooserButtons}>
        {(Object.keys(ASSISTANT_LABELS) as Assistant[]).map((assistant) => (
          <button
            key={assistant}
            type="button"
            className={styles.chooserButton}
            onClick={() => {
              window.open(buildAssistantUrl(assistant, prompt), '_blank');
              onDone();
            }}>
            {ASSISTANT_LABELS[assistant]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AiAssistantPanel(): ReactNode {
  const [open, setOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPendingPrompt(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  function withPageUrl(question: string): string {
    return `${question} -- for this page: ${window.location.href}`;
  }

  function reset() {
    setOpen(false);
    setPendingPrompt(null);
    setCustomQuestion('');
  }

  return (
    <div ref={ref} className={styles.wrapper}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>AI Documentation Assistant</span>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close"
              onClick={reset}>
              <CloseIcon />
            </button>
          </div>

          {pendingPrompt ? (
            <AssistantChooser prompt={pendingPrompt} onDone={reset} />
          ) : (
            <>
              <p className={styles.panelHint}>Ask a question about this page, or try:</p>
              <div className={styles.examples}>
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className={styles.exampleButton}
                    onClick={() => setPendingPrompt(withPageUrl(prompt))}>
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                className={styles.customForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customQuestion.trim()) {
                    setPendingPrompt(withPageUrl(customQuestion.trim()));
                  }
                }}>
                <input
                  type="text"
                  className={styles.customInput}
                  placeholder="Ask your own question..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                />
                <button type="submit" className={styles.customSubmit} disabled={!customQuestion.trim()}>
                  Ask
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        aria-label="AI Documentation Assistant"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}>
        <AssistantIcon />
      </button>
    </div>
  );
}
