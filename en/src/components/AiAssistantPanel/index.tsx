import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

import styles from './styles.module.css';

/**
 * Floating "AI Documentation Assistant" button. Mounted globally, via
 * src/components/FloatingActions (itself mounted in src/theme/Root.js)
 * alongside ReportIssueButton, so it's present on every page (doc
 * pages, homepage, search, etc.) -- not just the ones with a
 * DocBreadcrumbs/MarkdownButton. Its own fixed positioning/sizing
 * lives on FloatingActions's shared wrapper now, not here -- see that
 * component for why.
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

/** A bot/agent head -- antenna, rounded head, side "ears", two eyes --
 * reads as "chat agent" specifically (not just generic chat/messaging,
 * which a plain speech bubble could equally mean for a human-to-human
 * chat feature). */
function AssistantIcon(): ReactNode {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v3" />
      <circle cx="12" cy="1.6" r="0.9" fill="currentColor" stroke="none" />
      <rect x="4" y="8" width="16" height="12" rx="4" />
      <path d="M2 13h2M20 13h2" />
      <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none" />
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
